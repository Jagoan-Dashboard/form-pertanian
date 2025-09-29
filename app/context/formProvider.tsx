"use client";

import { FormProvider as RHFProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fullSchema } from "~/global-validation/validation-step-schemas";
import type { FullFormType } from "~/global-validation/validation-step-schemas";

export function FormWrapper({ children }: { children: React.ReactNode }) {
  const methods = useForm<FullFormType>({
    resolver: zodResolver(fullSchema),
    mode: "onSubmit", // Changed from "onChange" to prevent aggressive validation
    reValidateMode: "onChange",
  });

  return (
    <RHFProvider {...methods}>
      <form onSubmit={methods.handleSubmit((data) => console.log("Submit final data:", data))}>
        {children}
      </form>
    </RHFProvider>
  );
}
