// Mode d'affichage des entrées (liste ou tuiles), mémorisé localement et partagé entre les pages.
export const VIEW_KEY = 'rn1pb:affichage';
export const VIEWS = ['liste', 'tuiles'];
export const DEFAULT_VIEW = 'liste';

export const normalizeView = (value) => (VIEWS.includes(value) ? value : DEFAULT_VIEW);

// Le stockage peut être absent, bloqué ou plein : on retombe alors sur le mode par défaut (liste), sans erreur.
// Seul un choix explicite (clic sur un bouton) est stocké puis respecté.
export function readView(storage) {
  try {
    return normalizeView(storage?.getItem(VIEW_KEY));
  } catch {
    return DEFAULT_VIEW;
  }
}

export function writeView(storage, view) {
  try {
    storage?.setItem(VIEW_KEY, normalizeView(view));
    return true;
  } catch {
    return false;
  }
}

// Le mode est porté par <html data-vue> : le CSS change la mise en page du même HTML.
export function applyView(root, view, buttons = []) {
  const current = normalizeView(view);
  root.dataset.vue = current;
  for (const button of buttons) button.setAttribute('aria-pressed', String(button.dataset.view === current));
  return current;
}
