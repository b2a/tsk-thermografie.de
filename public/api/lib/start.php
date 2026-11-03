<?php
// Gemeinsame Grundlagen der Formular-Schnittstelle.
// Konfiguration und Daten liegen außerhalb des Website-Ordners in tsk-intern/
// (siehe scripts/server-einrichten.sh) und sind nie über das Web erreichbar.
declare(strict_types=1);

define('TSK_INTERN', getenv('TSK_INTERN') ?: dirname(__DIR__, 3) . '/tsk-intern');

function konfig(string $schluessel, $standard = null)
{
    static $k = null;
    if ($k === null) {
        $datei = TSK_INTERN . '/konfig.php';
        $k = is_file($datei) ? require $datei : [];
    }
    return $k[$schluessel] ?? $standard;
}

function antwort(array $daten, int $code = 200): void
{
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($daten, JSON_UNESCAPED_UNICODE);
    exit;
}

function client_ip(): string
{
    return (string)($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0');
}

function datenordner(string $name): string
{
    $ordner = TSK_INTERN . '/' . $name;
    if (!is_dir($ordner)) {
        mkdir($ordner, 0700, true);
        file_put_contents("$ordner/.htaccess", "Require all denied\n");
    }
    return $ordner;
}
