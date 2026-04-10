import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { themes } from '../themes/themes';

interface Props {
  onSuccess: () => void;
  onClose: () => void;
}

export default function PinModal({ onSuccess, onClose }: Props) {
  const { settings, themeId } = useAppStore();
  const theme = themes[themeId];
  const [input, setInput] = useState('');
  const [shake, setShake] = useState(false);

  const handleDigit = (d: string) => {
    if (input.length >= 4) return;
    const next = input + d;
    setInput(next);
    if (next.length === 4) {
      if (next === settings.pin) {
        onSuccess();
      } else {
        setShake(true);
        setTimeout(() => { setShake(false); setInput(''); }, 600);
      }
    }
  };

  const handleDelete = () => setInput(i => i.slice(0, -1));

  const keys = ['1','2','3','4','5','6','7','8','9','','0','⌫'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.8)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className={`${theme.card} rounded-3xl p-6 mx-4 max-w-xs w-full`}
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🔒</div>
          <h2 className={`text-xl font-black ${theme.text}`}>Code Parental</h2>
          <p className={`text-sm ${theme.textMuted} mt-1`}>Entrez votre code PIN</p>
        </div>

        {/* Dots */}
        <motion.div
          animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="flex justify-center gap-3 mb-6"
        >
          {[0, 1, 2, 3].map(i => (
            <motion.div
              key={i}
              animate={{
                scale: input.length > i ? 1.2 : 1,
                background: shake ? '#ef4444' : input.length > i ? theme.accent : 'rgba(255,255,255,0.2)',
              }}
              className="w-4 h-4 rounded-full"
            />
          ))}
        </motion.div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3">
          {keys.map((k, i) => (
            k === '' ? (
              <div key={i} />
            ) : (
              <motion.button
                key={i}
                whileTap={{ scale: 0.85 }}
                onClick={() => k === '⌫' ? handleDelete() : handleDigit(k)}
                className={`h-14 rounded-2xl text-xl font-black ${theme.text} ${
                  k === '⌫' ? theme.buttonSecondary : theme.card
                } ${theme.cardHover} transition-all`}
              >
                {k}
              </motion.button>
            )
          ))}
        </div>

        <button
          onClick={onClose}
          className={`w-full mt-4 py-2 text-sm ${theme.textMuted} hover:opacity-70`}
        >
          Annuler
        </button>
      </motion.div>
    </motion.div>
  );
}
