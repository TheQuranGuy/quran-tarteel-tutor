"use client";

import EventProgress from "./EventProgress";
import EventReward from "./EventReward";

export default function EventQuestList({ quests, active, onClaim }) {
  return <div style={{ display: "grid", gap: 11 }}>{quests.map((quest) => <article key={quest.id} style={{ display: "grid", gap: 11, padding: 14, borderRadius: 16, border: `1px solid ${quest.claimed ? "rgba(255,221,128,.33)" : quest.complete ? "rgba(126,244,190,.38)" : "rgba(175,208,249,.16)"}`, background: "rgba(255,255,255,.045)" }}><div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "start" }}><div><strong>{quest.name}</strong><p style={{ margin: "4px 0 0", color: "#bacbe3", fontSize: 13 }}>{quest.description}</p></div><small style={{ color: quest.claimed ? "#ffdf8f" : quest.complete ? "#aaf3ca" : "#9eb4d4", fontWeight: 900 }}>{quest.claimed ? "Claimed" : quest.complete ? "Ready" : "In progress"}</small></div><EventProgress value={quest.value} target={quest.target} complete={quest.complete} /><EventReward xp={quest.xp} cosmetic={quest.cosmetic} claimed={quest.claimed} />{active && quest.complete && !quest.claimed ? <button type="button" onClick={() => onClaim(quest)} className="cosmic-button">Claim reward</button> : null}</article>)}</div>;
}
