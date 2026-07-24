export default function WorldStatus({ label, value, progress, accent }) {
  const hasProgress = typeof progress === "number";
  return <div className="cd-world-status" style={{ display: "grid", gap: 7 }}>
    <div style={{ display: "flex", justifyContent: "space-between", gap: 14, color: "#c7d8ec", fontSize: 12, fontWeight: 800 }}><span>{label}</span><span style={{ color: accent }}>{value}</span></div>
    {hasProgress ? <div aria-label={`${label}: ${progress}%`} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} style={{ height: 7, overflow: "hidden", borderRadius: 99, background: "rgba(224,240,255,.12)" }}><div style={{ width: `${Math.max(0, Math.min(100, progress))}%`, height: "100%", borderRadius: "inherit", background: `linear-gradient(90deg,${accent},#f7dc92)`, boxShadow: `0 0 14px ${accent}` }} /></div> : null}
  </div>;
}
