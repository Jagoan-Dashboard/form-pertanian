import { IndexView } from "~/features/index/IndexView";
import type { Route } from "./+types/index";
import { useStepValidation } from "~/hooks/useStepValidation";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Form Pertanian" },
    { name: "description", content: "Form Pertanian" },
  ];
}

export default function Index() {
  useStepValidation(1); // This is step 1 (Data Penyuluh)
  
  return (
    <IndexView />
  );
}
