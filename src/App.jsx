import { useState, useEffect, useRef } from "react";
import OpeningModal from "./components/OpeningModal/OpeningModal";
import Hero from "./components/Hero/Hero";
import BrideGroom from "./components/BrideGroom/BrideGroom";
import Event from "./components/Event/Event";
import Story from "./components/Story/Story";
import GiftSection from "./components/GiftSection";
import useScrollSpy from "./hooks/useScrollSpy";
import { submitRSVP, getRSVPs } from "./utils/api";
import { weddingData } from "./data/weddingData";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cards";

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [guestName, setGuestName] = useState("Tamu Undangan");
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeLightbox, setActiveLightbox] = useState(null);
  const [rsvpTab, setRsvpTab] = useState("form");

  // Form States untuk RSVP
  const [form, setForm] = useState({
    name: "",
    attendance: "Hadir",
    message: "",
  });
  const [submittingRSVP, setSubmittingRSVP] = useState(false);
  const [comments, setComments] = useState([
    {
      name: "Atmam Aziez",
      attendance: "Hadir",
      message: "Selamat ya Resky & Hana! Semoga sakinah mawaddah warahmah.",
      created_at: new Date().toISOString(),
    },
    {
      name: "Budi & Keluarga",
      attendance: "Hadir",
      message: "Barakallahu lakuma wa baraka alaikuma wa jama'a bainakuma fii khair. Lancar sampai hari H!",
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
  ]);

  const audioRef = useRef(null);
  const activeSection = useScrollSpy([
    "home",
    "bride-groom",
    "event",
    "gallery",
    "hadiah",
    "rsvp",
  ]);

  // Baca Nama Tamu dari parameter URL (?to=NamaTamu)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const to = urlParams.get("to");
      if (to) {
        setGuestName(to);
        setForm((prev) => ({ ...prev, name: to }));
      }
    }
  }, []);

  // Fetch komentar RSVP dari database saat halaman dibuka
  useEffect(() => {
    async function loadRSVPs() {
      const data = await getRSVPs();
      if (data && data.length > 0) {
        setComments(data);
      }
    }
    loadRSVPs();
  }, []);

  // Kunci scroll saat cover opening masih aktif ATAU saat lightbox foto terbuka
  useEffect(() => {
    document.body.style.overflow = !isOpen || Boolean(activeLightbox) ? "hidden" : "unset";
  }, [isOpen, activeLightbox]);

  // Buka Undangan & Putar Musik
  const handleOpenInvitation = () => {
    setIsOpen(true);
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn("Autoplay audio dicegah oleh browser:", err);
          setIsPlaying(false);
        });
    }
  };

  // Toggle Musik On / Off
  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true));
    }
  };

  // Submit RSVP & Ucapan
  const handleRSVPSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) {
      return alert("Mohon lengkapi nama dan ucapan Anda!");
    }

    setSubmittingRSVP(true);
    const result = await submitRSVP(form);
    const newEntry = {
      name: form.name.trim(),
      attendance: form.attendance,
      message: form.message.trim(),
      created_at: new Date().toISOString(),
    };

    setComments([newEntry, ...comments]);
    setForm({ name: guestName !== "Tamu Undangan" ? guestName : "", attendance: "Hadir", message: "" });
    setSubmittingRSVP(false);
    setRsvpTab("comments");
    alert(result?.message || "Terima kasih atas doa dan konfirmasi kehadiran Anda!");
  };

  const navItems = [
    { id: "home", label: "Awal", icon: "🏛️" },
    { id: "bride-groom", label: "Mempelai", icon: "💍" },
    { id: "event", label: "Acara", icon: "📅" },
    { id: "gallery", label: "Galeri", icon: "📸" },
    { id: "hadiah", label: "Kado", icon: "🎁" },
    { id: "rsvp", label: "RSVP", icon: "💌" },
  ];

  return (
    <>
      <div className="relative min-h-screen bg-primary select-none w-full flex justify-center">
      <div className="w-full max-w-[440px] shadow-2xl min-h-screen bg-primary relative">
        {/* Audio Element Background */}
        <audio ref={audioRef} loop src={weddingData.media.musicUrl} preload="auto" />

        {/* 1. Cover Screen Opening */}
        {!isOpen && (
          <OpeningModal guestName={guestName} onOpen={handleOpenInvitation} />
        )}

        {/* 2. Main Invitation Content */}
        {isOpen && (
          <div className="animate-fade-in-up pb-24">
            <main className="w-full">
              {/* Hero Banner */}
              <Hero />

              {/* Mempelai */}
              <BrideGroom />

              {/* Rangkaian Acara & Countdown */}
              <Event />

              {/* Kisah Cinta (Story) */}
              <Story />

              {/* Bagian 6: Galeri Prewedding (ROTATE / FLIPPED - bg1-flipped.webp) */}
              {/* Swipeable Card Stack (Card Deck) Interaction via Swiper */}
              <section
                id="gallery"
                className="min-h-screen w-full py-12 px-4 text-center flex flex-col items-center justify-center relative overflow-hidden bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/images/bg1-flipped.webp')" }}
              >
                <div className="w-full max-w-md flex flex-col items-center">
                  <span className="text-xs tracking-[0.3em] font-medium text-accent uppercase block mb-1">
                    Moments
                  </span>
                  <h2 className="font-serif text-3xl md:text-4xl text-accent-light font-medium tracking-wide drop-shadow-sm">
                    Galeri Bahagia
                  </h2>
                  <div className="w-12 h-[1px] bg-accent/50 mx-auto mt-2 mb-2" />

                  {/* Swiper Card Stack Container */}
                  <div className="w-[270px] sm:w-[310px] aspect-[3/4] mx-auto py-8">
                    <Swiper
                      effect="cards"
                      grabCursor={true}
                      modules={[EffectCards]}
                      className="w-full h-full"
                    >
                      {weddingData.gallery.map((item, idx) => {
                        // Jika tipe kartu Duo Landscape (2 foto atas-bawah dalam 1 kartu)
                        if (item.type === "duo" && item.photos?.length >= 2) {
                          const topPhoto = item.photos[0];
                          const botPhoto = item.photos[1];
                          return (
                            <SwiperSlide
                              key={idx}
                              className="rounded-2xl border border-[#D4A359]/40 shadow-xl overflow-hidden relative bg-charcoal/20 flex flex-col"
                            >
                              {/* Foto Landscape Atas */}
                              <div
                                className="relative w-full h-1/2 overflow-hidden cursor-pointer group/top border-b border-[#D4A359]/30"
                                onClick={() => setActiveLightbox(topPhoto.url)}
                              >
                                <img
                                  src={topPhoto.url}
                                  alt={topPhoto.caption}
                                  className="w-full h-full object-cover select-none group-hover/top:scale-105 transition-transform duration-500"
                                  loading="lazy"
                                />
                                {topPhoto.caption && (
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex items-end p-2.5 text-left pointer-events-none">
                                    <span className="text-white text-[11px] font-serif font-medium drop-shadow-md tracking-wide">
                                      {topPhoto.caption}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Foto Landscape Bawah */}
                              <div
                                className="relative w-full h-1/2 overflow-hidden cursor-pointer group/bot"
                                onClick={() => setActiveLightbox(botPhoto.url)}
                              >
                                <img
                                  src={botPhoto.url}
                                  alt={botPhoto.caption}
                                  className="w-full h-full object-cover select-none group-hover/bot:scale-105 transition-transform duration-500"
                                  loading="lazy"
                                />
                                {botPhoto.caption && (
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex items-end p-2.5 text-left pointer-events-none">
                                    <span className="text-white text-[11px] font-serif font-medium drop-shadow-md tracking-wide">
                                      {botPhoto.caption}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </SwiperSlide>
                          );
                        }

                        // Kartu Foto Single Portrait Normal
                        return (
                          <SwiperSlide
                            key={idx}
                            className="rounded-2xl border border-[#D4A359]/40 shadow-xl overflow-hidden cursor-pointer relative group bg-charcoal/20"
                            onClick={() => setActiveLightbox(item.url)}
                          >
                            <img
                              src={item.url}
                              alt={item.caption || `Galeri ${idx + 1}`}
                              className="w-full h-full object-cover select-none pointer-events-none group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                            {item.caption && (
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-4 text-left pointer-events-none">
                                <span className="text-white text-xs font-serif font-medium drop-shadow-md tracking-wide">
                                  {item.caption}
                                </span>
                              </div>
                            )}
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>
                  </div>

                  {/* Subtle Swipe Hint */}
                  <p className="text-[11px] text-white/70 mt-2 italic flex items-center justify-center gap-1.5">
                    <span>Geser kartu untuk melihat foto lainnya</span>
                  </p>
                </div>
              </section>

              {/* Milestone Kado & Pembayaran Online Native */}
              <GiftSection />

              {/* Bagian 8: RSVP & Buku Tamu (ROTATE / FLIPPED - bg1-flipped.webp) */}
              {/* Pas 1 layar (min-h-screen) dengan Tab Switcher agar background tidak ter-zoom/pecah */}
              <section
                id="rsvp"
                className="min-h-screen w-full py-16 px-6 text-center flex flex-col items-center justify-center relative overflow-hidden bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/images/bg1-flipped.webp')" }}
              >
                <div className="max-w-md w-full flex flex-col items-center">
                  <span className="text-xs tracking-[0.3em] font-medium text-accent uppercase block mb-1">
                    Wishes & Greetings
                  </span>
                  <h2 className="font-serif text-3xl md:text-4xl text-accent-light font-medium tracking-wide drop-shadow-sm">
                    RSVP & Doa Restu
                  </h2>
                  <div className="w-12 h-[1px] bg-accent/50 mx-auto mt-2 mb-4" />

                  {/* Tab Switcher: Form vs Komentar Tamu */}
                  <div className="flex gap-2 p-1.5 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 mb-4 w-full max-w-xs shadow-sm">
                    <button
                      type="button"
                      onClick={() => setRsvpTab("form")}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer ${
                        rsvpTab === "form"
                          ? "bg-secondary text-primary shadow-md"
                          : "text-white/80 hover:text-white"
                      }`}
                    >
                      ✍️ Kirim Ucapan
                    </button>
                    <button
                      type="button"
                      onClick={() => setRsvpTab("comments")}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer ${
                        rsvpTab === "comments"
                          ? "bg-secondary text-primary shadow-md"
                          : "text-white/80 hover:text-white"
                      }`}
                    >
                      💌 Doa Tamu ({comments.length})
                    </button>
                  </div>

                  {/* Tab 1: Form Input RSVP */}
                  {rsvpTab === "form" && (
                    <form
                      onSubmit={handleRSVPSubmit}
                      className="glass-card p-5 rounded-3xl text-left shadow-lg border border-secondary/20 w-full max-w-xs animate-fade-in"
                    >
                      <div className="mb-3">
                        <label className="text-[10px] font-semibold uppercase text-charcoal/70 tracking-wider block mb-1">
                          Nama Anda
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Nama lengkap Anda"
                          className="w-full px-3.5 py-2 bg-white/80 border border-secondary/25 rounded-xl focus:outline-none focus:border-secondary text-xs text-charcoal"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="text-[10px] font-semibold uppercase text-charcoal/70 tracking-wider block mb-1">
                          Konfirmasi Kehadiran
                        </label>
                        <select
                          className="w-full px-3.5 py-2 bg-white/80 border border-secondary/25 rounded-xl focus:outline-none focus:border-secondary text-xs text-charcoal"
                          value={form.attendance}
                          onChange={(e) => setForm({ ...form, attendance: e.target.value })}
                        >
                          <option value="Hadir">🎉 Insya Allah Hadir</option>
                          <option value="Tidak Hadir">🙏 Mohon Maaf Belum Bisa</option>
                          <option value="Masih Ragu">⏳ Belum Pasti</option>
                        </select>
                      </div>

                      <div className="mb-3.5">
                        <label className="text-[10px] font-semibold uppercase text-charcoal/70 tracking-wider block mb-1">
                          Ucapan & Doa Restu
                        </label>
                        <textarea
                          rows="3"
                          required
                          placeholder="Tuliskan ucapan dan doa terbaik..."
                          className="w-full px-3.5 py-2 bg-white/80 border border-secondary/25 rounded-xl focus:outline-none focus:border-secondary text-xs text-charcoal resize-none leading-relaxed"
                          value={form.message}
                          onChange={(e) => setForm({ ...form, message: e.target.value })}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submittingRSVP}
                        className="w-full py-2.5 bg-secondary text-primary font-semibold rounded-xl text-xs tracking-wider uppercase shadow-md hover:bg-secondary/90 cursor-pointer active:scale-98 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                      >
                        {submittingRSVP ? "MENGIRIMKAN..." : "KIRIM UCAPAN DOA 💌"}
                      </button>
                    </form>
                  )}

                  {/* Tab 2: List Doa Tamu Undangan */}
                  {rsvpTab === "comments" && (
                    <div className="w-full max-w-xs max-h-[300px] overflow-y-auto text-left flex flex-col gap-2.5 pr-1 animate-fade-in">
                      {comments.map((c, i) => (
                        <div
                          key={i}
                          className="p-3.5 bg-white/80 backdrop-blur-sm border border-secondary/15 rounded-2xl text-xs shadow-xs"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-secondary text-xs">
                              {c.name}
                            </span>
                            <span
                              className={`text-[8px] font-bold px-2 py-0.5 rounded-full ${
                                c.attendance === "Hadir"
                                ? "bg-secondary/10 text-secondary border border-secondary/20"
                                : "bg-accent/15 text-accent-dark border border-accent/25"
                              }`}
                            >
                              {c.attendance}
                            </span>
                          </div>
                          <p className="text-charcoal/80 leading-relaxed text-[11px]">
                            "{c.message}"
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              {/* Bagian 9: Footer Penutup (NORMAL - bg1.webp) */}
              <footer
                className="py-16 text-center text-xs text-charcoal/80 px-6 relative overflow-hidden bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/images/bg1.webp')" }}
              >
                <div className="w-10 h-10 rounded-full border border-accent/40 flex items-center justify-center text-accent text-xs mx-auto mb-3 font-serif">
                  R&H
                </div>
                <h3 className="font-serif text-2xl text-secondary font-semibold mb-2">
                  {weddingData.couple.groom.shortName} & {weddingData.couple.bride.shortName}
                </h3>
                <p className="text-[11px] text-charcoal/75 max-w-xs mx-auto leading-relaxed mb-6 italic">
                  Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i
                  berkenan hadir dan memberikan doa restu.
                </p>
                <div className="w-12 h-[1px] bg-accent/40 mx-auto mb-4" />
                <p className="text-[10px] text-charcoal/50 font-mono tracking-wider">
                  © 2026 {weddingData.couple.groom.shortName} & {weddingData.couple.bride.shortName} Wedding Invitation
                </p>
              </footer>
            </main>

            {/* 3. Floating Bottom Navigation Bar */}
            <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 glass-card px-4 py-2.5 rounded-full flex gap-4 sm:gap-5 shadow-xl backdrop-blur-md border border-accent/30 max-w-[390px] w-[90%] justify-around">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`flex flex-col items-center transition-all duration-300 ${
                      isActive ? "text-secondary scale-110 font-bold" : "text-charcoal/45 hover:text-charcoal"
                    }`}
                  >
                    <span className="text-sm">{item.icon}</span>
                    <span className="text-[9px] uppercase tracking-wider mt-0.5">
                      {item.label}
                    </span>
                  </a>
                );
              })}
            </nav>

            {/* 4. Floating Music Player (Spinning Disc) */}
            <button
              onClick={toggleAudio}
              className={`fixed top-5 right-5 z-40 w-11 h-11 rounded-full glass-card flex items-center justify-center shadow-lg border border-accent/40 cursor-pointer active:scale-90 transition-transform ${
                isPlaying ? "animate-spin-slow text-accent" : "text-charcoal/40"
              }`}
              title={isPlaying ? "Jeda Musik" : "Putar Musik"}
            >
              <div className="w-8 h-8 rounded-full bg-secondary/15 flex items-center justify-center text-sm">
                {isPlaying ? "🎵" : "🔇"}
              </div>
            </button>
          </div>
        )}
      </div>
    </div>

    {/* 5. Lightbox Modal Gallery Zoom - Backdrop transparan tembus pandang dengan animasi smooth zoom */}
    {activeLightbox && (
      <div
        className="fixed inset-0 z-50 bg-black/45 backdrop-blur-md flex items-center justify-center p-4 animate-lightbox-backdrop select-none"
        onClick={() => setActiveLightbox(null)}
      >
        <div
          className="relative max-w-full max-h-[85vh] flex items-center justify-center animate-lightbox-image"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={activeLightbox}
            alt="Full Zoom"
            className="max-w-full max-h-[85vh] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] object-contain border border-white/25"
          />
          <button
            onClick={() => setActiveLightbox(null)}
            className="absolute -top-3 -right-3 sm:top-3 sm:right-3 text-white/90 hover:text-white text-xl font-light w-9 h-9 rounded-full bg-black/50 hover:bg-black/75 backdrop-blur-md border border-white/30 flex items-center justify-center cursor-pointer shadow-lg transition-transform active:scale-95"
            title="Tutup"
          >
            ✕
          </button>
        </div>
      </div>
    )}
  </>
  );
}
