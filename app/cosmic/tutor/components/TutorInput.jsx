"use client";

import { useRef, useState } from "react";

export default function TutorInput({ onSend, onAudio, disabled }) {
  const [text, setText] = useState("");
  const fileRef = useRef(null);

  function submit(event) {
    event.preventDefault();
    const value = text.trim();
    if (!value || disabled) return;
    onSend(value);
    setText("");
  }

  return (
    <form onSubmit={submit} style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        title="Attach recitation audio"
        className="cosmic-button cosmic-button--outline"
        style={{ padding: "10px 11px" }}
      >
        Mic
      </button>

      <input
        ref={fileRef}
        type="file"
        accept="audio/*"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onAudio(file);
          event.target.value = "";
        }}
        hidden
      />

      <input
        className="cosmic-tutor-input"
        value={text}
        disabled={disabled}
        onChange={(event) => setText(event.target.value)}
        placeholder="Ask anything: explain 2:255, quiz me, help me memorise Al-Ikhlas..."
        style={{
          flex: 1,
          minWidth: 0,
          padding: "11px 12px",
          borderRadius: 13,
          border: "1px solid rgba(178,210,250,.22)",
          color: "#eff8ff",
          background: "rgba(255,255,255,.05)",
          font: "inherit",
        }}
      />

      <button
        type="submit"
        disabled={disabled || !text.trim()}
        className="cosmic-button"
        style={{ padding: "10px 13px", opacity: disabled || !text.trim() ? 0.55 : 1 }}
      >
        Send
      </button>
    </form>
  );
}
