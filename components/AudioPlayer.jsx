"use client";

import { useEffect, useRef, useState } from "react";
import { getAudioUrl, reciters } from "../lib/audio";
import { getUser, markAyahListened, updateUser } from "../lib/user";

export default function AudioPlayer({ ayah, loopEnabled = false, slow = false }) {
  const audioRef = useRef(null);
  const [reciter, setReciter] = useState("alafasy");
  const [playing, setPlaying] = useState(false);
  const [loop, setLoop] = useState(loopEnabled);
  const [rewarded, setRewarded] = useState(false);

  useEffect(() => {
    setReciter(getUser().preferredReciter || "alafasy");
  }, []);

  useEffect(() => setLoop(loopEnabled), [loopEnabled]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = loop;
      audioRef.current.playbackRate = slow ? 0.75 : 1;
    }
  }, [loop, slow]);

  async function toggle() {
    const audio = audioRef.current;
    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        setPlaying(false);
      }
    } else audio.pause();
  }

  function handlePlay() {
    setPlaying(true);
    updateUser({ preferredReciter: reciter });
    if (!rewarded && ayah?.id) {
      markAyahListened(ayah.id);
      setRewarded(true);
    }
  }

  return (
    <div className="audio-player">
      <audio
        key={reciter}
        ref={audioRef}
        src={getAudioUrl(reciter, ayah.globalNumber)}
        onPlay={handlePlay}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />
      <button className="icon-button" onClick={toggle} type="button" aria-label="Play or pause ayah">{playing ? "Pause" : "Play"}</button>
      <select value={reciter} onChange={(event) => { setReciter(event.target.value); updateUser({ preferredReciter: event.target.value }); }} aria-label="Reciter">
        {Object.entries(reciters).map(([id, name]) => <option key={id} value={id}>{name}</option>)}
      </select>
      <button className={`icon-button ${loop ? "selected" : ""}`} onClick={() => setLoop(!loop)} type="button" aria-label="Loop ayah">Loop</button>
    </div>
  );
}
