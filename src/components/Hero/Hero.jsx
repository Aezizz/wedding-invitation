import React from "react";
import { weddingData } from "../../data/weddingData";

export default function Hero() {
  return (
    <section
      id="home"
      className="min-h-screen relative flex flex-col items-center justify-center text-center p-6 overflow-hidden"
    >
      {/* 1. Foto Background High-Resolution dengan Efek Gelap Tipis */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/components/OpeningModal/Image/bg1.jpeg"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* 2. Efek Vignette / Border Lembut di Pinggir */}
      <div className="absolute inset-0 border-[16px] border-primary/10 z-10 pointer-events-none" />

      {/* 3. Konten Utama */}
      <div className="z-20 max-w-lg flex flex-col items-center text-white px-4">
        <span className="text-[10px] sm:text-xs tracking-[0.3em] font-medium text-amber-200 uppercase mb-6 drop-shadow">
          Selamat Datang di Undangan Pernikahan
        </span>

        <h2 className="font-serif text-4xl sm:text-5xl md:text-7xl font-semibold my-4 tracking-wide leading-tight drop-shadow-md">
          {weddingData.groom.shortName}{" "}
          <span className="font-serif font-light text-amber-200 italic">&</span>{" "}
          {weddingData.bride.shortName}
        </h2>

        <p className="font-sans tracking-[0.15em] uppercase text-[10px] sm:text-xs font-semibold mt-4 drop-shadow">
          {weddingData.events.akad.date}
        </p>

        {/* Garis Dekoratif Pendek */}
        <div className="w-12 h-[1px] bg-amber-200/70 my-6" />
      </div>
    </section>
  );
}
