import { SAMPLE_ANSWERS, SampleAnswer } from "@/data/samples";
import { Sparkles } from "lucide-react";

interface SampleChipsProps {
  onSelectSample: (sample: SampleAnswer) => void;
  disabled?: boolean;
}

export function SampleChips({ onSelectSample, disabled }: SampleChipsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-[#8A91A3] flex items-center gap-1 mr-1">
        <Sparkles className="w-3.5 h-3.5 text-[#6366F1]" />
        Try sample:
      </span>
      {SAMPLE_ANSWERS.map((sample) => (
        <button
          key={sample.id}
          type="button"
          disabled={disabled}
          onClick={() => onSelectSample(sample)}
          className="text-xs px-3 py-1.5 rounded-lg bg-[#12151C] hover:bg-[#1F2430] border border-[#1F2430] hover:border-[#6366F1]/50 text-[#E6E8EE] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {sample.title}
        </button>
      ))}
    </div>
  );
}

