import React, { useState } from "react";
import bgImage from "./Image/bg2.jpeg";

const EnvelopeOpening = ({ onOpen }) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    if (open) return;
    setOpen(true);
    setTimeout(() => {
      onOpen();
    }, 500);
  };

  return (
    <div
      className={`absolute inset-0 z-50 flex flex-col items-center justify-end pb-32 p-6 text-center bg-cover bg-center ${open ? "opacity-0 transition-opacity duration-500" : ""}`}
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Overlay Gelap */}
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      {/* Konten */}
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="font-serif text-4xl text-white mb-8 font-medium flex flex-col items-center gap-1 capitalize">
          <span>Resky</span>
          <span className="text-3xl my-1">&</span>
          <span>Hana</span>
        </h1>

        <button
          onClick={handleClick}
          className="px-8 py-3 bg-white text-secondary font-semibold rounded-full shadow-lg hover:bg-opacity-90 transition-transform active:scale-95 cursor-pointer"
        >
          Buka Undangan
        </button>
      </div>
    </div>
  );
};

export default EnvelopeOpening;
