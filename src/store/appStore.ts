import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AppState, ChildProfile, Mission, Malus, Reward, ParentalSettings } from '../types';

const defaultMissions: Mission[] = [
  { id: 'm1', title: 'Devoirs', icon: '📚', creditValue: 10, description: 'Faire ses devoirs du soir', enabled: true },
  { id: 'm2', title: 'Sport', icon: '⚽', creditValue: 15, description: 'Faire 30 min de sport', enabled: true },
  { id: 'm3', title: 'Lecture', icon: '📖', creditValue: 8, description: 'Lire 20 minutes', enabled: true },
  { id: 'm4', title: 'Chambre rangée', icon: '🏠', creditValue: 5, description: 'Ranger sa chambre', enabled: true },
  { id: 'm5', title: 'Aide à la maison', icon: '🍽️', creditValue: 7, description: 'Aider aux tâches ménagères', enabled: true },
  { id: 'm6', title: 'Méditation', icon: '🧘', creditValue: 5, description: '10 minutes de calme', enabled: true },
];

const defaultMalus: Malus[] = [
  { id: 'mal1', title: 'Mensonge', icon: '🤥', creditPenalty: 5, description: 'A menti', enabled: true },
  { id: 'mal2', title: 'Caprice', icon: '😤', creditPenalty: 8, description: 'Crise ou caprice', enabled: true },
  { id: 'mal3', title: 'Impoli', icon: '🗣️', creditPenalty: 5, description: 'Manque de politesse', enabled: true },
  { id: 'mal4', title: 'Chambre non rangée', icon: '🧹', creditPenalty: 3, description: "N'a pas rangé sa chambre", enabled: true },
  { id: 'mal5', title: 'Écran sans permission', icon: '📵', creditPenalty: 10, description: "A utilisé l'écran sans autorisation", enabled: true },
];

const defaultRewards: Reward[] = [
  { id: 'r1', title: 'Bonus 15 min', icon: '⏱️', starCost: 3, description: 'Gagne 15 minutes supplémentaires', isMinutesReward: true, bonusMinutes: 15 },
  { id: 'r2', title: 'Bonus 30 min', icon: '⏰', starCost: 5, description: 'Gagne 30 minutes supplémentaires', isMinutesReward: true, bonusMinutes: 30 },
  { id: 'r3', title: 'Choix du film', icon: '🎬', starCost: 10, description: 'Choisis le film du soir', isMinutesReward: false },
  { id: 'r4', title: 'Dessert spécial', icon: '🍰', starCost: 8, description: 'Un dessert de ton choix', isMinutesReward: false },
  { id: 'r5', title: 'Jeu en famille', icon: '🎮', starCost: 12, description: 'Soirée jeu de société', isMinutesReward: false },
];

const defaultSettings: ParentalSettings = {
  pinEnabled: false,
  pin: '1234',
  creditToStarRatio: 10,
  starToMinutesRatio: 10,
  schoolModeEnabled: false,
  schoolModeLimit: 60,
  vacationModeEnabled: false,
  vacationModeLimit: 90,
  curfewEnabled: false,
  curfewTime: '20:30',
  alertSound: 'chime',
  weekdayLimits: { 0: 90, 1: 60, 2: 60, 3: 60, 4: 60, 5: 60, 6: 90 },
};

interface StoreActions {
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  completeOnboarding: () => void;
  setUITheme: (themeId: 'galactic' | 'candy' | 'eco') => void;
  addChild: (name: string, avatarId: string, dailyLimitMinutes: number, themeId?: 'galactic' | 'candy' | 'eco') => void;
  setChildTheme: (childId: string, themeId: 'galactic' | 'candy' | 'eco') => void;
  setActiveChild: (id: string) => void;
  updateChild: (id: string, updates: Partial<ChildProfile>) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  tickTimer: () => void;
  resetDailyTimer: () => void;
  completeMission: (missionId: string) => void;
  convertCreditsToStars: () => void;
  redeemReward: (rewardId: string) => void;
  deleteChild: (id: string) => void;
  addMission: (mission: Omit<Mission, 'id'>) => void;
  updateMission: (id: string, updates: Partial<Mission>) => void;
  deleteMission: (id: string) => void;
  applyMalus: (malusId: string) => void;
  addMalus: (m: Omit<Malus, 'id'>) => void;
  updateMalus: (id: string, updates: Partial<Malus>) => void;
  deleteMalus: (id: string) => void;
  addReward: (reward: Omit<Reward, 'id'>) => void;
  updateReward: (id: string, updates: Partial<Reward>) => void;
  deleteReward: (id: string) => void;
  updateSettings: (updates: Partial<ParentalSettings>) => void;
  setHelpMode: (active: boolean, step?: number) => void;
  setHelpStep: (step: number) => void;
  triggerConfetti: () => void;
  setConfetti: (show: boolean) => void;
  setPage: (page: AppState['currentPage']) => void;
}

const today = () => new Date().toISOString().split('T')[0];

