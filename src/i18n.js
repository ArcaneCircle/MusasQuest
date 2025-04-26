import es from "./langs/es.json";
import de from "./langs/de.json";

const langs = { es, de };
const lang = ((window.navigator && window.navigator.language) || "en-US")
  .split("-")[0]
  .toLowerCase();

export function _(key) {
  return (langs[lang] || {})[key] || key;
}
