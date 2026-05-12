import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const features = [
  { icon: '⏱️', title: 'Timer visuel partagé', desc: 'Lancez et mettez en pause le temps d\'écran depuis votre téléphone. L\'enfant voit le décompte avec vous.' },
  { icon: '✅', title: 'Validation des missions', desc: 'C\'est vous qui validez : devoirs faits, sport accompli, lecture terminée. Chaque effort se transforme en crédits.' },
  { icon: '⚖️', title: 'Malus & récompenses', desc: 'Vous gardez la main : appliquez les malus, offrez les bonus minutes. Tout est visible, transparent, expliqué.' },
  { icon: '📊', title: 'Tableau de bord parental', desc: 'Stats hebdo, séries, top missions, ratio comportement. Mesurez ce qui marche vraiment.' },
];

const testimonials = [
  {
    name: 'Sophie M.',
    role: 'Maman de 2 enfants',
    text: 'Fini les négociations interminables. Je pose les règles dans l\'app, on les regarde ensemble, mon fils comprend exactement où il en est.',
    avatar: '👩',
  },
  {
    name: 'Pierre & Julie D.',
    role: 'Parents de 3 enfants',
    text: 'On a enfin un cadre clair. Les enfants ne contestent plus la limite : ils la voient évoluer en temps réel selon leurs efforts.',
    avatar: '👨',
  },
  {
    name: 'Amina K.',
    role: 'Maman de Thomas, 9 ans',
    text: 'C\'est moi qui pilote, mais Thomas est acteur. On célèbre ensemble chaque mission validée. L\'ambiance à la maison a changé.',
    avatar: '👩‍🦱',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a2e] via-[#1a0a4e] to-[#0a1a3e] overflow-x-hidden">
      {/* Header */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto"
      >
        <div className="flex items-center gap-2">
          <span className="text-3xl">📱</span>
          <span className="text-white font-black text-xl">Silteplay</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/auth')}
          className="bg-white/20 hover:bg-white/30 text-white font-bold px-5 py-2 rounded-full backdrop-blur-sm transition-all"
        >
          Se connecter
        </motion.button>
      </motion.header>

      {/* Hero */}
      <section className="px-6 pt-12 pb-20 max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-block bg-purple-500/20 text-purple-300 text-sm font-bold px-4 py-1.5 rounded-full mb-4 border border-purple-500/30"
            >
              👨‍👩‍👧 L'app parentale du temps d'écran
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl lg:text-6xl font-black text-white leading-tight mb-4"
            >
              Vous pilotez,{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                il s'épanouit
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white/70 text-lg mb-3 max-w-lg mx-auto lg:mx-0"
            >
              Silteplay est <strong className="text-white">un outil pour le parent</strong>. Vous gardez le téléphone, vous validez les missions, vous offrez le temps d'écran mérité.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="text-white/50 text-base mb-8 max-w-lg mx-auto lg:mx-0"
            >
              L'enfant regarde, comprend, et se motive — sans jamais avoir besoin d'accéder à l'application.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black px-8 py-4 rounded-2xl text-lg btn-3d"
              >
                Créer mon compte parent 🚀
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-2xl text-lg border border-white/20 backdrop-blur-sm"
              >
                Comment ça marche →
              </motion.button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-4 mt-6 justify-center lg:justify-start"
            >
              <div className="flex -space-x-2">
                {['👩', '👨', '👩‍🦱', '👴'].map((e, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-purple-500/30 border-2 border-purple-400 flex items-center justify-center text-sm">{e}</div>
                ))}
              </div>
              <span className="text-white/60 text-sm font-semibold">Conçu avec et pour les parents</span>
            </motion.div>
          </div>

          {/* Phone mockup (parent's view) */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="flex-1 flex justify-center animate-float"
          >
            <div className="relative">
              <div className="w-64 h-[520px] bg-gradient-to-b from-[#1a0a4e] to-[#0a0a2e] rounded-[3rem] border-4 border-purple-500/50 shadow-2xl overflow-hidden"
                style={{ boxShadow: '0 0 60px rgba(168,85,247,0.4), inset 0 0 30px rgba(168,85,247,0.1)' }}>
                <div className="flex justify-between items-center px-4 py-3 text-white/50 text-xs">
                  <span>9:41</span>
                  <div className="w-16 h-4 bg-black rounded-full" />
                  <span>🔋</span>
                </div>
                <div className="px-4">
                  <div className="text-center text-white text-xs font-bold mb-1">Léa 🦊 <span className="text-amber-400">🔥 5</span></div>
                  <div className="text-center text-white/40 text-[10px] mb-3">Vue partagée parent · enfant</div>
                  <div className="flex justify-center mb-4">
                    <div className="relative w-32 h-32">
                      <svg className="w-32 h-32 -rotate-90">
                        <circle cx="64" cy="64" r="54" fill="none" stroke="#a855f720" strokeWidth="8" />
                        <circle cx="64" cy="64" r="54" fill="none" stroke="#a855f7" strokeWidth="8"
                          strokeLinecap="round" strokeDasharray={339} strokeDashoffset={339 * 0.3}
                          style={{ filter: 'drop-shadow(0 0 6px #a855f7)' }} />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-white font-black text-2xl">42:18</span>
                        <span className="text-white/50 text-xs">restantes</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {[['🪙', '35', 'Crédits'], ['⭐', '4', 'Étoiles'], ['📅', '150', 'Semaine']].map(([icon, val, label]) => (
                      <div key={label} className="bg-white/10 rounded-xl p-2 text-center">
                        <div className="text-base">{icon}</div>
                        <div className="text-white font-black text-sm">{val}</div>
                        <div className="text-white/50 text-xs">{label}</div>
                      </div>
                    ))}
                  </div>
                  {[['📚', 'Devoirs', '+10'], ['⚽', 'Sport', '+15']].map(([icon, title, credits]) => (
                    <div key={title} className="bg-white/10 rounded-xl p-2 mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{icon}</span>
                        <span className="text-white text-xs font-bold">{title}</span>
                      </div>
                      <span className="text-purple-400 text-xs font-black">{credits}</span>
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/40 flex justify-around py-2 border-t border-white/10">
                  {['🏠', '📊', '👤', '⚙️'].map(e => <span key={e} className="text-lg">{e}</span>)}
                </div>
              </div>
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-4 -right-4 bg-yellow-400 text-black font-black text-sm px-3 py-1 rounded-full shadow-lg"
              >
                +10 🪙 validé
              </motion.div>
              <motion.div
                animate={{ y: [5, -5, 5] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
                className="absolute -bottom-4 -left-4 bg-purple-500 text-white font-black text-sm px-3 py-1 rounded-full shadow-lg"
              >
                🔥 Série 5 jours
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Philosophy section */}
      <section className="px-6 py-16 bg-white/5 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">
              Pas une app pour enfant. <br />Une app <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">pour parent</span>. 🎯
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto mb-10">
              Trop d'apps "écran" donnent encore plus d'écran à l'enfant. Silteplay reste sur <strong className="text-white">votre téléphone</strong>. L'enfant n'a aucun accès, aucun compte, aucune notification.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🙅', title: 'Avant', text: '"Éteins ça !" — disputes, ultimatums, sentiment d\'arbitraire. Et un téléphone supplémentaire dans les mains de l\'enfant.' },
              { icon: '🤝', title: 'Avec Silteplay', text: 'Vous validez chaque effort, ensemble. Le compteur de minutes monte à vue d\'œil. L\'enfant comprend que ça se mérite.' },
              { icon: '🌱', title: 'Au quotidien', text: 'Moins de conflits, plus de complicité. Et une routine éducative que vous maîtrisez entièrement.' },
            ].map(item => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <div className="text-purple-300 font-bold text-sm mb-2">{item.title}</div>
                <p className="text-white/70 text-sm">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-16 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">Tout reste entre vos mains</h2>
          <p className="text-white/60 text-lg">Un tableau de bord parental complet, lisible, transparent.</p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 cursor-default"
            >
              <div className="text-5xl mb-3">{f.icon}</div>
              <h3 className="text-white font-black text-lg mb-2">{f.title}</h3>
              <p className="text-white/60 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-16 bg-white/5">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-black text-white text-center mb-12"
          >
            Trois gestes pour le parent 👇
          </motion.h2>
          <div className="space-y-6">
            {[
              { step: '1', title: 'Vous configurez', text: 'Profils enfants, missions (devoirs, sport, lecture…), malus, récompenses, et limites jour par jour. Le tout protégé par un PIN.' },
              { step: '2', title: 'Vous validez en direct', text: 'Mission accomplie ? Tap. Bêtise ? Malus. Le téléphone reste près de vous, vous racontez à voix haute ce qui se passe à l\'écran.' },
              { step: '3', title: 'Vous lancez le temps mérité', text: 'L\'enfant a gagné ses minutes ? Vous démarrez le timer. Mode "Écran géant" pour qu\'il voie le décompte de loin. Pas besoin d\'accès à l\'app pour lui.' },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 items-start bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-black text-xl flex-shrink-0">
                  {s.step}
                </div>
                <div>
                  <h3 className="text-white font-black text-lg mb-1">{s.title}</h3>
                  <p className="text-white/60 text-sm">{s.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-black text-white text-center mb-10"
          >
            Ce que disent les parents 💬
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6"
              >
                <div className="flex gap-1 mb-3">
                  {[1,2,3,4,5].map(s => <span key={s} className="text-yellow-400">⭐</span>)}
                </div>
                <p className="text-white/80 text-sm italic mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/30 flex items-center justify-center text-xl">{t.avatar}</div>
                  <div>
                    <div className="text-white font-bold text-sm">{t.name}</div>
                    <div className="text-white/50 text-xs">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-purple-600/50 to-indigo-600/50 backdrop-blur-xl border border-purple-500/30 rounded-4xl p-10"
        >
          <div className="text-5xl mb-4">🚀</div>
          <h2 className="text-3xl font-black text-white mb-3">Reprenez la main, sereinement.</h2>
          <p className="text-white/70 mb-8">Gratuit, sans publicité, sans abonnement. Vos données restent chez vous.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/auth')}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black px-10 py-4 rounded-2xl text-xl btn-3d"
          >
            Créer mon compte parent
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="text-center text-white/30 text-sm pb-8">
        <p>© 2026 Silteplay · Fait avec ❤️ pour les familles françaises</p>
      </footer>
    </div>
  );
}
