import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { themes } from '../themes/themes';

const AVATARS = ['🦊', '🐸', '🦁', '🐼', '🦄', '🐉', '🤖', '👾', '🦋', '🌟', '🎯', '🎮'];

export default function OnboardingModal() {
  const { uiThemeId, addChild, completeOnboarding } = useAppStore();
  const theme = themes[uiThemeId];

  const [step, setStep] = useState(0);
  const [childName, setChildName] = useState('');
  const [avatarId, setAvatarId] = useState('🦊');
  const [dailyLimit, setDailyLimit] = useState(60);

  const handleFinish = () => {
    if (childName.trim()) {
      addChild(childName.trim(), avatarId, dailyLimit);
    }
    completeOnboarding();
  };

  const slides = [
    {
      emoji: '🎉',
      title: 'Bienvenue sur Silteplay !',
      subtitle: 'L\'application qui transforme le temps d\'écran en aventure positive.',
      content: (
        <div className="space-y-3">
          {[
            { icon: '🏆', text: 'Gagne des crédits en faisant tes missions' },
            { icon: '⭐', text: 'Convertis tes crédits en étoiles' },
            { icon: '🎁', text: 'Échange tes étoiles contre des récompenses' },
            { icon: '⏱️', text: 'Gère ton temps d\'écran intelligemment' },
          ].map(item => (
            <div key={item.icon} className={`flex items-center gap-3 ${theme.card} rounded-2xl p-3`}>
              <span className="text-2xl">{item.icon}</span>
              <span className={`font-semibold ${theme.text} text-sm`}>{item.text}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      emoji: '👶',
      title: 'Créer un profil enfant',
      subtitle: 'Commence par créer le profil de ton enfant.',
      content: (
        <div className="space-y-4">
          <div>
            <label className={`text-sm font-bold ${theme.textMuted} block mb-1`}>Prénom de l'enfant</label>
            <input
              type="text"
              value={childName}
              onChange={e => setChildName(e.target.value)}
              placeholder="Ex: Léa, Tom..."
              className={`w-full ${theme.card} ${theme.text} rounded-2xl px-4 py-3 text-base font-semibold outline-none placeholder:opacity-40 border-0`}
              style={{ background: 'transparent' }}
            />
          </div>

          <div>
            <label className={`text-sm font-bold ${theme.textMuted} block mb-2`}>Choisis un avatar</label>
            <div className="grid grid-cols-6 gap-2">
              {AVATARS.map(av => (
                <motion.button
                  key={av}
                  whileTap={{ scale: 0.8 }}
                  onClick={() => setAvatarId(av)}
                  className={`text-2xl h-10 w-10 rounded-xl flex items-center justify-center transition-all ${
                    avatarId === av
                      ? 'ring-2 scale-110'
                      : `${theme.card} ${theme.cardHover}`
                  }`}
                  style={avatarId === av ? { background: theme.accent + '40', boxShadow: `0 0 0 2px ${theme.accent}` } : {}}
                >
                  {av}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <label className={`text-sm font-bold ${theme.textMuted} block mb-1`}>
              Limite quotidienne : <span style={{ color: theme.accent }}>{dailyLimit} minutes</span>
            </label>
            <input
              type="range"
              min={15}
              max={240}
              step={15}
              value={dailyLimit}
              onChange={e => setDailyLimit(Number(e.target.value))}
              className="w-full accent-purple-500"
            />
            <div className={`flex justify-between text-xs ${theme.textMuted} mt-1`}>
              <span>15 min</span>
              <span>4 heures</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      emoji: '🚀',
      title: 'C\'est parti !',
      subtitle: 'Tout est prêt. L\'aventure commence maintenant !',
      content: (
        <div className="space-y-3">
          <div className={`${theme.card} rounded-2xl p-4 text-center`}>
            <div className="text-5xl mb-2">{avatarId}</div>
            <div className={`text-xl font-black ${theme.text}`}>{childName || 'Ton enfant'}</div>
            <div className={`text-sm ${theme.textMuted}`}>{dailyLimit} min / jour</div>
          </div>
          <div className={`${theme.card} rounded-2xl p-3`}>
            <p className={`text-sm ${theme.textMuted} text-center`}>
              Tu peux modifier tous ces paramètres dans l'onglet <strong>Règles ⚙️</strong> à tout moment.
            </p>
          </div>
        </div>
      ),
    },
  ];

  const current = slides[step];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)' }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`${theme.card} rounded-3xl p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto`}
      >
        {/* Steps */}
        <div className="flex gap-1.5 justify-center mb-5">
          {slides.map((_, i) => (
            <motion.div
              key={i}
              animate={{
                width: i === step ? 32 : 8,
                background: i <= step ? theme.accent : 'rgba(255,255,255,0.2)',
              }}
              className="h-2 rounded-full transition-all"
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -30, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="text-center mb-4">
              <div className="text-5xl mb-2">{current.emoji}</div>
              <h2 className={`text-xl font-black ${theme.text} mb-1`}>{current.title}</h2>
              <p className={`text-sm ${theme.textMuted}`}>{current.subtitle}</p>
            </div>

            <div className="mb-6">{current.content}</div>
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-3">
          {step > 0 && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep(s => s - 1)}
              className={`flex-1 py-3 rounded-2xl font-bold ${theme.buttonSecondary} ${theme.text}`}
            >
              ← Retour
            </motion.button>
          )}
          {step < slides.length - 1 ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep(s => s + 1)}
              disabled={step === 1 && !childName.trim()}
              className={`flex-1 py-3 rounded-2xl font-bold text-white btn-3d ${theme.button} disabled:opacity-40`}
            >
              Suivant →
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleFinish}
              className={`flex-1 py-3 rounded-2xl font-bold text-white btn-3d ${theme.button}`}
            >
              Commencer ! 🚀
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
