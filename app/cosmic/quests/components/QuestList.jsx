"use client";

import QuestCard from "./QuestCard";

export default function QuestList({ quests, onOpen }) {
  if (!quests.length) return <div className="cosmic-bright-card" style={{ padding: 28, borderRadius: 20, color: "#c6d6eb" }}>New missions will appear in this orbit soon.</div>;
  return <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(285px,1fr))", gap: 13 }}>{quests.map((quest) => <QuestCard key={quest.id} quest={quest} onOpen={onOpen} />)}</div>;
}
