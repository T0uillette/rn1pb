---
titre: "Proposer une source"
description: "Vous avez repéré un article ou un document public qui a sa place ici ? Voici comment nous le transmettre pour qu’il soit vérifié et ajouté rapidement."
---

## En cinq étapes

1. ### Vérifiez qu’elle n’y est pas déjà

   Cherchez le nom de la personne, la commune, le sujet ou le site du média dans [La liste](../liste/). Si l’article y est déjà, inutile de le reproposer.

2. ### Choisissez une source solide

   La source doit être un **article de presse** rapportant un **fait négatif imputable à un ou une membre du RN** (élu, candidat, cadre, militant encarté), pas à un simple sympathisant. Les publications sur les réseaux sociaux et les vidéos ne sont pas retenues. Exception : un site qui aide à mieux comprendre les problèmes du RN peut être proposé dans la rubrique Autres, après validation au cas par cas.

3. ### Archivez la page

   Collez l’adresse de l’article dans la [Wayback Machine](https://web.archive.org/) (« Save Page Now ») ou sur [archive.today](https://archive.ph/). Gardez le lien d’archive obtenu : il protège la source si l’article change ou disparaît.

4. ### Ajoutez-la dans la rubrique, sur GitHub

   Chaque rubrique est un fichier du dossier `content/sections` du dépôt GitHub (par exemple `cadres.md` pour Les cadres, `gestion-locale.md` pour Ce qu’ils font à l’échelle locale). Ouvrez le fichier, cliquez sur le crayon « Edit this file » : GitHub crée automatiquement votre copie du dépôt. Ajoutez votre ligne à la fin de la liste, au format `- [Titre court](lien de l’article) [[A]](lien de l’archive)`.

   **[Ouvrir les rubriques sur GitHub](https://github.com/T0uillette/rn1pb/tree/master/content/sections)**

5. ### Proposez la modification

   Cliquez sur « Commit changes… », puis « Propose changes » et « Create pull request ». Dans la description, indiquez la date de l’article et la nature du fait. Nous relisons puis fusionnons : la source apparaît alors sur le site.

   Pas de compte GitHub ? Vous pouvez aussi [publier la source sur r/rn1pb](https://www.reddit.com/r/rn1pb/submit) avec le lien de l’article, le lien d’archive et la rubrique proposée.

## Préparer sa proposition avec une IA

Copiez ce prompt dans l’assistant IA de votre choix et envoyez-le tel quel. L’IA fonctionne comme un formulaire : elle vous demande d’abord si vous êtes à l’aise avec GitHub, puis le lien de l’article. Elle évalue les chances que la source soit acceptée, conseille la rubrique, puis vous rend la ligne au format du site et le lien pour l’ajouter, avec une marche à suivre détaillée si vous débutez sur GitHub.

```text
Tu m’aides à proposer une source pour RN1PB?, un site qui recense des articles de presse et des sources publiques sur les agissements du Rassemblement national. Les sources sont ajoutées par pull request sur le dépôt GitHub https://github.com/T0uillette/rn1pb.

Fonctionne comme un formulaire : pose-moi les questions suivantes une par une, dans l’ordre, et attends ma réponse avant de passer à la suivante. Ne fais rien d’autre avant d’avoir les deux réponses.

Question 1 : « Êtes-vous à l’aise avec GitHub (modifier un fichier, ouvrir une pull request) ? Répondez oui ou non. »
Question 2 : « Quel est le lien de l’article ? Ajoutez son lien d’archive si vous en avez un (web.archive.org ou archive.ph). »

Une fois les deux réponses obtenues, en te fondant uniquement sur le contenu de l’article :

1. Résume en 2 ou 3 phrases ce que rapporte l’article : qui, quoi, où, quand.
2. Indique la nature du fait :
   - condamnation (décision de justice rendue ; précise si un appel ou un pourvoi est mentionné),
   - enquête ou plainte en cours (la présomption d’innocence s’applique),
   - prise de position (vote, déclaration, programme).
3. Évalue les chances que la source soit acceptée : élevées, incertaines ou faibles. Critères :
   - le fait doit être négatif pour le RN ou ses membres (condamnation, affaire, propos ou acte contestable, mensonge, vote ou mesure critiquable), pas un fait neutre ou valorisant ;
   - le fait doit être imputable à un ou une membre du RN (élu, candidat, cadre, militant encarté, collaborateur), pas à un simple sympathisant ou électeur du parti ;
   - la source doit être un article de journal, pas une publication sur un réseau social ni une vidéo ;
   - exception : un site qui aide à mieux comprendre les problèmes du RN (outil, base de données, décryptage) peut être proposé dans la rubrique Autres, avec une validation au cas par cas ; dans ce cas, les chances sont au mieux incertaines.
   Si les chances sont élevées, donne seulement le verdict, sans détailler les critères remplis.
   Si elles sont incertaines, donne le verdict et explique seulement le point qui fait douter.
   Si elles sont faibles, explique seulement les critères non remplis, indique quel type de source serait acceptée (par exemple un article de presse qui rapporte le même fait), et arrête-toi là sans proposer de ligne.
4. Conseille la rubrique la plus adaptée et son fichier, en une phrase qui justifie ce choix ; si une autre rubrique est possible, mentionne-la. Rubriques :
   - Leur projet (projet.md) : ce que le parti propose et annonce vouloir faire ;
   - Les cadres (cadres.md) : dirigeants, figures et responsables nationaux ;
   - Les crimes et délits (crimes-et-delits.md) : affaires, signalements et poursuites ;
   - Les membres du parti (membres.md) : élus, candidats, militants et collaborateurs ;
   - Leurs votes à l’assemblée (votes.md) : votes du groupe RN à l’Assemblée nationale ;
   - L’histoire du parti (histoire.md) : origines du parti et paroles de ses fondateurs ;
   - Leurs positions (positions.md) : positions affichées sur des sujets de société ;
   - Ce qu’ils font à l’échelle locale (gestion-locale.md) : mairies et élus locaux RN ;
   - Autres (autres.md) : sites, outils et décryptages complémentaires.
5. Rédige un titre court (moins de 15 mots) qui décrit fidèlement le fait, sans aller plus loin que ce que dit l’article.
6. Donne la ligne à ajouter, dans un bloc de code :
   - [Titre court](lien de l’article) [[A]](lien de l’archive)
   Si je n’ai pas donné de lien d’archive, écris [[A]](À COMPLÉTER) et explique-moi comment en créer un : coller le lien de l’article sur https://web.archive.org/ (« Save Page Now ») ou sur https://archive.ph/, puis copier le lien obtenu.
7. Rédige la description de la pull request : rubrique, nom du média, date de l’article, nature du fait, personnes ou communes concernées.
8. Donne le lien direct pour modifier le fichier : https://github.com/T0uillette/rn1pb/edit/master/content/sections/NOM_DU_FICHIER (remplace NOM_DU_FICHIER par le fichier choisi au point 4).

Si j’ai répondu oui à la question 1 : arrête-toi là, sans autre explication.

Si j’ai répondu non : ajoute une marche à suivre précise, numérotée, une action par étape :
   - créer un compte gratuit sur https://github.com/signup si je n’en ai pas, puis me connecter ;
   - ouvrir le lien du point 8 : GitHub propose de créer une copie du dépôt (« Fork this repository »), accepter ;
   - descendre à la fin de la liste du fichier, se placer après la dernière ligne qui commence par « - », aller à la ligne et coller la ligne du point 6, sans rien modifier d’autre ;
   - cliquer sur le bouton vert « Commit changes… », écrire un titre court (par exemple « Ajout : » suivi du titre de l’article), puis cliquer sur « Propose changes » ;
   - sur la page suivante, cliquer sur « Create pull request », coller la description du point 7, puis cliquer à nouveau sur « Create pull request » ;
   - c’est terminé : l’équipe relit la proposition, peut poser des questions dans la pull request, puis l’ajoute au site.

Règles :
- N’invente rien. Si une information manque dans l’article (date, nom, suite judiciaire), écris « non précisé ».
- Ne recopie pas de longs passages : résume avec tes propres mots.
- Si tu ne peux pas ouvrir le lien, demande-moi de coller le texte de l’article.
- Si je réponds autre chose que oui ou non à la question 1, considère que la réponse est non.

Commence maintenant par la question 1.
```

Relisez toujours le résultat avant de proposer la modification : une IA peut se tromper ou extrapoler. C’est l’article d’origine qui fait foi.
