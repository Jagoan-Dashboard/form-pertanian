import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useFormContext } from 'react-hook-form';
import { canAccessStep, getLastCompletedStep } from '~/lib/form-state';
import { toast } from 'sonner';

export const useStepValidation = (currentStep: number) => {
  const navigate = useNavigate();
  const { getValues } = useFormContext();
  
  useEffect(() => {
    const formData = getValues();
    
    // Check immediately if user can access this step
    if (!canAccessStep(currentStep, formData)) {
      const lastCompletedStep = getLastCompletedStep(formData);
      
      // Redirect ke step terakhir yang telah diselesaikan
      const redirectToStep = lastCompletedStep + 1;
      let redirectPath = '/';
      let nameStep = '';
      
      switch (redirectToStep) {
        case 1:
          redirectPath = '/'; // Data Penyuluh
          nameStep = 'Data Penyuluh';
          break;
        case 2:
          redirectPath = '/komoditas'; // Komoditas
          nameStep = 'Komoditas';
          break;
        case 3:
          redirectPath = '/komoditas'; // Data Komoditas - redirect back to komoditas selection
          nameStep = 'Data Komoditas';
          break;
        case 4:
          redirectPath = '/aspirasi-tani'; // Aspirasi - if they tried to access without completing step 3
          nameStep = 'Aspirasi';
          break;
      }
      
      console.log(`Unauthorized access to step ${currentStep}, redirecting to step ${redirectToStep}`);
      toast.error(`Silakan lengkapi form sebelumnya terlebih dahulu. Anda akan diarahkan ke form ${nameStep}.`);
      
      // Use navigate with replace to prevent back navigation
      navigate(redirectPath, { replace: true });
    }
  }, [currentStep, getValues, navigate]); // Run once when component mounts to check access
};