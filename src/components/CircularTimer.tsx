import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { themes } from '../themes/themes';

interface Props {
  remainingMinutes: number;
  dailyLimitMinutes: number;
  size?: number;
}

// Decorative orbiting particles around the timer
function Particles({ outerSize, color }: { outerSize: number; color: string }) {
  const count = 8;
  const radius = outerSize / 2 - 6;
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ width: outerSize, height: outerSize }}>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        return (
          <motion.span
            key={i}
            className="absolute left-1/2 top-1/2 rounded-full"
            style={{
              width: 6, height: 6,
              background: color,
              boxShadow: `0 0 8px ${color}, 0 0 12px ${color}`,
              translateX: x - 3,
              translateY: y - 3,
            }}
            animate={{ opacity: [0.2, 1, 0.2], scale: [0.6, 1.4, 0.6] }}
            transition={{ duration: 2.4, delay: i * 0.18, repeat: Infinity, ease: 'easeInOut' }}
          />
        );
      })}
    </div>
  );
}

export default function CircularTimer({ remainingMinutes, dailyLimitMinutes, size = 240 }: Props) {
  const { children, activeChildId } = useAppStore();
  const punishmentFlash = useAppStore(s => s.punishmentFlash);
  const child = children.find(c => c.id === activeChildId);
  const theme = child ? themes[child.themeId] : themes['galactic'];

  const shakeControls = useAnimation();
  useEffect(() => {
    if (punishmentFlash > 0) {
      shakeControls.start({ x: [0, -12, 12, -10, 10, -6, 6, 0], transition: { duration: 0.6 } });
    }
  }, [punishmentFlash, shakeControls]);

  const stroke = Math.max(10, Math.round(size * 0.058));
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

  // Outer orbit sizes
  const ring1 = size + Math.round(size * 0.18);
  const ring2 = size + Math.round(size * 0.32);
  const particleOrbit = size + Math.round(size * 0.46);

  return (
    <motion.div animate={shakeControls} className="relative flex items-center justify-center" style={{ width: particleOrbit, height: particleOrbit }}>
      {/* Diffuse radial glow */}
      <div
        className="absolute rounded-full"
        style={{
          width: size * 1.4, height: size * 1.4,
          background: `radial-gradient(circle, ${theme.timerColor}55 0%, ${theme.timerColor}15 40%, transparent 70%)`,
          filter: 'blur(20px)',
        }}
      />

      {/* Outer ring (slower, dashed) */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: ring2, height: ring2,
          border: `1px dashed ${theme.timerColor}66`,
          boxSizing: 'border-box',
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 45, ease: 'linear', repeat: Infinity }}
      />

      {/* Inner ring (faster, gradient with gap) */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: ring1, height: ring1,
          border: `2px solid transparent`,
          background: `conic-gradient(from 0deg, ${theme.timerColor}00 0deg, ${theme.timerColor}aa 90deg, ${theme.timerColor}00 180deg, ${theme.timerColor}aa 270deg, ${theme.timerColor}00 360deg) border-box`,
          WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
      />

      {/* Particles in orbit */}
      <Particles outerSize={particleOrbit} color={theme.timerColor} />

      {/* Main timer */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="relative z-10 -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={theme.timerBg}
            strokeWidth={stroke}
          />
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
            style={{ filter: `drop-shadow(0 0 12px ${theme.timerColor})` }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <motion.div
            key={timeStr}
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 0.3 }}
            className={`font-black ${theme.text} tabular-nums`}
            style={{ fontSize: size * 0.3, lineHeight: 1, letterSpacing: -2 }}
          >
            {timeStr}
          </motion.div>
          <div
            className={`font-semibold uppercase ${theme.textMuted}`}
            style={{ fontSize: size * 0.06, marginTop: size * 0.04, letterSpacing: 2 }}
          >
            restantes
          </div>
        </div>
      </div>
    </motion.div>
  );
}
