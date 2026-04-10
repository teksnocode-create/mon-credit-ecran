import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const features = [
  { icon: '⏱️', title: 'Minuteur Intelligent', desc: 'Un timer visuel et ludique qui rend le temps d\'écran concret pour l\'enfant.' },
  { icon: '🏆', title: 'Système de Missions', desc: 'Devoirs, sport, lecture... chaque bonne action rapporte des crédits.' },
  { icon: '⭐', title: 'Récompenses Étoiles', desc: 'Convertis les crédits en étoiles pour débloquer des récompenses spéciales.' },
  { icon: '📊', title: 'Stats & Suivi', desc: 'Graphiques clairs pour suivre la progression et les habitudes de l\'enfant.' },
];

const testimonials = [
  {
    name: 'Sophie M.',
    role: 'Maman de 2 enfants',
    text: 'Fini les crises le soir ! Mon fils comprend maintenant que son temps d\'écran se mérite. Une vraie révolution à la maison.',
    avatar: '👩',
  },
  {
    name: 'Pierre & Julie D.',
    role: 'Parents de 3 enfants',
    text: 'Nos enfants font leurs devoirs sans qu\'on ait besoin de leur demander. Ils veulent gagner leurs crédits écran ! Incroyable.',
    avatar: '👨',
  },
  {
    name: 'Amina K.',
    role: 'Maman de Thomas, 9 ans',
    text: 'L\'interface est super colorée, mon fils adore. Et moi j\'adore qu\'il fasse son sport avant de jouer !',
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
          <span className="text-white font-black text-xl">Mon Crédit Écran</span>
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
              🎮 Gamification du temps d'écran
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl lg:text-6xl font-black text-white leading-tight mb-4"
            >
              Transformez le{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                temps d'écran
              </span>
              {' '}en aventure positive
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white/70 text-lg mb-8 max-w-lg mx-auto lg:mx-0"
            >
              Mon Crédit Écran aide les enfants à mériter leur temps d'écran grâce à des missions, des étoiles et des récompenses. Fini les disputes !
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
                Commencer gratuitement 🚀
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-2xl text-lg border border-white/20 backdrop-blur-sm"
              >
                Découvrir →
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
              <span className="text-white/60 text-sm font-semibold">+2 400 familles déjà inscrites</span>
            </motion.div>
          </div>

          {/* Phone mockup */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="flex-1 flex justify-center animate-float"
          >
            <div className="relative">
              <div className="w-64 h-[520px] bg-gradient-to-b from-[#1a0a4e] to-[#0a0a2e] rounded-[3rem] border-4 border-purple-500/50 shadow-2xl overflow-hidden"
                style={{ boxShadow: '0 0 60px rgba(168,85,247,0.4), inset 0 0 30px rgba(168,85,247,0.1)' }}>
                {/* Status bar */}
                <div className="flex justify-between items-center px-4 py-3 text-white/50 text-xs">
                  <span>9:41</span>
                  <div className="w-16 h-4 bg-black rounded-full" />
                  <span>🔋</span>
                </div>
                {/* App content preview */}
                <div className="px-4">
                  <div className="text-center text-white text-xs font-bold mb-3">Léa 🦊 · Aujourd'hui</div>
                  {/* Timer circle */}
                  <div className="flex justify-center mb-4">
                    <div className="relative w-32 h-32">
                      <svg className="w-32 h-32 -rotate-90">
                        <circle cx="64" cy="64" r="54" fill="none" stroke="#a855f720" strokeWidth="8" />
                        <circle cx="64" cy="64" r="54" fill="none" stroke="#a855f7" strokeWidth="8"
                          strokeLinecap="round" strokeDasharray={339} strokeDashoffset={339 * 0.3}
                          style={{ filter: 'drop-shadow(0 0 6px #a855f7)' }} />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl">🤩</span>
                        <span className="text-white font-black text-lg">42:18</span>
                        <span className="text-white/50 text-xs">restantes</span>
                      </div>
                    </div>
                  </div>
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {[['🪙', '35', 'Crédits'], ['⭐', '4', 'Étoiles'], ['⏰', '60', 'Limite']].map(([icon, val, label]) => (
                      <div key={label} className="bg-white/10 rounded-xl p-2 text-center">
                        <div className="text-base">{icon}</div>
                        <div className="text-white font-black text-sm">{val}</div>
                        <div className="text-white/50 text-xs">{label}</div>
                      </div>
                    ))}
                  </div>
                  {/* Mission cards */}
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
                {/* Nav */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/40 flex justify-around py-2 border-t border-white/10">
                  {['🏠', '📊', '👤', '⚙️'].map(e => <span key={e} className="text-lg">{e}</span>)}
                </div>
              </div>
              {/* Floating badges */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-4 -right-4 bg-yellow-400 text-black font-black text-sm px-3 py-1 rounded-full shadow-lg"
              >
                +10 🪙
              </motion.div>
              <motion.div
                animate={{ y: [5, -5, 5] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
                className="absolute -bottom-4 -left-4 bg-purple-500 text-white font-black text-sm px-3 py-1 rounded-full shadow-lg"
              >
                ⭐ Nouvelle étoile !
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why section */}
      <section className="px-6 py-16 bg-white/5 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">
              Fini les disputes ! 🙌
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto mb-10">
              Au lieu d'imposer des limites à l'arrache, Mon Crédit Écran crée un système équitable que les enfants <strong className="text-white">comprennent et acceptent</strong>.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '😤', before: 'Avant', text: '"Étéins cet écran !" — disputes, pleurs, tensions chaque soir.' },
              { icon: '✨', now: 'Avec Mon Crédit Écran', text: 'L\'enfant gère son propre temps et le mérite grâce à ses efforts.' },
              { icon: '😊', after: 'Résultat', text: 'Moins de conflits, plus de responsabilité, et des habitudes saines.' },
            ].map(item => (
              <motion.div
                key={item.icon}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <div className="text-purple-300 font-bold text-sm mb-2">{item.before || item.now || item.after}</div>
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
          <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">Tout ce qu'il vous faut</h2>
          <p className="text-white/60 text-lg">Une app complète, conçue pour toute la famille.</p>
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

      {/* Testimonials */}
      <section className="px-6 py-16 bg-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-black text-white text-center mb-10"
          >
            Ce que disent les familles 💬
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
          <h2 className="text-3xl font-black text-white mb-3">Prêt à transformer l'ambiance à la maison ?</h2>
          <p className="text-white/70 mb-8">Gratuit, sans publicité, sans abonnement. Juste une meilleure famille.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/auth')}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black px-10 py-4 rounded-2xl text-xl btn-3d"
          >
            Créer mon compte gratuitement
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="text-center text-white/30 text-sm pb-8">
        <p>© 2026 Mon Crédit Écran · Fait avec ❤️ pour les familles françaises</p>
      </footer>
    </div>
  );
}
