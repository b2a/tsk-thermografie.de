// Anfrageformular: Prüfung beim Verlassen eines Feldes, Absenden per fetch,
// verständliche Fehlermeldungen. Ohne JavaScript funktioniert das Formular
// trotzdem (normales POST an /api/anfrage.php mit Weiterleitung).

export function formular(form: HTMLFormElement) {
  const start = Date.now();
  const startFeld = form.querySelector<HTMLInputElement>('input[name="start"]');
  if (startFeld) startFeld.value = String(start);
  const meldung = form.querySelector<HTMLElement>('[data-meldung]')!;
  const knopf = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const danke = form.dataset.danke ?? '/kontakt/danke/';

  const fehler = (feld: HTMLInputElement, text: string | null) => {
    const id = `${feld.id}-fehler`;
    let hinweis = document.getElementById(id);
    if (!text) {
      hinweis?.remove();
      feld.removeAttribute('aria-invalid');
      feld.setAttribute('aria-describedby', feld.dataset.hilfe ?? '');
      return;
    }
    if (!hinweis) {
      hinweis = document.createElement('p');
      hinweis.id = id;
      hinweis.className = 'feld-fehler';
      feld.closest('.feld')!.append(hinweis);
    }
    hinweis.textContent = text;
    feld.setAttribute('aria-invalid', 'true');
    feld.setAttribute('aria-describedby', [feld.dataset.hilfe, id].filter(Boolean).join(' '));
  };

  const pruefe = (feld: HTMLInputElement) => {
    let text: string | null = null;
    if (feld.validity.valueMissing) text = feld.type === 'email' ? 'Bitte Ihre E-Mail-Adresse eintragen, damit wir antworten können.' : 'Bitte ausfüllen.';
    else if (feld.validity.typeMismatch) text = 'Bitte eine gültige E-Mail-Adresse eintragen, z. B. name@firma.de.';
    else if (feld.validity.tooShort) text = `Bitte etwas ausführlicher – mindestens ${feld.minLength} Zeichen.`;
    fehler(feld, text);
    return !text;
  };

  const felder = () => [...form.querySelectorAll<HTMLInputElement>('input:not([type=hidden]):not([name=webseite]), select, textarea')];
  for (const feld of felder()) {
    feld.addEventListener('blur', () => { if (feld.value || feld.hasAttribute('aria-invalid')) pruefe(feld); });
    feld.addEventListener('input', () => { if (feld.hasAttribute('aria-invalid')) pruefe(feld); });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const falsch = felder().filter((f) => !pruefe(f));
    if (falsch.length) {
      meldung.className = 'meldung fehler';
      meldung.textContent = falsch.length === 1 ? 'Ein Feld ist noch nicht vollständig.' : `${falsch.length} Felder sind noch nicht vollständig.`;
      falsch[0].focus();
      return;
    }
    const daten = Object.fromEntries(new FormData(form));
    knopf.disabled = true;
    const text = knopf.textContent;
    knopf.textContent = 'Anfrage wird gesendet …';
    meldung.className = 'meldung';
    meldung.textContent = '';
    try {
      const r = await fetch(form.action, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(daten) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.fehler ?? 'Die Anfrage konnte nicht gesendet werden.');
      location.href = danke;
    } catch (err) {
      meldung.className = 'meldung fehler';
      meldung.textContent = `${(err as Error).message} Ihre Eingaben sind noch da. Sie erreichen uns auch telefonisch.`;
      meldung.focus();
      knopf.disabled = false;
      knopf.textContent = text;
    }
  });
}
