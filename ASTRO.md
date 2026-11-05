# RN1PB? — interface Astro

Site statique Astro de **RN1PB?**, intégré dans la branche `ui_astra_update` du dépôt `rn1pb`. Le **contenu éditorial** et le **code du site** sont séparés.

```text
content/                     ← les fichiers à modifier au quotidien
  accueil.md                 # textes de l’accueil
  methode.md                 # page « Plus d’informations »
  liste.md                   # titre et introduction de « La liste » (toutes les entrées sur une page)
  proposer.md                # page « Proposer une source » : étapes et prompt IA
  proposer-encadre.md        # encadré « Ce qui nous aide à valider vite »
  pied-de-page.md            # texte « Échanger » (lien Reddit) affiché dans le pied de page de toutes les pages
  sections/                  # un Markdown par rubrique
    projet.md
    cadres.md
    ...
src/                         ← fonctionnement et présentation du site
  content.config.ts          # collections et validation des en-têtes
  components/                # filtres, en-têtes de page
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
- **Page, menu, carte, liste et compteurs sont générés automatiquement.** Aucune modification du code n’est nécessaire.
- Les titres, paragraphes, listes imbriquées, liens et mises en forme Markdown sont rendus directement.
- Les liens `[A]`, `[A1]` et `[Texte complet]` s’affichent sous forme de boutons (icône et libellé), sans changer leur URL.
- Les anciens marqueurs `(*)` et `~` n’existent plus.

Les dossiers portent des noms anglais ; le contenu et les métadonnées sont en français pour faciliter l’édition. Les URL publiques existantes `/rubriques/` sont conservées.

## Modifier l’accueil

Tout se passe dans `content/accueil.md` : le petit en-tête configure le titre, l’accroche et le titre de la grille. Le corps Markdown apparaît sous les cartes automatiques. Dans ce corps, `[A]`, `[A2]` et `[Texte complet]` écrits entre accents graves (code) s’affichent comme les mêmes icônes que les liens du site, sans lien : c’est ce qui sert à la légende. La disposition visuelle et les boutons fonctionnels restent dans les gabarits `src/`.

## Proposer une source

`content/proposer.md` : une liste numérotée dont chaque élément commence par un titre `###` s’affiche en étapes numérotées. Un paragraphe réduit à un lien en gras (`**[Texte](url)**`) devient un bouton. Le bloc de code ```` ```text ```` devient le prompt avec son bouton « Copier le prompt ». L’encadré latéral est `content/proposer-encadre.md`.

Le guide de maintenance est ce fichier `ASTRO.md`, non publié.

## Charte graphique

Ton militant, lisible. Tout est dans `src/styles/global.css` (variables en tête de fichier).

- **Couleurs** : papier clair `#FAF9F6`, bandeaux gris chaud avec grain (`.grain`, `src/styles/grain.png`), encre `#161616`, **un seul accent rouge** `#D7261E`. Pas de mode sombre.
- **Typographie** : titres en **Archivo** étroit italique (`--display`), texte en **Atkinson Hyperlegible** (`--sans`). Polices auto-hébergées dans `src/styles/fonts/` (licence OFL, copie publiée dans `public/fonts/LICENCES.txt`) : aucun service externe.
- **Marque** : plaque rouge inclinée « RN1PB? » (`.plate`), en grand sur l’accueil.
- **Titres de section** : filet noir épais et trois barres rouges (`.title-slash`, appliqué aussi aux `##` des textes éditoriaux).
- **Boutons** : bord noir, ombre portée nette pour l’action principale (`.btn-primary`).
- **Entrées** : titre en gras, domaine de la source, boutons « Consulter l’archive » / « Lire le texte complet » avec icône et libellé visible.
- **Pages** : accueil, rubriques, **La liste** (toutes les entrées, sommaire, recherche par mot-clé, rubrique ou archive ; elle remplace l’ancienne page Recherche, dont l’adresse `/recherche/` redirige vers `/liste/` en gardant `?q=`), Plus d’informations, **Proposer une source** (bouton d’appel à l’action rouge dans l’en-tête et le pied de page), 404.

## Affichage en liste ou en tuiles

Les pages de rubriques proposent deux boutons « Liste » / « Tuiles » (`aria-pressed`). La **liste** est le mode par défaut ; un choix explicite est mémorisé dans `localStorage` (clé `rn1pb:affichage`), donc partagé entre toutes les pages et onglets du site.

- Même HTML pour les deux modes : un script court dans `<head>` (`Base.astro`) pose `data-vue` sur `<html>` avant l’affichage, puis le CSS (`html[data-vue='tuiles']` dans `global.css`) transforme la liste en grille. Les compléments imbriqués restent dans la tuile de leur entrée parente.
- Les tuiles d’une même ligne ont la même hauteur (hauteur minimale commune), la source et les archives sont alignées en bas de chaque tuile.
- Sans JavaScript, les boutons restent masqués et la liste s’affiche. Sans préférence enregistrée, avec une valeur invalide ou un `localStorage` bloqué, c’est la liste, sans erreur.
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

Le build génère `dist/` et valide les en-têtes des fichiers. `check` teste le traitement du contenu puis vérifie que les liens des Markdown sont présents dans leurs pages et dans La liste. Ces tests ne vérifient pas la disponibilité des sites externes ni l’exactitude des articles.

## GitHub Pages

Le site est statique. La configuration accepte :

| Variable | Défaut | Exemple |
|---|---|---|
| `ASTRO_SITE` | `http://127.0.0.1:4321` | `https://T0uillette.github.io` |
| `ASTRO_BASE` | `/rn1pb` | `/` pour un domaine personnalisé |

Le workflow `.github/workflows/deploy.yml` peut construire et publier le site après activation de GitHub Pages / GitHub Actions. Il cible la branche principale `master` ou un lancement manuel : aucun déploiement automatique n’est déclenché par un push de `ui_astra_update`. Aucun changement de la configuration Pages distante n’est effectué par cette migration locale.

Les archives HTML historiques volumineuses ne sont pas embarquées : les liens d’archives externes sont conservés. Les filtres tournent dans le navigateur, sans service externe ni police distante.
