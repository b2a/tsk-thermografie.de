# Offene Punkte

Was vor bzw. nach dem Umzug auf die neue Website geprüft oder erledigt werden muss.
Abhaken mit `[x]`. Ideen für später stehen in [FUTURE_IDEAS.md](FUTURE_IDEAS.md).

## Vor der Veröffentlichung (Testdomain)

- [ ] **Subdomain anlegen:** KAS → Subdomains → `neu.tsk-thermografie.de` mit Zielverzeichnis `/tsk-website/`,
      SSL (Let's Encrypt) aktivieren, PHP 8.4 oder höher.
- [ ] **GitHub-Repository** anlegen und Secrets/Variablen eintragen (siehe [BETRIEB.md](BETRIEB.md)).
      Besser einen eigenen FTP-Zugang nur für `/tsk-website/` anlegen.
- [ ] `scripts/server-einrichten.sh` ausführen (legt `/tsk-website`, `/tsk-intern` und die Bilder-Verknüpfung an).
- [ ] **Test-Anfrage** über das Formular senden – E-Mail muss bei web@4ndre.de ankommen (auch Spam-Ordner prüfen).
      Kommt keine Mail: Absender `klingelhoefer@tsk-thermografie.de` muss als Postfach bei All-Inkl existieren.

## Rechtlich prüfen lassen

- [ ] **Impressum und Datenschutzerklärung** (neu geschrieben, Stand November 2026) prüfen lassen.
      Danach den Hinweis „Entwurf – bitte prüfen lassen“ entfernen (`<PruefHinweis />` in
      `src/pages/impressum.astro` und `src/pages/datenschutz.astro`).
- [ ] **Umsatzsteuer-ID** prüfen: „DE 03183601710“ hat 11 statt 9 Ziffern – vermutlich ist es die Steuernummer.
      Eine Steuernummer gehört nicht ins Impressum; dann die USt-ID eintragen oder den Absatz streichen.
- [ ] **Speicherdauer der Server-Protokolle** bei All-Inkl prüfen (in der Datenschutzerklärung stehen 7 Tage) und
      den **Vertrag zur Auftragsverarbeitung** im KAS abschließen, falls noch nicht geschehen.
- [ ] **Bildrechte:** Titelbild „Rolf Weber Gruppe“ (Freigabe liegt laut Frank vor – schriftlich ablegen) und die
      FLIR-Kamerabilder (Herstellerbilder? Bildnachweis im Impressum ggf. anpassen).
- [ ] **VdS-Werbehinweis:** Die Anerkennungsurkunden verlangen, dass Werbung mit der Anerkennung deren Inhalt
      korrekt wiedergibt. Die Texte nennen „Sachverständige für Elektrothermografie“ und die Nummern – bitte gegenlesen.

## Inhalte prüfen

- [ ] **Alle Texte gegenlesen**, besonders die neu formulierten Leistungsseiten (angelehnt an den Emetron-Text,
      eigenständig umgeschrieben) und die Aussagen zu ArbSchG, BetrSichV, DGUV V3, SK 3602.
- [ ] **„Wir melden uns innerhalb von zwei Werktagen“** (Kontakt, Danke-Seite) – ist das realistisch?
- [ ] **Arbeitsschutz/Brandschutz:** Die Seite ist knapp, weil die alte Seite nur einen Satz hatte. Was genau wird angeboten?
- [ ] **Zweites Kamerabild** (`R2020656-01.webp`): Welches Modell ist das? Dann in „Weitere Thermografie“ nennen.
- [ ] **Praxisbeispiel prüfen:** Ort und Befundtext in `src/data/beispiele.ts` sind allgemein formuliert –
      echte Ursache und Dringlichkeit aus dem Bericht ergänzen.
- [ ] **Mehr Praxisbeispiele:** Bisher gibt es ein eigenes Thermogramm. 3–6 weitere Paare aus Wärmebild und Foto
      (anonymisiert, ohne Kundennamen) machen die Seite „Beispiele“ deutlich stärker – auch für Google.
- [ ] **Fotos von Frank und Nino** (Porträt oder bei der Arbeit) für „Über uns“ – stärkt Vertrauen.
- [ ] **Logo als Vektordatei (SVG):** Das alte SVG nennt noch „Andreas Kinz“. Im Kopf wird das Logo jetzt als
      Schriftzug nachgebaut; eine saubere SVG-Fassung des aktuellen Logos wäre besser.
- [ ] **Meisterbriefe** werden bewusst nicht als Bild gezeigt (enthalten Geburtsdaten). Bei Bedarf geschwärzt nachreichen.

## Nach dem Go-live

- [ ] **Hauptdomain umstellen** – erst nach deinem OK (Ablauf in [BETRIEB.md](BETRIEB.md)).
- [ ] `tsk-intern/konfig.php`: `empfaenger` von web@4ndre.de auf die echte Firmenadresse umstellen.
- [ ] **Google Search Console** und **Bing Webmaster Tools**: Domain bestätigen, `https://tsk-thermografie.de/sitemap-index.xml` einreichen.
- [ ] **Google-Unternehmensprofil** (Google Maps) anlegen oder aktualisieren: gleiche Adresse, Telefonnummer, Website.
- [ ] **Altes WordPress im Stammverzeichnis** absichern und später löschen – **`/wp-content/uploads` behalten**.
      Ebenso prüfen: `/relaunch.tsk-thermografie.de/` (zweites WordPress), `/backup`, `/clean`.
      Nichts davon wurde gelöscht – bitte selbst entscheiden oder Bescheid geben.
- [ ] **Abgelaufenes Zertifikat** des Vorgängers (Andreas Kinz, `2019/07/VdS-Anerkennung-2016.jpg` und PDFs)
      liegt noch in den Uploads – wird nicht mehr verlinkt, kann gelöscht werden.
- [ ] Eintrag im **VdS-Verzeichnis** prüfen: Ist dort die Website hinterlegt?
