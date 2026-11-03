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

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [guestName, setGuestName] = useState("Tamu Undangan");
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeLightbox, setActiveLightbox] = useState(null);

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

  // Kunci scroll saat cover opening masih aktif
  useEffect(() => {
    document.body.style.overflow = !isOpen ? "hidden" : "unset";
  }, [isOpen]);

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

              {/* Galeri Prewedding */}
              <section id="gallery" className="py-20 px-6 text-center max-w-md mx-auto">
                <span className="text-xs tracking-[0.3em] font-medium text-accent uppercase block mb-1">
                  Moments
                </span>
                <h2 className="font-serif text-3xl md:text-4xl text-secondary font-medium tracking-wide">
                  Galeri Bahagia
                </h2>
                <div className="w-12 h-[1px] bg-accent/50 mx-auto mt-3 mb-8" />

                {/* Grid Galeri Elegan */}
                <div className="grid grid-cols-2 gap-3">
                  {weddingData.gallery.map((img, idx) => (
                    <div
                      key={idx}
                      className={`relative overflow-hidden rounded-2xl shadow-sm cursor-pointer group ${
                        idx === 0 || idx === 3 ? "col-span-2 aspect-[16/10]" : "aspect-[4/5]"
                      }`}
                      onClick={() => setActiveLightbox(img.url)}
                    >
                      <img
                        src={img.url}
                        alt={img.caption || `Galeri ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 text-left">
                        <span className="text-white text-[11px] font-medium drop-shadow">
                          {img.caption}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Milestone Kado & Pembayaran Online Native */}
              <GiftSection />

              {/* RSVP & Buku Tamu */}
              <section id="rsvp" className="py-20 px-6 max-w-md mx-auto text-center scroll-mt-10">
                <span className="text-xs tracking-[0.3em] font-medium text-accent uppercase block mb-1">
                  Wishes & Greetings
                </span>
                <h2 className="font-serif text-3xl md:text-4xl text-secondary font-medium tracking-wide">
                  RSVP & Doa Restu
                </h2>
                <div className="w-12 h-[1px] bg-accent/50 mx-auto mt-3 mb-8" />

                {/* Form Input RSVP */}
                <form
                  onSubmit={handleRSVPSubmit}
                  className="glass-card p-6 rounded-3xl text-left shadow-sm border border-secondary/20"
                >
                  <div className="mb-4">
                    <label className="text-[11px] font-semibold uppercase text-charcoal/70 tracking-wider block mb-1">
                      Nama Anda
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Masukkan nama lengkap Anda"
                      className="w-full px-4 py-2.5 bg-white/80 border border-secondary/25 rounded-xl focus:outline-none focus:border-secondary text-sm text-charcoal"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="text-[11px] font-semibold uppercase text-charcoal/70 tracking-wider block mb-1">
                      Konfirmasi Kehadiran
                    </label>
                    <select
                      className="w-full px-4 py-2.5 bg-white/80 border border-secondary/25 rounded-xl focus:outline-none focus:border-secondary text-sm text-charcoal"
                      value={form.attendance}
                      onChange={(e) => setForm({ ...form, attendance: e.target.value })}
                    >
                      <option value="Hadir">🎉 Insya Allah Hadir</option>
                      <option value="Tidak Hadir">🙏 Mohon Maaf Belum Bisa Hadir</option>
                      <option value="Masih Ragu">⏳ Masih Ragu / Belum Pasti</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="text-[11px] font-semibold uppercase text-charcoal/70 tracking-wider block mb-1">
                      Ucapan & Doa Restu
                    </label>
                    <textarea
                      rows="4"
                      required
                      placeholder="Tuliskan ucapan dan doa terbaik untuk kedua mempelai..."
                      className="w-full px-4 py-2.5 bg-white/80 border border-secondary/25 rounded-xl focus:outline-none focus:border-secondary text-sm text-charcoal resize-none leading-relaxed"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingRSVP}
                    className="w-full py-3.5 bg-secondary text-primary font-semibold rounded-xl text-xs tracking-wider uppercase shadow-md hover:bg-secondary/90 cursor-pointer active:scale-98 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submittingRSVP ? (
                      <span>MENGIRIMKAN DOA...</span>
                    ) : (
                      <span>KIRIM UCAPAN DOA RESTU 💌</span>
                    )}
                  </button>
                </form>

                {/* List Ucapan Tamu */}
                <div className="mt-8 max-h-96 overflow-y-auto text-left flex flex-col gap-3 pr-1">
                  {comments.map((c, i) => (
                    <div
                      key={i}
                      className="p-4 bg-white/70 border border-secondary/15 rounded-2xl text-sm shadow-xs"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-semibold text-secondary text-xs">
                          {c.name}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            c.attendance === "Hadir"
                              ? "bg-secondary/10 text-secondary border border-secondary/20"
                              : "bg-accent/15 text-accent-dark border border-accent/25"
                          }`}
                        >
                          {c.attendance}
                        </span>
                      </div>
                      <p className="text-charcoal/80 leading-relaxed text-xs">
                        "{c.message}"
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Footer Penutup */}
              <footer className="py-16 bg-primary-dark/60 text-center text-xs text-charcoal/70 border-t border-accent/20 px-6">
                <div className="w-10 h-10 rounded-full border border-accent/40 flex items-center justify-center text-accent text-xs mx-auto mb-3 font-serif">
                  R&H
                </div>
                <h3 className="font-serif text-2xl text-secondary font-semibold mb-2">
                  {weddingData.couple.groom.shortName} & {weddingData.couple.bride.shortName}
                </h3>
                <p className="text-[11px] text-charcoal/60 max-w-xs mx-auto leading-relaxed mb-6 italic">
                  Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i
                  berkenan hadir dan memberikan doa restu.
                </p>
                <div className="w-12 h-[1px] bg-accent/40 mx-auto mb-4" />
                <p className="text-[10px] text-charcoal/40 font-mono tracking-wider">
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

            {/* 5. Lightbox Modal Gallery Zoom */}
            {activeLightbox && (
              <div
                className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
                onClick={() => setActiveLightbox(null)}
              >
                <img
                  src={activeLightbox}
                  alt="Full Zoom"
                  className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain border border-white/20"
                />
                <button
                  onClick={() => setActiveLightbox(null)}
                  className="absolute top-5 right-5 text-white/80 hover:text-white text-3xl font-light w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
