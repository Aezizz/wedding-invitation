import React from "react";
import { weddingData } from "../../data/weddingData";

export default function BrideGroom() {
  const { groom, bride } = weddingData.couple;
  const { quote } = weddingData;

  return (
    <section
      id="bride-groom"
      className="py-20 px-6 bg-primary text-center flex flex-col items-center relative overflow-hidden"
    >
      <div className="max-w-md w-full flex flex-col gap-12">
        {/* Ayat Suci & Kutipan Pembuka */}
        <div className="glass-card p-6 md:p-8 rounded-3xl border border-accent/25 relative shadow-sm">
          <div className="w-8 h-8 rounded-full bg-accent/15 text-accent flex items-center justify-center mx-auto mb-4 text-xs font-serif">
            ❦
          </div>

          <p className="font-serif text-base md:text-lg text-charcoal font-medium leading-loose mb-3 px-2">
            "{quote.arabic}"
          </p>
          <p className="font-sans text-xs text-charcoal/75 leading-relaxed italic mb-3">
            "{quote.text}"
          </p>
          <span className="text-[11px] font-bold text-accent tracking-wider uppercase">
            — {quote.source}
          </span>
        </div>

        {/* Section Heading */}
        <div>
          <span className="text-xs tracking-[0.3em] font-medium text-accent uppercase block mb-1">
            Pasangan Mempelai
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-secondary font-medium tracking-wide">
            Sang Pengantin
          </h2>
          <div className="w-12 h-[1px] bg-accent/50 mx-auto mt-3" />
        </div>

        {/* Profil Mempelai Pria */}
        <div className="flex flex-col items-center glass-card p-6 rounded-3xl border border-secondary/15 hover:border-accent/40 transition-all duration-300 shadow-sm">
          <div className="relative mb-5">
            <div className="w-36 h-36 rounded-full p-1 bg-gradient-to-tr from-accent via-secondary/30 to-accent shadow-md">
              <div className="w-full h-full rounded-full overflow-hidden bg-white">
                <img
                  src={groom.photo}
                  alt={groom.fullName}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
            <span className="absolute bottom-1 right-2 w-7 h-7 rounded-full bg-secondary text-white text-xs flex items-center justify-center shadow-md">
              ♂
            </span>
          </div>

          <h3 className="font-serif text-2xl text-secondary font-semibold tracking-wide">
            {groom.fullName}
          </h3>
          <span className="text-xs text-accent font-medium mt-1 uppercase tracking-wider">
            {groom.title}
          </span>
          <p className="text-xs text-charcoal/80 mt-1 font-medium">
            {groom.fatherName} & {groom.motherName}
          </p>

          <p className="text-[11px] text-charcoal/65 mt-3 italic max-w-xs leading-relaxed">
            "{groom.bio}"
          </p>

          {groom.instagram && (
            <a
              href={`https://instagram.com/${groom.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 px-4 py-1.5 rounded-full bg-secondary/10 hover:bg-secondary text-secondary hover:text-white text-[11px] font-medium tracking-wider transition-all duration-300 flex items-center gap-1.5"
            >
              <span>📷</span>
              <span>@{groom.instagram}</span>
            </a>
          )}
        </div>

        {/* Ornamen Pembatas Ampersand */}
        <div className="flex items-center justify-center gap-4 my-[-10px]">
          <div className="w-12 h-[1px] bg-accent/40" />
          <span className="font-serif text-3xl text-accent font-light italic">
            &
          </span>
          <div className="w-12 h-[1px] bg-accent/40" />
        </div>

        {/* Profil Mempelai Wanita */}
        <div className="flex flex-col items-center glass-card p-6 rounded-3xl border border-secondary/15 hover:border-accent/40 transition-all duration-300 shadow-sm">
          <div className="relative mb-5">
            <div className="w-36 h-36 rounded-full p-1 bg-gradient-to-tr from-accent via-secondary/30 to-accent shadow-md">
              <div className="w-full h-full rounded-full overflow-hidden bg-white">
                <img
                  src={bride.photo}
                  alt={bride.fullName}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
            <span className="absolute bottom-1 right-2 w-7 h-7 rounded-full bg-accent text-white text-xs flex items-center justify-center shadow-md">
              ♀
            </span>
          </div>

          <h3 className="font-serif text-2xl text-secondary font-semibold tracking-wide">
            {bride.fullName}
          </h3>
          <span className="text-xs text-accent font-medium mt-1 uppercase tracking-wider">
            {bride.title}
          </span>
          <p className="text-xs text-charcoal/80 mt-1 font-medium">
            {bride.fatherName} & {bride.motherName}
          </p>

          <p className="text-[11px] text-charcoal/65 mt-3 italic max-w-xs leading-relaxed">
            "{bride.bio}"
          </p>

          {bride.instagram && (
            <a
              href={`https://instagram.com/${bride.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 px-4 py-1.5 rounded-full bg-accent/15 hover:bg-accent text-accent-dark hover:text-white text-[11px] font-medium tracking-wider transition-all duration-300 flex items-center gap-1.5"
            >
              <span>📷</span>
              <span>@{bride.instagram}</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
