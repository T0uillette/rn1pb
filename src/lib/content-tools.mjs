import { unified } from 'unified';
import remarkParse from 'remark-parse';

// Libellés partagés entre les liens d'archive et les icônes de la légende.
const archiveTitle = (number) => `Consulter l’archive${number ? ` ${number}` : ''}`;
const FULL_TEXT_TITLE = 'Lire le texte complet';

export function textOf(node) {
  return node.value ?? (node.children ?? []).map(textOf).join('');
}

export function contentStats(markdown) {
  const root = unified().use(remarkParse).parse(markdown);
  let entries = 0;
  let archives = 0;
  function visit(node) {
    if (node.type === 'listItem') entries++;
    if (node.type === 'link' && /^\[(?:A\d*|Texte complet|\(.*\))\]$/.test(textOf(node))) archives++;
    node.children?.forEach(visit);
  }
  visit(root);
  return { entries, archives };
}

const svg = (text) => ({
  type: 'element', tagName: 'svg',
  properties: { viewBox: '0 0 24 24', ariaHidden: 'true', focusable: 'false' },
  children: [{
    type: 'element', tagName: 'path',
    properties: {
      d: text ? 'M14 3H5v18h14V8zM14 3v5h5M8 12h8M8 15h8M8 18h5' : 'M3 3h18v5H3zM5 8v13h14V8M9 12h6',
      fill: 'none', stroke: 'currentColor', strokeWidth: '1.8',
      strokeLinecap: 'round', strokeLinejoin: 'round',
    }, children: [],
  }],
});

export const FASCISM_LABEL = 'Signalement éditorial de la compilation : idéologie directement en lien avec l’idéologie fasciste. Ce n’est pas une qualification juridique.';
export const NEW_TAB = 'nouvel onglet';

const warningIcon = () => ({
  type: 'element', tagName: 'svg',
  properties: { viewBox: '0 0 24 24', ariaHidden: 'true', focusable: 'false' },
  children: [{
    type: 'element', tagName: 'path',
    properties: {
      d: 'M12 3.5 2.5 20h19zM12 10v4.5M12 17.2v.3',
      fill: 'none', stroke: 'currentColor', strokeWidth: '2',
      strokeLinecap: 'round', strokeLinejoin: 'round',
    }, children: [],
  }],
});

// Remplace chaque « (*) » du texte par une icône focusable à infobulle, sans toucher au Markdown.
function fascismMarker() {
  return {
    type: 'element', tagName: 'span',
    properties: { className: ['mark', 'mark-fascisme'], role: 'img', tabIndex: 0, ariaLabel: FASCISM_LABEL, 'data-tip': FASCISM_LABEL },
    children: [warningIcon()],
  };
}

function markText(children) {
  return children.flatMap((child) => {
    if (child.type !== 'text' || !child.value.includes('(*)')) return [child];
    return child.value.split('(*)').flatMap((part, i) => [
      ...(i ? [fascismMarker()] : []),
      ...(part ? [{ type: 'text', value: part }] : []),
    ]);
  });
}

const isExternal = (href) => /^https?:\/\//.test(String(href ?? ''));

