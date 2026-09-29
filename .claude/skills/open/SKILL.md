---
name: open
description: Reprise de session sur Silteplay (app de gestion du temps d'écran des enfants, MVP en prod). Affiche où en est le projet, ce qui est en cours et ce qui traîne non commité. Déclencher sur "/open", "open", "on reprend", "où on en est".
---

# /open · Silteplay

## Déroulé

### 0. Vérifier GitHub avant tout (travail fait depuis le téléphone)
Le téléphone pousse sur GitHub (`teksnocode-create/mon-credit-ecran`), jamais sur cette machine. Sans cette étape, l'open se construit sur une copie périmée.
1. `git fetch -p`
2. `git log --oneline main..origin/main` : commits présents sur GitHub mais pas ici
3. `git branch -r --no-merged main | grep origin/claude/` : branches ouvertes par Claude Code mobile, jamais fusionnées

S'il y a quelque chose : l'afficher **en tête de la sortie** (branche, nombre de commits, date et message du dernier) et proposer de rapatrier (`git pull --ff-only` pour main, merge branche par branche pour `claude/*`). **Ne rien fusionner sans le oui de Nicolas.**
Si rien : une ligne « GitHub : à jour ». Si le fetch échoue (pas de réseau) : le dire en une ligne et continuer.

### 1. Lire en direct
1. `date "+%A %d %B %Y, %H:%M"` : date et jour de la semaine, jamais de mémoire
2. `ROADMAP.md` : phase en cours, cases cochées, cases restantes
3. Les 3 dernières entrées de `LOGBOOK.md` : ce qui a été fait, la prochaine étape notée
4. `git status -s` et `git log -5 --oneline` : travail non commité, derniers commits, branche courante

## Sortie
```
OPEN · Silteplay · [date]
GitHub : [à jour / ce qui attend]
Où on en est : phase [X], [N] cases faites sur [M]
Dernière session : [date], [résumé en une ligne]
Prochaine étape notée : [reprise du LOGBOOK]
Non commité : [fichiers, ou "rien"]
```

## Règles
- Lire les fichiers en direct, ne jamais se fier à la mémoire de la conversation
- Si `LOGBOOK.md` n'a pas d'entrée depuis plus de 30 jours, le dire
- Si `LOGBOOK.md` est vide, le dire au lieu d'inventer
- Ne rien modifier : `/open` est en lecture seule
