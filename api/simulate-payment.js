export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const secretKey = process.env.XENDIT_SECRET_KEY;
  if (!secretKey) {
    return res.status(500).json({ message: "XENDIT_SECRET_KEY missing" });
  }

  const authHeader = "Basic " + Buffer.from(secretKey + ":").toString("base64");
  const { type, qrId, externalId, amount } = req.body || {};

  try {
    if (type === "QRIS" && qrId) {
      const simRes = await fetch(`https://api.xendit.co/qr_codes/${qrId}/payments/simulate`, {
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
      });
      const simData = await simRes.json();
      return res.status(200).json(simData);
    }

    if (type === "VIRTUAL_ACCOUNT" && externalId) {
      const simRes = await fetch(
        `https://api.xendit.co/callback_virtual_accounts/external_id=${externalId}/simulate_payment`,
        {
          method: "POST",
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount: Number(amount) }),
        }
      );
      const simData = await simRes.json();
      return res.status(200).json(simData);
    }

    return res.status(400).json({ message: "Parameter simulasi tidak valid" });
  } catch (err) {
    console.error("Simulate Payment Error:", err);
    return res.status(500).json({ message: err?.message || "Gagal simulasi" });
  }
}
