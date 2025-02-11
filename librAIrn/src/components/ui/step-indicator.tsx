interface Step {
  label: string;
  isCompleted: boolean;
  isActive: boolean;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export default function StepIndicator({
  steps,
  currentStep,
}: StepIndicatorProps) {
  return (
    <div className="relative mb-10">
      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200" />
      <div
        className="absolute top-1/2 left-0 h-0.5 bg-orange transition-all duration-500 ease-in-out"
        style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
      />

      <div className="relative flex justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-3
                ${
                  index <= currentStep
                    ? "bg-orange text-white"
                    : "bg-white border-2 border-slate-200 text-slate-400"
                }`}
            >
              {index < currentStep ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>
            <span
              className={`text-sm font-medium ${index <= currentStep ? "text-slate-800" : "text-slate-400"}`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
