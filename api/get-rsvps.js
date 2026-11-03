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
    return res.status(200).json({ rsvps: [] });
  }

  const supabaseUrl = formatSupabaseUrl(rawUrl);

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/rsvps?select=*&order=created_at.desc&limit=50`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      }
    );

    if (!response.ok) {
      return res.status(200).json({ rsvps: [] });
    }

    const data = await response.json();
    return res.status(200).json({ rsvps: data || [] });
  } catch (error) {
    console.warn("Get RSVPs Error:", error);
    return res.status(200).json({ rsvps: [] });
  }
}
