import { getCollection, getEntry } from 'astro:content';
import { contentStats } from '../lib/content-tools.mjs';

export const getSections = async () => (await getCollection('sections'))
  .sort((a, b) => a.data.ordre - b.data.ordre || a.id.localeCompare(b.id))
  .map((entry) => {
    const stats = contentStats(entry.body ?? '');
    return {
      entry,
      slug: entry.id,
      title: entry.data.titre,
      short: entry.data.titre_court ?? entry.data.titre,
      description: entry.data.description,
      count: stats.entries,
      archives: stats.archives,
    };
  });

export async function editorialPage(id: string) {
  const page = await getEntry('pages', id);
  if (!page) throw new Error(`Page manquante : content/${id}.md`);
  return page;
}

export const totals = (sections: Awaited<ReturnType<typeof getSections>>) => ({
  entries: sections.reduce((n, s) => n + s.count, 0),
  sections: sections.length,
  archives: sections.reduce((n, s) => n + s.archives, 0),
});

export const url = (path = '') => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
};
