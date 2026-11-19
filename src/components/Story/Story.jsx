import React from "react";
import { weddingData } from "../../data/weddingData";

export default function Story() {
  const { story } = weddingData;

  if (!story || story.length === 0) return null;

  // Bagian 5: Kisah Cinta (NORMAL - bg1.webp)
  // Pas 1 layar (min-h-screen) sehingga background tajam & rasio 9:16 asli
  return (
    <section
      id="story"
      className="min-h-screen w-full py-16 px-6 text-center flex flex-col items-center justify-center relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/bg1.webp')" }}
    >
      <div className="max-w-md w-full flex flex-col items-center">
        {/* Section Header */}
        <span className="text-xs tracking-[0.3em] font-medium text-accent uppercase block mb-1">
          Our Journey
        </span>
        <h2 className="font-serif text-3xl md:text-4xl text-secondary font-medium tracking-wide">
          Kisah Cinta Kami
        </h2>
        <div className="w-12 h-[1px] bg-accent/50 mx-auto mt-2 mb-6" />

        {/* Timeline Container */}
        <div className="relative border-l-2 border-accent/35 ml-2 md:ml-4 pl-5 flex flex-col gap-4 text-left w-full max-w-xs">
          {story.map((item, index) => (
            <div key={index} className="relative group">
              {/* Dot Bulat Timeline */}
              <div className="absolute -left-[27px] top-1.5 w-3.5 h-3.5 rounded-full bg-accent border-2 border-primary shadow-sm flex items-center justify-center group-hover:scale-125 transition-transform duration-300" />

              {/* Card Cerita */}
              <div className="glass-card p-3.5 rounded-2xl border border-secondary/15 hover:border-accent/40 transition-all duration-300 shadow-sm">
                <span className="text-[11px] font-bold font-serif text-accent tracking-wider block mb-0.5">
                  {item.year}
                </span>
                <h3 className="font-serif text-base font-semibold text-secondary mb-1">
                  {item.title}
                </h3>
                <p className="text-[11px] text-charcoal/75 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
