#!/usr/bin/env bash
# Änderungen sicher veröffentlichen:
#   scripts/aktualisieren.sh     (oder: npm run aktualisieren)
#
# 1. holt den Stand von GitHub und setzt deine Commits darauf,
# 2. aktualisiert den Bild-Index, wenn neue Bilder verlinkt wurden,
# 3. baut die Website testweise – nur wenn das klappt, wird gepusht.
# GitHub Actions baut dann und lädt per FTPS hoch (ca. 1–2 Minuten).
set -euo pipefail
cd "$(dirname "$0")/.."
ROT=$'\e[31m'; GRUEN=$'\e[32m'; FETT=$'\e[1m'; AUS=$'\e[0m'
info() { printf '%s▸ %s%s\n' "$FETT" "$*" "$AUS"; }
ok()   { printf '%s✓ %s%s\n' "$GRUEN" "$*" "$AUS"; }
halt() { printf '%s✗ %s%s\n' "$ROT" "$*" "$AUS"; exit 1; }

[ "$(git rev-parse --abbrev-ref HEAD)" = main ] || halt "Bitte zuerst auf 'main' wechseln (git switch main)."
[ -z "$(git status --porcelain)" ] || halt "Es gibt noch nicht committete Änderungen. Erst committen: git add -A && git commit -m \"…\""

info "Hole den Stand von GitHub …"
git pull --rebase --quiet origin main || halt "Zusammenführen fehlgeschlagen. Konflikte lösen, dann 'git rebase --continue' – oder 'git rebase --abort'."

if [ -d uploadsRoot ]; then
  info "Bild-Index prüfen …"
  node scripts/bilder-index.mjs || halt "Ein verlinktes Bild fehlt in uploadsRoot/ (siehe oben). Bild per FTP nach /wp-content/uploads/ laden und lokal nach uploadsRoot/ kopieren."
  if [ -n "$(git status --porcelain src/data/bilder.json)" ]; then
    git add src/data/bilder.json && git commit --quiet -m "Bild-Index aktualisiert"
    ok "Bild-Index aktualisiert."
  fi
fi

info "Website testweise bauen …"
LOG=$(mktemp)
npm run --silent build >"$LOG" 2>&1 || { tail -30 "$LOG"; halt "Bau fehlgeschlagen – nichts hochgeladen. Protokoll: $LOG"; }
ok "Bau erfolgreich."

if [ "$(git rev-list --count origin/main..HEAD)" -eq 0 ]; then ok "Nichts Neues zu veröffentlichen."; exit 0; fi
info "Veröffentliche $(git rev-list --count origin/main..HEAD) Änderung(en) …"
git push --quiet origin main
ok "Hochgeladen. GitHub veröffentlicht die Website in 1–2 Minuten."
command -v gh >/dev/null && echo "   Fortschritt: gh run watch"
