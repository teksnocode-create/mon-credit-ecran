import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { themes } from '../themes/themes';

const AVATARS = ['🦊', '🐸', '🦁', '🐼', '🦄', '🐉', '🤖', '👾', '🦋', '🌟', '🎯', '🎮'];

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, children, activeChildId, updateChild, addChild, deleteChild, setActiveChild, setChildTheme } = useAppStore();

  const child = children.find(c => c.id === activeChildId);
  const theme = child ? themes[child.themeId] : themes['galactic'];

  const [editingName, setEditingName] = useState(false);
  const [newChildName, setNewChildName] = useState(child?.name ?? '');
  const [savedMsg, setSavedMsg] = useState('');

  // Add child modal state
  const [showAddChild, setShowAddChild] = useState(false);
  const [addName, setAddName] = useState('');
  const [addAvatar, setAddAvatar] = useState('🦊');
  const [addLimit, setAddLimit] = useState(60);
  // Edit child modal state
  const [editingChildId, setEditingChildId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editAvatar, setEditAvatar] = useState('🦊');
  const [editLimit, setEditLimit] = useState(60);
  // Delete confirm
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

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

  const handleAddChild = () => {
    if (!addName.trim()) return;
    addChild(addName.trim(), addAvatar, addLimit);
    setShowAddChild(false);
    setAddName('');
    setAddAvatar('🦊');
    setAddLimit(60);
  };

  const openEditChild = (c: (typeof children)[0]) => {
    setEditingChildId(c.id);
    setEditName(c.name);
    setEditAvatar(c.avatarId);
    setEditLimit(c.dailyLimitMinutes);
  };

  const handleEditChild = () => {
    if (!editingChildId || !editName.trim()) return;
    updateChild(editingChildId, { name: editName.trim(), avatarId: editAvatar, dailyLimitMinutes: editLimit, remainingMinutes: editLimit });
    setEditingChildId(null);
    showSaved();
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

            {/* Theme selector */}
            <div className="mb-4">
              <label className={`text-xs font-bold ${theme.textMuted} block mb-2`}>Thème 🎨</label>
              <div className="grid grid-cols-3 gap-2">
                {(['galactic', 'candy', 'eco'] as const).map(t => (
                  <motion.button
                    key={t}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => child && setChildTheme(child.id, t)}
                    className={`text-sm font-bold py-2 px-3 rounded-xl transition-all ${
                      child?.themeId === t
                        ? `${theme.button} text-white`
                        : `bg-white/10 ${theme.text}`
                    }`}
                  >
                    {t === 'galactic' && '🚀 Galactique'}
                    {t === 'candy' && '🍭 Bonbon'}
                    {t === 'eco' && '🌿 Éco'}
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
            <div className={`grid grid-cols-3 gap-2 mt-3 pt-3 border-t ${child.themeId === 'candy' ? 'border-gray-200' : 'border-white/10'}`}>
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

        {/* Children management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className={`${theme.card} rounded-3xl p-5 mb-4`}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className={`font-black ${theme.text}`}>Mes enfants 👨‍👧‍👦</h2>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowAddChild(true)}
              className={`text-sm font-bold px-3 py-1.5 rounded-xl ${theme.button} text-white`}
            >
              ＋ Ajouter
            </motion.button>
          </div>
          <div className="space-y-2">
            {children.map(c => (
              <div
                key={c.id}
                className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${
                  c.id === activeChildId
                    ? ''
                    : 'opacity-70'
                }`}
                style={c.id === activeChildId ? { background: theme.accent + '20', boxShadow: `0 0 0 1.5px ${theme.accent}` } : { background: 'rgba(255,255,255,0.05)' }}
              >
                <button onClick={() => setActiveChild(c.id)} className="text-2xl">{AVATARS.includes(c.avatarId) ? c.avatarId : '🦊'}</button>
                <div className="flex-1 min-w-0">
                  <div className={`font-bold ${theme.text} text-sm truncate`}>{c.name}</div>
                  <div className={`text-xs ${theme.textMuted}`}>{c.dailyLimitMinutes} min/jour</div>
                </div>
                <div className="flex items-center gap-1">
                  {c.id === activeChildId && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: theme.accent + '30', color: theme.accent }}>actif</span>
                  )}
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => openEditChild(c)} className={`text-lg p-1 rounded-lg ${theme.textMuted}`}>✏️</motion.button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => children.length > 1 && setDeleteConfirmId(c.id)}
                    className={`text-lg p-1 rounded-lg ${children.length <= 1 ? 'opacity-25 cursor-not-allowed' : ''}`}
                    title={children.length <= 1 ? 'Impossible de supprimer le seul enfant' : ''}
                  >
                    🗑️
                  </motion.button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Add child modal */}
        <AnimatePresence>
          {showAddChild && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
              onClick={() => setShowAddChild(false)}
            >
              <motion.div
                initial={{ scale: 0.85, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.85, y: 20 }}
                onClick={e => e.stopPropagation()}
                className={`${theme.card} rounded-3xl p-6 w-full max-w-sm`}
              >
                <h3 className={`text-lg font-black ${theme.text} mb-4`}>Ajouter un enfant</h3>
                <input
                  type="text"
                  placeholder="Prénom"
                  value={addName}
                  onChange={e => setAddName(e.target.value)}
                  className={`w-full rounded-2xl px-4 py-3 mb-3 font-semibold text-sm outline-none ${theme.text}`}
                  style={{ background: 'rgba(255,255,255,0.1)' }}
                />
                <label className={`text-xs font-bold ${theme.textMuted} block mb-2`}>Avatar</label>
                <div className="grid grid-cols-6 gap-1.5 mb-4">
                  {AVATARS.map(av => (
                    <button
                      key={av}
                      onClick={() => setAddAvatar(av)}
                      className="text-xl h-9 rounded-xl flex items-center justify-center"
                      style={addAvatar === av ? { background: theme.accent + '40', boxShadow: `0 0 0 2px ${theme.accent}` } : { background: 'rgba(255,255,255,0.1)' }}
                    >{av}</button>
                  ))}
                </div>
                <label className={`text-xs font-bold ${theme.textMuted} block mb-1`}>Limite : <span style={{ color: theme.accent }}>{addLimit} min</span></label>
                <input type="range" min={15} max={240} step={15} value={addLimit} onChange={e => setAddLimit(+e.target.value)} className="w-full mb-4" style={{ accentColor: theme.accent }} />
                <div className="flex gap-2">
                  <button onClick={() => setShowAddChild(false)} className={`flex-1 py-2.5 rounded-xl font-bold text-sm ${theme.buttonSecondary} ${theme.text}`}>Annuler</button>
                  <button onClick={handleAddChild} disabled={!addName.trim()} className={`flex-1 py-2.5 rounded-xl font-bold text-sm text-white ${theme.button} disabled:opacity-40`}>Créer</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit child modal */}
        <AnimatePresence>
          {editingChildId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
              onClick={() => setEditingChildId(null)}
            >
              <motion.div
                initial={{ scale: 0.85, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.85, y: 20 }}
                onClick={e => e.stopPropagation()}
                className={`${theme.card} rounded-3xl p-6 w-full max-w-sm`}
              >
                <h3 className={`text-lg font-black ${theme.text} mb-4`}>Modifier l'enfant</h3>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className={`w-full rounded-2xl px-4 py-3 mb-3 font-semibold text-sm outline-none ${theme.text}`}
                  style={{ background: 'rgba(255,255,255,0.1)' }}
                />
                <label className={`text-xs font-bold ${theme.textMuted} block mb-2`}>Avatar</label>
                <div className="grid grid-cols-6 gap-1.5 mb-4">
                  {AVATARS.map(av => (
                    <button
                      key={av}
                      onClick={() => setEditAvatar(av)}
                      className="text-xl h-9 rounded-xl flex items-center justify-center"
                      style={editAvatar === av ? { background: theme.accent + '40', boxShadow: `0 0 0 2px ${theme.accent}` } : { background: 'rgba(255,255,255,0.1)' }}
                    >{av}</button>
                  ))}
                </div>
                <label className={`text-xs font-bold ${theme.textMuted} block mb-1`}>Limite : <span style={{ color: theme.accent }}>{editLimit} min</span></label>
                <input type="range" min={15} max={240} step={15} value={editLimit} onChange={e => setEditLimit(+e.target.value)} className="w-full mb-4" style={{ accentColor: theme.accent }} />
                <div className="flex gap-2">
                  <button onClick={() => setEditingChildId(null)} className={`flex-1 py-2.5 rounded-xl font-bold text-sm ${theme.buttonSecondary} ${theme.text}`}>Annuler</button>
                  <button onClick={handleEditChild} className={`flex-1 py-2.5 rounded-xl font-bold text-sm text-white ${theme.button}`}>Sauvegarder</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete confirm modal */}
        <AnimatePresence>
          {deleteConfirmId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
              onClick={() => setDeleteConfirmId(null)}
            >
              <motion.div
                initial={{ scale: 0.85 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.85 }}
                onClick={e => e.stopPropagation()}
                className={`${theme.card} rounded-3xl p-6 w-full max-w-sm text-center`}
              >
                <div className="text-4xl mb-3">🗑️</div>
                <h3 className={`text-lg font-black ${theme.text} mb-2`}>Supprimer cet enfant ?</h3>
                <p className={`text-sm ${theme.textMuted} mb-5`}>Toutes ses données (crédits, étoiles, historique) seront perdues.</p>
                <div className="flex gap-2">
                  <button onClick={() => setDeleteConfirmId(null)} className={`flex-1 py-2.5 rounded-xl font-bold text-sm ${theme.buttonSecondary} ${theme.text}`}>Annuler</button>
                  <button onClick={() => { deleteChild(deleteConfirmId); setDeleteConfirmId(null); }} className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-red-500 hover:bg-red-400 text-white">Supprimer</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
