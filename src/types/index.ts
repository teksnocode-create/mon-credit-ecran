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
  credits: number;
  stars: number;
  remainingMinutes: number;
  dailyLimitMinutes: number;
  totalMinutesUsedToday: number;
  lastResetDate: string;
  usageHistory: { date: string; minutes: number }[];
}

export interface Mission {
  id: string;
  title: string;
  icon: string;
  creditValue: number;
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
  themeId: 'galactic' | 'candy' | 'eco';
  children: ChildProfile[];
  activeChildId: string | null;
  isTimerRunning: boolean;
  timerStartedAt: number | null;
  missions: Mission[];
  rewards: Reward[];
  settings: ParentalSettings;
  helpModeActive: boolean;
  helpStep: number;
  showConfetti: boolean;
  currentPage: 'dashboard' | 'stats' | 'profile' | 'rules';
}
