import { ReactNode, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useFunnel } from '@/contexts/FunnelContext';
import logo from '@/assets/offthemarkets-logo.png';

interface FunnelLayoutProps {
  children: ReactNode;
  showLogo?: boolean;
  showProgress?: boolean;
  showBackButton?: boolean;
  onBack?: () => void;
  className?: string;
}

export function FunnelLayout({
  children,
  showLogo = true,
  showProgress = true,
  showBackButton = false,
  onBack,
  className,
}: FunnelLayoutProps) {
  const { currentStep, totalSteps, prevStep } = useFunnel();
  const progressValue = (currentStep / totalSteps) * 100;

  // Handle back button
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      prevStep();
    }
  };

  // Track exit intent
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Could trigger exit tracking here
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return (
    <div className={cn('min-h-screen bg-background flex flex-col', className)}>
      {/* Minimal Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Back Button or Spacer */}
          <div className="w-24">
            {showBackButton && currentStep > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            )}
          </div>

          {/* Logo */}
          {showLogo && (
            <Link to="/" className="flex items-center">
              <img
                src={logo}
                alt="Off The Markets"
                className="h-8 w-auto dark:invert"
              />
            </Link>
          )}

          {/* Step Counter */}
          <div className="w-24 text-right">
            {showProgress && totalSteps > 1 && (
              <span className="text-sm text-muted-foreground">
                Step {currentStep} of {totalSteps}
              </span>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {showProgress && totalSteps > 1 && (
          <div className="h-1">
            <Progress value={progressValue} className="h-1 rounded-none" />
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* Minimal Footer */}
      <footer className="py-4 border-t bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} Off The Markets. All rights reserved.</p>
            <div className="flex gap-4">
              <Link to="/privacy" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-foreground transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
