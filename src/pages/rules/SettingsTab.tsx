import { motion } from 'framer-motion';
import { useAppStore } from '../../store/appStore';
import { themes } from '../../themes/themes';
import { WeekdayLimits } from '../../types';
import DebouncedRange from '../../components/DebouncedRange';

type Theme = (typeof themes)[keyof typeof themes];

interface Props {
  theme: Theme;
  showSaved: () => void;
}

// Lundi -> Dimanche (Date.getDay() = 0 dimanche, 1 lundi, ... 6 samedi)
const DAYS: { idx: 0|1|2|3|4|5|6; short: string; long: string }[] = [
  { idx: 1, short: 'Lun', long: 'Lundi' },
  { idx: 2, short: 'Mar', long: 'Mardi' },
  { idx: 3, short: 'Mer', long: 'Mercredi' },
  { idx: 4, short: 'Jeu', long: 'Jeudi' },
  { idx: 5, short: 'Ven', long: 'Vendredi' },
  { idx: 6, short: 'Sam', long: 'Samedi' },
  { idx: 0, short: 'Dim', long: 'Dimanche' },
];

const PRESETS: { label: string; emoji: string; limits: WeekdayLimits }[] = [
  { label: 'École stricte', emoji: '🎒', limits: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 75, 0: 75 } },
  { label: 'École souple', emoji: '📚', limits: { 1: 30, 2: 30, 3: 30, 4: 30, 5: 30, 6: 90, 0: 90 } },
  { label: 'Vacances', emoji: '🌴', limits: { 1: 60, 2: 60, 3: 60, 4: 60, 5: 60, 6: 60, 0: 60 } },
  { label: 'Week-end seul', emoji: '🎮', limits: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 120, 0: 120 } },
];

