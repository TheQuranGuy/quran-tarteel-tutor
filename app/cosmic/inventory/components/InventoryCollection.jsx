import InventoryItem from "./InventoryItem";

export default function InventoryCollection({ items }) {
  return <section aria-label="Collected inventory" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(275px,1fr))", gap: 13 }}>{items.map((item) => <InventoryItem key={item.id} item={item} />)}</section>;
}
