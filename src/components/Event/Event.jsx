import React from "react";
import { weddingData } from "../../data/weddingData";
import Countdown from "./Countdown";

export default function Event() {
  const { akad, resepsi } = weddingData.events;

  return (
    <section
      id="event"
      className="py-20 px-6 bg-primary/40 text-center flex flex-col items-center"
    >
      <div className="max-w-2xl w-full">
        {/* Header Section */}
        <span className="text-xs tracking-[0.3em] font-medium text-accent uppercase block mb-2">
          Waktu & Tempat
        </span>
        <h2 className="font-serif text-4xl text-secondary font-medium tracking-wide mb-4">
          Agenda Acara
        </h2>
        <div className="w-12 h-[1px] bg-accent/40 mx-auto mb-10" />

        {/* Pemanggilan Komponen Countdown */}
        <Countdown />

        {/* Grid Pembagian Akad & Resepsi */}
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          {/* Card Akad Nikah */}
          <div className="p-8 glass-card rounded-3xl shadow-sm flex flex-col justify-between items-center text-center">
            <div>
              <div className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center mb-4 mx-auto font-serif italic text-sm font-semibold">
                1
              </div>
              <h3 className="font-serif text-2xl text-secondary font-semibold tracking-wide mb-4">
                {akad.title}
              </h3>
              <p className="text-sm font-semibold tracking-wide text-charcoal/90 mb-1">
                {akad.date}
              </p>
              <p className="text-xs text-charcoal/70 mb-4">{akad.time}</p>

              <div className="w-6 h-[1px] bg-accent/20 mx-auto my-3" />

              <p className="text-sm font-semibold text-secondary/90">
                {akad.venue}
              </p>
              <p className="text-xs text-charcoal/60 mt-1 max-w-xs mx-auto leading-relaxed">
                {akad.address}
              </p>
            </div>

            <a
              href={akad.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block w-full py-2.5 bg-secondary/10 hover:bg-secondary/20 text-secondary font-sans text-xs font-semibold rounded-full tracking-wider transition-colors duration-200"
            >
              LIHAT PETA LOKASI
            </a>
          </div>

          {/* Card Resepsi Pernikahan */}
          <div className="p-8 glass-card rounded-3xl shadow-sm flex flex-col justify-between items-center text-center">
            <div>
              <div className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center mb-4 mx-auto font-serif italic text-sm font-semibold">
                2
              </div>
              <h3 className="font-serif text-2xl text-secondary font-semibold tracking-wide mb-4">
                {resepsi.title}
              </h3>
              <p className="text-sm font-semibold tracking-wide text-charcoal/90 mb-1">
                {resepsi.date}
              </p>
              <p className="text-xs text-charcoal/70 mb-4">{resepsi.time}</p>

              <div className="w-6 h-[1px] bg-accent/20 mx-auto my-3" />

              <p className="text-sm font-semibold text-secondary/90">
                {resepsi.venue}
              </p>
              <p className="text-xs text-charcoal/60 mt-1 max-w-xs mx-auto leading-relaxed">
                {resepsi.address}
              </p>
            </div>

            <a
              href={resepsi.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block w-full py-2.5 bg-secondary text-primary hover:bg-secondary/90 font-sans text-xs font-semibold rounded-full tracking-wider transition-colors duration-200 shadow-sm"
            >
              LIHAT PETA LOKASI
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