export default function SettingsTab({ theme, showSaved }: Props) {
  const { settings, updateSettings, children, activeChildId, setChildWeekdayLimits } = useAppStore();
  const child = children.find(c => c.id === activeChildId);
  const todayDow = new Date().getDay();

  return (
    <motion.div
      key="settings"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      {/* Weekly schedule */}
      {child && (
        <div className={`${theme.card} rounded-3xl p-4`}>
          <h3 className={`font-black ${theme.text} mb-1`}>Semainier de {child.name}</h3>
          <p className={`text-xs ${theme.textMuted} mb-3`}>
            Limite par jour de la semaine (0 = pas d'écran ce jour-là).
          </p>

          {/* Presets */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {PRESETS.map(p => (
              <motion.button
                key={p.label}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setChildWeekdayLimits(child.id, p.limits); showSaved(); }}
                className={`py-2 px-2 rounded-xl text-xs font-bold ${theme.buttonSecondary} ${theme.text}`}
              >
                {p.emoji} {p.label}
              </motion.button>
            ))}
          </div>

          {/* Per-day sliders */}
          <div className="space-y-2">
            {DAYS.map(d => {
              const value = child.weekdayLimits?.[d.idx] ?? 0;
              const isToday = todayDow === d.idx;
              return (
                <div key={d.idx} className="flex items-center gap-3">
                  <div className={`w-10 text-sm font-black ${isToday ? '' : theme.textMuted}`} style={isToday ? { color: theme.accent } : {}}>
                    {d.short}
                  </div>
                  <DebouncedRange
                    min={0} max={240} step={15}
                    value={value}
                    onCommit={v => {
                      const next = { ...child.weekdayLimits, [d.idx]: v } as WeekdayLimits;
                      setChildWeekdayLimits(child.id, next);
                    }}
                    onCommitImmediate={() => showSaved()}
                    className="flex-1 accent-purple-500"
                  />
                  <div className={`w-16 text-right text-sm font-black tabular-nums`} style={{ color: theme.accent }}>
                    {value === 0 ? '—' : `${value}m`}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Today summary */}
          <div className={`mt-3 pt-3 border-t border-white/10 flex justify-between text-xs ${theme.textMuted}`}>
            <span>Aujourd'hui ({DAYS.find(d => d.idx === todayDow)?.long})</span>
            <span style={{ color: theme.accent }} className="font-black">
              {child.dailyLimitMinutes === 0 ? 'Pas d\'écran' : `${child.dailyLimitMinutes} min`}
            </span>
          </div>
        </div>
      )}

      {/* PIN */}
      <div className={`${theme.card} rounded-3xl p-4`}>
        <h3 className={`font-black ${theme.text} mb-3`}>Code PIN parental</h3>
        <div className="flex items-center justify-between mb-3">
          <span className={`text-sm ${theme.textMuted}`}>Activer le PIN</span>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => { updateSettings({ pinEnabled: !settings.pinEnabled }); showSaved(); }}
            className={`w-12 h-6 rounded-full transition-all relative ${settings.pinEnabled ? '' : 'bg-white/20'}`}
            style={settings.pinEnabled ? { background: theme.accent } : {}}
          >
            <motion.div
              animate={{ x: settings.pinEnabled ? 24 : 2 }}
              className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
            />
          </motion.button>
        </div>
        {settings.pinEnabled && (
          <div>
            <label className={`text-xs font-bold ${theme.textMuted} block mb-1`}>Code PIN (4 chiffres)</label>
            <input
              type="text"
              maxLength={4}
              value={settings.pin}
              onChange={e => updateSettings({ pin: e.target.value.replace(/\D/g, '').slice(0, 4) })}
              className={`w-full ${theme.card} ${theme.text} rounded-xl px-3 py-2 text-sm font-black tracking-widest outline-none border-0`}
              style={{ background: 'transparent' }}
              placeholder="1234"
            />
          </div>
        )}
      </div>

      {/* Conversion ratios */}
      <div className={`${theme.card} rounded-3xl p-4`}>
        <h3 className={`font-black ${theme.text} mb-3`}>Ratios de conversion</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <span className={`text-sm ${theme.textMuted}`}>Crédits pour 1 ⭐</span>
              <span style={{ color: theme.accent }} className="font-black text-sm">{settings.creditToStarRatio} 🪙</span>
            </div>
            <DebouncedRange
              min={5} max={50} step={5}
              value={settings.creditToStarRatio}
              onCommit={v => updateSettings({ creditToStarRatio: v })}
              onCommitImmediate={() => showSaved()}
              className="w-full accent-purple-500"
            />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className={`text-sm ${theme.textMuted}`}>Minutes par ⭐ échangé</span>
              <span style={{ color: theme.accent }} className="font-black text-sm">{settings.starToMinutesRatio} min</span>
            </div>
            <DebouncedRange
              min={5} max={60} step={5}
              value={settings.starToMinutesRatio}
              onCommit={v => updateSettings({ starToMinutesRatio: v })}
              onCommitImmediate={() => showSaved()}
              className="w-full accent-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Curfew */}
      <div className={`${theme.card} rounded-3xl p-4`}>
        <h3 className={`font-black ${theme.text} mb-3`}>Couvre-feu</h3>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm ${theme.textMuted}`}>Arrêt automatique à</span>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => { updateSettings({ curfewEnabled: !settings.curfewEnabled }); showSaved(); }}
            className="w-12 h-6 rounded-full transition-all relative"
            style={{ background: settings.curfewEnabled ? theme.accent : 'rgba(255,255,255,0.2)' }}
          >
            <motion.div animate={{ x: settings.curfewEnabled ? 24 : 2 }} className="absolute top-1 w-4 h-4 bg-white rounded-full shadow" />
          </motion.button>
        </div>
        {settings.curfewEnabled && (
          <input
            type="time"
            value={settings.curfewTime}
            onChange={e => { updateSettings({ curfewTime: e.target.value }); showSaved(); }}
            className={`w-full ${theme.card} ${theme.text} rounded-xl px-3 py-2 text-sm font-bold outline-none border-0`}
            style={{ background: 'transparent' }}
          />
        )}
      </div>

      {/* Sounds master toggle */}
      <div className={`${theme.card} rounded-3xl p-4`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`font-black ${theme.text}`}>Sons d'ambiance</h3>
            <p className={`text-xs ${theme.textMuted} mt-0.5`}>Feedback audio sur les missions, malus, conversions, récompenses.</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => { updateSettings({ soundsEnabled: !settings.soundsEnabled }); showSaved(); }}
            className="relative w-12 h-6 rounded-full"
            style={{ background: settings.soundsEnabled ? theme.accent : 'rgba(255,255,255,0.2)' }}
          >
            <motion.div animate={{ x: settings.soundsEnabled ? 24 : 2 }} className="absolute top-1 w-4 h-4 bg-white rounded-full shadow" />
          </motion.button>
        </div>
      </div>

      {/* Alert sound */}
      <div className={`${theme.card} rounded-3xl p-4`}>
        <h3 className={`font-black ${theme.text} mb-3`}>Son d'alerte</h3>
        <div className="grid grid-cols-2 gap-2">
          {(['chime', 'fanfare', 'bell', 'none'] as const).map(s => (
            <motion.button
              key={s}
              whileTap={{ scale: 0.95 }}
              onClick={() => { updateSettings({ alertSound: s }); showSaved(); }}
              className={`py-2 rounded-xl text-sm font-bold transition-all ${theme.text}`}
              style={settings.alertSound === s
                ? { background: theme.accent + '40', boxShadow: `0 0 0 2px ${theme.accent}` }
                : { background: 'rgba(255,255,255,0.1)' }
              }
            >
              {s === 'chime' ? '🔔 Carillon' : s === 'fanfare' ? '🎺 Fanfare' : s === 'bell' ? '🔕 Cloche' : '🔇 Aucun'}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
