import { useEffect, useState } from 'react';
import { useAppStore } from '../store/appStore';
import { themes } from '../themes/themes';

function formatNow(d: Date) {
  const date = d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  const time = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  return { date, time };
}

export default function DateTimeHeader() {
  const { children, activeChildId, uiThemeId } = useAppStore();
  const child = children.find(c => c.id === activeChildId);
  const theme = child ? themes[child.themeId] : themes[uiThemeId ?? 'galactic'];
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000); // refresh toutes les 30s
    return () => clearInterval(t);
  }, []);

  const { date, time } = formatNow(now);

  return (
    <div className={`text-center text-[11px] ${theme.textMuted} pt-3 pb-1 select-none uppercase tracking-wider`}>
      <span className="capitalize">{date}</span>
      <span className="mx-2 opacity-50">·</span>
      <span className="tabular-nums font-bold">{time}</span>
    </div>
  );
}
