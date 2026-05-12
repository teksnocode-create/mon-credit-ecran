import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { themes } from '../themes/themes';
import { ActivityEntry } from '../types';

const COLOR_TOKENS: Record<ActivityEntry['color'], string> = {
  green: '#10b981',
  red: '#ef4444',
  gold: '#fbbf24',
  neutral: '#94a3b8',
};

function isToday(iso: string): boolean {
  const d = new Date(iso);
  const today = new Date();
  return d.getFullYear() === today.getFullYear()
    && d.getMonth() === today.getMonth()
    && d.getDate() === today.getDate();
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

const PREVIEW_LIMIT = 5;

export default function ActivityLog() {
  const { children, activeChildId } = useAppStore();
  const child = children.find(c => c.id === activeChildId);
  const theme = child ? themes[child.themeId] : themes['galactic'];
  const [expanded, setExpanded] = useState(false);

  if (!child) return null;

  const todayEntries = (child.activityLog ?? [])
    .filter(e => isToday(e.timestamp))
    .slice()
    .reverse(); // plus récent en haut

  if (todayEntries.length === 0) return null;

  const visible = expanded ? todayEntries : todayEntries.slice(0, PREVIEW_LIMIT);
  const hasMore = todayEntries.length > PREVIEW_LIMIT;

  return (
    <div className={`${theme.card} rounded-3xl p-4`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className={`font-black ${theme.text} text-sm flex items-center gap-1.5`}>
          📋 Activité du jour
          <span className={`text-xs font-bold ${theme.textMuted}`}>({todayEntries.length})</span>
        </h3>
      </div>

      <div className="space-y-1.5">
        <AnimatePresence initial={false}>
          {visible.map(entry => (
            <motion.div
              key={entry.id}
              layout
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3 py-1.5"
            >
              <span className={`text-xs font-bold tabular-nums ${theme.textMuted} w-12 flex-shrink-0`}>
                {formatTime(entry.timestamp)}
              </span>
              <span className="text-xl flex-shrink-0">{entry.icon}</span>
              <span
                className="text-sm font-semibold truncate flex-1"
                style={{ color: COLOR_TOKENS[entry.color] }}
              >
                {entry.label}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {hasMore && (
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setExpanded(e => !e)}
          className={`mt-2 w-full text-xs font-bold ${theme.textMuted} hover:opacity-80 py-1`}
        >
          {expanded ? '↑ Réduire' : `↓ Voir tout (${todayEntries.length})`}
        </motion.button>
      )}
    </div>
  );
}
