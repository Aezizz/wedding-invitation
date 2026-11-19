import React from "react";
import { weddingData } from "../../data/weddingData";

export default function BrideGroom() {
  const { groom, bride } = weddingData.couple;

  return (
    <>
      {/* =====================================================
          SECTION 1: Ayat Suci Al-Qur'an — Full Screen
          bg1.webp as background, 1 screen height, persis Figma
      ====================================================== */}
      <section
        className="min-h-screen w-full relative flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/bg1.webp')" }}
      >
        {/* Bingkai Parchment — hampir penuh layar, margin kecil di samping
            Diletakkan di DALAM section tanpa overflow-hidden agar bunga bisa keluar */}
        <div
          className="relative z-10"
          style={{ width: "100%", maxWidth: "450px" }}
        >
          {/* Layer 1: Bingkai — w-full h-auto mempertahankan rasio asli 9:16 */}
          <img
            src="/images/Bingkai_1.webp"
            alt="Bingkai Ayat Suci"
            className="w-full h-auto block relative z-10 drop-shadow-2xl"
            draggable="false"
          />

          {/* Layer 2: Teks overlay — absolute di dalam bingkai container */}
          <div
            className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center"
            style={{ padding: "10% 20% 20%" }}
          >
            {/* Teks Arab */}
            <p
              className="font-serif text-[#241c14] font-semibold leading-[1.30] mb-3 w-full"
              style={{ fontSize: "26px", direction: "rtl" }}
            >
              وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا
              لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً
            </p>

            {/* Pemisah */}
            <div className="w-14 h-[1px] bg-[#c49d48]/50 my-3" />

            {/* Terjemahan */}
            <p
              className="font-serif text-[#3a2e22] leading-relaxed mb-5 w-full"
              style={{ fontSize: "15px" }}
            >
              Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan
              pasangan-pasangan untukmu dari jenismu sendiri, agar kamu
              cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di
              antaramu rasa kasih dan sayang.
            </p>

            {/* Sumber */}
            <p
              className="font-serif font-semibold text-[#241c14] tracking-wider"
              style={{ fontSize: "clamp(11px, 3vw, 14px)" }}
            >
              QS. Ar-Rum: 21
            </p>
          </div>
        </div>

        {/* Bunga Kanan Atas — LANGSUNG di section (bukan di dalam bingkai div)
            agar tidak ter-clip. Posisi absolute relatif terhadap section.
            Aksesoris_5 canvas: flower di bottom-left (x:0-36%, y:53-100%)
            Setelah rotate-180: flower ada di TOP-RIGHT canvas */}
        <img
          src="/images/Aksesoris_5.webp"
          alt="Bunga Kanan Atas"
          className="absolute z-30 rotate-180 pointer-events-none select-none"
          draggable="false"
          style={{
            width: "80%",
            right: "0.5%",
            top: "-3%",
          }}
        />

        {/* Bunga Kiri Bawah — LANGSUNG di section.
            Aksesoris_5 canvas: flower di bottom-left (x:0-36%, y:53-100%)
            Posisi normal: flower ada di BOTTOM-LEFT canvas → pas di kiri bawah */}
        <img
          src="/images/Aksesoris_5.webp"
          alt="Bunga Kiri Bawah"
          className="absolute z-30 pointer-events-none select-none"
          draggable="false"
          style={{
            width: "80%",
            left: "0.5%",
            bottom: "1%",
          }}
        />
      </section>

      {/* =====================================================
          SECTION 2: Profil Mempelai Pria (ROTATED / FLIPPED - bg1-flipped.webp)
          Pas 1 Layar HP (min-h-screen) sehingga background tajam & rasio 9:16 asli
      ====================================================== */}
      <section
        id="bride-groom"
        className="min-h-screen w-full py-16 px-6 text-center flex flex-col items-center justify-center relative overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/bg1-flipped.webp')" }}
      >
        <div className="max-w-md w-full flex flex-col items-center">
          {/* Section Heading */}
          <div className="mb-6">
            <span className="text-xs tracking-[0.3em] font-medium text-accent uppercase block mb-1">
              The Groom
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-accent-light font-medium tracking-wide drop-shadow-sm">
              Mempelai Pria
            </h2>
            <div className="w-12 h-[1px] bg-accent/50 mx-auto mt-2" />
          </div>

          {/* Card Profil Mempelai Pria */}
          <div className="flex flex-col items-center glass-card p-6 rounded-3xl border border-secondary/15 hover:border-accent/40 transition-all duration-300 shadow-md w-full max-w-xs">
            <div className="relative mb-4">
              <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-accent via-secondary/30 to-accent shadow-md">
                <div className="w-full h-full rounded-full overflow-hidden bg-white">
                  <img
                    src={groom.photo}
                    alt={groom.fullName}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
              <span className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-secondary text-white text-xs flex items-center justify-center shadow-md">
                ♂
              </span>
            </div>

            <h3 className="font-serif text-2xl text-secondary font-semibold tracking-wide">
              {groom.fullName}
            </h3>
            <span className="text-xs text-accent font-medium mt-0.5 uppercase tracking-wider">
              {groom.title}
            </span>
            <p className="text-xs text-charcoal/80 mt-1 font-medium">
              Putra dari {groom.fatherName} & {groom.motherName}
            </p>
            <p className="text-[11px] text-charcoal/65 mt-2 italic max-w-xs leading-relaxed">
              "{groom.bio}"
            </p>
            {groom.instagram && (
              <a
                href={`https://instagram.com/${groom.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3.5 px-4 py-1.5 rounded-full bg-secondary/10 hover:bg-secondary text-secondary hover:text-white text-[11px] font-medium tracking-wider transition-all duration-300 flex items-center gap-1.5"
              >
                <span>📷</span>
                <span>@{groom.instagram}</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          SECTION 3: Profil Mempelai Wanita (NORMAL - bg1.webp)
          Pas 1 Layar HP (min-h-screen) sehingga background tajam & rasio 9:16 asli
      ====================================================== */}
      <section
        className="min-h-screen w-full py-16 px-6 text-center flex flex-col items-center justify-center relative overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/bg1.webp')" }}
      >
        <div className="max-w-md w-full flex flex-col items-center">
          {/* Section Heading */}
          <div className="mb-6">
            <span className="text-xs tracking-[0.3em] font-medium text-accent uppercase block mb-1">
              The Bride
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-secondary font-medium tracking-wide">
              Mempelai Wanita
            </h2>
            <div className="w-12 h-[1px] bg-accent/50 mx-auto mt-2" />
          </div>

          {/* Card Profil Mempelai Wanita */}
          <div className="flex flex-col items-center glass-card p-6 rounded-3xl border border-secondary/15 hover:border-accent/40 transition-all duration-300 shadow-md w-full max-w-xs">
            <div className="relative mb-4">
              <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-accent via-secondary/30 to-accent shadow-md">
                <div className="w-full h-full rounded-full overflow-hidden bg-white">
                  <img
                    src={bride.photo}
                    alt={bride.fullName}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
              <span className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-accent text-white text-xs flex items-center justify-center shadow-md">
                ♀
              </span>
            </div>

            <h3 className="font-serif text-2xl text-secondary font-semibold tracking-wide">
              {bride.fullName}
            </h3>
            <span className="text-xs text-accent font-medium mt-0.5 uppercase tracking-wider">
              {bride.title}
            </span>
            <p className="text-xs text-charcoal/80 mt-1 font-medium">
              Putri dari {bride.fatherName} & {bride.motherName}
            </p>
            <p className="text-[11px] text-charcoal/65 mt-2 italic max-w-xs leading-relaxed">
              "{bride.bio}"
            </p>
            {bride.instagram && (
              <a
                href={`https://instagram.com/${bride.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3.5 px-4 py-1.5 rounded-full bg-accent/15 hover:bg-accent text-accent-dark hover:text-white text-[11px] font-medium tracking-wider transition-all duration-300 flex items-center gap-1.5"
              >
                <span>📷</span>
                <span>@{bride.instagram}</span>
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
