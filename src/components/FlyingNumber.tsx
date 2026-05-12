import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useAppStore } from '../store/appStore';

export type FlyAnchor = 'credits' | 'stars' | 'timer' | 'minutes' | 'screen';

export interface FlyingNumberData {
  id: string;
  value: string;
  color: string;
  anchor: FlyAnchor;
  direction: 'up' | 'down';
}

function FlyingNumberItem({ data }: { data: FlyingNumberData }) {
  const removeFlyingNumber = useAppStore(s => s.removeFlyingNumber);

  useEffect(() => {
    const t = setTimeout(() => removeFlyingNumber(data.id), data.anchor === 'screen' ? 1800 : 1300);
    return () => clearTimeout(t);
  }, [data.id, data.anchor, removeFlyingNumber]);

  if (data.anchor === 'screen') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.8, times: [0, 0.1, 0.7, 1] }}
        className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
        style={{ background: `radial-gradient(circle, ${data.color}55 0%, transparent 70%)` }}
      >
        <motion.div
          initial={{ scale: 0.2, rotate: -10 }}
          animate={{
            scale: [0.2, 1.8, 1.6, 1.4],
            rotate: [-10, data.direction === 'down' ? 6 : -6, 0, 0],
            y: data.direction === 'down' ? [0, 30, 30, 50] : [0, -30, -30, -50],
          }}
          transition={{ duration: 1.8, times: [0, 0.18, 0.7, 1], ease: 'easeOut' }}
          className="font-black text-7xl whitespace-nowrap select-none"
          style={{
            color: data.color,
            textShadow: `0 4px 16px rgba(0,0,0,0.6), 0 0 50px ${data.color}, 0 0 12px rgba(255,255,255,0.8)`,
            WebkitTextStroke: '2px rgba(255,255,255,0.4)',
          }}
        >
          {data.value}
        </motion.div>
      </motion.div>
    );
  }

  const dy = data.direction === 'up' ? -80 : 80;

  return (
    <motion.div
      initial={{ opacity: 0, y: 0, scale: 0.4 }}
      animate={{ opacity: [0, 1, 1, 0], y: dy, scale: [0.4, 1.6, 1.5, 1.3] }}
      transition={{ duration: 1.3, ease: 'easeOut', times: [0, 0.15, 0.7, 1] }}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none font-black text-3xl whitespace-nowrap z-50 select-none"
      style={{
        color: data.color,
        textShadow: `0 2px 8px rgba(0,0,0,0.5), 0 0 24px ${data.color}, 0 0 4px rgba(255,255,255,0.6)`,
      }}
    >
      {data.value}
    </motion.div>
  );
}

export function FlyingNumberLayer({ anchor }: { anchor: FlyAnchor }) {
  const all = useAppStore(s => s.flyingNumbers);
  const items = all.filter(f => f.anchor === anchor);
  return (
    <>
      {items.map(item => <FlyingNumberItem key={item.id} data={item} />)}
    </>
  );
}
