import { z } from "zod";
import { aspirasiTaniSchema } from "~/features/aspirasi-tani/validation/validation";
import { dataKomoditasHortikulturaSchema } from "~/features/data-komoditas-holtikultura/validation/validation";
import { dataKomoditasPanganSchema } from "~/features/data-komoditas-pangan/validation/validation";
import { dataKomoditasPerkebunanSchema } from "~/features/data-komoditas-perkebunan/validation/validation";
import { indexViewSchema } from "~/features/index/validation/validation";

// Step schemas
const stepHoltikultura = dataKomoditasHortikulturaSchema;
const stepPangan = dataKomoditasPanganSchema;
const stepPerkebunan = dataKomoditasPerkebunanSchema;

// Union untuk komoditas
export const stepDataKomoditas = z.discriminatedUnion("komoditas", [
  stepPangan,
  stepHoltikultura,
  stepPerkebunan,
]);

// Aspirasi
const stepAspirasiPetani = aspirasiTaniSchema;

// Gabungkan semuanya jadi satu schema
export const fullSchema = indexViewSchema.and(stepDataKomoditas).and(stepAspirasiPetani);

export type FullFormType = z.infer<typeof fullSchema>;
