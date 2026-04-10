import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { themes } from '../themes/themes';

const AVATARS = ['🦊', '🐸', '🦁', '🐼', '🦄', '🐉', '🤖', '👾', '🦋', '🌟', '🎯', '🎮'];

export default function Profile() {
  const navigate = useNavigate();
  const { user, themeId, setTheme, logout, children, activeChildId, updateChild } = useAppStore();
  const theme = themes[themeId];

  const child = children.find(c => c.id === activeChildId);
  const [editingName, setEditingName] = useState(false);
  const [newChildName, setNewChildName] = useState(child?.name ?? '');
  const [savedMsg, setSavedMsg] = useState('');

  const showSaved = () => {
    setSavedMsg('Sauvegardé ✓');
    setTimeout(() => setSavedMsg(''), 2000);
  };

  const handleSaveName = () => {
    if (newChildName.trim() && child) {
      updateChild(child.id, { name: newChildName.trim() });
      setEditingName(false);
      showSaved();
    }
  };

  const handleAvatarChange = (av: string) => {
    if (child) {
      updateChild(child.id, { avatarId: av });
      showSaved();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={`min-h-screen ${theme.bg} pb-24`}>
      <div className="max-w-md mx-auto px-4 pt-6">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-2xl font-black ${theme.text} mb-6`}
        >
          Profil 👤
        </motion.h1>

        {/* User info card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${theme.card} rounded-3xl p-5 mb-4`}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-16 h-16 rounded-full ${theme.accentClass} bg-opacity-20 flex items-center justify-center text-3xl`}
              style={{ background: theme.accent + '30' }}>
              👤
            </div>
            <div>
              <div className={`text-lg font-black ${theme.text}`}>{user?.name ?? 'Parent'}</div>
              <div className={`text-sm ${theme.textMuted}`}>{user?.email ?? ''}</div>
              <div className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-0.5 rounded-full mt-1 inline-block">
                ✓ Connecté
              </div>
            </div>
          </div>
        </motion.div>

        {/* Child profile */}
        {child && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`${theme.card} rounded-3xl p-5 mb-4`}
          >
            <h2 className={`font-black ${theme.text} mb-4`}>Profil enfant actif</h2>

            {/* Avatar picker */}
            <div className="mb-4">
              <label className={`text-xs font-bold ${theme.textMuted} block mb-2`}>Avatar</label>
              <div className="grid grid-cols-6 gap-2">
                {AVATARS.map(av => (
                  <motion.button
                    key={av}
                    whileTap={{ scale: 0.8 }}
                    onClick={() => handleAvatarChange(av)}
                    className={`text-2xl h-10 w-full rounded-xl flex items-center justify-center transition-all`}
                    style={child.avatarId === av
                      ? { background: theme.accent + '40', boxShadow: `0 0 0 2px ${theme.accent}` }
                      : { background: 'rgba(255,255,255,0.1)' }
                    }
                  >
                    {av}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Name editing */}
            <div className="mb-3">
              <label className={`text-xs font-bold ${theme.textMuted} block mb-1`}>Prénom</label>
              {editingName ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newChildName}
                    onChange={e => setNewChildName(e.target.value)}
                    className={`flex-1 ${theme.card} ${theme.text} rounded-xl px-3 py-2 text-sm font-semibold outline-none border-0`}
                    style={{ background: 'transparent' }}
                    autoFocus
                  />
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSaveName}
                    className={`px-3 py-2 rounded-xl text-white text-sm font-bold ${theme.button}`}
                  >
                    ✓
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setEditingName(false)}
                    className={`px-3 py-2 rounded-xl text-sm font-bold ${theme.buttonSecondary} ${theme.text}`}
                  >
                    ✕
                  </motion.button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className={`font-bold ${theme.text}`}>{child.name}</span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => { setNewChildName(child.name); setEditingName(true); }}
                    className={`text-sm ${theme.textMuted} hover:opacity-70`}
                  >
                    ✏️ Modifier
                  </motion.button>
                </div>
              )}
            </div>

            {savedMsg && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-green-400 text-sm font-bold text-center"
              >
                {savedMsg}
              </motion.div>
            )}

            {/* Stats summary */}
            <div className={`grid grid-cols-3 gap-2 mt-3 pt-3 border-t ${themeId === 'candy' ? 'border-gray-200' : 'border-white/10'}`}>
              {[
                { icon: '🪙', val: Math.floor(child.credits), label: 'Crédits' },
                { icon: '⭐', val: child.stars, label: 'Étoiles' },
                { icon: '⏰', val: `${child.dailyLimitMinutes}m`, label: 'Limite' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className="text-xl">{s.icon}</div>
                  <div className={`font-black ${theme.text} text-sm`}>{s.val}</div>
                  <div className={`text-xs ${theme.textMuted}`}>{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Theme preference */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`${theme.card} rounded-3xl p-5 mb-4`}
        >
          <h2 className={`font-black ${theme.text} mb-3`}>Thème de l'application</h2>
          <div className="space-y-2">
            {(['galactic', 'candy', 'eco'] as const).map(tid => {
              const t = themes[tid];
              return (
                <motion.button
                  key={tid}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setTheme(tid)}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all ${
                    themeId === tid
                      ? 'ring-2'
                      : `${theme.cardHover}`
                  }`}
                  style={themeId === tid
                    ? { background: theme.accent + '25', boxShadow: `0 0 0 2px ${theme.accent}` }
                    : { background: 'rgba(255,255,255,0.05)' }
                  }
                >
                  <span className="text-2xl">{t.emoji}</span>
                  <span className={`font-bold ${theme.text} flex-1 text-left`}>{t.name}</span>
                  {themeId === tid && <span style={{ color: theme.accent }} className="font-black">✓</span>}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* App info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`${theme.card} rounded-3xl p-5 mb-4`}
        >
          <h2 className={`font-black ${theme.text} mb-3`}>À propos</h2>
          <div className={`space-y-2 text-sm ${theme.textMuted}`}>
            <div className="flex justify-between">
              <span>Version</span>
              <span className="font-bold">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span>Données</span>
              <span className="font-bold">100% locale</span>
            </div>
            <div className="flex justify-between">
              <span>Publicités</span>
              <span className="font-bold text-green-400">Aucune ✓</span>
            </div>
          </div>
        </motion.div>

        {/* Logout */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
          className="w-full py-4 rounded-2xl font-black text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-all text-base mb-4"
        >
          Se déconnecter 🚪
        </motion.button>
      </div>
    </div>
  );
}
