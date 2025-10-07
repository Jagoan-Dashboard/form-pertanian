import DataKomoditasPerkebunanView from "~/features/data-komoditas-perkebunan/DataKomoditasPerkebunanView";
import { useStepValidation } from "~/hooks/useStepValidation";

export default function DataKomoditasPerkebunan() {
  useStepValidation(3); // This is step 3 (Data Komoditas - Perkebunan)
  
  return (
    <DataKomoditasPerkebunanView />
  )
}