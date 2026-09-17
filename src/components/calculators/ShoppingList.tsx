import type { ShoppingListItem } from "@/src/lib/calculators";
import { Icon } from "../ui/Icon";
import styles from "./calculator.module.css";

export function ShoppingList({ items }: { items: readonly ShoppingListItem[] }) {
  return <section aria-labelledby="shopping-list-title" className={styles.shoppingPanel}><div className={styles.cardHeading}><Icon label="SL" /><div><p className={styles.panelKicker}>Before you start</p><h2 id="shopping-list-title">Shopping List</h2></div></div><ul>{items.map((item) => <li key={item.name}><span aria-hidden="true" className={styles.listMarker}>✓</span><div><h3>{item.name}</h3><p>{item.detail}</p></div></li>)}</ul></section>;
}
