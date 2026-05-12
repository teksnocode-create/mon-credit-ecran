import { motion } from 'framer-motion';
import { useAppStore } from '../store/appStore';
import { themes } from '../themes/themes';

const DAY_LABELS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

// Lundi 00:00 de la semaine courante au format YYYY-MM-DD
function getMondayISO(d = new Date()): string {
  const day = d.getDay(); // 0 dim, 1 lun, ... 6 sam
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() + diff);
  return monday.toISOString().split('T')[0];
}

export default function WeeklyQuotaCard() {
  const { children, activeChildId } = useAppStore();
  const child = children.find(c => c.id === activeChildId);
  const theme = child ? themes[child.themeId] : themes['galactic'];
  if (!child) return null;

  const baseWeek = (Object.values(child.weekdayLimits ?? {}) as number[]).reduce((s, v) => s + (v || 0), 0);
  const adjustment = child.weeklyAdjustment ?? 0;
  const totalWeek = baseWeek + adjustment;
  if (baseWeek === 0 && adjustment === 0) return null; // pas de semainier configuré

  // Consommation depuis le lundi courant (exclus aujourd'hui car compté à part)
  const mondayISO = getMondayISO();
  const todayISO = new Date().toISOString().split('T')[0];
  const consumedPast = (child.usageHistory ?? [])
    .filter(h => h.date >= mondayISO && h.date < todayISO)
    .reduce((s, h) => s + h.minutes, 0);
  const consumedToday = child.totalMinutesUsedToday;
  const consumed = consumedPast + consumedToday;

  const remaining = Math.max(0, totalWeek - consumed);
  const pct = totalWeek > 0 ? Math.min(100, (consumed / totalWeek) * 100) : 0;

  const todayDow = new Date().getDay();

  return (
    <div className={`${theme.card} rounded-3xl p-4`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className={`font-black ${theme.text} text-sm flex items-center gap-1.5`}>
          📅 Cette semaine
        </h3>
        <div className="text-right">
          <div style={{ color: theme.accent }} className="text-xl font-black tabular-nums leading-none">
            {Math.round(remaining)} min
          </div>
          <div className={`text-[10px] ${theme.textMuted} uppercase tracking-wider`}>restantes</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full overflow-hidden mb-2" style={{ background: theme.timerBg }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: pct > 90 ? '#ef4444' : theme.timerColor }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className={`flex justify-between text-xs ${theme.textMuted} mb-1`}>
        <span>Utilisé : {Math.round(consumed)} min</span>
        <span>
          Total : {totalWeek} min
          {adjustment !== 0 && (
            <span className={`ml-1 font-black ${adjustment > 0 ? 'text-green-400' : 'text-red-400'}`}>
              ({adjustment > 0 ? `+${adjustment}` : adjustment})
            </span>
          )}
        </span>
      </div>
      {adjustment !== 0 && (
        <div className={`text-[10px] ${theme.textMuted} mb-3 italic`}>
          Base {baseWeek} min{' '}
          {adjustment > 0
            ? <span className="text-green-400 font-bold">+ {adjustment} min de bonus</span>
            : <span className="text-red-400 font-bold">− {Math.abs(adjustment)} min de malus</span>}
        </div>
      )}
      {adjustment === 0 && <div className="mb-3" />}

      {/* Mini semainier — chaque jour en pastille */}
      <div className="grid grid-cols-7 gap-1">
        {[1, 2, 3, 4, 5, 6, 0].map(idx => {
          const minutes = child.weekdayLimits?.[idx as 0|1|2|3|4|5|6] ?? 0;
          const isToday = idx === todayDow;
          const isOff = minutes === 0;
          return (
            <div
              key={idx}
              className={`rounded-lg py-1 text-center ${isToday ? 'ring-2' : ''}`}
              style={{
                background: isOff ? 'rgba(239,68,68,0.12)' : `${theme.accent}1f`,
                boxShadow: isToday ? `0 0 0 2px ${theme.accent}` : undefined,
              }}
            >
              <div className={`text-[10px] font-bold ${isToday ? '' : theme.textMuted}`} style={isToday ? { color: theme.accent } : {}}>
                {DAY_LABELS[idx]}
              </div>
              <div className={`text-xs font-black ${isOff ? 'text-red-400' : theme.text}`}>
                {isOff ? '—' : minutes}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
