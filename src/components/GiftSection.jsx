import { useState, useEffect } from "react";
import { weddingData } from "../data/weddingData";

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

// Daftar Bank yang didukung untuk Virtual Account
const SUPPORTED_BANKS = [
  { code: "BCA", name: "BCA" },
  { code: "MANDIRI", name: "Mandiri" },
  { code: "BNI", name: "BNI" },
  { code: "BRI", name: "BRI" },
];

export default function GiftSection() {
  const [gifts, setGifts] = useState(initialGifts);
  const [selectedGift, setSelectedGift] = useState(null);
  const [donorName, setDonorName] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  // Pilihan metode pembayaran: "QRIS" | "VIRTUAL_ACCOUNT"
  const [paymentMethod, setPaymentMethod] = useState("QRIS");
  const [selectedBank, setSelectedBank] = useState("BCA");

  // Status alur modal: "input" | "active_charge" | "success"
  const [paymentStep, setPaymentStep] = useState("input");
  const [chargeData, setChargeData] = useState(null);
  const [initialCollected, setInitialCollected] = useState(0);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [simulating, setSimulating] = useState(false);

  // Accordion status untuk amplop langsung & kado fisik
  const [showDirectAccounts, setShowDirectAccounts] = useState(false);
  const [showShippingAddress, setShowShippingAddress] = useState(false);

  // Format angka ke format mata uang Rupiah
  const formatRupiah = (val) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Helper sinkronisasi data kado terbaru dari Supabase
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

  // Ambil data progres terkumpul saat web dibuka
  useEffect(() => {
    refreshGiftsFromDatabase();
  }, []);

  // Polling otomatis setiap 3 detik saat QRIS atau VA sedang ditampilkan
  useEffect(() => {
    let intervalId;
    if (paymentStep === "active_charge" && selectedGift) {
      intervalId = setInterval(async () => {
        const latestGifts = await refreshGiftsFromDatabase();
        if (latestGifts) {
          const currentTarget = latestGifts.find((g) => g.id === selectedGift.id);
          if (currentTarget && Number(currentTarget.collected) > initialCollected) {
            setPaymentStep("success");
            clearInterval(intervalId);
          }
        }
      }, 3000);
    }
    return () => clearInterval(intervalId);
  }, [paymentStep, selectedGift, initialCollected]);

  const handleOpenModal = (gift) => {
    setSelectedGift(gift);
    setAmount("");
    setPaymentMethod("QRIS");
    setSelectedBank("BCA");
    setPaymentStep("input");
    setChargeData(null);
    setInitialCollected(gift.collected || 0);
  };

  const handleCloseModal = () => {
    if (!loading && !simulating) {
      setSelectedGift(null);
      setAmount("");
      setPaymentStep("input");
      setChargeData(null);
      setCheckingPayment(false);
      setCopiedField(null);
    }
  };

  // Handler Submit untuk Generate QRIS / Virtual Account
  const handleGenerateCharge = async (e) => {
    e.preventDefault();

    const numericAmount = Number(amount);
    if (!amount || isNaN(numericAmount) || numericAmount < 10000) {
      alert("Mohon masukkan nominal patungan minimal Rp 10.000");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/create-charge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentMethod,
          bankCode: selectedBank,
          amount: numericAmount,
          giftId: selectedGift.id,
          giftTitle: selectedGift.title,
          donorName: donorName.trim() || "Tamu Undangan",
        }),
      });

      const data = await response.json();

      if (response.ok && (data?.qrString || data?.accountNumber)) {
        setChargeData(data);
        setInitialCollected(selectedGift.collected || 0);
        setPaymentStep("active_charge");
      } else {
        alert("Gagal memproses pembayaran: " + (data?.message || "Terjadi kesalahan"));
      }
    } catch (err) {
      console.error("Create Charge Error:", err);
      alert("Koneksi gagal saat membuat pembayaran: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Cek Status Manual
  const handleManualCheck = async () => {
    setCheckingPayment(true);
    const latestGifts = await refreshGiftsFromDatabase();
    setCheckingPayment(false);

    if (latestGifts && selectedGift) {
      const currentTarget = latestGifts.find((g) => g.id === selectedGift.id);
      if (currentTarget && Number(currentTarget.collected) > initialCollected) {
        setPaymentStep("success");
      } else {
        alert("Pembayaran belum terdeteksi. Jika baru saja transfer/scan, mohon tunggu beberapa detik lalu coba lagi.");
      }
    }
  };

  // Simulasi Bayar Berhasil (Untuk Mempermudah Testing Sandbox)
  const handleSimulatePayment = async () => {
    if (!chargeData) return;
    setSimulating(true);

    try {
      const res = await fetch("/api/simulate-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: chargeData.type,
          qrId: chargeData.qrId,
          externalId: chargeData.externalId,
          amount: chargeData.amount,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.message || "Gagal simulasi bayar");
      }

      // Tunggu 1 detik agar data kado & transaksi terupdate
      setTimeout(async () => {
        await refreshGiftsFromDatabase();
        setPaymentStep("success");
        setSimulating(false);
      }, 1000);
    } catch (err) {
      alert("Error saat simulasi: " + err.message);
      setSimulating(false);
    }
  };

  // Salin teks ke clipboard
  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <section
      id="hadiah"
      className="py-20 px-6 max-w-md mx-auto text-center scroll-mt-10 relative overflow-hidden"
    >
      {/* Header Section */}
      <span className="text-xs tracking-[0.3em] font-medium text-accent uppercase block mb-1">
        Wedding Gift & Milestone
      </span>
      <h2 className="font-serif text-3xl md:text-4xl text-secondary font-medium tracking-wide">
        Tanda Kasih
      </h2>
      <div className="w-12 h-[1px] bg-accent/50 mx-auto mt-3 mb-6" />

      <p className="text-xs text-charcoal/70 max-w-sm mx-auto mb-10 leading-relaxed">
        Doa restu Anda adalah karunia terindah bagi kami. Namun jika Anda ingin
        memberikan tanda cinta, Anda dapat turut berpartisipasi patungan kado
        impian kami atau mengirimkannya langsung di bawah ini.
      </p>

      {/* Grid Kartu Target Hadiah Milestone */}
      <div className="flex flex-col gap-6 text-left">
        {gifts.map((item) => {
          const percent = Math.min(
            Math.round((item.collected / item.target) * 100),
            100,
          );
          const remaining = Math.max(item.target - item.collected, 0);

          return (
            <div
              key={item.id}
              className="glass-card p-6 rounded-3xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 border border-secondary/15 hover:border-accent/40"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center text-2xl shadow-inner border border-secondary/10">
                    {item.icon}
                  </div>
                  <span className="text-[10px] tracking-wider font-semibold uppercase text-accent-dark bg-accent/15 px-3 py-1 rounded-full border border-accent/25">
                    {item.category}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-semibold text-secondary mb-1">
                  {item.title}
                </h3>
                <p className="text-[11px] text-charcoal/65 mb-4 leading-normal">
                  {item.description}
                </p>

                {/* Detail Progres Terkumpul */}
                <div className="bg-white/60 p-3.5 rounded-2xl border border-secondary/10 mb-3">
                  <div className="flex justify-between items-baseline text-xs mb-1">
                    <span className="text-charcoal/60 text-[11px]">Terkumpul</span>
                    <span className="font-bold text-secondary">
                      {formatRupiah(item.collected)}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline text-[11px] text-charcoal/60 mb-2">
                    <span>Target</span>
                    <span>{formatRupiah(item.target)}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-charcoal/10 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-secondary to-accent h-full rounded-full transition-all duration-700 ease-out"
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
                      : "Target Tercapai! 🎉"}
                  </span>
                </div>
              </div>

              {/* Tombol Aksi Ikut Patungan */}
              <button
                onClick={() => handleOpenModal(item)}
                className="mt-5 w-full py-3 bg-secondary text-primary font-semibold text-xs tracking-wider rounded-xl hover:bg-secondary/90 transition-all duration-200 shadow-sm cursor-pointer active:scale-98 flex items-center justify-center gap-2"
              >
                <span>IKUT PATUNGAN HADIAH</span>
                <span>→</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Bagian Tambahan: Rekening Langsung & Kirim Kado Fisik */}
      <div className="mt-12 flex flex-col gap-4 text-left">
        {/* Accordion 1: Transfer Rekening Bank Langsung */}
        <div className="glass-card rounded-2xl border border-secondary/20 overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => setShowDirectAccounts(!showDirectAccounts)}
            className="w-full p-4 flex items-center justify-between text-left font-medium text-xs text-secondary hover:bg-secondary/5 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base">💳</span>
              <div>
                <h4 className="font-semibold text-charcoal text-xs">
                  Transfer Rekening Langsung
                </h4>
                <p className="text-[10px] text-charcoal/60">
                  Untuk tamu yang ingin transfer manual tanpa payment gateway
                </p>
              </div>
            </div>
            <span className="text-xs text-accent font-bold">
              {showDirectAccounts ? "▲" : "▼"}
            </span>
          </button>

          {showDirectAccounts && (
            <div className="p-4 pt-1 border-t border-secondary/15 flex flex-col gap-3 animate-fade-in">
              {weddingData.gift.directAccounts.map((acc, i) => (
                <div
                  key={i}
                  className="p-3 bg-white/70 rounded-xl border border-secondary/15 flex items-center justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold text-accent uppercase block">
                      Bank {acc.bankName}
                    </span>
                    <span className="font-mono text-sm font-bold text-secondary tracking-wider block">
                      {acc.accountNumber}
                    </span>
                    <span className="text-[10px] text-charcoal/60 block">
                      a.n. {acc.accountHolder}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(acc.accountNumber, `direct-${i}`)}
                    className="px-3 py-1.5 bg-secondary text-primary text-[10px] font-bold rounded-lg hover:bg-secondary/90 transition-all cursor-pointer"
                  >
                    {copiedField === `direct-${i}` ? "Tersalin! ✓" : "Salin"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Accordion 2: Kirim Kado Fisik ke Alamat */}
        <div className="glass-card rounded-2xl border border-secondary/20 overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => setShowShippingAddress(!showShippingAddress)}
            className="w-full p-4 flex items-center justify-between text-left font-medium text-xs text-secondary hover:bg-secondary/5 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base">🎁</span>
              <div>
                <h4 className="font-semibold text-charcoal text-xs">
                  Kirim Kado Fisik
                </h4>
                <p className="text-[10px] text-charcoal/60">
                  Alamat pengiriman kado ke kediaman mempelai
                </p>
              </div>
            </div>
            <span className="text-xs text-accent font-bold">
              {showShippingAddress ? "▲" : "▼"}
            </span>
          </button>

          {showShippingAddress && (
            <div className="p-4 pt-1 border-t border-secondary/15 flex flex-col gap-2 animate-fade-in text-xs">
              <div className="p-3 bg-white/70 rounded-xl border border-secondary/15">
                <span className="text-[10px] font-bold text-accent uppercase block mb-1">
                  Penerima:
                </span>
                <p className="font-semibold text-secondary mb-1">
                  {weddingData.gift.shippingAddress.recipient} (
                  {weddingData.gift.shippingAddress.phone})
                </p>
                <p className="text-[11px] text-charcoal/80 leading-relaxed mb-3">
                  {weddingData.gift.shippingAddress.address}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      weddingData.gift.shippingAddress.address,
                      "shipping"
                    )
                  }
                  className="w-full py-2 bg-secondary/10 hover:bg-secondary text-secondary hover:text-white text-[11px] font-bold rounded-lg transition-all cursor-pointer text-center block"
                >
                  {copiedField === "shipping"
                    ? "Alamat Tersalin! ✓"
                    : "Salin Alamat Lengkap"}
                </button>
              </div>
              <span className="text-[10px] text-charcoal/50 italic text-center block">
                {weddingData.gift.shippingAddress.notes}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* MODAL NATIVE: QRIS & VIRTUAL ACCOUNT 100% DI WEBSITE */}
      {selectedGift && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="glass-card bg-primary p-6 md:p-8 rounded-3xl max-w-sm w-full text-left relative shadow-2xl border border-accent/30 animate-fade-in-up max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tombol Tutup */}
            <button
              type="button"
              onClick={handleCloseModal}
              disabled={loading || simulating}
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

            {/* STEP 1: FORM INPUT & PILIH METODE BAYAR */}
            {paymentStep === "input" && (
              <>
                <div className="bg-white/70 p-3.5 rounded-2xl mb-4 border border-secondary/15">
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

                <form onSubmit={handleGenerateCharge} className="flex flex-col gap-3.5">
                  <div>
                    <label className="text-[11px] font-semibold uppercase text-charcoal/80 tracking-wider block mb-1">
                      Nama Anda / Tamu
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Budi Santoso"
                      className="w-full px-4 py-2.5 bg-white/80 border border-secondary/25 rounded-xl text-sm text-charcoal focus:outline-none focus:border-secondary transition-colors"
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
                      className="w-full px-4 py-2.5 bg-white/80 border border-secondary/25 rounded-xl text-sm text-charcoal font-medium focus:outline-none focus:border-secondary transition-colors"
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
                              ? "bg-secondary text-primary border-secondary font-bold"
                              : "bg-white/60 border-secondary/20 text-charcoal/80 hover:bg-secondary/10"
                          }`}
                        >
                          {val >= 1000000
                            ? `${val / 1000000} Jt`
                            : `${val / 1000} Rb`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pilihan Tab Metode Pembayaran */}
                  <div>
                    <label className="text-[11px] font-semibold uppercase text-charcoal/80 tracking-wider block mb-1.5">
                      Pilih Jalur Pembayaran
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("QRIS")}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          paymentMethod === "QRIS"
                            ? "bg-secondary text-primary border-secondary shadow-xs"
                            : "bg-white/70 text-charcoal/70 border-secondary/20 hover:bg-white"
                        }`}
                      >
                        <span>📱</span>
                        <span>QRIS (Instant)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("VIRTUAL_ACCOUNT")}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          paymentMethod === "VIRTUAL_ACCOUNT"
                            ? "bg-secondary text-primary border-secondary shadow-xs"
                            : "bg-white/70 text-charcoal/70 border-secondary/20 hover:bg-white"
                        }`}
                      >
                        <span>🏦</span>
                        <span>Virtual Account</span>
                      </button>
                    </div>

                    {paymentMethod === "VIRTUAL_ACCOUNT" && (
                      <div className="mt-2.5 p-2.5 bg-white/60 rounded-xl border border-secondary/15">
                        <span className="text-[10px] text-charcoal/70 block mb-1.5 font-medium">
                          Pilih Bank Virtual Account:
                        </span>
                        <div className="grid grid-cols-4 gap-1.5">
                          {SUPPORTED_BANKS.map((b) => (
                            <button
                              key={b.code}
                              type="button"
                              onClick={() => setSelectedBank(b.code)}
                              className={`py-1.5 px-2 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                                selectedBank === b.code
                                  ? "bg-secondary text-primary border-secondary"
                                  : "bg-white border-secondary/20 text-charcoal hover:bg-secondary/10"
                              }`}
                            >
                              {b.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tombol Lanjut Bayar */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-3.5 bg-secondary text-primary font-semibold text-xs tracking-wider uppercase rounded-xl shadow-md hover:bg-secondary/90 transition-all cursor-pointer active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
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
                        <span>MEMPROSES...</span>
                      </>
                    ) : (
                      <span>
                        {paymentMethod === "QRIS"
                          ? "TAMPILKAN QRIS 📱"
                          : "BUAT NO. REKENING VA 🏦"}
                      </span>
                    )}
                  </button>
                </form>
              </>
            )}

            {/* STEP 2: ACTIVE CHARGE (QRIS ATAU VA NATIVE TAMPIL) */}
            {paymentStep === "active_charge" && chargeData && (
              <div className="flex flex-col items-center text-center animate-fade-in">
                {chargeData.type === "QRIS" && (
                  <div className="w-full flex flex-col items-center">
                    <div className="bg-white p-4 rounded-2xl shadow-md border border-secondary/20 mb-3 flex flex-col items-center">
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="font-bold text-xs tracking-wider text-red-600">
                          QRIS
                        </span>
                        <span className="text-[9px] text-charcoal/60">
                          Semua Pembayaran
                        </span>
                      </div>

                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                          chargeData.qrString || "QRIS",
                        )}&margin=10`}
                        alt="QRIS Barcode"
                        className="w-48 h-48 rounded-lg object-contain border border-charcoal/10"
                      />

                      <span className="text-[10px] text-charcoal/50 mt-2 font-mono">
                        NMID / Xendit Dynamic QR
                      </span>
                    </div>

                    <div className="text-center mb-3">
                      <span className="text-[11px] text-charcoal/60 block">
                        Total Nominal:
                      </span>
                      <strong className="text-lg font-bold text-secondary">
                        {formatRupiah(chargeData.amount)}
                      </strong>
                    </div>

                    <p className="text-[11px] text-charcoal/70 mb-3 max-w-xs leading-relaxed">
                      Buka aplikasi <strong>BCA, Mandiri, GoPay, OVO, Dana, atau ShopeePay</strong>, lalu scan barcode di atas.
                    </p>
                  </div>
                )}

                {chargeData.type === "VIRTUAL_ACCOUNT" && (
                  <div className="w-full text-left bg-white/80 p-4 rounded-2xl border border-secondary/20 mb-3">
                    <div className="flex justify-between items-center mb-3 pb-2 border-b border-secondary/15">
                      <span className="text-xs font-bold text-secondary">
                        Bank {chargeData.bankCode} Virtual Account
                      </span>
                      <span className="text-[10px] bg-secondary/10 text-secondary px-2 py-0.5 rounded-full font-semibold">
                        Otomatis
                      </span>
                    </div>

                    <div className="mb-3">
                      <span className="text-[10px] text-charcoal/60 uppercase block mb-1">
                        Nomor Virtual Account:
                      </span>
                      <div className="flex items-center justify-between bg-primary/80 p-2.5 rounded-xl border border-secondary/20">
                        <span className="font-mono text-base font-bold text-secondary tracking-wider">
                          {chargeData.accountNumber}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(chargeData.accountNumber, "va")}
                          className="px-2.5 py-1 bg-secondary text-primary text-[10px] font-bold rounded-lg hover:bg-secondary/90 transition-all cursor-pointer"
                        >
                          {copiedField === "va" ? "Tersalin! ✓" : "Salin"}
                        </button>
                      </div>
                    </div>

                    <div className="mb-2">
                      <span className="text-[10px] text-charcoal/60 uppercase block mb-1">
                        Total Pembayaran:
                      </span>
                      <div className="flex items-center justify-between bg-primary/80 p-2.5 rounded-xl border border-secondary/20">
                        <span className="font-bold text-sm text-secondary">
                          {formatRupiah(chargeData.amount)}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(chargeData.amount.toString(), "amount")
                          }
                          className="px-2.5 py-1 bg-secondary text-primary text-[10px] font-bold rounded-lg hover:bg-secondary/90 transition-all cursor-pointer"
                        >
                          {copiedField === "amount" ? "Tersalin! ✓" : "Salin"}
                        </button>
                      </div>
                    </div>

                    <span className="text-[10px] text-charcoal/60 block mt-2 text-center">
                      Atas Nama: <strong>{chargeData.name}</strong>
                    </span>
                  </div>
                )}

                {/* Status Verifikasi Realtime */}
                <div className="w-full bg-secondary/5 border border-secondary/15 p-2.5 rounded-xl mb-3 flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="text-[11px] text-charcoal/80">
                    Menunggu pembayaran Anda...
                  </span>
                </div>

                {/* Tombol Aksi & Testing Simulator */}
                <div className="flex flex-col w-full gap-2">
                  <button
                    type="button"
                    onClick={handleManualCheck}
                    disabled={checkingPayment}
                    className="w-full py-2.5 bg-secondary text-primary font-semibold text-xs rounded-xl shadow-xs hover:bg-secondary/90 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {checkingPayment ? (
                      <span>MEMERIKSA...</span>
                    ) : (
                      <span>🔄 CEK STATUS SEKARANG</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleSimulatePayment}
                    disabled={simulating}
                    className="w-full py-2 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-800 border border-emerald-600/30 font-semibold text-[11px] rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    {simulating ? "Memproses Simulasi..." : "⚡ Simulasi Bayar Sukses (Test Mode)"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentStep("input")}
                    className="text-[11px] text-charcoal/60 hover:text-charcoal py-1 mt-1 cursor-pointer"
                  >
                    ← Ganti Metode Lain / Nominal
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: PEMBAYARAN SUKSES / TERVERIFIKASI */}
            {paymentStep === "success" && (
              <div className="flex flex-col items-center text-center py-4 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-accent/20 text-accent-dark flex items-center justify-center text-3xl mb-3 shadow-inner">
                  🎉
                </div>

                <h4 className="font-serif text-xl font-bold text-secondary mb-1">
                  Pembayaran Berhasil Diterima!
                </h4>
                <p className="text-xs text-charcoal/80 mb-4 leading-relaxed max-w-xs">
                  Terima kasih banyak,{" "}
                  <strong className="text-secondary">{donorName.trim() || "Tamu Undangan"}</strong>!
                  Patungan Anda sebesar{" "}
                  <strong className="text-secondary">{formatRupiah(Number(amount))}</strong> telah
                  berhasil ditambahkan ke kado {selectedGift.title}.
                </p>

                <div className="w-full bg-accent/15 border border-accent/30 p-3 rounded-2xl mb-4 text-xs text-charcoal/80 font-medium">
                  Milestone target kado ini sekarang bertambah secara live! ✨
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
