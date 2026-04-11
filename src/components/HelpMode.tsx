import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/appStore';
import { themes } from '../themes/themes';

const steps = [
  {
    title: 'Le Minuteur ⏱️',
    text: 'Ce grand cercle montre combien de temps d\'écran il te reste aujourd\'hui. Plus il est plein, plus tu as de temps !',
    arrow: 'top',
  },
  {
    title: 'Le Bouton Play ▶️',
    text: 'Appuie sur le grand bouton pour démarrer ou mettre en pause ton temps d\'écran. Le minuteur se met à jour automatiquement.',
    arrow: 'middle',
  },
  {
    title: 'Les Crédits 🪙',
    text: 'Tu gagnes des crédits en complétant des missions (devoirs, sport, lecture...). Plus tu en fais, plus tu gagnes !',
    arrow: 'bottom',
  },
  {
    title: 'Les Étoiles ⭐',
    text: 'Convertis tes crédits en étoiles, puis utilise tes étoiles pour débloquer des récompenses comme du temps en plus !',
    arrow: 'bottom',
  },
  {
    title: 'L\'Espace Parents ⚙️',
    text: 'L\'onglet Règles est réservé aux parents. Ils peuvent y configurer les limites, les missions et les récompenses.',
    arrow: 'nav',
  },
];

export default function HelpMode() {
  const { helpModeActive, helpStep, setHelpMode, setHelpStep, children, activeChildId } = useAppStore();
  const child = children.find(c => c.id === activeChildId);
  const theme = child ? themes[child.themeId] : themes['galactic'];

  if (!helpModeActive) return null;

  const step = steps[helpStep];

  return (
    <AnimatePresence>
      {helpModeActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.75)' }}
          onClick={() => setHelpMode(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`${theme.card} rounded-3xl p-6 mx-4 max-w-sm w-full`}
            onClick={e => e.stopPropagation()}
          >
            {/* Step indicator */}
            <div className="flex gap-1.5 justify-center mb-4">
              {steps.map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    width: i === helpStep ? 24 : 8,
                    background: i === helpStep ? theme.accent : 'rgba(255,255,255,0.3)',
                  }}
                  className="h-2 rounded-full"
                />
              ))}
            </div>

            {/* Bouncing arrow */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              className="text-4xl text-center mb-3"
            >
              {step.arrow === 'nav' ? '👇' : '👆'}
            </motion.div>

            {/* Content */}
            <motion.div
              key={helpStep}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
            >
              <h3 className={`text-xl font-black ${theme.text} text-center mb-2`}>
                {step.title}
              </h3>
              <p className={`${theme.textMuted} text-center text-sm leading-relaxed`}>
                {step.text}
              </p>
            </motion.div>

            {/* Buttons */}
            <div className="flex gap-2 mt-6">
              {helpStep > 0 && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setHelpStep(helpStep - 1)}
                  className={`flex-1 py-3 rounded-2xl font-bold text-sm ${theme.buttonSecondary} ${theme.text}`}
                >
                  ← Précédent
                </motion.button>
              )}

              {helpStep < steps.length - 1 ? (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setHelpStep(helpStep + 1)}
                  className={`flex-1 py-3 rounded-2xl font-bold text-sm ${theme.button} text-white btn-3d`}
                >
                  Suivant →
                </motion.button>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setHelpMode(false)}
                  className={`flex-1 py-3 rounded-2xl font-bold text-sm ${theme.button} text-white btn-3d`}
                >
                  Terminer ✓
                </motion.button>
              )}
            </div>

            <button
              onClick={() => setHelpMode(false)}
              className={`w-full mt-2 py-2 text-sm ${theme.textMuted} hover:opacity-70 transition-opacity`}
            >
              Ignorer le tutoriel
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
