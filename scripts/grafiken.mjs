// Erzeugt Favicon, Logo und Vorschaubild (für Links in Messengern/sozialen Netzen)
// nach public/. Einmalig bzw. nach Änderungen am Logo ausführen:
//   node scripts/grafiken.mjs
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const PUB = path.join(ROOT, 'public');
const SKALA = '<linearGradient id="s" x1="0" x2="1"><stop offset="0" stop-color="#000080"/><stop offset=".22" stop-color="#4b0f9e"/><stop offset=".44" stop-color="#b0186f"/><stop offset=".66" stop-color="#e0561a"/><stop offset=".84" stop-color="#f59e0b"/><stop offset="1" stop-color="#fff1b8"/></linearGradient>';

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs>${SKALA}</defs><rect width="64" height="64" rx="10" fill="#0a1446"/><rect y="54" width="64" height="10" fill="url(#s)"/><text x="32" y="42" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-style="italic" font-size="30" fill="#fff">TSK</text></svg>`;
fs.writeFileSync(path.join(PUB, 'favicon.svg'), favicon);
await sharp(Buffer.from(favicon)).resize(32, 32).png().toFile(path.join(PUB, 'favicon.png'));
await sharp(Buffer.from(favicon)).resize(180, 180).png().toFile(path.join(PUB, 'apple-touch-icon.png'));

const logo = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="200" viewBox="0 0 600 200"><rect width="600" height="200" fill="#fff"/><text x="300" y="125" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-style="italic" font-size="130" fill="#000080">TSK</text><text x="300" y="172" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-style="italic" font-size="22" fill="#000080">Thermografie &amp; Sachverständigenbüro Frank Klingelhöfer</text></svg>`;
await sharp(Buffer.from(logo)).png().toFile(path.join(PUB, 'logo.png'));

// Vorschaubild 1200×630: Wärmebild-Hälfte des Praxisbeispiels + Schriftzug
const quelle = path.join(ROOT, 'uploadsRoot/2019/06/Screenshot-2026-03-16-180448.jpg');
const thermo = await sharp(quelle).extract({ left: 0, top: 0, width: 935, height: 703 }).resize(560, 630, { fit: 'cover' }).toBuffer();
const text = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><defs>${SKALA}</defs>
<rect width="1200" height="630" fill="#0a1446"/><rect y="618" width="1200" height="12" fill="url(#s)"/>
<text x="620" y="190" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-style="italic" font-size="110" fill="#fff">TSK</text>
<text x="622" y="250" font-family="Arial, Helvetica, sans-serif" font-size="30" fill="#c8cee0">Thermografie &amp; Sachverständigenbüro</text>
<text x="622" y="370" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="44" fill="#fff">Elektrothermografie</text>
<text x="622" y="425" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="44" fill="#fff">nach VdS 2860</text>
<text x="622" y="520" font-family="Arial, Helvetica, sans-serif" font-size="28" fill="#c8cee0">Lohra · Mittelhessen · bundesweit</text></svg>`;
await sharp(Buffer.from(text)).composite([{ input: thermo, left: 0, top: 0 }]).jpeg({ quality: 82 }).toFile(path.join(PUB, 'teilen.jpg'));
console.log('Grafiken erzeugt.');
