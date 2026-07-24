"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getAudioUrl, reciters } from "../lib/audio";
import { markAyahListened, markSurahCompleted, updateUser } from "../lib/user";

const speeds = [0.75, 1, 1.25, 1.5];

function wordAudioUrl(word) {
  if (!word.audioUrl) return null;
  return word.audioUrl.startsWith("http") ? word.audioUrl : `https://audio.qurancdn.com/${word.audioUrl}`;
}

function speakWithDevice(word) {
  if (typeof window === "undefined" || !("speechSynthesis" in window) || !word?.text) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(word.text);
  utterance.lang = "ar-SA";
  utterance.rate = 0.72;
  window.speechSynthesis.speak(utterance);
}

export default function SurahReader({ ayahs }) {
  const audioRef = useRef(null);
  const wordAudioRef = useRef(null);
  const [ayahIndex, setAyahIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [loop, setLoop] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [reciter, setReciter] = useState("alafasy");
  const [activeWord, setActiveWord] = useState(-1);
  const [hoveredWord, setHoveredWord] = useState(null);
  const [selectedWord, setSelectedWord] = useState(null);
  const [wordTimings, setWordTimings] = useState({});
  const [audioError, setAudioError] = useState("");
  const [listenedThisView, setListenedThisView] = useState([]);
  const ayah = ayahs[ayahIndex];
  const words = useMemo(() => ayah?.words?.filter((word) => word.type !== "end") || [], [ayah]);
  const chapterId = ayahs[0]?.id?.split("-")[0];
  const detailWord = hoveredWord || selectedWord;

  useEffect(() => {
    if (!chapterId || reciter !== "alafasy") { setWordTimings({}); return; }
    let cancelled = false;
    fetch(`https://api.quran.com/api/v4/chapter_recitations/7/${chapterId}?segments=true`)
      .then((response) => response.ok ? response.json() : null)
      .then((payload) => {
        const timestamps = payload?.audio_file?.timestamps || [];
        if (!cancelled && timestamps.length) setWordTimings(Object.fromEntries(timestamps.map((item) => [item.verse_key, { from: item.timestamp_from, segments: item.segments || [] }])));
      })
      .catch(() => undefined);
    return () => { cancelled = true; };
  }, [chapterId, reciter]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = speed;
    audio.loop = loop;
  }, [speed, loop, ayahIndex, reciter]);

  useEffect(() => {
    setActiveWord(-1);
    setHoveredWord(null);
    setSelectedWord(null);
    if (autoPlay) audioRef.current?.play().catch(() => setPlaying(false));
  }, [ayahIndex, reciter, autoPlay]);

  async function togglePlayback() {
    const audio = audioRef.current;
    if (audio.paused) {
      try { await audio.play(); setAudioError(""); } catch { setPlaying(false); setAudioError("This reciter's audio could not be played. Please choose another reciter or try again."); }
    }
    else audio.pause();
  }

  function move(direction) {
    setAyahIndex((index) => Math.max(0, Math.min(index + direction, ayahs.length - 1)));
  }

  function updateHighlight() {
    const audio = audioRef.current;
    if (!audio || !audio.duration || !words.length) return;
    const timing = wordTimings[`${chapterId}:${ayah.number}`];
    if (timing?.segments.length) {
      const relativeTime = audio.currentTime * 1000 + timing.from;
      const position = timing.segments.find(([_, start, end]) => relativeTime >= start && relativeTime <= end)?.[0];
      if (position !== undefined) { setActiveWord(words.findIndex((word) => word.position === position)); return; }
    }
    setActiveWord(Math.min(words.length - 1, Math.floor((audio.currentTime / audio.duration) * words.length)));
  }

  function handleEnd() {
    if (!loop && autoPlay && ayahIndex < ayahs.length - 1) setAyahIndex((index) => index + 1);
    else {
      if (ayahIndex === ayahs.length - 1 && chapterId) markSurahCompleted(chapterId);
      setPlaying(false);
    }
  }

  function handlePlay() {
    setPlaying(true);
    updateUser({ lastSurahId: Number(chapterId || 1), preferredReciter: reciter });
    if (!listenedThisView.includes(ayah.id)) {
      markAyahListened(ayah.id);
      setListenedThisView((items) => [...items, ayah.id]);
    }
  }

  function inspectWord(word) {
    setSelectedWord(word);
    if (playing) audioRef.current?.pause();
    const url = wordAudioUrl(word);
    if (!url) { speakWithDevice(word); return; }
    wordAudioRef.current?.pause();
    const audio = new Audio(url);
    wordAudioRef.current = audio;
    audio.play().catch(() => speakWithDevice(word));
  }

  if (!ayah) return null;

  return <section className="surah-reader"><audio key={`${ayah.id}-${reciter}`} ref={audioRef} src={getAudioUrl(reciter, ayah.globalNumber)} onEnded={handleEnd} onError={() => setPlaying(false)} onPause={() => setPlaying(false)} onPlay={handlePlay} onTimeUpdate={updateHighlight} /><div className="reader-toolbar"><button className="icon-button" disabled={ayahIndex === 0} onClick={() => move(-1)} type="button">Previous</button><button className="reader-play" onClick={togglePlayback} type="button">{playing ? "Pause" : "Play"}</button><button className="icon-button" disabled={ayahIndex === ayahs.length - 1} onClick={() => move(1)} type="button">Next</button><button className="toggle" onClick={() => setSpeed(speeds[(speeds.indexOf(speed) + 1) % speeds.length])} type="button">{speed}x</button><button className={`toggle ${loop ? "active" : ""}`} onClick={() => setLoop((value) => !value)} type="button">Loop ayah</button><button className={`toggle ${autoPlay ? "active" : ""}`} onClick={() => setAutoPlay((value) => !value)} type="button">Autoplay</button><label className="reciter-select">Reciter<select value={reciter} onChange={(event) => { setAudioError(""); setReciter(event.target.value); updateUser({ preferredReciter: event.target.value }); }}>{Object.entries(reciters).map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select></label><span className="reader-progress">Ayah {ayah.number} of {ayahs.length}</span></div>{audioError && <p className="audio-error" role="alert">{audioError}</p>}<article className="reader-ayah"><p className="word-by-word arabic" lang="ar" dir="rtl">{words.map((word, index) => <button aria-pressed={selectedWord?.position === word.position} className={`quran-word ${activeWord === index ? "reading" : ""} ${selectedWord?.position === word.position ? "selected" : ""}`} key={`${word.position}-${word.text}`} onClick={() => inspectWord(word)} onFocus={() => setHoveredWord(word)} onMouseEnter={() => setHoveredWord(word)} onMouseLeave={() => setHoveredWord(null)} type="button"><span className="quran-word-text">{word.text}</span><span className="quran-word-tooltip" aria-hidden="true"><strong>{word.meaning || "Meaning unavailable"}</strong>{word.transliteration ? <small>{word.transliteration}</small> : null}</span></button>)}</p><div className={`word-detail ${detailWord ? "visible" : ""}`} aria-live="polite">{detailWord ? <><span className="word-detail-arabic">{detailWord.text}</span><div><strong>{detailWord.meaning || "Meaning unavailable"}</strong>{detailWord.transliteration && <span className="word-transliteration">{detailWord.transliteration}</span>}</div></> : <span>Hover or select a word to see its meaning.</span>}</div><p className="word-help">Hover or focus a word for its meaning. Click it to hear that word on its own and keep the meaning open.</p><div className="ayah-full-translation"><strong>English translation</strong><p>{ayah.translation || "English translation is unavailable for this ayah."}</p></div></article></section>;
}
