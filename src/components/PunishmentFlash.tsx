import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useAppStore } from '../store/appStore';

export default function PunishmentFlash() {
  const punishmentFlash = useAppStore(s => s.punishmentFlash);
  const [activeKey, setActiveKey] = useState(0);

  useEffect(() => {
    if (punishmentFlash > 0) {
      setActiveKey(punishmentFlash);
      const t = setTimeout(() => setActiveKey(0), 900);
      return () => clearTimeout(t);
    }
  }, [punishmentFlash]);

  return (
    <AnimatePresence>
      {activeKey > 0 && (
        <motion.div
          key={activeKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.55, 0.3, 0.5, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, times: [0, 0.1, 0.3, 0.5, 1] }}
          className="fixed inset-0 z-[110] pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, rgba(239,68,68,0.85) 0%, rgba(239,68,68,0.3) 60%, transparent 100%)',
          }}
        >
          {/* Lightning bolts */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 1] }}
            transition={{ duration: 0.5 }}
            className="absolute top-1/4 left-1/4 select-none"
            style={{ fontSize: 120, filter: 'drop-shadow(0 0 20px #fbbf24)' }}
          >
            ⚡
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 1] }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="absolute bottom-1/4 right-1/4 select-none"
            style={{ fontSize: 120, filter: 'drop-shadow(0 0 20px #fbbf24)' }}
          >
            ⚡
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
