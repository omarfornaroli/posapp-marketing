"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface Step {
  icon: LucideIcon;
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-start justify-center w-full mb-8 sm:mb-12">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <div key={step.label} className={cn("flex items-center", index < steps.length - 1 ? 'w-full' : 'w-auto')}>
            <div className="flex flex-col items-center text-center">
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all duration-300",
                  isActive
                    ? "bg-primary border-primary text-primary-foreground shadow-lg scale-110"
                    : isCompleted
                    ? "bg-primary/90 border-primary/90 text-primary-foreground"
                    : "bg-card border-border text-muted-foreground"
                )}
              >
                <step.icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <p
                className={cn(
                  "mt-2 text-xs sm:text-sm font-medium transition-colors duration-300 w-20",
                  isActive ? "text-primary font-bold" : "text-muted-foreground"
                )}
              >
                {step.label}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-auto h-px bg-border relative mx-4">
                 <div
                  className={cn(
                    "absolute top-0 left-0 h-full bg-primary transition-all duration-500",
                    isCompleted ? "w-full" : "w-0"
                  )}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
