import { useState, useEffect, useRef } from "react";
import EnvelopeOpening from "./components/OpeningModal/EnvelopeOpening";
import OpeningModal from "./components/OpeningModal/OpeningModal";
import Hero from "./components/Hero/Hero";
import GiftSection from "./components/GiftSection";
import BrideGroom from "./components/BrideGroom/BrideGroom";
import Event from "./components/Event/Event";
import useScrollSpy from "./hooks/useScrollSpy";
import { submitRSVP } from "./utils/api";

export default function App() {
  const [step, setStep] = useState("envelope"); // "envelope" | "modal" | "open"
  const [guestName] = useState(() => {
    if (typeof window === "undefined") return "Tamu Undangan";
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("to") || "Tamu Undangan";
  });
  const [isMuted, setIsMuted] = useState(false);
  const [activeLightbox, setActiveLightbox] = useState(null);

  // Form States
  const [form, setForm] = useState({
    name: "",
    attendance: "Hadir",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([
    {
      name: "Atmam Aziez",
      attendance: "Hadir",
      message: "Selamat ya Resky & Hana! Semoga sakinah mawaddah warahmah.",
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

  useEffect(() => {
    document.body.style.overflow = step !== "open" ? "hidden" : "unset";
  }, [step]);

  const handleEnvelopeClick = () => {
    setStep("modal");
  };

  const handleOpenInvitation = () => {
    setStep("open");
    if (audioRef.current) {
      audioRef.current
        .play()
        .catch((err) => console.log("Playback interrupted:", err));
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleRSVPOther = async (e) => {
    e.preventDefault();
    if (!form.name || !form.message)
      return alert("Mohon lengkapi semua kolom!");
    setLoading(true);
    await submitRSVP(form);
    setComments([form, ...comments]);
    setForm({ name: "", attendance: "Hadir", message: "" });
    setLoading(false);
  };

  // Mock Gallery Data (Kita duplikasi array-nya supaya efek infinite loop-nya seamless)
  const baseImages = [
    "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600",
    "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600",
    "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600",
    "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600",
    "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600",
    "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600",
    "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600",
    "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600",
    "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600",
    "https://images.unsplash.com/photo-1519741497675-611481863552?q=80&w=600",
  ];

  // Gandakan array 3 kali agar aman untuk perputaran infinite scroll kiri-kanan
  const images = [...baseImages, ...baseImages, ...baseImages];

  const galleryRef = useRef(null);

  // Set posisi awal scroll di tengah-tengah array duplikat saat pertama kali load
  useEffect(() => {
    if (galleryRef.current) {
      const singleSetWidth = galleryRef.current.scrollWidth / 3;
      galleryRef.current.scrollLeft = singleSetWidth;
    }
  }, []);

  const scroll = (direction) => {
    if (galleryRef.current) {
      const container = galleryRef.current;
      const scrollAmount = 320;
      const singleSetWidth = container.scrollWidth / 3;

      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });

      // Cek posisi setelah animasi scroll selesai untuk jump kembali ke set tengah secara instan
      setTimeout(() => {
        if (container.scrollLeft <= 10) {
          container.style.scrollBehavior = "auto";
          container.scrollLeft += singleSetWidth;
          container.style.scrollBehavior = "smooth";
        } else if (container.scrollLeft >= singleSetWidth * 2) {
          container.style.scrollBehavior = "auto";
          container.scrollLeft -= singleSetWidth;
          container.style.scrollBehavior = "smooth";
        }
      }, 400); // Waktu jeda disesuaikan dengan durasi smooth scroll
    }
  };

  return (
    <div className="relative min-h-screen bg-primary select-none w-full flex justify-center">
      <div className="w-full max-w-[430px] shadow-2xl min-h-screen bg-primary">
        {/* Audio Element */}
        <audio
          ref={audioRef}
          loop
          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        />

        {/* 1. Gatekeeper Overlay */}
        {step === "envelope" && (
          <EnvelopeOpening onOpen={handleEnvelopeClick} />
        )}

        {step === "modal" && (
          <OpeningModal guestName={guestName} onOpen={handleOpenInvitation} />
        )}

        {step === "open" && (
          <div className="animate-fade-in-up">
            {/* Main Content Layout */}
            <main className="w-full">
              <Hero />
              <BrideGroom />
              <Event />

              {/* SECTION GALLERY (10 Photos Slider with Arrows) */}
              <section
                id="gallery"
                className="py-20 px-6 text-center max-w-5xl mx-auto"
              >
                <span className="text-xs tracking-[0.3em] font-medium text-accent uppercase block mb-2">
                  Dokumentasi
                </span>
                <h2 className="font-serif text-4xl text-secondary font-medium tracking-wide mb-10">
                  Galeri Prewedding
                </h2>

                <div className="relative group px-4 md:px-12">
                  {/* Left Arrow Button */}
                  <button
                    onClick={() => scroll("left")}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-secondary w-10 h-10 rounded-full shadow-md flex items-center justify-center transition-all cursor-pointer hidden md:flex"
                  >
                    ❮
                  </button>

                  {/* Right Arrow Button */}
                  <button
                    onClick={() => scroll("right")}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-secondary w-10 h-10 rounded-full shadow-md flex items-center justify-center transition-all cursor-pointer hidden md:flex"
                  >
                    ❯
                  </button>

                  {/* Slider Container */}
                  <div
                    ref={galleryRef}
                    className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar pb-4"
                  >
                    {images.map((img, idx) => (
                      <div
                        key={idx}
                        className="min-w-[280px] md:min-w-[360px] aspect-[16/10] snap-center overflow-hidden rounded-2xl shadow-sm cursor-pointer flex-shrink-0"
                        onClick={() => setActiveLightbox(img)}
                      >
                        <img
                          src={img}
                          alt="Prewedding"
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* SECTION HADIAH / MILESTONE GIFT */}
              <GiftSection />

              {/* SECTION RSVP & BUKU TAMU */}
              <section
                id="rsvp"
                className="py-20 px-6 max-w-xl mx-auto text-center"
              >
                <span className="text-xs tracking-[0.3em] font-medium text-accent uppercase block mb-2">
                  Interaksi
                </span>
                <h2 className="font-serif text-4xl text-secondary font-medium tracking-wide mb-10">
                  RSVP & Ucapan
                </h2>

                <form
                  onSubmit={handleRSVPOther}
                  className="glass-card p-6 rounded-3xl text-left shadow-sm"
                >
                  <div className="mb-4">
                    <label className="text-xs font-semibold uppercase text-charcoal/70 tracking-wider">
                      Nama Anda
                    </label>
                    <input
                      type="text"
                      className="w-full mt-1 px-4 py-2.5 bg-white/50 border border-secondary/20 rounded-xl focus:outline-none focus:border-secondary text-sm"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-4">
                    <label className="text-xs font-semibold uppercase text-charcoal/70 tracking-wider">
                      Konfirmasi Kehadiran
                    </label>
                    <select
                      className="w-full mt-1 px-4 py-2.5 bg-white/50 border border-secondary/20 rounded-xl focus:outline-none focus:border-secondary text-sm"
                      value={form.attendance}
                      onChange={(e) =>
                        setForm({ ...form, attendance: e.target.value })
                      }
                    >
                      <option value="Hadir">Hadir</option>
                      <option value="Tidak Hadir">Tidak Hadir</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="text-xs font-semibold uppercase text-charcoal/70 tracking-wider">
                      Ucapan & Doa Restu
                    </label>
                    <textarea
                      rows="4"
                      className="w-full mt-1 px-4 py-2.5 bg-white/50 border border-secondary/20 rounded-xl focus:outline-none focus:border-secondary text-sm resize-none"
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-secondary text-primary font-semibold rounded-xl text-sm tracking-wide shadow-sm hover:bg-secondary/90 cursor-pointer active:scale-98 transition-all"
                  >
                    {loading ? "Mengirim..." : "KIRIM UCAPAN"}
                  </button>
                </form>

                {/* Tampilan List Komentar / Buku Tamu */}
                <div className="mt-8 max-h-80 overflow-y-auto text-left flex flex-col gap-3 pr-2">
                  {comments.map((c, i) => (
                    <div
                      key={i}
                      className="p-4 bg-white/40 border border-secondary/10 rounded-2xl text-sm shadow-2xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-charcoal">
                          {c.name}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.attendance === "Hadir" ? "bg-secondary/10 text-secondary" : "bg-accent/10 text-accent"}`}
                        >
                          {c.attendance}
                        </span>
                      </div>
                      <p className="text-charcoal/80 leading-relaxed text-xs mt-1">
                        {c.message}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* FOOTER */}
              <footer className="py-12 bg-secondary/10 text-center text-xs text-charcoal/60">
                <p className="font-serif text-lg text-secondary font-semibold mb-2">
                  Resky & Hana
                </p>
                <p>© 2026 Premium Digital Invitation. All Rights Reserved.</p>
              </footer>
            </main>

            {/* 3. Floating Navigation */}
            <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 glass-card px-6 py-3 rounded-full flex gap-6 shadow-md backdrop-blur-lg border-white/40">
              {[
                "home",
                "bride-groom",
                "event",
                "gallery",
                "hadiah",
                "rsvp",
              ].map((id) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className={`text-xs uppercase font-bold tracking-wider transition-colors ${activeSection === id ? "text-secondary scale-105" : "text-charcoal/40"}`}
                >
                  {id === "bride-groom"
                    ? "Mempelai"
                    : id === "home"
                      ? "Awal"
                      : id === "event"
                        ? "Acara"
                        : id === "gallery"
                          ? "Galeri"
                          : id === "hadiah"
                            ? "Kado"
                            : "RSVP"}
                </a>
              ))}
            </nav>

            {/* 4. Floating Audio Control Button */}
            <button
              onClick={toggleMute}
              className="fixed top-4 right-4 z-40 w-10 h-10 rounded-full glass-card flex items-center justify-center text-sm shadow-sm cursor-pointer active:scale-90 transition-transform"
            >
              {isMuted ? "🔇" : "🎵"}
            </button>

            {/* 5. Lightbox Modal Gallery */}
            {activeLightbox && (
              <div
                className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                onClick={() => setActiveLightbox(null)}
              >
                <img
                  src={activeLightbox}
                  alt="Full Size"
                  className="max-w-full max-h-full rounded-lg shadow-xl animate-fade-in"
                />
                <button className="absolute top-4 right-4 text-white text-2xl font-bold cursor-pointer">
                  ×
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
