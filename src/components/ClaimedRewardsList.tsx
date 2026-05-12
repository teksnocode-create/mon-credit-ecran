import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { themes } from '../themes/themes';
import { ClaimedReward } from '../types';

interface Props {
  large?: boolean; // bigger sizing for ShowMode
}

export default function ClaimedRewardsList({ large = false }: Props) {
  const { children, activeChildId, removeClaimedReward, triggerConfetti, pushFlyingNumber } = useAppStore();
  const child = children.find(c => c.id === activeChildId);
  const theme = child ? themes[child.themeId] : themes['galactic'];
  const [pending, setPending] = useState<ClaimedReward | null>(null);

  const handleConfirm = () => {
    if (!pending) return;
    pushFlyingNumber(`🎉 ${pending.icon} Profité !`, '#fbbf24', 'screen', 'up');
    triggerConfetti();
    removeClaimedReward(pending.id);
    setPending(null);
  };

  const items = child?.claimedRewards ?? [];
  if (items.length === 0) return null;

  const cardSize = large ? 'min-w-[120px] p-3' : 'min-w-[100px] p-2.5';
  const iconSize = large ? 'text-4xl' : 'text-3xl';
  const titleSize = large ? 'text-sm' : 'text-xs';

  return (
    <div className="w-full">
      <h3 className={`text-sm font-black ${theme.text} mb-2 flex items-center gap-2`}>
        🎁 À profiter
        <span className={`text-xs font-bold ${theme.textMuted}`}>({items.length})</span>
      </h3>
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
        {items.map(item => (
          <motion.button
            key={item.id}
            layout
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setPending(item)}
            className={`${theme.card} rounded-2xl ${cardSize} flex flex-col items-center gap-1 flex-shrink-0 transition`}
            title={item.title}
          >
            <span className={iconSize}>{item.icon}</span>
            <span className={`${titleSize} font-bold ${theme.text} text-center leading-tight max-w-[100px] truncate`}>
              {item.title}
            </span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {pending && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
            onClick={() => setPending(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              onClick={e => e.stopPropagation()}
              className={`${theme.card} rounded-3xl p-6 max-w-sm w-full text-center`}
            >
              <div className="text-6xl mb-3">{pending.icon}</div>
              <h3 className={`text-xl font-black ${theme.text} mb-1`}>{pending.title}</h3>
              <p className={`${theme.textMuted} text-sm mb-5`}>
                Tu confirmes que {child?.name ?? 'l\'enfant'} en a profité ?
              </p>
              <div className="flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPending(null)}
                  className={`flex-1 py-3 rounded-2xl font-bold text-sm ${theme.buttonSecondary} ${theme.text}`}
                >
                  Pas encore
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleConfirm}
                  className={`flex-1 py-3 rounded-2xl font-black text-sm text-white btn-3d ${theme.button}`}
                >
                  Oui, reçu ✓
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
