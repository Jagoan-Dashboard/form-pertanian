// Fungsi untuk memvalidasi apakah user bisa mengakses step tertentu
export const canAccessStep = (currentStep: number, formData: any): boolean => {
  if (!formData) return false;
  
  switch (currentStep) {
    case 1: // Data Penyuluh (index route)
      return true; // Selalu bisa akses step 1
      
    case 2: // Komoditas
      // Harus sudah mengisi data penyuluh dengan lengkap
      return formData.extension_officer && formData.extension_officer.trim() !== '' &&
             formData.visit_date && formData.visit_date.trim() !== '' &&
             formData.farmer_name && formData.farmer_name.trim() !== '' &&
             formData.farmer_group && formData.farmer_group.trim() !== '' &&
             formData.village && formData.village.trim() !== '' &&
             formData.district && formData.district.trim() !== '';
      
    case 3: // Data Komoditas
      // Harus sudah mengisi data penyuluh DAN memilih jenis komoditas
      const hasBasicData = formData.extension_officer && formData.extension_officer.trim() !== '' &&
                          formData.visit_date && formData.visit_date.trim() !== '' &&
                          formData.farmer_name && formData.farmer_name.trim() !== '' &&
                          formData.farmer_group && formData.farmer_group.trim() !== '' &&
                          formData.village && formData.village.trim() !== '' &&
                          formData.district && formData.district.trim() !== '';
      
      if (!hasBasicData) return false; // Jika belum lengkap step 1, tidak bisa ke step 3
      
      return formData.komoditas && formData.komoditas !== '';
      
    case 4: // Aspirasi
      // Harus sudah mengisi data dari step sebelumnya
      if (!formData.komoditas) return false;
      
      // Validasi tambahan berdasarkan jenis komoditas
      if (formData.komoditas === 'pangan') {
        return formData.extension_officer && formData.extension_officer.trim() !== '' &&
               formData.visit_date && formData.visit_date.trim() !== '' &&
               formData.farmer_name && formData.farmer_name.trim() !== '' &&
               formData.farmer_group && formData.farmer_group.trim() !== '' &&
               formData.village && formData.village.trim() !== '' &&
               formData.district && formData.district.trim() !== '' &&
               formData.food_commodity && formData.food_commodity !== '' && 
               formData.food_land_status && formData.food_land_status !== '' && 
               typeof formData.food_land_area === 'number' && 
               formData.food_growth_phase && formData.food_growth_phase !== '';
      } else if (formData.komoditas === 'hortikultura') {
        return formData.extension_officer && formData.extension_officer.trim() !== '' &&
               formData.visit_date && formData.visit_date.trim() !== '' &&
               formData.farmer_name && formData.farmer_name.trim() !== '' &&
               formData.farmer_group && formData.farmer_group.trim() !== '' &&
               formData.village && formData.village.trim() !== '' &&
               formData.district && formData.district.trim() !== '' &&
               formData.horti_commodity && formData.horti_commodity !== '' && 
               formData.horti_sub_commodity && formData.horti_sub_commodity !== '' && 
               formData.horti_land_status && formData.horti_land_status !== '' && 
               typeof formData.horti_land_area === 'number' && 
               formData.horti_growth_phase && formData.horti_growth_phase !== '';
      } else if (formData.komoditas === 'perkebunan') {
        return formData.extension_officer && formData.extension_officer.trim() !== '' &&
               formData.visit_date && formData.visit_date.trim() !== '' &&
               formData.farmer_name && formData.farmer_name.trim() !== '' &&
               formData.farmer_group && formData.farmer_group.trim() !== '' &&
               formData.village && formData.village.trim() !== '' &&
               formData.district && formData.district.trim() !== '' &&
               formData.plantation_commodity && formData.plantation_commodity !== '' && 
               formData.plantation_land_status && formData.plantation_land_status !== '' && 
               typeof formData.plantation_land_area === 'number' && 
               formData.plantation_growth_phase && formData.plantation_growth_phase !== '';
      }
      return false;
      
    default:
      return false;
  }
};

// Fungsi untuk mendapatkan step terakhir yang telah diselesaikan
export const getLastCompletedStep = (formData: any): number => {
  if (!formData) return 0;
  
  // Cek step 1 (Data Penyuluh) dengan validasi lengkap
  if (!formData.extension_officer || !formData.extension_officer.trim() ||
      !formData.visit_date || !formData.visit_date.trim() ||
      !formData.farmer_name || !formData.farmer_name.trim() ||
      !formData.farmer_group || !formData.farmer_group.trim() ||
      !formData.village || !formData.village.trim() ||
      !formData.district || !formData.district.trim()) {
    return 0;
  }
  
  // Cek step 2 (Jenis Komoditas)
  if (!formData.komoditas || formData.komoditas === '') {
    return 1;
  }
  
  // Cek step 3 (Data Komoditas)
  if (formData.komoditas === 'pangan') {
    if (!formData.food_commodity || !formData.food_commodity.trim() ||
        !formData.food_land_status || !formData.food_land_status.trim() ||
        typeof formData.food_land_area !== 'number' || 
        !formData.food_growth_phase || !formData.food_growth_phase.trim()) {
      return 2;
    }
  } else if (formData.komoditas === 'hortikultura') {
    if (!formData.horti_commodity || !formData.horti_commodity.trim() ||
        !formData.horti_sub_commodity || !formData.horti_sub_commodity.trim() ||
        !formData.horti_land_status || !formData.horti_land_status.trim() ||
        typeof formData.horti_land_area !== 'number' || 
        !formData.horti_growth_phase || !formData.horti_growth_phase.trim()) {
      return 2;
    }
  } else if (formData.komoditas === 'perkebunan') {
    if (!formData.plantation_commodity || !formData.plantation_commodity.trim() ||
        !formData.plantation_land_status || !formData.plantation_land_status.trim() ||
        typeof formData.plantation_land_area !== 'number' || 
        !formData.plantation_growth_phase || !formData.plantation_growth_phase.trim()) {
      return 2;
    }
  } else {
    return 2;
  }
  
  // Jika semua step selesai
  return 3; // Aspirasi adalah step 4
};