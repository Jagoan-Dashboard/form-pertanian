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

  horti_land_area: z.number({
    message: "Luas Lahan wajib diisi dan harus berupa angka"
  }).positive("Luas lahan harus lebih dari 0"),

  horti_growth_phase: z
    .string()
    .min(1, "Fase Pertumbuhan wajib dipilih"),

  horti_plant_age: z.number({
    message: "Umur tanaman wajib diisi dan harus berupa angka"
  }).positive("Umur tanaman harus lebih dari 0"),

  horti_planting_date: z.string().nonempty("Tanggal Tanam wajib dipilih"),

  horti_harvest_date: z.string().nonempty("Tanggal Perkiraan Panen wajib dipilih"),

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
  has_pest_disease: z.boolean({
    message: "Ada Serangan Hama wajib dipilih"
  }),

  pest_disease_type: z.string().optional(),

  affected_area: z.string().optional(),

  pest_control_action: z.string().optional(),

  weather_condition: z
    .string()
    .min(1, "Cuaca 7 Hari Terakhir wajib dipilih"),

  weather_impact: z
    .string()
    .min(1, "Dampak Cuaca wajib dipilih"),
}).refine((data) => {
  if (data.has_pest_disease === true) {
    return !!data.pest_disease_type && data.affected_area !== undefined && !!data.pest_control_action;
  }
  return true;
}, {
  message: "Jika ada serangan hama, semua field terkait wajib diisi",
  path: ["pest_disease_type"],
});

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