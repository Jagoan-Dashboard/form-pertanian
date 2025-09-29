import { z } from "zod";

// Validation schema for Aspirasi dan Kebutuhan Petani form
export const aspirasiTaniSchema = z.object({
  // Aspirasi dan Kebutuhan Petani Section
  kendalaUtama: z
    .string()
    .min(1, "Kendala Utama wajib dipilih"),

  harapan: z
    .string()
    .min(1, "Harapan wajib dipilih"),

  pelatihanDibutuhkan: z
    .string()
    .min(1, "Pelatihan yang Dibutuhkan wajib dipilih"),

  kebutuhanMendesak: z
    .string()
    .min(1, "Kebutuhan Mendesak wajib dipilih"),

  aksesAir: z
    .string()
    .min(1, "Akses Air Pertanian (P2T) wajib dipilih"),

  // Harapan di Masa Depan Section (Optional)
  harapanMasaDepan: z
    .string()
    .optional()
    .refine(
      (val) => {
        // If filled, must be at least 20 characters
        if (val && val.trim().length > 0) {
          return val.trim().length >= 20;
        }
        return true; // Empty is allowed
      },
      "Jika diisi, Harapan di Masa Depan minimal 20 karakter"
    )
    .refine(
      (val) => {
        // If filled, must not exceed 1000 characters
        if (val && val.trim().length > 0) {
          return val.trim().length <= 1000;
        }
        return true;
      },
      "Harapan di Masa Depan maksimal 1000 karakter"
    ),
}).refine(
  (data) => {
    // Validation: Jika kendala utama adalah "air", aksesAir tidak boleh "baik"
    if (data.kendalaUtama === "air" && data.aksesAir === "baik") {
      return false;
    }
    return true;
  },
  {
    message: "Jika kendala utama adalah kekurangan air, akses air tidak bisa 'Baik - Tersedia Sepanjang Tahun'",
    path: ["aksesAir"],
  }
).refine(
  (data) => {
    // Validation: Jika aksesAir terbatas atau tidak ada, kebutuhan mendesak sebaiknya irigasi
    if ((data.aksesAir === "terbatas" || data.aksesAir === "tidak-ada") && 
        data.kendalaUtama !== "air" && 
        data.kebutuhanMendesak !== "irigasi") {
      // This is a warning, not a hard validation error
      // We can add this as optional validation
      return true;
    }
    return true;
  },
  {
    message: "Pertimbangkan untuk memilih 'Perbaikan Irigasi' sebagai kebutuhan mendesak",
    path: ["kebutuhanMendesak"],
  }
).refine(
  (data) => {
    // Validation: Harapan dan kebutuhan mendesak sebaiknya konsisten
    const consistencyMap: Record<string, string[]> = {
      "subsidi": ["pupuk", "bibit", "pestisida"],
      "bantuan-modal": ["modal"],
      "teknologi": ["alat"],
      "pasar": ["modal", "alat"],
    };

    if (data.harapan && data.kebutuhanMendesak) {
      const expectedNeeds = consistencyMap[data.harapan];
      if (expectedNeeds && !expectedNeeds.includes(data.kebutuhanMendesak)) {
        // This is a soft validation - we allow it but could warn
        return true;
      }
    }
    return true;
  },
  {
    message: "Harapan dan kebutuhan mendesak sebaiknya konsisten",
    path: ["kebutuhanMendesak"],
  }
);

export type AspirasiTaniFormData = z.infer<typeof aspirasiTaniSchema>;

// Optional: Individual field validations for real-time validation
export const fieldValidations = {
  kendalaUtama: z.string().min(1, "Kendala Utama wajib dipilih"),
  harapan: z.string().min(1, "Harapan wajib dipilih"),
  pelatihanDibutuhkan: z.string().min(1, "Pelatihan yang Dibutuhkan wajib dipilih"),
  kebutuhanMendesak: z.string().min(1, "Kebutuhan Mendesak wajib dipilih"),
  aksesAir: z.string().min(1, "Akses Air Pertanian (P2T) wajib dipilih"),
  harapanMasaDepan: z.string().optional().refine(
    (val) => {
      if (val && val.trim().length > 0) {
        return val.trim().length >= 20 && val.trim().length <= 1000;
      }
      return true;
    },
    "Jika diisi, harus antara 20-1000 karakter"
  ),
};

// Helper function to get character count for textarea
export const getCharacterCount = (text: string): { current: number; min: number; max: number; isValid: boolean } => {
  const trimmedLength = text.trim().length;
  return {
    current: trimmedLength,
    min: 20,
    max: 1000,
    isValid: trimmedLength >= 20 && trimmedLength <= 1000
  };
};

// Helper function to check consistency between fields
export const checkFieldConsistency = (kendalaUtama: string, aksesAir: string): { isConsistent: boolean; warning?: string } => {
  if (kendalaUtama === "air" && aksesAir === "baik") {
    return {
      isConsistent: false,
      warning: "Jika kendala utama adalah kekurangan air, akses air seharusnya tidak 'Baik'"
    };
  }
  
  if (kendalaUtama === "air" && (aksesAir === "terbatas" || aksesAir === "tidak-ada")) {
    return {
      isConsistent: true
    };
  }

  return { isConsistent: true };
};

// Helper function to suggest consistent selections
export const getSuggestedKebutuhanMendesak = (kendalaUtama: string, harapan: string, aksesAir: string): string[] => {
  const suggestions: string[] = [];

  if (kendalaUtama === "air" || aksesAir === "terbatas" || aksesAir === "tidak-ada") {
    suggestions.push("irigasi");
  }
  
  if (kendalaUtama === "modal" || harapan === "bantuan-modal") {
    suggestions.push("modal");
  }
  
  if (kendalaUtama === "pupuk" || harapan === "subsidi") {
    suggestions.push("pupuk");
  }
  
  if (kendalaUtama === "hama") {
    suggestions.push("pestisida");
  }

  return suggestions;
};