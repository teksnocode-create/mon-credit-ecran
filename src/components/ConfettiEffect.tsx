import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useAppStore } from '../store/appStore';
import { themes } from '../themes/themes';

export default function ConfettiEffect() {
  const { showConfetti, children, activeChildId } = useAppStore();
  const child = children.find(c => c.id === activeChildId);
  const theme = child ? themes[child.themeId] : themes['galactic'];

  useEffect(() => {
    if (!showConfetti) return;

    const colors = [theme.accent, theme.starColor, '#ffffff', '#fbbf24', '#60a5fa'];

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { x: 0.5, y: 0.5 },
      colors,
      shapes: ['star', 'circle'],
      scalar: 1.2,
    });

    setTimeout(() => {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { x: 0.3, y: 0.6 },
        colors,
        shapes: ['star'],
        scalar: 0.8,
      });
    }, 300);

    setTimeout(() => {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { x: 0.7, y: 0.6 },
        colors,
        shapes: ['circle'],
        scalar: 0.8,
      });
    }, 500);
  }, [showConfetti, theme.accent, theme.starColor]);

  return null;
}
