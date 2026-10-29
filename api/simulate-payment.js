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
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const secretKey = process.env.XENDIT_SECRET_KEY;
  if (!secretKey) {
    return res.status(500).json({ message: "XENDIT_SECRET_KEY missing" });
  }

  const authHeader = "Basic " + Buffer.from(secretKey + ":").toString("base64");
  const { type, externalId, qrId, amount } = req.body || {};
  const targetId = externalId || qrId;
  const finalAmount = Number(amount || 0);

  try {
    let xenditResponse = null;

    // 1. Panggil Endpoint Simulator Xendit
    if (type === "QRIS" && targetId) {
      const simRes = await fetch(`https://api.xendit.co/qr_codes/${targetId}/payments/simulate`, {
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
      });
      xenditResponse = await simRes.json();
    } else if (type === "VIRTUAL_ACCOUNT" && targetId) {
      const simRes = await fetch(
        `https://api.xendit.co/callback_virtual_accounts/external_id=${targetId}/simulate_payment`,
        {
          method: "POST",
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount: finalAmount }),
        }
      );
      xenditResponse = await simRes.json();
    }

    // 2. Update Supabase Langsung (Jaminan Realtime untuk Pengujian)
    const rawUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    if (rawUrl && supabaseKey && targetId && targetId.startsWith("GIFT-")) {
      const supabaseUrl = formatSupabaseUrl(rawUrl);
      const parts = targetId.split("-");
      let giftId = null;
      if (parts.length >= 3) {
        giftId = parts.slice(1, -1).join("-");
      }

      if (giftId) {
        // Ambil data kado sekarang
        const getRes = await fetch(`${supabaseUrl}/rest/v1/gifts?id=eq.${giftId}&select=id,collected`, {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
        });

        if (getRes.ok) {
          const gifts = await getRes.json();
          if (gifts && gifts.length > 0) {
            const currentCollected = Number(gifts[0].collected || 0);
            const newCollected = currentCollected + finalAmount;

            await fetch(`${supabaseUrl}/rest/v1/gifts?id=eq.${giftId}`, {
              method: "PATCH",
              headers: {
                apikey: supabaseKey,
                Authorization: `Bearer ${supabaseKey}`,
                "Content-Type": "application/json",
                Prefer: "return=representation",
              },
              body: JSON.stringify({ collected: newCollected }),
            });
            console.log(`[Simulator] Supabase kado ${giftId} diupdate ke: Rp ${newCollected}`);
          }
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: "Simulasi pembayaran berhasil diproses",
      xendit: xenditResponse,
    });
  } catch (err) {
    console.error("Simulate Payment Error:", err);
    return res.status(500).json({ message: err?.message || "Gagal simulasi" });
  }
}
