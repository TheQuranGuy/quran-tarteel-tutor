"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AudioPlayer from "../AudioPlayer";
import { recordCosmicAttempt } from "../../lib/cosmic-os";

const checks = [
  ["pace", "I kept a calm, even pace."],
  ["stops", "I noticed the natural stopping points."],
  ["repeat", "I repeated the ayah after the reference recitation."],
];

function routeFor(surahId, ayahNumber) {
  return `/cosmic/recitation/${surahId}/${ayahNumber}`;
}

export default function RecitationStudio({ ayah, surah }) {
  const router = useRouter();
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const contextRef = useRef(null);
  const analyserRef = useRef(null);
  const frameRef = useRef(null);
  const objectUrlRef = useRef("");
  const [recording, setRecording] = useState(false);
  const [recordingUrl, setRecordingUrl] = useState("");
  const [recordingError, setRecordingError] = useState("");
  const [slow, setSlow] = useState(true);
  const [loop, setLoop] = useState(true);
  const [completedChecks, setCompletedChecks] = useState([]);
  const [targetSurah, setTargetSurah] = useState(String(surah.number));
  const [targetAyah, setTargetAyah] = useState(String(ayah.number));
  const [reflection, setReflection] = useState("");
  const arabicText = ayah.arabic || ayah.words?.filter((word) => word?.text && word.type !== "end" && word.char_type_name !== "end").map((word) => word.text).join(" ") || "";

  const previous = ayah.number > 1
    ? routeFor(surah.number, ayah.number - 1)
    : surah.number > 1 ? routeFor(surah.number - 1, 1) : null;
  const next = ayah.number < surah.ayahCount
    ? routeFor(surah.number, ayah.number + 1)
    : surah.number < 114 ? routeFor(surah.number + 1, 1) : null;

  useEffect(() => {
    setTargetSurah(String(surah.number));
    setTargetAyah(String(ayah.number));
    setCompletedChecks([]);
    setRecordingUrl("");
    setReflection("");
  }, [ayah.id, surah.number]);

  useEffect(() => () => {
    window.cancelAnimationFrame(frameRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    contextRef.current?.close?.();
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
  }, []);

  useEffect(() => {
    if (!recording || !analyserRef.current || !canvasRef.current) return undefined;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const analyser = analyserRef.current;
    const points = new Uint8Array(analyser.fftSize);

    function draw() {
      const width = canvas.clientWidth || 640;
      const height = canvas.clientHeight || 130;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      analyser.getByteTimeDomainData(points);
      context.clearRect(0, 0, width, height);
      const glow = context.createLinearGradient(0, 0, width, 0);
      glow.addColorStop(0, "#8ff1c7");
      glow.addColorStop(0.55, "#87edff");
      glow.addColorStop(1, "#ad9bff");
      context.lineWidth = 3;
      context.strokeStyle = glow;
      context.shadowBlur = 14;
      context.shadowColor = "#87edff";
      context.beginPath();
      points.forEach((value, index) => {
        const x = (index / (points.length - 1)) * width;
        const y = (value / 255) * height;
        if (index === 0) context.moveTo(x, y); else context.lineTo(x, y);
      });
      context.stroke();
      context.shadowBlur = 0;
      frameRef.current = window.requestAnimationFrame(draw);
    }
    draw();
    return () => window.cancelAnimationFrame(frameRef.current);
  }, [recording]);

  function stopRecording() {
    recorderRef.current?.stop();
  }

  async function startRecording() {
    setRecordingError("");
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setRecordingError("This browser does not support in-browser recording.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextConstructor) {
        stream.getTracks().forEach((track) => track.stop());
        setRecordingError("This browser cannot create a live audio visualizer.");
        return;
      }
      const audioContext = new AudioContextConstructor();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;
      audioContext.createMediaStreamSource(stream).connect(analyser);
      const chunks = [];
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (event) => {
        if (event.data.size) chunks.push(event.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
        if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = URL.createObjectURL(blob);
        setRecordingUrl(objectUrlRef.current);
        stream.getTracks().forEach((track) => track.stop());
        audioContext.close();
        setRecording(false);
      };
      streamRef.current = stream;
      recorderRef.current = recorder;
      contextRef.current = audioContext;
      analyserRef.current = analyser;
      recorder.start();
      setRecording(true);
    } catch {
      setRecordingError("Microphone permission was not granted. You can still practise with the reference audio.");
    }
  }

  function goToTarget(event) {
    event.preventDefault();
    const surahId = Math.min(114, Math.max(1, Number(targetSurah) || 1));
    const ayahNumber = Math.max(1, Number(targetAyah) || 1);
    router.push(routeFor(surahId, ayahNumber));
  }

  function toggleCheck(id) {
    setCompletedChecks((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function saveReflection(correct) {
    if (reflection) return;
    recordCosmicAttempt({ ayahId: ayah.id, correct, kind: "answer", mode: "recitation-studio" });
    setReflection(correct ? "confident" : "practice");
  }

  return <main className="cosmic-dark cd-recitation-v2" style={{ position: "relative", minHeight: "calc(100vh - 64px)", padding: "clamp(26px, 5vw, 58px) 0 90px" }}>
    <div className="cd-shell cd-page-enter" style={{ display: "grid", gap: 18 }}>
      <header style={{ display: "flex", justifyContent: "space-between", gap: 18, alignItems: "end", flexWrap: "wrap" }}>
        <div>
          <p className="cd-kicker">RECITATION STUDIO · PRIVATE BROWSER PRACTICE</p>
          <h1 className="cd-title" style={{ marginTop: 9 }}>Find your calm, one ayah at a time.</h1>
          <p className="cd-copy" style={{ maxWidth: 710, marginBottom: 0 }}>Listen, slow the reference down, record a private take, and use the live waveform as a pacing visual. This studio does not claim to detect tajweed mistakes or score pronunciation—use a qualified teacher for formal correction.</p>
        </div>
        <Link className="cd-button cd-button--quiet" href={`/cosmic/lessons/${surah.number}/${ayah.number}`}>Open lesson</Link>
      </header>

      <section className="cd-surface cd-recitation-top" style={{ padding: "clamp(18px, 4vw, 34px)", display: "grid", gridTemplateColumns: "minmax(0, 1.45fr) minmax(280px, .75fr)", gap: 18 }}>
        <div style={{ display: "grid", gap: 16, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span className="cd-chip">Surah {surah.number} · {surah.name}</span>
            <span className="cd-chip">Ayah {ayah.number} / {surah.ayahCount}</span>
          </div>
          <div className="cd-surface cd-surface--soft" style={{ padding: "clamp(17px, 3.5vw, 30px)" }}>
            <p dir="rtl" lang="ar" style={{ margin: 0, color: "#fff", fontFamily: "serif", fontSize: "clamp(2rem, 5.7vw, 4.3rem)", lineHeight: 1.8, textAlign: "right" }}>{arabicText || "Arabic text is unavailable for this ayah."}</p>
            <p className="cd-copy" style={{ margin: "13px 0 0", fontSize: "1.02rem" }}>{ayah.translation}</p>
          </div>
          <div style={{ display: "flex", gap: 9, flexWrap: "wrap", alignItems: "center" }}>
            <AudioPlayer ayah={ayah} loopEnabled={loop} slow={slow} />
            <button type="button" className={`cd-button ${slow ? "" : "cd-button--quiet"}`} onClick={() => setSlow((value) => !value)}>{slow ? "Slow reference · on" : "Slow reference · off"}</button>
            <button type="button" className={`cd-button ${loop ? "" : "cd-button--quiet"}`} onClick={() => setLoop((value) => !value)}>{loop ? "Loop ayah · on" : "Loop ayah · off"}</button>
          </div>
          <nav aria-label="Move between ayahs" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {previous ? <Link className="cd-button cd-button--quiet" href={previous}>← Previous ayah</Link> : <span className="cd-chip">Beginning of the Qur&apos;an</span>}
            {next ? <Link className="cd-button cd-button--quiet" href={next}>Next ayah →</Link> : null}
          </nav>
        </div>

        <aside className="cd-surface cd-surface--soft" style={{ padding: 18, display: "grid", alignContent: "start", gap: 14 }}>
          <div>
            <p className="cd-kicker">PRACTICE TARGET</p>
            <h2 style={{ margin: "7px 0 0", fontSize: "1.4rem", letterSpacing: "-.04em" }}>Jump to any ayah</h2>
          </div>
          <form onSubmit={goToTarget} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 8 }}>
            <label style={{ display: "grid", gap: 5, color: "#b9c9e6", fontSize: 12, fontWeight: 800 }}>Surah<input value={targetSurah} onChange={(event) => setTargetSurah(event.target.value)} min="1" max="114" inputMode="numeric" type="number" style={{ width: "100%", border: "1px solid rgba(190,219,255,.2)", borderRadius: 10, padding: "9px", color: "#eff8ff", background: "rgba(0,0,0,.18)", font: "inherit" }} /></label>
            <label style={{ display: "grid", gap: 5, color: "#b9c9e6", fontSize: 12, fontWeight: 800 }}>Ayah<input value={targetAyah} onChange={(event) => setTargetAyah(event.target.value)} min="1" inputMode="numeric" type="number" style={{ width: "100%", border: "1px solid rgba(190,219,255,.2)", borderRadius: 10, padding: "9px", color: "#eff8ff", background: "rgba(0,0,0,.18)", font: "inherit" }} /></label>
            <button className="cd-button" type="submit" style={{ alignSelf: "end", minHeight: 38, padding: "8px 10px" }}>Go</button>
          </form>
          <p className="cd-copy" style={{ margin: 0, fontSize: 12 }}>The ayah page fetches the project&apos;s existing Qur&apos;an data. If an invalid ayah is requested, the studio keeps you on a valid reference.</p>
        </aside>
      </section>

      <section className="cd-surface cd-recitation-studio" style={{ padding: "clamp(18px, 3.2vw, 30px)", display: "grid", gridTemplateColumns: "minmax(0, 1.25fr) minmax(260px, .75fr)", gap: 18 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <div><p className="cd-kicker">LIVE WAVEFORM</p><h2 style={{ margin: "7px 0 0", fontSize: "1.45rem", letterSpacing: "-.04em" }}>{recording ? "Recording your private practice" : recordingUrl ? "Your most recent local take" : "Ready when you are"}</h2></div>
            <button type="button" className={`cd-button ${recording ? "cd-button--gold" : ""}`} onClick={recording ? stopRecording : startRecording}>{recording ? "Stop recording" : "Start private recording"}</button>
          </div>
          <div style={{ position: "relative", overflow: "hidden", minHeight: 146, marginTop: 16, border: "1px solid rgba(141, 225, 255, .16)", borderRadius: 18, background: "radial-gradient(circle at 60% 50%, rgba(83,155,255,.15), transparent 42%), rgba(0,0,0,.16)" }}>
            <canvas ref={canvasRef} aria-label="Live microphone waveform" style={{ display: "block", width: "100%", height: 146, opacity: recording ? 1 : .35 }} />
            {!recording ? <p style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", margin: 0, color: "#b9c9e6", fontSize: 13, fontWeight: 800 }}>{recordingUrl ? "Play your take below, then reflect on the checklist." : "Your real microphone waveform appears here while recording."}</p> : null}
          </div>
          {recordingError ? <p role="status" style={{ color: "#ffd195", fontWeight: 800 }}>{recordingError}</p> : null}
          {recordingUrl ? <audio controls src={recordingUrl} style={{ width: "100%", marginTop: 14 }} /> : null}
        </div>

        <aside className="cd-surface cd-surface--soft" style={{ padding: 18, display: "grid", gap: 12, alignContent: "start" }}>
          <div><p className="cd-kicker">SELF-GUIDED CHECK</p><h2 style={{ margin: "7px 0 0", fontSize: "1.45rem", letterSpacing: "-.04em" }}>Listen back with intention.</h2></div>
          {checks.map(([id, label]) => <label key={id} style={{ display: "flex", alignItems: "start", gap: 9, padding: 11, border: "1px solid rgba(190,219,255,.12)", borderRadius: 13, color: "#dbeaff", cursor: "pointer", fontSize: 13, lineHeight: 1.4, background: completedChecks.includes(id) ? "rgba(143,241,199,.1)" : "rgba(255,255,255,.025)" }}><input checked={completedChecks.includes(id)} onChange={() => toggleCheck(id)} type="checkbox" style={{ accentColor: "#8ff1c7", marginTop: 2 }} />{label}</label>)}
          <div className="cd-progress" aria-label={`${completedChecks.length} of ${checks.length} reflection checks complete`}><i style={{ "--progress": `${(completedChecks.length / checks.length) * 100}%` }} /></div>
          <div style={{ paddingTop: 3, borderTop: "1px solid rgba(190,219,255,.12)" }}><p style={{ margin: "10px 0 8px", color: "#dbeaff", fontSize: 12, fontWeight: 900 }}>Could you recite it from memory?</p><div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}><button type="button" disabled={Boolean(reflection)} className={`cd-button ${reflection === "confident" ? "" : "cd-button--quiet"}`} onClick={() => saveReflection(true)} style={{ minHeight: 34, padding: "7px 10px", fontSize: 12, opacity: reflection && reflection !== "confident" ? .5 : 1 }}>Yes, mostly</button><button type="button" disabled={Boolean(reflection)} className={`cd-button ${reflection === "practice" ? "cd-button--gold" : "cd-button--quiet"}`} onClick={() => saveReflection(false)} style={{ minHeight: 34, padding: "7px 10px", fontSize: 12, opacity: reflection && reflection !== "practice" ? .5 : 1 }}>Not yet</button></div></div>
          <p className="cd-copy" style={{ margin: 0, fontSize: 12 }}>{reflection === "confident" ? "Saved as your own confidence check. The Learning OS can now give this ayah a little more space before the next review." : reflection === "practice" ? "Saved as a gentle review signal. The Learning OS can suggest a shorter revisit—this is not a tajweed score." : completedChecks.length === checks.length ? "Reflection complete. Keep this as a gentle signal of your own practice, not a formal assessment." : "A trained teacher can help you identify tajweed and pronunciation details that a local browser visualizer cannot."}</p>
        </aside>
      </section>
    </div><style jsx global>{`
      .cd-recitation-v2{isolation:isolate;background:radial-gradient(circle at 50% -10%,rgba(118,103,251,.31),transparent 31%),radial-gradient(circle at 1% 58%,rgba(41,218,227,.13),transparent 34%),#07091a!important}.cd-recitation-v2:before{content:"";position:absolute;inset:0;z-index:0;pointer-events:none;background:linear-gradient(115deg,rgba(255,255,255,.025),transparent 32%,rgba(145,111,255,.07) 72%,transparent)}.cd-recitation-v2 .cd-shell{position:relative;z-index:1}.cd-recitation-v2 .cd-title{max-width:720px;font-size:clamp(2.35rem,5.7vw,4.65rem)!important;line-height:.94!important}.cd-recitation-v2 .cd-copy{color:#b9cae5!important}.cd-recitation-v2 .cd-kicker{color:#93f0d0!important}.cd-recitation-v2 .cd-button{border-radius:13px!important;min-height:40px!important;font-weight:900!important;font-size:12px!important;transition:transform .18s cubic-bezier(.16,1,.3,1),filter .18s ease,box-shadow .18s ease}.cd-recitation-v2 .cd-button:hover{transform:translateY(-2px);filter:brightness(1.06);box-shadow:0 14px 30px rgba(119,189,255,.22)}.cd-recitation-v2 .cd-recitation-top,.cd-recitation-v2 .cd-recitation-studio{border:1px solid rgba(215,230,255,.23)!important;border-radius:28px!important;background:linear-gradient(145deg,rgba(255,255,255,.13),rgba(85,91,177,.075))!important;box-shadow:0 26px 62px rgba(0,0,0,.25),inset 0 1px rgba(255,255,255,.14)!important}.cd-recitation-v2 .cd-recitation-top>.cd-surface,.cd-recitation-v2 .cd-recitation-studio>.cd-surface{border:1px solid rgba(221,232,255,.16)!important;border-radius:20px!important;background:linear-gradient(145deg,rgba(13,20,57,.66),rgba(20,27,70,.49))!important;box-shadow:inset 0 1px rgba(255,255,255,.08)}.cd-recitation-v2 .cd-recitation-top .cd-surface--soft{position:relative;overflow:hidden}.cd-recitation-v2 .cd-recitation-top .cd-surface--soft:before{content:"";position:absolute;inset:auto -12% -130%;height:170%;border-radius:50%;background:radial-gradient(ellipse,rgba(128,232,219,.13),transparent 67%);pointer-events:none}.cd-recitation-v2 .cd-recitation-top .cd-surface--soft>*{position:relative}.cd-recitation-v2 .cd-chip{border:1px solid rgba(216,229,255,.22)!important;border-radius:999px!important;background:rgba(255,255,255,.08)!important;color:#c5d6ec!important;font-size:11px!important}.cd-recitation-v2 [dir="rtl"]{text-shadow:0 0 28px rgba(202,220,255,.12)}.cd-recitation-v2 input{outline:none;transition:border-color .18s ease,box-shadow .18s ease}.cd-recitation-v2 input:focus{border-color:#8ff1c7!important;box-shadow:0 0 0 3px rgba(143,241,199,.14)}.cd-recitation-v2 canvas{background:linear-gradient(110deg,rgba(117,140,255,.06),rgba(93,233,215,.08),rgba(185,139,255,.06))}.cd-recitation-v2 audio{filter:hue-rotate(5deg) saturate(.85)}.cd-recitation-v2 label{transition:transform .16s cubic-bezier(.16,1,.3,1),border-color .16s ease,background .16s ease}.cd-recitation-v2 label:hover{transform:translateX(3px);border-color:rgba(143,241,199,.32)!important;background:rgba(143,241,199,.07)!important}.cd-recitation-v2 .cd-progress{height:7px!important;border-radius:999px!important;background:rgba(220,234,255,.14)!important}.cd-recitation-v2 .cd-progress i{border-radius:999px!important;background:linear-gradient(90deg,#8ff1c7,#85ddff,#c9a8ff)!important;box-shadow:0 0 14px rgba(130,226,224,.56)}@media(max-width:760px){.cd-recitation-v2{padding-inline:12px!important}.cd-recitation-v2 .cd-recitation-top,.cd-recitation-v2 .cd-recitation-studio{grid-template-columns:1fr!important}.cd-recitation-v2 .cd-title{font-size:clamp(2.1rem,10vw,3.7rem)!important}.cd-recitation-v2 .cd-recitation-top form{grid-template-columns:1fr 1fr!important}.cd-recitation-v2 .cd-recitation-top form button{grid-column:span 2}.cd-recitation-v2 [dir="rtl"]{font-size:clamp(1.7rem,7vw,2.6rem)!important}.cd-recitation-v2 .cd-recitation-studio{gap:14px!important}}@media(prefers-reduced-motion:reduce){.cd-recitation-v2 .cd-button,.cd-recitation-v2 label{transition:none!important}}
    `}</style>
  </main>;
}
