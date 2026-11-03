// Fragen und Antworten zur Rechtssicherheit (Seite /faq/, auch als FAQPage-Schema
// und in /llms.txt). Grundlage: Fachtext der alten Website, überarbeitet.
export const FRAGEN = [
  {
    f: 'Wer darf eine Elektrothermografie nach VdS 2860 durchführen?',
    a: 'Nur Sachverständige, die der VdS ausdrücklich für Elektrothermografie anerkannt hat. Ihre Anerkennungsnummer beginnt immer mit „ET“. VdS-Sachverständige aus anderen elektrotechnischen Bereichen haben diese Anerkennung nicht. Das öffentliche Verzeichnis des VdS zeigt, wer anerkannt ist.',
  },
  {
    f: 'Welchen Bericht braucht mein Versicherer?',
    a: 'Einen Untersuchungsbericht nach VdS 2860. Nur er gilt bei den Feuerversicherern und dem europäischen Verband CFPA-E als ausreichend. Andere Prüfberichte, Expertisen oder Befundscheine erfüllen diese Anforderung nicht – auch wenn sie Wärmebilder enthalten.',
  },
  {
    f: 'Wie oft sollte die Elektrothermografie stattfinden?',
    a: 'In der Regel einmal im Jahr. Je nach Anlage, Belastung und Risiko kann ein anderer Abstand sinnvoll sein. Den Prüfzyklus vereinbaren Betreiber und Sachverständiger gemeinsam – und gleichen ihn mit den Vorgaben des Versicherers ab.',
  },
  {
    f: 'Was muss ich als Betreiber oder verantwortliche Elektrofachkraft (VEFK) beachten?',
    a: 'Beauftragen Sie einen VdS-anerkannten Sachverständigen mit ET-Nummer, lassen Sie sich einen Bericht nach VdS 2860 ausstellen, vereinbaren Sie einen festen Prüfzyklus und arbeiten Sie die festgestellten Mängel nachweisbar ab. Bewahren Sie Berichte und Mängelbeseitigung für den Versicherer auf.',
  },
  {
    f: 'Ersetzt die Thermografie andere Prüfungen?',
    a: 'Nein. Gewerblich genutzte elektrische Anlagen brauchen zusätzlich die Prüfung nach DGUV Vorschrift 3 für ortsfeste Anlagen (gesetzliche Unfallversicherung) und häufig die VdS-Prüfung nach Klausel SK 3602, oft „TÜV-Prüfung“ genannt (Feuerversicherer). Die Elektrothermografie ergänzt beide, ersetzt sie aber nicht.',
  },
  {
    f: 'Kann man Thermografie und DGUV-V3-Prüfung zusammen erledigen?',
    a: 'VdS und CFPA-E raten davon ab. Die Thermografie muss im laufenden Betrieb stattfinden, möglichst unter Nennlast. Isolationsmessungen – fester Bestandteil der DGUV-V3-Prüfung und stichprobenweise auch der SK-3602-Prüfung – gehen dagegen nur spannungsfrei. Deshalb sind zwei getrennte Termine richtig.',
  },
  {
    f: 'Ist die Elektrothermografie gesetzlich vorgeschrieben?',
    a: 'Nicht ausdrücklich. Arbeitsschutzgesetz und Betriebssicherheitsverordnung verlangen aber einen sicheren Zustand der Anlagen, und viele Feuer- und Sachversicherer schreiben die Elektrothermografie nach VdS 2860 in ihren Bedingungen vor. Fehlt sie, kann das den Versicherungsschutz gefährden.',
  },
];
