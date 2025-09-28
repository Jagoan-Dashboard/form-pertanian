import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router";

interface KomoditasType {
  id: string;
  name: string;
  icon: string;
  navigate: string;
}

export default function KomoditasView() {
  const [selectedKomoditas, setSelectedKomoditas] = useState<string | null>(null);
  const navigate = useNavigate();

  const komoditasList: KomoditasType[] = [
    {
      id: "pangan",
      name: "Pangan",
      icon: "streamline-plump:wheat-solid",
      navigate: "/data-komoditas-pangan"
    },
    {
      id: "hortikultura",
      name: "Hortikultura",
      icon: "ri:plant-fill",
      navigate: "/data-komoditas-hortikultura"
    },
    {
      id: "perkebunan",
      name: "Perkebunan",
      icon: "mdi:seed",
      navigate: "/data-komoditas-perkebunan"
    }
  ];

  const handleSelect = (id: string) => {
    setSelectedKomoditas(id);
  };


  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">
        Pilih Komoditas yang Ditanam
      </h2>

      {/* Komoditas Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {komoditasList.map((komoditas) => {
          const isSelected = selectedKomoditas === komoditas.id;

          return (
            <button
              key={komoditas.id}
              onClick={() => handleSelect(komoditas.id)}
              className={`p-6 rounded-2xl border-2 transition-all duration-200 ${isSelected
                  ? "border-green-600 bg-green-50"
                  : "border-gray-200 bg-white hover:border-green-300 hover:bg-gray-50"
                }`}
            >
              <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center ${isSelected ? "bg-green-600" : "bg-green-100"
                }`}>
                <Icon
                  icon={komoditas.icon}
                  className={`w-8 h-8 ${isSelected ? "text-white" : "text-green-600"
                    }`}
                />
              </div>
              <p className={`text-center font-semibold ${isSelected ? "text-green-600" : "text-gray-700"
                }`}>
                {komoditas.name}
              </p>
            </button>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          className="px-8 py-6 rounded-xl cursor-pointer  border-green-600 text-green-600 hover:bg-green-50 hover:text-green-600"
        >
          Kembali
        </Button>
        <Button
          onClick={() => {
            const selected = komoditasList.find(k => k.id === selectedKomoditas);
            if (selected) {
              navigate(selected.navigate);
            }
          }}
          disabled={!selectedKomoditas}
          className="bg-green-600 cursor-pointer hover:bg-green-700 text-white font-semibold py-6 px-10 rounded-xl transition-all duration-200 shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Selanjutnya
          <Icon icon="material-symbols:chevron-right" className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}