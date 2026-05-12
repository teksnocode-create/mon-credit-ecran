export interface User {
  id: string;
  email: string;
  name: string;
  avatarId: string;
}

export interface ClaimedReward {
  id: string;
  rewardId: string;
  title: string;
  icon: string;
  claimedAt: string;
}

export type ActivityType =
  | 'mission'
  | 'malus_credits'
  | 'malus_minutes'
  | 'convert'
  | 'reward_minutes'
  | 'reward_item'
  | 'reward_fulfilled'
  | 'time_adjust'
  | 'streak';

export interface ActivityEntry {
  id: string;
  type: ActivityType;
  label: string;
  icon: string;
  timestamp: string;
  color: 'green' | 'red' | 'gold' | 'neutral';
}

export type WeekdayLimits = { 0: number; 1: number; 2: number; 3: number; 4: number; 5: number; 6: number };

export interface ChildProfile {
  id: string;
  name: string;
  avatarId: string;
  themeId: 'galactic' | 'candy' | 'eco';
  credits: number;
  stars: number;
  remainingMinutes: number;
  dailyLimitMinutes: number;
  weekdayLimits: WeekdayLimits;
  totalMinutesUsedToday: number;
  lastResetDate: string;
  usageHistory: { date: string; minutes: number }[];
  isTimerRunning: boolean;
  timerStartedAt: number | null;
  completedMissionIds: string[];
  claimedRewards: ClaimedReward[];
  weeklyAdjustment: number;
  weekStartDate: string | null;
  activityLog: ActivityEntry[];
  streakCount: number;
  lastStreakDate: string | null;
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
  minutesPenalty: number;
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
  curfewEnabled: boolean;
  curfewTime: string;
  alertSound: 'chime' | 'fanfare' | 'bell' | 'none';
  soundsEnabled: boolean;
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
