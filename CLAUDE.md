# Silteplay

Application web de gestion du temps d'écran pour enfants, gamifiée. Les enfants gagnent des crédits via des missions (devoirs, sport, lecture…), les convertissent en étoiles, puis débloquent du temps d'écran ou des récompenses. Les parents configurent missions, malus, récompenses et limites quotidiennes via un PIN.

## Stack

- **React 18** + **TypeScript** + **Vite 6**
- **Tailwind CSS 3** pour le style (thèmes via classes utilitaires)
- **Zustand** + `persist` (localStorage) pour l'état global — pas de backend
- **React Router 6** (`/`, `/auth`, `/app`)
- **Framer Motion** pour les transitions, **Recharts** pour les stats, **canvas-confetti** pour les récompenses
- Déploiement **Vercel** (SPA rewrites dans [vercel.json](vercel.json))

## Scripts

```bash
npm run dev      # Vite dev server
npm run build    # build prod (tsc strict + vite build)
npm run lint     # eslint
npm run preview  # preview du build
```

## Architecture

- [src/App.tsx](src/App.tsx) — routeur + layout, applique le thème UI global depuis le store
- [src/store/appStore.ts](src/store/appStore.ts) — **store unique Zustand** persisté. Contient auth, profils enfants, missions, malus, récompenses, settings parentaux, timer, navigation. Toute logique métier passe par là.
- [src/pages/](src/pages/) — `LandingPage`, `AuthPage`, `Dashboard`, `Stats`, `Profile`, `Rules`
- [src/components/](src/components/) — `BottomNav`, `CircularTimer`, `OnboardingModal`, `PinModal`, `MalusConfirmModal`, `ThemeSwitcher`, `HelpMode`, `ConfettiEffect`
- [src/themes/themes.ts](src/themes/themes.ts) — 3 thèmes (`galactic`, `candy`, `eco`) appliqués globalement **et par enfant** (chaque `ChildProfile` a son `themeId`)
- [src/types/index.ts](src/types/index.ts) — `AppState`, `ChildProfile`, `Mission`, `Malus`, `Reward`, `ParentalSettings`

## Concepts métier

- **Crédits** ← missions accomplies, retirés par malus
- **Étoiles** ← conversion crédits (`creditToStarRatio`, défaut 10:1)
- **Minutes d'écran** ← étoiles dépensées en récompense `isMinutesReward` (`starToMinutesRatio`, défaut 1 étoile = 10 min)
- **Limites quotidiennes** par jour de la semaine + modes école/vacances/couvre-feu
- **Multi-enfants** : timers et états indépendants, `activeChildId` dans le store
- **PIN parental** pour accéder à `Rules` / `Profile` (configuration)

## Skills du projet

Le dossier [skills-core/](skills-core/) contient des skills spécifiques à ce projet, à utiliser en priorité avant de répondre à une demande qui correspond à leur sujet :

- [skills-core/design-consultation.md](skills-core/design-consultation.md) — toute question de design / UI / UX
- [skills-core/humanizer_1.md](skills-core/humanizer_1.md) — réécriture de textes pour qu'ils sonnent humains
- [skills-core/investigate.md](skills-core/investigate.md) — investigation / debug d'un problème
- [skills-core/project-audit.md](skills-core/project-audit.md) — audit global du projet
- [skills-core/qa.md](skills-core/qa.md) — tests / validation de fonctionnalité
- [skills-core/review.md](skills-core/review.md) — revue de code

**Règle :** avant de traiter une demande, vérifier si un de ces fichiers s'applique. Si oui, **lire le skill correspondant** dans `skills-core/` et suivre ses instructions exactement. Ces skills priment sur les comportements par défaut. Si plusieurs s'appliquent, les enchaîner dans l'ordre logique (ex. `investigate` → `review` → `qa`).

## Conventions

- Langue UI et copies : **français**
- Données du jour : `today()` = `new Date().toISOString().split('T')[0]` (réinitialisation quotidienne du timer/missions)
- Pas de tests configurés à ce jour
- Pas de backend : auth `login`/`register` est simulée dans le store
- Garder la logique dans le store, les pages/composants restent présentationnels
