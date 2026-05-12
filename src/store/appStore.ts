import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AppState, ChildProfile, Mission, Malus, Reward, ParentalSettings, WeekdayLimits, ActivityEntry, ActivityType } from '../types';
import { FlyingNumberData, FlyAnchor } from '../components/FlyingNumber';
import { supabase } from '../lib/supabase';
import { notify } from '../lib/notify';
import { playMissionDone, playMalus, playConvert, playRewardBig, playRewardSmall, playStreak, playTimerEnd, playUndo, setSoundsEnabled } from '../lib/sound';
import {
  fetchAll, upsertChild, deleteChildRow,
  upsertMission, deleteMissionRow,
  upsertMalus, deleteMalusRow,
  upsertReward, deleteRewardRow,
  upsertProfile,
} from '../lib/sync';

const newId = () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `id_${Date.now()}_${Math.random().toString(36).slice(2)}`);

const MAX_LOG = 100;
const makeActivity = (type: ActivityType, label: string, icon: string, color: ActivityEntry['color']): ActivityEntry => ({
  id: newId(), type, label, icon, color, timestamp: new Date().toISOString(),
});
const appendActivity = (log: ActivityEntry[] | undefined, entry: ActivityEntry): ActivityEntry[] => {
  const next = [...(log ?? []), entry];
  return next.length > MAX_LOG ? next.slice(-MAX_LOG) : next;
};

const defaultMissions: Mission[] = [
  { id: 'm1', title: 'Devoirs', icon: '📚', creditValue: 10, description: 'Faire ses devoirs du soir', enabled: true },
  { id: 'm2', title: 'Sport', icon: '⚽', creditValue: 15, description: 'Faire 30 min de sport', enabled: true },
  { id: 'm3', title: 'Lecture', icon: '📖', creditValue: 8, description: 'Lire 20 minutes', enabled: true },
  { id: 'm4', title: 'Chambre rangée', icon: '🏠', creditValue: 5, description: 'Ranger sa chambre', enabled: true },
  { id: 'm5', title: 'Aide à la maison', icon: '🍽️', creditValue: 7, description: 'Aider aux tâches ménagères', enabled: true },
  { id: 'm6', title: 'Méditation', icon: '🧘', creditValue: 5, description: '10 minutes de calme', enabled: true },
];

const defaultMalus: Malus[] = [
  { id: 'mal1', title: 'Mensonge', icon: '🤥', creditPenalty: 5, minutesPenalty: 0, description: 'A menti', enabled: true },
  { id: 'mal2', title: 'Caprice', icon: '😤', creditPenalty: 5, minutesPenalty: 10, description: 'Crise ou caprice', enabled: true },
  { id: 'mal3', title: 'Impoli', icon: '🗣️', creditPenalty: 5, minutesPenalty: 0, description: 'Manque de politesse', enabled: true },
  { id: 'mal4', title: 'Chambre non rangée', icon: '🧹', creditPenalty: 3, minutesPenalty: 0, description: "N'a pas rangé sa chambre", enabled: true },
  { id: 'mal5', title: 'Écran sans permission', icon: '📵', creditPenalty: 10, minutesPenalty: 15, description: "A utilisé l'écran sans autorisation", enabled: true },
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
  curfewEnabled: false,
  curfewTime: '20:30',
  alertSound: 'chime',
  soundsEnabled: true,
  weekdayLimits: { 0: 90, 1: 60, 2: 60, 3: 60, 4: 60, 5: 60, 6: 90 },
};

interface StoreActions {
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  completeOnboarding: () => void;
  setUITheme: (themeId: 'galactic' | 'candy' | 'eco') => void;
  addChild: (name: string, avatarId: string, dailyLimitMinutes: number, themeId?: 'galactic' | 'candy' | 'eco') => void;
  setChildTheme: (childId: string, themeId: 'galactic' | 'candy' | 'eco') => void;
  setChildWeekdayLimits: (childId: string, weekdayLimits: WeekdayLimits) => void;
  setActiveChild: (id: string) => void;
  updateChild: (id: string, updates: Partial<ChildProfile>) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  tickTimer: () => void;
  resetDailyTimer: () => void;
  completeMission: (missionId: string) => void;
  convertCreditsToStars: () => void;
  redeemReward: (rewardId: string) => void;
  removeClaimedReward: (claimId: string) => void;
  deleteChild: (id: string) => void;
  addMission: (mission: Omit<Mission, 'id'>) => void;
  updateMission: (id: string, updates: Partial<Mission>) => void;
  deleteMission: (id: string) => void;
  applyMalus: (malusId: string, mode: 'credits' | 'minutes') => void;
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
  exportData: () => string;
  importData: (json: string) => boolean;
  restoreSession: () => Promise<void>;
  hydrate: () => Promise<void>;
  isHydrated: boolean;
  checkCurfew: () => void;
  ensureDailyReset: () => void;
  adjustRemainingMinutes: (delta: number) => void;
  flyingNumbers: FlyingNumberData[];
  pushFlyingNumber: (value: string, color: string, anchor: FlyAnchor, direction?: 'up' | 'down') => void;
  removeFlyingNumber: (id: string) => void;
  rewardCelebration: { minutes: number } | null;
  triggerRewardCelebration: (minutes: number) => void;
  clearRewardCelebration: () => void;
  punishmentFlash: number;
  triggerPunishmentFlash: () => void;
  lastUndoable: UndoableAction | null;
  pushUndoable: (action: UndoableAction) => void;
  clearUndoable: () => void;
  undoLast: () => void;
}