export const useAppStore = create<AppState & StoreActions>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      hasCompletedOnboarding: false,
      uiThemeId: 'galactic',
      children: [],
      activeChildId: null,
      missions: defaultMissions,
      malus: defaultMalus,
      rewards: defaultRewards,
      settings: defaultSettings,
      helpModeActive: false,
      helpStep: 0,
      showConfetti: false,
      currentPage: 'dashboard',

      login: async (email, password) => {
        const stored = localStorage.getItem('mce_users');
        const users = stored ? JSON.parse(stored) : [];
        const user = users.find((u: { email: string; password: string; id: string; name: string; avatarId: string }) => u.email === email && u.password === password);
        if (user) {
          set({ user: { id: user.id, email: user.email, name: user.name, avatarId: user.avatarId }, isAuthenticated: true });
          return true;
        }
        return false;
      },

      register: async (name, email, password) => {
        const stored = localStorage.getItem('mce_users');
        const users = stored ? JSON.parse(stored) : [];
        if (users.find((u: { email: string }) => u.email === email)) return false;
        const newUser = { id: `u_${Date.now()}`, email, name, password, avatarId: 'avatar1' };
        users.push(newUser);
        localStorage.setItem('mce_users', JSON.stringify(users));
        set({ user: { id: newUser.id, email, name, avatarId: 'avatar1' }, isAuthenticated: true });
        return true;
      },

      logout: () => set({ user: null, isAuthenticated: false, children: [], activeChildId: null, hasCompletedOnboarding: false }),

      completeOnboarding: () => set({ hasCompletedOnboarding: true }),

      setUITheme: (themeId) => set({ uiThemeId: themeId }),

      addChild: (name, avatarId, dailyLimitMinutes, themeId = 'galactic') => {
        const child: ChildProfile = {
          id: `child_${Date.now()}`,
          name, avatarId, themeId,
          credits: 0, stars: 0,
          remainingMinutes: dailyLimitMinutes,
          dailyLimitMinutes,
          totalMinutesUsedToday: 0,
          lastResetDate: today(),
          usageHistory: [],
          isTimerRunning: false,
          timerStartedAt: null,
        };
        set(state => ({
          children: [...state.children, child],
          activeChildId: state.activeChildId ?? child.id,
        }));
      },

      setChildTheme: (childId, themeId) => set(state => ({
        children: state.children.map(c => c.id === childId ? { ...c, themeId } : c),
      })),

      setActiveChild: (id) => set({ activeChildId: id }),

      updateChild: (id, updates) => set(state => ({
        children: state.children.map(c => c.id === id ? { ...c, ...updates } : c),
      })),

      deleteChild: (id) => set(state => {
        if (state.children.length <= 1) return {};
        const remaining = state.children.filter(c => c.id !== id);
        const newActiveId = state.activeChildId === id ? remaining[0].id : state.activeChildId;
        return { children: remaining, activeChildId: newActiveId };
      }),

      startTimer: () => {
        const { activeChildId, children } = get();
        const child = children.find(c => c.id === activeChildId);
        if (!child || child.remainingMinutes <= 0) return;

        // Daily reset check
        if (child.lastResetDate !== today()) {
          const history = [...(child.usageHistory || []), { date: child.lastResetDate, minutes: child.totalMinutesUsedToday }].slice(-30);
          get().updateChild(activeChildId!, {
            remainingMinutes: child.dailyLimitMinutes,
            totalMinutesUsedToday: 0,
            lastResetDate: today(),
            usageHistory: history,
          });
        }

        get().updateChild(activeChildId!, { isTimerRunning: true, timerStartedAt: Date.now() });
      },

      pauseTimer: () => {
        const { activeChildId, children } = get();
        if (!activeChildId) return;
        const child = children.find(c => c.id === activeChildId);
        if (!child || !child.timerStartedAt) {
          get().updateChild(activeChildId, { isTimerRunning: false, timerStartedAt: null });
          return;
        }
        const elapsed = (Date.now() - child.timerStartedAt) / 1000 / 60;
        const newRemaining = Math.max(0, child.remainingMinutes - elapsed);
        const newUsed = child.totalMinutesUsedToday + elapsed;
        get().updateChild(activeChildId, {
          isTimerRunning: false,
          timerStartedAt: null,
          remainingMinutes: newRemaining,
          totalMinutesUsedToday: newUsed,
        });
      },

      tickTimer: () => {
        const { children } = get();
        const running = children.filter(c => c.isTimerRunning && c.timerStartedAt);
        if (running.length === 0) return;

        set(state => ({
          children: state.children.map(c => {
            if (!c.isTimerRunning || !c.timerStartedAt) return c;
            const elapsed = (Date.now() - c.timerStartedAt) / 1000 / 60;
            const base = c.dailyLimitMinutes - c.totalMinutesUsedToday;
            const remaining = Math.max(0, base - elapsed);
            if (remaining <= 0) {
              // Time's up — commit and stop
              return {
                ...c,
                remainingMinutes: 0,
                totalMinutesUsedToday: c.totalMinutesUsedToday + (c.dailyLimitMinutes - c.totalMinutesUsedToday),
                isTimerRunning: false,
                timerStartedAt: null,
              };
            }
            return { ...c, remainingMinutes: remaining };
          }),
        }));
      },

      resetDailyTimer: () => {
        const { activeChildId, children } = get();
        const child = children.find(c => c.id === activeChildId);
        if (!child) return;
        get().updateChild(activeChildId!, {
          remainingMinutes: child.dailyLimitMinutes,
          totalMinutesUsedToday: 0,
          lastResetDate: today(),
        });
      },

      completeMission: (missionId) => {
        const { activeChildId, missions } = get();
        if (!activeChildId) return;
        const mission = missions.find(m => m.id === missionId);
        if (!mission) return;
        const child = get().children.find(c => c.id === activeChildId);
        if (!child) return;
        get().updateChild(activeChildId, { credits: child.credits + mission.creditValue });
        get().triggerConfetti();
      },

      convertCreditsToStars: () => {
        const { activeChildId, settings } = get();
        if (!activeChildId) return;
        const child = get().children.find(c => c.id === activeChildId);
        if (!child) return;
        const starsToAdd = Math.floor(child.credits / settings.creditToStarRatio);
        if (starsToAdd === 0) return;
        const remainingCredits = child.credits % settings.creditToStarRatio;
        get().updateChild(activeChildId, { credits: remainingCredits, stars: child.stars + starsToAdd });
        get().triggerConfetti();
      },

      redeemReward: (rewardId) => {
        const { activeChildId, rewards, settings } = get();
        if (!activeChildId) return;
        const reward = rewards.find(r => r.id === rewardId);
        if (!reward) return;
        const child = get().children.find(c => c.id === activeChildId);
        if (!child || child.stars < reward.starCost) return;
        const updates: Partial<ChildProfile> = { stars: child.stars - reward.starCost };
        if (reward.isMinutesReward && reward.bonusMinutes) {
          updates.remainingMinutes = child.remainingMinutes + reward.bonusMinutes;
          updates.dailyLimitMinutes = child.dailyLimitMinutes + reward.bonusMinutes;
        }
        get().updateChild(activeChildId, updates);
        get().triggerConfetti();
        // suppress unused var warning
        void settings;
      },

      addMission: (mission) => set(state => ({
        missions: [...state.missions, { ...mission, id: `m_${Date.now()}` }]
      })),
      updateMission: (id, updates) => set(state => ({
        missions: state.missions.map(m => m.id === id ? { ...m, ...updates } : m)
      })),
      deleteMission: (id) => set(state => ({
        missions: state.missions.filter(m => m.id !== id)
      })),

      applyMalus: (malusId) => {
        const { activeChildId, malus } = get();
        if (!activeChildId) return;
        const m = malus.find(x => x.id === malusId);
        if (!m) return;
        const child = get().children.find(c => c.id === activeChildId);
        if (!child) return;
        get().updateChild(activeChildId, { credits: child.credits - m.creditPenalty });
      },
      addMalus: (m) => set(state => ({
        malus: [...state.malus, { ...m, id: `mal_${Date.now()}` }]
      })),
      updateMalus: (id, updates) => set(state => ({
        malus: state.malus.map(m => m.id === id ? { ...m, ...updates } : m)
      })),
      deleteMalus: (id) => set(state => ({
        malus: state.malus.filter(m => m.id !== id)
      })),

      addReward: (reward) => set(state => ({
        rewards: [...state.rewards, { ...reward, id: `r_${Date.now()}` }]
      })),
      updateReward: (id, updates) => set(state => ({
        rewards: state.rewards.map(r => r.id === id ? { ...r, ...updates } : r)
      })),
      deleteReward: (id) => set(state => ({
        rewards: state.rewards.filter(r => r.id !== id)
      })),

      updateSettings: (updates) => set(state => ({
        settings: { ...state.settings, ...updates }
      })),

      setHelpMode: (active, step = 0) => set({ helpModeActive: active, helpStep: step }),
      setHelpStep: (step) => set({ helpStep: step }),
      triggerConfetti: () => {
        set({ showConfetti: true });
        setTimeout(() => set({ showConfetti: false }), 3000);
      },
      setConfetti: (show) => set({ showConfetti: show }),
      setPage: (page) => set({ currentPage: page }),
    }),
    {
      name: 'mon-credit-ecran-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        uiThemeId: state.uiThemeId,
        children: state.children,
        activeChildId: state.activeChildId,
        missions: state.missions,
        malus: state.malus,
        rewards: state.rewards,
        settings: state.settings,
      }),
      onRehydrateStorage: () => (state) => {
        // Migration: ensure all children have themeId
        if (state && state.children) {
          state.children = state.children.map(c => ({
            ...c,
            themeId: c.themeId || 'galactic',
          }));
        }
        // Ensure uiThemeId exists
        if (!state?.uiThemeId) {
          state.uiThemeId = 'galactic';
        }
      },
    }
  )
);
