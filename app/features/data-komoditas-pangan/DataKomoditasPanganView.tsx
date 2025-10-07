import React, { useEffect, useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Icon } from "@iconify/react";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import { id as idLocale } from "date-fns/locale/id";
import { Calendar } from "~/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { ImageUpload } from "~/components/ImageUplaod";
import { useFormContext } from "react-hook-form";
import type { FullFormType } from "~/global-validation/validation-step-schemas";
import { FasePertumbuhanPangan, KeterlambatanTanamPanen, KomoditasPanganYangDitanam, StatusLahan, TeknologiMethodePangan } from "~/const/komoditas";
import { Cuaca7HariTerakhir, DampakCuaca, JenisHamaPenyakit, LuastTerdampakHama, TindakanPengendalianHama } from "~/const/hama_penyakit_cuaca";
import { ConfirmationDialog } from "~/components/ConfirmationDialog";

export default function DataKomoditasPanganView() {
  const { register, formState: { errors }, setValue, getValues, watch, trigger, reset } = useFormContext<FullFormType>();
  const navigate = useNavigate();
  const [showBackDialog, setShowBackDialog] = useState(false);

  // Set komoditas value and ensure has_pest_disease initial state when component mounts
  React.useEffect(() => {
    setValue("komoditas", "pangan");

    // Ensure has_pest_disease has proper initial value
    const currentValue = getValues("has_pest_disease");
    if (currentValue === undefined || currentValue === null) {
      setValue("has_pest_disease", false);
    }
  }, [setValue, getValues]);

  // Function to clear pangan-specific data
  const clearPanganData = () => {
    // Clear pangan-specific fields
    setValue("food_commodity", "");
    setValue("food_land_status", "");
    setValue("food_land_area", 0);
    setValue("food_growth_phase", "");
    setValue("food_plant_age", 0);
    setValue("food_technology", "");
    setValue("food_planting_date", "");
    setValue("food_harvest_date", "");
    setValue("food_delay_reason", "");
    
    // Clear pest/disease fields
    setValue("has_pest_disease", false);
    setValue("pest_disease_type", "");
    setValue("affected_area", "");
    setValue("pest_control_action", "");
    
    // Clear weather fields
    setValue("weather_condition", "");
    setValue("weather_impact", "");
    
    // Clear photos
    setValue("photos", null);
    
    // Clear localStorage data if any
    localStorage.removeItem("panganFormData");
  };

  // Handler for back button with confirmation
  const handleBackWithConfirmation = () => {
    setShowBackDialog(true);
  };

  // Handler for confirming back navigation
  const handleConfirmBack = () => {
    clearPanganData();
    navigate("/komoditas");
  };

  // Type guard for pangan-specific errors
  const getFieldError = (fieldName: string) => {
    return errors[fieldName as keyof typeof errors];
  };

  const getErrorMessage = (fieldName: string): string | undefined => {
    const error = getFieldError(fieldName);
    if (error && typeof error === 'object' && 'message' in error) {
      return typeof error.message === 'string' ? error.message : String(error.message);
    }
    return undefined;
  };

  const dateTanam = watch("food_planting_date");
  const datePerkiraanPanen = watch("food_harvest_date");
  const foodCommodity = watch("food_commodity");
  const foodLandStatus = watch("food_land_status");
  const foodGrowthPhase = watch("food_growth_phase");
  const foodTechnology = watch("food_technology");
  const foodDelayReason = watch("food_delay_reason");
  const hasPestDisease = watch("has_pest_disease", false);

  // Memoize the Select value to ensure consistent string representation
  const pestDiseaseSelectValue = useMemo(() => {
    return hasPestDisease === true ? "ya" : "tidak";
  }, [hasPestDisease]);
  const pestDiseaseType = watch("pest_disease_type");
  const pestControlAction = watch("pest_control_action");
  const weatherCondition = watch("weather_condition");
  const weatherImpact = watch("weather_impact");

  const formatIndonesianLong = (date: Date) => {
    const bulan = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    return `${date.getDate()} ${bulan[date.getMonth()]} ${date.getFullYear()}`;
  };

  const handleNext = async () => {
    try {
      console.log('🔍 Validating pangan form data...');

      const isValid = await trigger([
        "food_commodity",
        "food_land_status",
        "food_land_area",
        "food_growth_phase",
        "food_plant_age",
        "food_technology",
        "food_planting_date",
        "food_harvest_date",
        "food_delay_reason",
        "has_pest_disease",
        "pest_disease_type",
        "affected_area",
        "pest_control_action",
        "weather_condition",
        "weather_impact",
        "photos"
      ]);

      console.log('🔍 Validation result:', isValid);
      console.log('🔍 Current errors:', errors);

      if (isValid) {
        console.log('✅ Pangan form valid, navigating to aspirasi-tani');
        navigate("/aspirasi-tani");
      } else {
        console.log('❌ Pangan form validation failed');
        // Scroll to first error
        const errorElement = document.querySelector('.text-red-500');
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    } catch (error) {
      console.error('❌ Error during form validation:', error);
    }
  };




  return (
    <div className="space-y-6">
      {/* Data Komoditas Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Data Komoditas</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Komoditas Pangan */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2">
              Komoditas Pangan yang Ditanam<span className="text-red-500">*</span>
            </label>
            <Select onValueChange={(value) => setValue("food_commodity", value)} value={foodCommodity}>
              <SelectTrigger className={`w-full h-12 rounded-xl ${getFieldError('food_commodity')
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-200 focus:ring-green-500'
                }`}>
                <SelectValue placeholder="Pilih Komoditas Pangan" />
              </SelectTrigger>
              <SelectContent>
                {KomoditasPanganYangDitanam.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getFieldError('food_commodity') && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage('food_commodity')}</p>
            )}
          </div>

          {/* Status Lahan */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2">
              Status Lahan<span className="text-red-500">*</span>
            </label>
            <Select onValueChange={(value) => setValue("food_land_status", value)} value={foodLandStatus}>
              <SelectTrigger className={`w-full h-12 rounded-xl ${getFieldError('food_land_status')
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-200 focus:ring-green-500'
                }`}>
                <SelectValue placeholder="Pilih Status Lahan" />
              </SelectTrigger>
              <SelectContent>
                {StatusLahan.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getFieldError('food_land_status') && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage('food_land_status')}</p>
            )}
          </div>

          {/* Luas Lahan */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2">
              Luas Lahan (Ha)<span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              {...register("food_land_area", { valueAsNumber: true })}
              placeholder="Contoh: 10"
              className={`h-12 rounded-xl ${getFieldError('food_land_area')
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-200 focus:ring-green-500'
                }`}
            />
            {getFieldError('food_land_area') && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage('food_land_area')}</p>
            )}
          </div>

          {/* Fase Pertumbuhan */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2">
              Fase Pertumbuhan<span className="text-red-500">*</span>
            </label>
            <Select onValueChange={(value) => setValue("food_growth_phase", value)} value={foodGrowthPhase}>
              <SelectTrigger className={`w-full h-12 rounded-xl ${getFieldError('food_growth_phase')
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-200 focus:ring-green-500'
                }`}>
                <SelectValue placeholder="Pilih Fase Pertumbuhan" />
              </SelectTrigger>
              <SelectContent>
                {FasePertumbuhanPangan.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getFieldError('food_growth_phase') && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage('food_growth_phase')}</p>
            )}
          </div>

          {/* Umur Tanaman */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2">
              Umur Tanaman (Hari)<span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              {...register("food_plant_age", { valueAsNumber: true })}
              placeholder="Contoh: 15"
              className={`h-12 rounded-xl ${getFieldError('food_plant_age')
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-200 focus:ring-green-500'
                }`}
            />
            {getFieldError('food_plant_age') && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage('food_plant_age')}</p>
            )}
          </div>

          {/* Teknologi/Metode */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2">
              Teknologi/Metode<span className="text-red-500">*</span>
            </label>
            <Select onValueChange={(value) => setValue("food_technology", value)} value={foodTechnology}>
              <SelectTrigger className={`w-full h-12 rounded-xl ${getFieldError('food_technology')
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-200 focus:ring-green-500'
                }`}>
                <SelectValue placeholder="Pilih Teknologi/Metode" />
              </SelectTrigger>
              <SelectContent>
                {TeknologiMethodePangan.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getFieldError('food_technology') && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage('food_technology')}</p>
            )}
          </div>

          {/* Tanggal Tanam */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2">
              Tanggal Tanam<span className="text-red-500">*</span>
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-between text-left items-center font-normal px-4 py-6 rounded-xl hover:bg-gray-50 focus:ring-2 focus:border-transparent transition-all",
                    getFieldError('food_planting_date')
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-200 focus:ring-green-500'
                  )}
                >
                  {dateTanam ? (
                    <span className="text-gray-900">
                      {formatIndonesianLong(new Date(dateTanam))}
                    </span>
                  ) : (
                    <span className={getFieldError('food_planting_date') ? 'text-red-500' : 'text-gray-400'}>Pilih tanggal kunjungan</span>
                  )}
                  <CalendarIcon className="mr-2 h-5 w-5 text-gray-700" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-2xl border-gray-200" align="start">
                <Calendar
                  mode="single"
                  selected={dateTanam ? new Date(dateTanam) : undefined}
                  onSelect={(date) => setValue("food_planting_date", date?.toISOString() || "")}
                  locale={idLocale}
                  className="rounded-2xl"
                />
              </PopoverContent>
            </Popover>
            {getFieldError('food_planting_date') && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage('food_planting_date')}</p>
            )}
          </div>

          {/* Tanggal Perkiraan Panen */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2">
              Tanggal Perkiraan Panen<span className="text-red-500">*</span>
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-between items-center text-left font-normal px-4 py-6 rounded-xl hover:bg-gray-50 focus:ring-2 focus:border-transparent transition-all",
                    getFieldError('food_harvest_date')
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-200 focus:ring-green-500'
                  )}
                >
                  {datePerkiraanPanen ? (
                    <span className="text-gray-900">
                      {formatIndonesianLong(new Date(datePerkiraanPanen))}
                    </span>
                  ) : (
                    <span className={getFieldError('food_harvest_date') ? 'text-red-500' : 'text-gray-400'}>Pilih tanggal kunjungan</span>
                  )}
                  <CalendarIcon className="mr-2 h-5 w-5 text-gray-700" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-2xl border-gray-200" align="start">
                <Calendar
                  mode="single"
                  selected={datePerkiraanPanen ? new Date(datePerkiraanPanen) : undefined}
                  onSelect={(date) => setValue("food_harvest_date", date?.toISOString() || "")}
                  locale={idLocale}
                  className="rounded-2xl"
                />
              </PopoverContent>
            </Popover>
            {getFieldError('food_harvest_date') && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage('food_harvest_date')}</p>
            )}
          </div>

          {/* Keterlambatan Tanam/Panen */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2">
              Keterlambatan Tanam/Panen<span className="text-red-500">*</span>
            </label>
            <Select onValueChange={(value) => setValue("food_delay_reason", value)} value={foodDelayReason}>
              <SelectTrigger className={`w-full h-12 rounded-xl ${getFieldError('food_delay_reason')
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-200 focus:ring-green-500'
                }`}>
                <SelectValue placeholder="Pilih Keterlambatan Tanam/Panen" />
              </SelectTrigger>
              <SelectContent>
                {KeterlambatanTanamPanen.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getFieldError('food_delay_reason') && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage('food_delay_reason')}</p>
            )}
          </div>


        </div>
        {/* Foto Lokasi */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-4 mt-6">
            Foto Lokasi<span className="text-red-500">*</span>
          </label>
          <ImageUpload
            onFileChange={(file) => setValue("photos", file)}
            error={getErrorMessage('photos')}
          />
        </div>
      </div>

      {/* Laporan Hama, Penyakit, dan Keadaan Cuaca Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Laporan Hama, Penyakit, dan Keadaan Cuaca
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Ada Serangan Hama/Penyakit */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2">
              Ada Serangan Hama/Penyakit?<span className="text-red-500">*</span>
            </label>
            <Select onValueChange={(value) => {
              const hasDisease = value === "ya";
              setValue("has_pest_disease", hasDisease, { shouldValidate: true });

              // Clear related fields when "tidak" is selected
              if (!hasDisease) {
                setValue("pest_disease_type", "");
                setValue("affected_area", "");
                setValue("pest_control_action", "");
              }
            }} value={pestDiseaseSelectValue}>
              <SelectTrigger className={`w-full h-12 rounded-xl ${getFieldError('has_pest_disease')
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-200 focus:ring-green-500'
                }`}>
                <SelectValue placeholder="Pilih Serangan Hama/Penyakit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ya">Ya</SelectItem>
                <SelectItem value="tidak">Tidak</SelectItem>
              </SelectContent>
            </Select>
            {getFieldError('has_pest_disease') && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage('has_pest_disease')}</p>
            )}
          </div>

          {/* Jenis Hama/Penyakit */}
          <div>
            <label className={`text-sm font-semibold mb-2 ${!hasPestDisease ? 'text-gray-400' : 'text-gray-700'}`}>
              Jenis Hama/Penyakit Dominan<span className="text-red-500">*</span>
            </label>
            <Select
              onValueChange={(value) => setValue("pest_disease_type", value)}
              value={pestDiseaseType}
              disabled={!hasPestDisease}
            >
              <SelectTrigger className={`w-full h-12 rounded-xl ${
                !hasPestDisease
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                  : getFieldError('pest_disease_type')
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-200 focus:ring-green-500'
                }`}>
                <SelectValue placeholder="Pilih Jenis Hama/Penyakit" />
              </SelectTrigger>
              <SelectContent>
              {JenisHamaPenyakit.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
              </SelectContent>
            </Select>
            {getFieldError('pest_disease_type') && hasPestDisease && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage('pest_disease_type')}</p>
            )}
          </div>

          {/* Luas Serangan Hama -> seharusnya disini adalah select */}
          <div>
            <label className={`text-sm font-semibold mb-2 ${!hasPestDisease ? 'text-gray-400' : 'text-gray-700'}`}>
              Luas Terserang Hama<span className="text-red-500">*</span>
            </label>
            <Select
              onValueChange={(value) => setValue("affected_area", value)}
              value={watch("affected_area")}
              disabled={!hasPestDisease}
            >
              <SelectTrigger className={`w-full h-12 rounded-xl ${
                !hasPestDisease
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                  : getFieldError('affected_area')
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-200 focus:ring-green-500'
                }`}>
                <SelectValue placeholder="Pilih Luas Terserang Hama" />
              </SelectTrigger>
              <SelectContent>
                {LuastTerdampakHama.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getFieldError('affected_area') && hasPestDisease && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage('affected_area')}</p>
            )}
          </div>

          {/* Tindakan Pengendalian Hama */}
          <div>
            <label className={`text-sm font-semibold mb-2 ${!hasPestDisease ? 'text-gray-400' : 'text-gray-700'}`}>
              Tindakan Pengendalian Hama<span className="text-red-500">*</span>
            </label>
            <Select
              onValueChange={(value) => setValue("pest_control_action", value)}
              value={pestControlAction}
              disabled={!hasPestDisease}
            >
              <SelectTrigger className={`w-full h-12 rounded-xl ${
                !hasPestDisease
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                  : getFieldError('pest_control_action')
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-200 focus:ring-green-500'
                }`}>
                <SelectValue placeholder="Pilih Tindakan Pengendalian" />
              </SelectTrigger>
              <SelectContent>
                {TindakanPengendalianHama.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getFieldError('pest_control_action') && hasPestDisease && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage('pest_control_action')}</p>
            )}
          </div>

          {/* Cuaca 7 Hari Terakhir */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2">
              Cuaca 7 Hari Terakhir<span className="text-red-500">*</span>
            </label>
            <Select onValueChange={(value) => setValue("weather_condition", value)} value={weatherCondition}>
              <SelectTrigger className={`w-full h-12 rounded-xl ${getFieldError('weather_condition')
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-200 focus:ring-green-500'
                }`}>
                <SelectValue placeholder="Pilih Cuaca" />
              </SelectTrigger>
              <SelectContent>
                {Cuaca7HariTerakhir.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getFieldError('weather_condition') && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage('weather_condition')}</p>
            )}
          </div>

          {/* Dampak Cuaca */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2">
              Dampak Cuaca<span className="text-red-500">*</span>
            </label>
            <Select onValueChange={(value) => setValue("weather_impact", value)} value={weatherImpact}>
              <SelectTrigger className={`w-full h-12 rounded-xl ${getFieldError('weather_impact')
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-200 focus:ring-green-500'
                }`}>
                <SelectValue placeholder="Pilih Dampak Cuaca" />
              </SelectTrigger>
              <SelectContent>
                {DampakCuaca.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getFieldError('weather_impact') && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage('weather_impact')}</p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
        <Button
          onClick={handleBackWithConfirmation}
          variant="outline"
          className="sm:w-auto w-full hover:border-green-600 cursor-pointer hover:text-green-600 border-green-600 text-green-600 hover:bg-green-50 font-semibold py-6 px-10 rounded-xl transition-all duration-200"
        >
          Kembali
        </Button>
        <Button
          onClick={handleNext}
          className="sm:w-auto w-full bg-green-600 cursor-pointer hover:bg-green-700 text-white font-semibold py-6 px-10 rounded-xl transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
        >
          Selanjutnya
          <Icon icon="material-symbols:chevron-right" className="w-5 h-5" />
        </Button>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showBackDialog}
        onClose={() => setShowBackDialog(false)}
        variant="danger"
        onConfirm={handleConfirmBack}
        title="Konfirmasi Kembali"
        description="Anda yakin ingin kembali? Data yang telah diisi di Komoditas Pangan akan dihapus."
        confirmText="Ya, Kembali"
        cancelText="Batal"
      />
    </div>
  );
}