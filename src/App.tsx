import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAppStore } from './store/appStore';
import { themes } from './themes/themes';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Stats from './pages/Stats';
import Profile from './pages/Profile';
import Rules from './pages/Rules';
import BottomNav from './components/BottomNav';
import OnboardingModal from './components/OnboardingModal';
import ConfettiEffect from './components/ConfettiEffect';

function AppLayout() {
  const {
    isAuthenticated, hasCompletedOnboarding,
    themeId, currentPage, tickTimer, isTimerRunning,
  } = useAppStore();
  const theme = themes[themeId];

  // Tick timer every second
  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => tickTimer(), 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning, tickTimer]);

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  const pageMap: Record<'dashboard' | 'stats' | 'profile' | 'rules', React.ReactNode> = {
    dashboard: <Dashboard />,
    stats: <Stats />,
    profile: <Profile />,
    rules: <Rules />,
  };

  return (
    <div className={`min-h-screen ${theme.bg}`}>
      <AnimatePresence mode="wait">
        <div key={currentPage}>
          {pageMap[currentPage]}
        </div>
      </AnimatePresence>
      <BottomNav />
      {isAuthenticated && !hasCompletedOnboarding && <OnboardingModal />}
      <ConfettiEffect />
    </div>
  );
}

export default function App() {
  const { themeId } = useAppStore();
  const theme = themes[themeId];

  return (
    <BrowserRouter>
      <div className={`${theme.bg} min-h-screen`}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/app" element={<AppLayout />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
