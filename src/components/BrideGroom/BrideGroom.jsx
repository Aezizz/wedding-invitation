import React from "react";
import { weddingData } from "../../data/weddingData";

export default function BrideGroom() {
  const { groom, bride } = weddingData.couple;
  const { quote } = weddingData;

  return (
    <section
      id="bride-groom"
      className="py-20 px-6 text-center flex flex-col items-center relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/images/bg1.webp')" }}
    >
      <div className="max-w-md w-full flex flex-col gap-12">
        {/* Ayat Suci & Kutipan Pembuka (Bingkai Emas & Ornamen Bunga Sesuai Desain) */}
        <div className="relative w-full max-w-[360px] sm:max-w-[380px] aspect-[9/16] mx-auto flex items-center justify-center my-2">
          {/* 1. Bingkai Parchment Kuno */}
          <img
            src="/images/Bingkai_1.webp"
            alt="Bingkai Ayat Suci"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[520px] object-fill pointer-events-none drop-shadow-xl"
          />

          {/* 2. Ornamen Bunga Kanan Atas */}
          <img
            src="/images/Aksesoris_5.webp"
            alt="Bunga Kanan Atas"
            className="absolute -top-6 -right-6 w-400 sm:w-56 h-auto object-contain pointer-events-none z-20 rotate-180 drop-shadow-md"
          />

          {/* 3. Ornamen Bunga Kiri Bawah */}
          <img
            src="/images/Aksesoris_5.webp"
            alt="Bunga Kiri Bawah"
            className="absolute -bottom-6 -left-6 w-400px sm:w-56 h-auto object-contain pointer-events-none z-20 drop-shadow-md"
          />

          {/* 4. Konten Teks Ayat Suci */}
          <div className="relative z-10 w-full h-full flex flex-col justify-center items-center px-10 py-16 sm:py-20 text-center">
            {/* Teks Bahasa Arab (Diformat per baris agar tidak menabrak bunga kanan atas) */}
            <div className="font-serif text-[20px] sm:text-[14.5px] text-[#241c14] font-semibold leading-[2] mb-3 sm:mb-4 max-w-[205px]">
              <span className="block">
                وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ
              </span>
              <span className="block">
                أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا
              </span>
              <span className="block">
                وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً
              </span>
            </div>

            {/* Terjemahan Bahasa Indonesia */}
            <p className="font-serif text-[10px] sm:text-[11px] text-[#3a2e22] leading-[1.65] mb-3 sm:mb-4 max-w-[195px]">
              Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan
              pasangan-pasangan untukmu dari jenismu sendiri, agar kamu
              cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di
              antaramu rasa kasih dan sayang.
            </p>

            {/* Sumber Ayat */}
            <span className="font-serif text-xs sm:text-sm font-bold text-[#241c14] tracking-wider">
              QS. Ar-Rum: 21
            </span>
          </div>
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
