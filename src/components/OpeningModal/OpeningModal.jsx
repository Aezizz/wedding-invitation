import React, { useState } from "react";
import FallingPetals from "./FallingPetals";
import { weddingData } from "../../data/weddingData";

export default function OpeningModal({ guestName, onOpen }) {
  const [isClosing, setIsClosing] = useState(false);

  const handleOpenClick = () => {
    setIsClosing(true);
    setTimeout(() => {
      onOpen();
    }, 600);
  };

  const { groom, bride } = weddingData.couple;
  const { dateFormatted } = weddingData.events.akad;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-700 ease-out ${
        isClosing
          ? "opacity-0 scale-105 pointer-events-none"
          : "opacity-100 scale-100"
      }`}
    >
      {/* Background Image Cover dengan Soft Vignette */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${weddingData.media.coverImage})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/80 backdrop-blur-[1px]" />
      </div>

      {/* Falling Flower Petals */}
      <FallingPetals count={16} />

      {/* Konten Cover Utama */}
      <div className="relative z-10 w-full max-w-[420px] h-full flex flex-col justify-between items-center text-center px-6 py-12 text-white">
        {/* Ornamen Monogram Atas */}
        <div className="flex flex-col items-center animate-fade-in-up">
          <div className="w-10 h-10 rounded-full border border-accent/40 flex items-center justify-center text-accent text-xs mb-3 font-serif tracking-widest bg-black/20 backdrop-blur-xs">
            R&H
          </div>
          <span className="text-[11px] tracking-[0.35em] text-accent-light uppercase font-medium">
            {weddingData.couple.title}
          </span>
        </div>

        {/* Nama Mempelai */}
        <div className="my-auto py-6 flex flex-col items-center">
          <h1 className="font-serif text-5xl md:text-6xl text-white font-medium tracking-wide leading-tight drop-shadow-lg">
            {groom.shortName}
            <span className="block font-serif font-light text-accent text-3xl md:text-4xl my-1 italic">
              &
            </span>
            {bride.shortName}
          </h1>

          <p className="text-xs tracking-[0.2em] uppercase text-white/80 font-medium mt-4">
            {dateFormatted}
          </p>

          {/* Kartu Nama Tamu */}
          <div className="mt-8 px-6 py-4 glass-card-dark rounded-2xl w-full max-w-[320px] border border-accent/30 shadow-2xl backdrop-blur-md">
            <span className="text-[10px] text-white/70 uppercase tracking-widest block mb-1.5 font-medium">
              Kepada Yth. Bapak/Ibu/Saudara/i:
            </span>
            <h2 className="font-serif text-xl md:text-2xl text-accent-light font-semibold tracking-wide">
              {guestName || "Tamu Undangan"}
            </h2>
            <span className="text-[10px] text-white/50 block mt-1 italic">
              Di Tempat
            </span>
          </div>
        </div>

        {/* Tombol Buka Undangan */}
        <div className="w-full max-w-[280px] flex flex-col items-center">
          <button
            onClick={handleOpenClick}
            className="group relative w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-accent to-[#d8b056] text-charcoal font-semibold text-xs tracking-widest uppercase shadow-xl hover:shadow-accent/40 transition-all duration-300 transform active:scale-95 cursor-pointer flex items-center justify-center gap-2 animate-pulse-gold"
          >
            <span className="text-sm">✉️</span>
            <span>BUKA UNDANGAN</span>
          </button>
          <span className="text-[10px] text-white/60 mt-3 font-light">
            *Sentuh tombol untuk membuka & memutar musik
          </span>
        </div>
      </div>
    </div>
  );
}
