"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { createContext, useContext, useEffect } from "react";
import { FormProvider as RHFProvider, useForm, type UseFormReturn } from "react-hook-form";
import { fullSchema, type FullFormType } from "~/global-validation/validation-step-schemas";
import apiClient from "~/lib/api-client";
import { ENDPOINTS } from "~/lib/api-endpoints";
import { toast } from "sonner";

// Key for localStorage
const FORM_STORAGE_KEY = "form-pertanian-data";

// Context Type
interface FormContextType {
  methods: UseFormReturn<FullFormType>;
  submitForm: () => Promise<void>;
  isSubmitting: boolean;
}

const FormContext = createContext<FormContextType | null>(null);

export function FormProvider({ children }: { children: React.ReactNode }) {
  // Load initial values from localStorage
  const getInitialValues = (): FullFormType => {
    // Define a complete default object that matches FullFormType
    const defaultFormValues: FullFormType = {
      // From indexViewSchema (Step 1)
      lat: "",
      long: "",
      extension_officer: "",
      visit_date: "",
      farmer_name: "",
      farmer_group: "",
      village: "",
      district: "", // Default value

      // From data komoditas schemas - Initialize with a default selection to satisfy discriminated union
      komoditas: "pangan", // Default to one of the valid union options to satisfy the schema
      // Only include fields that are part of the pangan schema to satisfy the discriminated union
      food_commodity: "",
      food_land_status: "",
      food_land_area: 0,
      food_growth_phase: "",
      food_plant_age: 0,
      food_technology: "",
      food_planting_date: "",
      food_harvest_date: "",
      food_delay_reason: "",

      // From aspirasiTaniSchema (Step 4)
      main_constraint: "",
      farmer_hope: "",
      training_needed: "",
      urgent_needs: "",
      water_access: "",
      suggestions: "",

      // Universal fields
      affected_area: "",
      has_pest_disease: false,
      pest_disease_type: "",
      pest_control_action: "",
      weather_condition: "",
      weather_impact: "",

      // Photos
      photos: null,
    };

    try {
      const stored = localStorage.getItem(FORM_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge stored data with default values to ensure all required fields are present
        return {
          ...defaultFormValues,
          ...parsed
        };
      }
    } catch (error) {
      console.error("Failed to load form data from localStorage:", error);
    }

    // Return complete default values if no stored data
    return defaultFormValues;
  };

  const methods = useForm<FullFormType>({
    resolver: zodResolver(fullSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: getInitialValues(),
  });

  // Subscribe to form changes and save to localStorage
  useEffect(() => {
    const subscription = methods.watch((value) => {
      try {
        localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(value));
      } catch (error) {
        console.error("Failed to save form data to localStorage:", error);
      }
    });

    return () => subscription.unsubscribe();
  }, [methods]);

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

      // Clear stored form data on successful submission
      localStorage.removeItem(FORM_STORAGE_KEY);

      // Reset form with default values to ensure complete reset
      methods.reset({
      });
      localStorage.removeItem("komoditas");

      // Force page refresh after form submission
      // setTimeout(() => {
      //   window.location.href = "/";
      // }, 500);

    } catch (error: any) {
      console.error("Form submission error:", error);
      // ❌ Show error toast
      toast.error(
        error?.response?.data?.message || "Terjadi kesalahan saat submit data!"
      );
      // Reset form with default values to ensure complete reset
      methods.reset({
      });
      localStorage.removeItem("komoditas");

      // Force page refresh after form submission
      // setTimeout(() => {
      //   window.location.href = "/";
      // }, 500);
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