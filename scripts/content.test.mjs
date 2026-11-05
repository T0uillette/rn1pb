import test from 'node:test';
import assert from 'node:assert/strict';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { VIEW_KEY, DEFAULT_VIEW, normalizeView, readView, writeView, applyView } from '../src/lib/view-mode.mjs';
import editorialMarkdown, { contentStats, sourceHost, textOf } from '../src/lib/content-tools.mjs';

test('les listes imbriquées, liens de référence et archives sont comptés', () => {
  assert.deepEqual(contentStats('- [Titre][source] [[A]](https://archive.fr)\n  - Sous-entrée\n\n[source]: https://source.fr'), { entries: 2, archives: 1 });
});

test('le Markdown libre reste disponible sans extraction JSON', () => {
  const tree = unified().use(remarkParse).parse('## Repère\n\nUn **paragraphe** libre.\n\n- [Titre](https://source.fr)');
  assert.equal(tree.children[0].type, 'heading');
  assert.equal(tree.children[1].type, 'paragraph');
});

test('les icônes conservent URL, libellés visibles et accessibles, et numéro', () => {
  const link = (label, href) => ({ type: 'element', tagName: 'a', properties: { href }, children: [{ type: 'text', value: label }] });
  const archive = link('[A1]', 'https://archive.fr');
  const text = link('[Texte complet]', 'https://texte.fr');
  const normal = link('Titre', 'www.source.fr');
  editorialMarkdown()({ type: 'root', children: [archive, text, normal] });
  assert.equal(archive.properties.href, 'https://archive.fr');
  assert.equal(archive.properties.ariaLabel, 'Consulter l’archive 1 (nouvel onglet)');
  assert.equal(archive.properties.title, undefined);
  assert.equal(archive.children[0].tagName, 'svg');
  assert.equal(archive.children[1].children[0].value, 'Consulter l’archive 1');
  assert.equal(text.properties.ariaLabel, 'Lire le texte complet (nouvel onglet)');
  assert.equal(text.children[1].children[0].value, 'Lire le texte complet');
  assert.equal(normal.properties.href, 'https://www.source.fr');
});

test('les listes compactes gardent leurs liens et les attributs de recherche', () => {
  const primary = { type: 'element', tagName: 'a', properties: { href: 'https://source.fr' }, children: [{ type: 'text', value: 'Un titre' }] };
  const archive = { type: 'element', tagName: 'a', properties: { href: 'https://texte.fr' }, children: [{ type: 'text', value: '[Texte complet]' }] };
  const item = { type: 'element', tagName: 'li', properties: {}, children: [primary, { type: 'text', value: ' ' }, archive] };
  const root = { type: 'root', children: [{ type: 'element', tagName: 'ul', properties: {}, children: [item] }] };
  editorialMarkdown()(root);
  assert.equal(item.properties['data-archive'], '1');
  assert.match(item.properties['data-text'], /Un titre/);
  assert.deepEqual(primary.properties.className, ['entry-title']);
  assert.equal(item.children[0].tagName, 'div');
  assert.equal(archive.properties.href, 'https://texte.fr');
});

test('le domaine de la source est affiché avant les archives', () => {
  assert.equal(sourceHost('https://www.lemonde.fr/politique/article'), 'lemonde.fr');
  assert.equal(sourceHost('www.exemple.org/page'), 'exemple.org');
  assert.equal(sourceHost('pas une url'), '');
  const primary = { type: 'element', tagName: 'a', properties: { href: 'https://www.lemonde.fr/a' }, children: [{ type: 'text', value: 'Titre' }] };
  const archive = { type: 'element', tagName: 'a', properties: { href: 'https://archive.ph/x' }, children: [{ type: 'text', value: '[A]' }] };
  const item = { type: 'element', tagName: 'li', properties: {}, children: [primary, { type: 'text', value: ' ' }, archive] };
  editorialMarkdown()({ type: 'root', children: [{ type: 'element', tagName: 'ul', properties: {}, children: [item] }] });
  const meta = item.children[0].children[1];
  assert.deepEqual(meta.properties.className, ['entry-meta']);
  assert.equal(meta.children[0].children[0].value, 'lemonde.fr');
  assert.deepEqual(meta.children.at(-1).properties.className, ['entry-actions']);
  assert.equal(meta.children.at(-1).children[0], archive);
});

test('les boutons sont regroupés à droite, texte complet avant les archives, précisions après la source', () => {
  const link = (label, href) => element('a', { href }, [text(label)]);
  const primary = link('Titre', 'https://source.fr/a');
  const archive = link('[A]', 'https://archive.ph/x');
  const full = link('[Texte complet]', 'https://reddit.com/x');
  const item = element('li', {}, [primary, text(' '), archive, text(' '), full, text(' (lien à vérifier)')]);
  run([element('ul', {}, [item])]);
  const meta = item.children[0].children.at(-1);
  assert.deepEqual(meta.children.map((child) => child.properties.className[0]), ['entry-source', 'entry-note', 'entry-actions']);
  assert.deepEqual(meta.children[2].children, [full, archive]);
  assert.match(textOf(meta.children[1]), /lien à vérifier/);
});

const element = (tagName, properties, children) => ({ type: 'element', tagName, properties, children });
const text = (value) => ({ type: 'text', value });
const run = (children) => {
  const root = { type: 'root', children };
  editorialMarkdown()(root);
  return root;
};

