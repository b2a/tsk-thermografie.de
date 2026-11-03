#!/usr/bin/env bash
# Richtet die neue Website auf dem All-Inkl-Webspace ein (einmalig, gefahrlos
# wiederholbar). Nur per FTP, ohne SSH:
#   scripts/server-einrichten.sh [https://neu.tsk-thermografie.de]
#
# Legt an:
#   /tsk-website/                    Website (Ziel von GitHub Actions)
#   /tsk-website/wp-content/uploads  Verknüpfung auf /wp-content/uploads (Bilder aus WordPress)
#   /tsk-intern/                     Konfiguration und gesicherte Anfragen (Web-Zugriff gesperrt)
# Löscht nichts.
set -euo pipefail
cd "$(dirname "$0")/.."
. scripts/lib-ftp.sh
URL=${1:-https://neu.tsk-thermografie.de}
TMP=$(mktemp -d)

echo "▸ Ordner anlegen"
ftp_mkdir tsk-website; ftp_mkdir tsk-website/wp-content; ftp_mkdir tsk-intern

echo "▸ Interner Ordner: Web-Zugriff sperren"
printf 'Require all denied\n' > "$TMP/.htaccess"
ftp_hoch "$TMP/.htaccess" tsk-intern/.htaccess

if ftp_liste tsk-intern/ | grep -qx konfig.php; then
  echo "✓ konfig.php ist schon vorhanden – bleibt unverändert"
else
  echo "▸ konfig.php anlegen (mit neuem Schlüssel)"
  SCHLUESSEL=$(head -c 32 /dev/urandom | base64)
  cat > "$TMP/konfig.php" <<KONFIG
<?php
// Konfiguration der Formular-Schnittstelle (nicht im Git-Repository)
return [
    'website_url' => 'https://tsk-thermografie.de',
    // weitere Adressen, von denen das Formular abgeschickt werden darf (Testdomain)
    'weitere_herkuenfte' => ['$URL'],
    // TESTPHASE: nur an die Test-Adresse. Nach der Abnahme auf klingelhoefer@tsk-thermografie.de umstellen.
    'empfaenger' => ['web@4ndre.de'],
    'absender' => 'klingelhoefer@tsk-thermografie.de',
    'max_pro_stunde' => 5,
    // Schlüssel für die verschlüsselte Ablage (auch lokal in .env als FORMULAR_SCHLUESSEL)
    'formular_schluessel' => '$SCHLUESSEL',
];
KONFIG
  ftp_hoch "$TMP/konfig.php" tsk-intern/konfig.php
  grep -q '^FORMULAR_SCHLUESSEL' .env 2>/dev/null || printf '\nFORMULAR_SCHLUESSEL=%s\n' "$SCHLUESSEL" >> .env
  echo "✓ Schlüssel zusätzlich in .env gespeichert (FORMULAR_SCHLUESSEL)"
fi

echo "▸ Bilder-Verknüpfung anlegen (einmaliges Skript, löscht sich selbst)"
NAME="einrichten-$(openssl rand -hex 10).php"
cat > "$TMP/$NAME" <<'PHP'
<?php
header('Content-Type: text/plain; charset=utf-8');
$ziel = __DIR__ . '/tsk-website/wp-content/uploads';
if (!file_exists($ziel) && !is_link($ziel)) echo symlink('../../wp-content/uploads', $ziel) ? "VERKNUEPFT\n" : "FEHLER\n";
else echo "VORHANDEN\n";
@chmod(__DIR__ . '/tsk-intern/konfig.php', 0600);
@unlink(__FILE__);
PHP
ftp_hoch "$TMP/$NAME" "$NAME"
curl -sS "https://tsk-thermografie.de/$NAME"
ftp_liste "" | grep -q "^$NAME$" && echo "! Einmal-Skript noch vorhanden – bitte $NAME löschen" || echo "✓ Einmal-Skript entfernt"
rm -rf "$TMP"
echo "EINGERICHTET"
