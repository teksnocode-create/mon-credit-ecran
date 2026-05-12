import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useAppStore } from '../store/appStore';

// Pseudo-random but stable seed via memoization
function makeParticles(n: number) {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 12,
    duration: 8 + Math.random() * 10,
    size: 1 + Math.random() * 2.5,
    drift: -20 + Math.random() * 40,
    rotate: -30 + Math.random() * 60,
  }));
}

function GalacticAmbience() {
  const dots = useMemo(() => makeParticles(28), []);
  const shootingStars = useMemo(() => Array.from({ length: 2 }, (_, i) => ({
    id: i,
    top: 10 + Math.random() * 30,
    delay: i * 11 + Math.random() * 6,
  })), []);

  return (
    <>
      {dots.map(p => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            boxShadow: '0 0 4px rgba(255,255,255,0.6)',
          }}
          animate={{ opacity: [0, 0.6, 0], scale: [0.4, 1.1, 0.4] }}
          transition={{ duration: p.duration * 0.4, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
      {shootingStars.map(s => (
        <motion.span
          key={`shoot-${s.id}`}
          className="absolute"
          style={{
            top: `${s.top}%`,
            left: '-10%',
            width: 80,
            height: 1.5,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)',
            transform: 'rotate(15deg)',
          }}
          animate={{ left: ['-10%', '110%'], opacity: [0, 0.8, 0] }}
          transition={{ duration: 1.4, delay: s.delay, repeat: Infinity, repeatDelay: 14, ease: 'easeOut' }}
        />
      ))}
    </>
  );
}

function CandyAmbience() {
  const candies = useMemo(() => makeParticles(10), []);
  const icons = ['🍬', '🍭', '🍪', '🧁', '🍰'];

  return (
    <>
      {candies.map(p => (
        <motion.span
          key={p.id}
          className="absolute select-none"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            fontSize: 18 + p.size * 4,
            opacity: 0.18,
          }}
          animate={{
            y: [0, p.drift, 0],
            x: [0, -p.drift / 2, 0],
            rotate: [0, p.rotate, 0],
          }}
          transition={{ duration: p.duration * 1.8, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          {icons[p.id % icons.length]}
        </motion.span>
      ))}
    </>
  );
}

function EcoAmbience() {
  const leaves = useMemo(() => makeParticles(12), []);
  const icons = ['🍃', '🌿', '🍂'];

  return (
    <>
      {leaves.map(p => (
        <motion.span
          key={p.id}
          className="absolute select-none"
          style={{
            left: `${p.left}%`,
            top: '-5%',
            fontSize: 14 + p.size * 4,
            opacity: 0.22,
          }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, p.drift, -p.drift, p.drift / 2, 0],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 18 + p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
        >
          {icons[p.id % icons.length]}
        </motion.span>
      ))}
    </>
  );
}

export default function ThemeAmbience() {
  const uiThemeId = useAppStore(s => s.uiThemeId);
  const activeChildId = useAppStore(s => s.activeChildId);
  const children = useAppStore(s => s.children);
  // Prefer the active child's theme (cohérent avec ce que l'enfant voit), sinon fall back sur uiThemeId
  const child = children.find(c => c.id === activeChildId);
  const themeId = child?.themeId ?? uiThemeId;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {themeId === 'galactic' && <GalacticAmbience />}
      {themeId === 'candy' && <CandyAmbience />}
      {themeId === 'eco' && <EcoAmbience />}
    </div>
  );
}
