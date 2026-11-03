// Beispiele aus der Praxis (Seite /referenzen/). Neue Beispiele einfach anhängen:
// Bild nach /wp-content/uploads/… hochladen, Eintrag ergänzen, "npm run bilder:index".
export const BEISPIELE = [
  {
    bild: '/wp-content/uploads/2019/06/Screenshot-2026-03-16-180448.jpg',
    alt: 'Links Wärmebild, rechts Foto derselben Reihe Motorstarter von Siemens. Im Wärmebild leuchtet eine Anschlussklemme weiß-rot mit 102 Grad Celsius.',
    titel: 'Überhitzte Anschlussklemme an einem Motorstarter',
    ort: 'Schaltschrank mit Motorstartern, Juni 2025',
    befund: 'Eine Klemme erreicht 102 °C, die baugleichen Nachbarn rund 35 °C. Solche Unterschiede deuten meist auf eine gelockerte Klemmverbindung oder einen erhöhten Übergangswiderstand hin und sollten kurzfristig behoben werden.',
  },
];

// Typische Befunde, die wir bei Untersuchungen finden
export const BEFUNDE = [
  'Gelockerte oder korrodierte Klemm- und Schraubverbindungen',
  'Überlastete Leiter und Kabel, zu klein bemessene Querschnitte',
  'Ungleiche Lastverteilung auf den drei Phasen',
  'Gealterte Sicherungen, Leistungsschalter und Schütze',
  'Hitzestau in Schaltschränken durch fehlende Belüftung',
  'Übergangswiderstände an Stromschienen und Sammelschienen',
];

// Weitere eigene Thermogramme (FLIR, 2025/26) für die Galerie.
// Bildunterschriften bitte fachlich prüfen (siehe OFFENE_PUNKTE.md).
export const THERMOGRAMME = [
  { bild: '/bilder/thermogramme/flir0035.jpg', max: 'ca. 212\u00a0°C', titel: 'Klemmstelle an einer Leitungsverbindung', alt: 'Wärmebild zweier Klemmstellen an einer Wand, die rechte glüht weiß-rot mit etwa 212 Grad Celsius.' },
  { bild: '/bilder/thermogramme/ir_0009.jpg', max: '189\u00a0°C', titel: 'Anschlüsse oberhalb zweier Netzteile', alt: 'Wärmebild zweier Netzteile im Schaltschrank, darüber stark erwärmte Leitungsanschlüsse.' },
  { bild: '/bilder/thermogramme/flir0072.jpg', max: 'ca. 123\u00a0°C', titel: 'Schaltschranklüfter', alt: 'Wärmebild eines runden Lüfters, Gitter und Rotor leuchten rot und weiß.' },
  { bild: '/bilder/thermogramme/flir0005.jpg', max: '97,4\u00a0°C', titel: 'Erwärmter Leiter an einer Reihenklemme', alt: 'Wärmebild einer Klemmenleiste, ein einzelner Leiter leuchtet weiß-rot, die übrigen gelb und grün.' },
  { bild: '/bilder/thermogramme/flir0027.jpg', max: '94,4\u00a0°C', titel: 'Flächig erwärmtes Bauteil', alt: 'Wärmebild eines rechteckigen Bauteils, das flächig rot leuchtet, die Umgebung ist gelb und grün.' },
  { bild: '/bilder/thermogramme/flir0036.jpg', max: '86,8\u00a0°C', titel: 'Abgang an einem Motorschutzschalter', alt: 'Wärmebild mehrerer Motorschutzschalter, an einem Abgang leuchtet die Leitung weiß-rot.' },
  { bild: '/bilder/thermogramme/flir0034.jpg', max: '83,3\u00a0°C', titel: 'Sicherungseinsatz', alt: 'Wärmebild von drei übereinanderliegenden Sicherungen, die mittlere leuchtet weiß-rot.' },
  { bild: '/bilder/thermogramme/flir0018.jpg', max: '81,5\u00a0°C', titel: 'Leitungsanschluss mit Hotspot', alt: 'Wärmebild gebündelter Leitungen, die an einem Anschluss zusammenlaufen, der Anschluss leuchtet weiß.' },
  { bild: '/bilder/thermogramme/flir0062.jpg', max: '80,4\u00a0°C', titel: 'Anschluss an einem Schaltgerät', alt: 'Wärmebild eines Schaltgeräts auf einer Hutschiene, eine Anschlussleitung leuchtet weiß-rot.' },
  { bild: '/bilder/thermogramme/flir0025.jpg', max: '71,3\u00a0°C', titel: 'Schütze mit ungleicher Erwärmung', alt: 'Wärmebild einer Reihe von Schützen, mehrere Kontakte leuchten rot.' },
];
