import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { themes } from '../themes/themes';
import CircularTimer from '../components/CircularTimer';
import TimerAdjustModal from '../components/TimerAdjustModal';
import ClaimedRewardsList from '../components/ClaimedRewardsList';
import DateTimeHeader from '../components/DateTimeHeader';
import UndoToast from '../components/UndoToast';

export default function ShowMode() {
  const navigate = useNavigate();
  const {
    isAuthenticated, children, activeChildId,
    startTimer, pauseTimer, tickTimer, checkCurfew, ensureDailyReset,
  } = useAppStore();

  const child = children.find(c => c.id === activeChildId);
  const theme = child ? themes[child.themeId] : themes['galactic'];
  const containerRef = useRef<HTMLDivElement>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const [size, setSize] = useState(420);
  const [adjustOpen, setAdjustOpen] = useState(false);

  // Compute a generous timer size that fits ~55% of the smallest viewport dim
  useEffect(() => {
    const computeSize = () => {
      const min = Math.min(window.innerWidth, window.innerHeight);
      setSize(Math.max(280, Math.round(min * 0.62)));
    };
    computeSize();
    window.addEventListener('resize', computeSize);
    return () => window.removeEventListener('resize', computeSize);
  }, []);

  // Tick + curfew + daily reset (same loop pattern as Dashboard)
  const anyRunning = children.some(c => c.isTimerRunning);
  useEffect(() => {
    const interval = setInterval(() => {
      if (anyRunning) tickTimer();
      checkCurfew();
      ensureDailyReset();
    }, 1000);
    return () => clearInterval(interval);
  }, [anyRunning, tickTimer, checkCurfew, ensureDailyReset]);

  // Auto fullscreen + wake lock on mount
  useEffect(() => {
    const enterFs = async () => {
      try {
        if (containerRef.current && document.fullscreenEnabled && !document.fullscreenElement) {
          await containerRef.current.requestFullscreen();
        }
      } catch { /* user gesture required on some browsers; ignore */ }
    };
    const acquireWakeLock = async () => {
      try {
        const navAny = navigator as Navigator & { wakeLock?: { request: (type: 'screen') => Promise<WakeLockSentinel> } };
        if (navAny.wakeLock?.request) {
          wakeLockRef.current = await navAny.wakeLock.request('screen');
        }
      } catch { /* unsupported */ }
    };
    enterFs();
    acquireWakeLock();

    const onVisibility = () => {
      if (document.visibilityState === 'visible') acquireWakeLock();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      wakeLockRef.current?.release().catch(() => {});
      wakeLockRef.current = null;
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    };
  }, []);

  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  if (!child) return <Navigate to="/app" replace />;

  const isRunning = child.isTimerRunning;

  return (
    <div ref={containerRef} className={`fixed inset-0 ${theme.bg} flex flex-col`}>
      <DateTimeHeader />
      {/* Top bar: child + exit */}
      <div className="flex items-center justify-between px-6 pt-2">
        <div className="flex items-center gap-3">
          <span style={{ fontSize: 48 }}>{child.avatarId}</span>
          <div className={`text-2xl font-black ${theme.text}`}>{child.name}</div>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/app')}
          className={`text-2xl ${theme.text} opacity-50 hover:opacity-100 transition w-12 h-12 rounded-full flex items-center justify-center ${theme.card}`}
          aria-label="Quitter le mode présentation"
        >
          ✕
        </motion.button>
      </div>

      {/* Timer center */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <CircularTimer
          remainingMinutes={child.remainingMinutes}
          dailyLimitMinutes={child.dailyLimitMinutes}
          size={size}
        />

        {/* Claimed rewards row */}
        <div className="w-full max-w-xl px-6 mt-6">
          <ClaimedRewardsList large />
        </div>

        {/* Stats row */}
        <div className="flex gap-8 mt-6">
          <div className="text-center">
            <div style={{ fontSize: 56 }}>🪙</div>
            <div className={`font-black ${theme.text} tabular-nums`} style={{ fontSize: 48, lineHeight: 1 }}>
              {Math.floor(child.credits)}
            </div>
          </div>
          <div className="text-center">
            <div style={{ fontSize: 56 }}>⭐</div>
            <div className={`font-black ${theme.text} tabular-nums`} style={{ fontSize: 48, lineHeight: 1 }}>
              {child.stars}
            </div>
          </div>
        </div>
      </div>

      {/* Play/Pause big button + Adjust */}
      <div className="flex justify-center items-center gap-4 pb-10">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setAdjustOpen(true)}
          className={`w-16 h-16 rounded-full font-bold ${theme.card} ${theme.text} flex items-center justify-center`}
          style={{ fontSize: 28 }}
          aria-label="Ajuster le temps"
        >
          ⏱️
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => isRunning ? pauseTimer() : startTimer()}
          disabled={child.remainingMinutes <= 0 && !isRunning}
          className={`w-28 h-28 rounded-full font-black text-white shadow-2xl ${theme.button} disabled:opacity-40 flex items-center justify-center`}
          style={{ fontSize: 56 }}
          aria-label={isRunning ? 'Pause' : 'Démarrer'}
        >
          {child.remainingMinutes <= 0 ? '🚫' : isRunning ? '⏸' : '▶'}
        </motion.button>
        <div className="w-16 h-16" />
      </div>

      <TimerAdjustModal open={adjustOpen} onClose={() => setAdjustOpen(false)} />
      <UndoToast />
    </div>
  );
}
