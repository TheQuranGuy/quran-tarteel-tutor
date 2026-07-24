"use client";

export default function LivesBar({ lives = 3 }) {
  return (
    <div className="cosmic-lives" aria-label={`${lives} lives left`} style={{ display: "flex", gap: 5, alignItems: "center" }}>
      {Array.from({ length: 3 }, (_, index) => <span className="cosmic-life" key={index} style={{ width: 24, height: 24, display: "grid", placeItems: "center", borderRadius: "50%", color: index < lives ? "#fff1f3" : "#8e9bb4", background: index < lives ? "#e46c83" : "rgba(255,255,255,.1)", fontSize: 11, fontWeight: 950 }}>L</span>)}
    </div>
  );
}
