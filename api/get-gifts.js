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
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const rawUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  if (!rawUrl || !supabaseKey) {
    return res.status(500).json({ message: "Supabase environment variables belum diatur." });
  }

  const supabaseUrl = formatSupabaseUrl(rawUrl);

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/gifts?select=*&order=target.desc`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Supabase error: ${response.status} ${await response.text()}`);
    }

    const data = await response.json();
    return res.status(200).json({ gifts: data });
  } catch (error) {
    console.error("Get Gifts Error:", error);
    return res.status(500).json({ message: error?.message || "Gagal mengambil data kado." });
  }
}
