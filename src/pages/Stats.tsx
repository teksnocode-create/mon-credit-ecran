import { motion } from 'framer-motion';
import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useAppStore } from '../store/appStore';
import { themes } from '../themes/themes';
import { ActivityEntry } from '../types';

const DAYS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

const dateKey = (iso: string) => new Date(iso).toISOString().split('T')[0];

export default function Stats() {
  const { children, activeChildId, missions } = useAppStore();
  const child = children.find(c => c.id === activeChildId);
  const themeId = child?.themeId ?? 'galactic';
  const theme = themes[themeId];

  // Build last 7 days range (always called for hook stability)
  const last7Dates = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (6 - i));
      return { iso: d.toISOString().split('T')[0], dayName: DAYS[d.getDay()] };
    });
  }, []);

  // Activity-derived data
  const activityStats = useMemo(() => {
    const log: ActivityEntry[] = child?.activityLog ?? [];
    const dateSet = new Set(last7Dates.map(d => d.iso));
    const inWindow = log.filter(e => dateSet.has(dateKey(e.timestamp)));

    const missionsByDay = last7Dates.map(({ iso, dayName }) => ({
      day: dayName,
      missions: inWindow.filter(e => e.type === 'mission' && dateKey(e.timestamp) === iso).length,
    }));

    const missionCount = inWindow.filter(e => e.type === 'mission').length;
    const malusCount = inWindow.filter(e => e.type === 'malus_credits' || e.type === 'malus_minutes').length;
    const rewardsCount = inWindow.filter(e => e.type === 'reward_minutes' || e.type === 'reward_item').length;

    // Top missions by frequency (using mission entries' label start)
    const labelCounts = new Map<string, { icon: string; count: number }>();
    inWindow.filter(e => e.type === 'mission').forEach(e => {
      // label format: "Devoirs (+10 🪙)" → extract title
      const title = e.label.split(' (')[0];
      const cur = labelCounts.get(title);
      if (cur) cur.count += 1;
      else labelCounts.set(title, { icon: e.icon, count: 1 });
    });
    const topMissions = Array.from(labelCounts.entries())
      .map(([title, v]) => ({ title, icon: v.icon, count: v.count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    return { missionsByDay, missionCount, malusCount, rewardsCount, topMissions };
  }, [child?.activityLog, last7Dates]);

  if (!child) {
    return (
      <div className={`min-h-screen ${theme.bg} flex items-center justify-center pb-20`}>
        <div className={`${theme.card} rounded-3xl p-8 text-center mx-4`}>
          <div className="text-4xl mb-2">📊</div>
          <p className={`${theme.text} font-bold`}>Aucun profil sélectionné</p>
        </div>
      </div>
    );
  }

  // Screen time per day (last 7 days)
  const last7 = last7Dates.map(({ iso, dayName }, i) => {
    const isToday = i === 6;
    const histEntry = child.usageHistory.find(h => h.date === iso);
    const minutes = isToday ? child.totalMinutesUsedToday : (histEntry?.minutes ?? 0);
    return { day: dayName, minutes: Math.round(minutes), isToday };
  });

  const totalToday = Math.round(child.totalMinutesUsedToday);
  const weekTotal = last7.reduce((s, d) => s + d.minutes, 0);
  const weekAvg = Math.round(weekTotal / 7);
  const daysUsed = last7.filter(d => d.minutes > 0).length;
  const limitPct = child.dailyLimitMinutes > 0
    ? Math.min(100, Math.round((totalToday / child.dailyLimitMinutes) * 100))
    : 0;

  const enabledMissionCount = missions.filter(m => m.enabled).length;
  const completedTodayCount = (child.completedMissionIds ?? []).length;
  const completionPct = enabledMissionCount > 0
    ? Math.round((completedTodayCount / enabledMissionCount) * 100)
    : 0;

  const totalBehavior = activityStats.missionCount + activityStats.malusCount;
  const positivePct = totalBehavior > 0
    ? Math.round((activityStats.missionCount / totalBehavior) * 100)
    : 0;

  const makeTooltip = (suffix: string) => (props: { active?: boolean; payload?: Array<{ value?: number | string }>; label?: string }) => {
    const { active, payload, label } = props;
    if (active && payload && payload.length) {
      return (
        <div className={`${theme.card} rounded-2xl px-3 py-2`}>
          <p className={`font-black ${theme.text} text-sm`}>{label}</p>
          <p style={{ color: theme.accent }} className="font-bold text-sm">{payload[0].value} {suffix}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`min-h-screen ${theme.bg} pb-24`}>
      <div className="max-w-md mx-auto px-4 pt-6">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-2xl font-black ${theme.text} mb-6`}
        >
          Statistiques 📊
        </motion.h1>

        {/* Streak hero */}
        {(child.streakCount ?? 0) > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`${theme.card} rounded-3xl p-5 mb-6 flex items-center gap-4`}
          >
            <div className="text-5xl">🔥</div>
            <div className="flex-1">
              <div className={`text-3xl font-black ${theme.text}`}>{child.streakCount}</div>
              <div className={`text-xs font-bold ${theme.textMuted}`}>
                jour{child.streakCount > 1 ? 's' : ''} d'affilée — toutes missions OK
              </div>
            </div>
          </motion.div>
        )}

        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { icon: '⏱️', label: 'Aujourd\'hui', value: `${totalToday} min`, sub: `${limitPct}% de la limite` },
            { icon: '📅', label: 'Moy. hebdo', value: `${weekAvg} min`, sub: 'par jour cette semaine' },
            { icon: '✅', label: 'Missions 7j', value: `${activityStats.missionCount}`, sub: `${activityStats.malusCount} malus` },
            { icon: '🎁', label: 'Récompenses 7j', value: `${activityStats.rewardsCount}`, sub: 'cadeaux échangés' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`${theme.card} rounded-2xl p-4`}
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className={`text-xl font-black ${theme.text}`}>{stat.value}</div>
              <div className={`text-xs ${theme.textMuted}`}>{stat.label}</div>
              <div className={`text-xs ${theme.textMuted} opacity-70`}>{stat.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* Today completion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`${theme.card} rounded-3xl p-4 mb-6`}
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className={`font-black ${theme.text}`}>Missions du jour</h2>
            <span className={`text-sm font-bold ${theme.text}`}>{completedTodayCount}/{enabledMissionCount}</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ background: theme.timerBg }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: theme.timerColor }}
              animate={{ width: `${completionPct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <div className={`text-xs ${theme.textMuted} mt-1 text-right`}>{completionPct}%</div>
        </motion.div>

        {/* Missions per day chart */}
        {activityStats.missionCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className={`${theme.card} rounded-3xl p-4 mb-6`}
          >
            <h2 className={`font-black ${theme.text} mb-4`}>Missions accomplies — 7 jours</h2>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={activityStats.missionsByDay} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.accent + '20'} />
                <XAxis dataKey="day" tick={{ fill: theme.accent, fontSize: 12, fontWeight: 700 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: theme.accent + '80', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={makeTooltip('✅') as never} cursor={{ fill: theme.accent + '10' }} />
                <Bar dataKey="missions" fill="#10b981" radius={[8, 8, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Top missions */}
        {activityStats.topMissions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`${theme.card} rounded-3xl p-4 mb-6`}
          >
            <h2 className={`font-black ${theme.text} mb-3`}>Top missions 🏆</h2>
            <div className="space-y-2">
              {activityStats.topMissions.map((m, i) => (
                <div key={m.title} className="flex items-center gap-3">
                  <span className={`text-xs font-black ${theme.textMuted} w-4`}>{i + 1}</span>
                  <span className="text-xl">{m.icon}</span>
                  <span className={`text-sm font-bold ${theme.text} flex-1 truncate`}>{m.title}</span>
                  <span className={`text-sm font-black`} style={{ color: theme.accent }}>×{m.count}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Behavior ratio */}
        {totalBehavior > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className={`${theme.card} rounded-3xl p-4 mb-6`}
          >
            <h2 className={`font-black ${theme.text} mb-3`}>Comportement — 7 jours</h2>
            <div className="flex h-4 rounded-full overflow-hidden">
              <motion.div
                className="bg-emerald-500"
                animate={{ width: `${positivePct}%` }}
                transition={{ duration: 0.8 }}
              />
              <motion.div
                className="bg-red-500"
                animate={{ width: `${100 - positivePct}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs font-bold">
              <span className="text-emerald-500">✅ {activityStats.missionCount} ({positivePct}%)</span>
              <span className="text-red-500">⚠️ {activityStats.malusCount} ({100 - positivePct}%)</span>
            </div>
          </motion.div>
        )}

        {/* Screen time chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`${theme.card} rounded-3xl p-4 mb-6`}
        >
          <h2 className={`font-black ${theme.text} mb-4`}>Temps d'écran — 7 jours</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={last7} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.accent + '20'} />
              <XAxis dataKey="day" tick={{ fill: theme.accent, fontSize: 12, fontWeight: 700 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: theme.accent + '80', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={makeTooltip('min') as never} cursor={{ fill: theme.accent + '10' }} />
              <Bar dataKey="minutes" fill={theme.accent} radius={[8, 8, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
          <div className={`flex items-center gap-2 mt-2 text-xs ${theme.textMuted}`}>
            <div className="w-4 h-1 rounded" style={{ background: theme.accent }} />
            <span>Limite : {child.dailyLimitMinutes} min/jour · {daysUsed}/7 jours actifs</span>
          </div>
        </motion.div>

        {/* Credits & stars */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className={`${theme.card} rounded-2xl p-4 text-center`}
          >
            <div className="text-3xl mb-1">🪙</div>
            <div className={`text-2xl font-black ${theme.text}`}>{Math.floor(child.credits)}</div>
            <div className={`text-xs ${theme.textMuted}`}>Crédits actuels</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.55 }}
            className={`${theme.card} rounded-2xl p-4 text-center`}
          >
            <div className="text-3xl mb-1">⭐</div>
            <div className={`text-2xl font-black ${theme.text}`}>{child.stars}</div>
            <div className={`text-xs ${theme.textMuted}`}>Étoiles dispo</div>
          </motion.div>
        </div>

        {/* Usage history */}
        {child.usageHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className={`${theme.card} rounded-3xl p-4`}
          >
            <h2 className={`font-black ${theme.text} mb-3`}>Historique récent</h2>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {[...child.usageHistory].reverse().slice(0, 14).map(entry => (
                <div key={entry.date} className="flex justify-between items-center">
                  <span className={`text-sm ${theme.textMuted}`}>
                    {new Date(entry.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: theme.timerBg }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(100, (entry.minutes / child.dailyLimitMinutes) * 100)}%`,
                          background: theme.timerColor,
                        }}
                      />
                    </div>
                    <span className={`text-xs font-bold ${theme.text} w-14 text-right`}>{Math.round(entry.minutes)} min</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
