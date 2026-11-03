import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import editorialMarkdown from './src/lib/content-tools.mjs';

// Empreinte du plugin Markdown : elle entre dans la configuration hachée par Astro, ce qui
// invalide le cache des contenus rendus dès que src/lib/content-tools.mjs change.
const markdownRevision = createHash('sha256').update(readFileSync(new URL('./src/lib/content-tools.mjs', import.meta.url))).digest('hex').slice(0, 12);

// Adaptable au déploiement : ASTRO_SITE / ASTRO_BASE (GitHub Pages sous /rn1pb/).
const site = process.env.ASTRO_SITE ?? 'http://127.0.0.1:4321';
const base = process.env.ASTRO_BASE ?? '/rn1pb';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  markdown: { processor: unified({ rehypePlugins: [[editorialMarkdown, { revision: markdownRevision }]] }) },
  server: { host: '127.0.0.1', port: 4321 },
  devToolbar: { enabled: false },
});
