# RN1PB? — interface Astro

Site statique Astro de **RN1PB?**, intégré dans la branche `ui_astra_update` du dépôt `rn1pb`. Le **contenu éditorial** et le **code du site** sont séparés.

```text
content/                     ← les fichiers à modifier au quotidien
  accueil.md                 # textes de l’accueil
  methode.md                 # page « Plus d’informations »
  pied-de-page.md            # texte « Échanger » (lien Reddit) affiché dans le pied de page de toutes les pages
  sections/                  # un Markdown par rubrique
    projet.md
    cadres.md
    ...
src/                         ← fonctionnement et présentation du site
  content.config.ts          # collections et validation des en-têtes
  components/                # recherche et filtres
  layouts/                   # structure générale
  pages/                     # gabarits, pas de liste de rubriques à maintenir
  lib/                       # décoration du Markdown, compteurs
  styles/                    # apparence
public/                      # images, favicon
scripts/                     # tests
```

**Aucun JSON à maintenir, aucune extraction à lancer.** Astro lit directement les Markdown de `content/`. Les fichiers du README initial ont été migrés ; le README d’origine n’est plus une source synchronisée. Le prototype MkDocs et les copies HTML locales d’archives ont été retirés de cette branche. Les liens d’archives externes sont conservés dans les articles.

## Prévisualiser

Avec Node.js **22.23.4 ou plus récent** (prérequis de la version d’Astro installée) :

```sh
npm ci
npm run dev
```

Ouvrir <http://127.0.0.1:4321/rn1pb/>. Chaque sauvegarde d’un Markdown actualise le site. Arrêter avec `Ctrl+C`. Si le prototype voisin occupe encore le port 4321, lancer `npm run dev -- --port 4322` et ouvrir <http://127.0.0.1:4322/rn1pb/>.

## Modifier ou ajouter une rubrique

Modifier le fichier correspondant dans `content/sections/`. Pour en ajouter une, créer par exemple `content/sections/environnement.md` :

```markdown
---
titre: "Environnement"
titre_court: "Environnement"
ordre: 10
description: "Sources concernant l’environnement et le climat."
---

Un paragraphe d’introduction, si nécessaire.

## Un sous-thème

- [Titre de l’article](https://exemple.fr/article) [[A]](https://exemple.fr/archive)
  - [Complément](https://exemple.fr/complement) [[Texte complet]](https://exemple.fr/texte)
```

- Le nom du fichier détermine l’URL : `/rubriques/environnement/`.
- `titre`, `ordre` et `description` sont obligatoires ; `titre_court` est facultatif (menu).
- `ordre` détermine la position dans le menu et sur l’accueil.
- **Page, menu, carte, recherche et compteurs sont générés automatiquement.** Aucune modification du code n’est nécessaire.
- Les titres, paragraphes, listes imbriquées, liens et mises en forme Markdown sont rendus directement.
- Les liens `[A]`, `[A1]` et `[Texte complet]` s’affichent sous forme d’icônes accessibles, sans changer leur URL.
- Le marqueur `(*)` reste dans le Markdown : il s’affiche comme une icône d’avertissement avec infobulle (signalement éditorial, pas qualification juridique) et reste filtrable. Le marqueur `~` n’existe plus.

Les dossiers portent des noms anglais ; le contenu et les métadonnées sont en français pour faciliter l’édition. Les URL publiques existantes `/rubriques/` sont conservées.

## Modifier l’accueil

Tout se passe dans `content/accueil.md` : le petit en-tête configure le titre, l’accroche et le titre de la grille. Le corps Markdown apparaît sous les cartes automatiques. Dans ce corps, `[A]`, `[A2]` et `[Texte complet]` écrits entre accents graves (code) s’affichent comme les mêmes icônes que les liens du site, sans lien : c’est ce qui sert à la légende. La disposition visuelle et les boutons fonctionnels restent dans les gabarits `src/`.

Le guide de maintenance est ce fichier `ASTRO.md`, non publié. Aucun lien « Contribuer » n’est ajouté au site.

## Charte graphique

Ton : militant par la clarté des titres et du propos. Tout est dans `src/styles/global.css` (variables en tête de fichier).

