import { useGetCallerUserProfile } from '../hooks/useCurrentUserProfile';
import { LoginButton } from './LoginButton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Target, History } from 'lucide-react';

interface AppHeaderProps {
  currentScreen: 'today' | 'goals' | 'history';
  onScreenChange: (screen: 'today' | 'goals' | 'history') => void;
}

export function AppHeader({ currentScreen, onScreenChange }: AppHeaderProps) {
  const { data: userProfile } = useGetCallerUserProfile();

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container max-w-5xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <img 
              src="/assets/generated/daily-goals-logo.dim_512x512.png" 
              alt="Daily Goals" 
              className="h-10 w-10"
            />
            <div>
              <h1 className="text-xl font-bold text-foreground">Daily Goals</h1>
              {userProfile && (
                <p className="text-sm text-muted-foreground">Welcome, {userProfile.name}</p>
              )}
            </div>
          </div>
          <div className="hidden sm:block">
            <LoginButton />
          </div>
        </div>
        <div className="flex items-center justify-between gap-4">
          <Tabs value={currentScreen} onValueChange={(v) => onScreenChange(v as any)}>
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="today" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Today</span>
              </TabsTrigger>
              <TabsTrigger value="goals" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                <span className="hidden sm:inline">Goals</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                <span className="hidden sm:inline">History</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="sm:hidden">
            <LoginButton />
          </div>
        </div>
      </div>
    </header>
  );
}

