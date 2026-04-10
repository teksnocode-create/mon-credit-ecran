import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { themes } from '../themes/themes';

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, register, themeId } = useAppStore();
  const theme = themes[themeId];

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSubmit = async () => {
    setError('');
    if (!email || !password) { setError('Veuillez remplir tous les champs.'); return; }
    if (mode === 'register' && !name) { setError('Veuillez entrer votre prénom.'); return; }
    if (password.length < 4) { setError('Mot de passe trop court (4 caractères min).'); return; }

    setLoading(true);
    try {
      if (mode === 'login') {
        const ok = await login(email, password);
        if (ok) navigate('/app');
        else setError('Email ou mot de passe incorrect.');
      } else {
        const ok = await register(name, email, password);
        if (ok) navigate('/app');
        else setError('Cet email est déjà utilisé.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${theme.bg} flex flex-col`}>
      {/* Back to landing */}
      <div className="p-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className={`flex items-center gap-2 ${theme.textMuted} font-semibold text-sm`}
        >
          ← Retour
        </motion.button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className={`w-full max-w-sm ${theme.card} rounded-4xl p-8`}
        >
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="text-5xl mb-2">📱</div>
            <h1 className={`text-2xl font-black ${theme.text}`}>Mon Crédit Écran</h1>
            <p className={`text-sm ${theme.textMuted} mt-1`}>
              {mode === 'login' ? 'Bon retour !' : 'Créez votre compte famille'}
            </p>
          </div>

          {/* Mode toggle */}
          <div className={`flex ${theme.card} rounded-2xl p-1 mb-6`}>
            {(['login', 'register'] as const).map(m => (
              <motion.button
                key={m}
                onClick={() => { setMode(m); setError(''); }}
                className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${
                  mode === m ? `${theme.button} text-white` : theme.textMuted
                }`}
              >
                {m === 'login' ? 'Connexion' : 'Inscription'}
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={e => { e.preventDefault(); handleSubmit(); }}
              className="space-y-3"
            >
              {mode === 'register' && (
                <div>
                  <label className={`text-xs font-bold ${theme.textMuted} block mb-1`}>Prénom</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Votre prénom"
                    className={`w-full ${theme.card} ${theme.text} rounded-2xl px-4 py-3 font-semibold outline-none placeholder:opacity-40 border-0 text-sm`}
                    style={{ background: 'transparent' }}
                  />
                </div>
              )}

              <div>
                <label className={`text-xs font-bold ${theme.textMuted} block mb-1`}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className={`w-full ${theme.card} ${theme.text} rounded-2xl px-4 py-3 font-semibold outline-none placeholder:opacity-40 border-0 text-sm`}
                  style={{ background: 'transparent' }}
                />
              </div>

              <div>
                <label className={`text-xs font-bold ${theme.textMuted} block mb-1`}>Mot de passe</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full ${theme.card} ${theme.text} rounded-2xl px-4 py-3 pr-12 font-semibold outline-none placeholder:opacity-40 border-0 text-sm`}
                    style={{ background: 'transparent' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${theme.textMuted} hover:opacity-70`}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm font-semibold text-center bg-red-500/10 rounded-xl py-2 px-3"
                >
                  {error}
                </motion.p>
              )}

              <motion.button
                type="submit"
                whileTap={{ scale: 0.97 }}
                disabled={loading}
                className={`w-full py-4 rounded-2xl font-black text-white text-lg btn-3d ${theme.button} disabled:opacity-60 mt-2`}
              >
                {loading ? '⏳ Chargement...' : mode === 'login' ? 'Se connecter →' : 'S\'inscrire →'}
              </motion.button>

              <div className="flex items-center gap-3 my-2">
                <div className={`flex-1 h-px ${themeId === 'candy' ? 'bg-gray-200' : 'bg-white/20'}`} />
                <span className={`text-xs ${theme.textMuted} font-semibold`}>ou</span>
                <div className={`flex-1 h-px ${themeId === 'candy' ? 'bg-gray-200' : 'bg-white/20'}`} />
              </div>

              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => showToast('🔧 Google Sign-In nécessite une configuration Firebase. Utilisez email/mot de passe.')}
                className={`w-full py-3 rounded-2xl font-bold ${theme.buttonSecondary} ${theme.text} flex items-center justify-center gap-2 text-sm`}
              >
                <span className="text-lg">🔵</span> Continuer avec Google
              </motion.button>
            </motion.form>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-3 rounded-2xl text-sm font-semibold shadow-xl max-w-xs text-center z-50"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
