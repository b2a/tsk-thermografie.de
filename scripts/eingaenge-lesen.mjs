// Entschlüsselt gesicherte Anfragen (*.enc aus tsk-intern/eingaenge/ auf dem Server).
//
//   npm run eingaenge -- pfad/zu/den/enc-dateien
//
// Den Schlüssel liest das Skript aus der Umgebungsvariable FORMULAR_SCHLUESSEL
// oder aus .env (Zeile "FORMULAR_SCHLUESSEL=..."). Er steht auch in
// tsk-intern/konfig.php auf dem Server ('formular_schluessel').
import fs from 'node:fs';
import path from 'node:path';
import nacl from 'tweetnacl';

const ordner = process.argv[2] ?? 'eingaenge';
let schluessel = process.env.FORMULAR_SCHLUESSEL;
if (!schluessel && fs.existsSync('.env')) schluessel = fs.readFileSync('.env', 'utf8').match(/^FORMULAR_SCHLUESSEL\s*=\s*(\S+)/m)?.[1];
if (!schluessel) throw new Error('FORMULAR_SCHLUESSEL fehlt (Umgebungsvariable oder .env).');
const key = Buffer.from(schluessel, 'base64');

const dateien = fs.readdirSync(ordner).filter((f) => f.endsWith('.enc')).sort();
for (const f of dateien) {
  const roh = Buffer.from(fs.readFileSync(path.join(ordner, f), 'utf8'), 'base64');
  const klar = nacl.secretbox.open(roh.subarray(24), roh.subarray(0, 24), key);
  console.log(`\n=== ${f}`);
  console.log(klar ? JSON.stringify(JSON.parse(Buffer.from(klar).toString('utf8')), null, 2) : '(nicht lesbar – falscher Schlüssel?)');
}
console.log(`\n${dateien.length} Anfrage(n).`);
