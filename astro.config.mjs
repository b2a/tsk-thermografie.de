import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Adresse der Website. Für die Testdomain in GitHub (Variable WEBSITE_URL) setzen.
const SITE = process.env.WEBSITE_URL ?? 'https://tsk-thermografie.de';

// Alte WordPress-Adressen auf die neuen Seiten umleiten (zusätzlich zu public/.htaccess).
const redirects = {
  '/privacy-policy': '/datenschutz/',
  '/zertifikate': '/ueber-uns/#zertifikate',
  '/home': '/',
  '/hello-world': '/',
};

export default defineConfig({
  site: SITE,
  trailingSlash: 'ignore',
  redirects,
  integrations: [sitemap({ filter: (seite) => !/\/(danke|404)\/?$/.test(seite) })],
  markdown: { syntaxHighlight: false },
  // Strenge Content-Security-Policy: Astro ergänzt Hashes für eigene Skripte.
  // Keine Inline-Styles: CSS kommt als Datei, Skripte als Module.
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        'upgrade-insecure-requests',
      ],
      styleDirective: { resources: ["'self'"] },
      scriptDirective: { resources: ["'self'"] },
    },
  },
  build: { inlineStylesheets: 'never', format: 'directory' },
  vite: { build: { assetsInlineLimit: 0 } },
});
