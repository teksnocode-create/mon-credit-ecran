import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { themes } from '../themes/themes';

export default function ThemeSwitcher() {
  const [open, setOpen] = useState(false);
  const { children, activeChildId, setChildTheme } = useAppStore();
  const child = children.find(c => c.id === activeChildId);
  const themeId = child?.themeId ?? 'galactic';
  const theme = themes[themeId];

  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(o => !o)}
        className={`w-10 h-10 rounded-full ${theme.card} flex items-center justify-center text-lg shadow-lg`}
        title="Changer de thème"
      >
        {theme.emoji}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`absolute right-0 top-12 z-50 ${theme.card} rounded-2xl p-2 flex flex-col gap-1 shadow-2xl min-w-[160px]`}
          >
            {Object.values(themes).map(t => (
              <motion.button
                key={t.id}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { child && setChildTheme(child.id, t.id as 'galactic' | 'candy' | 'eco'); setOpen(false); }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                  themeId === t.id
                    ? `${theme.accentClass} text-white`
                    : `${theme.text} ${theme.cardHover}`
                }`}
              >
                <span className="text-xl">{t.emoji}</span>
                <span>{t.name}</span>
                {themeId === t.id && <span className="ml-auto">✓</span>}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
