import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/appStore';
import { themes } from '../themes/themes';

interface Props {
  open: boolean;
  onClose: () => void;
}

const DELTAS = [5, 15, 30];

export default function TimerAdjustModal({ open, onClose }: Props) {
  const { adjustRemainingMinutes, children, activeChildId } = useAppStore();
  const child = children.find(c => c.id === activeChildId);
  const theme = child ? themes[child.themeId] : themes['galactic'];

  const handle = (delta: number) => {
    adjustRemainingMinutes(delta);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-end justify-center"
          style={{ background: 'rgba(0,0,0,0.7)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 36 }}
            className={`${theme.card} rounded-t-3xl p-6 w-full max-w-md`}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-black ${theme.text}`}>⏱️ Ajuster le temps</h3>
              <button onClick={onClose} className={`text-2xl ${theme.textMuted}`} aria-label="Fermer">✕</button>
            </div>

            <p className={`text-xs ${theme.textMuted} mb-4`}>
              Modifie le temps restant pour aujourd'hui. La limite quotidienne ({child?.dailyLimitMinutes ?? 60} min) reste inchangée.
            </p>

            <div className="space-y-2 mb-4">
              <div className={`text-xs font-bold ${theme.textMuted} mb-1`}>Ajouter du temps</div>
              <div className="grid grid-cols-3 gap-2">
                {DELTAS.map(d => (
                  <motion.button
                    key={`add-${d}`}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => handle(d)}
                    className="py-3 rounded-2xl font-black text-white bg-green-500 hover:bg-green-400 transition-all"
                  >
                    +{d} min
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className={`text-xs font-bold ${theme.textMuted} mb-1`}>Retirer du temps</div>
              <div className="grid grid-cols-3 gap-2">
                {DELTAS.map(d => (
                  <motion.button
                    key={`rm-${d}`}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => handle(-d)}
                    className="py-3 rounded-2xl font-black text-white bg-red-500 hover:bg-red-400 transition-all"
                  >
                    −{d} min
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
