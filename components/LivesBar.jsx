"use client";

export default function LivesBar({ lives = 3, max = 3 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }} aria-label={`${lives} quiz lives remaining`}>
      {Array.from({ length: max }).map((_, index) => (
        <span
          key={index}
          style={{
            width: 24,
            height: 24,
            display: "grid",
            placeItems: "center",
            borderRadius: "50%",
            color: index < lives ? "#062112" : "rgba(244,249,245,.45)",
            background: index < lives ? "linear-gradient(135deg,#ff7a90,#fff39c)" : "rgba(255,255,255,.08)",
            border: "1px solid rgba(255,255,255,.16)",
            fontSize: 12,
            fontWeight: 900,
          }}
        >
          {index < lives ? "L" : "-"}
        </span>
      ))}
    </div>
  );
}
