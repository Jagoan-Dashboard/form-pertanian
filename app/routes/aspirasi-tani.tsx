import AspirasiTaniView from "~/features/aspirasi-tani/AspirasiTaniView";
import { useStepValidation } from "~/hooks/useStepValidation";

export default function AspirasiTani() {
  useStepValidation(4); // This is step 4 (Aspirasi)
  
  return (
    <AspirasiTaniView />
  )
}