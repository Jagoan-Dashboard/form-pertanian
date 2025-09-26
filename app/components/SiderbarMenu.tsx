import { useState } from "react";
import { Icon } from '@iconify/react';

export function SiderbarMenu() {
  const [currentStep, setCurrentStep] = useState(1);
  const steps = [
    { number: 1, title: 'Data Penyuluh', desc: 'Masukan identitas penyuluh dan petani' },
    { number: 2, title: 'Komoditas', desc: 'Pilih jenis komoditas yang ditanam' },
    { number: 3, title: 'Data Komoditas', desc: 'Lengkapi informasi detail terkait komoditas' },
    { number: 4, title: 'Aspirasi Petani', desc: 'Bagikan aspirasi dan masukan dari petani' }
  ];
  return (
    <aside className="lg:sticky lg:top-24 h-fit">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="space-y-4">
          {steps.map((step) => (
            <button
              key={step.number}
              onClick={() => setCurrentStep(step.number)}
              className={`w-full text-left transition-all duration-200 ${currentStep === step.number ? 'scale-105' : 'hover:scale-102'
                }`}
            >
              <div className={`flex gap-3 p-4 rounded-xl ${currentStep === step.number
                ? 'bg-green-600 text-white shadow-lg shadow-green-200'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${currentStep === step.number
                  ? 'bg-white text-green-600'
                  : 'bg-white text-gray-400'
                  }`}>
                  {step.number}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm mb-0.5">{step.title}</h3>
                  <p className={`text-xs ${currentStep === step.number ? 'text-green-50' : 'text-gray-500'
                    }`}>
                    {step.desc}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <button className="w-full flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition-colors">
            <Icon icon="mdi:help-circle" className="w-4 h-4" />
            <span className="font-medium">Butuh bantuan?</span>
          </button>
          <p className="text-xs text-gray-500 mt-1 ml-6">Hubungi kami</p>
        </div>
      </div>
    </aside>

  )
}