import z from "zod";
import { aspirasiTaniSchema } from "~/features/aspirasi-tani/validation/validation";
import { dataKomoditasHortikulturaSchema } from "~/features/data-komoditas-holtikultura/validation/validation";
import { dataKomoditasPanganSchema } from "~/features/data-komoditas-pangan/validation/validation";
import { dataKomoditasPerkebunanSchema } from "~/features/data-komoditas-perkebunan/validation/validation";
import { indexViewSchema } from "~/features/index/validation/validation";


const stepHoltikultura = dataKomoditasHortikulturaSchema
const stepPangan = dataKomoditasPanganSchema
const stepPerkebunan = dataKomoditasPerkebunanSchema

// Define the discriminated union for step 3 data
export const stepDataKomoditas = z.discriminatedUnion("komoditas", [
  stepPangan,
  stepHoltikultura,
  stepPerkebunan,
]);
const stepAspirasiPetani = aspirasiTaniSchema

// Create an intermediate schema that explicitly includes the komoditas field
const baseWithKomoditas = indexViewSchema.extend({
  komoditas: z.enum(['pangan', 'hortikultura', 'perkebunan'])
})

export const fullSchema = baseWithKomoditas
  .extend(stepDataKomoditas)
  .extend(stepAspirasiPetani)

export type FullFormType = z.infer<typeof fullSchema>;