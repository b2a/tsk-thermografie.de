import type { APIRoute } from 'astro';
// KI-Crawler sind ausdrücklich erlaubt, damit Assistenten die Firma korrekt nennen können.
export const GET: APIRoute = ({ site }) => new Response(`User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${new URL('/sitemap-index.xml', site).href}
`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
