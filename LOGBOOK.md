# LOGBOOK · Silteplay

Journal chronologique des sessions. Une entrée par session, append-only.


## 2026-09-29 · Reprise du pilotage

**Historique reconstitué d'après git log (6 commits)**
- 2026-04-10 : commit initial "Mon Crédit Écran" (`70f3f2a`), config Vercel SPA (`4f44c61`), correctifs de build TypeScript (`ff3f075`)
- 2026-04-11 : thème par enfant, malus, timers indépendants, multi-enfants (`8b15399`)
- 2026-05-12 : refonte majeure (`ffb40d3`) : backend Supabase, PWA, notifications, mode Show, quota hebdo proportionnel, streaks, stats enrichies, landing 100% parental, suppression du Mode École / Vacances
- 2026-09-23 : règle GRANT Supabase ajoutée à CLAUDE.md (`838eacc`)
- Aucune activité de code entre le 2026-05-12 et le 2026-09-29

**Fait**
- Création de ROADMAP.md, LOGBOOK.md et des skills projet `open`, `log`, `close`
- Section "Mots-clés projet" ajoutée à CLAUDE.md

**Décisions**
- aucune

**Points ouverts**
- CLAUDE.md décrit encore l'app sans backend (Zustand localStorage, auth simulée) : à mettre à jour
- La fiche projet listait "B5 PWA" et "B6 Notifications" à faire : le code du 2026-05-12 les contient
- Dossier `.vscode/` non suivi dans le repo, laissé tel quel

**Prochaine étape**
- Vérifier le bug d'inversion d'avatar et l'état du réglage "Confirm email" dans Supabase
