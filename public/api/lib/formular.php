<?php
// Anfrage: prüfen, verschlüsselt sichern, dann per E-Mail weiterleiten.
declare(strict_types=1);

const LEISTUNGEN = [
    'elektrothermografie' => 'Elektrothermografie',
    'pruefung-elektrischer-anlagen' => 'Prüfung elektrischer Anlagen',
    'thermografie-messungen' => 'Weitere Thermografie',
    'arbeitsschutz-brandschutz' => 'Arbeitsschutz und Brandschutz',
    'schulungen' => 'Schulungen und Seminare',
    'sonstiges' => 'Etwas anderes',
];

final class Hinweis extends RuntimeException {}
final class Koeder extends RuntimeException {}

// ------------------------------------------------------------------ Prüfen
function feld(array $e, string $name, int $max, bool $pflicht, bool $mehrzeilig = false): string
{
    $wert = (string)($e[$name] ?? '');
    $wert = $mehrzeilig
        ? trim(preg_replace("/[^\P{C}\n\t]/u", '', str_replace("\r", '', $wert)) ?? '')
        : trim(preg_replace('/\s+/u', ' ', preg_replace('/[\x00-\x1F\x7F]/u', '', $wert) ?? '') ?? '');
    if ($pflicht && $wert === '') throw new Hinweis('Bitte alle Pflichtfelder ausfüllen.');
    if (mb_strlen($wert) > $max) throw new Hinweis('Eine Angabe ist zu lang.');
    return $wert;
}

// Spam-Schutz ohne Captcha: Köderfeld, Mindestzeit, Begrenzung pro IP
function spam_pruefen(array $e): void
{
    if (!empty($e['webseite'])) throw new Koeder(); // Bots füllen das versteckte Feld – still verwerfen
    $start = (int)($e['start'] ?? 0);
    if ($start > 0 && (time() * 1000 - $start) < 4000) {
        throw new Hinweis('Das ging sehr schnell. Bitte prüfen Sie Ihre Angaben und senden Sie erneut.');
    }
    $ordner = datenordner('daten/zaehler');
    $datei = $ordner . '/' . hash('sha256', client_ip() . konfig('formular_schluessel', '')) . '.json';
    $jetzt = time();
    $liste = is_file($datei) ? (json_decode((string)file_get_contents($datei), true) ?: []) : [];
    $liste = array_values(array_filter($liste, fn($t) => $t > $jetzt - 3600));
    if (count($liste) >= (int)konfig('max_pro_stunde', 5)) {
        throw new Hinweis('Von Ihrem Anschluss kamen gerade viele Anfragen. Bitte versuchen Sie es in einer Stunde erneut oder rufen Sie uns an.');
    }
    $liste[] = $jetzt;
    file_put_contents($datei, json_encode($liste), LOCK_EX);
    // alte Zähler aufräumen
    foreach (glob("$ordner/*.json") ?: [] as $f) if (filemtime($f) < $jetzt - 86400) @unlink($f);
}

// ----------------------------------------------------------- Verschlüsseln
function schluessel(): string
{
    $s = base64_decode((string)konfig('formular_schluessel', ''), true);
    if ($s === false || strlen($s) !== SODIUM_CRYPTO_SECRETBOX_KEYBYTES) throw new RuntimeException('Formular ist nicht eingerichtet (Schlüssel fehlt).');
    return $s;
}

function verschluesselt_sichern(array $daten): string
{
    $nonce = random_bytes(SODIUM_CRYPTO_SECRETBOX_NONCEBYTES);
    $roh = base64_encode($nonce . sodium_crypto_secretbox(json_encode($daten, JSON_UNESCAPED_UNICODE), $nonce, schluessel()));
    $id = date('Y-m-d_His') . '-' . bin2hex(random_bytes(3));
    $datei = datenordner('eingaenge') . "/$id.enc";
    if (file_put_contents($datei, $roh, LOCK_EX) === false) throw new RuntimeException('Anfrage konnte nicht gespeichert werden.');
    @chmod($datei, 0600);
    return $id;
}

// ------------------------------------------------------------------ E-Mail
function mail_senden(array $an, string $betreff, string $text, string $antwortAn): bool
{
    $absender = (string)konfig('absender');
    $kopf = [
        'From: TSK Thermografie Website <' . $absender . '>',
        'Reply-To: ' . $antwortAn,
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
    ];
    return mail(implode(', ', $an), mb_encode_mimeheader($betreff, 'UTF-8'), $text, implode("\r\n", $kopf), '-f' . $absender);
}

function anfrage(array $e): string
{
    spam_pruefen($e);
    $d = [
        'name' => feld($e, 'name', 100, true),
        'firma' => feld($e, 'firma', 120, false),
        'email' => feld($e, 'email', 160, true),
        'telefon' => feld($e, 'telefon', 40, false),
        'ort' => feld($e, 'ort', 100, false),
        'leistung' => LEISTUNGEN[(string)($e['leistung'] ?? '')] ?? LEISTUNGEN['sonstiges'],
        'nachricht' => feld($e, 'nachricht', 5000, true, true),
        'zeit' => date('d.m.Y H:i'),
    ];
    if (!filter_var($d['email'], FILTER_VALIDATE_EMAIL)) throw new Hinweis('Bitte eine gültige E-Mail-Adresse eintragen.');
    if (mb_strlen($d['nachricht']) < 10) throw new Hinweis('Bitte beschreiben Sie Ihr Anliegen etwas ausführlicher.');

    // 1. zuerst sichern – geht die E-Mail verloren, ist die Anfrage trotzdem da
    $id = verschluesselt_sichern($d);

    // 2. dann mailen
    $text = "Neue Anfrage über tsk-thermografie.de ($id)\n\n"
        . "Leistung:  {$d['leistung']}\n"
        . "Name:      {$d['name']}\n"
        . ($d['firma'] !== '' ? "Firma:     {$d['firma']}\n" : '')
        . "E-Mail:    {$d['email']}\n"
        . ($d['telefon'] !== '' ? "Telefon:   {$d['telefon']}\n" : '')
        . ($d['ort'] !== '' ? "Ort:       {$d['ort']}\n" : '')
        . "Zeit:      {$d['zeit']}\n\n"
        . "Nachricht:\n{$d['nachricht']}\n\n"
        . "--\nAntworten Sie einfach auf diese E-Mail, um {$d['name']} zu schreiben.\n";
    $betreff = "Anfrage: {$d['leistung']} – {$d['name']}" . ($d['firma'] !== '' ? " ({$d['firma']})" : '');
    $an = (array)konfig('empfaenger', []);
    if (!$an || !mail_senden($an, $betreff, $text, $d['email'])) {
        error_log("TSK-Anfrage $id gespeichert, E-Mail fehlgeschlagen");
        file_put_contents(datenordner('daten') . '/mail-fehler.log', date('c') . " $id\n", FILE_APPEND | LOCK_EX);
    }
    return $id;
}
