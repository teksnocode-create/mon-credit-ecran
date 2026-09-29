# ROADMAP · Silteplay

_Dernière mise à jour : 2026-09-29_

App web de gestion du temps d'écran des enfants, pilotée par le parent. Prod : https://mon-credit-ecran.vercel.app (repo GitHub `teksnocode-create/mon-credit-ecran`).

## Phase 0 : Setup (fait, 2026-04-10)
- [x] Init projet React + TypeScript + Vite + Tailwind + Zustand (commit `70f3f2a`)
- [x] Config Vercel pour le routage SPA (`4f44c61`)
- [x] Correction des erreurs de build TypeScript (`ff3f075`)

## Phase 1 : MVP local (fait, 2026-04-11)
- [x] Multi-enfants avec timers indépendants (`8b15399`)
- [x] Thème par enfant (Galactique, Bonbon, Éco)
- [x] Malus visibles, crédits négatifs
- [x] Statistiques par enfant

## Phase 2 : Backend et sprint feature (fait, 2026-05-12, commit `ffb40d3`)
- [x] Migration localStorage vers Supabase (auth + persistance, sync hybride Zustand + push async)
- [x] PWA installable (vite-plugin-pwa, manifest, icônes)
- [x] Notifications Web : fin de temps, alerte 5 min, couvre-feu (`src/lib/notify.ts`, `src/store/appStore.ts`)
- [x] Mode Show `/show` (timer plein écran + Wake Lock)
- [x] Quota hebdo proportionnel (semainier + 4 presets)
- [x] Streaks, stats enrichies, sons Web Audio, debounce sliders
- [x] Landing repositionnée 100% parental
- [x] Commit du sprint du 2026-05-12

## Phase 3 : Reste à faire
- [ ] Bug mineur : inversion d'avatar à la création d'enfant (🦄 / 🦊), toujours présent : à vérifier
- [ ] Mode "enfant" : vue simplifiée sans accès parent (le mode Show en couvre-t-il une partie ? à vérifier)
- [ ] Action manuelle Supabase : désactiver "Confirm email" (Auth, Providers, Email), fait ou non : à vérifier
- [ ] Mettre à jour CLAUDE.md : il indique encore "pas de backend" et "auth simulée" alors que Supabase est en place depuis le 2026-05-12
- [ ] Versionner le schéma Supabase (5 tables, trigger `on_auth_user_created`) : aucune migration dans le repo à ce jour
- [ ] Script `npm run lint` : eslint absent des devDependencies, à vérifier
- [ ] Objectif App Store / publication : à compléter

## Hors scope, ne pas dériver
- Mode École / Mode Vacances : supprimé le 2026-05-12 (UI jamais câblée), le semainier + presets est la source unique des quotas
