import { supabase } from './supabase';
import { ChildProfile, ClaimedReward, Mission, Malus, Reward, ParentalSettings, WeekdayLimits, ActivityEntry } from '../types';

type DbChild = {
  id: string; user_id: string; name: string; avatar_id: string; theme_id: string;
  credits: number; stars: number; remaining_minutes: number; daily_limit_minutes: number;
  weekday_limits: WeekdayLimits;
  total_minutes_used_today: number; last_reset_date: string; usage_history: { date: string; minutes: number }[];
  is_timer_running: boolean; timer_started_at: number | null;
  completed_mission_ids: string[];
  claimed_rewards: ClaimedReward[];
  weekly_adjustment: number;
  week_start_date: string | null;
  activity_log: ActivityEntry[];
  streak_count: number;
  last_streak_date: string | null;
};

type DbMission = { id: string; user_id: string; title: string; icon: string; credit_value: number; description: string; enabled: boolean };
type DbMalus = { id: string; user_id: string; title: string; icon: string; credit_penalty: number; minutes_penalty: number; description: string; enabled: boolean };
type DbReward = { id: string; user_id: string; title: string; icon: string; star_cost: number; description: string; is_minutes_reward: boolean; bonus_minutes: number | null };

export const mapChildFromDb = (r: DbChild): ChildProfile => ({
  id: r.id,
  name: r.name,
  avatarId: r.avatar_id,
  themeId: (r.theme_id as ChildProfile['themeId']) || 'galactic',
  credits: r.credits,
  stars: r.stars,
  remainingMinutes: r.remaining_minutes,
  dailyLimitMinutes: r.daily_limit_minutes,
  totalMinutesUsedToday: r.total_minutes_used_today,
  lastResetDate: r.last_reset_date,
  usageHistory: r.usage_history ?? [],
  isTimerRunning: r.is_timer_running,
  timerStartedAt: r.timer_started_at,
  completedMissionIds: r.completed_mission_ids ?? [],
  claimedRewards: r.claimed_rewards ?? [],
  weekdayLimits: r.weekday_limits ?? { 0: r.daily_limit_minutes, 1: r.daily_limit_minutes, 2: r.daily_limit_minutes, 3: r.daily_limit_minutes, 4: r.daily_limit_minutes, 5: r.daily_limit_minutes, 6: r.daily_limit_minutes },
  weeklyAdjustment: r.weekly_adjustment ?? 0,
  weekStartDate: r.week_start_date ?? null,
  activityLog: r.activity_log ?? [],
  streakCount: r.streak_count ?? 0,
  lastStreakDate: r.last_streak_date ?? null,
});

export const childToDb = (userId: string, c: ChildProfile) => ({
  id: c.id,
  user_id: userId,
  name: c.name,
  avatar_id: c.avatarId,
  theme_id: c.themeId,
  credits: c.credits,
  stars: c.stars,
  remaining_minutes: Math.round(c.remainingMinutes),
  daily_limit_minutes: c.dailyLimitMinutes,
  total_minutes_used_today: c.totalMinutesUsedToday,
  last_reset_date: c.lastResetDate,
  usage_history: c.usageHistory ?? [],
  is_timer_running: c.isTimerRunning,
  timer_started_at: c.timerStartedAt,
  completed_mission_ids: c.completedMissionIds ?? [],
  claimed_rewards: c.claimedRewards ?? [],
  weekday_limits: c.weekdayLimits ?? { 0: c.dailyLimitMinutes, 1: c.dailyLimitMinutes, 2: c.dailyLimitMinutes, 3: c.dailyLimitMinutes, 4: c.dailyLimitMinutes, 5: c.dailyLimitMinutes, 6: c.dailyLimitMinutes },
  weekly_adjustment: c.weeklyAdjustment ?? 0,
  week_start_date: c.weekStartDate ?? null,
  activity_log: c.activityLog ?? [],
  streak_count: c.streakCount ?? 0,
  last_streak_date: c.lastStreakDate ?? null,
});

export const mapMissionFromDb = (r: DbMission): Mission => ({
  id: r.id, title: r.title, icon: r.icon, creditValue: r.credit_value, description: r.description, enabled: r.enabled,
});
export const missionToDb = (userId: string, m: Mission) => ({
  id: m.id, user_id: userId, title: m.title, icon: m.icon, credit_value: m.creditValue, description: m.description, enabled: m.enabled,
});

