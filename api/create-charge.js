export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const secretKey = process.env.XENDIT_SECRET_KEY;
  if (!secretKey) {
    return res.status(500).json({ message: "XENDIT_SECRET_KEY belum diatur" });
  }

  const authHeader = "Basic " + Buffer.from(secretKey + ":").toString("base64");
  const { paymentMethod, bankCode, amount, giftId, giftTitle, donorName } = req.body || {};

  if (!amount || isNaN(Number(amount)) || Number(amount) < 10000) {
    return res.status(400).json({ message: "Nominal minimal Rp 10.000" });
  }

  const safeGiftId = giftId ? String(giftId).replace(/[^a-zA-Z0-9_-]/g, "") : "general";
  const externalId = `GIFT-${safeGiftId}-${Date.now()}`;
  const payerName = donorName && donorName.trim() ? donorName.trim().slice(0, 30) : "Tamu Undangan";

  try {
    // ==========================================
    // 1. PEMBAYARAN VIA QRIS (DYNAMIC QR CODE)
    // ==========================================
    if (paymentMethod === "QRIS") {
      const qrRes = await fetch("https://api.xendit.co/qr_codes", {
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
          "api-version": "2022-07-31",
        },
        body: JSON.stringify({
          reference_id: externalId,
          type: "DYNAMIC",
          currency: "IDR",
          amount: Number(amount),
        }),
      });

      const qrData = await qrRes.json();
      if (!qrRes.ok) {
        console.error("Xendit QRIS Error:", qrData);
        throw new Error(qrData?.message || "Gagal membuat kode QRIS");
      }

      return res.status(200).json({
        type: "QRIS",
        externalId,
        amount: Number(amount),
        qrString: qrData.qr_string,
        qrId: qrData.id,
      });
    }

    // ====================================================
    // 2. PEMBAYARAN VIA VIRTUAL ACCOUNT (BCA, MANDIRI, DLL)
    // ====================================================
    if (paymentMethod === "VIRTUAL_ACCOUNT") {
      const selectedBank = (bankCode || "BCA").toUpperCase();
      const expiresAt = new Date(Date.now() + 24 * 3600 * 1000).toISOString();

      const vaRes = await fetch("https://api.xendit.co/callback_virtual_accounts", {
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          external_id: externalId,
          bank_code: selectedBank,
          name: payerName,
          is_closed: true,
          expected_amount: Number(amount),
          is_single_use: true,
          expiration_date: expiresAt,
        }),
      });

      const vaData = await vaRes.json();
      if (!vaRes.ok) {
        console.error("Xendit VA Error:", vaData);
        throw new Error(vaData?.message || "Gagal membuat Virtual Account");
      }

      return res.status(200).json({
        type: "VIRTUAL_ACCOUNT",
        externalId,
        bankCode: vaData.bank_code,
        accountNumber: vaData.account_number,
        amount: Number(amount),
        name: payerName,
        expiresAt: vaData.expiration_date,
      });
    }

    return res.status(400).json({ message: "Metode pembayaran tidak valid" });
  } catch (err) {
    console.error("Create Charge Error:", err);
    return res.status(500).json({ message: err?.message || "Gagal memproses pembayaran" });
  }
}
