import { Button } from "~/components/ui/button";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router";
import { useFormContext } from "react-hook-form";

interface KomoditasType {
  id: string;
  name: string;
  icon: string;
  navigate: string;
}

export default function KomoditasView() {
  const navigate = useNavigate();
  const { setValue, trigger, watch, formState: { errors } } = useFormContext();

  const selectedKomoditas = watch("selectedKomoditas"); // ambil dari form
  const komoditasList: KomoditasType[] = [
    { id: "pangan", name: "Pangan", icon: "streamline-plump:wheat-solid", navigate: "/komoditas/pangan" },
    { id: "hortikultura", name: "Hortikultura", icon: "ri:plant-fill", navigate: "/komoditas/hortikultura" },
    { id: "perkebunan", name: "Perkebunan", icon: "mdi:seed", navigate: "/komoditas/perkebunan" }
  ];

  const handleSelect = (id: "pangan" | "hortikultura" | "perkebunan") => {
    setValue("selectedKomoditas", id, { shouldValidate: true });
    setValue("komoditas", id, { shouldValidate: true }); // Also set the komoditas field for validation

    // Reset other komoditas data
    if (id === "pangan") {
      setValue("horti_commodity", undefined);
      setValue("plantation_commodity", undefined);
    } else if (id === "hortikultura") {
      setValue("food_commodity", undefined);
      setValue("plantation_commodity", undefined);
    } else if (id === "perkebunan") {
      setValue("food_commodity", undefined);
      setValue("horti_commodity", undefined);
    }
  };

  const handleNext = async () => {
    const isValid = await trigger("selectedKomoditas");
    if (isValid) {
      const selected = komoditasList.find(k => k.id === selectedKomoditas);
      if (selected) navigate(selected.navigate);
    }
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
              onClick={() => handleSelect(komoditas.id as "pangan" | "hortikultura" | "perkebunan")}
              type="button"
              className={`p-6 rounded-2xl border-2 transition-all duration-200 ${isSelected
                  ? "border-green-600 bg-green-50"
                  : "border-gray-200 bg-white hover:border-green-300 hover:bg-gray-50"
                }`}
            >
              <div
                className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center ${isSelected ? "bg-green-600" : "bg-green-100"
                  }`}
              >
                <Icon
                  icon={komoditas.icon}
                  className={`w-8 h-8 ${isSelected ? "text-white" : "text-green-600"
                    }`}
                />
              </div>
              <p
                className={`text-center font-semibold ${isSelected ? "text-green-600" : "text-gray-700"
                  }`}
              >
                {komoditas.name}
              </p>
            </button>
          );
        })}
      </div>

      {/* Error handling */}
      {errors.selectedKomoditas && (
        <p className="text-red-500 text-sm mb-4">
          {errors.selectedKomoditas.message?.toString()}
        </p>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          type="button"
          className="px-8 py-6 rounded-xl cursor-pointer border-green-600 text-green-600 hover:bg-green-50 hover:text-green-600"
        >
          Kembali
        </Button>
        <Button
          onClick={handleNext}
          disabled={!selectedKomoditas}
          type="button"
          className="bg-green-600 cursor-pointer hover:bg-green-700 text-white font-semibold py-6 px-10 rounded-xl transition-all duration-200 shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Selanjutnya
          <Icon icon="material-symbols:chevron-right" className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