export const mapMalusFromDb = (r: DbMalus): Malus => ({
  id: r.id, title: r.title, icon: r.icon,
  creditPenalty: r.credit_penalty, minutesPenalty: r.minutes_penalty ?? 0,
  description: r.description, enabled: r.enabled,
});
export const malusToDb = (userId: string, m: Malus) => ({
  id: m.id, user_id: userId, title: m.title, icon: m.icon,
  credit_penalty: m.creditPenalty, minutes_penalty: m.minutesPenalty ?? 0,
  description: m.description, enabled: m.enabled,
});

export const mapRewardFromDb = (r: DbReward): Reward => ({
  id: r.id, title: r.title, icon: r.icon, starCost: r.star_cost, description: r.description,
  isMinutesReward: r.is_minutes_reward, bonusMinutes: r.bonus_minutes ?? undefined,
});
export const rewardToDb = (userId: string, r: Reward) => ({
  id: r.id, user_id: userId, title: r.title, icon: r.icon, star_cost: r.starCost, description: r.description,
  is_minutes_reward: r.isMinutesReward, bonus_minutes: r.bonusMinutes ?? null,
});

export type RemoteData = {
  profile: { id: string; email: string; name: string; avatar_id: string; ui_theme_id: string; has_completed_onboarding: boolean; settings: ParentalSettings };
  children: ChildProfile[];
  missions: Mission[];
  malus: Malus[];
  rewards: Reward[];
};

export const fetchAll = async (): Promise<RemoteData | null> => {
  const { data: sess } = await supabase.auth.getUser();
  const user = sess.user;
  if (!user) return null;

  const [profileRes, childrenRes, missionsRes, malusRes, rewardsRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('children').select('*').eq('user_id', user.id).order('created_at'),
    supabase.from('missions').select('*').eq('user_id', user.id).order('created_at'),
    supabase.from('malus').select('*').eq('user_id', user.id).order('created_at'),
    supabase.from('rewards').select('*').eq('user_id', user.id).order('created_at'),
  ]);

  if (profileRes.error || !profileRes.data) return null;

  return {
    profile: { ...profileRes.data, email: user.email ?? '' },
    children: (childrenRes.data ?? []).map(mapChildFromDb as (r: unknown) => ChildProfile),
    missions: (missionsRes.data ?? []).map(mapMissionFromDb as (r: unknown) => Mission),
    malus: (malusRes.data ?? []).map(mapMalusFromDb as (r: unknown) => Malus),
    rewards: (rewardsRes.data ?? []).map(mapRewardFromDb as (r: unknown) => Reward),
  };
};

const logErr = (op: string, err: unknown) => {
  if (err) console.warn(`[sync] ${op} failed`, err);
};

export const upsertChild = async (userId: string, c: ChildProfile) => {
  const { error } = await supabase.from('children').upsert(childToDb(userId, c));
  logErr('upsertChild', error);
};
export const deleteChildRow = async (id: string) => {
  const { error } = await supabase.from('children').delete().eq('id', id);
  logErr('deleteChild', error);
};

export const upsertMission = async (userId: string, m: Mission) => {
  const { error } = await supabase.from('missions').upsert(missionToDb(userId, m));
  logErr('upsertMission', error);
};
export const deleteMissionRow = async (id: string) => {
  const { error } = await supabase.from('missions').delete().eq('id', id);
  logErr('deleteMission', error);
};

export const upsertMalus = async (userId: string, m: Malus) => {
  const { error } = await supabase.from('malus').upsert(malusToDb(userId, m));
  logErr('upsertMalus', error);
};
export const deleteMalusRow = async (id: string) => {
  const { error } = await supabase.from('malus').delete().eq('id', id);
  logErr('deleteMalus', error);
};

export const upsertReward = async (userId: string, r: Reward) => {
  const { error } = await supabase.from('rewards').upsert(rewardToDb(userId, r));
  logErr('upsertReward', error);
};
export const deleteRewardRow = async (id: string) => {
  const { error } = await supabase.from('rewards').delete().eq('id', id);
  logErr('deleteReward', error);
};

export const upsertProfile = async (
  userId: string,
  patch: Partial<{ name: string; avatar_id: string; ui_theme_id: string; has_completed_onboarding: boolean; settings: ParentalSettings }>
) => {
  const { error } = await supabase.from('profiles').update(patch).eq('id', userId);
  logErr('upsertProfile', error);
};
