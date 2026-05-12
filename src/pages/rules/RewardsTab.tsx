import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { themes } from '../../themes/themes';
import { Reward } from '../../types';

type Theme = (typeof themes)[keyof typeof themes];

interface Props {
  theme: Theme;
  showSaved: () => void;
}

const emptyForm = { title: '', icon: '🎁', starCost: 5, description: '', isMinutesReward: false, bonusMinutes: 15 };

export default function RewardsTab({ theme, showSaved }: Props) {
  const { rewards, addReward, updateReward, deleteReward } = useAppStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Reward | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (r: Reward) => {
    setEditing(r);
    setForm({ title: r.title, icon: r.icon, starCost: r.starCost, description: r.description, isMinutesReward: r.isMinutesReward, bonusMinutes: r.bonusMinutes ?? 15 });
    setModalOpen(true);
  };
  const save = () => {
    if (!form.title.trim()) return;
    if (editing) updateReward(editing.id, form);
    else addReward(form);
    setModalOpen(false);
    showSaved();
  };

  return (
    <motion.div
      key="rewards"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={openAdd}
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
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => openEdit(r)} className="text-lg">✏️</motion.button>
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => { deleteReward(r.id); showSaved(); }} className="text-lg">🗑️</motion.button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center"
            style={{ background: 'rgba(0,0,0,0.7)' }}
            onClick={() => setModalOpen(false)}
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
                {editing ? 'Modifier la récompense' : 'Nouvelle récompense'}
              </h3>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="🎁"
                    value={form.icon}
                    onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                    className={`w-16 ${theme.card} ${theme.text} rounded-xl px-2 py-2 text-center text-xl outline-none border-0`}
                    style={{ background: 'transparent' }}
                  />
                  <input
                    type="text"
                    placeholder="Titre de la récompense"
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    className={`flex-1 ${theme.card} ${theme.text} rounded-xl px-3 py-2 text-sm font-semibold outline-none border-0`}
                    style={{ background: 'transparent' }}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Description"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className={`w-full ${theme.card} ${theme.text} rounded-xl px-3 py-2 text-sm font-semibold outline-none border-0`}
                  style={{ background: 'transparent' }}
                />
                <div>
                  <div className="flex justify-between mb-1">
                    <span className={`text-sm ${theme.textMuted}`}>Coût en étoiles</span>
                    <span style={{ color: theme.accent }} className="font-black">{form.starCost} ⭐</span>
                  </div>
                  <input
                    type="range" min={1} max={30} step={1}
                    value={form.starCost}
                    onChange={e => setForm(f => ({ ...f, starCost: Number(e.target.value) }))}
                    className="w-full accent-purple-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${theme.textMuted}`}>Récompense en minutes ?</span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setForm(f => ({ ...f, isMinutesReward: !f.isMinutesReward }))}
                    className="w-12 h-6 rounded-full relative"
                    style={{ background: form.isMinutesReward ? theme.accent : 'rgba(255,255,255,0.2)' }}
                  >
                    <motion.div animate={{ x: form.isMinutesReward ? 24 : 2 }} className="absolute top-1 w-4 h-4 bg-white rounded-full shadow" />
                  </motion.button>
                </div>
                {form.isMinutesReward && (
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className={`text-sm ${theme.textMuted}`}>Minutes bonus</span>
                      <span style={{ color: theme.accent }} className="font-black">{form.bonusMinutes} min</span>
                    </div>
                    <input
                      type="range" min={5} max={120} step={5}
                      value={form.bonusMinutes}
                      onChange={e => setForm(f => ({ ...f, bonusMinutes: Number(e.target.value) }))}
                      className="w-full accent-purple-500"
                    />
                  </div>
                )}
              </div>
              <div className="flex gap-2 mt-4">
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => setModalOpen(false)}
                  className={`flex-1 py-3 rounded-2xl font-bold ${theme.buttonSecondary} ${theme.text}`}>Annuler</motion.button>
                <motion.button whileTap={{ scale: 0.95 }} onClick={save}
                  className={`flex-1 py-3 rounded-2xl font-black text-white btn-3d ${theme.button}`}>Sauvegarder</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
