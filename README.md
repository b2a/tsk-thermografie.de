# tsk-thermografie.de

Website von TSK Thermografie & Sachverständigenbüro Frank Klingelhöfer – Nachfolger der WordPress/Elementor-Seite.

- **Astro** (statisch), Inhalte als Markdown in `src/content/leistungen/`
- **Bilder** direkt aus `/wp-content/uploads/` des Webspace, srcset aus `src/data/bilder.json`
- **Anfrageformular** in PHP (`public/api/`), verschlüsselte Ablage, Spam-Schutz ohne Captcha
- **SEO**: schema.org (ProfessionalService, Service, FAQPage, BreadcrumbList), Sitemap, robots.txt, `/llms.txt`
- **Strenge CSP**, keine Inline-Styles, keine externen Ressourcen, keine Cookies

| Befehl | Zweck |
|---|---|
| `npm run dev` | lokale Entwicklung |
| `npm run build` | Website nach `dist/` bauen |
| `npm run import:wp` | WordPress-Export → `import/wordpress/*.md` (Rohtexte) |
| `npm run bilder:index` | Bild-Index aus `uploadsRoot/` neu erzeugen |
| `npm run eingaenge -- <ordner>` | gesicherte Anfragen entschlüsseln |
| `npm run aktualisieren` | prüfen, bauen, veröffentlichen |
| `node scripts/grafiken.mjs` | Favicon, Logo-PNG und Vorschaubild erzeugen |

Betrieb und Go-live: [BETRIEB.md](BETRIEB.md) · Offene Aufgaben: [OFFENE_PUNKTE.md](OFFENE_PUNKTE.md) ·
Bestandsaufnahme der alten Seite: [BESTANDSAUFNAHME.md](BESTANDSAUFNAHME.md)
