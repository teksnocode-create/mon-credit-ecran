export interface User {
  id: string;
  email: string;
  name: string;
  avatarId: string;
}

export interface ChildProfile {
  id: string;
  name: string;
  avatarId: string;
  themeId: 'galactic' | 'candy' | 'eco';
  credits: number;
  stars: number;
  remainingMinutes: number;
  dailyLimitMinutes: number;
  totalMinutesUsedToday: number;
  lastResetDate: string;
  usageHistory: { date: string; minutes: number }[];
  isTimerRunning: boolean;
  timerStartedAt: number | null;
}

export interface Mission {
  id: string;
  title: string;
  icon: string;
  creditValue: number;
  description: string;
  enabled: boolean;
}

export interface Malus {
  id: string;
  title: string;
  icon: string;
  creditPenalty: number;
  description: string;
  enabled: boolean;
}

export interface Reward {
  id: string;
  title: string;
  icon: string;
  starCost: number;
  description: string;
  isMinutesReward: boolean;
  bonusMinutes?: number;
}

export interface ParentalSettings {
  pinEnabled: boolean;
  pin: string;
  creditToStarRatio: number;
  starToMinutesRatio: number;
  schoolModeEnabled: boolean;
  schoolModeLimit: number;
  vacationModeEnabled: boolean;
  vacationModeLimit: number;
  curfewEnabled: boolean;
  curfewTime: string;
  alertSound: 'chime' | 'fanfare' | 'bell' | 'none';
  weekdayLimits: { [key: number]: number };
}

export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  uiThemeId: 'galactic' | 'candy' | 'eco';
  children: ChildProfile[];
  activeChildId: string | null;
  missions: Mission[];
  malus: Malus[];
  rewards: Reward[];
  settings: ParentalSettings;
  helpModeActive: boolean;
  helpStep: number;
  showConfetti: boolean;
  currentPage: 'dashboard' | 'stats' | 'profile' | 'rules';
}
