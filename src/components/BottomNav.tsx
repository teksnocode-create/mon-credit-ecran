import { motion } from 'framer-motion';
import { useAppStore } from '../store/appStore';
import { themes } from '../themes/themes';

const tabs = [
  { id: 'dashboard' as const, label: 'Accueil', icon: '🏠' },
  { id: 'stats' as const, label: 'Stats', icon: '📊' },
  { id: 'profile' as const, label: 'Profil', icon: '👤' },
  { id: 'rules' as const, label: 'Règles', icon: '⚙️' },
];

export default function BottomNav() {
  const { currentPage, setPage, themeId } = useAppStore();
  const theme = themes[themeId];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 ${theme.nav} z-40`}>
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2">
        {tabs.map(tab => {
          const isActive = currentPage === tab.id;
          return (
            <motion.button
              key={tab.id}
              onClick={() => setPage(tab.id)}
              className="flex flex-col items-center justify-center flex-1 h-full relative py-1"
              whileTap={{ scale: 0.85 }}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-b-full"
                  style={{ background: theme.accent }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <motion.span
                animate={{
                  scale: isActive ? 1.2 : 1,
                  y: isActive ? -2 : 0,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="text-2xl"
              >
                {tab.icon}
              </motion.span>
              <motion.span
                animate={{ opacity: isActive ? 1 : 0.5 }}
                className={`text-xs font-bold mt-0.5 ${theme.text}`}
                style={{ color: isActive ? theme.accent : undefined }}
              >
                {tab.label}
              </motion.span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
