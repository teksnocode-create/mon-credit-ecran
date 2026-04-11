import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useAppStore } from '../store/appStore';
import { themes } from '../themes/themes';
import CircularTimer from '../components/CircularTimer';
import ThemeSwitcher from '../components/ThemeSwitcher';
import HelpMode from '../components/HelpMode';
import MalusConfirmModal from '../components/MalusConfirmModal';

const AVATARS = ['🦊', '🐸', '🦁', '🐼', '🦄', '🐉', '🤖', '👾', '🦋', '🌟', '🎯', '🎮'];

function MalusSection({ malus, theme, creditShake, onApply }: {
  malus: import('../types').Malus[];
  theme: import('../themes/themes').Theme;
  creditShake: boolean;
  onApply: (id: string) => void;
}) {
  return (
    <div className="mb-6">
      <h2 className={`text-lg font-black ${theme.text} mb-3`}>Malus 🚫</h2>
      <motion.p
        className={`text-xs ${theme.textMuted} mb-3 italic`}
        animate={creditShake ? { x: [0, -8, 8, -8, 8, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        ⚠️ Réservé aux parents — retire des crédits à l'enfant
      </motion.p>
      <div className="space-y-2">
        {malus.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-red-500/10 border border-red-500/20 rounded-2xl p-3 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{m.icon}</span>
              <div>
                <div className={`font-bold ${theme.text} text-sm`}>{m.title}</div>
                <div className={`text-xs ${theme.textMuted}`}>{m.description}</div>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => onApply(m.id)}
              className="flex-shrink-0 px-3 py-1.5 rounded-xl font-black text-xs btn-3d bg-red-500 hover:bg-red-400 text-white"
            >
              -{m.creditPenalty} 🪙
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const {
    children, activeChildId, setActiveChild,
    startTimer, pauseTimer, tickTimer,
    missions, malus, rewards, completeMission, convertCreditsToStars, redeemReward, applyMalus,
    setHelpMode, settings,
  } = useAppStore();

  const child = children.find(c => c.id === activeChildId);
  const theme = child ? themes[child.themeId] : themes['galactic'];
  const isTimerRunning = child?.isTimerRunning ?? false;
  const [completedMissions, setCompletedMissions] = useState<string[]>([]);
  const [malusOpen, setMalusOpen] = useState(false);
  const [pendingMalusId, setPendingMalusId] = useState<string | null>(null);
  const [creditShake, setCreditShake] = useState(false);

  // Timer tick — runs as long as any child has a running timer
  const anyRunning = children.some(c => c.isTimerRunning);
  useEffect(() => {
    if (!anyRunning) return;
    const interval = setInterval(() => tickTimer(), 1000);
    return () => clearInterval(interval);
  }, [anyRunning, tickTimer]);

  // Reset completed missions at midnight
  useEffect(() => {
    setCompletedMissions([]);
  }, [activeChildId]);

  const handleMissionComplete = (missionId: string) => {
    if (completedMissions.includes(missionId)) return;
    completeMission(missionId);
    setCompletedMissions(prev => [...prev, missionId]);
  };

  const canRedeem = (starCost: number) => (child?.stars ?? 0) >= starCost;
  const canConvert = (child?.credits ?? 0) >= settings.creditToStarRatio;

  if (!child) {
    return (
      <div className={`min-h-screen ${theme.bg} flex items-center justify-center`}>
        <div className={`${theme.card} rounded-3xl p-8 text-center mx-4`}>
          <div className="text-5xl mb-3">👋</div>
          <h2 className={`text-xl font-black ${theme.text} mb-2`}>Aucun profil enfant</h2>
          <p className={`${theme.textMuted} text-sm`}>Créez un profil dans l'onglet Règles.</p>
        </div>
      </div>
    );
  }

  const avatarEmoji = AVATARS.includes(child.avatarId) ? child.avatarId : '🦊';

  return (
    <div className={`min-h-screen ${theme.bg} pb-24`}>
      <div className="max-w-md mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between pt-6 pb-4">
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-full ${theme.card} flex items-center justify-center text-xl`}>
              {avatarEmoji}
            </div>
            <div>
              <div className={`font-black ${theme.text} text-base leading-tight`}>{child.name}</div>
              <div className={`text-xs ${theme.textMuted}`}>
                {isTimerRunning ? '🟢 En cours' : child.remainingMinutes <= 0 ? '🔴 Terminé' : '⏸️ En pause'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setHelpMode(true, 0)}
              className={`w-10 h-10 rounded-full ${theme.card} flex items-center justify-center font-black text-lg ${theme.text}`}
            >
              ?
            </motion.button>
            <ThemeSwitcher />
          </div>
        </div>

        {/* Child selector */}
        {children.length > 1 && (
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            {children.map(c => (
              <motion.button
                key={c.id}
                whileTap={{ scale: 0.9 }}
                onClick={() => setActiveChild(c.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold flex-shrink-0 transition-all ${
                  c.id === activeChildId
                    ? `text-white`
                    : `${theme.card} ${theme.textMuted}`
                }`}
                style={c.id === activeChildId ? { background: theme.accent } : {}}
              >
                <span>{AVATARS.includes(c.avatarId) ? c.avatarId : '🦊'}</span>
                <span>{c.name}</span>
                {c.isTimerRunning && <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />}
              </motion.button>
            ))}
          </div>
        )}

        {/* Timer */}
        <div className="flex justify-center my-4">
          <CircularTimer
            remainingMinutes={child.remainingMinutes}
            dailyLimitMinutes={child.dailyLimitMinutes}
          />
        </div>

        {/* Play/Pause button */}
        <div className="flex justify-center mb-6">
          <motion.button
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.04 }}
            onClick={() => isTimerRunning ? pauseTimer() : startTimer()}
            disabled={!isTimerRunning && child.remainingMinutes <= 0}
            className={`btn-3d text-white font-black text-xl px-10 py-5 rounded-3xl ${theme.button} disabled:opacity-40 disabled:cursor-not-allowed`}
            style={{ minWidth: 200, boxShadow: `0 8px 0 rgba(0,0,0,0.3), 0 0 30px ${theme.accent}60` }}
          >
            <motion.span
              animate={{ scale: isTimerRunning ? [1, 1.1, 1] : 1 }}
              transition={{ repeat: isTimerRunning ? Infinity : 0, duration: 1 }}
              className="mr-2"
            >
              {isTimerRunning ? '⏸️' : '▶️'}
            </motion.span>
            {isTimerRunning ? 'Pause' : child.remainingMinutes <= 0 ? 'Temps écoulé' : "C'est parti !"}
          </motion.button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: '🪙', value: Math.floor(child.credits), label: 'Crédits', isCredits: true },
            { icon: '⭐', value: child.stars, label: 'Étoiles' },
            { icon: '⏰', value: `${child.dailyLimitMinutes}m`, label: 'Limite' },
          ].map(stat => {
            const isNegative = stat.isCredits && stat.value < 0;
            const displayValue = stat.isCredits
              ? (isNegative ? `−${Math.abs(stat.value)}` : stat.value)
              : stat.value;
            return (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.03 }}
                className={`${theme.card} rounded-2xl p-3 text-center ${isNegative ? 'bg-red-500/20 border border-red-500/40' : ''}`}
              >
                <div className="text-2xl">{stat.icon}</div>
                <div className={`text-xl font-black ${isNegative ? 'text-red-400' : theme.text}`}>
                  {displayValue}
                </div>
                <div className={`text-xs ${theme.textMuted}`}>{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Convert button */}
        <AnimatePresence>
          {child.credits > 0 && (
            <motion.button
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              whileTap={{ scale: 0.95 }}
              onClick={convertCreditsToStars}
              disabled={!canConvert}
              className={`w-full mb-4 py-3 rounded-2xl font-bold text-sm text-white btn-3d ${
                canConvert ? theme.button : 'bg-white/10'
              } ${!canConvert ? theme.textMuted : ''} disabled:btn-3d`}
            >
              {canConvert
                ? `✨ Convertir ${Math.floor(child.credits / settings.creditToStarRatio)} étoile(s) (${settings.creditToStarRatio} crédits = 1 ⭐)`
                : `🪙 ${child.credits}/${settings.creditToStarRatio} crédits pour 1 étoile`}
            </motion.button>
          )}
        </AnimatePresence>

        {/* Missions */}
        <div className="mb-6">
          <h2 className={`text-lg font-black ${theme.text} mb-3`}>Missions du jour 🎯</h2>
          <div className="space-y-2">
            {missions.filter(m => m.enabled).map((mission, i) => {
              const done = completedMissions.includes(mission.id);
              return (
                <motion.div
                  key={mission.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`${theme.card} rounded-2xl p-3 flex items-center justify-between transition-all ${
                    done ? 'opacity-60' : theme.cardHover
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{mission.icon}</span>
                    <div>
                      <div className={`font-bold ${theme.text} text-sm`}>{mission.title}</div>
                      <div className={`text-xs ${theme.textMuted}`}>{mission.description}</div>
                    </div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => handleMissionComplete(mission.id)}
                    disabled={done}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-xl font-black text-xs btn-3d transition-all ${
                      done
                        ? 'bg-green-500/20 text-green-400 cursor-default'
                        : `${theme.button} text-white`
                    }`}
                  >
                    {done ? '✓ Fait !' : `+${mission.creditValue} 🪙`}
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Rewards */}
        <div className="mb-6">
          <h2 className={`text-lg font-black ${theme.text} mb-3`}>Récompenses 🎁</h2>
          <div className="space-y-2">
            {rewards.map((reward, i) => {
              const affordable = canRedeem(reward.starCost);
              return (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`${theme.card} rounded-2xl p-3 flex items-center justify-between ${
                    affordable ? theme.cardHover : 'opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{reward.icon}</span>
                    <div>
                      <div className={`font-bold ${theme.text} text-sm`}>{reward.title}</div>
                      <div className={`text-xs ${theme.textMuted}`}>{reward.description}</div>
                    </div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => affordable && redeemReward(reward.id)}
                    disabled={!affordable}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-xl font-black text-xs btn-3d ${
                      affordable
                        ? `${theme.button} text-white`
                        : 'bg-white/10 text-white/40 cursor-not-allowed'
                    }`}
                  >
                    {reward.starCost} ⭐
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        </div>
        {/* Malus */}
        {malus.filter(m => m.enabled).length > 0 && (
          <MalusSection
            malus={malus.filter(m => m.enabled)}
            theme={theme}
            creditShake={creditShake}
            onApply={(id) => { setPendingMalusId(id); setMalusOpen(true); }}
          />
        )}
      </div>

      <HelpMode />

      <MalusConfirmModal
        open={malusOpen}
        malusItem={malus.find(m => m.id === pendingMalusId) ?? null}
        onConfirm={() => {
          if (pendingMalusId) {
            applyMalus(pendingMalusId);
            setCreditShake(true);
            setTimeout(() => setCreditShake(false), 600);
          }
          setMalusOpen(false);
          setPendingMalusId(null);
        }}
        onCancel={() => { setMalusOpen(false); setPendingMalusId(null); }}
        theme={theme}
      />
    </div>
  );
}
