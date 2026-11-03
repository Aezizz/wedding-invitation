import React from "react";
import useCountdown from "../../hooks/useCountdown";
import { weddingData } from "../../data/weddingData";

export default function Countdown() {
  const { days, hours, minutes, seconds, isTimeUp } = useCountdown(
    weddingData.events.targetCountdown,
  );

  if (isTimeUp) {
    return (
      <div className="text-center font-serif text-lg text-accent font-semibold my-6 py-4 px-6 glass-card rounded-2xl border border-accent/40 animate-pulse">
        🎉 Momen Bahagia Sedang Berlangsung!
      </div>
    );
  }

  const timeBlocks = [
    { label: "Hari", value: days },
    { label: "Jam", value: hours },
    { label: "Menit", value: minutes },
    { label: "Detik", value: seconds },
  ];

  return (
    <div className="flex justify-center items-center gap-2.5 sm:gap-3.5 my-8">
      {timeBlocks.map((block, idx) => (
        <div
          key={idx}
          className="flex flex-col items-center justify-center w-[72px] h-[76px] sm:w-20 sm:h-20 glass-card rounded-2xl border border-accent/25 shadow-sm hover:border-accent/50 transition-all duration-300"
        >
          <span className="font-serif text-2xl sm:text-3xl font-bold text-secondary">
            {String(block.value).padStart(2, "0")}
          </span>
          <span className="text-[10px] text-charcoal-muted uppercase font-semibold tracking-widest mt-1">
            {block.label}
          </span>
        </div>
      ))}
    </div>
  );
}
