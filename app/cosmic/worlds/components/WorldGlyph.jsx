export default function WorldGlyph({ kind, color = "#a7ecff" }) {
  const common = { fill: "none", stroke: color, strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };

  if (kind === "surah") return <svg aria-hidden="true" viewBox="0 0 48 48" width="42" height="42"><path {...common} d="M12 10.5c5.2-2.3 10.1-1.7 12 2.2v25.1c-1.9-3.9-6.8-4.5-12-2.2V10.5Zm24 0c-5.2-2.3-10.1-1.7-12 2.2v25.1c1.9-3.9 6.8-4.5 12-2.2V10.5Z" /><path {...common} d="M17 17.5h4m-4 5h4m6-5h4m-4 5h4" /></svg>;
  if (kind === "mastery") return <svg aria-hidden="true" viewBox="0 0 48 48"><circle {...common} cx="24" cy="24" r="14" /><path {...common} d="m18 24 4 4 8-9" /><circle cx="24" cy="24" r="20" fill="none" stroke={color} strokeOpacity=".35" strokeWidth="1" strokeDasharray="2 4" /></svg>;
  if (kind === "review") return <svg aria-hidden="true" viewBox="0 0 48 48"><path {...common} d="M12 17a12 12 0 0 1 21.6-7.2M36 31a12 12 0 0 1-21.6 7.2" /><path {...common} d="m33.6 7.5.6 5.9-5.9.6M14.4 40.5l-.6-5.9 5.9-.6" /><path {...common} d="M18 24h12" /></svg>;
  if (kind === "challenge") return <svg aria-hidden="true" viewBox="0 0 48 48"><path {...common} d="M17 10h14l-2 10.5 5.5 8.4A10 10 0 0 1 26 39H22a10 10 0 0 1-8.5-10.1l5.5-8.4L17 10Z" /><path {...common} d="M19 10h10M19 28h10M24 18v9" /></svg>;
  if (kind === "events") return <svg aria-hidden="true" viewBox="0 0 48 48"><path {...common} d="M24 7 27.3 17l10.2-.1-8.2 6.1 3.1 10-8.4-6-8.4 6 3.1-10-8.2-6.1 10.2.1L24 7Z" /><circle cx="24" cy="24" r="20" fill="none" stroke={color} strokeOpacity=".32" strokeWidth="1" /></svg>;
  return <svg aria-hidden="true" viewBox="0 0 48 48"><circle {...common} cx="17" cy="19" r="5" /><circle {...common} cx="32" cy="20" r="4" /><path {...common} d="M8.5 38c.9-6.2 4.1-9.3 8.5-9.3s7.6 3.1 8.5 9.3m-.3-1.3c.8-4.6 3.1-6.9 6.7-6.9 3.7 0 5.9 2.3 6.7 6.9" /></svg>;
}
