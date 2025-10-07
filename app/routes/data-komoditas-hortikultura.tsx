import DataKomoditasHortikulturaView from "~/features/data-komoditas-holtikultura/DataKomoditasHoltikulturaView";
import { useStepValidation } from "~/hooks/useStepValidation";

export default function DataKomoditasHortikulutra() {
  useStepValidation(3); // This is step 3 (Data Komoditas - Hortikultura)
  
  return (
    <DataKomoditasHortikulturaView />
  )
}