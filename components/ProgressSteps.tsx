import { Loader2, CheckCircle2, Circle } from "lucide-react";

export type PipelineStep =
  | "idle"
  | "extracting"
  | "searching"
  | "judging"
  | "scoring"
  | "done";

interface ProgressStepsProps {
  currentStep: PipelineStep;
}

const STEPS = [
  { id: "extracting", label: "Extracting claims" },
  { id: "searching", label: "Searching the web" },
  { id: "judging", label: "Judging evidence" },
  { id: "scoring", label: "Scoring" },
] as const;

export function ProgressSteps({ currentStep }: ProgressStepsProps) {
  if (currentStep === "idle" || currentStep === "done") {
    return null;
  }

  const getStepIndex = (step: PipelineStep): number => {
    switch (step) {
      case "extracting":
        return 0;
      case "searching":
        return 1;
      case "judging":
        return 2;
      case "scoring":
        return 3;
      default:
        return -1;
    }
  };

  const currentIndex = getStepIndex(currentStep);

  return (
    <div
      role="region"
      aria-live="polite"
      className="p-4 rounded-xl bg-[#12151C] border border-[#1F2430] mb-6 shadow-sm"
    >
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 sm:pb-0">
        {STEPS.map((step, idx) => {
          const isDone = currentIndex > idx;
          const isCurrent = currentIndex === idx;

          return (
            <div key={step.id} className="flex items-center gap-2 flex-1 min-w-[130px]">
              <div className="flex items-center gap-2">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-[#6366F1] animate-spin" />
                ) : (
                  <Circle className="w-4 h-4 text-[#8A91A3]/40" />
                )}
                <span
                  className={`text-xs font-medium ${
                    isCurrent
                      ? "text-[#E6E8EE] font-semibold"
                      : isDone
                      ? "text-[#22C55E]"
                      : "text-[#8A91A3]/60"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-2 ${
                    isDone ? "bg-[#22C55E]/40" : "bg-[#1F2430]"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
