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
      <form onSubmit={methods.handleSubmit((data) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (key === 'photos' && value instanceof File) {
            formData.append(key, value);
          } else if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        });
        console.log("Submit final data:", Object.fromEntries(formData.entries()));
      })}>
        {children}
      </form>
    </RHFProvider>
  );
}