// Nom de domaine du lien principal, affiché pour mettre la source en avant.
export function sourceHost(href) {
  try {
    const value = String(href ?? '');
    return new URL(value.startsWith('www.') ? `https://${value}` : value).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

// Décore le HTML Markdown sans modifier les fichiers éditoriaux.
export default function editorialMarkdown() {
  return (tree) => {
    function visit(node, parent) {
      if (node.tagName === 'a') {
        const label = textOf(node);
        const archive = label.match(/^\[A(\d*)\]$/);
        const fullText = label === '[Texte complet]';
        if (archive || fullText) {
          const title = fullText ? FULL_TEXT_TITLE : archiveTitle(archive[1]);
          node.properties = { ...node.properties, className: ['chip', 'chip-archive', 'icon-link'], 'data-tip': title, ariaLabel: title };
          node.children = [svg(fullText)];
          if (archive?.[1]) node.children.push({ type: 'element', tagName: 'sup', properties: { ariaHidden: 'true' }, children: [{ type: 'text', value: archive[1] }] });
        }
        if (String(node.properties?.href).startsWith('www.')) node.properties.href = `https://${node.properties.href}`;
        if (isExternal(node.properties?.href)) {
          node.properties = { ...node.properties, target: '_blank', rel: ['noopener', 'noreferrer'] };
          if (node.properties.ariaLabel) {
            node.properties.ariaLabel = `${node.properties.ariaLabel} (${NEW_TAB})`;
          } else {
            node.children.push({ type: 'element', tagName: 'span', properties: { className: ['sr'] }, children: [{ type: 'text', value: ` (${NEW_TAB})` }] });
          }
        }
      }

      // Dans un texte éditorial, `[A]`, `[A2]` ou `[Texte complet]` en code devient la même icône que les liens,
      // sans lien : sert à la légende de l'accueil.
      if (node.tagName === 'code' && parent?.tagName !== 'pre') {
        const code = textOf(node);
        const legendArchive = code.match(/^\[A(\d*)\]$/);
        const legendFullText = code === '[Texte complet]';
        if (legendArchive || legendFullText) {
          node.tagName = 'span';
          node.properties = {
            className: ['chip', 'chip-archive', 'icon-link', 'legend-icon'], role: 'img',
            ariaLabel: legendFullText ? 'Icône du lien vers le texte complet' : 'Icône du lien d’archive',
          };
          node.children = [svg(legendFullText)];
          if (legendArchive?.[1]) node.children.push({ type: 'element', tagName: 'sup', properties: { ariaHidden: 'true' }, children: [{ type: 'text', value: legendArchive[1] }] });
          return;
        }
      }

      if (node.tagName === 'ul' || node.tagName === 'ol') {
        node.properties = { ...node.properties, className: [parent?.tagName === 'li' ? 'children' : 'entries'] };
      }
      if (node.tagName === 'li') {
        // Une liste Markdown compacte n'a pas de balise <p> autour de son texte.
        if (!node.children.some((child) => child.tagName === 'p')) {
          const inline = node.children.filter((child) => !['ul', 'ol'].includes(child.tagName));
          const nested = node.children.filter((child) => ['ul', 'ol'].includes(child.tagName));
          node.children = [{ type: 'element', tagName: 'p', properties: {}, children: inline }, ...nested];
        }
        const paragraph = node.children.find((child) => child.tagName === 'p');
        const links = paragraph?.children.filter((child) => child.tagName === 'a') ?? [];
        const primary = links[0];
        const plain = textOf(node);
        node.properties = {
          ...node.properties, className: ['entry'],
          'data-text': plain + ' ' + links.map((link) => link.properties.href).join(' '),
          'data-fascisme': plain.includes('(*)') ? '1' : '0',
          'data-archive': links.some((link) => /^\[(?:A\d*|Texte complet|\(.*\))\]$/.test(textOf(link))) ? '1' : '0',
        };
        if (paragraph && primary) {
          primary.properties = { ...primary.properties, className: ['entry-title'] };
          const index = paragraph.children.indexOf(primary);
          const before = paragraph.children.slice(0, index);
          const after = paragraph.children.slice(index + 1);
          paragraph.tagName = 'div';
          paragraph.properties = { className: ['entry-main'] };
          paragraph.children = [...before, primary];
          const host = sourceHost(primary.properties?.href);
          const meta = host ? [{
            type: 'element', tagName: 'span', properties: { className: ['entry-source'] },
            children: [{ type: 'text', value: host }],
          }] : [];
          if (meta.length || after.some((child) => textOf(child).trim())) paragraph.children.push({
            type: 'element', tagName: 'div', properties: { className: ['entry-meta'] }, children: [...meta, ...after],
          });
        }
      }
      if (node.children && !['a', 'svg', 'code', 'pre'].includes(node.tagName)) node.children = markText(node.children);
      node.children?.forEach((child) => visit(child, node));
    }
    visit(tree);
  };
}
