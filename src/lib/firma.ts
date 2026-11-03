// Zentrale Firmendaten – an einer Stelle pflegen, überall verwenden
// (Kopf, Fuß, Impressum, schema.org, llms.txt).

export const FIRMA = {
  name: 'TSK Thermografie & Sachverständigenbüro Frank Klingelhöfer',
  kurz: 'TSK Thermografie',
  inhaber: 'Frank Klingelhöfer',
  strasse: 'Heinrich-Naumann-Weg 1',
  plz: '35102',
  ort: 'Lohra',
  region: 'Hessen',
  telefon: '+49 151 26768601',
  telefonAnzeige: '0151 267 686 01',
  email: 'klingelhoefer@tsk-thermografie.de',
  einsatzgebiet: 'Mittelhessen und bundesweit nach Absprache',
  // Koordinaten von Lohra (Ortsmitte), für die Karte in Suchmaschinen
  geo: { lat: 50.7372, lng: 8.6293 },
  url: 'https://tsk-thermografie.de',
} as const;

export const TEAM = [
  {
    name: 'Frank Klingelhöfer',
    rolle: 'Inhaber, VdS-anerkannter Sachverständiger für Elektrothermografie',
    qualifikation: ['Geprüfter Industriemeister – Fachrichtung Elektrotechnik (IHK Kassel, 2012)', 'VdS-Anerkennung ET 24011, gültig bis 11.09.2028'],
    zertifikat: '/wp-content/uploads/2019/06/Zertifikat_FK.png',
    nummer: 'ET 24011',
  },
  {
    name: 'Nino Schneider',
    rolle: 'VdS-anerkannter Sachverständiger für Elektrothermografie',
    qualifikation: ['Geprüfter Industriemeister – Fachrichtung Elektrotechnik (IHK Kassel, 2012)', 'VdS-Anerkennung ET 26003, gültig bis 18.02.2030'],
    zertifikat: '/wp-content/uploads/2019/06/Zertifikat_NS.png',
    nummer: 'ET 26003',
  },
] as const;

export const NAVIGATION = [
  { href: '/leistungen/', label: 'Leistungen' },
  { href: '/referenzen/', label: 'Beispiele' },
  { href: '/faq/', label: 'Rechtssicherheit' },
  { href: '/ueber-uns/', label: 'Über uns' },
] as const;

/** Orte im Einsatzgebiet für schema.org (areaServed) */
export const REGION = ['Lohra', 'Marburg', 'Gießen', 'Wetzlar', 'Biedenkopf', 'Dillenburg', 'Frankenberg (Eder)', 'Limburg', 'Friedberg', 'Mittelhessen'];

export const VDS_VERZEICHNIS = 'https://vds.de/zertifikate/verzeichnis/V2861';
