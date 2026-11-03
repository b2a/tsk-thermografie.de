# Betrieb der Website

## So hängt alles zusammen

```
Du (lokal) ── scripts/aktualisieren.sh ── push ──► GitHub
                                                     │
                            GitHub Actions: bauen ◄──┘
                                     │ FTPS (lftp mirror)
                                     ▼
All-Inkl-Webspace (w0078409)
  /                      altes WordPress (bleibt vorerst liegen)
  /wp-content/uploads/   Bilder – werden von der neuen Seite weiter genutzt!
  /tsk-website/          neue Website (statisch + api/anfrage.php)
     wp-content/uploads → Verknüpfung auf /wp-content/uploads
  /tsk-intern/           konfig.php, gesicherte Anfragen, Zähler (Web-Zugriff gesperrt)
```

- **Website**: statische HTML-Dateien, keine Datenbank, kein WordPress.
- **Bilder** kommen direkt aus `/wp-content/uploads/` des alten WordPress (kein erneutes Hochladen).
  **Den Ordner `/wp-content/uploads` deshalb nie löschen**, auch wenn WordPress abgeschaltet wird.
- **Anfrageformular**: `/api/anfrage.php` speichert jede Anfrage zuerst verschlüsselt in
  `/tsk-intern/eingaenge/` und schickt sie dann per E-Mail an die Adressen in `tsk-intern/konfig.php`
  (`empfaenger`). Spam-Schutz: verstecktes Köderfeld, Mindestzeit 4 Sekunden, höchstens 5 Anfragen pro Stunde und IP.
- **Server**: All-Inkl, PHP 8.5, kein Node.js, kein SSH. Gebaut wird deshalb in GitHub Actions.

## Weiterentwickeln

```bash
npm install          # einmalig
npm run dev          # Vorschau unter http://localhost:4321 (Bilder: siehe unten)
git add -A && git commit -m "Was geändert wurde"
npm run aktualisieren   # holen, prüfen, bauen, veröffentlichen
```

Texte der Leistungen liegen als Markdown in `src/content/leistungen/`, Firmendaten zentral in
`src/lib/firma.ts`, Fragen/Antworten in `src/data/fragen.ts`, Praxisbeispiele in `src/data/beispiele.ts`.

**Lokale Vorschau mit Bildern:** `npm run vorschau` (baut, verknüpft `uploadsRoot/` und startet http://localhost:4321).

## Neues Bild einbauen

1. Bild per FTP nach `/wp-content/uploads/2026/11/` laden (Dateiname exakt so lassen – Groß/klein zählt)
   und lokal nach `uploadsRoot/2026/11/` kopieren. Für schnelle Ladezeiten zusätzlich kleinere Fassungen
   mit WordPress-Namensschema ablegen, z. B. `bild-768x512.jpg`, `bild-1024x683.jpg`.
2. Im Inhalt verlinken, z. B. in `src/data/beispiele.ts`.
3. `npm run bilder:index` (macht `aktualisieren` automatisch).

## Gesicherte Anfragen lesen

Falls eine E-Mail nicht ankommt: `/tsk-intern/eingaenge/*.enc` per FTP herunterladen nach `eingaenge/`, dann

```bash
npm run eingaenge -- eingaenge
```

Der Schlüssel steht in `.env` (`FORMULAR_SCHLUESSEL`) und in `tsk-intern/konfig.php`.
Fehlgeschlagene E-Mails stehen in `/tsk-intern/daten/mail-fehler.log`.

## GitHub einrichten (einmalig)

Repository → Settings → Secrets and variables → Actions:

| Art | Name | Wert |
|---|---|---|
| Secret | `FTP_HOST` | `w0078409.kasserver.com` |
| Secret | `FTP_USER` | FTP-Login aus `.env` |
| Secret | `FTP_PASSWORT` | FTP-Passwort aus `.env` |
| Variable | `WEBSITE_ORDNER` | `tsk-website` |
| Variable | `WEBSITE_URL` | Testphase: `https://neu.tsk-thermografie.de`, nach Go-live `https://tsk-thermografie.de` |

Empfehlung: Im All-Inkl-KAS einen eigenen FTP-Zugang anlegen, der nur `/tsk-website/` sieht, und diesen
für GitHub verwenden statt des Hauptzugangs.

## Server neu einrichten

`scripts/server-einrichten.sh https://neu.tsk-thermografie.de` legt Ordner, Konfiguration und
Bilder-Verknüpfung per FTP an (gefahrlos wiederholbar, löscht nichts).

## Go-live (Hauptdomain umstellen – erst nach Abnahme)

1. KAS → Domains → `tsk-thermografie.de` (und `www.`) → Zielverzeichnis `/tsk-website/`. PHP-Version 8.4 oder höher.
2. `tsk-intern/konfig.php`: `empfaenger` auf `['klingelhoefer@tsk-thermografie.de']` (ggf. weitere).
3. GitHub-Variable `WEBSITE_URL` auf `https://tsk-thermografie.de`, dann Workflow neu starten.
4. Prüfen: Startseite, `/privacy-policy/` leitet auf `/datenschutz/`, Formular mit Test-Anfrage.

Danach ist WordPress nicht mehr über die Domain erreichbar. Alte Links leiten automatisch weiter.
