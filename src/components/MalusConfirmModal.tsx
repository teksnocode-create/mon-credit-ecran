import { motion, AnimatePresence } from 'framer-motion';
import { Malus } from '../types';
import { Theme } from '../themes/themes';

interface Props {
  open: boolean;
  malusItem: Malus | null;
  mode: 'credits' | 'minutes';
  onConfirm: () => void;
  onCancel: () => void;
  theme: Theme;
}

export default function MalusConfirmModal({ open, malusItem, mode, onConfirm, onCancel, theme }: Props) {
  return (
    <AnimatePresence>
      {open && malusItem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            onClick={e => e.stopPropagation()}
            className={`${theme.card} rounded-3xl p-6 max-w-sm w-full`}
          >
            <div className="text-center mb-4">
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
                className="text-5xl mb-3"
              >
                {malusItem.icon}
              </motion.div>
              <h3 className={`text-xl font-black ${theme.text} mb-1`}>Appliquer un malus ?</h3>
              <p className={`${theme.textMuted} text-sm mb-1`}>
                <span className="font-bold text-red-400">{malusItem.title}</span>
              </p>
              <p className={`${theme.textMuted} text-sm`}>{malusItem.description}</p>
            </div>

            <div className="bg-red-500/15 border border-red-500/30 rounded-2xl p-3 text-center mb-5">
              {mode === 'minutes' ? (
                <>
                  <span className="text-2xl font-black text-red-400">−{malusItem.minutesPenalty} min</span>
                  <p className={`text-xs ${theme.textMuted} mt-1`}>de temps d'écran retirées</p>
                </>
              ) : (
                <>
                  <span className="text-2xl font-black text-red-400">−{malusItem.creditPenalty} 🪙</span>
                  <p className={`text-xs ${theme.textMuted} mt-1`}>crédits retirés</p>
                </>
              )}
            </div>

            <div className="flex gap-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onCancel}
                className={`flex-1 py-3 rounded-2xl font-bold text-sm ${theme.buttonSecondary} ${theme.text}`}
              >
                Annuler
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onConfirm}
                className="flex-1 py-3 rounded-2xl font-bold text-sm bg-red-500 hover:bg-red-400 text-white btn-3d"
              >
                Confirmer
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
