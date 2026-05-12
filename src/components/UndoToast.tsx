import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { themes } from '../themes/themes';

const TIMEOUT_MS = 5000;

export default function UndoToast() {
  const { lastUndoable, clearUndoable, undoLast, children, activeChildId, uiThemeId } = useAppStore();
  const child = children.find(c => c.id === activeChildId);
  const theme = child ? themes[child.themeId] : themes[uiThemeId ?? 'galactic'];

  useEffect(() => {
    if (!lastUndoable) return;
    const remaining = TIMEOUT_MS - (Date.now() - lastUndoable.createdAt);
    if (remaining <= 0) {
      clearUndoable();
      return;
    }
    const t = setTimeout(() => clearUndoable(), remaining);
    return () => clearTimeout(t);
  }, [lastUndoable, clearUndoable]);

  return (
    <AnimatePresence>
      {lastUndoable && (
        <motion.div
          key={lastUndoable.id}
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[70] pointer-events-auto"
        >
          <div className={`${theme.card} rounded-2xl shadow-2xl px-4 py-3 flex items-center gap-3 min-w-[280px] max-w-[92vw]`}>
            <div className={`flex-1 text-xs ${theme.text} font-semibold truncate`}>{lastUndoable.label}</div>
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={undoLast}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl font-black text-xs ${theme.button} text-white btn-3d`}
            >
              ↶ Annuler
            </motion.button>
            <button
              onClick={clearUndoable}
              className={`text-lg ${theme.textMuted} hover:opacity-70 px-1`}
              aria-label="Fermer"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
