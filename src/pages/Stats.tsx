import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useAppStore } from '../store/appStore';
import { themes } from '../themes/themes';

const DAYS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

export default function Stats() {
  const { children, activeChildId } = useAppStore();
  const child = children.find(c => c.id === activeChildId);
  const themeId = child?.themeId ?? 'galactic';
  const theme = themes[themeId];

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

  // Build last 7 days data
  const today = new Date();
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayName = DAYS[d.getDay()];
    const isToday = i === 6;
    const histEntry = child.usageHistory.find(h => h.date === dateStr);
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

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`${theme.card} rounded-2xl px-3 py-2`}>
          <p className={`font-black ${theme.text} text-sm`}>{label}</p>
          <p style={{ color: theme.accent }} className="font-bold text-sm">{payload[0].value} min</p>
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

        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { icon: '⏱️', label: 'Aujourd\'hui', value: `${totalToday} min`, sub: `${limitPct}% de la limite` },
            { icon: '📅', label: 'Moy. hebdo', value: `${weekAvg} min`, sub: 'par jour cette semaine' },
            { icon: '🗓️', label: 'Jours actifs', value: `${daysUsed}/7`, sub: 'cette semaine' },
            { icon: '📈', label: 'Total semaine', value: `${weekTotal} min`, sub: `= ${Math.round(weekTotal / 60)}h` },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`${theme.card} rounded-2xl p-4`}
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className={`text-xl font-black ${theme.text}`}>{stat.value}</div>
              <div className={`text-xs ${theme.textMuted}`}>{stat.label}</div>
              <div className={`text-xs ${theme.textMuted} opacity-70`}>{stat.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* Bar chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`${theme.card} rounded-3xl p-4 mb-6`}
        >
          <h2 className={`font-black ${theme.text} mb-4`}>7 derniers jours</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={last7} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.accent + '20'} />
              <XAxis
                dataKey="day"
                tick={{ fill: theme.accent, fontSize: 12, fontWeight: 700 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: theme.accent + '80', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: theme.accent + '10' }} />
              <Bar
                dataKey="minutes"
                fill={theme.accent}
                radius={[8, 8, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
          {/* Limit line indicator */}
          <div className={`flex items-center gap-2 mt-2 text-xs ${theme.textMuted}`}>
            <div className="w-4 h-1 rounded" style={{ background: theme.accent }} />
            <span>Temps utilisé — limite : {child.dailyLimitMinutes} min/jour</span>
          </div>
        </motion.div>

        {/* Today progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`${theme.card} rounded-3xl p-4 mb-6`}
        >
          <h2 className={`font-black ${theme.text} mb-3`}>Aujourd'hui</h2>
          <div className="flex justify-between mb-2">
            <span className={`text-sm font-bold ${theme.text}`}>{totalToday} min utilisées</span>
            <span className={`text-sm ${theme.textMuted}`}>{child.dailyLimitMinutes} min limite</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ background: theme.timerBg }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: limitPct > 90 ? '#ef4444' : theme.timerColor }}
              animate={{ width: `${limitPct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <div className={`text-xs ${theme.textMuted} mt-1 text-right`}>{limitPct}%</div>
        </motion.div>

        {/* Credits & stars this week */}
        <div className="grid grid-cols-2 gap-3">
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
            transition={{ delay: 0.6 }}
            className={`${theme.card} rounded-2xl p-4 text-center`}
          >
            <div className="text-3xl mb-1">⭐</div>
            <div className={`text-2xl font-black ${theme.text}`}>{child.stars}</div>
            <div className={`text-xs ${theme.textMuted}`}>Étoiles gagnées</div>
          </motion.div>
        </div>

        {/* Usage history */}
        {child.usageHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className={`${theme.card} rounded-3xl p-4 mt-6`}
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
