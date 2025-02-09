interface Step {
  label: string;
  isCompleted: boolean;
  isActive: boolean;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (index: number) => void;
}

export default function StepIndicator({
  steps,
  currentStep,
  onStepClick,
}: StepIndicatorProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Step Indicator */}
        <div className="relative mb-20">
          {/* Progress Line */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200" />
          <div
            className="absolute top-1/2 left-0 h-0.5 bg-primary transition-all duration-500 ease-in-out"
            style={{
              width: `${(currentStep / (steps.length - 1)) * 100}%`,
            }}
          />

          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex flex-col items-center cursor-pointer group"
                onClick={() => onStepClick?.(index)}
              >
                {/* Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center
                    ${
                      index <= currentStep
                        ? "bg-primary shadow-lg shadow-indigo-200"
                        : "bg-white border-2 border-slate-200"
                    } 
                    mb-3 transition-all duration-300 ease-out
                    group-hover:scale-110`}
                >
                  {index < currentStep ? (
                    <svg
                      className="w-5 h-5 text-white"
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
                    <span
                      className={`text-sm font-medium
                      ${index === currentStep ? "text-white" : "text-slate-400"}
                    `}
                    >
                      {index + 1}
                    </span>
                  )}
                </div>
                {/* Label */}
                <span
                  className={`text-sm font-medium transition-colors duration-300
                  ${index <= currentStep ? "text-slate-800" : "text-slate-400"}
                  group-hover:text-primary`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="text-center space-y-8">
          <h1 className="text-slate-800 text-3xl font-bold tracking-tight">
            대출하실 책을 한 권씩 올려주세요
          </h1>
          <button className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-primary rounded-lg shadow-lg shadow-indigo-200 hover:bg-orange-hover transform hover:scale-105 transition-all duration-200">
            대출하기
          </button>
        </div>
      </div>
    </div>
  );
}
