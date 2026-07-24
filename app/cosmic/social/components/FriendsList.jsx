"use client";

import FriendCard from "./FriendCard";

export default function FriendsList({ friends, onView, onRemove }) {
  return <section className="cosmic-bright-card" style={{ padding: 16, borderRadius: 20, display: "grid", gap: 11 }}><div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}><h2 style={{ margin: 0 }}>Your orbit</h2><span style={{ color: "#ffdc8a", fontWeight: 900 }}>{friends.length} friends</span></div>{friends.length ? friends.map((friend) => <FriendCard key={friend.id} friend={friend} onView={onView} onRemove={onRemove} />) : <p style={{ margin: 0, color: "#b9cae3" }}>Your orbit is waiting for its first companion.</p>}</section>;
}
