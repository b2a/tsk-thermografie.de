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
