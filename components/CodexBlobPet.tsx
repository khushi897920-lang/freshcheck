"use client";

import { useState, useEffect } from "react";
import { JellyBlobMascot, JellyBlobMood } from "feral-blob";

interface CodexBlobPetProps {
  isChecking?: boolean;
  isTyping?: boolean;
  overallScore?: number | null;
  staleCount?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
  onSpeech?: (text: string) => void;
  showFloatingSpeech?: boolean;
}

const PET_QUOTES = [
  "Boop! Watching for stale AI facts! 🛡️",
  "Tavily + Bifrost guarding your answers! ✨",
  "Squishy! That tickles! 😆",
  "I love fresh, verified citations! 📚",
  "100% deterministic mathematical scoring! 🎯",
  "Poke me again to see me celebrate! 🎉",
];

export function CodexBlobPet({
  isChecking = false,
  isTyping = false,
  overallScore = null,
  staleCount = 0,
  className = "",
  size = "md",
  onSpeech,
  showFloatingSpeech = false,
}: CodexBlobPetProps) {
  const [moodOverride, setMoodOverride] = useState<JellyBlobMood | null>(null);
  const [pokeCount, setPokeCount] = useState(0);
  const [celebrateCount, setCelebrateCount] = useState(0);
  const [blinkCount, setBlinkCount] = useState(0);
  const [speechText, setSpeechText] = useState<string | null>(null);

  // Compute reactive mood based on app state
  const computedMood: JellyBlobMood = (() => {
    if (moodOverride) return moodOverride;
    if (isChecking) return "hmm";
    if (isTyping) return "curious";
    if (overallScore !== null) {
      if (overallScore >= 75) return "happy";
      if (overallScore < 40) return "sideEye";
      return "neutral";
    }
    return "neutral";
  })();

  // Trigger celebration when a fresh check succeeds
  useEffect(() => {
    if (overallScore !== null && overallScore >= 75) {
      setCelebrateCount((c) => c + 1);
      const msg = "Fresh facts verified! Score: " + overallScore + " 🎉";
      setSpeechText(msg);
      if (onSpeech) onSpeech(msg);
      const timer = setTimeout(() => setSpeechText(null), 4000);
      return () => clearTimeout(timer);
    } else if (overallScore !== null && overallScore < 40) {
      const msg = "Heads up! Stale claims detected ⚠️";
      setSpeechText(msg);
      if (onSpeech) onSpeech(msg);
      const timer = setTimeout(() => setSpeechText(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [overallScore, onSpeech]);

  // Handle Poke
  const handlePoke = () => {
    setPokeCount((prev) => prev + 1);
    setBlinkCount((b) => b + 1);
    const randomQuote = PET_QUOTES[Math.floor(Math.random() * PET_QUOTES.length)];
    setSpeechText(randomQuote);
    if (onSpeech) onSpeech(randomQuote);

    // Briefly switch to happy or surprised on poke
    setMoodOverride("happy");
    setTimeout(() => {
      setMoodOverride(null);
    }, 1200);

    // Auto-hide speech bubble after 3.5s
    setTimeout(() => {
      setSpeechText(null);
    }, 3500);
  };

  // Handle Overpoke (when user clicks rapidly)
  const handleOverpoke = () => {
    const msg = "Hey hey! Easy on the pokes! 😅";
    setSpeechText(msg);
    if (onSpeech) onSpeech(msg);
    setMoodOverride("surprised");
    setTimeout(() => {
      setMoodOverride(null);
      setSpeechText(null);
    }, 2500);
  };

  const sizeClasses = {
    sm: "w-9 h-9",
    md: "w-12 h-12 sm:w-14 sm:h-14",
    lg: "w-16 h-16 sm:w-20 sm:h-20",
  }[size];

  return (
    <div className={`relative inline-flex items-center select-none ${className}`}>
      {/* Optional Speech Cloud Bubble when poked */}
      {showFloatingSpeech && speechText && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
          <div className="bg-slate-900/90 text-white text-[11px] font-sans font-medium px-2.5 py-1 rounded-xl shadow-lg border border-slate-700 whitespace-nowrap flex items-center gap-1.5 backdrop-blur-xs">
            <span>{speechText}</span>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900/90 rotate-45 border-r border-b border-slate-700" />
          </div>
        </div>
      )}

      {/* Mint Teal Feral Blob SVG Mascot */}
      <div
        className={`blob-pet-teal relative cursor-pointer transition-transform hover:scale-105 active:scale-95 flex-shrink-0 ${sizeClasses}`}
        onClick={handlePoke}
        title="Poke your FreshCheck Codex Pet!"
      >
        <JellyBlobMascot
          mood={computedMood}
          eyeStyle="v1"
          happyEyes="smile"
          nod={isChecking || isTyping}
          celebrate={celebrateCount}
          blink={blinkCount}
          onPoke={handlePoke}
          onOverpoke={handleOverpoke}
          className="w-full h-full drop-shadow-sm"
        />
      </div>
    </div>
  );
}
