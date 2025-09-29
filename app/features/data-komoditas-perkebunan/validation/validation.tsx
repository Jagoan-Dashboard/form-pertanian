import { z } from "zod";

// Validation schema for Data Komoditas Perkebunan form
export const dataKomoditasPerkebunanSchema = z.object({
  // Discriminator for union
  komoditas: z.literal("perkebunan"),

  // Data Komoditas Section
  komoditasPerkebunan: z
    .string()
    .min(1, "Komoditas Perkebunan yang Ditanam wajib dipilih"),

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

  teknologiMetode: z
    .string()
    .min(1, "Teknologi/Metode wajib dipilih"),

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

  keterlambatanTanamPanen: z
    .string()
    .min(1, "Keterlambatan Tanam/Panen wajib dipilih"),

  masalahProduksi: z
    .string()
    .min(1, "Masalah Produksi wajib dipilih"),

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
);

export type DataKomoditasPerkebunanFormData = z.infer<typeof dataKomoditasPerkebunanSchema>;

// Optional: Individual field validations for real-time validation
export const fieldValidations = {
  komoditasPerkebunan: z.string().min(1, "Komoditas Perkebunan yang Ditanam wajib dipilih"),
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
  teknologiMetode: z.string().min(1, "Teknologi/Metode wajib dipilih"),
  tanggalTanam: z.date({ message: "Tanggal Tanam wajib dipilih" }),
  tanggalPerkiraanPanen: z.date({ message: "Tanggal Perkiraan Panen wajib dipilih" }),
  keterlambatanTanamPanen: z.string().min(1, "Keterlambatan Tanam/Panen wajib dipilih"),
  masalahProduksi: z.string().min(1, "Masalah Produksi wajib dipilih"),
  adaSeranganHama: z.string().min(1, "Ada Serangan Hama/Penyakit wajib dipilih"),
  jenisHamaPenyakit: z.string().min(1, "Jenis Hama/Penyakit Dominan wajib dipilih"),
  luasSeranganHama: z.string().min(1, "Luas Terserang Hama wajib dipilih"),
  tindakanPengendalianHama: z.string().min(1, "Tindakan Pengendalian Hama wajib dipilih"),
  cuaca7Hari: z.string().min(1, "Cuaca 7 Hari Terakhir wajib dipilih"),
  dampakCuaca: z.string().min(1, "Dampak Cuaca wajib dipilih"),
};