// Wandelt den WordPress-Export (WXR) mit Elementor-Seiten in Markdown um.
//
//   npm run import:wp
//
// Ergebnis: import/wordpress/<slug>.md – Rohtexte der alten Seiten als
// Arbeitsgrundlage. Die veröffentlichten Inhalte liegen redaktionell
// überarbeitet in src/content/; dieser Ordner wird nicht veröffentlicht.
// Bilder werden nicht kopiert: Pfade zeigen auf /wp-content/uploads/, das
// auf dem Webspace erhalten bleibt. Fehlende Bilder stehen im Bericht.

import fs from 'node:fs';
import path from 'node:path';
import { XMLParser } from 'fast-xml-parser';
import TurndownService from 'turndown';

const ROOT = path.resolve(import.meta.dirname, '..');
const XML = fs.readdirSync(ROOT).filter((f) => /\.WordPress\..*\.xml$/.test(f)).sort().at(-1);
const UPLOADS = path.join(ROOT, 'uploadsRoot');
const ZIEL = path.join(ROOT, 'import', 'wordpress');
const SITE = /https?:\/\/(?:www\.)?tsk-thermografie\.de/g;
if (!XML) throw new Error('Kein WordPress-Export (*.WordPress.*.xml) im Projektordner gefunden.');

const parser = new XMLParser({
  ignoreAttributes: false, attributeNamePrefix: '', processEntities: true, htmlEntities: true,
  isArray: (n) => ['item', 'category', 'wp:postmeta'].includes(n),
});
const text = (v) => (v == null ? '' : typeof v === 'object' ? String(v['#text'] ?? '') : String(v));
const items = parser.parse(fs.readFileSync(path.join(ROOT, XML), 'utf8')).rss.channel.item.map((it) => ({
  id: text(it['wp:post_id']), typ: text(it['wp:post_type']), status: text(it['wp:status']),
  titel: text(it.title).trim(), slug: decodeURIComponent(text(it['wp:post_name'])), datum: text(it['wp:post_date']),
  inhalt: text(it['content:encoded']),
  meta: Object.fromEntries((it['wp:postmeta'] || []).map((m) => [text(m['wp:meta_key']), text(m['wp:meta_value'])])),
}));

const td = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-', emDelimiter: '*' });
const md = (html) => td.turndown(String(html ?? '').replace(/&nbsp;/g, ' ')).replace(/​/g, '').trim();
const bericht = { seiten: [], fehlendeBilder: new Set(), platzhalter: [] };

const bild = (url) => {
  if (!url) return '';
  const lokal = url.replace(SITE, '');
  const rel = lokal.match(/\/wp-content\/uploads\/(.+)$/)?.[1];
  if (rel && !fs.existsSync(path.join(UPLOADS, decodeURIComponent(rel)))) bericht.fehlendeBilder.add(rel);
  return lokal;
};

// Elementor-Widgets in Markdown übersetzen
function widget(w) {
  const s = (w.settings && !Array.isArray(w.settings)) ? w.settings : {};
  switch (w.widgetType) {
    case 'heading': return `## ${md(s.title).replace(/\n+/g, ' ')}`;
    case 'text-editor': return md(s.editor);
    case 'button': return s.text ? `[${s.text}](${(s.link?.url || '').replace(SITE, '')})` : '';
    case 'image': return s.image?.url ? `![${s.image.alt || ''}](${bild(s.image.url)})` : '';
    case 'image-gallery': return (s.wp_gallery || []).map((b) => `![](${bild(b.url)})`).join('\n');
    case 'icon-list': return (s.icon_list || []).map((e) => `- ${e.text}`).join('\n');
    case 'icon-box': case 'image-box': return `### ${s.title_text || ''}\n\n${md(s.description_text)}`;
    case 'testimonial': return `> ${md(s.testimonial_content)}`;
    case 'author-box': return `**${s.author_name || ''}** – ${s.author_bio || ''}`;
    case 'spacer': case 'nav-menu': return '';
    default: return `<!-- nicht übernommen: ${w.widgetType} -->`;
  }
}
function baum(knoten) {
  const teile = [];
  for (const k of knoten) {
    if (k.widgetType) teile.push(widget(k));
    if (k.elements?.length) teile.push(baum(k.elements));
  }
  return teile.filter(Boolean).join('\n\n');
}

fs.mkdirSync(ZIEL, { recursive: true });
for (const it of items.filter((i) => ['page', 'post', 'elementor_library'].includes(i.typ) && i.status === 'publish')) {
  let koerper;
  if (it.meta._elementor_data && it.meta._elementor_data.length > 2) koerper = baum(JSON.parse(it.meta._elementor_data));
  else koerper = md(it.inhalt);
  if (!koerper.trim()) continue;
  if (/lorem ipsum/i.test(koerper)) bericht.platzhalter.push(it.slug);
  const datei = `${it.typ === 'elementor_library' ? 'vorlage-' : ''}${it.slug}.md`;
  const kopf = ['---', `titel: ${JSON.stringify(it.titel)}`, `wp_id: ${it.id}`, `wp_typ: ${it.typ}`, `datum: ${it.datum.slice(0, 10)}`, '---', ''].join('\n');
  fs.writeFileSync(path.join(ZIEL, datei), kopf + koerper.replace(/\n{3,}/g, '\n\n') + '\n');
  bericht.seiten.push(datei);
}

const aus = { ...bericht, fehlendeBilder: [...bericht.fehlendeBilder] };
fs.writeFileSync(path.join(ROOT, 'import', 'bericht.json'), JSON.stringify(aus, null, 2));
console.log(`${aus.seiten.length} Seiten nach import/wordpress geschrieben.`);
if (aus.platzhalter.length) console.log(`Platzhaltertext (Lorem Ipsum) in: ${aus.platzhalter.join(', ')}`);
if (aus.fehlendeBilder.length) console.log(`${aus.fehlendeBilder.length} Bilder fehlen lokal – siehe import/bericht.json`);
