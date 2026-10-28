import React, { useState } from "react";
import FallingPetals from "./FallingPetals";
import Hero from "../Hero/Hero";
import BrideGroom from "../BrideGroom/BrideGroom";
// 1. Import gambar dari folder lo
import bgImage from "./Image/bg1.jpeg";

export default function OpeningModal({ guestName, onOpen }) {
  const [isClosing, setIsClosing] = useState(false);

  const handleOpenClick = () => {
    setIsClosing(true);
    setTimeout(() => {
      onOpen();
    }, 500);
  };

  return (
    <div
      // Ganti fixed menjadi absolute agar mengikuti kontainer #root
      className={`absolute inset-0 z-50 flex flex-col items-center justify-between p-8 text-center overflow-hidden transition-opacity duration-500 bg-cover bg-center ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
      // 3. Masukin variabel import-nya ke dalam style
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Overlay hitam tipis biar teksnya keliatan jelas */}
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      {/* Wrapper konten supaya ada di atas overlay */}
      <div className="relative z-10 flex flex-col items-center justify-between h-full w-full">
        <FallingPetals count={15} />

        {/* Dekorasi Atas */}
        <div className="font-sans text-xs tracking-[0.2em] text-accent uppercase font-semibold mt-12">
          The Wedding of
        </div>

        {/* Nama Pengantin Utama */}
        <div className="my-auto flex flex-col gap-2">
          <h1 className="font-serif text-5xl md:text-6xl text-secondary font-medium tracking-wide">
            Apsari
            <br />&
            <br />
            Rama
          </h1>

          {/* Box Nama Tamu (Glassmorphism) */}
          <div className="mt-12 p-6 glass-card rounded-2xl max-w-sm mx-auto shadow-sm backdrop-blur-md">
            <p className="text-xs text-charcoal/70 font-medium uppercase tracking-wider mb-2">
              Kepada Yth. Bapak/Ibu/Saudara/i:
            </p>
            <h2 className="font-serif text-2xl text-charcoal font-semibold tracking-wide">
              {guestName}
            </h2>
          </div>
        </div>

        {/* Tombol Buka Undangan */}
        <div className="mb-12 w-full max-w-xs">
          <p className="text-xs text-charcoal/60 mb-4 italic">
            *Mohon maaf apabila ada kesalahan penulisan nama/gelar
          </p>
          <button
            onClick={handleOpenClick}
            className="w-full py-3.5 bg-secondary text-primary font-sans font-medium rounded-full tracking-wider shadow-md hover:bg-secondary/90 transition-all duration-300 transform active:scale-95 cursor-pointer"
          >
            BUKA UNDANGAN
          </button>
        </div>
      </div>
    </div>
  );
}
