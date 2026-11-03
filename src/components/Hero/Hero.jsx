import React from "react";
import { weddingData } from "../../data/weddingData";

export default function Hero() {
  const { groom, bride } = weddingData.couple;
  const { dateFormatted } = weddingData.events.akad;

  return (
    <section
      id="home"
      className="min-h-screen relative flex flex-col items-center justify-between text-center p-6 overflow-hidden text-white"
    >
      {/* Background Hero Image dengan Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={weddingData.media.heroImage}
          alt="Wedding Hero"
          className="w-full h-full object-cover scale-105 animate-float"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/85" />
      </div>

      {/* Frame Border Mewah */}
      <div className="absolute inset-4 border border-accent/20 z-10 pointer-events-none rounded-3xl" />

      {/* Header Kecil Atas */}
      <div className="z-20 pt-8 animate-fade-in-up">
        <span className="text-[10px] sm:text-xs tracking-[0.35em] font-medium text-accent uppercase block drop-shadow">
          Walimatul 'Ursy
        </span>
        <div className="w-8 h-[1px] bg-accent/60 mx-auto mt-2" />
      </div>

      {/* Konten Utama Tengah */}
      <div className="z-20 max-w-sm flex flex-col items-center px-4 my-auto">
        <span className="text-[11px] tracking-[0.3em] font-light text-white/80 uppercase mb-3">
          The Wedding Celebration of
        </span>

        <h2 className="font-serif text-4xl sm:text-5xl font-semibold tracking-wide leading-tight drop-shadow-md text-white">
          {groom.shortName}
          <span className="block font-serif font-light text-accent text-3xl sm:text-4xl my-1.5 italic">
            &
          </span>
          {bride.shortName}
        </h2>

        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent my-6" />

        <p className="font-sans tracking-[0.2em] uppercase text-xs font-semibold text-accent-light drop-shadow">
          {dateFormatted}
        </p>
      </div>

      {/* Indikator Scroll Bawah */}
      <div className="z-20 pb-10 flex flex-col items-center gap-2 text-white/60">
        <span className="text-[9px] uppercase tracking-[0.25em] font-light">
          Scroll ke Bawah
        </span>
        <div className="w-5 h-9 rounded-full border border-white/30 flex items-start justify-center p-1">
          <div className="w-1 h-2 bg-accent rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
