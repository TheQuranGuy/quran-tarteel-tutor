"use client";

import { useRef, useState } from "react";

export default function RecitationRecorder() {
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const [state, setState] = useState("idle");

  async function toggle() {
    if (state === "recording") { recorderRef.current?.stop(); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      recorder.onstop = () => { stream.getTracks().forEach((track) => track.stop()); setState("saved"); };
      recorder.start();
      setState("recording");
    } catch { setState("unavailable"); }
  }

  const label = state === "recording" ? "Stop and save" : state === "saved" ? "Saved locally for this session" : state === "unavailable" ? "Microphone unavailable" : "Record recitation";
  return <button type="button" className={`cosmic-recorder ${state === "recording" ? "is-recording" : ""}`} onClick={toggle} disabled={state === "saved" || state === "unavailable"} style={{ padding: "12px 15px", border: "1px solid rgba(166,209,255,.28)", borderRadius: 13, cursor: "pointer", color: "#eaf5ff", background: state === "recording" ? "#a54868" : "rgba(255,255,255,.08)", fontWeight: 850 }}>{label}</button>;
}