- **Deux registres, volontairement séparés** : l’**accueil** (`body.is-home`, bloc de fin de `global.css`, prop `home` de `Base.astro`) garde l’affiche militante : bandeau sombre, titre en plaque brique, capitales épaisses, cartes à bord net, crème/encre/brique avec un ocre discret. Les **sous-pages** (rubriques, recherche, méthode, 404) restent sobres : tout ce qui suit.
- **Typographie** : une seule famille sans-serif système, pour les titres, introductions, articles et interface. Aucune police ni service externe. Le monospace n’est utilisé que pour le code éventuel dans les textes éditoriaux.
- **Couleurs** : gris charbon et blanc cassé (clair et sombre), bordures fines, **un seul accent rouge brique** réservé aux actions, à l’état actif (navigation, filtres) et à l’avertissement `(*)`. Pas d’ocre, de jaune ni de fonds teintés.
- **Marque** : texte **RN1PB?** seul dans l’en-tête, sans logo. Le favicon (`public/favicon.svg`) est typographique : « RN » puis « 1PB » sur deux lignes, carré charbon, pour rester lisible en petit.
- **Accueil** : titre, accroche, deux actions et trois compteurs calculés depuis les Markdown (entrées, rubriques, archives), puis le sommaire numéroté des rubriques. Pas de jaune vif, de pointillés ni de hachures.
- **Entrées** : titre de l’article, domaine de la source en texte discret (calculé depuis le lien, dans `src/lib/content-tools.mjs`), icônes d’archive et icône `(*)` (le texte `(*)` reste dans le Markdown).
- **Icônes d’archive / texte complet** : infobulle immédiate « Consulter l’archive » (avec numéro) ou « Lire le texte complet », au survol et au focus clavier (`data-tip`, pas de `title` natif retardé). L’`aria-label` garde en plus la mention « nouvel onglet ». Les icônes de la légende de l’accueil ne sont pas des liens et n’ont pas d’infobulle.
- **Liens externes** : ouverts dans un nouvel onglet (`target="_blank"`, `rel="noopener noreferrer"`), annoncés aux lecteurs d’écran.
- **À éviter** : badges « vérifié », statistiques non calculées, hachures, motifs, jaune vif ; sur les sous-pages : serif, plaques, cadres épais, accents supplémentaires.

## Affichage en liste ou en tuiles

Les pages de recherche et de rubriques proposent deux boutons « Liste » / « Tuiles » (`aria-pressed`). Les **tuiles** sont le mode par défaut ; seul un choix explicite « Liste » est mémorisé puis respecté. Le choix est mémorisé dans `localStorage` (clé `rn1pb:affichage`), donc partagé entre toutes les pages et onglets du site.

- Même HTML pour les deux modes : un script court dans `<head>` (`Base.astro`) pose `data-vue` sur `<html>` avant l’affichage, puis le CSS (`html:not([data-vue='liste'])` dans `global.css`) transforme chaque liste Markdown de premier niveau en grille. Les compléments imbriqués restent dans la tuile de leur entrée parente. Titres, paragraphes et listes libres ne sont pas touchés.
- Sans JavaScript, les boutons restent masqués et les tuiles s’affichent (le CSS ne cible que `data-vue='liste'` pour revenir à la liste) : tout le contenu reste lisible. Sans préférence enregistrée, avec une valeur invalide ou avec un `localStorage` bloqué ou absent, c’est le mode tuiles, sans erreur.
- Filtres, compteur et message « aucun résultat » fonctionnent de la même façon dans les deux modes. L’accueil n’est pas concerné.
- Logique de sélection et de mémorisation : `src/lib/view-mode.mjs` (testée dans `scripts/content.test.mjs`) ; boutons et écouteurs : `src/components/Filters.astro`.

## Cache de rendu Markdown

`astro.config.mjs` ajoute l’empreinte de `src/lib/content-tools.mjs` à la configuration du plugin Markdown. Astro compare sa configuration d’un build à l’autre : modifier le plugin vide donc automatiquement le cache des contenus (message « Clearing content store »). Il n’y a plus besoin de supprimer `.astro/`. Un serveur `npm run dev` déjà lancé doit toutefois être relancé après modification du plugin (`npx astro dev stop`, puis `npm run dev -- --background --force`).

L’aperçu local n’affiche pas la barre d’outils d’Astro (`devToolbar.enabled: false` dans `astro.config.mjs`) ; elle n’existe de toute façon pas en production.

## Vérifier et construire

```sh
npm run build
npm run check
npm run preview
```

Le build génère `dist/` et valide les en-têtes des fichiers. `check` teste le traitement du contenu puis vérifie que les liens des Markdown sont présents dans leurs pages et dans la recherche. Ces tests ne vérifient pas la disponibilité des sites externes ni l’exactitude des articles.

## GitHub Pages

Le site est statique. La configuration accepte :

| Variable | Défaut | Exemple |
|---|---|---|
| `ASTRO_SITE` | `http://127.0.0.1:4321` | `https://T0uillette.github.io` |
| `ASTRO_BASE` | `/rn1pb` | `/` pour un domaine personnalisé |

Le workflow `.github/workflows/deploy.yml` peut construire et publier le site après activation de GitHub Pages / GitHub Actions. Il cible la branche principale `master` ou un lancement manuel : aucun déploiement automatique n’est déclenché par un push de `ui_astra_update`. Aucun changement de la configuration Pages distante n’est effectué par cette migration locale.

Les archives HTML historiques volumineuses ne sont pas embarquées : les liens d’archives externes sont conservés. La recherche et les filtres tournent dans le navigateur, sans service externe ni police distante.
