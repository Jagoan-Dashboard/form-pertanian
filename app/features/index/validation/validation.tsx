import { z } from "zod";

// Validation schema for the IndexView form data
export const indexViewSchema = z.object({
  // Coordinates validation
  lat: z
    .string()
    .min(1, "Latitude wajib diisi")
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num >= -90 && num <= 90;
      },
      "Latitude harus berupa angka antara -90 dan 90"
    ),

  long: z
    .string()
    .min(1, "Longitude wajib diisi")
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num >= -180 && num <= 180;
      },
      "Longitude harus berupa angka antara -180 dan 180"
    ),

  // Data Penyuluh validation
  extension_officer: z
    .string()
    .min(1, "Nama Penyuluh wajib diisi")
    .max(100, "Nama Penyuluh tidak boleh lebih dari 100 karakter")
    .regex(/^[a-zA-Z\s\u00C0-\u017F\u0100-\u017F\u1E00-\u1EFF]*$/,
      "Nama Penyuluh hanya boleh berisi huruf dan spasi"
    ),

  visit_date: z
    .string()
    .min(1, "Tanggal Kunjungan wajib dipilih")
    .refine(
      (val) => {
        const date = new Date(val);
        return !isNaN(date.getTime()) && date <= new Date();
      },
      "Tanggal Kunjungan tidak boleh di masa depan"
    ),

  farmer_name: z
    .string()
    .min(1, "Nama Petani wajib diisi")
    .max(100, "Nama Petani tidak boleh lebih dari 100 karakter")
    .regex(/^[\p{L}\s'.-]+$/u, "Nama hanya boleh huruf, spasi, titik, apostrof, dan tanda hubung"),

  farmer_group: z
    .string()
    .min(1, "Nama Kelompok Tani wajib diisi")
    .max(100, "Nama Kelompok Tani tidak boleh lebih dari 100 karakter")
    .regex(/^[\p{L}\s'.-]+$/u,
      "Nama Kelompok Tani hanya boleh berisi huruf, angka, spasi, tanda hubung, dan titik"
    ),

  village: z
    .string()
    .min(1, "Desa wajib dipilih"),

  district: z
    .string()
    .min(1, "Kecamatan wajib dipilih"),
});

export type IndexViewFormData = z.infer<typeof indexViewSchema>;