"use client";

import { useRouter } from "next/navigation";

export default function ReviewSummary({ correct, total, xp }) {
  const router = useRouter();

  return (
    <section className="cosmic-review-summary" style={{ padding: 28, border: "1px solid rgba(159,242,202,.3)", borderRadius: 24, color: "#effaff", background: "linear-gradient(145deg,rgba(34,113,91,.45),rgba(16,28,69,.86))", textAlign: "center" }}>
      <p className="cosmic-review-label" style={{ margin: 0, color: "#9ff2ca", fontWeight: 900, letterSpacing: ".12em" }}>REVIEW COMPLETE</p>
      <h2 style={{ margin: "9px 0" }}>{correct} of {total} strengthened</h2>
      <p style={{ color: "#c8d9ed" }}>+{xp} review XP has been sent through your existing progress system.</p>
      <button type="button" onClick={() => router.push("/cosmic/path")} className="cosmic-button" style={{ border: 0, borderRadius: 13, padding: "12px 16px", cursor: "pointer", color: "#0b2023", background: "#9ff2ca", fontWeight: 900 }}>Return to learning path</button>
    </section>
  );
}
