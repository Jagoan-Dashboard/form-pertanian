import { useState } from "react";
import { Icon } from '@iconify/react';
import { assets } from "~/assets/assets";
import { useIsMobile } from "~/hook/use-mobile";
import { useNavigate } from "react-router";

export function SidebarMenu() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    {
      number: 1,
      title: 'Data Penyuluh',
      desc: 'Masukan identitas penyuluh dan petani.',
      path: '/'
    },
    {
      number: 2,
      title: 'Komoditas',
      desc: 'Pilih jenis komoditas yang ditanam.',
      path: '/komoditas'
    },
    {
      number: 3,
      title: 'Data Komoditas',
      desc: 'Lengkapi informasi detail terkait komoditas.',
      path: '/data-komoditas'
    },
    {
      number: 4,
      title: 'Aspirasi Petani',
      desc: 'Bagikan aspirasi dan masukan dari petani.',
      path: '/aspirasi-tani'
    }
  ];

  const handleStepClick = (stepNumber: number) => {
    setCurrentStep(stepNumber);
    navigate(steps[stepNumber - 1].path);
  };

  return (
    <>
      {/* Web View - Sidebar */}
      {!isMobile ? (
        <aside className="lg:block lg:sticky lg:top-[5%] h-fit">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-center items-center gap-3 my-5">
              <img src={assets.imageLogoNgawi} alt="Logo Ngawi" width={25} height={25} />
              <span className="h-[20px] w-[1px] bg-gray-400"></span>
              <img src={assets.imageLogo} alt="Logo Jagoan Data" width={120} height={120} />
            </div>

            <div className="space-y-3" >
              {steps.map((step, index) => {
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;

                return (
                  <div
                    onClick={() => handleStepClick(step.number)}
                    key={step.number}
                    className="block cursor-pointer"
                  >
                    <div className="relative">
                      <div className={`flex gap-4 p-4 rounded-lg transition-all duration-200 ${isActive
                        ? 'bg-green-100' // Current step - spotlight dengan bg merah
                        : isCompleted
                          ? 'bg-green-50' // Completed step - bg hijau tanpa spotlight
                          : '' // Upcoming step - hover abu-abu
                        }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0 ${isCompleted
                          ? 'bg-green-600 text-white' // Completed - hijau dengan checkmark
                          : isActive
                            ? 'bg-green-600 text-white' // Active - hijau
                            : 'bg-gray-100 text-gray-400' // Upcoming - abu-abu
                          }`}>
                          {isCompleted ? (
                            <Icon icon="mdi:check" className="w-5 h-5" />
                          ) : (
                            step.number
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-semibold text-base mb-1 ${isActive
                            ? 'text-green-600' // Active text - hijau
                            : isCompleted
                              ? 'text-green-700' // Completed text - hijau gelap
                              : 'text-gray-800' // Upcoming text - abu-abu
                            }`}>
                            {step.title}
                          </h3>
                          <p className="text-xs text-gray-500 leading-relaxed">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`absolute left-[30px] top-[56px] w-0.5 h-6 transition-colors ${isCompleted || isActive
                          ? 'bg-green-600' // Line hijau untuk completed/active
                          : 'bg-gray-200' // Line abu-abu untuk upcoming
                          }`}></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <button className="w-full flex justify-between items-center gap-3 text-sm text-gray-700 hover:text-green-600 transition-colors">
                <div className="text-left">
                  <p className="font-semibold text-base">Butuh bantuan?</p>
                  <p className="text-xs text-gray-500">Hubungi kami</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <Icon icon="material-symbols:headset-mic" className="w-5 h-5 text-gray-600" />
                </div>
              </button>
            </div>
          </div>
        </aside>
      ) : (
        /* Mobile View - Progress Bar */
        <div className="sticky top-0 bg-white border-b border-gray-200 shadow-sm z-50 px-4 py-4">
          <div className="mt-3 text-center mb-4">
            <p className="text-normal font-semibold text-green-600">
              {steps[currentStep - 1]?.title}
            </p>
          </div>
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const isCompleted = index < currentStep - 1;
              const isActive = index === currentStep - 1;
              const isUpcoming = index > currentStep - 1;

              return (
                <div
                  key={step.number}
                  className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
                >
                  {/* Step Circle */}
                  <div
                    onClick={() => handleStepClick(step.number)}
                    className="relative z-10 flex-shrink-0 cursor-pointer"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold text-sm transition-all duration-300 ${isCompleted
                      ? 'bg-green-600 text-white'
                      : isActive
                        ? 'bg-green-100 text-green-600 border-2 border-green-600'
                        : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
                      }`}>
                      {isCompleted ? (
                        <Icon icon="mdi:check" className="w-6 h-6" />
                      ) : (
                        step.number
                      )}
                    </div>
                  </div>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 transition-all duration-300 ${index < currentStep - 1
                      ? 'bg-green-600'
                      : 'bg-gray-200'
                      }`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Active Step Title */}

        </div>
      )}
    </>
  );
}