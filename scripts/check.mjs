// Vérifie les liens des Markdown locaux dans leurs pages construites.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const stripFrontmatter = (text) => text.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
let count = 0;
const missing = [];
const sources = readdirSync(resolve(root, 'content/sections'))
  .filter((name) => name.endsWith('.md'))
  .map((name) => ({ source: `content/sections/${name}`, page: `rubriques/${name.slice(0, -3)}/index.html`, search: true }));
sources.push(
  { source: 'content/accueil.md', page: 'index.html' },
  { source: 'content/methode.md', page: 'methode/index.html' },
  { source: 'content/proposer.md', page: 'proposer/index.html' },
  { source: 'content/proposer-encadre.md', page: 'proposer/index.html' },
  { source: 'content/pied-de-page.md', page: 'index.html' },
  { source: 'content/pied-de-page.md', page: 'liste/index.html' },
);
for (const { source, page, search } of sources) {
  const path = resolve(root, 'dist', page);
  if (!existsSync(path)) throw new Error(`Page absente : ${page}. Relancer npm run build.`);
  const targets = [readFileSync(path, 'utf8')];
  if (search) targets.push(readFileSync(resolve(root, 'dist/liste/index.html'), 'utf8'));
  const tree = unified().use(remarkParse).parse(stripFrontmatter(readFileSync(resolve(root, source), 'utf8')));
  function visit(node) {
    if (node.type === 'link' && /^(https?:|www\.)/.test(node.url)) {
      count++;
      const url = node.url.startsWith('www.') ? `https://${node.url}` : node.url;
      const variants = [url, url.replaceAll('&', '&#38;'), url.replaceAll('&', '&amp;'), url.replaceAll('&', '&#x26;')];
      if (targets.some((html) => !variants.some((value) => html.includes(value)))) missing.push(`${source} : ${url}`);
    }
    node.children?.forEach(visit);
  }
  visit(tree);
}
console.log(`${count} liens éditoriaux vérifiés dans les pages et la liste, ${missing.length} absents.`);
if (missing.length) { console.error(missing.join('\n')); process.exit(1); }
