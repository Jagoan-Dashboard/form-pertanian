import { z } from "zod";

// Validation schema for Data Komoditas Hortikultura form
export const dataKomoditasHortikulturaSchema = z.object({
  // Data Komoditas Section
  jenisHortikultura: z
    .string()
    .min(1, "Jenis Hortikultura yang Ditanam wajib dipilih"),

  komoditasHortikultura: z
    .string()
    .min(1, "Komoditas Hortikultura yang Ditanam wajib dipilih"),

  statusLahan: z
    .string()
    .min(1, "Status Lahan wajib dipilih"),

  luasLahan: z
    .string()
    .min(1, "Luas Lahan wajib diisi")
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num > 0;
      },
      "Luas Lahan harus berupa angka positif"
    ),

  fasePertumbuhan: z
    .string()
    .min(1, "Fase Pertumbuhan wajib dipilih"),

  umurTanaman: z
    .string()
    .min(1, "Umur Tanaman wajib diisi")
    .refine(
      (val) => {
        const num = parseInt(val);
        return !isNaN(num) && num > 0;
      },
      "Umur Tanaman harus berupa angka positif"
    ),

  tanggalTanam: z
    .date({
      message: "Tanggal Tanam wajib dipilih dan harus berupa tanggal yang valid"
    })
    .refine(
      (date) => date <= new Date(),
      "Tanggal Tanam tidak boleh di masa depan"
    ),

  tanggalPerkiraanPanen: z
    .date({
      message: "Tanggal Perkiraan Panen wajib dipilih dan harus berupa tanggal yang valid"
    }),

  keteranganTanamPanen: z
    .string()
    .min(1, "Keterangan Tanam/Panen wajib dipilih"),

  teknologiMetode: z
    .string()
    .min(1, "Teknologi/Metode wajib dipilih"),

  masalahPascapanen: z
    .string()
    .min(1, "Masalah Pascapanen wajib dipilih"),

  fotoLokasi: z
    .any()
    .refine(
      (file) => file instanceof File || file === null || file === undefined,
      "Foto Lokasi harus berupa file gambar"
    )
    .refine(
      (file) => {
        if (!file) return false; // Required field
        return file.size <= 5 * 1024 * 1024; // 5MB max
      },
      "Ukuran foto tidak boleh lebih dari 5MB"
    )
    .refine(
      (file) => {
        if (!file) return false;
        return ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type);
      },
      "Format foto harus JPG, JPEG, atau PNG"
    ),

  // Laporan Hama, Penyakit, dan Keadaan Cuaca Section
  adaSeranganHama: z
    .string()
    .min(1, "Ada Serangan Hama/Penyakit wajib dipilih"),

  jenisHamaPenyakit: z
    .string()
    .min(1, "Jenis Hama/Penyakit Dominan wajib dipilih"),

  luasSeranganHama: z
    .string()
    .min(1, "Luas Terserang Hama wajib dipilih"),

  tindakanPengendalianHama: z
    .string()
    .min(1, "Tindakan Pengendalian Hama wajib dipilih"),

  cuaca7Hari: z
    .string()
    .min(1, "Cuaca 7 Hari Terakhir wajib dipilih"),

  dampakCuaca: z
    .string()
    .min(1, "Dampak Cuaca wajib dipilih"),
}).refine(
  (data) => {
    // Custom validation: Tanggal panen harus setelah tanggal tanam
    if (data.tanggalTanam && data.tanggalPerkiraanPanen) {
      return data.tanggalPerkiraanPanen > data.tanggalTanam;
    }
    return true;
  },
  {
    message: "Tanggal Perkiraan Panen harus setelah Tanggal Tanam",
    path: ["tanggalPerkiraanPanen"],
  }
).refine(
  (data) => {
    // Conditional validation: Jika ada serangan hama, harus pilih jenis dan tindakan
    if (data.adaSeranganHama === "ya") {
      return data.jenisHamaPenyakit && data.luasSeranganHama && data.tindakanPengendalianHama;
    }
    return true;
  },
  {
    message: "Jika ada serangan hama, semua field terkait hama wajib diisi",
    path: ["jenisHamaPenyakit"],
  }
).refine(
  (data) => {
    // Validation: Umur tanaman harus sesuai dengan rentang tanggal tanam
    if (data.tanggalTanam && data.umurTanaman) {
      const umurHari = parseInt(data.umurTanaman);
      const tanggalTanam = new Date(data.tanggalTanam);
      const today = new Date();
      const selisihHari = Math.floor((today.getTime() - tanggalTanam.getTime()) / (1000 * 60 * 60 * 24));
      
      // Toleransi +/- 7 hari
      return Math.abs(umurHari - selisihHari) <= 7;
    }
    return true;
  },
  {
    message: "Umur tanaman tidak sesuai dengan tanggal tanam. Periksa kembali data yang dimasukkan",
    path: ["umurTanaman"],
  }
).refine(
  (data) => {
    // Conditional validation: Jenis dan komoditas hortikultura harus sesuai
    const validCombinations = {
      "sayuran": ["tomat", "cabai", "sawi", "bayam", "kangkung", "terong"],
      "buah": ["jeruk", "mangga", "apel", "pisang", "pepaya", "jambu"],
      "tanaman-hias": ["mawar", "anggrek", "melati", "kamboja", "bougenville"]
    };
    
    if (data.jenisHortikultura && data.komoditasHortikultura) {
      const validKomoditas = validCombinations[data.jenisHortikultura as keyof typeof validCombinations];
      if (validKomoditas && !validKomoditas.includes(data.komoditasHortikultura)) {
        return false;
      }
    }
    return true;
  },
  {
    message: "Komoditas yang dipilih tidak sesuai dengan jenis hortikultura",
    path: ["komoditasHortikultura"],
  }
);

