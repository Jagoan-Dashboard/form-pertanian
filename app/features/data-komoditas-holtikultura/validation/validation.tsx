import { z } from "zod";

// Validation schema for Data Komoditas Hortikultura form
export const dataKomoditasHortikulturaSchema = z.object({
  // Discriminator for union
  komoditas: z.literal("hortikultura"),

  // Data Komoditas Section
  horti_commodity: z
    .string()
    .min(1, "Jenis Hortikultura yang Ditanam wajib dipilih"),

  horti_sub_commodity: z
    .string()
    .min(1, "Komoditas Hortikultura yang Ditanam wajib dipilih"),

  horti_land_status: z
    .string()
    .min(1, "Status Lahan wajib dipilih"),

  horti_land_area: z
    .string()
    .min(1, "Luas Lahan wajib diisi")
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num > 0;
      },
      "Luas Lahan harus berupa angka positif"
    ),

  horti_growth_phase: z
    .string()
    .min(1, "Fase Pertumbuhan wajib dipilih"),

  horti_plant_age: z
    .string()
    .min(1, "Umur Tanaman wajib diisi")
    .refine(
      (val) => {
        const num = parseInt(val);
        return !isNaN(num) && num > 0;
      },
      "Umur Tanaman harus berupa angka positif"
    ),

  horti_planting_date: z
    .date({
      message: "Tanggal Tanam wajib dipilih dan harus berupa tanggal yang valid"
    })
    .refine(
      (date) => date <= new Date(),
      "Tanggal Tanam tidak boleh di masa depan"
    ),

  horti_harvest_date: z
    .date({
      message: "Tanggal Perkiraan Panen wajib dipilih dan harus berupa tanggal yang valid"
    }),

  post_harvest_problems: z
    .string()
    .min(1, "Keterangan Tanam/Panen wajib dipilih"),

  horti_technology: z
    .string()
    .min(1, "Teknologi/Metode wajib dipilih"),

  horti_delay_reason: z
    .string()
    .min(1, "Masalah Pascapanen wajib dipilih"),

  photos: z
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
  has_pest_disease: z
    .string()
    .min(1, "Ada Serangan Hama/Penyakit wajib dipilih"),

  pest_disease_type: z
    .string()
    .min(1, "Jenis Hama/Penyakit Dominan wajib dipilih"),

  affected_area: z
    .string()
    .min(1, "Luas Terserang Hama wajib dipilih"),

  pest_control_action: z
    .string()
    .min(1, "Tindakan Pengendalian Hama wajib dipilih"),

  weather_condition: z
    .string()
    .min(1, "Cuaca 7 Hari Terakhir wajib dipilih"),

  weather_impact: z
    .string()
    .min(1, "Dampak Cuaca wajib dipilih"),
}).refine(
  (data) => {
    // Custom validation: Tanggal panen harus setelah tanggal tanam
    if (data.horti_planting_date && data.horti_harvest_date) {
      return data.horti_harvest_date > data.horti_planting_date;
    }
    return true;
  },
  {
    message: "Tanggal Perkiraan Panen harus setelah Tanggal Tanam",
    path: ["horti_harvest_date"],
  }
).refine(
  (data) => {
    // Conditional validation: Jika ada serangan hama, harus pilih jenis dan tindakan
    if (data.has_pest_disease === "ya") {
      return data.pest_disease_type && data.affected_area && data.pest_control_action;
    }
    return true;
  },
  {
    message: "Jika ada serangan hama, semua field terkait hama wajib diisi",
    path: ["pest_disease_type"],
  }
).refine(
  (data) => {
    // Validation: Umur tanaman harus sesuai dengan rentang tanggal tanam
    if (data.horti_planting_date && data.horti_plant_age) {
      const umurHari = parseInt(data.horti_plant_age);
      const tanggalTanam = new Date(data.horti_planting_date);
      const today = new Date();
      const selisihHari = Math.floor((today.getTime() - tanggalTanam.getTime()) / (1000 * 60 * 60 * 24));
      
      // Toleransi +/- 7 hari
      return Math.abs(umurHari - selisihHari) <= 7;
    }
    return true;
  },
  {
    message: "Umur tanaman tidak sesuai dengan tanggal tanam. Periksa kembali data yang dimasukkan",
    path: ["horti_plant_age"],
  }
).refine(
  (data) => {
    // Conditional validation: Jenis dan komoditas hortikultura harus sesuai
    const validCombinations = {
      "sayuran": ["tomat", "cabai", "sawi", "bayam", "kangkung", "terong"],
      "buah": ["jeruk", "mangga", "apel", "pisang", "pepaya", "jambu"],
      "tanaman-hias": ["mawar", "anggrek", "melati", "kamboja", "bougenville"]
    };
    
    if (data.horti_commodity && data.horti_sub_commodity) {
      const validKomoditas = validCombinations[data.horti_commodity as keyof typeof validCombinations];
      if (validKomoditas && !validKomoditas.includes(data.horti_sub_commodity)) {
        return false;
      }
    }
    return true;
  },
  {
    message: "Komoditas yang dipilih tidak sesuai dengan jenis hortikultura",
    path: ["horti_sub_commodity"],
  }
);

export type DataKomoditasHortikulturaFormData = z.infer<typeof dataKomoditasHortikulturaSchema>;

// Optional: Individual field validations for real-time validation
export const fieldValidations = {
  horti_commodity: z.string().min(1, "Jenis Hortikultura yang Ditanam wajib dipilih"),
  horti_sub_commodity: z.string().min(1, "Komoditas Hortikultura yang Ditanam wajib dipilih"),
  horti_land_status: z.string().min(1, "Status Lahan wajib dipilih"),
  horti_land_area: z.string().min(1, "Luas Lahan wajib diisi").refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
    "Luas Lahan harus berupa angka positif"
  ),
  horti_growth_phase: z.string().min(1, "Fase Pertumbuhan wajib dipilih"),
  horti_plant_age: z.string().min(1, "Umur Tanaman wajib diisi").refine(
    (val) => !isNaN(parseInt(val)) && parseInt(val) > 0,
    "Umur Tanaman harus berupa angka positif"
  ),
  horti_planting_date: z.date({ message: "Tanggal Tanam wajib dipilih" }),
  horti_harvest_date: z.date({ message: "Tanggal Perkiraan Panen wajib dipilih" }),
  post_harvest_problems: z.string().min(1, "Keterangan Tanam/Panen wajib dipilih"),
  horti_technology: z.string().min(1, "Teknologi/Metode wajib dipilih"),
  horti_delay_reason: z.string().min(1, "Masalah Pascapanen wajib dipilih"),
  has_pest_disease: z.string().min(1, "Ada Serangan Hama/Penyakit wajib dipilih"),
  pest_disease_type: z.string().min(1, "Jenis Hama/Penyakit Dominan wajib dipilih"),
  affected_area: z.string().min(1, "Luas Terserang Hama wajib dipilih"),
  pest_control_action: z.string().min(1, "Tindakan Pengendalian Hama wajib dipilih"),
  weather_condition: z.string().min(1, "Cuaca 7 Hari Terakhir wajib dipilih"),
  weather_impact: z.string().min(1, "Dampak Cuaca wajib dipilih"),
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