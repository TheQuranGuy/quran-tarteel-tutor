export default function InventoryTabs({ tabs, active, onChange }) {
  return <div role="tablist" aria-label="Inventory filters" style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
    {tabs.map((tab) => <button key={tab} type="button" role="tab" aria-selected={active === tab} onClick={() => onChange(tab)} style={{ flex: "0 0 auto", border: `1px solid ${active === tab ? "rgba(166,240,210,.5)" : "rgba(178,210,248,.17)"}`, borderRadius: 999, padding: "9px 13px", color: active === tab ? "#10263b" : "#c9d9ec", background: active === tab ? "linear-gradient(135deg,#b2f6da,#9be6ff)" : "rgba(255,255,255,.045)", fontSize: 13, fontWeight: 900, cursor: "pointer" }}>{tab}</button>)}
  </div>;
}
