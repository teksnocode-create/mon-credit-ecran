---
name: close
description: Clôture de session sur Silteplay : bilan, LOGBOOK, ROADMAP, contrôle de ce qui part sur GitHub, commit, puis push uniquement après le oui de Nicolas (un push sur main peut redéployer la prod Vercel). Déclencher sur "/close", "close", "on ferme", "fin de session".
---

# /close · Silteplay

## Étape 0 : le cadre
`date "+%A %d %B %Y, %H:%M"` : date et jour de la semaine, jamais de mémoire.

## Étape 1 : le bilan, avant toute question
Produire le bilan à partir de la conversation et du `git diff`, puis le soumettre pour correction. Ne pas demander « qu'est-ce que tu as fait ? » à quelqu'un qui vient de le faire.

Trois blocs : **fait aujourd'hui**, **en cours / points ouverts**, **bloqué, en attente de quelqu'un**. Puis une seule question : « Tu as autre chose à ajouter ? »

## Étape 2 : écrire dans `LOGBOOK.md`
Une entrée par session, append-only, jamais de réécriture d'une entrée passée. Si `/log` a déjà écrit l'entrée du jour, la compléter au lieu d'en créer une deuxième.

## Étape 3 : mettre à jour `ROADMAP.md`
Cocher ce qui est livré avec une preuve. Ajouter ce qui est apparu en cours de route. Si une feature sort du périmètre, la déplacer en « Hors scope » avec la raison, ne pas la supprimer. Mettre à jour la date en tête.

## Étape 4 : contrôle de ce qui part sur GitHub
`git status -s`, puis vérifier ligne par ligne dans le diff :
- Aucun secret : ni clé Supabase `service_role`, ni token, ni mot de passe
- `.env.local` bien ignoré (`.gitignore` couvre `.env*.local`), aucun fichier de credentials indexé
- Aucune donnée réelle d'enfant ou de parent (prénoms, emails), aucun export ni dump de base
- `skills-core` (lien symbolique personnel), `dist/`, `node_modules/`, `.vercel/` : jamais indexés
- Aucun fichier inattendu : un fichier dont on ne sait pas d'où il vient ne part pas

Un doute sur un fichier se traite avant le commit, pas après le push.

## Étape 5 : la sécurité, si quelque chose part en production
Si la session touche à l'auth Supabase, aux politiques RLS, aux tables ou aux données des enfants :
- Toute nouvelle table : RLS activée + `GRANT` dans la même migration (voir CLAUDE.md, section Supabase)
- RLS filtrée sur `auth.uid()` sur les 5 tables (`profiles`, `children`, `missions`, `malus`, `rewards`)
- `npm run build` doit passer avant tout push
Reporter les points non traités avec leur raison.

## Étape 6 : commit, puis push sur accord
1. `git add` ciblé sur les fichiers de la session (jamais `git add .` à l'aveugle), puis commit avec un message factuel en français
2. **S'arrêter et demander : « Je pousse sur GitHub ? Un push sur main peut redéployer la prod Vercel. »** Attendre le oui de Nicolas.
3. Sur le oui : `git pull --rebase`, puis `git push`. En cas de conflit, le résoudre fichier par fichier et le signaler, ne jamais forcer.
4. Sur un non : laisser le commit en local et le dire dans la sortie.

## Étape 7 : la sortie
Une ligne : ce qui est commité, poussé ou non, et la prochaine étape.

## Règles
- Le bilan se propose, il ne se demande pas
- `LOGBOOK.md` est append-only
- Rien ne part sur GitHub sans l'étape 4 ni sans le oui de Nicolas
- Factuel, pas de bilan motivant
