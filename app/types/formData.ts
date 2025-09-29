// Base interface untuk Step 1
interface DataPenyuluhForm {
  lat: string;
  long: string;
  extension_officer: string;
  visit_date: string;
  farmer_name: string;
  farmer_group: string;
  village: string;
  district: string;
}

// Enum untuk tipe komoditas
type KomoditasType = 'pangan' | 'hortikultura' | 'perkebunan';

// Interface untuk Perkebunan
interface PerkebunanData {
  selectedKomoditas: 'perkebunan';
  plantation_commodity: string;
  plantation_land_status: string;
  plantation_land_area: number;
  plantation_growth_phase: string;
  plantation_plant_age: number;
  plantation_technology: string;
  plantation_planting_date: string;
  plantation_harvest_date: string;
  plantation_delay_reason?: string;
  production_problems?: string;
  photos?: string[]; // Array of photo URLs or base64
}

// Interface untuk Hortikultura
interface HortikulturaData {
  selectedKomoditas: 'hortikultura';
  horti_commodity: string;
  horti_sub_commodity: string;
  horti_land_status: string;
  horti_land_area: number;
  horti_growth_phase: string;
  horti_plant_age: number;
  horti_planting_date: string;
  horti_harvest_date: string;
  horti_delay_reason?: string;
  horti_technology: string;
  post_harvest_problems?: string;
  photos?: string[];
}

// Interface untuk Pangan
interface PanganData {
  selectedKomoditas: 'pangan';
  food_commodity: string;
  food_land_status: string;
  food_land_area: number;
  food_growth_phase: string;
  food_plant_age: number;
  food_technology: string;
  food_planting_date: string;
  food_harvest_date: string;
  food_delay_reason?: string;
  photos?: string[];
}

// Union type untuk Step 2 & 3 (tergantung komoditas yang dipilih)
type KomoditasData = PerkebunanData | HortikulturaData | PanganData;

// Interface untuk Step 3 Universal (berlaku untuk semua komoditas)
interface Step3UniversalData {
  has_pest_disease: boolean;
  pest_disease_type?: string;
  affected_area?: number;
  pest_control_action?: string;
  weather_condition?: string;
  weather_impact?: string;
}

// Interface untuk Step 4
interface Step4Data {
  main_constraint?: string;
  farmer_hope?: string;
  training_needed?: string;
  urgent_needs?: string;
  water_access: string;
  suggestions?: string;
}

// Interface final untuk POST ke API
interface FormPertanianAPIPayload extends DataPenyuluhForm, Step3UniversalData, Step4Data {
  selectedKomoditas: KomoditasType;
  // Komoditas specific fields akan di-merge sesuai tipe yang dipilih
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
  
  food_commodity?: string;
  food_land_status?: string;
  food_land_area?: number;
  food_growth_phase?: string;
  food_plant_age?: number;
  food_technology?: string;
  food_planting_date?: string;
  food_harvest_date?: string;
  food_delay_reason?: string;
  
  photos?: string[];
}


// Type guard functions untuk validasi
function isPerkebunanData(data: KomoditasData): data is PerkebunanData {
  return data.selectedKomoditas === 'perkebunan';
}

function isHortikulturaData(data: KomoditasData): data is HortikulturaData {
  return data.selectedKomoditas === 'hortikultura';
}

function isPanganData(data: KomoditasData): data is PanganData {
  return data.selectedKomoditas === 'pangan';
}

// Function untuk prepare data sebelum POST
function prepareAPIPayload(
  step1: DataPenyuluhForm,
  komoditas: KomoditasData,
  step3Universal: Step3UniversalData,
  step4: Step4Data
): FormPertanianAPIPayload {
  const basePayload: FormPertanianAPIPayload = {
    ...step1,
    selectedKomoditas: komoditas.selectedKomoditas,
    ...step3Universal,
    ...step4,
  };

  // Merge komoditas specific data
  if (isPerkebunanData(komoditas)) {
    return {
      ...basePayload,
      plantation_commodity: komoditas.plantation_commodity,
      plantation_land_status: komoditas.plantation_land_status,
      plantation_land_area: komoditas.plantation_land_area,
      plantation_growth_phase: komoditas.plantation_growth_phase,
      plantation_plant_age: komoditas.plantation_plant_age,
      plantation_technology: komoditas.plantation_technology,
      plantation_planting_date: komoditas.plantation_planting_date,
      plantation_harvest_date: komoditas.plantation_harvest_date,
      plantation_delay_reason: komoditas.plantation_delay_reason,
      production_problems: komoditas.production_problems,
      photos: komoditas.photos,
    };
  } else if (isHortikulturaData(komoditas)) {
    return {
      ...basePayload,
      horti_commodity: komoditas.horti_commodity,
      horti_sub_commodity: komoditas.horti_sub_commodity,
      horti_land_status: komoditas.horti_land_status,
      horti_land_area: komoditas.horti_land_area,
      horti_growth_phase: komoditas.horti_growth_phase,
      horti_plant_age: komoditas.horti_plant_age,
      horti_planting_date: komoditas.horti_planting_date,
      horti_harvest_date: komoditas.horti_harvest_date,
      horti_delay_reason: komoditas.horti_delay_reason,
      horti_technology: komoditas.horti_technology,
      post_harvest_problems: komoditas.post_harvest_problems,
      photos: komoditas.photos,
    };
  } else {
    return {
      ...basePayload,
      food_commodity: komoditas.food_commodity,
      food_land_status: komoditas.food_land_status,
      food_land_area: komoditas.food_land_area,
      food_growth_phase: komoditas.food_growth_phase,
      food_plant_age: komoditas.food_plant_age,
      food_technology: komoditas.food_technology,
      food_planting_date: komoditas.food_planting_date,
      food_harvest_date: komoditas.food_harvest_date,
      food_delay_reason: komoditas.food_delay_reason,
      photos: komoditas.photos,
    };
  }
}

// Export semua types dan interfaces
export type {
  DataPenyuluhForm,
  KomoditasType,
  PerkebunanData,
  HortikulturaData,
  PanganData,
  KomoditasData,
  Step3UniversalData,
  Step4Data,
  FormPertanianAPIPayload,
};

export {
  isPerkebunanData,
  isHortikulturaData,
  isPanganData,
  prepareAPIPayload,
};