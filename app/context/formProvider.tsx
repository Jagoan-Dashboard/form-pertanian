// FormWrapper.tsx
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fullSchema, type FullFormType } from "~/global-validation/validation-step-schemas";
import { useState } from "react";
import { IndexView } from "~/features/index/IndexView";
import KomoditasView from "~/features/komoditas/KomoditasView";
import DataKomoditasPanganView from "~/features/data-komoditas-pangan/DataKomoditasPanganView";
import DataKomoditasHortikulturaView from "~/features/data-komoditas-holtikultura/DataKomoditasHoltikulturaView";
import DataKomoditasPerkebunanView from "~/features/data-komoditas-perkebunan/DataKomoditasPerkebunanView";
import AspirasiTaniView from "~/features/aspirasi-tani/AspirasiTaniView";

export const FormWrapper = () => {
  const methods = useForm<FullFormType>({
    resolver: zodResolver(fullSchema),
    mode: "onChange",
  });

  const [step, setStep] = useState(1);
  const komoditas = methods.watch("komoditas");

  const next = async () => {
    const valid = await methods.trigger(); // validasi semua field terisi sampai step ini
    if (valid) setStep((s) => s + 1);
  };

  const prev = () => setStep((s) => s - 1);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit((data) => console.log("✅ Final Data:", data))}>
        {step === 1 && <IndexView />}
        {step === 2 && <KomoditasView />}
        {step === 3 && komoditas === "pangan" && <DataKomoditasPanganView />}
        {step === 3 && komoditas === "hortikultura" && <DataKomoditasHortikulturaView />}
        {step === 3 && komoditas === "perkebunan" && <DataKomoditasPerkebunanView />}
        {step === 4 && <AspirasiTaniView />}
        

        <div className="flex gap-2 mt-4">
          {step > 1 && (
            <button type="button" onClick={prev}>
              Back
            </button>
          )}
          {step < 4 && (
            <button type="button" onClick={next}>
              Next
            </button>
          )}
          {step === 4 && <button type="submit">Submit</button>}
        </div>
      </form>
    </FormProvider>
  );
};
