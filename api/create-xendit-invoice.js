import XenditModule from "xendit-node";

// Dukungan kompatibilitas multi-export ESM / CommonJS untuk xendit-node
const Xendit =
  XenditModule?.Xendit ||
  XenditModule?.default?.Xendit ||
  (typeof XenditModule === "function" ? XenditModule : null);

let cachedClient = null;

function getXenditClient() {
  const secretKey = process.env.XENDIT_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Environment variable XENDIT_SECRET_KEY belum diatur.");
  }
  if (!cachedClient) {
    cachedClient = new Xendit({ secretKey });
  }
  return cachedClient;
}

export default async function handler(req, res) {
  // Hanya izinkan HTTP method POST
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Handle parsing body jika diterima sebagai string atau objek
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ message: "Invalid JSON body" });
    }
  }

  const { amount, giftTitle, donorName, giftId } = body || {};

  if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
    return res.status(400).json({ message: "Nominal patungan tidak valid" });
  }

  const protocol = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const origin =
    req.headers.origin || (host ? `${protocol}://${host}` : "http://localhost:5173");

  const safeGiftId = giftId ? String(giftId).replace(/[^a-zA-Z0-9_-]/g, "") : "general";
  const externalId = `GIFT-${safeGiftId}-${Date.now()}`;
  const payerName = donorName && donorName.trim() ? donorName.trim() : "Tamu Undangan";
  const description = `Patungan Hadiah ${giftTitle || "Pernikahan"} oleh ${payerName}`;

  try {
    const x = getXenditClient();
    const { Invoice } = x;
    let response;

    // Kompatibilitas untuk versi xendit-node lama (v1/v2 constructor) dan baru (v3+/v7+ instance)
    if (typeof Invoice === "function") {
      const invoiceInstance = new Invoice({});
      response = await invoiceInstance.createInvoice({
        externalID: externalId,
        amount: Number(amount),
        payerEmail: "tamu@undangan.com",
        description,
        customer: {
          givenNames: payerName,
        },
        successRedirectURL: `${origin}/?status=success`,
        failureRedirectURL: `${origin}/?status=failed`,
      });
    } else if (Invoice && typeof Invoice.createInvoice === "function") {
      response = await Invoice.createInvoice({
        data: {
          externalId,
          amount: Number(amount),
          payerEmail: "tamu@undangan.com",
          description,
          customer: {
            givenNames: payerName,
          },
          currency: "IDR",
          invoiceDuration: 86400,
          successRedirectUrl: `${origin}/?status=success`,
          failureRedirectUrl: `${origin}/?status=failed`,
        },
      });
    } else {
      throw new Error("Layanan Xendit Invoice tidak dapat diinisialisasi.");
    }

    const invoiceUrl = response?.invoiceUrl || response?.invoice_url;

    if (!invoiceUrl) {
      throw new Error("Gagal memperoleh tautan invoice dari Xendit.");
    }

    return res.status(200).json({ invoiceUrl });
  } catch (error) {
    console.error("Xendit Invoice Error:", error);
    return res.status(500).json({
      message: error?.message || "Terjadi kesalahan internal pada server saat memproses invoice.",
    });
  }
}
