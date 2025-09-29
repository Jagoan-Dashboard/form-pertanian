import { createContext, useContext, type ReactNode } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { useNavigate } from 'react-router';
import apiClient from '~/lib/api-client';
import { ENDPOINTS } from '~/lib/api-endpoints';

// Form Data Interface
interface FormPertanianData {
  // Step 1
  lat: string;
  long: string;
  extension_officer: string;
  visit_date: string;
  farmer_name: string;
  farmer_group: string;
  village: string;
  district: string;

  // Step 2 - Komoditas Selection
  selectedKomoditas: 'pangan' | 'hortikultura' | 'perkebunan' | '';
  komoditas?: 'pangan' | 'hortikultura' | 'perkebunan'; // For discriminated union

  // Perkebunan (Step 2/3)
  plantation_commodity?: string;
  plantation_land_status?: string;
  plantation_land_area?: number;
  plantation_growth_phase?: string;
  plantation_plant_age?: number;
  plantation_technology?: string;
  plantation_planting_date?: string;
  plantation_harvest_date?: string;
  plantation_delay_reason?: string;
  production_problems?: string;

  // Hortikultura (Step 2/3)
  horti_commodity?: string;
  horti_sub_commodity?: string;
  horti_land_status?: string;
  horti_land_area?: number;
  horti_growth_phase?: string;
  horti_plant_age?: number;
  horti_planting_date?: string;
  horti_harvest_date?: string;
  horti_delay_reason?: string;
  horti_technology?: string;
  post_harvest_problems?: string;

  // Pangan (Step 2/3)
  food_commodity?: string;
  food_land_status?: string;
  food_land_area?: number;
  food_growth_phase?: string;
  food_plant_age?: number;
  food_technology?: string;
  food_planting_date?: string;
  food_harvest_date?: string;
  food_delay_reason?: string;

  // Step 3 Universal
  has_pest_disease: boolean;
  pest_disease_type?: string;
  affected_area: number;
  pest_control_action?: string;
  weather_condition?: string;
  weather_impact?: string;

  // Step 4
  main_constraint: string;
  farmer_hope?: string;
  training_needed?: string;
  urgent_needs?: string;
  water_access?: string;
  suggestions?: string;

  // Photos
  photos?: File | null;
}

// Context Type
interface FormPertanianContextType {
  methods: UseFormReturn<FormPertanianData>;
  submitForm: (data?: any) => Promise<void>;
  isSubmitting: boolean;
}

const FormPertanianContext = createContext<FormPertanianContextType | null>(null);

// Provider Props
interface FormPertanianProviderProps {
  children: ReactNode;
  apiEndpoint?: string;
}

