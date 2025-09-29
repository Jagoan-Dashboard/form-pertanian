import { createContext, useContext, type ReactNode } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';

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
  affected_area?: number;
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
  photos?: FileList | File[] | string[];
}

// Context Type
interface FormPertanianContextType {
  methods: UseFormReturn<FormPertanianData>;
  submitForm: () => Promise<void>;
  isSubmitting: boolean;
}

const FormPertanianContext = createContext<FormPertanianContextType | null>(null);

// Provider Props
interface FormPertanianProviderProps {
  children: ReactNode;
  apiEndpoint?: string;
  onSubmitSuccess?: (data: any) => void;
  onSubmitError?: (error: any) => void;
}

export function FormPertanianProvider({
  children,
  apiEndpoint = '/api/form-pertanian',
  onSubmitSuccess,
  onSubmitError,
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

      // Step 3 Universal
      has_pest_disease: false,
      pest_disease_type: '',
      affected_area: undefined,
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
      photos: [],
    },
    mode: 'onBlur',
  });

  const { formState } = methods;

  const submitForm = async () => {
    const allData = methods.getValues();

    try {
      const payload = prepareFormData(allData);

      // Console log the prepared data for now (as requested by user)
      console.log('🚀 Submitting Form Data:', payload);
      console.log('📊 Raw Form Data:', allData);

      // Simulate API call delay
      // await new Promise(resolve => setTimeout(resolve, 1000));

      // For now, just simulate success response
      // const result = {
      //   success: true,
      //   message: 'Form submitted successfully',
      //   data: payload,
      //   timestamp: new Date().toISOString()
      // };

      // console.log('✅ Submission Success:', result);

      // if (onSubmitSuccess) {
      //   onSubmitSuccess(result);
      // }

      // Reset the form after successful submission
      methods.reset();
    } catch (error) {
      console.error('❌ Form submission error:', error);

      if (onSubmitError) {
        onSubmitError(error);
      }

      throw error;
    }
  };

  const prepareFormData = (data: FormPertanianData) => {
    const baseData = {
      lat: data.lat,
      long: data.long,
      extension_officer: data.extension_officer,
      visit_date: data.visit_date,
      farmer_name: data.farmer_name,
      farmer_group: data.farmer_group,
      village: data.village,
      district: data.district,
      selectedKomoditas: data.selectedKomoditas,
    };

    const universalStep3 = {
      has_pest_disease: data.has_pest_disease,
      pest_disease_type: data.pest_disease_type,
      affected_area: data.affected_area,
      pest_control_action: data.pest_control_action,
      weather_condition: data.weather_condition,
      weather_impact: data.weather_impact,
    };

    const step4Data = {
      main_constraint: data.main_constraint,
      farmer_hope: data.farmer_hope,
      training_needed: data.training_needed,
      urgent_needs: data.urgent_needs,
      water_access: data.water_access,
      suggestions: data.suggestions,
    };

    let komoditasData = {};

    if (data.selectedKomoditas === 'perkebunan') {
      komoditasData = {
        plantation_commodity: data.plantation_commodity,
        plantation_land_status: data.plantation_land_status,
        plantation_land_area: data.plantation_land_area,
        plantation_growth_phase: data.plantation_growth_phase,
        plantation_plant_age: data.plantation_plant_age,
        plantation_technology: data.plantation_technology,
        plantation_planting_date: data.plantation_planting_date,
        plantation_harvest_date: data.plantation_harvest_date,
        plantation_delay_reason: data.plantation_delay_reason,
        production_problems: data.production_problems,
      };
    } else if (data.selectedKomoditas === 'hortikultura') {
      komoditasData = {
        horti_commodity: data.horti_commodity,
        horti_sub_commodity: data.horti_sub_commodity,
        horti_land_status: data.horti_land_status,
        horti_land_area: data.horti_land_area,
        horti_growth_phase: data.horti_growth_phase,
        horti_plant_age: data.horti_plant_age,
        horti_planting_date: data.horti_planting_date,
        horti_harvest_date: data.horti_harvest_date,
        horti_delay_reason: data.horti_delay_reason,
        horti_technology: data.horti_technology,
        post_harvest_problems: data.post_harvest_problems,
      };
    } else if (data.selectedKomoditas === 'pangan') {
      komoditasData = {
        food_commodity: data.food_commodity,
        food_land_status: data.food_land_status,
        food_land_area: data.food_land_area,
        food_growth_phase: data.food_growth_phase,
        food_plant_age: data.food_plant_age,
        food_technology: data.food_technology,
        food_planting_date: data.food_planting_date,
        food_harvest_date: data.food_harvest_date,
        food_delay_reason: data.food_delay_reason,
      };
    }

    return {
      ...baseData,
      ...komoditasData,
      ...universalStep3,
      ...step4Data,
      photos: data.photos,
    };
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