export type DataKomoditasHortikulturaFormData = z.infer<typeof dataKomoditasHortikulturaSchema>;

// Optional: Individual field validations for real-time validation
export const fieldValidations = {
  jenisHortikultura: z.string().min(1, "Jenis Hortikultura yang Ditanam wajib dipilih"),
  komoditasHortikultura: z.string().min(1, "Komoditas Hortikultura yang Ditanam wajib dipilih"),
  statusLahan: z.string().min(1, "Status Lahan wajib dipilih"),
  luasLahan: z.string().min(1, "Luas Lahan wajib diisi").refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
    "Luas Lahan harus berupa angka positif"
  ),
  fasePertumbuhan: z.string().min(1, "Fase Pertumbuhan wajib dipilih"),
  umurTanaman: z.string().min(1, "Umur Tanaman wajib diisi").refine(
    (val) => !isNaN(parseInt(val)) && parseInt(val) > 0,
    "Umur Tanaman harus berupa angka positif"
  ),
  tanggalTanam: z.date({ message: "Tanggal Tanam wajib dipilih" }),
  tanggalPerkiraanPanen: z.date({ message: "Tanggal Perkiraan Panen wajib dipilih" }),
  keteranganTanamPanen: z.string().min(1, "Keterangan Tanam/Panen wajib dipilih"),
  teknologiMetode: z.string().min(1, "Teknologi/Metode wajib dipilih"),
  masalahPascapanen: z.string().min(1, "Masalah Pascapanen wajib dipilih"),
  adaSeranganHama: z.string().min(1, "Ada Serangan Hama/Penyakit wajib dipilih"),
  jenisHamaPenyakit: z.string().min(1, "Jenis Hama/Penyakit Dominan wajib dipilih"),
  luasSeranganHama: z.string().min(1, "Luas Terserang Hama wajib dipilih"),
  tindakanPengendalianHama: z.string().min(1, "Tindakan Pengendalian Hama wajib dipilih"),
  cuaca7Hari: z.string().min(1, "Cuaca 7 Hari Terakhir wajib dipilih"),
  dampakCuaca: z.string().min(1, "Dampak Cuaca wajib dipilih"),
};

// Helper function for conditional validation based on jenis hortikultura
export const getKomoditasOptions = (jenisHortikultura: string) => {
  const komoditasOptions = {
    "sayuran": [
      { value: "tomat", label: "Tomat" },
      { value: "cabai", label: "Cabai" },
      { value: "sawi", label: "Sawi" },
      { value: "bayam", label: "Bayam" },
      { value: "kangkung", label: "Kangkung" },
      { value: "terong", label: "Terong" }
    ],
    "buah": [
      { value: "jeruk", label: "Jeruk" },
      { value: "mangga", label: "Mangga" },
      { value: "apel", label: "Apel" },
      { value: "pisang", label: "Pisang" },
      { value: "pepaya", label: "Pepaya" },
      { value: "jambu", label: "Jambu" }
    ],
    "tanaman-hias": [
      { value: "mawar", label: "Mawar" },
      { value: "anggrek", label: "Anggrek" },
      { value: "melati", label: "Melati" },
      { value: "kamboja", label: "Kamboja" },
      { value: "bougenville", label: "Bougenville" }
    ]
  };
  
  return komoditasOptions[jenisHortikultura as keyof typeof komoditasOptions] || [];
};

// Helper function for conditional field validation
export const validateConditionalFields = (adaSeranganHama: string, jenisHamaPenyakit: string, luasSeranganHama: string, tindakanPengendalianHama: string) => {
  if (adaSeranganHama === "ya") {
    const errors: Record<string, string> = {};
    
    if (!jenisHamaPenyakit) {
      errors.jenisHamaPenyakit = "Jenis Hama/Penyakit Dominan wajib diisi jika ada serangan";
    }
    if (!luasSeranganHama) {
      errors.luasSeranganHama = "Luas Terserang Hama wajib diisi jika ada serangan";
    }
    if (!tindakanPengendalianHama) {
      errors.tindakanPengendalianHama = "Tindakan Pengendalian Hama wajib diisi jika ada serangan";
    }
    
    return errors;
  }
  return {};
};