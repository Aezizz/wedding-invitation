import React from "react";
import { weddingData } from "../../data/weddingData";

export default function BrideGroom() {
  return (
    <section
      id="bride-groom"
      className="py-16 px-6 bg-primary text-center flex flex-col items-center"
    >
      <div className="max-w-2xl w-full flex flex-col gap-10 md:gap-16">
        {/* Pembuka Agama */}
        <p className="font-sans text-sm md:text-base text-charcoal/80 leading-relaxed italic max-w-md mx-auto px-2">
          "Maha Suci Allah yang telah menciptakan makhluk-makhluk-Nya
          berpasang-pasangan..."
        </p>

        {/* Profil Mempelai Pria */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden shadow-xl border-4 border-white/60 mb-6">
            <img
              src={weddingData.groom.photo}
              alt={weddingData.groom.fullName}
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="font-serif text-2xl md:text-4xl text-secondary font-semibold tracking-wide">
            {weddingData.groom.fullName}
          </h3>
          <p className="text-xs md:text-sm text-charcoal/70 mt-2 font-medium px-4">
            Putra dari {weddingData.groom.fatherName} &{" "}
            {weddingData.groom.motherName}
          </p>
        </div>

        {/* Simbol Ampersand Pembatas */}
        <div className="font-serif text-4xl text-accent font-light italic my-2">
          &
        </div>

        {/* Profil Mempelai Wanita */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden shadow-xl border-4 border-white/60 mb-6">
            <img
              src={weddingData.bride.photo}
              alt={weddingData.bride.fullName}
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="font-serif text-2xl md:text-4xl text-secondary font-semibold tracking-wide">
            {weddingData.bride.fullName}
          </h3>
          <p className="text-xs md:text-sm text-charcoal/70 mt-2 font-medium px-4">
            Putri dari {weddingData.bride.fatherName} &{" "}
            {weddingData.bride.motherName}
          </p>
        </div>
      </div>
    </section>
  );
}
