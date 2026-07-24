"use client";

import MasteryRing from "./MasteryRing";

export default function CompletedUnit({ unit, onClick }) {
  return <button className="cd-path-complete" type="button" onClick={onClick} style={{ width: 230, padding: 18, border: "1px solid #9ff2ca", borderRadius: 24, cursor: "pointer", color: "#f2fff8", background: "linear-gradient(145deg,rgba(29,106,90,.83),rgba(18,38,76,.9))", boxShadow: "0 0 28px rgba(117,239,191,.42)", textAlign: "left" }}><div style={{ display: "flex", alignItems: "center", gap: 12 }}><MasteryRing percent={100} size={58} /><div><strong>{unit.name}</strong><small style={{ display: "block", marginTop: 5, color: "#bff5da" }}>Completed</small></div></div></button>;
}
