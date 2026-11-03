import React from "react";
import { weddingData } from "../../data/weddingData";

export default function Story() {
  const { story } = weddingData;

  if (!story || story.length === 0) return null;

  return (
    <section className="py-20 px-6 bg-primary text-center flex flex-col items-center relative overflow-hidden">
      <div className="max-w-md w-full">
        {/* Section Header */}
        <span className="text-xs tracking-[0.3em] font-medium text-accent uppercase block mb-1">
          Our Journey
        </span>
        <h2 className="font-serif text-3xl md:text-4xl text-secondary font-medium tracking-wide">
          Kisah Cinta Kami
        </h2>
        <div className="w-12 h-[1px] bg-accent/50 mx-auto mt-3 mb-10" />

        {/* Timeline Container */}
        <div className="relative border-l-2 border-accent/30 ml-4 md:ml-6 pl-6 flex flex-col gap-8 text-left">
          {story.map((item, index) => (
            <div key={index} className="relative group">
              {/* Dot Bulat Timeline */}
              <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-accent border-2 border-primary shadow-sm flex items-center justify-center group-hover:scale-125 transition-transform duration-300" />

              {/* Card Cerita */}
              <div className="glass-card p-5 rounded-2xl border border-secondary/15 hover:border-accent/40 transition-all duration-300 shadow-sm">
                <span className="text-xs font-bold font-serif text-accent tracking-wider block mb-1">
                  {item.year}
                </span>
                <h3 className="font-serif text-lg font-semibold text-secondary mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-charcoal/75 leading-relaxed">
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
