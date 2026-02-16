import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { AuthGate } from './components/AuthGate';
import { AppShell } from './components/AppShell';
import { ProfileSetupModal } from './components/ProfileSetupModal';
import { TodayDashboard } from './screens/TodayDashboard';
import { GoalsManagement } from './screens/GoalsManagement';
import { HistoryView } from './screens/HistoryView';
import { useState } from 'react';

type Screen = 'today' | 'goals' | 'history';

function App() {
  const { identity } = useInternetIdentity();
  const [currentScreen, setCurrentScreen] = useState<Screen>('today');

  const isAuthenticated = !!identity;

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AuthGate>
        <ProfileSetupModal />
        <AppShell currentScreen={currentScreen} onScreenChange={setCurrentScreen}>
          {currentScreen === 'today' && <TodayDashboard />}
          {currentScreen === 'goals' && <GoalsManagement />}
          {currentScreen === 'history' && <HistoryView />}
        </AppShell>
      </AuthGate>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;

