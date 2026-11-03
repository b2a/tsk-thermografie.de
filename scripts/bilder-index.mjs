// Erstellt src/data/bilder.json: Für jedes in src/ verwendete Bild aus
// /wp-content/uploads/ die Originalgröße und die von WordPress bereits
// erzeugten verkleinerten Varianten (für srcset). Die Bilder selbst werden
// nicht kopiert, sondern direkt vom Webspace ausgeliefert.
//
//   node scripts/bilder-index.mjs [pfad/zum/uploads-ordner]
//
// Standard: uploadsRoot/ (Kopie von wp-content/uploads der Live-Seite).
// Dateinamen bleiben exakt (z. B. .jpeg/.JPG) – der Server unterscheidet Groß/klein.

import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const UPLOADS = path.resolve(process.argv[2] ?? path.join(ROOT, 'uploadsRoot'));
const OUT = path.join(ROOT, 'src', 'data', 'bilder.json');
const RE = /\/wp-content\/uploads\/([^\s)"'`\]]+?\.(?:jpe?g|png|gif|webp))/gi;

const genutzt = new Set();
(function lies(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) lies(p);
    else if (/\.(md|astro|ts|mjs)$/.test(e.name)) for (const m of fs.readFileSync(p, 'utf8').matchAll(RE)) genutzt.add(decodeURIComponent(m[1]));
  }
})(path.join(ROOT, 'src'));

const cache = new Map();
const dateienIn = (dir) => {
  if (!cache.has(dir)) cache.set(dir, fs.existsSync(dir) ? fs.readdirSync(dir) : []);
  return cache.get(dir);
};
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const index = {};
const fehlend = [];
for (const rel of [...genutzt].sort()) {
  const datei = path.join(UPLOADS, rel);
  if (!fs.existsSync(datei)) { fehlend.push(rel); continue; }
  const meta = await sharp(datei).metadata();
  const [b, h] = (meta.orientation ?? 1) >= 5 ? [meta.height, meta.width] : [meta.width, meta.height];
  const { dir, name, ext } = path.parse(rel);
  const basis = name.replace(/-\d+x\d+$/, '').replace(/-scaled$/, '');
  const varianten = [];
  for (const f of dateienIn(path.join(UPLOADS, dir))) {
    const m = f.match(new RegExp(`^${esc(basis)}(?:-scaled)?-(\\d+)x(\\d+)${esc(ext)}$`));
    if (!m) continue;
    const [vb, vh] = [+m[1], +m[2]];
    // nur unbeschnittene Varianten mit gleichem Seitenverhältnis
    if (vb < b && Math.abs(vb / vh - b / h) < 0.02) varianten.push([vb, f]);
  }
  varianten.sort((x, y) => x[0] - y[0]);
  index[rel] = { b, h, v: varianten };
}

fs.writeFileSync(OUT, JSON.stringify(index, null, 1));
console.log(`${Object.keys(index).length} Bilder im Index.`);
if (fehlend.length) { console.log(`Nicht gefunden:\n  ${fehlend.join('\n  ')}`); process.exitCode = 1; }
