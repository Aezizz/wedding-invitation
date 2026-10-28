export const submitRSVP = async (data) => {
  // Simulasi network latency 1 detik
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Nanti tinggal ganti dengan: fetch('URL_API_KAMU', { method: 'POST', body: JSON.stringify(data) })
  console.log("Data RSVP Berhasil Dikirim ke Adapter:", data);
  return { success: true, message: "Konfirmasi berhasil disimpan!" };
};
