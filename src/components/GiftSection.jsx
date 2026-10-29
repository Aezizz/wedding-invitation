import { useState, useEffect } from "react";

// Daftar hadiah milestone dengan target nominal dan jumlah yang sudah terkumpul
const initialGifts = [
  {
    id: "smart-tv",
    title: "Smart TV 55 Inch",
    category: "Ruang Keluarga",
    target: 10000000,
    collected: 6500000,
    icon: "📺",
    description: "Untuk menemani momen santai bersama di rumah baru.",
  },
  {
    id: "kulkas",
    title: "Kulkas 2 Pintu",
    category: "Dapur Impian",
    target: 12000000,
    collected: 4200000,
    icon: "🧊",
    description:
      "Kebutuhan esensial untuk menyimpan bahan makanan segar keluarga.",
  },
  {
    id: "sofa",
    title: "Sofa Minimalis",
    category: "Ruang Tamu",
    target: 5000000,
    collected: 4000000,
    icon: "🛋️",
    description:
      "Sofa nyaman bernuansa earth-tone untuk menyambut hangat para tamu.",
  },
];

// Opsi nominal cepat untuk kemudahan tamu
const QUICK_AMOUNTS = [50000, 100000, 250000, 500000];

export default function GiftSection() {
  const [gifts, setGifts] = useState(initialGifts);
  const [selectedGift, setSelectedGift] = useState(null);
  const [donorName, setDonorName] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  // Status alur modal: "input" | "waiting" | "success"
  const [paymentStep, setPaymentStep] = useState("input");
  const [activeInvoiceUrl, setActiveInvoiceUrl] = useState("");
  const [initialCollected, setInitialCollected] = useState(0);
  const [checkingPayment, setCheckingPayment] = useState(false);

  // Fungsi helper untuk mengambil data kado terbaru dari database
  const refreshGiftsFromDatabase = async () => {
    try {
      const res = await fetch("/api/get-gifts");
      if (res.ok) {
        const data = await res.json();
        if (data?.gifts && Array.isArray(data.gifts)) {
          setGifts((prevGifts) =>
            prevGifts.map((localGift) => {
              const remoteGift = data.gifts.find((g) => g.id === localGift.id);
              return remoteGift
                ? {
                    ...localGift,
                    collected: Number(remoteGift.collected),
                    target: Number(remoteGift.target || localGift.target),
                  }
                : localGift;
            })
          );
          return data.gifts;
        }
      }
    } catch (err) {
      console.warn("Gagal sinkronisasi data kado dari database:", err);
    }
    return null;
  };

  // Ambil data progres terkumpul terbaru secara live dari Supabase via API saat pertama dimuat
  useEffect(() => {
    refreshGiftsFromDatabase();
  }, []);

  // Polling otomatis setiap 3 detik saat dalam status "waiting" (menunggu tamu transfer)
  useEffect(() => {
    let intervalId;
    if (paymentStep === "waiting" && selectedGift) {
      intervalId = setInterval(async () => {
        const latestGifts = await refreshGiftsFromDatabase();
        if (latestGifts) {
          const currentTarget = latestGifts.find((g) => g.id === selectedGift.id);
          if (currentTarget && Number(currentTarget.collected) > initialCollected) {
            // Webhook Xendit telah berhasil memperbarui Supabase!
            setPaymentStep("success");
            clearInterval(intervalId);
          }
        }
      }, 3000);
    }
    return () => clearInterval(intervalId);
  }, [paymentStep, selectedGift, initialCollected]);

  // Inisialisasi status toast langsung dari query parameter
  const [toastMessage, setToastMessage] = useState(() => {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");

    if (status === "success") {
      return {
        type: "success",
        title: "Pembayaran Berhasil! 🎉",
        message:
          "Terima kasih atas doa dan hadiah terbaik yang Anda berikan untuk Resky & Hana.",
      };
    }
    if (status === "failed") {
      return {
        type: "error",
        title: "Transaksi Dibatalkan",
        message:
          "Pembayaran belum terselesaikan. Anda dapat mencoba kembali kapan saja.",
      };
    }
    return null;
  });

  // Bersihkan query param dari URL tanpa reload halaman
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("status")) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Format angka ke format mata uang Rupiah
  const formatRupiah = (val) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleOpenModal = (gift) => {
    setSelectedGift(gift);
    setAmount("");
    setPaymentStep("input");
    setActiveInvoiceUrl("");
    setInitialCollected(gift.collected || 0);
  };

  const handleCloseModal = () => {
    if (!loading) {
      setSelectedGift(null);
      setAmount("");
      setPaymentStep("input");
      setActiveInvoiceUrl("");
      setCheckingPayment(false);
    }
  };

  const handlePay = async (e) => {
    e.preventDefault();

    const numericAmount = Number(amount);
    if (!amount || isNaN(numericAmount) || numericAmount < 10000) {
      alert("Mohon masukkan nominal patungan minimal Rp 10.000");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/create-xendit-invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: numericAmount,
          giftId: selectedGift.id,
          giftTitle: selectedGift.title,
          donorName: donorName.trim() || "Tamu Undangan",
        }),
      });

      const contentType = response.headers.get("content-type");
      const isJson = contentType && contentType.includes("application/json");

      // Fallback deteksi jika berjalan di standard Vite dev server tanpa Vercel runtime
      if (!response.ok && (!isJson || response.status === 404)) {
        console.warn(
          "[Dev-Mode Notice] Endpoint /api/create-xendit-invoice tidak aktif atau tidak mendukung serverless di Vite server reguler.",
        );
        alert(
          `[Simulasi Mode Dev / Vite Standar]\n\n` +
            `Terima kasih banyak, ${donorName.trim() || "Tamu Undangan"}!\n` +
            `Hadiah: ${selectedGift.title}\n` +
            `Nominal Patungan: ${formatRupiah(numericAmount)}\n\n` +
            `Catatan Pengembang:\n` +
            `Serverless function /api/create-xendit-invoice berjalan optimal dengan Vercel CLI ('vercel dev') atau pada saat deployment Vercel. Di server produksi, invoice Xendit akan dibuat dan tab pembayaran otomatis terbuka.`,
        );
        handleCloseModal();
        return;
      }

      const data = isJson ? await response.json() : null;

      if (response.ok && data?.invoiceUrl) {
        setActiveInvoiceUrl(data.invoiceUrl);
        setInitialCollected(selectedGift.collected || 0);
        setPaymentStep("waiting");

        // Buka URL Checkout Xendit di tab baru
        const checkoutTab = window.open(data.invoiceUrl, "_blank");
        if (!checkoutTab) {
          // Jika browser memblokir popup otomatis, user tetap bisa klik tombol di modal
          console.warn("Popup diblokir oleh browser. Tombol pembuka manual tersedia.");
        }
      } else {
        const errorMsg =
          data?.message ||
          `Gagal menghubungi server (Status: ${response.status})`;
        alert("Gagal memproses transaksi Xendit: " + errorMsg);
      }
    } catch (err) {
      console.error("Xendit Payment Request Error:", err);
      alert(
        `[Simulasi Mode Dev / Vite Standar]\n\n` +
          `Koneksi ke endpoint /api/create-xendit-invoice gagal:\n${err.message}\n\n` +
          `Terima kasih telah berpartisipasi patungan untuk ${selectedGift.title} sebesar ${formatRupiah(
            numericAmount,
          )}!`,
      );
      handleCloseModal();
    } finally {
      setLoading(false);
    }
  };

  // Tombol cek status manual oleh tamu
  const handleManualCheck = async () => {
    setCheckingPayment(true);
    const latestGifts = await refreshGiftsFromDatabase();
    setCheckingPayment(false);

    if (latestGifts && selectedGift) {
      const currentTarget = latestGifts.find((g) => g.id === selectedGift.id);
      if (currentTarget && Number(currentTarget.collected) > initialCollected) {
        setPaymentStep("success");
      } else {
        alert("Pembayaran belum terdeteksi. Jika baru saja transfer/scan, mohon tunggu beberapa detik lalu tekan tombol ini lagi.");
      }
    }
  };

  return (
    <section
      id="hadiah"
      className="py-20 px-6 max-w-4xl mx-auto text-center scroll-mt-10"
    >
      {/* Toast Notifikasi Status Pembayaran */}
      {toastMessage && (
        <div
          className={`mb-8 p-4 rounded-2xl text-left border shadow-md transition-all animate-fade-in ${
            toastMessage.type === "success"
              ? "bg-[#7a8b7b]/15 border-[#7a8b7b] text-charcoal"
              : "bg-[#b8978e]/15 border-[#b8978e] text-charcoal"
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-serif font-bold text-base mb-1">
                {toastMessage.title}
              </h4>
              <p className="text-xs leading-relaxed opacity-90">
                {toastMessage.message}
              </p>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-xs font-bold px-2 py-1 opacity-60 hover:opacity-100 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Header Section */}
      <span className="text-xs tracking-[0.3em] font-medium text-accent uppercase block mb-2">
        Milestone & Kado Impian
      </span>
      <h2 className="font-serif text-3xl md:text-4xl text-secondary font-medium tracking-wide mb-3">
        Kado Pernikahan
      </h2>
      <div className="w-12 h-[1px] bg-accent/40 mx-auto mb-4" />
      <p className="text-xs text-charcoal/70 max-w-md mx-auto mb-10 leading-relaxed">
        Doa restu Anda adalah karunia terindah. Namun jika ingin memberikan
        tanda cinta, Anda dapat turut serta berpatungan mewujudkan impian rumah
        tangga kami.
      </p>

      {/* Grid 3 Kartu Target Hadiah */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        {gifts.map((item) => {
          const percent = Math.min(
            Math.round((item.collected / item.target) * 100),
            100,
          );
          const remaining = Math.max(item.target - item.collected, 0);

          return (
            <div
              key={item.id}
              className="glass-card p-6 rounded-3xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 border border-secondary/15 hover:border-secondary/30"
            >
              <div>
                {/* Visual Icon & Tag */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-2xl shadow-inner">
                    {item.icon}
                  </div>
                  <span className="text-[10px] tracking-wider font-semibold uppercase text-accent bg-accent/10 px-2.5 py-1 rounded-full">
                    {item.category}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-semibold text-secondary mb-1">
                  {item.title}
                </h3>
                <p className="text-[11px] text-charcoal/65 mb-4 leading-normal">
                  {item.description}
                </p>

                {/* Progress Detail */}
                <div className="bg-white/40 p-3 rounded-2xl border border-secondary/10 mb-3">
                  <div className="flex justify-between items-baseline text-xs mb-1">
                    <span className="text-charcoal/60 text-[11px]">
                      Terkumpul
                    </span>
                    <span className="font-bold text-charcoal">
                      {formatRupiah(item.collected)}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline text-[11px] text-charcoal/60 mb-2">
                    <span>Target</span>
                    <span>{formatRupiah(item.target)}</span>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full bg-charcoal/10 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-secondary h-full rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] px-1">
                  <span className="font-bold text-accent">
                    {percent}% Terpenuhi
                  </span>
                  <span className="text-charcoal/50 text-[10px]">
                    {remaining > 0
                      ? `Sisa ${formatRupiah(remaining)}`
                      : "Target Tercapai!"}
                  </span>
                </div>
              </div>

              {/* Tombol Aksi Ikut Patungan */}
              <button
                onClick={() => handleOpenModal(item)}
                className="mt-6 w-full py-3 bg-secondary text-primary font-medium text-xs tracking-wider rounded-xl hover:bg-secondary/90 transition-all duration-200 shadow-sm cursor-pointer active:scale-98 flex items-center justify-center gap-2"
              >
                <span>IKUT PATUNGAN</span>
                <span>→</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* FLYING CARD MODAL (Popup Overlay Form & Live Tracker) */}
      {selectedGift && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="glass-card bg-primary p-6 md:p-8 rounded-3xl max-w-sm w-full text-left relative shadow-2xl border border-secondary/20 animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tombol Tutup */}
            <button
              type="button"
              onClick={handleCloseModal}
              disabled={loading}
              className="absolute top-5 right-5 text-charcoal/50 hover:text-charcoal text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center hover:bg-charcoal/5 transition-colors cursor-pointer"
              aria-label="Tutup"
            >
              ✕
            </button>

            {/* Modal Header */}
            <span className="text-[10px] font-bold text-accent uppercase tracking-widest block mb-1">
              Patungan Hadiah
            </span>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{selectedGift.icon}</span>
              <h3 className="font-serif text-2xl font-semibold text-secondary">
                {selectedGift.title}
              </h3>
            </div>

            {/* KONDISI 1: FORM INPUT PEMBAYARAN */}
            {paymentStep === "input" && (
              <>
                {/* Milestone Summary Card */}
                <div className="bg-white/60 p-3.5 rounded-2xl mb-5 border border-secondary/15">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-charcoal/70">Target Kado:</span>
                    <span className="font-bold text-charcoal">
                      {formatRupiah(selectedGift.target)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-charcoal/70">Telah Terkumpul:</span>
                    <span className="font-semibold text-secondary">
                      {formatRupiah(selectedGift.collected)} (
                      {Math.round(
                        (selectedGift.collected / selectedGift.target) * 100,
                      )}
                      %)
                    </span>
                  </div>
                </div>

                {/* Form Input Pembayaran */}
                <form onSubmit={handlePay} className="flex flex-col gap-4">
                  <div>
                    <label className="text-[11px] font-semibold uppercase text-charcoal/80 tracking-wider block mb-1">
                      Nama Anda / Tamu
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Budi Santoso"
                      className="w-full px-4 py-2.5 bg-white/70 border border-secondary/25 rounded-xl text-sm text-charcoal focus:outline-none focus:border-secondary transition-colors"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold uppercase text-charcoal/80 tracking-wider block mb-1">
                      Nominal Patungan (Rp)
                    </label>
                    <input
                      type="number"
                      placeholder="Contoh: 100000"
                      required
                      min="10000"
                      step="1000"
                      className="w-full px-4 py-2.5 bg-white/70 border border-secondary/25 rounded-xl text-sm text-charcoal font-medium focus:outline-none focus:border-secondary transition-colors"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      disabled={loading}
                    />

                    {/* Quick Amount Chips */}
                    <div className="grid grid-cols-4 gap-1.5 mt-2">
                      {QUICK_AMOUNTS.map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setAmount(val.toString())}
                          disabled={loading}
                          className={`text-[10px] py-1.5 px-1 rounded-lg border text-center transition-all cursor-pointer font-medium ${
                            amount === val.toString()
                              ? "bg-secondary text-primary border-secondary"
                              : "bg-white/50 border-secondary/20 text-charcoal/80 hover:bg-secondary/10"
                          }`}
                        >
                          {val >= 1000000
                            ? `${val / 1000000} Jt`
                            : `${val / 1000} Rb`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Info Keamanan Pembayaran */}
                  <div className="flex items-center gap-2 text-[10px] text-charcoal/60 bg-secondary/5 p-2 rounded-xl border border-secondary/10">
                    <span>🔒</span>
                    <span>
                      Pembayaran aman via QRIS, Virtual Account, & E-Wallet (Xendit)
                    </span>
                  </div>

                  {/* Tombol Submit Pembayaran */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-1 py-3.5 bg-secondary text-primary font-semibold text-xs tracking-wider uppercase rounded-xl shadow-md hover:bg-secondary/90 transition-all cursor-pointer active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 text-primary"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>MENGHUBUNGKAN KE XENDIT...</span>
                      </>
                    ) : (
                      <span>BAYAR DENGAN XENDIT</span>
                    )}
                  </button>
                </form>
              </>
            )}

            {/* KONDISI 2: MENUNGGU PEMBAYARAN (LIVE TRACKER AUTO-CHECK) */}
            {paymentStep === "waiting" && (
              <div className="flex flex-col items-center text-center py-4 animate-fade-in">
                {/* Indikator Animasi Pulsa Menunggu */}
                <div className="relative flex items-center justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-accent/20 animate-ping absolute"></div>
                  <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center text-2xl relative">
                    ⏳
                  </div>
                </div>

                <h4 className="font-serif text-lg font-bold text-secondary mb-1">
                  Menunggu Pembayaran
                </h4>
                <p className="text-xs text-charcoal/70 mb-4 leading-relaxed max-w-xs">
                  Halaman pembayaran telah dibuka di tab baru. Silakan selesaikan patungan sebesar{" "}
                  <strong className="text-secondary">{formatRupiah(Number(amount))}</strong>.
                </p>

                {/* Status Otomatis & Tombol Cek Manual */}
                <div className="w-full bg-white/60 p-3.5 rounded-2xl border border-secondary/15 mb-4 flex flex-col gap-2 text-left">
                  <div className="flex items-center gap-2 text-[11px] text-charcoal/80">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Sistem mengecek pembayaran otomatis...</span>
                  </div>
                  <span className="text-[10px] text-charcoal/50">
                    Progress akan otomatis terupdate begitu transaksi Anda terverifikasi oleh Xendit.
                  </span>
                </div>

                <div className="flex flex-col w-full gap-2">
                  {/* Tombol buka ulang tab Xendit jika tertutup */}
                  {activeInvoiceUrl && (
                    <a
                      href={activeInvoiceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 bg-secondary/10 text-secondary border border-secondary/25 font-semibold text-xs rounded-xl hover:bg-secondary/15 transition-all text-center block"
                    >
                      Buka Halaman Pembayaran ↗
                    </a>
                  )}

                  {/* Tombol Cek Status Manual */}
                  <button
                    type="button"
                    onClick={handleManualCheck}
                    disabled={checkingPayment}
                    className="w-full py-3 bg-secondary text-primary font-semibold text-xs tracking-wider uppercase rounded-xl shadow-md hover:bg-secondary/90 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {checkingPayment ? (
                      <>
                        <svg
                          className="animate-spin h-3.5 w-3.5 text-primary"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>MEMERIKSA STATUS...</span>
                      </>
                    ) : (
                      <span>🔄 CEK STATUS PEMBAYARAN</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="text-[11px] text-charcoal/50 hover:text-charcoal mt-1 py-1"
                  >
                    Tutup Sementara (Bisa dicek nanti)
                  </button>
                </div>
              </div>
            )}

            {/* KONDISI 3: PEMBAYARAN SUKSES / TERVERIFIKASI */}
            {paymentStep === "success" && (
              <div className="flex flex-col items-center text-center py-4 animate-fade-in">
                {/* Animasi Ikon Sukses */}
                <div className="w-16 h-16 rounded-full bg-[#7a8b7b]/20 text-[#7a8b7b] flex items-center justify-center text-3xl mb-3 shadow-inner">
                  🎉
                </div>

                <h4 className="font-serif text-xl font-bold text-secondary mb-1">
                  Pembayaran Berhasil!
                </h4>
                <p className="text-xs text-charcoal/80 mb-4 leading-relaxed max-w-xs">
                  Terima kasih banyak,{" "}
                  <strong className="text-secondary">{donorName.trim() || "Tamu Undangan"}</strong>!
                  Patungan Anda sebesar{" "}
                  <strong className="text-secondary">{formatRupiah(Number(amount))}</strong> telah
                  berhasil ditambahkan ke kado {selectedGift.title}.
                </p>

                <div className="w-full bg-[#7a8b7b]/10 border border-[#7a8b7b]/30 p-3 rounded-2xl mb-4 text-xs text-charcoal/80">
                  Target kado ini sekarang bertambah secara live! ✨
                </div>

                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="w-full py-3 bg-secondary text-primary font-semibold text-xs tracking-wider uppercase rounded-xl shadow-md hover:bg-secondary/90 transition-all cursor-pointer"
                >
                  TUTUP
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
