import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { themes } from '../themes/themes';
import PinModal from '../components/PinModal';
import { Mission, Reward, Malus } from '../types';

type Tab = 'settings' | 'missions' | 'rewards' | 'malus';

export default function Rules() {
  const {
    settings, updateSettings, missions, rewards, malus,
    addMission, updateMission, deleteMission,
    addReward, updateReward, deleteReward,
    addMalus, updateMalus, deleteMalus,
    children, activeChildId, updateChild,
  } = useAppStore();

  const child = children.find(c => c.id === activeChildId);
  const themeId = child?.themeId ?? 'galactic';
  const theme = themes[themeId];

  const [tab, setTab] = useState<Tab>('settings');
  const [pinUnlocked, setPinUnlocked] = useState(!settings.pinEnabled);
  const [showPinModal, setShowPinModal] = useState(settings.pinEnabled && !pinUnlocked);

  // Mission modal
  const [missionModal, setMissionModal] = useState(false);
  const [editMission, setEditMission] = useState<Mission | null>(null);
  const [mForm, setMForm] = useState({ title: '', icon: '📚', creditValue: 10, description: '', enabled: true });

  // Reward modal
  const [rewardModal, setRewardModal] = useState(false);
  const [editReward, setEditReward] = useState<Reward | null>(null);
  const [rForm, setRForm] = useState({ title: '', icon: '🎁', starCost: 5, description: '', isMinutesReward: false, bonusMinutes: 15 });

  // Malus modal
  const [malusModal, setMalusModal] = useState(false);
  const [editMalusItem, setEditMalusItem] = useState<Malus | null>(null);
  const [malForm, setMalForm] = useState({ title: '', icon: '😤', creditPenalty: 5, description: '', enabled: true });

  // Saved feedback
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

  const openAddMission = () => {
    setEditMission(null);
    setMForm({ title: '', icon: '📚', creditValue: 10, description: '', enabled: true });
    setMissionModal(true);
  };

  const openEditMission = (m: Mission) => {
    setEditMission(m);
    setMForm({ title: m.title, icon: m.icon, creditValue: m.creditValue, description: m.description, enabled: m.enabled });
    setMissionModal(true);
  };

  const saveMission = () => {
    if (!mForm.title.trim()) return;
    if (editMission) updateMission(editMission.id, mForm);
    else addMission(mForm);
    setMissionModal(false);
    showSaved();
  };

  const openAddReward = () => {
    setEditReward(null);
    setRForm({ title: '', icon: '🎁', starCost: 5, description: '', isMinutesReward: false, bonusMinutes: 15 });
    setRewardModal(true);
  };

  const openEditReward = (r: Reward) => {
    setEditReward(r);
    setRForm({ title: r.title, icon: r.icon, starCost: r.starCost, description: r.description, isMinutesReward: r.isMinutesReward, bonusMinutes: r.bonusMinutes ?? 15 });
    setRewardModal(true);
  };

  const saveReward = () => {
    if (!rForm.title.trim()) return;
    if (editReward) updateReward(editReward.id, rForm);
    else addReward(rForm);
    setRewardModal(false);
    showSaved();
  };

  const openAddMalus = () => {
    setEditMalusItem(null);
    setMalForm({ title: '', icon: '😤', creditPenalty: 5, description: '', enabled: true });
    setMalusModal(true);
  };

  const openEditMalus = (m: Malus) => {
    setEditMalusItem(m);
    setMalForm({ title: m.title, icon: m.icon, creditPenalty: m.creditPenalty, description: m.description, enabled: m.enabled });
    setMalusModal(true);
  };

  const saveMalus = () => {
    if (!malForm.title.trim()) return;
    if (editMalusItem) updateMalus(editMalusItem.id, malForm);
    else addMalus(malForm);
    setMalusModal(false);
    showSaved();
  };

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: 'settings', label: 'Paramètres', icon: '⚙️' },
    { id: 'missions', label: 'Missions', icon: '🎯' },
    { id: 'rewards', label: 'Récompenses', icon: '🎁' },
    { id: 'malus', label: 'Malus', icon: '🚫' },
  ];

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

        {/* Tabs */}
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
          {/* SETTINGS TAB */}
          {tab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Daily limit */}
              {child && (
                <div className={`${theme.card} rounded-3xl p-4`}>
                  <h3 className={`font-black ${theme.text} mb-3`}>Limite quotidienne</h3>
                  <div className="mb-2">
                    <div className="flex justify-between mb-1">
                      <span className={`text-sm ${theme.textMuted}`}>{child.name}</span>
                      <span style={{ color: theme.accent }} className="font-black text-sm">{child.dailyLimitMinutes} min</span>
                    </div>
                    <input
                      type="range" min={15} max={240} step={15}
                      value={child.dailyLimitMinutes}
                      onChange={e => updateChild(child.id, {
                        dailyLimitMinutes: Number(e.target.value),
                        remainingMinutes: Math.min(child.remainingMinutes, Number(e.target.value)),
                      })}
                      className="w-full accent-purple-500"
                    />
                    <div className={`flex justify-between text-xs ${theme.textMuted}`}><span>15 min</span><span>4h</span></div>
                  </div>
                </div>
              )}

              {/* PIN */}
              <div className={`${theme.card} rounded-3xl p-4`}>
                <h3 className={`font-black ${theme.text} mb-3`}>Code PIN parental</h3>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-sm ${theme.textMuted}`}>Activer le PIN</span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => { updateSettings({ pinEnabled: !settings.pinEnabled }); showSaved(); }}
                    className={`w-12 h-6 rounded-full transition-all relative ${settings.pinEnabled ? '' : 'bg-white/20'}`}
                    style={settings.pinEnabled ? { background: theme.accent } : {}}
                  >
                    <motion.div
                      animate={{ x: settings.pinEnabled ? 24 : 2 }}
                      className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                    />
                  </motion.button>
                </div>
                {settings.pinEnabled && (
                  <div>
                    <label className={`text-xs font-bold ${theme.textMuted} block mb-1`}>Code PIN (4 chiffres)</label>
                    <input
                      type="text"
                      maxLength={4}
                      value={settings.pin}
                      onChange={e => updateSettings({ pin: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                      className={`w-full ${theme.card} ${theme.text} rounded-xl px-3 py-2 text-sm font-black tracking-widest outline-none border-0`}
                      style={{ background: 'transparent' }}
                      placeholder="1234"
                    />
                  </div>
                )}
              </div>

              {/* Conversion ratios */}
              <div className={`${theme.card} rounded-3xl p-4`}>
                <h3 className={`font-black ${theme.text} mb-3`}>Ratios de conversion</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className={`text-sm ${theme.textMuted}`}>Crédits pour 1 ⭐</span>
                      <span style={{ color: theme.accent }} className="font-black text-sm">{settings.creditToStarRatio} 🪙</span>
                    </div>
                    <input
                      type="range" min={5} max={50} step={5}
                      value={settings.creditToStarRatio}
                      onChange={e => { updateSettings({ creditToStarRatio: Number(e.target.value) }); showSaved(); }}
                      className="w-full accent-purple-500"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className={`text-sm ${theme.textMuted}`}>Minutes par ⭐ échangé</span>
                      <span style={{ color: theme.accent }} className="font-black text-sm">{settings.starToMinutesRatio} min</span>
                    </div>
                    <input
                      type="range" min={5} max={60} step={5}
                      value={settings.starToMinutesRatio}
                      onChange={e => { updateSettings({ starToMinutesRatio: Number(e.target.value) }); showSaved(); }}
                      className="w-full accent-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* School mode */}
              <div className={`${theme.card} rounded-3xl p-4`}>
                <h3 className={`font-black ${theme.text} mb-3`}>Mode École</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm ${theme.textMuted}`}>Activer le mode école</span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => { updateSettings({ schoolModeEnabled: !settings.schoolModeEnabled }); showSaved(); }}
                    className={`w-12 h-6 rounded-full transition-all relative`}
                    style={{ background: settings.schoolModeEnabled ? theme.accent : 'rgba(255,255,255,0.2)' }}
                  >
                    <motion.div animate={{ x: settings.schoolModeEnabled ? 24 : 2 }} className="absolute top-1 w-4 h-4 bg-white rounded-full shadow" />
                  </motion.button>
                </div>
                {settings.schoolModeEnabled && (
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className={`text-xs ${theme.textMuted}`}>Limite les jours d'école</span>
                      <span style={{ color: theme.accent }} className="font-bold text-xs">{settings.schoolModeLimit} min</span>
                    </div>
                    <input
                      type="range" min={15} max={120} step={15}
                      value={settings.schoolModeLimit}
                      onChange={e => { updateSettings({ schoolModeLimit: Number(e.target.value) }); showSaved(); }}
                      className="w-full accent-purple-500"
                    />
                  </div>
                )}
              </div>

              {/* Vacation mode */}
              <div className={`${theme.card} rounded-3xl p-4`}>
                <h3 className={`font-black ${theme.text} mb-3`}>Mode Vacances</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm ${theme.textMuted}`}>Activer le mode vacances</span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => { updateSettings({ vacationModeEnabled: !settings.vacationModeEnabled }); showSaved(); }}
                    className={`w-12 h-6 rounded-full transition-all relative`}
                    style={{ background: settings.vacationModeEnabled ? theme.accent : 'rgba(255,255,255,0.2)' }}
                  >
                    <motion.div animate={{ x: settings.vacationModeEnabled ? 24 : 2 }} className="absolute top-1 w-4 h-4 bg-white rounded-full shadow" />
                  </motion.button>
                </div>
                {settings.vacationModeEnabled && (
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className={`text-xs ${theme.textMuted}`}>Limite en vacances</span>
                      <span style={{ color: theme.accent }} className="font-bold text-xs">{settings.vacationModeLimit} min</span>
                    </div>
                    <input
                      type="range" min={30} max={240} step={15}
                      value={settings.vacationModeLimit}
                      onChange={e => { updateSettings({ vacationModeLimit: Number(e.target.value) }); showSaved(); }}
                      className="w-full accent-purple-500"
                    />
                  </div>
                )}
              </div>

              {/* Curfew */}
              <div className={`${theme.card} rounded-3xl p-4`}>
                <h3 className={`font-black ${theme.text} mb-3`}>Couvre-feu</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm ${theme.textMuted}`}>Arrêt automatique à</span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => { updateSettings({ curfewEnabled: !settings.curfewEnabled }); showSaved(); }}
                    className={`w-12 h-6 rounded-full transition-all relative`}
                    style={{ background: settings.curfewEnabled ? theme.accent : 'rgba(255,255,255,0.2)' }}
                  >
                    <motion.div animate={{ x: settings.curfewEnabled ? 24 : 2 }} className="absolute top-1 w-4 h-4 bg-white rounded-full shadow" />
                  </motion.button>
                </div>
                {settings.curfewEnabled && (
                  <input
                    type="time"
                    value={settings.curfewTime}
                    onChange={e => { updateSettings({ curfewTime: e.target.value }); showSaved(); }}
                    className={`w-full ${theme.card} ${theme.text} rounded-xl px-3 py-2 text-sm font-bold outline-none border-0`}
                    style={{ background: 'transparent' }}
                  />
                )}
              </div>

              {/* Alert sound */}
              <div className={`${theme.card} rounded-3xl p-4`}>
                <h3 className={`font-black ${theme.text} mb-3`}>Son d'alerte</h3>
                <div className="grid grid-cols-2 gap-2">
                  {(['chime', 'fanfare', 'bell', 'none'] as const).map(s => (
                    <motion.button
                      key={s}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => { updateSettings({ alertSound: s }); showSaved(); }}
                      className={`py-2 rounded-xl text-sm font-bold transition-all ${theme.text}`}
                      style={settings.alertSound === s
                        ? { background: theme.accent + '40', boxShadow: `0 0 0 2px ${theme.accent}` }
                        : { background: 'rgba(255,255,255,0.1)' }
                      }
                    >
                      {s === 'chime' ? '🔔 Carillon' : s === 'fanfare' ? '🎺 Fanfare' : s === 'bell' ? '🔕 Cloche' : '🔇 Aucun'}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* MISSIONS TAB */}
          {tab === 'missions' && (
            <motion.div
              key="missions"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={openAddMission}
                className={`w-full py-3 rounded-2xl font-black text-white btn-3d ${theme.button} mb-4`}
              >
                + Ajouter une mission
              </motion.button>

              <div className="space-y-2">
                {missions.map(m => (
                  <div key={m.id} className={`${theme.card} rounded-2xl p-3 flex items-center justify-between`}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{m.icon}</span>
                      <div>
                        <div className={`font-bold ${theme.text} text-sm`}>{m.title}</div>
                        <div className={`text-xs ${theme.textMuted}`}>{m.creditValue} 🪙 · {m.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => { updateMission(m.id, { enabled: !m.enabled }); showSaved(); }}
                        className={`w-8 h-5 rounded-full relative transition-all`}
                        style={{ background: m.enabled ? theme.accent : 'rgba(255,255,255,0.2)' }}
                      >
                        <motion.div animate={{ x: m.enabled ? 12 : 2 }} className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow" />
                      </motion.button>
                      <motion.button whileTap={{ scale: 0.9 }} onClick={() => openEditMission(m)} className={`text-lg`}>✏️</motion.button>
                      <motion.button whileTap={{ scale: 0.9 }} onClick={() => { deleteMission(m.id); showSaved(); }} className="text-lg">🗑️</motion.button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* REWARDS TAB */}
          {tab === 'rewards' && (
            <motion.div
              key="rewards"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={openAddReward}
                className={`w-full py-3 rounded-2xl font-black text-white btn-3d ${theme.button} mb-4`}
              >
                + Ajouter une récompense
              </motion.button>

              <div className="space-y-2">
                {rewards.map(r => (
                  <div key={r.id} className={`${theme.card} rounded-2xl p-3 flex items-center justify-between`}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{r.icon}</span>
                      <div>
                        <div className={`font-bold ${theme.text} text-sm`}>{r.title}</div>
                        <div className={`text-xs ${theme.textMuted}`}>{r.starCost} ⭐ · {r.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button whileTap={{ scale: 0.9 }} onClick={() => openEditReward(r)} className="text-lg">✏️</motion.button>
                      <motion.button whileTap={{ scale: 0.9 }} onClick={() => { deleteReward(r.id); showSaved(); }} className="text-lg">🗑️</motion.button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
          {/* MALUS TAB */}
          {tab === 'malus' && (
            <motion.div
              key="malus"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <p className={`text-xs ${theme.textMuted} mb-3 italic`}>
                🚫 Les malus retirent des crédits à l'enfant lorsqu'il fait quelque chose de mal.
              </p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={openAddMalus}
                className="w-full py-3 rounded-2xl font-black text-white btn-3d bg-red-500 hover:bg-red-400 mb-4"
              >
                + Ajouter un malus
              </motion.button>

              <div className="space-y-2">
                {malus.map(m => (
                  <div key={m.id} className="bg-red-500/10 border border-red-500/20 rounded-2xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{m.icon}</span>
                      <div>
                        <div className={`font-bold ${theme.text} text-sm`}>{m.title}</div>
                        <div className={`text-xs ${theme.textMuted}`}>-{m.creditPenalty} 🪙 · {m.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => { updateMalus(m.id, { enabled: !m.enabled }); showSaved(); }}
                        className="w-8 h-5 rounded-full relative transition-all"
                        style={{ background: m.enabled ? '#ef4444' : 'rgba(255,255,255,0.2)' }}
                      >
                        <motion.div animate={{ x: m.enabled ? 12 : 2 }} className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow" />
                      </motion.button>
                      <motion.button whileTap={{ scale: 0.9 }} onClick={() => openEditMalus(m)} className="text-lg">✏️</motion.button>
                      <motion.button whileTap={{ scale: 0.9 }} onClick={() => { deleteMalus(m.id); showSaved(); }} className="text-lg">🗑️</motion.button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mission Modal */}
      <AnimatePresence>
        {missionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center"
            style={{ background: 'rgba(0,0,0,0.7)' }}
            onClick={() => setMissionModal(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 35 }}
              className={`${theme.card} rounded-t-3xl p-6 w-full max-w-md`}
              onClick={e => e.stopPropagation()}
            >
              <h3 className={`text-lg font-black ${theme.text} mb-4`}>
                {editMission ? 'Modifier la mission' : 'Nouvelle mission'}
              </h3>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Emoji 📚"
                    value={mForm.icon}
                    onChange={e => setMForm(f => ({ ...f, icon: e.target.value }))}
                    className={`w-16 ${theme.card} ${theme.text} rounded-xl px-2 py-2 text-center text-xl outline-none border-0`}
                    style={{ background: 'transparent' }}
                  />
                  <input
                    type="text"
                    placeholder="Titre de la mission"
                    value={mForm.title}
                    onChange={e => setMForm(f => ({ ...f, title: e.target.value }))}
                    className={`flex-1 ${theme.card} ${theme.text} rounded-xl px-3 py-2 text-sm font-semibold outline-none border-0`}
                    style={{ background: 'transparent' }}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Description courte"
                  value={mForm.description}
                  onChange={e => setMForm(f => ({ ...f, description: e.target.value }))}
                  className={`w-full ${theme.card} ${theme.text} rounded-xl px-3 py-2 text-sm font-semibold outline-none border-0`}
                  style={{ background: 'transparent' }}
                />
                <div>
                  <div className="flex justify-between mb-1">
                    <span className={`text-sm ${theme.textMuted}`}>Valeur en crédits</span>
                    <span style={{ color: theme.accent }} className="font-black">{mForm.creditValue} 🪙</span>
                  </div>
                  <input
                    type="range" min={1} max={50} step={1}
                    value={mForm.creditValue}
                    onChange={e => setMForm(f => ({ ...f, creditValue: Number(e.target.value) }))}
                    className="w-full accent-purple-500"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => setMissionModal(false)}
                  className={`flex-1 py-3 rounded-2xl font-bold ${theme.buttonSecondary} ${theme.text}`}>Annuler</motion.button>
                <motion.button whileTap={{ scale: 0.95 }} onClick={saveMission}
                  className={`flex-1 py-3 rounded-2xl font-black text-white btn-3d ${theme.button}`}>Sauvegarder</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reward Modal */}
      <AnimatePresence>
        {rewardModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center"
            style={{ background: 'rgba(0,0,0,0.7)' }}
            onClick={() => setRewardModal(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 35 }}
              className={`${theme.card} rounded-t-3xl p-6 w-full max-w-md`}
              onClick={e => e.stopPropagation()}
            >
              <h3 className={`text-lg font-black ${theme.text} mb-4`}>
                {editReward ? 'Modifier la récompense' : 'Nouvelle récompense'}
              </h3>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="🎁"
                    value={rForm.icon}
                    onChange={e => setRForm(f => ({ ...f, icon: e.target.value }))}
                    className={`w-16 ${theme.card} ${theme.text} rounded-xl px-2 py-2 text-center text-xl outline-none border-0`}
                    style={{ background: 'transparent' }}
                  />
                  <input
                    type="text"
                    placeholder="Titre de la récompense"
                    value={rForm.title}
                    onChange={e => setRForm(f => ({ ...f, title: e.target.value }))}
                    className={`flex-1 ${theme.card} ${theme.text} rounded-xl px-3 py-2 text-sm font-semibold outline-none border-0`}
                    style={{ background: 'transparent' }}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Description"
                  value={rForm.description}
                  onChange={e => setRForm(f => ({ ...f, description: e.target.value }))}
                  className={`w-full ${theme.card} ${theme.text} rounded-xl px-3 py-2 text-sm font-semibold outline-none border-0`}
                  style={{ background: 'transparent' }}
                />
                <div>
                  <div className="flex justify-between mb-1">
                    <span className={`text-sm ${theme.textMuted}`}>Coût en étoiles</span>
                    <span style={{ color: theme.accent }} className="font-black">{rForm.starCost} ⭐</span>
                  </div>
                  <input
                    type="range" min={1} max={30} step={1}
                    value={rForm.starCost}
                    onChange={e => setRForm(f => ({ ...f, starCost: Number(e.target.value) }))}
                    className="w-full accent-purple-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${theme.textMuted}`}>Récompense en minutes ?</span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setRForm(f => ({ ...f, isMinutesReward: !f.isMinutesReward }))}
                    className={`w-12 h-6 rounded-full relative`}
                    style={{ background: rForm.isMinutesReward ? theme.accent : 'rgba(255,255,255,0.2)' }}
                  >
                    <motion.div animate={{ x: rForm.isMinutesReward ? 24 : 2 }} className="absolute top-1 w-4 h-4 bg-white rounded-full shadow" />
                  </motion.button>
                </div>
                {rForm.isMinutesReward && (
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className={`text-sm ${theme.textMuted}`}>Minutes bonus</span>
                      <span style={{ color: theme.accent }} className="font-black">{rForm.bonusMinutes} min</span>
                    </div>
                    <input
                      type="range" min={5} max={120} step={5}
                      value={rForm.bonusMinutes}
                      onChange={e => setRForm(f => ({ ...f, bonusMinutes: Number(e.target.value) }))}
                      className="w-full accent-purple-500"
                    />
                  </div>
                )}
              </div>
              <div className="flex gap-2 mt-4">
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => setRewardModal(false)}
                  className={`flex-1 py-3 rounded-2xl font-bold ${theme.buttonSecondary} ${theme.text}`}>Annuler</motion.button>
                <motion.button whileTap={{ scale: 0.95 }} onClick={saveReward}
                  className={`flex-1 py-3 rounded-2xl font-black text-white btn-3d ${theme.button}`}>Sauvegarder</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Malus Modal */}
      <AnimatePresence>
        {malusModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center"
            style={{ background: 'rgba(0,0,0,0.7)' }}
            onClick={() => setMalusModal(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 35 }}
              className={`${theme.card} rounded-t-3xl p-6 w-full max-w-md`}
              onClick={e => e.stopPropagation()}
            >
              <h3 className={`text-lg font-black ${theme.text} mb-4`}>
                {editMalusItem ? 'Modifier le malus' : 'Nouveau malus'}
              </h3>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="😤"
                    value={malForm.icon}
                    onChange={e => setMalForm(f => ({ ...f, icon: e.target.value }))}
                    className={`w-16 ${theme.card} ${theme.text} rounded-xl px-2 py-2 text-center text-xl outline-none border-0`}
                    style={{ background: 'transparent' }}
                  />
                  <input
                    type="text"
                    placeholder="Titre du malus"
                    value={malForm.title}
                    onChange={e => setMalForm(f => ({ ...f, title: e.target.value }))}
                    className={`flex-1 ${theme.card} ${theme.text} rounded-xl px-3 py-2 text-sm font-semibold outline-none border-0`}
                    style={{ background: 'transparent' }}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Description courte"
                  value={malForm.description}
                  onChange={e => setMalForm(f => ({ ...f, description: e.target.value }))}
                  className={`w-full ${theme.card} ${theme.text} rounded-xl px-3 py-2 text-sm font-semibold outline-none border-0`}
                  style={{ background: 'transparent' }}
                />
                <div>
                  <div className="flex justify-between mb-1">
                    <span className={`text-sm ${theme.textMuted}`}>Crédits retirés</span>
                    <span className="font-black text-red-400">-{malForm.creditPenalty} 🪙</span>
                  </div>
                  <input
                    type="range" min={1} max={30} step={1}
                    value={malForm.creditPenalty}
                    onChange={e => setMalForm(f => ({ ...f, creditPenalty: Number(e.target.value) }))}
                    className="w-full"
                    style={{ accentColor: '#ef4444' }}
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => setMalusModal(false)}
                  className={`flex-1 py-3 rounded-2xl font-bold ${theme.buttonSecondary} ${theme.text}`}>Annuler</motion.button>
                <motion.button whileTap={{ scale: 0.95 }} onClick={saveMalus}
                  className="flex-1 py-3 rounded-2xl font-black text-white btn-3d bg-red-500 hover:bg-red-400">Sauvegarder</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