export interface UndoableAction {
  id: string;
  label: string;
  childId: string;
  snapshot: Partial<ChildProfile>;
  createdAt: number;
  activityId?: string; // ID of the related activity log entry to remove on undo
}

const today = () => new Date().toISOString().split('T')[0];

const yesterdayStr = (): string => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
};

const mondayOf = (d = new Date()): string => {
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const m = new Date(d);
  m.setHours(0, 0, 0, 0);
  m.setDate(m.getDate() + diff);
  return m.toISOString().split('T')[0];
};

// Days remaining in the week starting from todayDow (week = Mon..Sun, Mon=1, Sun=0)
const remainingWeekDows = (todayDow: number): (0|1|2|3|4|5|6)[] => {
  const order: (0|1|2|3|4|5|6)[] = [1, 2, 3, 4, 5, 6, 0];
  const idx = order.indexOf(todayDow as 0|1|2|3|4|5|6);
  return idx === -1 ? [] : order.slice(idx);
};

// Today's effective limit = proportional share of remaining weekly budget over remaining days.
// Falls back to dailyLimitMinutes when no week budget is configured.
const computeEffectiveTodayLimit = (c: ChildProfile): number => {
  const todayDow = new Date().getDay();
  const baseToday = c.weekdayLimits?.[todayDow as 0|1|2|3|4|5|6] ?? c.dailyLimitMinutes;
  if (baseToday <= 0) return 0;
  const baseWeek = (Object.values(c.weekdayLimits ?? {}) as number[]).reduce((s, v) => s + (v || 0), 0);
  if (baseWeek === 0) return baseToday;
  const adjustment = c.weeklyAdjustment ?? 0;
  const monday = mondayOf();
  const todayStr = today();
  const consumedPast = (c.usageHistory ?? [])
    .filter(h => h.date >= monday && h.date < todayStr)
    .reduce((s, h) => s + (h.minutes || 0), 0);
  const remainingWeekBudget = Math.max(0, baseWeek + adjustment - consumedPast);
  const remainingDaysQuota = remainingWeekDows(todayDow)
    .reduce<number>((s, d) => s + (c.weekdayLimits?.[d] ?? 0), 0);
  if (remainingDaysQuota === 0) return 0;
  const share = (baseToday / remainingDaysQuota) * remainingWeekBudget;
  return Math.max(0, Math.min(baseToday, Math.round(share)));
};

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
      flyingNumbers: [],
      rewardCelebration: null,
      punishmentFlash: 0,
      isHydrated: false,
      lastUndoable: null,

      pushUndoable: (action) => set({ lastUndoable: action }),
      clearUndoable: () => set({ lastUndoable: null }),
      undoLast: () => {
        const action = get().lastUndoable;
        if (!action) return;
        const merged: Partial<ChildProfile> = { ...action.snapshot };
        if (action.activityId) {
          const child = get().children.find(c => c.id === action.childId);
          if (child) {
            merged.activityLog = (child.activityLog ?? []).filter(e => e.id !== action.activityId);
          }
        }
        get().updateChild(action.childId, merged);
        set({ lastUndoable: null });
        playUndo();
      },

      triggerRewardCelebration: (minutes) => set({ rewardCelebration: { minutes } }),
      clearRewardCelebration: () => set({ rewardCelebration: null }),
      triggerPunishmentFlash: () => set({ punishmentFlash: Date.now() }),

      pushFlyingNumber: (value, color, anchor, direction = 'up') => {
        const id = newId();
        set(state => ({ flyingNumbers: [...state.flyingNumbers, { id, value, color, anchor, direction }] }));
      },
      removeFlyingNumber: (id) => set(state => ({ flyingNumbers: state.flyingNumbers.filter(f => f.id !== id) })),

      login: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error || !data.user) return false;
        set({ user: { id: data.user.id, email: data.user.email ?? email, name: '', avatarId: 'avatar1' }, isAuthenticated: true });
        await get().hydrate();
        return true;
      },

      register: async (name, email, password) => {
        const { data, error } = await supabase.auth.signUp({
          email, password,
          options: { data: { name } },
        });
        if (error || !data.user) return false;
        // The DB trigger seeds profile + defaults. Push the chosen name.
        await upsertProfile(data.user.id, { name });
        set({ user: { id: data.user.id, email: data.user.email ?? email, name, avatarId: 'avatar1' }, isAuthenticated: true });
        await get().hydrate();
        return true;
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({
          user: null, isAuthenticated: false,
          children: [], activeChildId: null, hasCompletedOnboarding: false,
          missions: [], malus: [], rewards: [],
          isHydrated: false,
        });
      },

      restoreSession: async () => {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          const u = data.session.user;
          set({ user: { id: u.id, email: u.email ?? '', name: '', avatarId: 'avatar1' }, isAuthenticated: true });
          await get().hydrate();
        }
      },

      hydrate: async () => {
        const remote = await fetchAll();
        if (!remote) return;
        const todayStr = today();
        const dow = new Date().getDay() as 0|1|2|3|4|5|6;
        const currentMonday = mondayOf();
        // Auto-reset for any child whose lastResetDate is stale, and apply today's weekday limit.
        const normalizedChildren = remote.children.map(c => {
          const weekChanged = c.weekStartDate !== currentMonday;
          const yStr = yesterdayStr();
          const streakBroken = c.lastResetDate !== todayStr && c.lastStreakDate !== yStr && c.lastStreakDate !== todayStr;
          // If week changed, reset weeklyAdjustment first so the effective limit is recomputed cleanly.
          const baseChild = weekChanged
            ? { ...c, weeklyAdjustment: 0, weekStartDate: currentMonday }
            : c;
          const effLimit = computeEffectiveTodayLimit(baseChild);
          let next: ChildProfile = baseChild;
          if (baseChild.lastResetDate !== todayStr) {
            next = {
              ...baseChild,
              completedMissionIds: [],
              dailyLimitMinutes: effLimit,
              remainingMinutes: effLimit,
              totalMinutesUsedToday: 0,
              lastResetDate: todayStr,
              ...(streakBroken ? { streakCount: 0 } : {}),
            };
          } else if (baseChild.dailyLimitMinutes !== effLimit) {
            next = {
              ...baseChild,
              dailyLimitMinutes: effLimit,
              remainingMinutes: Math.max(0, effLimit - baseChild.totalMinutesUsedToday),
            };
          }
          void dow;
          return next;
        });
        const currentActiveId = get().activeChildId;
        const cachedStillValid = currentActiveId && normalizedChildren.some(c => c.id === currentActiveId);
        set({
          user: { id: remote.profile.id, email: remote.profile.email, name: remote.profile.name, avatarId: remote.profile.avatar_id },
          uiThemeId: (remote.profile.ui_theme_id as AppState['uiThemeId']) || 'galactic',
          hasCompletedOnboarding: remote.profile.has_completed_onboarding,
          settings: { ...defaultSettings, ...remote.profile.settings },
          children: normalizedChildren,
          missions: remote.missions,
          malus: remote.malus,
          rewards: remote.rewards,
          activeChildId: cachedStillValid ? currentActiveId : (normalizedChildren[0]?.id ?? null),
          isHydrated: true,
        });
        setSoundsEnabled(get().settings.soundsEnabled ?? true);
      },

      completeOnboarding: () => {
        set({ hasCompletedOnboarding: true });
        const uid = get().user?.id;
        if (uid && get().isHydrated) void upsertProfile(uid, { has_completed_onboarding: true });
      },

      setUITheme: (themeId) => {
        set({ uiThemeId: themeId });
        const uid = get().user?.id;
        if (uid && get().isHydrated) void upsertProfile(uid, { ui_theme_id: themeId });
      },

      addChild: (name, avatarId, dailyLimitMinutes, themeId = 'galactic') => {
        const child: ChildProfile = {
          id: newId(),
          name, avatarId, themeId,
          credits: 0, stars: 0,
          remainingMinutes: dailyLimitMinutes,
          dailyLimitMinutes,
          totalMinutesUsedToday: 0,
          lastResetDate: today(),
          usageHistory: [],
          isTimerRunning: false,
          timerStartedAt: null,
          completedMissionIds: [],
          claimedRewards: [],
          weekdayLimits: { 0: dailyLimitMinutes, 1: dailyLimitMinutes, 2: dailyLimitMinutes, 3: dailyLimitMinutes, 4: dailyLimitMinutes, 5: dailyLimitMinutes, 6: dailyLimitMinutes },
          weeklyAdjustment: 0,
          weekStartDate: mondayOf(),
          activityLog: [],
          streakCount: 0,
          lastStreakDate: null,
        };
        set(state => ({
          children: [...state.children, child],
          activeChildId: state.activeChildId ?? child.id,
        }));
        const uid = get().user?.id;
        if (uid && get().isHydrated) void upsertChild(uid, child);
      },

      setChildTheme: (childId, themeId) => {
        set(state => ({
          children: state.children.map(c => c.id === childId ? { ...c, themeId } : c),
        }));
        const uid = get().user?.id;
        const child = get().children.find(c => c.id === childId);
        if (uid && child && get().isHydrated) void upsertChild(uid, child);
      },

      setChildWeekdayLimits: (childId, weekdayLimits) => {
        const todayDow = new Date().getDay() as 0|1|2|3|4|5|6;
        set(state => ({
          children: state.children.map(c => {
            if (c.id !== childId) return c;
            const projected: ChildProfile = { ...c, weekdayLimits };
            const effLimit = computeEffectiveTodayLimit(projected);
            return {
              ...projected,
              dailyLimitMinutes: effLimit,
              remainingMinutes: Math.max(0, effLimit - c.totalMinutesUsedToday),
            };
          }),
        }));
        const uid = get().user?.id;
        const child = get().children.find(c => c.id === childId);
        if (uid && child && get().isHydrated) void upsertChild(uid, child);
      },

      setActiveChild: (id) => set({ activeChildId: id }),

      updateChild: (id, updates) => {
        set(state => ({
          children: state.children.map(c => c.id === id ? { ...c, ...updates } : c),
        }));
        const uid = get().user?.id;
        const child = get().children.find(c => c.id === id);
        if (uid && child && get().isHydrated) void upsertChild(uid, child);
      },

      deleteChild: (id) => {
        const state = get();
        if (state.children.length <= 1) return;
        const remaining = state.children.filter(c => c.id !== id);
        const newActiveId = state.activeChildId === id ? remaining[0].id : state.activeChildId;
        set({ children: remaining, activeChildId: newActiveId });
        if (get().isHydrated) void deleteChildRow(id);
      },

      startTimer: () => {
        const { activeChildId, children } = get();
        const child = children.find(c => c.id === activeChildId);
        if (!child || child.remainingMinutes <= 0) return;

        // Daily reset check
        if (child.lastResetDate !== today()) {
          const history = [...(child.usageHistory || []), { date: child.lastResetDate, minutes: child.totalMinutesUsedToday }].slice(-30);
          const currentMonday = mondayOf();
          const isNewWeek = child.weekStartDate !== currentMonday;
          const yStr = yesterdayStr();
          const streakBroken = child.lastStreakDate !== yStr && child.lastStreakDate !== today();
          const projected: ChildProfile = {
            ...child,
            usageHistory: history,
            totalMinutesUsedToday: 0,
            lastResetDate: today(),
            ...(isNewWeek ? { weeklyAdjustment: 0, weekStartDate: currentMonday } : {}),
          };
          const effLimit = computeEffectiveTodayLimit(projected);
          get().updateChild(activeChildId!, {
            dailyLimitMinutes: effLimit,
            remainingMinutes: effLimit,
            totalMinutesUsedToday: 0,
            lastResetDate: today(),
            usageHistory: history,
            completedMissionIds: [],
            ...(streakBroken ? { streakCount: 0 } : {}),
            ...(isNewWeek ? { weeklyAdjustment: 0, weekStartDate: currentMonday } : {}),
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
        // Commit the elapsed into totalMinutesUsedToday; remainingMinutes is derived from it.
        const newUsed = Math.min(child.dailyLimitMinutes, child.totalMinutesUsedToday + elapsed);
        const newRemaining = Math.max(0, child.dailyLimitMinutes - newUsed);
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
              notify(`⏰ Temps écoulé — ${c.name}`, 'Le temps d\'écran du jour est terminé !');
              playTimerEnd();
              return {
                ...c,
                remainingMinutes: 0,
                totalMinutesUsedToday: c.totalMinutesUsedToday + (c.dailyLimitMinutes - c.totalMinutesUsedToday),
                isTimerRunning: false,
                timerStartedAt: null,
              };
            }
            // 5-minute warning
            if (remaining <= 5 && remaining > 4.9) {
              notify(`⚠️ ${c.name} — encore 5 minutes`, 'Le temps d\'écran se termine bientôt.');
            }
            return { ...c, remainingMinutes: remaining };
          }),
        }));
      },

      ensureDailyReset: () => {
        const { children } = get();
        const todayStr = today();
        const dow = new Date().getDay() as 0|1|2|3|4|5|6;
        const currentMonday = mondayOf();
        const stale = children.some(c => c.lastResetDate !== todayStr || c.weekStartDate !== currentMonday);
        if (!stale) return;

        set(state => ({
          children: state.children.map(c => {
            const dayChanged = c.lastResetDate !== todayStr;
            const weekChanged = c.weekStartDate !== currentMonday;
            let next: ChildProfile = c;
            if (weekChanged) {
              next = { ...next, weeklyAdjustment: 0, weekStartDate: currentMonday };
            }
            if (dayChanged) {
              const history = [...(c.usageHistory || []), { date: c.lastResetDate, minutes: c.totalMinutesUsedToday }].slice(-30);
              const yStr = yesterdayStr();
              const streakBroken = c.lastStreakDate !== yStr && c.lastStreakDate !== todayStr;
              const projected: ChildProfile = {
                ...next,
                usageHistory: history,
                totalMinutesUsedToday: 0,
                lastResetDate: todayStr,
              };
              const effLimit = computeEffectiveTodayLimit(projected);
              next = {
                ...projected,
                dailyLimitMinutes: effLimit,
                remainingMinutes: effLimit,
                completedMissionIds: [],
                ...(streakBroken ? { streakCount: 0 } : {}),
              };
            }
            void dow;
            return next;
          }),
        }));
        // Persist each updated child to Supabase
        const uid = get().user?.id;
        if (uid && get().isHydrated) {
          get().children.forEach(c => {
            if (c.lastResetDate === todayStr && c.weekStartDate === currentMonday) {
              void upsertChild(uid, c);
            }
          });
        }
      },

      checkCurfew: () => {
        const { settings, children } = get();
        if (!settings.curfewEnabled) return;
        const now = new Date();
        const [h, m] = settings.curfewTime.split(':').map(Number);
        const curfewMinutes = h * 60 + m;
        const nowMinutes = now.getHours() * 60 + now.getMinutes();
        if (nowMinutes === curfewMinutes) {
          children.forEach(c => {
            if (c.isTimerRunning) {
              get().updateChild(c.id, { isTimerRunning: false, timerStartedAt: null });
              notify(`🌙 Couvre-feu — ${c.name}`, `Il est ${settings.curfewTime}, c'est l'heure d'arrêter l'écran.`);
            }
          });
        }
      },

      adjustRemainingMinutes: (delta) => {
        const { activeChildId, children } = get();
        if (!activeChildId) return;
        const child = children.find(c => c.id === activeChildId);
        if (!child) return;
        // Direct adjustment of today's time. Bounded by today's effective limit (not the weekly reservoir).
        const limit = child.dailyLimitMinutes;
        const newUsed = Math.max(0, Math.min(limit, child.totalMinutesUsedToday - delta));
        const newRemaining = Math.max(0, limit - newUsed);
        const activity = makeActivity(
          'time_adjust',
          `Temps ajusté de ${delta > 0 ? '+' : ''}${delta} min`,
          delta > 0 ? '⏱️' : '⏳',
          delta > 0 ? 'green' : 'red'
        );
        get().pushUndoable({
          id: newId(),
          label: `Temps ajusté de ${delta > 0 ? '+' : ''}${delta} min`,
          childId: activeChildId,
          snapshot: { totalMinutesUsedToday: child.totalMinutesUsedToday, remainingMinutes: child.remainingMinutes, activityLog: [...(child.activityLog ?? [])] },
          createdAt: Date.now(),
          activityId: activity.id,
        });
        get().updateChild(activeChildId, {
          totalMinutesUsedToday: newUsed,
          remainingMinutes: newRemaining,
          activityLog: appendActivity(child.activityLog, activity),
        });
        if (delta > 0) {
          get().pushFlyingNumber(`+${delta} min`, '#10b981', 'screen', 'up');
        } else if (delta < 0) {
          get().pushFlyingNumber(`${delta} min`, '#ef4444', 'screen', 'down');
        }
      },

      resetDailyTimer: () => {
        const { activeChildId, children } = get();
        const child = children.find(c => c.id === activeChildId);
        if (!child) return;
        get().updateChild(activeChildId!, {
          remainingMinutes: child.dailyLimitMinutes,
          totalMinutesUsedToday: 0,
          lastResetDate: today(),
          completedMissionIds: [],
        });
      },

      completeMission: (missionId) => {
        const { activeChildId, missions } = get();
        if (!activeChildId) return;
        const mission = missions.find(m => m.id === missionId);
        if (!mission) return;
        const child = get().children.find(c => c.id === activeChildId);
        if (!child) return;
        const already = (child.completedMissionIds ?? []).includes(missionId);
        if (already) return;
        const activity = makeActivity('mission', `${mission.title} (+${mission.creditValue} 🪙)`, mission.icon, 'green');
        get().pushUndoable({
          id: newId(),
          label: `Mission "${mission.title}" validée (+${mission.creditValue} 🪙)`,
          childId: activeChildId,
          snapshot: { credits: child.credits, completedMissionIds: [...(child.completedMissionIds ?? [])], activityLog: [...(child.activityLog ?? [])] },
          createdAt: Date.now(),
          activityId: activity.id,
        });
        const newCompletedIds = [...(child.completedMissionIds ?? []), missionId];
        let nextLog = appendActivity(child.activityLog, activity);
        const enabledMissions = missions.filter(m => m.enabled);
        const allDone = enabledMissions.length > 0
          && enabledMissions.every(m => newCompletedIds.includes(m.id));
        const todayStr = today();
        const alreadyStreakedToday = child.lastStreakDate === todayStr;
        const streakUpdates: Partial<ChildProfile> = {};
        if (allDone && !alreadyStreakedToday) {
          const continuing = child.lastStreakDate === yesterdayStr();
          const newStreak = continuing ? (child.streakCount ?? 0) + 1 : 1;
          streakUpdates.streakCount = newStreak;
          streakUpdates.lastStreakDate = todayStr;
          const streakActivity = makeActivity(
            'streak',
            `Journée complète ! Série de ${newStreak} jour${newStreak > 1 ? 's' : ''}`,
            '🔥',
            'gold'
          );
          nextLog = appendActivity(nextLog, streakActivity);
        }
        get().updateChild(activeChildId, {
          credits: child.credits + mission.creditValue,
          completedMissionIds: newCompletedIds,
          activityLog: nextLog,
          ...streakUpdates,
        });
        get().pushFlyingNumber(`+${mission.creditValue} 🪙`, '#10b981', 'screen', 'up');
        get().triggerConfetti();
        playMissionDone();
        if (streakUpdates.streakCount) {
          setTimeout(() => {
            get().pushFlyingNumber(`🔥 Série ${streakUpdates.streakCount} !`, '#fbbf24', 'screen', 'up');
            get().triggerConfetti();
            playStreak();
          }, 600);
        }
      },

      convertCreditsToStars: () => {
        const { activeChildId, settings } = get();
        if (!activeChildId) return;
        const child = get().children.find(c => c.id === activeChildId);
        if (!child) return;
        const starsToAdd = Math.floor(child.credits / settings.creditToStarRatio);
        if (starsToAdd === 0) return;
        const creditsSpent = starsToAdd * settings.creditToStarRatio;
        const remainingCredits = child.credits % settings.creditToStarRatio;
        const activity = makeActivity('convert', `Conversion ${creditsSpent} 🪙 → ${starsToAdd} ⭐`, '✨', 'gold');
        get().pushUndoable({
          id: newId(),
          label: `Conversion ${creditsSpent} 🪙 → ${starsToAdd} ⭐`,
          childId: activeChildId,
          snapshot: { credits: child.credits, stars: child.stars, activityLog: [...(child.activityLog ?? [])] },
          createdAt: Date.now(),
          activityId: activity.id,
        });
        get().updateChild(activeChildId, {
          credits: remainingCredits,
          stars: child.stars + starsToAdd,
          activityLog: appendActivity(child.activityLog, activity),
        });
        get().pushFlyingNumber(`−${creditsSpent} 🪙`, '#ef4444', 'credits', 'down');
        get().pushFlyingNumber(`+${starsToAdd} ⭐`, '#fbbf24', 'stars', 'up');
        get().triggerConfetti();
        playConvert();
      },

      redeemReward: (rewardId) => {
        const { activeChildId, rewards, settings } = get();
        if (!activeChildId) return;
        const reward = rewards.find(r => r.id === rewardId);
        if (!reward) return;
        const child = get().children.find(c => c.id === activeChildId);
        if (!child || child.stars < reward.starCost) return;
        const activity = makeActivity(
          reward.isMinutesReward ? 'reward_minutes' : 'reward_item',
          reward.isMinutesReward && reward.bonusMinutes
            ? `${reward.title} (+${reward.bonusMinutes} min)`
            : `${reward.title} acheté (−${reward.starCost} ⭐)`,
          reward.icon,
          'gold'
        );
        // Snapshot before mutation
        const snapshot: Partial<ChildProfile> = {
          stars: child.stars,
          weeklyAdjustment: child.weeklyAdjustment ?? 0,
          dailyLimitMinutes: child.dailyLimitMinutes,
          remainingMinutes: child.remainingMinutes,
          claimedRewards: [...(child.claimedRewards ?? [])],
          activityLog: [...(child.activityLog ?? [])],
        };
        get().pushUndoable({
          id: newId(),
          label: `Récompense "${reward.title}" achetée`,
          childId: activeChildId,
          snapshot,
          createdAt: Date.now(),
          activityId: activity.id,
        });
        const updates: Partial<ChildProfile> = {
          stars: child.stars - reward.starCost,
          activityLog: appendActivity(child.activityLog, activity),
        };
        if (reward.isMinutesReward && reward.bonusMinutes) {
          // Bonus minutes feed the weekly reservoir; propagate today's share immediately.
          const newAdj = (child.weeklyAdjustment ?? 0) + reward.bonusMinutes;
          const projected: ChildProfile = { ...child, weeklyAdjustment: newAdj };
          const effLimit = computeEffectiveTodayLimit(projected);
          updates.weeklyAdjustment = newAdj;
          updates.dailyLimitMinutes = effLimit;
          updates.remainingMinutes = Math.max(0, effLimit - child.totalMinutesUsedToday);
        }
        if (!reward.isMinutesReward) {
          // Non-minutes rewards are added to a "claimed" backlog visible until acknowledged.
          const claim = {
            id: newId(),
            rewardId: reward.id,
            title: reward.title,
            icon: reward.icon,
            claimedAt: new Date().toISOString(),
          };
          updates.claimedRewards = [...(child.claimedRewards ?? []), claim];
        }
        get().updateChild(activeChildId, updates);
        get().pushFlyingNumber(`−${reward.starCost} ⭐`, '#ef4444', 'stars', 'down');
        if (reward.isMinutesReward && reward.bonusMinutes) {
          // Big "treasure chest" celebration for time-bonus rewards
          get().triggerRewardCelebration(reward.bonusMinutes);
          playRewardBig();
        } else {
          // Show what was won in a full-screen burst (icon + title)
          get().pushFlyingNumber(`${reward.icon} ${reward.title} !`, '#fbbf24', 'screen', 'up');
          get().triggerConfetti();
          playRewardSmall();
        }
        void settings;
      },

      removeClaimedReward: (claimId) => {
        const { activeChildId } = get();
        if (!activeChildId) return;
        const child = get().children.find(c => c.id === activeChildId);
        if (!child) return;
        const claimed = (child.claimedRewards ?? []).find(r => r.id === claimId);
        const next = (child.claimedRewards ?? []).filter(r => r.id !== claimId);
        const activity = claimed
          ? makeActivity('reward_fulfilled', `${claimed.title} reçu 🎉`, claimed.icon, 'gold')
          : null;
        get().updateChild(activeChildId, {
          claimedRewards: next,
          ...(activity ? { activityLog: appendActivity(child.activityLog, activity) } : {}),
        });
      },

      addMission: (mission) => {
        const m: Mission = { ...mission, id: newId() };
        set(state => ({ missions: [...state.missions, m] }));
        const uid = get().user?.id;
        if (uid && get().isHydrated) void upsertMission(uid, m);
      },
      updateMission: (id, updates) => {
        set(state => ({
          missions: state.missions.map(m => m.id === id ? { ...m, ...updates } : m)
        }));
        const uid = get().user?.id;
        const m = get().missions.find(x => x.id === id);
        if (uid && m && get().isHydrated) void upsertMission(uid, m);
      },
      deleteMission: (id) => {
        set(state => ({ missions: state.missions.filter(m => m.id !== id) }));
        if (get().isHydrated) void deleteMissionRow(id);
      },

      applyMalus: (malusId, mode) => {
        const { activeChildId, malus } = get();
        if (!activeChildId) return;
        const m = malus.find(x => x.id === malusId);
        if (!m) return;
        const child = get().children.find(c => c.id === activeChildId);
        if (!child) return;

        if (mode === 'minutes' && m.minutesPenalty > 0) {
          const activity = makeActivity('malus_minutes', `${m.title} (−${m.minutesPenalty} min)`, m.icon, 'red');
          const newAdj = (child.weeklyAdjustment ?? 0) - m.minutesPenalty;
          const projected: ChildProfile = { ...child, weeklyAdjustment: newAdj };
          const effLimit = computeEffectiveTodayLimit(projected);
          get().pushUndoable({
            id: newId(),
            label: `Malus "${m.title}" appliqué (−${m.minutesPenalty} min)`,
            childId: activeChildId,
            snapshot: {
              weeklyAdjustment: child.weeklyAdjustment ?? 0,
              dailyLimitMinutes: child.dailyLimitMinutes,
              remainingMinutes: child.remainingMinutes,
              activityLog: [...(child.activityLog ?? [])],
            },
            createdAt: Date.now(),
            activityId: activity.id,
          });
          get().updateChild(activeChildId, {
            weeklyAdjustment: newAdj,
            dailyLimitMinutes: effLimit,
            remainingMinutes: Math.max(0, effLimit - child.totalMinutesUsedToday),
            activityLog: appendActivity(child.activityLog, activity),
          });
          get().pushFlyingNumber(`−${m.minutesPenalty} min`, '#ef4444', 'screen', 'down');
          get().triggerPunishmentFlash();
          playMalus();
        } else if (mode === 'credits' && m.creditPenalty > 0) {
          const activity = makeActivity('malus_credits', `${m.title} (−${m.creditPenalty} 🪙)`, m.icon, 'red');
          get().pushUndoable({
            id: newId(),
            label: `Malus "${m.title}" appliqué (−${m.creditPenalty} 🪙)`,
            childId: activeChildId,
            snapshot: { credits: child.credits, activityLog: [...(child.activityLog ?? [])] },
            createdAt: Date.now(),
            activityId: activity.id,
          });
          get().updateChild(activeChildId, {
            credits: child.credits - m.creditPenalty,
            activityLog: appendActivity(child.activityLog, activity),
          });
          get().pushFlyingNumber(`−${m.creditPenalty} 🪙`, '#ef4444', 'screen', 'down');
          playMalus();
        }
      },
      addMalus: (m) => {
        const item: Malus = { ...m, id: newId() };
        set(state => ({ malus: [...state.malus, item] }));
        const uid = get().user?.id;
        if (uid && get().isHydrated) void upsertMalus(uid, item);
      },
      updateMalus: (id, updates) => {
        set(state => ({ malus: state.malus.map(m => m.id === id ? { ...m, ...updates } : m) }));
        const uid = get().user?.id;
        const m = get().malus.find(x => x.id === id);
        if (uid && m && get().isHydrated) void upsertMalus(uid, m);
      },
      deleteMalus: (id) => {
        set(state => ({ malus: state.malus.filter(m => m.id !== id) }));
        if (get().isHydrated) void deleteMalusRow(id);
      },

      addReward: (reward) => {
        const r: Reward = { ...reward, id: newId() };
        set(state => ({ rewards: [...state.rewards, r] }));
        const uid = get().user?.id;
        if (uid && get().isHydrated) void upsertReward(uid, r);
      },
      updateReward: (id, updates) => {
        set(state => ({ rewards: state.rewards.map(r => r.id === id ? { ...r, ...updates } : r) }));
        const uid = get().user?.id;
        const r = get().rewards.find(x => x.id === id);
        if (uid && r && get().isHydrated) void upsertReward(uid, r);
      },
      deleteReward: (id) => {
        set(state => ({ rewards: state.rewards.filter(r => r.id !== id) }));
        if (get().isHydrated) void deleteRewardRow(id);
      },

      updateSettings: (updates) => {
        set(state => ({ settings: { ...state.settings, ...updates } }));
        setSoundsEnabled(get().settings.soundsEnabled ?? true);
        const uid = get().user?.id;
        if (uid && get().isHydrated) void upsertProfile(uid, { settings: get().settings });
      },

      setHelpMode: (active, step = 0) => set({ helpModeActive: active, helpStep: step }),
      setHelpStep: (step) => set({ helpStep: step }),
      triggerConfetti: () => {
        set({ showConfetti: true });
        setTimeout(() => set({ showConfetti: false }), 3000);
      },
      setConfetti: (show) => set({ showConfetti: show }),
      setPage: (page) => set({ currentPage: page }),

      exportData: () => {
        const s = get();
        const payload = {
          version: 1,
          exportedAt: new Date().toISOString(),
          data: {
            user: s.user,
            isAuthenticated: s.isAuthenticated,
            hasCompletedOnboarding: s.hasCompletedOnboarding,
            uiThemeId: s.uiThemeId,
            children: s.children,
            activeChildId: s.activeChildId,
            missions: s.missions,
            malus: s.malus,
            rewards: s.rewards,
            settings: s.settings,
          },
        };
        return JSON.stringify(payload, null, 2);
      },

      importData: (json) => {
        try {
          const parsed = JSON.parse(json);
          const data = parsed?.data;
          if (!data || !Array.isArray(data.children) || !Array.isArray(data.missions)) return false;
          set({
            user: data.user ?? null,
            isAuthenticated: !!data.isAuthenticated,
            hasCompletedOnboarding: !!data.hasCompletedOnboarding,
            uiThemeId: data.uiThemeId ?? 'galactic',
            children: data.children,
            activeChildId: data.activeChildId ?? (data.children[0]?.id ?? null),
            missions: data.missions,
            malus: data.malus ?? [],
            rewards: data.rewards ?? [],
            settings: { ...defaultSettings, ...(data.settings ?? {}) },
          });
          return true;
        } catch {
          return false;
        }
      },
    }),
    {
      name: 'silteplay-store',
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
        if (!state) return;
        const todayStr = today();
        if (state.children) {
          state.children = state.children.map(c => {
            const next: ChildProfile = {
              ...c,
              themeId: c.themeId || 'galactic',
              streakCount: c.streakCount ?? 0,
              lastStreakDate: c.lastStreakDate ?? null,
            };
            // Commit any elapsed time from a session left running across reload/tab close.
            // Without this, closing the tab effectively pauses the timer (cheat).
            if (next.isTimerRunning && next.timerStartedAt) {
              const sameDay = next.lastResetDate === todayStr;
              if (!sameDay) {
                // Day rolled over while timer was running: archive yesterday and reset.
                const history = [...(next.usageHistory || []), { date: next.lastResetDate, minutes: next.totalMinutesUsedToday }].slice(-30);
                const currentMonday = mondayOf();
                next.usageHistory = history;
                next.totalMinutesUsedToday = 0;
                next.lastResetDate = todayStr;
                next.completedMissionIds = [];
                if (next.weekStartDate !== currentMonday) {
                  next.weeklyAdjustment = 0;
                  next.weekStartDate = currentMonday;
                }
                const effLimit = computeEffectiveTodayLimit(next);
                next.dailyLimitMinutes = effLimit;
                next.remainingMinutes = effLimit;
              } else {
                const elapsed = (Date.now() - next.timerStartedAt) / 1000 / 60;
                const base = next.dailyLimitMinutes - next.totalMinutesUsedToday;
                const used = Math.max(0, Math.min(base, elapsed));
                next.totalMinutesUsedToday = next.totalMinutesUsedToday + used;
                next.remainingMinutes = Math.max(0, next.dailyLimitMinutes - next.totalMinutesUsedToday);
              }
            }
            // Always stop timer on rehydrate; user must explicitly resume.
            next.isTimerRunning = false;
            next.timerStartedAt = null;
            return next;
          });
        }
        if (!state.uiThemeId) {
          state.uiThemeId = 'galactic';
        }
      },
    }
  )
);
