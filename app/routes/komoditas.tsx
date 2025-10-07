import KomoditasView from "~/features/komoditas/KomoditasView";
import { useStepValidation } from "~/hooks/useStepValidation";

export default function Komoditas() {
  useStepValidation(2); // This is step 2 (Komoditas)
  
  return (
    <KomoditasView />
  );
}
