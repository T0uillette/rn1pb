import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const sections = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/sections' }),
  schema: z.object({
    titre: z.string().min(1),
    ordre: z.number().int(),
    description: z.string().min(1),
    titre_court: z.string().optional(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './content' }),
  schema: z.object({
    titre: z.string().min(1),
    description: z.string().min(1),
    surtitre: z.string().optional(),
    titre_accent: z.string().optional(),
    accroche: z.string().optional(),
    titre_rubriques: z.string().optional(),
  }),
});

export const collections = { sections, pages };
