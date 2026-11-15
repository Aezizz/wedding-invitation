import React, { useRef, useEffect } from "react";
import { weddingData } from "../../data/weddingData";

export default function Hero() {
  const videoRef = useRef(null);

  // Batas waktu: putar intro 0 - 8 detik, potong akhir video, lalu loop di detik 6.0 - 8.0
  const LOOP_START = 5.0;
  const LOOP_END = 8.0;

  useEffect(() => {
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Autoplay video background dicegah oleh browser:", err);
        });
      }
    }
  }, []);

  const handleTimeUpdate = (e) => {
    const video = e.target;
    // Begitu menyentuh detik ke-8, langsung potong dan lompat ke detik ke-6
    if (video.currentTime >= LOOP_END) {
      video.currentTime = LOOP_START;
      if (video.paused) {
        video.play().catch(() => {});
      }
    }
  };

  return (
    <section
      id="home"
      className="min-h-screen relative w-full flex flex-col items-center justify-end overflow-hidden"
    >
      {/* 
        Video Background Utama:
        - Detik 0 s/d 8 diputar sebagai intro.
        - Detik 8 s/d 10 otomatis terpotong (tidak akan pernah dimainkan).
        - Setelah detik ke-8, video otomatis melompat ke detik 6 dan loop di rentang 6 - 8 detik.
      */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        poster={weddingData.media.heroVideoPoster || "/video-poster.webp"}
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source
          src={weddingData.media.heroVideo || "/videos/hero.mp4"}
          type="video/mp4"
        />
        Browser Anda tidak mendukung pemutaran video.
      </video>

      {/* Indikator Scroll Minimalis */}
      <div className="relative z-10 pb-8 flex flex-col items-center pointer-events-none">
        <div className="w-5 h-9 rounded-full border border-white/50 flex items-start justify-center p-1 bg-black/25 backdrop-blur-xs shadow-md">
          <div className="w-1 h-2 bg-accent rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
