import React, { useState } from "react";
import { weddingData } from "../../data/weddingData";
import Countdown from "./Countdown";

export default function Event() {
  const { akad, resepsi } = weddingData.events;
  const [activeTab, setActiveTab] = useState(0);

  const eventCards = [akad, resepsi];
  const currentEvent = eventCards[activeTab];

  // Bagian 4: Rangkaian Acara (ROTATE / FLIPPED - bg1-flipped.webp)
  // Dibuat pas 1 layar (min-h-screen) dengan Tab Switcher modern agar background tidak ter-zoom/pecah
  return (
    <section
      id="event"
      className="min-h-screen w-full py-16 px-6 text-center flex flex-col items-center justify-center relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/bg1-flipped.webp')" }}
    >
      <div className="max-w-md w-full flex flex-col items-center">
        {/* Header Section */}
        <span className="text-xs tracking-[0.3em] font-medium text-accent uppercase block mb-1">
          Save The Date
        </span>
        <h2 className="font-serif text-3xl md:text-4xl text-accent-light font-medium tracking-wide drop-shadow-sm">
          Rangkaian Acara
        </h2>
        <div className="w-12 h-[1px] bg-accent/50 mx-auto mt-2 mb-4" />

        {/* Countdown Timer */}
        <div className="w-full mb-5">
          <Countdown />
        </div>

        {/* Tab Switcher: Akad vs Resepsi */}
        <div className="flex gap-2 p-1.5 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 mb-4 w-full max-w-xs shadow-sm">
          {eventCards.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === idx
                  ? "bg-secondary text-primary shadow-md scale-102"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              {idx === 0 ? "💍 AKAD NIKAH" : "🥂 RESEPSI"}
            </button>
          ))}
        </div>

        {/* Card Acara Aktif */}
        <div className="w-full max-w-xs p-5 md:p-6 glass-card rounded-3xl shadow-lg border border-secondary/15 transition-all duration-300 text-center flex flex-col items-center animate-fade-in">
          <div className="w-8 h-8 rounded-full bg-accent/20 text-accent-dark flex items-center justify-center mb-2 font-serif italic text-xs font-bold border border-accent/30">
            {currentEvent.number}
          </div>

          <h3 className="font-serif text-xl font-semibold text-secondary tracking-wide mb-2">
            {currentEvent.title}
          </h3>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-charcoal/90 mb-1">
            <span>🗓️</span>
            <span>
              {currentEvent.dayName}, {currentEvent.dateFormatted}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-charcoal/70 mb-3">
            <span>⏰</span>
            <span>{currentEvent.time}</span>
          </div>

          <div className="w-10 h-[1px] bg-accent/30 my-1.5" />

          <p className="text-xs font-semibold text-secondary mt-1">
            {currentEvent.venue}
          </p>
          <p className="text-[11px] text-charcoal/65 mt-1 max-w-xs leading-relaxed line-clamp-2">
            {currentEvent.address}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col w-full gap-2 mt-4">
            <a
              href={currentEvent.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-secondary text-primary hover:bg-secondary/90 font-medium text-xs rounded-xl tracking-wider transition-all duration-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>📍</span>
              <span>BUKA GOOGLE MAPS</span>
            </a>

            {currentEvent.calendarLink && (
              <a
                href={currentEvent.calendarLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-1.5 bg-secondary/10 hover:bg-secondary/20 text-secondary font-medium text-[11px] rounded-xl tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>📅</span>
                <span>SIMPAN KE KALENDER</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
