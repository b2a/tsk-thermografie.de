// Strukturierte Daten (schema.org) für Suchmaschinen und KI-Assistenten.
import { FIRMA, TEAM, REGION } from './firma';

export const FIRMA_ID = `${FIRMA.url}/#firma`;

export function firmaSchema(leistungen: { titel: string; kurz: string; slug: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': ['ProfessionalService', 'LocalBusiness'],
    '@id': FIRMA_ID,
    name: FIRMA.name,
    alternateName: 'TSK Thermografie',
    url: `${FIRMA.url}/`,
    logo: `${FIRMA.url}/logo.png`,
    image: `${FIRMA.url}/teilen.jpg`,
    description: 'VdS-anerkannte Sachverständige für Elektrothermografie: Thermografie elektrischer Anlagen nach VdS 2860 und DIN 54191, Prüfungen nach DGUV Vorschrift 3 und Klausel SK 3602, Schulungen.',
    telephone: FIRMA.telefon,
    email: FIRMA.email,
    founder: { '@type': 'Person', name: FIRMA.inhaber },
    address: {
      '@type': 'PostalAddress', streetAddress: FIRMA.strasse, postalCode: FIRMA.plz,
      addressLocality: FIRMA.ort, addressRegion: FIRMA.region, addressCountry: 'DE',
    },
    geo: { '@type': 'GeoCoordinates', latitude: FIRMA.geo.lat, longitude: FIRMA.geo.lng },
    areaServed: [...REGION.map((name) => ({ '@type': 'Place', name })), { '@type': 'Country', name: 'Deutschland' }],
    knowsAbout: ['Elektrothermografie', 'Infrarot-Thermografie', 'VdS 2860', 'DIN 54191', 'DGUV Vorschrift 3', 'Klausel SK 3602', 'Brandschutz', 'Arbeitsschutz'],
    employee: TEAM.map((p) => ({
      '@type': 'Person', name: p.name, jobTitle: p.rolle,
      hasCredential: { '@type': 'EducationalOccupationalCredential', credentialCategory: 'Anerkennung', name: `VdS-Anerkennung Sachverständiger für Elektrothermografie ${p.nummer}`, recognizedBy: { '@type': 'Organization', name: 'VdS Schadenverhütung GmbH' } },
    })),
    hasOfferCatalog: {
      '@type': 'OfferCatalog', name: 'Leistungen',
      itemListElement: leistungen.map((l) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: l.titel, description: l.kurz, url: `${FIRMA.url}/leistungen/${l.slug}/`, provider: { '@id': FIRMA_ID } },
      })),
    },
  };
}

export const fragenSchema = (fragen: { f: string; a: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: fragen.map(({ f, a }) => ({ '@type': 'Question', name: f, acceptedAnswer: { '@type': 'Answer', text: a } })),
});