test('les liens externes s’ouvrent dans un nouvel onglet et l’annoncent', () => {
  const external = element('a', { href: 'https://source.fr' }, [text('Titre')]);
  const archive = element('a', { href: 'https://archive.fr' }, [text('[A]')]);
  const internal = element('a', { href: '/rn1pb_astro/methode/' }, [text('Méthode')]);
  const anchor = element('a', { href: '#haut' }, [text('Haut')]);
  run([external, archive, internal, anchor]);
  for (const link of [external, archive]) {
    assert.equal(link.properties.target, '_blank');
    assert.deepEqual(link.properties.rel, ['noopener', 'noreferrer']);
  }
  assert.match(external.children.at(-1).children[0].value, /nouvel onglet/);
  assert.match(archive.properties.ariaLabel, /nouvel onglet/);
  for (const link of [internal, anchor]) {
    assert.equal(link.properties.target, undefined);
    assert.equal(link.children.length, 1);
  }
});

test('la légende affiche les mêmes icônes que les liens, sans lien ni ancien jeton', () => {
  const code = (value) => element('code', {}, [text(value)]);
  const archive = code('[A]');
  const numbered = code('[A2]');
  const full = code('[Texte complet]');
  const block = element('pre', {}, [code('[A]')]);
  const link = element('a', { href: 'https://archive.fr' }, [text('[A]')]);
  run([element('p', {}, [archive, numbered, full]), block, link]);
  for (const icon of [archive, numbered, full]) {
    assert.equal(icon.tagName, 'span');
    assert.equal(icon.properties.role, 'img');
    assert.ok(icon.properties.className.includes('legend-icon'));
    assert.equal(icon.children[0].tagName, 'svg');
    assert.equal(icon.properties.href, undefined);
    assert.equal(icon.properties['data-tip'], undefined);
  }
  assert.equal(numbered.children[1].children[0].value, '2');
  assert.deepEqual(archive.children[0], link.children[0]);
  assert.equal(block.children[0].tagName, 'code');
});

test('un lien seul en gras devient un bouton d’action', () => {
  const link = element('a', { href: 'https://www.reddit.com/r/rn1pb/submit' }, [text('Publier')]);
  const paragraph = element('p', {}, [element('strong', {}, [link])]);
  const mixed = element('p', {}, [text('Voir '), element('strong', {}, [element('a', { href: '#x' }, [text('ici')])])]);
  run([paragraph, mixed]);
  assert.deepEqual(paragraph.properties.className, ['action']);
  assert.equal(paragraph.children[0], link);
  assert.ok(link.properties.className.includes('btn'));
  assert.equal(link.properties.target, '_blank');
  assert.equal(mixed.properties.className, undefined);
});

test('une liste dont les éléments commencent par un titre devient une suite d’étapes', () => {
  const step = element('li', {}, [element('h3', {}, [text('Étape')]), element('p', {}, [text('Voir la '), element('a', { href: '../recherche/' }, [text('Recherche')])])]);
  const list = element('ol', {}, [step]);
  run([list]);
  assert.deepEqual(list.properties.className, ['steps']);
  assert.equal(step.properties.className, undefined);
  assert.equal(step.children[1].tagName, 'p');
});

test('chaque titre de niveau 2 ouvre une section', () => {
  const root = run([element('p', {}, [text('Intro')]), element('h2', {}, [text('A')]), element('p', {}, [text('a')]), element('h2', {}, [text('B')])]);
  assert.deepEqual(root.children.map((child) => child.tagName), ['p', 'section', 'section']);
  assert.equal(root.children[1].children.length, 2);
});

const memoryStorage = () => {
  const data = new Map();
  return { getItem: (k) => data.get(k) ?? null, setItem: (k, v) => void data.set(k, String(v)), data };
};
const toggleButtons = () => ['liste', 'tuiles'].map((view) => ({
  dataset: { view }, pressed: null, setAttribute(name, value) { if (name === 'aria-pressed') this.pressed = value; },
}));

test('le mode d’affichage par défaut est la liste et les valeurs inconnues sont ignorées', () => {
  assert.equal(DEFAULT_VIEW, 'liste');
  assert.equal(normalizeView('liste'), 'liste');
  assert.equal(normalizeView('tuiles'), 'tuiles');
  assert.equal(normalizeView('grille'), 'liste');
  assert.equal(normalizeView(null), 'liste');
  assert.equal(readView(memoryStorage()), 'liste');
});

test('un choix explicite est mémorisé puis respecté, une valeur invalide retombe sur la liste', () => {
  const storage = memoryStorage();
  assert.equal(writeView(storage, 'tuiles'), true);
  assert.equal(storage.data.get(VIEW_KEY), 'tuiles');
  assert.equal(readView(storage), 'tuiles');
  assert.equal(writeView(storage, 'liste'), true);
  assert.equal(readView(storage), 'liste');
  storage.data.set(VIEW_KEY, 'n’importe quoi');
  assert.equal(readView(storage), 'liste');
});

test('un stockage absent ou bloqué ne provoque aucune erreur', () => {
  const blocked = { getItem() { throw new Error('SecurityError'); }, setItem() { throw new Error('QuotaExceeded'); } };
  assert.equal(readView(blocked), 'liste');
  assert.equal(writeView(blocked, 'tuiles'), false);
  assert.equal(readView(undefined), 'liste');
  assert.equal(writeView(undefined, 'tuiles'), true);
});

test('le choix du mode met à jour <html data-vue> et les boutons aria-pressed', () => {
  const root = { dataset: {} };
  const buttons = toggleButtons();
  assert.equal(applyView(root, 'liste', buttons), 'liste');
  assert.equal(root.dataset.vue, 'liste');
  assert.deepEqual(buttons.map((b) => b.pressed), ['true', 'false']);
  applyView(root, 'tuiles', buttons);
  assert.equal(root.dataset.vue, 'tuiles');
  assert.deepEqual(buttons.map((b) => b.pressed), ['false', 'true']);
  applyView(root, 'invalide', buttons);
  assert.equal(root.dataset.vue, 'liste');
});