export function FormPertanianProvider({
  children,
}: FormPertanianProviderProps) {
  const methods = useForm<FormPertanianData>({
    defaultValues: {
      // Step 1
      lat: '',
      long: '',
      extension_officer: '',
      visit_date: '',
      farmer_name: '',
      farmer_group: '',
      village: '',
      district: '',

      // Step 2
      selectedKomoditas: '',
      komoditas: undefined,

      // Step 3 Universal
      has_pest_disease: false,
      pest_disease_type: '',
      affected_area: 0,
      pest_control_action: '',
      weather_condition: '',
      weather_impact: '',

      // Step 4
      main_constraint: '',
      farmer_hope: '',
      training_needed: '',
      urgent_needs: '',
      water_access: '',
      suggestions: '',

      // Photos
      photos: null,
    },
    mode: 'onBlur',
  });

  const { formState } = methods;
  const navigate = useNavigate();

  const submitForm = async () => {
    const allData = methods.getValues(); //mengapa ini selalu mengembalikan default values? bukan yang diisi oleh user?

    try {
      const payload = prepareFormData(allData);

      console.log("🚀 Submitting Form Data:", payload);
      console.log("📊 Raw Form Data:", allData);

      const result = await apiClient.post(
        ENDPOINTS.CREATE_REPORT,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("✅ Submission Success:", result);

      // Reset form setelah sukses
      methods.reset();

      // Optional: redirect / navigate
      // diley 2 detik lalu ke navigate
      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (error) {
      console.error("❌ Form submission error:", error);
      throw error;
    }
  };



  const prepareFormData = (data: any): FormData => {
    const formData = new FormData();

    // Helper untuk format tanggal ke YYYY-MM-DD
    const formatDate = (value?: string | Date) => {
      if (!value) return "";
      const d = new Date(value);
      return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
    };

    // Step 1–2: Data dasar
    const baseData = {
      lat: data.lat,
      long: data.long,
      extension_officer: data.extension_officer,
      visit_date: formatDate(data.visit_date || data.tanggalKunjungan),
      farmer_name: data.farmer_name,
      farmer_group: data.farmer_group,
      village: data.village,
      district: data.district,
      selectedKomoditas: data.selectedKomoditas,
      komoditas: data.komoditas,
    };

    // Step 3: Universal
    const universalStep3 = {
      has_pest_disease: data.has_pest_disease,
      pest_disease_type: data.pest_disease_type,
      affected_area: data.affected_area,
      pest_control_action: data.pest_control_action,
      weather_condition: data.weather_condition,
      weather_impact: data.weather_impact,
    };

    // Step 4
    const step4Data = {
      main_constraint: data.main_constraint,
      farmer_hope: data.farmer_hope,
      training_needed: data.training_needed,
      urgent_needs: data.urgent_needs,
      water_access: data.water_access,
      suggestions: data.suggestions,
    };

    // Komoditas dinamis
    let komoditasData: Record<string, any> = {};

    if (data.selectedKomoditas === "perkebunan") {
      komoditasData = {
        plantation_commodity: data.plantation_commodity,
        plantation_land_status: data.plantation_land_status,
        plantation_land_area: data.plantation_land_area,
        plantation_growth_phase: data.plantation_growth_phase,
        plantation_plant_age: data.plantation_plant_age,
        plantation_technology: data.plantation_technology,
        plantation_planting_date: formatDate(data.plantation_planting_date),
        plantation_harvest_date: formatDate(data.plantation_harvest_date),
        plantation_delay_reason: data.plantation_delay_reason,
        production_problems: data.production_problems,
      };
    } else if (data.selectedKomoditas === "hortikultura") {
      komoditasData = {
        horti_commodity: data.horti_commodity,
        horti_sub_commodity: data.horti_sub_commodity,
        horti_land_status: data.horti_land_status,
        horti_land_area: data.horti_land_area,
        horti_growth_phase: data.horti_growth_phase,
        horti_plant_age: data.horti_plant_age,
        horti_planting_date: formatDate(data.horti_planting_date),
        horti_harvest_date: formatDate(data.horti_harvest_date),
        horti_delay_reason: data.horti_delay_reason,
        horti_technology: data.horti_technology,
        post_harvest_problems: data.post_harvest_problems,
      };
    } else if (data.selectedKomoditas === "pangan") {
      komoditasData = {
        food_commodity: data.food_commodity,
        food_land_status: data.food_land_status,
        food_land_area: data.food_land_area,
        food_growth_phase: data.food_growth_phase,
        food_plant_age: data.food_plant_age,
        food_technology: data.food_technology,
        food_planting_date: formatDate(data.food_planting_date),
        food_harvest_date: formatDate(data.food_harvest_date),
        food_delay_reason: data.food_delay_reason,
      };
    }

    // Gabungkan semua field (tanpa photos dulu)
    const allData = {
      ...baseData,
      ...komoditasData,
      ...universalStep3,
      ...step4Data,
    };

    // Append ke FormData
    Object.entries(allData).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        formData.append(key, String(value));
      }
    });

    // Handle file (photos)
    if (data.photos instanceof File) {
      formData.append("photos", data.photos);
    } else if (Array.isArray(data.photos)) {
      // Jika multi-file upload
      data.photos.forEach((file: File, idx: number) => {
        if (file instanceof File) {
          formData.append(`photos[${idx}]`, file);
        }
      });
    }

    return formData;
  };



  return (
    <FormPertanianContext.Provider
      value={{
        methods,
        submitForm,
        isSubmitting: formState.isSubmitting,
      }}
    >
      {children}
    </FormPertanianContext.Provider>
  );
}

// Custom hook supaya gampang akses context
export function useFormPertanian() {
  const context = useContext(FormPertanianContext);
  if (!context) {
    throw new Error('useFormPertanian must be used within FormPertanianProvider');
  }
  return context;
}
