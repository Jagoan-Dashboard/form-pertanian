"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { createContext, useContext } from "react";
import { FormProvider as RHFProvider, useForm, type UseFormReturn } from "react-hook-form";
import { fullSchema, type FullFormType } from "~/global-validation/validation-step-schemas";
import apiClient from "~/lib/api-client";
import { ENDPOINTS } from "~/lib/api-endpoints";
import { toast } from "sonner";
import type { AxiosResponse } from "axios";
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
      district: "Ngawi",
    },
  });

  const submitForm = async () => {
    try {
      const formData = new FormData();

      const formatDate = (value?: string | Date) => {
        if (!value) return "";
        const d = new Date(value);
        return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
      };

      Object.entries(methods.watch()).forEach(([key, value]) => {
        if (["visit_date", "food_planting_date", "food_harvest_date",
          "horti_planting_date", "horti_harvest_date",
          "plantation_planting_date", "plantation_harvest_date"].includes(key)) {
          const formatted = formatDate(value);
          if (formatted) formData.append(key, formatted);
        } else if (key === "photos") {
          if (value instanceof File) formData.append(key, value);
          else if (Array.isArray(value)) value.forEach((file, idx) => file instanceof File && formData.append(`photos[${idx}]`, file));
        } else if (value !== undefined && value !== null && value !== "") {
          formData.append(key, String(value));
        }
      });

      await apiClient.post(ENDPOINTS.CREATE_REPORT, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }); //jika gagal dia tidak bisa reset methode

      // ✅ Show success toast
      toast.success("Laporan berhasil disimpan!");


      // Reset form with default values to ensure complete reset
      methods.reset({
        affected_area: 0,
        district: "Ngawi",
      });

      // Force page refresh after form submission
      setTimeout(() => {
        window.location.href = "/";
      }, 500);

    } catch (error: any) {
      console.error("Form submission error:", error);
      // ❌ Show error toast
      toast.error(
        error?.response?.data?.message || "Terjadi kesalahan saat submit data!"
      );
      // Reset form with default values to ensure complete reset
      methods.reset({
        affected_area: 0,
        district: "Ngawi",
      });
      // Force page refresh after form submission
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    }
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