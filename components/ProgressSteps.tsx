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
      className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs"
    >
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 sm:pb-0">
        {STEPS.map((step, idx) => {
          const isDone = currentIndex > idx;
          const isCurrent = currentIndex === idx;

          return (
            <div key={step.id} className="flex items-center gap-2 flex-1 min-w-[120px]">
              <div className="flex items-center gap-1.5">
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                ) : isCurrent ? (
                  <Loader2 className="w-3.5 h-3.5 text-[#6366F1] animate-spin" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-slate-300" />
                )}
                <span
                  className={`text-[11px] font-medium ${
                    isCurrent
                      ? "text-[#1E232B] font-semibold"
                      : isDone
                      ? "text-[#10B981]"
                      : "text-slate-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-2 ${
                    isDone ? "bg-[#10B981]/40" : "bg-slate-100"
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
