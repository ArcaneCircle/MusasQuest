import es from "./langs/es.json";

const langs = { es };
const lang = ((window.navigator && window.navigator.language) || "en-US")
  .split("-")[0]
  .toLowerCase();

export function _(key) {
  return (langs[lang] || {})[key] || key;
}
