import { z } from "zod";

// Validation schema for Data Komoditas Pangan form
export const dataKomoditasPanganSchema = z.object({
  komoditas: z.literal("pangan"),
  food_commodity: z.string().nonempty("Komoditas Pangan wajib dipilih"),
  food_land_status: z.string().nonempty("Status Lahan wajib dipilih"),
  food_land_area: z.number({
    message: "Luas Lahan wajib diisi dan harus berupa angka"
  }).positive("Luas lahan harus lebih dari 0"),

  food_growth_phase: z.string().nonempty("Fase Pertumbuhan wajib dipilih"),
  food_plant_age: z.number({
    message: "Umur tanaman wajib diisi dan harus berupa angka"
  }).positive("Umur tanaman harus lebih dari 0"),


  food_technology: z.string().nonempty("Teknologi/Metode wajib dipilih"),

  food_planting_date: z.string().nonempty("Tanggal Tanam wajib dipilih"),

  food_harvest_date: z.string().nonempty("Tanggal Perkiraan Panen wajib dipilih"),

  food_delay_reason: z.string().nonempty("Keterangan wajib diisi"),

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

  has_pest_disease: z.boolean({
    message: "Ada Serangan Hama wajib dipilih"
  }),
  pest_disease_type: z.string().optional(),
  affected_area: z.number().optional(),
  pest_control_action: z.string().optional(),

  weather_condition: z.string().nonempty("Cuaca 7 Hari wajib dipilih"),
  weather_impact: z.string().nonempty("Dampak Cuaca wajib dipilih"),
})
  .refine((data) => {
    if (data.has_pest_disease === true) {
      return !!data.pest_disease_type && data.affected_area !== undefined && !!data.pest_control_action;
    }
    return true;
  }, {
    message: "Jika ada serangan hama, semua field terkait wajib diisi",
    path: ["pest_disease_type"],
  });
