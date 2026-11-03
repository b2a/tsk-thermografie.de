// Bilder kommen direkt aus /wp-content/uploads/ des Webspace. Der Index kennt
// Größe und vorhandene WordPress-Varianten; daraus entstehen srcset-Angaben.
import index from '../data/bilder.json';

type Eintrag = { b: number; h: number; v: [number, string][] };
const WP = '/wp-content/uploads/';

export function bildInfo(src: string) {
  if (!src.startsWith(WP)) return { src, breite: undefined, hoehe: undefined, varianten: [] as { b: number; url: string }[] };
  const rel = decodeURIComponent(src.slice(WP.length));
  const e = (index as Record<string, Eintrag>)[rel];
  if (!e) throw new Error(`Bild fehlt im Index: ${rel} – bitte "npm run bilder:index" ausführen.`);
  const ordner = WP + rel.slice(0, rel.lastIndexOf('/') + 1);
  const url = (d: string) => encodeURI(ordner + d);
  const varianten = [...e.v.map(([b, d]) => ({ b, url: url(d) })), { b: e.b, url: encodeURI(WP + rel) }];
  return { src: encodeURI(WP + rel), breite: e.b, hoehe: e.h, varianten };
}

export const srcset = (src: string) => {
  const i = bildInfo(src);
  return i.varianten.length > 1 ? i.varianten.map((v) => `${v.url} ${v.b}w`).join(', ') : undefined;
};

/** Kleinste Variante, die mindestens `min` Pixel breit ist (sonst das Original). */
export const bildUrl = (src: string, min = 1200) => {
  const i = bildInfo(src);
  return (i.varianten.find((v) => v.b >= min) ?? i.varianten.at(-1))?.url ?? i.src;
};
