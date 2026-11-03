/**
 * TEMPLATE CONFIGURATION - WEDDING DATA
 * ----------------------------------------------------
 * File ini adalah pusat konfigurasi seluruh konten website undangan.
 * Anda dapat mengganti nama mempelai, tanggal acara, lokasi Google Maps,
 * nomor rekening, foto galeri, hingga musik latar hanya dari file ini.
 */

export const weddingData = {
  // Informasi Mempelai Pria & Wanita
  couple: {
    title: "The Wedding of",
    groom: {
      shortName: "Resky",
      fullName: "Resky Oakwood, S.Kom.",
      title: "Putra Pertama dari",
      fatherName: "Bapak Gunawan Oakwood",
      motherName: "Ibu Sri Maple",
      instagram: "reskyoak",
      photo:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=700&q=80",
      bio: "Seorang pengembara teknologi yang akhirnya menemukan pelabuhan terakhirnya di hati sang bidadari.",
    },
    bride: {
      shortName: "Hana",
      fullName: "Hana Tulip, S.T.",
      title: "Putri Kedua dari",
      fatherName: "Bapak Ahmad Tulip",
      motherName: "Ibu Siti Rose",
      instagram: "hanatulip",
      photo:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80",
      bio: "Pecinta seni dan kesederhanaan yang percaya bahwa cinta sejati selalu menemukan jalannya pulang.",
    },
  },

  // Foto Utama & Cover
  media: {
    coverImage:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
    bgPattern:
      "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=1000&q=80",
    musicUrl:
      "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-113264.mp3",
    musicTitle: "Romantic Wedding Melody",
  },

  // Ayat / Kutipan Cinta Pembuka
  quote: {
    arabic:
      "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً",
    text: "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.",
    source: "QS. Ar-Rum: 21",
  },

  // Agenda Acara (Akad & Resepsi)
  events: {
    targetCountdown: "2026-12-25T08:00:00+07:00", // Format ISO
    akad: {
      number: "01",
      title: "Akad Nikah",
      dayName: "Jumat",
      dateFormatted: "25 Desember 2026",
      time: "08:00 - 10:00 WIB",
      venue: "Masjid Agung Baiturrahman",
      address: "Jl. Merdeka No. 1, Menteng, Jakarta Pusat",
      mapsUrl: "https://maps.google.com/?q=Masjid+Agung+Baiturrahman",
      calendarLink:
        "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Akad+Nikah+Resky+%26+Hana&dates=20261225T010000Z/20261225T030000Z&details=Pernikahan+Resky+%26+Hana&location=Masjid+Agung+Baiturrahman",
    },
    resepsi: {
      number: "02",
      title: "Resepsi Pernikahan",
      dayName: "Jumat",
      dateFormatted: "25 Desember 2026",
      time: "11:00 - 16:00 WIB",
      venue: "Gedung Kencana Ballroom",
      address: "Jl. Jend. Sudirman Kav. 45, Semanggi, Jakarta Selatan",
      mapsUrl: "https://maps.google.com/?q=Gedung+Kencana+Ballroom",
      calendarLink:
        "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Resepsi+Pernikahan+Resky+%26+Hana&dates=20261225T040000Z/20261225T090000Z&details=Resepsi+Pernikahan+Resky+%26+Hana&location=Gedung+Kencana+Ballroom",
    },
  },

  // Perjalanan Kisah Cinta (Love Story)
  story: [
    {
      year: "2020",
      title: "Pertama Bertemu",
      description:
        "Sebuah pertemuan tak terduga di sebuah seminar teknologi di Bandung yang menjadi awal mula obrolan panjang tanpa akhir.",
    },
    {
      year: "2023",
      title: "Komitmen Bersama",
      description:
        "Setelah melalui berbagai dinamika perjalanan, kami memutuskan untuk saling menggenggam dan melangkah ke arah masa depan yang sama.",
    },
    {
      year: "2026",
      title: "Menuju Hari Bahagia",
      description:
        "Dengan penuh keyakinan dan restu kedua orang tua, kami mengikat janji suci untuk saling menyempurnakan ibadah terpanjang.",
    },
  ],

  // Galeri Foto Prewedding
  gallery: [
    {
      url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80",
      caption: "Cinta Dalam Keheningan",
    },
    {
      url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80",
      caption: "Langkah Pertama",
    },
    {
      url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=900&q=80",
      caption: "Tawa dan Peluk",
    },
    {
      url: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=80",
      caption: "Menatap Masa Depan",
    },
    {
      url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=900&q=80",
      caption: "Satu Detak Jantung",
    },
    {
      url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=80",
      caption: "Menuju Pelaminan",
    },
  ],

  // Rekening Bank & Kirim Kado Fisik
  gift: {
    shippingAddress: {
      recipient: "Hana Tulip / Resky Oakwood",
      phone: "+62 812-3456-7890",
      address:
        "Cluster Asri Indah Blok B3 No. 12, Jl. Kenanga Raya, Bintaro Sektor 9, Tangerang Selatan 15229",
      notes: "Mohon konfirmasi via WhatsApp sebelum pengiriman kurir.",
    },
    directAccounts: [
      {
        bankName: "BCA",
        accountNumber: "8410293812",
        accountHolder: "Resky Oakwood",
        logo: "🏦",
      },
      {
        bankName: "Mandiri",
        accountNumber: "1370019283019",
        accountHolder: "Hana Tulip",
        logo: "🏛️",
      },
    ],
  },
};
