import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { themes } from '../../themes/themes';
import { Malus } from '../../types';

type Theme = (typeof themes)[keyof typeof themes];

interface Props {
  theme: Theme;
  showSaved: () => void;
}

const emptyForm = { title: '', icon: '😤', creditPenalty: 5, minutesPenalty: 0, description: '', enabled: true };

export default function MalusTab({ theme, showSaved }: Props) {
  const { malus, addMalus, updateMalus, deleteMalus } = useAppStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Malus | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (m: Malus) => {
    setEditing(m);
    setForm({
      title: m.title, icon: m.icon,
      creditPenalty: m.creditPenalty, minutesPenalty: m.minutesPenalty ?? 0,
      description: m.description, enabled: m.enabled,
    });
    setModalOpen(true);
  };
  const save = () => {
    if (!form.title.trim()) return;
    if (editing) updateMalus(editing.id, form);
    else addMalus(form);
    setModalOpen(false);
    showSaved();
  };

  return (
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
        onClick={openAdd}
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
                <div className={`text-xs ${theme.textMuted}`}>
                  {m.creditPenalty > 0 && <>−{m.creditPenalty} 🪙</>}
                  {m.creditPenalty > 0 && m.minutesPenalty > 0 && ' · '}
                  {m.minutesPenalty > 0 && <>−{m.minutesPenalty} min</>}
                  {(m.creditPenalty > 0 || m.minutesPenalty > 0) && ' · '}
                  {m.description}
                </div>
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
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => openEdit(m)} className="text-lg">✏️</motion.button>
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => { deleteMalus(m.id); showSaved(); }} className="text-lg">🗑️</motion.button>
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
                {editing ? 'Modifier le malus' : 'Nouveau malus'}
              </h3>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="😤"
                    value={form.icon}
                    onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                    className={`w-16 ${theme.card} ${theme.text} rounded-xl px-2 py-2 text-center text-xl outline-none border-0`}
                    style={{ background: 'transparent' }}
                  />
                  <input
                    type="text"
                    placeholder="Titre du malus"
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    className={`flex-1 ${theme.card} ${theme.text} rounded-xl px-3 py-2 text-sm font-semibold outline-none border-0`}
                    style={{ background: 'transparent' }}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Description courte"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className={`w-full ${theme.card} ${theme.text} rounded-xl px-3 py-2 text-sm font-semibold outline-none border-0`}
                  style={{ background: 'transparent' }}
                />
                <div>
                  <p className={`text-xs ${theme.textMuted} mb-3 italic`}>
                    Configure les 2 punitions. Mets 0 pour désactiver une option. Le parent choisit laquelle appliquer au moment du clic.
                  </p>
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className={`text-sm ${theme.textMuted}`}>🪙 Crédits retirés</span>
                      <span className="font-black text-red-400">{form.creditPenalty === 0 ? 'Désactivé' : `−${form.creditPenalty} 🪙`}</span>
                    </div>
                    <input
                      type="range" min={0} max={30} step={1}
                      value={form.creditPenalty}
                      onChange={e => setForm(f => ({ ...f, creditPenalty: Number(e.target.value) }))}
                      className="w-full"
                      style={{ accentColor: '#ef4444' }}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className={`text-sm ${theme.textMuted}`}>⏱️ Minutes retirées</span>
                      <span className="font-black text-red-400">{form.minutesPenalty === 0 ? 'Désactivé' : `−${form.minutesPenalty} min`}</span>
                    </div>
                    <input
                      type="range" min={0} max={120} step={5}
                      value={form.minutesPenalty}
                      onChange={e => setForm(f => ({ ...f, minutesPenalty: Number(e.target.value) }))}
                      className="w-full"
                      style={{ accentColor: '#ef4444' }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => setModalOpen(false)}
                  className={`flex-1 py-3 rounded-2xl font-bold ${theme.buttonSecondary} ${theme.text}`}>Annuler</motion.button>
                <motion.button whileTap={{ scale: 0.95 }} onClick={save}
                  className="flex-1 py-3 rounded-2xl font-black text-white btn-3d bg-red-500 hover:bg-red-400">Sauvegarder</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
