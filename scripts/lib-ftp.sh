# Gemeinsame FTP-Helfer: liest die Zugangsdaten aus .env
# (Zeilen "FTP-Hostname = …", "FTP-Login-Name = …", "FTP-Passwort = …").
# Verbindung immer verschlüsselt über den Servernamen von All-Inkl.
env_wert() { grep -E "^$1" .env | head -1 | sed -E 's/^[^=]*=[[:space:]]*//; s/[[:space:]]*$//'; }
FTP_SERVER=${FTP_SERVER:-w0078409.kasserver.com}
NETRC=$(mktemp)
trap 'rm -f "$NETRC"' EXIT
printf 'machine %s login %s password %s\n' "$FTP_SERVER" "$(env_wert FTP-Login)" "$(env_wert FTP-Passwort)" > "$NETRC"
chmod 600 "$NETRC"
ftp_cmd() { curl -sS --ssl-reqd --netrc-file "$NETRC" "$@"; }
ftp_mkdir() { ftp_cmd "ftp://$FTP_SERVER/" -Q "MKD $1" -o /dev/null 2>/dev/null || true; }
ftp_hoch() { ftp_cmd -T "$1" "ftp://$FTP_SERVER/$2"; }
ftp_liste() { ftp_cmd "ftp://$FTP_SERVER/$1" -l; }
