import React from "react";
import { weddingData } from "../../data/weddingData";
import Countdown from "./Countdown";

export default function Event() {
  const { akad, resepsi } = weddingData.events;

  const eventCards = [akad, resepsi];

  return (
    <section
      id="event"
      className="py-20 px-6 bg-primary-dark/40 text-center flex flex-col items-center relative overflow-hidden"
    >
      <div className="max-w-md w-full">
        {/* Header Section */}
        <span className="text-xs tracking-[0.3em] font-medium text-accent uppercase block mb-1">
          Save The Date
        </span>
        <h2 className="font-serif text-3xl md:text-4xl text-secondary font-medium tracking-wide">
          Rangkaian Acara
        </h2>
        <div className="w-12 h-[1px] bg-accent/50 mx-auto mt-3 mb-6" />

        <p className="text-xs text-charcoal/70 max-w-xs mx-auto leading-relaxed mb-6">
          Dengan penuh rasa syukur, kami mengundang Bapak/Ibu/Saudara/i untuk
          hadir dan memberikan doa restu pada:
        </p>

        {/* Countdown Timer */}
        <Countdown />

        {/* Daftar Acara (Akad & Resepsi) */}
        <div className="flex flex-col gap-6 mt-8">
          {eventCards.map((item, idx) => (
            <div
              key={idx}
              className="p-6 md:p-8 glass-card rounded-3xl shadow-sm border border-secondary/15 hover:border-accent/40 transition-all duration-300 text-center flex flex-col items-center"
            >
              {/* Badge Nomor */}
              <div className="w-9 h-9 rounded-full bg-accent/15 text-accent-dark flex items-center justify-center mb-3 font-serif italic text-xs font-bold border border-accent/30">
                {item.number}
              </div>

              <h3 className="font-serif text-2xl text-secondary font-semibold tracking-wide mb-2">
                {item.title}
              </h3>

              <div className="flex items-center gap-2 text-xs font-semibold text-charcoal/90 mb-1">
                <span>🗓️</span>
                <span>
                  {item.dayName}, {item.dateFormatted}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-charcoal/70 mb-4">
                <span>⏰</span>
                <span>{item.time}</span>
              </div>

              <div className="w-12 h-[1px] bg-accent/30 my-2" />

              <p className="text-sm font-semibold text-secondary mt-1">
                {item.venue}
              </p>
              <p className="text-xs text-charcoal/65 mt-1 max-w-xs leading-relaxed">
                {item.address}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col w-full gap-2 mt-6">
                <a
                  href={item.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-secondary text-primary hover:bg-secondary/90 font-medium text-xs rounded-xl tracking-wider transition-all duration-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>📍</span>
                  <span>BUKA GOOGLE MAPS</span>
                </a>

                {item.calendarLink && (
                  <a
                    href={item.calendarLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 bg-secondary/10 hover:bg-secondary/20 text-secondary font-medium text-xs rounded-xl tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>📅</span>
                    <span>SIMPAN KE KALENDER</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
