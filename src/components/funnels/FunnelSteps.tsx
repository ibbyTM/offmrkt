import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface Step {
  title: string;
  description?: string;
}

interface FunnelStepsProps {
  steps: Step[];
  currentStep: number;
  variant?: 'horizontal' | 'vertical' | 'compact';
  className?: string;
}

export function FunnelSteps({
  steps,
  currentStep,
  variant = 'horizontal',
  className,
}: FunnelStepsProps) {
  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center justify-center gap-2', className)}>
        {steps.map((_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div
              key={index}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                isCurrent ? 'w-8 bg-primary' : 'w-2',
                isCompleted ? 'bg-primary' : 'bg-muted'
              )}
            />
          );
        })}
      </div>
    );
  }

  if (variant === 'vertical') {
    return (
      <div className={cn('space-y-4', className)}>
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div key={index} className="flex gap-4">
              {/* Step indicator */}
              <div className="flex flex-col items-center">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                    backgroundColor: isCompleted || isCurrent 
                      ? 'hsl(var(--primary))' 
                      : 'hsl(var(--muted))',
                  }}
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium',
                    isCompleted || isCurrent
                      ? 'text-primary-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    stepNumber
                  )}
                </motion.div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'w-0.5 h-full min-h-[2rem] mt-2',
                      isCompleted ? 'bg-primary' : 'bg-muted'
                    )}
                  />
                )}
              </div>

              {/* Step content */}
              <div className="pb-8">
                <p
                  className={cn(
                    'font-medium',
                    isCurrent ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {step.title}
                </p>
                {step.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Horizontal variant (default)
  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div key={index} className="flex items-center flex-1">
              {/* Step circle and content */}
              <div className="flex flex-col items-center">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                  }}
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors',
                    isCompleted
                      ? 'bg-primary border-primary text-primary-foreground'
                      : isCurrent
                      ? 'border-primary text-primary bg-background'
                      : 'border-muted text-muted-foreground bg-background'
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    stepNumber
                  )}
                </motion.div>
                <p
                  className={cn(
                    'text-xs mt-2 text-center max-w-[80px]',
                    isCurrent ? 'text-foreground font-medium' : 'text-muted-foreground'
                  )}
                >
                  {step.title}
                </p>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-2',
                    isCompleted ? 'bg-primary' : 'bg-muted'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
