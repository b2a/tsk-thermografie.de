<?php
// Anfrageformular der Website. Antwortet mit JSON (fetch) oder leitet weiter
// (Formular ohne JavaScript).
declare(strict_types=1);
require __DIR__ . '/lib/start.php';
require __DIR__ . '/lib/formular.php';

$json = str_contains((string)($_SERVER['HTTP_ACCEPT'] ?? ''), 'application/json');
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    antwort(['fehler' => 'Nur POST erlaubt.'], 405);
}
// nur Anfragen von der eigenen Website annehmen
$herkunft = (string)($_SERVER['HTTP_ORIGIN'] ?? '');
$erlaubt = array_merge([(string)konfig('website_url')], (array)konfig('weitere_herkuenfte', []));
if ($herkunft !== '' && !in_array(rtrim($herkunft, '/'), array_map(fn($u) => rtrim($u, '/'), $erlaubt), true)) {
    antwort(['fehler' => 'Ungültige Herkunft.'], 403);
}

$eingabe = str_starts_with((string)($_SERVER['CONTENT_TYPE'] ?? ''), 'application/json')
    ? (json_decode((string)file_get_contents('php://input', false, null, 0, 20000), true) ?: [])
    : $_POST;

try {
    anfrage($eingabe);
    if ($json) antwort(['ok' => true]);
    header('Location: /kontakt/danke/', true, 303);
} catch (Koeder $k) {
    if ($json) antwort(['ok' => true]);
    header('Location: /kontakt/danke/', true, 303);
} catch (Hinweis $h) {
    if ($json) antwort(['fehler' => $h->getMessage()], 422);
    http_response_code(422);
    header('Content-Type: text/plain; charset=utf-8');
    echo $h->getMessage() . "\n\nBitte gehen Sie zurück und prüfen Sie Ihre Angaben.";
} catch (Throwable $t) {
    error_log('TSK-Anfrage: ' . $t->getMessage());
    if ($json) antwort(['fehler' => 'Die Anfrage konnte gerade nicht verarbeitet werden. Bitte rufen Sie uns an oder schreiben Sie eine E-Mail.'], 500);
    http_response_code(500);
    echo 'Die Anfrage konnte gerade nicht verarbeitet werden. Bitte rufen Sie uns an.';
}
