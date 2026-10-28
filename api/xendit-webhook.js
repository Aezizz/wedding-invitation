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

  const { status, external_id, externalId, amount, paid_amount } = body || {};
  const currentExternalId = external_id || externalId;
  const finalAmount = Number(paid_amount || amount || 0);

  console.log(`[Webhook] Menerima notifikasi Xendit: ExternalID=${currentExternalId}, Status=${status}, Amount=${finalAmount}`);

  // Hanya proses jika status transaksi sudah dibayar (PAID atau SETTLED)
  if (status === "PAID" || status === "SETTLED") {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("[Webhook] Supabase environment variables belum diatur.");
      return res.status(500).json({ message: "Database config missing" });
    }

    try {
      // Ambil giftId dari format: GIFT-<giftId>-<timestamp>
      // Contoh: GIFT-smart-tv-1729019283
      let giftId = null;
      if (currentExternalId && currentExternalId.startsWith("GIFT-")) {
        const parts = currentExternalId.split("-");
        // Jika ada 3 bagian atau lebih (karena giftId bisa mengandung strip, misal smart-tv)
        // Ambil elemen antara "GIFT" dan timestamp terakhir
        if (parts.length >= 3) {
          giftId = parts.slice(1, -1).join("-");
        }
      }

      if (!giftId) {
        console.warn(`[Webhook] Tidak dapat mengekstrak giftId dari ExternalID: ${currentExternalId}`);
        return res.status(200).json({ message: "Invoice processed without gift assignment" });
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

  // Jika status bukan PAID (misal EXPIRED atau PENDING), cukup respon 200 OK
  return res.status(200).json({ message: `Status ${status} diabaikan (hanya memproses PAID/SETTLED)` });
}
