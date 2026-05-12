import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useAppStore } from '../store/appStore';
import { themes } from '../themes/themes';
import CircularTimer from './CircularTimer';

// Sparkle particles exploding outward from the chest
function Sparkles({ active }: { active: boolean }) {
  const count = 14;
  return (
    <div className="absolute inset-0 pointer-events-none">
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const dist = 180 + Math.random() * 80;
        const x = Math.cos(angle) * dist;
        const y = Math.sin(angle) * dist;
        const delay = Math.random() * 0.15;
        return (
          <motion.span
            key={i}
            className="absolute left-1/2 top-1/2 select-none"
            style={{ fontSize: 28 }}
            initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
            animate={active ? { opacity: [0, 1, 1, 0], x, y, scale: [0, 1.4, 1, 0.8], rotate: [0, 360] } : {}}
            transition={{ duration: 1.6, delay, ease: 'easeOut' }}
          >
            ✨
          </motion.span>
        );
      })}
    </div>
  );
}

export default function RewardCelebration() {
  const { rewardCelebration, clearRewardCelebration, children, activeChildId } = useAppStore();
  const child = children.find(c => c.id === activeChildId);
  const theme = child ? themes[child.themeId] : themes['galactic'];
  const [step, setStep] = useState(0); // 0=idle, 1=chest, 2=open, 3=timer

  useEffect(() => {
    if (!rewardCelebration) { setStep(0); return; }
    setStep(1);
    const t1 = setTimeout(() => setStep(2), 1000);
    const t2 = setTimeout(() => setStep(3), 1700);
    const auto = setTimeout(() => clearRewardCelebration(), 6000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(auto); };
  }, [rewardCelebration, clearRewardCelebration]);

  return (
    <AnimatePresence>
      {rewardCelebration && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[120] flex flex-col items-center justify-center cursor-pointer"
          style={{
            background: 'radial-gradient(circle at center, rgba(124,58,237,0.55) 0%, rgba(0,0,0,0.92) 70%)',
            backdropFilter: 'blur(8px)',
          }}
          onClick={clearRewardCelebration}
        >
          {/* Golden halo behind */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 600, height: 600,
              background: 'radial-gradient(circle, rgba(251,191,36,0.35) 0%, transparent 70%)',
              filter: 'blur(40px)',
            }}
            animate={{ scale: step >= 2 ? [1, 1.3, 1.1] : 0.8, opacity: step >= 2 ? [0.3, 1, 0.8] : 0.2 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'mirror' }}
          />

          {/* Chest / gift */}
          <AnimatePresence mode="wait">
            {step >= 1 && step < 3 && (
              <motion.div
                key={step === 2 ? 'open' : 'closed'}
                initial={{ scale: 0, rotate: -20 }}
                animate={step === 1
                  ? { scale: [0, 1.4, 1, 1.05, 0.95, 1.05, 0.95, 1], rotate: [-20, 0, -3, 3, -3, 3, 0] }
                  : { scale: [1, 1.6, 1.3], rotate: 0 }
                }
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: step === 1 ? 1 : 0.6, ease: 'easeOut' }}
                className="relative z-10 select-none"
                style={{ fontSize: 180 }}
              >
                {step === 2 ? '🎁' : '📦'}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sparkles explosion when chest opens */}
          <Sparkles active={step === 2 || step === 3} />

          {/* CircularTimer in big — appears after chest opens */}
          <AnimatePresence>
            {step >= 3 && child && (
              <motion.div
                initial={{ opacity: 0, scale: 0.4, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                className="relative z-10"
              >
                <CircularTimer
                  remainingMinutes={child.remainingMinutes}
                  dailyLimitMinutes={child.dailyLimitMinutes}
                  size={320}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating "+N min" big golden text */}
          <AnimatePresence>
            {step >= 3 && rewardCelebration && (
              <motion.div
                initial={{ opacity: 0, scale: 0.2, y: 40 }}
                animate={{ opacity: [0, 1, 1, 1], scale: [0.2, 1.5, 1.3, 1.3], y: [40, -20, -30, -30] }}
                exit={{ opacity: 0, y: -60 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="absolute z-20 font-black select-none whitespace-nowrap"
                style={{
                  fontSize: 72,
                  color: '#fbbf24',
                  textShadow: '0 4px 16px rgba(0,0,0,0.7), 0 0 50px #fbbf24, 0 0 12px rgba(255,255,255,0.9)',
                  WebkitTextStroke: '2px rgba(255,255,255,0.4)',
                  top: '12%',
                }}
              >
                +{rewardCelebration.minutes} min
              </motion.div>
            )}
          </AnimatePresence>

          {/* Continue hint */}
          {step >= 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 1 }}
              className={`absolute bottom-10 text-sm font-bold ${theme.textMuted}`}
            >
              Touche pour continuer
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
