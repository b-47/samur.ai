"use client";

const steps = ["Import", "Review", "Export"];

interface StepperProps {
  currentStep: number;
}

export function Stepper({ currentStep }: StepperProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center gap-2">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${
              i <= currentStep
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {i + 1}
          </div>
          <span
            className={`text-sm font-medium ${
              i <= currentStep ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            {step}
          </span>
          {i < steps.length - 1 && (
            <div
              className={`w-12 h-0.5 mx-1 ${
                i < currentStep ? "bg-primary" : "bg-muted"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
