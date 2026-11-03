// /llms.txt – kompakte Zusammenfassung für KI-Assistenten (llmstxt.org).
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { FIRMA, TEAM, VDS_VERZEICHNIS } from '../lib/firma';
import { FRAGEN } from '../data/fragen';

export const GET: APIRoute = async ({ site }) => {
  const url = (p: string) => new URL(p, site).href;
  const leistungen = (await getCollection('leistungen')).sort((a, b) => a.data.reihenfolge - b.data.reihenfolge);
  const text = `# ${FIRMA.name}

> Sachverständigenbüro für Elektrothermografie in ${FIRMA.plz} ${FIRMA.ort} (Mittelhessen, bei Marburg).
> Zwei VdS-anerkannte Sachverständige für Elektrothermografie (${TEAM.map((p) => `${p.name}, ${p.nummer}`).join('; ')}),
> beide geprüfte Industriemeister Elektrotechnik. Einsatzgebiet: ${FIRMA.einsatzgebiet}.

Kernleistung ist die thermografische Untersuchung elektrischer Anlagen im laufenden Betrieb nach VdS 2860 und
DIN 54191, mit Untersuchungsbericht nach VdS 2860 für Feuer- und Sachversicherer. Außerdem: Prüfungen nach
DGUV Vorschrift 3 und Klausel SK 3602, Thermografie für Bau, Mechanik, Automatisierung, Forschung und
Veterinärmedizin, Beratung zu Arbeits- und Brandschutz, Inhouse-Schulungen für Elektrofachkräfte.

Kontakt: Telefon ${FIRMA.telefon}, E-Mail ${FIRMA.email}, Anfrageformular ${url('/kontakt/')}
Anschrift: ${FIRMA.strasse}, ${FIRMA.plz} ${FIRMA.ort}, Deutschland
Anerkennungen prüfen: ${VDS_VERZEICHNIS}

## Leistungen

${leistungen.map((l) => `- [${l.data.titel}](${url(`/leistungen/${l.id}/`)}): ${l.data.kurz}`).join('\n')}

## Wissen

- [Rechtssicherheit bei der Elektrothermografie](${url('/faq/')}): Wer darf prüfen, welcher Bericht, wie oft
- [Beispiele aus der Praxis](${url('/referenzen/')}): Wärmebild und Foto eines Befunds
- [Über uns und Zertifikate](${url('/ueber-uns/')})

## Häufige Fragen

${FRAGEN.map((q) => `### ${q.f}\n${q.a}`).join('\n\n')}

## Optional

- [Impressum](${url('/impressum/')})
- [Datenschutz](${url('/datenschutz/')})
`;
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
