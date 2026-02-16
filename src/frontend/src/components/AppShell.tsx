import { AppHeader } from './AppHeader';

interface AppShellProps {
  children: React.ReactNode;
  currentScreen: 'today' | 'goals' | 'history';
  onScreenChange: (screen: 'today' | 'goals' | 'history') => void;
}

export function AppShell({ children, currentScreen, onScreenChange }: AppShellProps) {
  return (
    <div 
      className="min-h-screen bg-background relative"
      style={{
        backgroundImage: 'url(/assets/generated/warm-pattern-bg.dim_1920x1080.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-background/85 backdrop-blur-[2px]" />
      <div className="relative z-10">
        <AppHeader currentScreen={currentScreen} onScreenChange={onScreenChange} />
        <main className="container max-w-5xl mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="border-t border-border bg-card/50 backdrop-blur-sm mt-16">
          <div className="container max-w-5xl mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} Daily Goals. Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.hostname : 'daily-goals'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

