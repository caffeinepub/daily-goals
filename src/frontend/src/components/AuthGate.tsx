import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { LoginButton } from './LoginButton';
import { Loader2 } from 'lucide-react';

interface AuthGateProps {
  children: React.ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const { identity, isInitializing } = useInternetIdentity();

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden"
        style={{
          backgroundImage: 'url(/assets/generated/warm-pattern-bg.dim_1920x1080.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        <div className="relative z-10 max-w-md w-full mx-4">
          <div className="bg-card border border-border rounded-2xl shadow-warm p-8 space-y-6">
            <div className="text-center space-y-4">
              <img 
                src="/assets/generated/daily-goals-logo.dim_512x512.png" 
                alt="Daily Goals" 
                className="h-24 w-24 mx-auto"
              />
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Daily Goals</h1>
                <p className="text-muted-foreground">
                  Track your daily progress and achieve your goals
                </p>
              </div>
            </div>
            <div className="pt-4">
              <LoginButton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

