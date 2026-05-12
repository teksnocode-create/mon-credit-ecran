import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAppStore } from './store/appStore';
import { themes } from './themes/themes';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Stats from './pages/Stats';
import Profile from './pages/Profile';
import Rules from './pages/Rules';
import ShowMode from './pages/ShowMode';
import BottomNav from './components/BottomNav';
import OnboardingModal from './components/OnboardingModal';
import ConfettiEffect from './components/ConfettiEffect';
import { FlyingNumberLayer } from './components/FlyingNumber';
import RewardCelebration from './components/RewardCelebration';
import PunishmentFlash from './components/PunishmentFlash';
import ThemeAmbience from './components/ThemeAmbience';
import DateTimeHeader from './components/DateTimeHeader';
import UndoToast from './components/UndoToast';

function AppLayout() {
  const {
    isAuthenticated, hasCompletedOnboarding,
    uiThemeId, currentPage,
  } = useAppStore();
  const theme = themes[uiThemeId ?? 'galactic'] || themes['galactic'];

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
      <DateTimeHeader />
      <div key={currentPage}>
        {pageMap[currentPage]}
      </div>
      <BottomNav />
      <UndoToast />
      {isAuthenticated && !hasCompletedOnboarding && <OnboardingModal />}
      <ConfettiEffect />
    </div>
  );
}

export default function App() {
  const { uiThemeId, restoreSession } = useAppStore();
  const theme = themes[uiThemeId ?? 'galactic'] || themes['galactic'];
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    restoreSession().finally(() => setBooted(true));
  }, [restoreSession]);

  if (!booted) {
    return (
      <div className={`${theme.bg} min-h-screen flex items-center justify-center`}>
        <div className="text-4xl animate-pulse">⏳</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className={`${theme.bg} min-h-screen relative`}>
        <ThemeAmbience />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/app" element={<AppLayout />} />
          <Route path="/show" element={<ShowMode />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <FlyingNumberLayer anchor="screen" />
        <RewardCelebration />
        <PunishmentFlash />
      </div>
    </BrowserRouter>
  );
}
