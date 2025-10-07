import DataKomoditasPanganView from "~/features/data-komoditas-pangan/DataKomoditasPanganView";
import { useStepValidation } from "~/hooks/useStepValidation";

export default function DataKomoditasPangan() {
  useStepValidation(3); // This is step 3 (Data Komoditas - Tanaman Pangan)
  
  return (
    <DataKomoditasPanganView />
  )
}