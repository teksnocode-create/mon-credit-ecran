import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { themes } from '../themes/themes';
import PinModal from '../components/PinModal';
import SettingsTab from './rules/SettingsTab';
import MissionsTab from './rules/MissionsTab';
import RewardsTab from './rules/RewardsTab';
import MalusTab from './rules/MalusTab';

type Tab = 'settings' | 'missions' | 'rewards' | 'malus';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'settings', label: 'Paramètres', icon: '⚙️' },
  { id: 'missions', label: 'Missions', icon: '🎯' },
  { id: 'rewards', label: 'Récompenses', icon: '🎁' },
  { id: 'malus', label: 'Malus', icon: '🚫' },
];

export default function Rules() {
  const { settings, children, activeChildId } = useAppStore();
  const child = children.find(c => c.id === activeChildId);
  const theme = themes[child?.themeId ?? 'galactic'];

  const [tab, setTab] = useState<Tab>('settings');
  const [pinUnlocked, setPinUnlocked] = useState(!settings.pinEnabled);
  const [showPinModal, setShowPinModal] = useState(settings.pinEnabled && !pinUnlocked);
  const [savedMsg, setSavedMsg] = useState('');

  const showSaved = () => { setSavedMsg('Sauvegardé ✓'); setTimeout(() => setSavedMsg(''), 2000); };

  if (settings.pinEnabled && !pinUnlocked) {
    return (
      <div className={`min-h-screen ${theme.bg} pb-24 flex items-center justify-center`}>
        <div className={`${theme.card} rounded-3xl p-8 text-center mx-4 max-w-sm w-full`}>
          <div className="text-5xl mb-3">🔒</div>
          <h2 className={`text-xl font-black ${theme.text} mb-2`}>Espace Parents</h2>
          <p className={`${theme.textMuted} text-sm mb-4`}>Cette section est protégée par un code PIN.</p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowPinModal(true)}
            className={`w-full py-3 rounded-2xl font-black text-white btn-3d ${theme.button}`}
          >
            Entrer le code PIN 🔑
          </motion.button>
        </div>
        <AnimatePresence>
          {showPinModal && (
            <PinModal
              onSuccess={() => { setPinUnlocked(true); setShowPinModal(false); }}
              onClose={() => setShowPinModal(false)}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.bg} pb-24`}>
      <div className="max-w-md mx-auto px-4 pt-6">
        <div className="flex items-center justify-between mb-4">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-2xl font-black ${theme.text}`}
          >
            Espace Parents ⚙️
          </motion.h1>
          {savedMsg && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-green-400 text-sm font-bold"
            >
              {savedMsg}
            </motion.span>
          )}
        </div>

        <div className={`flex ${theme.card} rounded-2xl p-1 mb-5 gap-1`}>
          {TABS.map(t => (
            <motion.button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
                tab === t.id ? `${theme.button} text-white` : theme.textMuted
              }`}
            >
              {t.icon} {t.label}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === 'settings' && <SettingsTab key="settings" theme={theme} showSaved={showSaved} />}
          {tab === 'missions' && <MissionsTab key="missions" theme={theme} showSaved={showSaved} />}
          {tab === 'rewards' && <RewardsTab key="rewards" theme={theme} showSaved={showSaved} />}
          {tab === 'malus' && <MalusTab key="malus" theme={theme} showSaved={showSaved} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
