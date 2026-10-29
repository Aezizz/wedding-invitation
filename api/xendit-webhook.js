function formatSupabaseUrl(url) {
  if (!url) return "";
  let clean = url.trim().replace(/\/$/, "");
  if (clean.includes("supabase.com/dashboard/project/")) {
    const projectId = clean.split("/project/")[1]?.split("/")[0];
    if (projectId) return `https://${projectId}.supabase.co`;
  }
  return clean;
}

export default async function handler(req, res) {
  // Hanya izinkan HTTP POST dari Xendit
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Verifikasi Callback Token (opsional jika diset di env)
  const callbackToken = process.env.XENDIT_CALLBACK_TOKEN;
  const headerToken = req.headers["x-callback-token"];
  if (callbackToken && headerToken && callbackToken !== headerToken) {
    console.warn("[Webhook] Callback token tidak valid!");
    return res.status(403).json({ message: "Invalid callback token" });
  }

  // Parsing payload
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ message: "Invalid JSON body" });
    }
  }

  // Deteksi tipe callback:
  // 1. QR Code Payment: event === 'qr.payment'
  // 2. Virtual Account Payment: memiliki payment_id / bank_code & account_number
  // 3. Invoice Payment: status === 'PAID' atau 'SETTLED'
  const isQrPayment = body?.event === "qr.payment";
  const isVaPayment = Boolean(body?.payment_id && body?.account_number) || Boolean(body?.bank_code && body?.account_number);
  const isInvoicePayment = body?.status === "PAID" || body?.status === "SETTLED";

  const isPaid = isQrPayment || isVaPayment || isInvoicePayment;

  // Ekstraksi External ID & Amount secara dinamis
  let currentExternalId =
    body?.external_id ||
    body?.externalId ||
    body?.reference_id ||
    body?.qr_code?.external_id ||
    body?.qr_code?.reference_id;

  let finalAmount = Number(
    body?.paid_amount ||
    body?.amount ||
    body?.qr_code?.amount ||
    0
  );

  console.log(`[Webhook] Notifikasi masuk: IsPaid=${isPaid}, ExternalID=${currentExternalId}, Amount=${finalAmount}`);

  // Hanya proses jika pembayaran valid
  if (isPaid && currentExternalId && finalAmount > 0) {
    const rawUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    if (!rawUrl || !supabaseKey) {
      console.error("[Webhook] Supabase environment variables belum diatur.");
      return res.status(500).json({ message: "Database config missing" });
    }

    const supabaseUrl = formatSupabaseUrl(rawUrl);

    try {
      // Ambil giftId dari format: GIFT-<giftId>-<timestamp>
      let giftId = null;
      if (currentExternalId.startsWith("GIFT-")) {
        const parts = currentExternalId.split("-");
        if (parts.length >= 3) {
          giftId = parts.slice(1, -1).join("-");
        }
      }

      if (!giftId) {
        console.warn(`[Webhook] Tidak dapat mengekstrak giftId dari ExternalID: ${currentExternalId}`);
        return res.status(200).json({ message: "Payment processed without gift assignment" });
      }

      // 1. Ambil data kado saat ini dari Supabase
      const getRes = await fetch(`${supabaseUrl}/rest/v1/gifts?id=eq.${giftId}&select=id,collected,title`, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      });

      if (!getRes.ok) {
        throw new Error(`Gagal membaca kado dari Supabase: ${getRes.status} ${await getRes.text()}`);
      }

      const gifts = await getRes.json();
      if (!gifts || gifts.length === 0) {
        console.warn(`[Webhook] Kado dengan ID '${giftId}' tidak ditemukan di tabel gifts.`);
        return res.status(200).json({ message: `Gift ${giftId} not found` });
      }

      const targetGift = gifts[0];
      const newCollected = Number(targetGift.collected || 0) + finalAmount;

      // 2. Perbarui kolom collected di Supabase
      const updateRes = await fetch(`${supabaseUrl}/rest/v1/gifts?id=eq.${giftId}`, {
        method: "PATCH",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({ collected: newCollected }),
      });

      if (!updateRes.ok) {
        throw new Error(`Gagal update Supabase: ${updateRes.status} ${await updateRes.text()}`);
      }

      console.log(`[Webhook] Berhasil update kado '${targetGift.title}'! Nominal baru: Rp ${newCollected}`);
      return res.status(200).json({
        success: true,
        message: `Kado ${giftId} berhasil diupdate ke Rp ${newCollected}`,
      });
    } catch (err) {
      console.error("[Webhook Error]:", err);
      return res.status(500).json({ message: err?.message || "Internal Server Error" });
    }
  }

  return res.status(200).json({ message: `Status diabaikan (hanya memproses event pembayaran lunas)` });
}
