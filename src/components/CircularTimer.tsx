import { motion } from 'framer-motion';
import { useAppStore } from '../store/appStore';
import { themes } from '../themes/themes';

interface Props {
  remainingMinutes: number;
  dailyLimitMinutes: number;
}

export default function CircularTimer({ remainingMinutes, dailyLimitMinutes }: Props) {
  const { children, activeChildId } = useAppStore();
  const child = children.find(c => c.id === activeChildId);
  const theme = child ? themes[child.themeId] : themes['galactic'];

  const size = 240;
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = dailyLimitMinutes > 0 ? Math.min(1, Math.max(0, remainingMinutes / dailyLimitMinutes)) : 0;
  const offset = circumference * (1 - pct);

  const hours = Math.floor(remainingMinutes / 60);
  const mins = Math.floor(remainingMinutes % 60);
  const secs = Math.floor((remainingMinutes * 60) % 60);
  const timeStr = hours > 0
    ? `${hours}h${String(mins).padStart(2, '0')}`
    : `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const emoji = pct < 0.1 ? '😟' : pct < 0.5 ? '😐' : '🤩';

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background glow */}
        <div
          className="absolute inset-0 rounded-full opacity-20 blur-2xl"
          style={{ background: theme.timerColor }}
        />

        <svg width={size} height={size} className="relative z-10 -rotate-90">
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={theme.timerBg}
            strokeWidth={stroke}
          />
          {/* Progress */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={theme.timerColor}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 8px ${theme.timerColor})` }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <motion.div
            key={emoji}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl mb-1"
          >
            {emoji}
          </motion.div>
          <motion.div
            key={timeStr}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.3 }}
            className={`text-3xl font-black ${theme.text} tabular-nums`}
          >
            {timeStr}
          </motion.div>
          <div className={`text-xs font-semibold ${theme.textMuted} mt-1`}>
            restantes
          </div>
        </div>
      </div>

      {/* Percentage bar */}
      <div className="mt-3 w-48">
        <div className={`h-2 rounded-full overflow-hidden`} style={{ background: theme.timerBg }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: theme.timerColor }}
            animate={{ width: `${pct * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className={`flex justify-between text-xs mt-1 ${theme.textMuted}`}>
          <span>0</span>
          <span>{Math.round(pct * 100)}%</span>
          <span>{dailyLimitMinutes}min</span>
        </div>
      </div>
    </div>
  );
}
