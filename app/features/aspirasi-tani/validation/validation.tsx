import { z } from "zod";

// Validation schema for Aspirasi dan Kebutuhan Petani form
export const aspirasiTaniSchema = z.object({
  // Aspirasi dan Kebutuhan Petani Section
  main_constraint: z
    .string()
    .min(1, "Kendala Utama wajib dipilih"),

  farmer_hope: z
    .string()
    .min(1, "Harapan wajib dipilih"),

  training_needed: z
    .string()
    .min(1, "Pelatihan yang Dibutuhkan wajib dipilih"),

  urgent_needs: z
    .string()
    .min(1, "Kebutuhan Mendesak wajib dipilih"),

  water_access: z
    .string()
    .min(1, "Akses Air Pertanian (P2T) wajib dipilih"),

  // Harapan di Masa Depan Section (Optional)
  suggestions: z
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
    // Validation: Jika kendala utama adalah "air", water_access tidak boleh "baik"
    if (data.main_constraint === "air" && data.water_access === "baik") {
      return false;
    }
    return true;
  },
  {
    message: "Jika kendala utama adalah kekurangan air, akses air tidak bisa 'Baik - Tersedia Sepanjang Tahun'",
    path: ["water_access"],
  }
).refine(
  (data) => {
    // Validation: Jika water_access terbatas atau tidak ada, kebutuhan mendesak sebaiknya irigasi
    if ((data.water_access === "terbatas" || data.water_access === "tidak-ada") &&
        data.main_constraint !== "air" &&
        data.urgent_needs !== "irigasi") {
      // This is a warning, not a hard validation error
      // We can add this as optional validation
      return true;
    }
    return true;
  },
  {
    message: "Pertimbangkan untuk memilih 'Perbaikan Irigasi' sebagai kebutuhan mendesak",
    path: ["urgent_needs"],
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

    if (data.farmer_hope && data.urgent_needs) {
      const expectedNeeds = consistencyMap[data.farmer_hope];
      if (expectedNeeds && !expectedNeeds.includes(data.urgent_needs)) {
        // This is a soft validation - we allow it but could warn
        return true;
      }
    }
    return true;
  },
  {
    message: "Harapan dan kebutuhan mendesak sebaiknya konsisten",
    path: ["urgent_needs"],
  }
);

export type AspirasiTaniFormData = z.infer<typeof aspirasiTaniSchema>;

// Optional: Individual field validations for real-time validation
export const fieldValidations = {
  main_constraint: z.string().min(1, "Kendala Utama wajib dipilih"),
  farmer_hope: z.string().min(1, "Harapan wajib dipilih"),
  training_needed: z.string().min(1, "Pelatihan yang Dibutuhkan wajib dipilih"),
  urgent_needs: z.string().min(1, "Kebutuhan Mendesak wajib dipilih"),
  water_access: z.string().min(1, "Akses Air Pertanian (P2T) wajib dipilih"),
  suggestions: z.string().optional().refine(
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
export const checkFieldConsistency = (main_constraint: string, water_access: string): { isConsistent: boolean; warning?: string } => {
  if (main_constraint === "air" && water_access === "baik") {
    return {
      isConsistent: false,
      warning: "Jika kendala utama adalah kekurangan air, akses air seharusnya tidak 'Baik'"
    };
  }

  if (main_constraint === "air" && (water_access === "terbatas" || water_access === "tidak-ada")) {
    return {
      isConsistent: true
    };
  }

  return { isConsistent: true };
};

// Helper function to suggest consistent selections
export const getSuggestedKebutuhanMendesak = (main_constraint: string, farmer_hope: string, water_access: string): string[] => {
  const suggestions: string[] = [];

  if (main_constraint === "air" || water_access === "terbatas" || water_access === "tidak-ada") {
    suggestions.push("irigasi");
  }

  if (main_constraint === "modal" || farmer_hope === "bantuan-modal") {
    suggestions.push("modal");
  }

  if (main_constraint === "pupuk" || farmer_hope === "subsidi") {
    suggestions.push("pupuk");
  }

  if (main_constraint === "hama") {
    suggestions.push("pestisida");
  }

  return suggestions;
};