"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { createContext, useContext } from "react";
import { FormProvider as RHFProvider, useForm, type UseFormReturn } from "react-hook-form";
import { useNavigate } from "react-router";
import { fullSchema, type FullFormType } from "~/global-validation/validation-step-schemas";
import apiClient from "~/lib/api-client";
import { ENDPOINTS } from "~/lib/api-endpoints";

// Context Type
interface FormContextType {
  methods: UseFormReturn<FullFormType>;
  submitForm: () => Promise<void>;
  isSubmitting: boolean;
}

const FormContext = createContext<FormContextType | null>(null);

export function FormProvider({ children }: { children: React.ReactNode }) {
  const methods = useForm<FullFormType>({
    resolver: zodResolver(fullSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      affected_area: 0,
      has_pest_disease: false,
    },
  });
  const navigate = useNavigate();

  const submitForm = async () => {
    await methods.handleSubmit(async (data) => {
      try {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (key === 'photos' && value instanceof File) {
            formData.append(key, value);
          } else if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        });

        console.log("🚀 Submitting Form Data:", Object.fromEntries(formData.entries()));

        const result = await apiClient.post(
          ENDPOINTS.CREATE_REPORT,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("✅ Submission Success:", result);
        methods.reset();
        setTimeout(() => {
          navigate("/");
        }, 2000);

      } catch (error) {
        console.error("❌ Form submission error:", error);
        throw error;
      }
    })();
  };

  return (
    <FormContext.Provider value={{ methods, submitForm, isSubmitting: methods.formState.isSubmitting }}>
      <RHFProvider {...methods}>
        <form onSubmit={(e) => e.preventDefault()}>
          {children}
        </form>
      </RHFProvider>
    </FormContext.Provider>
  );
}

export function useFormContextHook() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContextHook must be used within FormProvider');
  }
  return context;
}