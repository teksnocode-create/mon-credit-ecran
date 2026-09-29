---
name: log
description: Snapshot de la conversation en cours dans le LOGBOOK de Silteplay, pour fermer une fenêtre sans perdre le fil. Déclencher sur "/log", "log", "note ce qu'on a fait", "archive ça".
---

# /log · Silteplay

## Déroulé
1. `date "+%A %d %B %Y, %H:%M"` : jamais de date de mémoire
2. Extraire de la conversation : ce qui a été produit (fichiers de `src/`, migrations Supabase, config Vercel), les décisions structurantes, la prochaine étape concrète
3. Ajouter à la suite de `LOGBOOK.md` :

```
### [AAAA-MM-JJ HH:MM] · [sujet en 3 à 5 mots]

**Fait**
- [5 bullets maximum, synthétisés]

**Décisions**
- [uniquement ce qui engage la suite, sinon "aucune"]

**Prochaine étape**
- [une seule, la plus immédiate]
```

4. Si une case de `ROADMAP.md` est achevée avec une preuve observable (fichier écrit, build qui passe, test joué), la cocher. Une intention ne coche rien.

## Règles
- 5 bullets maximum dans "Fait" : synthétiser, pas tout lister
- Ne rien inventer : on écrit ce qui s'est passé dans cette conversation
- Si la session n'a rien produit, le dire et ne rien écrire
- Ne pas commiter, ne pas pousser : `/log` écrit des fichiers, c'est tout
- Si la session a déjà une entrée du jour, compléter sous le même titre de date
- `LOGBOOK.md` est append-only : jamais de réécriture d'une entrée passée
