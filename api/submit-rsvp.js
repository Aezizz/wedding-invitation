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

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ message: "Invalid JSON" });
    }
  }

  const { name, attendance, message } = body || {};
  if (!name || !message) {
    return res.status(400).json({ message: "Nama dan ucapan wajib diisi" });
  }

  const rawUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  if (rawUrl && supabaseKey) {
    const supabaseUrl = formatSupabaseUrl(rawUrl);
    try {
      await fetch(`${supabaseUrl}/rest/v1/rsvps`, {
        method: "POST",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          name: name.trim().slice(0, 60),
          attendance: attendance || "Hadir",
          message: message.trim().slice(0, 500),
          created_at: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.warn("[RSVP Supabase Error]:", err);
    }
  }

  return res.status(200).json({
    success: true,
    message: "Terima kasih atas doa dan konfirmasinya!",
    rsvp: { name, attendance, message, created_at: new Date().toISOString() },
  });
}
