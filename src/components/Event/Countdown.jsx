import React from "react";
import useCountdown from "../../hooks/useCountdown";
import { weddingData } from "../../data/weddingData";

export default function Countdown() {
  const { days, hours, minutes, seconds, isTimeUp } = useCountdown(
    weddingData.events.targetCountdown,
  );

  if (isTimeUp) {
    return (
      <div className="text-center font-serif text-xl text-accent font-medium mt-6">
        Momen Bahagia Sedang Berlangsung!
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
    <div className="flex justify-center gap-3 md:gap-4 my-8">
      {timeBlocks.map((block, idx) => (
        <div
          key={idx}
          className="flex flex-col items-center justify-center w-16 h-16 md:w-20 md:h-20 glass-card rounded-2xl shadow-sm"
        >
          <span className="font-serif text-xl md:text-2xl font-semibold text-secondary">
            {String(block.value).padStart(2, "0")}
          </span>
          <span className="text-[10px] md:text-xs text-charcoal/60 uppercase font-medium tracking-wider mt-0.5">
            {block.label}
          </span>
        </div>
      ))}
    </div>
  );
}
