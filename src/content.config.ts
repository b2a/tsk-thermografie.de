import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const frage = z.object({ f: z.string(), a: z.string() });

const leistungen = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/leistungen' }),
  schema: z.object({
    titel: z.string(),
    /** kurzer Name für Listen und Navigation */
    kurztitel: z.string(),
    /** ein bis zwei Sätze für die Übersicht */
    kurz: z.string(),
    /** Meta-Beschreibung für Suchmaschinen (ca. 150 Zeichen) */
    beschreibung: z.string(),
    normen: z.array(z.string()).default([]),
    reihenfolge: z.number(),
    bild: z.string().optional(),
    bild_alt: z.string().optional(),
    fragen: z.array(frage).default([]),
  }),
});

export const collections = { leistungen };
