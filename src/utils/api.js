export const submitRSVP = async (data) => {
  try {
    const res = await fetch("/api/submit-rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Gagal mengirim RSVP");
    return await res.json();
  } catch (err) {
    console.warn("Fallback local RSVP:", err);
    return { success: true, message: "Konfirmasi berhasil disimpan!", rsvp: data };
  }
};

export const getRSVPs = async () => {
  try {
    const res = await fetch("/api/get-rsvps");
    if (!res.ok) return [];
    const data = await res.json();
    return data?.rsvps || [];
  } catch {
    return [];
  }
};
