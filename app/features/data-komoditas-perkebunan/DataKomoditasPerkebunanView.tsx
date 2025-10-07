import React, { useEffect, useMemo, useState } from "react";
import { CalendarIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { Input } from "~/components/ui/input";
import { id as idLocale } from "date-fns/locale/id";
import { Label } from "~/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { cn } from "~/lib/utils";
import { Icon } from "@iconify/react";
import { ImageUpload } from "~/components/ImageUplaod";
import { useFormContext, type FieldPath } from "react-hook-form";
import type { FullFormType } from "~/global-validation/validation-step-schemas";
import { FasePertumbuhanPerkebunan, KeterlambatanTanamPanen, KomoditasPerkebunanYangDitanam, MasalahProduksiPerkebunan, StatusLahan, TeknologiMethodePerkebunan } from "~/const/komoditas";
import { Cuaca7HariTerakhir, DampakCuaca, JenisHamaPenyakitPerkebunan, LuastTerdampakHama, TindakanPengendalianHamaPerkebunan } from "~/const/hama_penyakit_cuaca";
import { ConfirmationDialog } from "~/components/ConfirmationDialog";

export default function DataKomoditasPerkebunanView() {
  const { register, formState: { errors }, setValue, getValues, watch, trigger, reset } = useFormContext<FullFormType>();
  const navigate = useNavigate();
  const [showBackDialog, setShowBackDialog] = useState(false);

  // Set komoditas value and ensure has_pest_disease initial state when component mounts
  useEffect(() => {
    setValue("komoditas", "perkebunan");

    // Ensure has_pest_disease has proper initial value
    const currentValue = getValues("has_pest_disease");
    if (currentValue === undefined || currentValue === null) {
      setValue("has_pest_disease", false);
    }
  }, [setValue, getValues]);

  // Function to clear perkebunan-specific data
  const clearPerkebunanData = () => {
    // Clear perkebunan-specific fields
    setValue("plantation_commodity", "");
    setValue("plantation_land_status", "");
    setValue("plantation_land_area", 0);
    setValue("plantation_growth_phase", "");
    setValue("plantation_plant_age", 0);
    setValue("plantation_technology", "");
    setValue("plantation_planting_date", "");
    setValue("plantation_harvest_date", "");
    setValue("plantation_delay_reason", "");
    setValue("production_problems", "");
    
    // Clear pest/disease fields
    setValue("has_pest_disease", false);
    setValue("pest_disease_type", "");
    setValue("affected_area", "");
    
    // Clear weather fields
    setValue("weather_condition", "");
    setValue("weather_impact", "");
    
    // Clear photos
    setValue("photos", null);
    
    // Clear localStorage data if any
    localStorage.removeItem("perkebunanFormData");
  };

  // Handler for back button with confirmation
  const handleBackWithConfirmation = () => {
    setShowBackDialog(true);
  };

  // Handler for confirming back navigation
  const handleConfirmBack = () => {
    clearPerkebunanData();
    navigate("/komoditas");
  };

  // Type guard for perkebunan-specific errors
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

  const dateTanam = watch("plantation_planting_date");
  const datePerkiraanPanen = watch("plantation_harvest_date");
  const komoditasPerkebunan = watch("plantation_commodity");
  const statusLahan = watch("plantation_land_status");
  const fasePertumbuhan = watch("plantation_growth_phase");
  const teknologiMetode = watch("plantation_technology");
  const keterlambatanTanamPanen = watch("plantation_delay_reason");
  const masalahProduksi = watch("production_problems");
  const adaSeranganHama = watch("has_pest_disease", false);

  // Memoize the Select value to ensure consistent string representation
  const pestDiseaseSelectValue = useMemo(() => {
    return adaSeranganHama === true ? "ya" : "tidak";
  }, [adaSeranganHama]);
  const jenisHamaPenyakit = watch("pest_disease_type");
  const luasSeranganHama = watch("affected_area");
  const tindakanPengendalianHama = watch("pest_control_action");
  const cuaca7Hari = watch("weather_condition");
  const dampakCuaca = watch("weather_impact");

  const formatIndonesianLong = (date: Date) => {
    const bulan = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    return `${date.getDate()} ${bulan[date.getMonth()]} ${date.getFullYear()}`;
  };

  const handleNext = async () => {
    try {
      console.log('🔍 Validating perkebunan form data...');

      const isValid = await trigger([
        "plantation_commodity" as FieldPath<FullFormType>,
        "plantation_land_status" as FieldPath<FullFormType>,
        "plantation_land_area" as FieldPath<FullFormType>,
        "plantation_growth_phase" as FieldPath<FullFormType>,
        "plantation_plant_age" as FieldPath<FullFormType>,
        "plantation_technology" as FieldPath<FullFormType>,
        "plantation_planting_date" as FieldPath<FullFormType>,
        "plantation_harvest_date" as FieldPath<FullFormType>,
        "plantation_delay_reason" as FieldPath<FullFormType>,
        "production_problems" as FieldPath<FullFormType>,
        "has_pest_disease" as FieldPath<FullFormType>,
        "pest_disease_type" as FieldPath<FullFormType>,
        "affected_area" as FieldPath<FullFormType>,
        "pest_control_action" as FieldPath<FullFormType>,
        "weather_condition" as FieldPath<FullFormType>,
        "weather_impact" as FieldPath<FullFormType>,
        "photos" as FieldPath<FullFormType>
      ]);

      console.log('🔍 Validation result:', isValid);
      console.log('🔍 Current errors:', errors);

      if (isValid) {
        console.log('✅ Perkebunan form valid, navigating to aspirasi-tani');
        navigate("/aspirasi-tani");
      } else {
        console.log('❌ Perkebunan form validation failed');
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

  // Debug realtime perubahan field tertentu
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      console.log("📌 Field berubah:", name, "Type:", type, "Value:", value);
    });
    return () => subscription.unsubscribe();
  }, [watch]);


  return (
    <div className="space-y-6">
      {/* Data Komoditas Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Data Komoditas</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Komoditas Perkebunan yang Ditanam */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2">
              Komoditas Perkebunan yang Ditanam<span className="text-red-500">*</span>
            </label>
            <Select value={komoditasPerkebunan} onValueChange={(value) => setValue("plantation_commodity", value)}>
              <SelectTrigger className={`w-full h-12 rounded-xl ${getFieldError('plantation_commodity')
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-200 focus:ring-green-500'
                }`}>
                <SelectValue placeholder="Pilih Komoditas Perkebunan" />
              </SelectTrigger>
              <SelectContent>
                {KomoditasPerkebunanYangDitanam.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getFieldError('plantation_commodity') && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage('plantation_commodity')}</p>
            )}
          </div>

          {/* Status Lahan */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2">
              Status Lahan<span className="text-red-500">*</span>
            </label>
            <Select value={statusLahan} onValueChange={(value) => setValue("plantation_land_status", value)}>
              <SelectTrigger className={`w-full h-12 rounded-xl ${getFieldError('plantation_land_status')
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
            {getFieldError('plantation_land_status') && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage('plantation_land_status')}</p>
            )}
          </div>

          {/* Luas Lahan (Ha) */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2">
              Luas Lahan (Ha)<span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              {...register("plantation_land_area", { valueAsNumber: true })}
              placeholder="Contoh: 10"
              className={`h-12 rounded-xl ${getFieldError('plantation_land_area')
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-200 focus:ring-green-500'
                }`}
            />
            {getFieldError('plantation_land_area') && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage('plantation_land_area')}</p>
            )}
          </div>

          {/* Fase Pertumbuhan */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2">
              Fase Pertumbuhan<span className="text-red-500">*</span>
            </label>
            <Select value={fasePertumbuhan} onValueChange={(value) => setValue("plantation_growth_phase", value)}>
              <SelectTrigger className={`w-full h-12 rounded-xl ${getFieldError('plantation_growth_phase')
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-200 focus:ring-green-500'
                }`}>
                <SelectValue placeholder="Pilih Fase Pertumbuhan" />
              </SelectTrigger>
              <SelectContent>
                {FasePertumbuhanPerkebunan.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getFieldError('plantation_growth_phase') && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage('plantation_growth_phase')}</p>
            )}
          </div>

          {/* Umur Tanaman (Hari) */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2">
              Umur Tanaman (Hari)<span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              {...register("plantation_plant_age", { valueAsNumber: true })}
              placeholder="Contoh: 15"
              className={`h-12 rounded-xl ${getFieldError('plantation_plant_age')
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-200 focus:ring-green-500'
                }`}
            />
            {getFieldError('plantation_plant_age') && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage('plantation_plant_age')}</p>
            )}
          </div>

          {/* Teknologi/Metode */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2">
              Teknologi/Metode<span className="text-red-500">*</span>
            </label>
            <Select value={teknologiMetode} onValueChange={(value) => setValue("plantation_technology", value)}>
              <SelectTrigger className={`w-full h-12 rounded-xl ${getFieldError('plantation_technology')
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-200 focus:ring-green-500'
                }`}>
                <SelectValue placeholder="Pilih Teknologi/Metode" />
              </SelectTrigger>
              <SelectContent>
                {TeknologiMethodePerkebunan.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getFieldError('plantation_technology') && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage('plantation_technology')}</p>
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
                    getFieldError('plantation_planting_date')
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-200 focus:ring-green-500'
                  )}
                >
                  {dateTanam ? (
                    <span className="text-gray-900">
                      {formatIndonesianLong(new Date(dateTanam))}
                    </span>
                  ) : (
                    <span className={getFieldError('plantation_planting_date') ? 'text-red-500' : 'text-gray-400'}>Pilih tanggal tanam</span>
                  )}
                  <CalendarIcon className="mr-2 h-5 w-5 text-gray-700" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-2xl border-gray-200" align="start">
                <Calendar
                  mode="single"
                  selected={dateTanam ? new Date(dateTanam) : undefined}
                  onSelect={(date) => setValue("plantation_planting_date", date?.toISOString() || "")}
                  locale={idLocale}
                  className="rounded-2xl"
                />
              </PopoverContent>
            </Popover>
            {getFieldError('plantation_planting_date') && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage('plantation_planting_date')}</p>
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
                    getFieldError('plantation_harvest_date')
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-200 focus:ring-green-500'
                  )}
                >
                  {datePerkiraanPanen ? (
                    <span className="text-gray-900">
                      {formatIndonesianLong(new Date(datePerkiraanPanen))}
                    </span>
                  ) : (
                    <span className={getFieldError('plantation_harvest_date') ? 'text-red-500' : 'text-gray-400'}>Pilih tanggal panen</span>
                  )}
                  <CalendarIcon className="mr-2 h-5 w-5 text-gray-700" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-2xl border-gray-200" align="start">
                <Calendar
                  mode="single"
                  selected={datePerkiraanPanen ? new Date(datePerkiraanPanen) : undefined}
                  onSelect={(date) => setValue("plantation_harvest_date", date?.toISOString() || "")}
                  locale={idLocale}
                  className="rounded-2xl"
                />
              </PopoverContent>
            </Popover>
            {getFieldError('plantation_harvest_date') && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage('plantation_harvest_date')}</p>
            )}
          </div>

          {/* Keterlambatan Tanam/Panen */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2">
              Keterlambatan Tanam/Panen<span className="text-red-500">*</span>
            </label>
            <Select value={keterlambatanTanamPanen} onValueChange={(value) => setValue("plantation_delay_reason", value)}>
              <SelectTrigger className={`w-full h-12 rounded-xl ${getFieldError('plantation_delay_reason')
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
            {getFieldError('plantation_delay_reason') && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage('plantation_delay_reason')}</p>
            )}
          </div>

          {/* Foto Lokasi + Unggah Button */}


          {/* Masalah Produksi */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2">
              Masalah Produksi<span className="text-red-500">*</span>
            </label>
            <Select value={masalahProduksi} onValueChange={(value) => setValue("production_problems", value)}>
              <SelectTrigger className={`w-full h-12 rounded-xl ${getFieldError('production_problems')
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-200 focus:ring-green-500'
                }`}>
                <SelectValue placeholder="Pilih Masalah Produksi" />
              </SelectTrigger>
              <SelectContent>
                {MasalahProduksiPerkebunan.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getFieldError('production_problems') && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage('production_problems')}</p>
            )}
          </div>
        </div>
        <div className="mt-6">
          <label className="text-sm font-semibold text-gray-700 mb-4 mt-6">
            Foto Lokasi<span className="text-red-500">*</span>
          </label>
          <ImageUpload
            onFileChange={(file) => setValue("photos", file)}
            error={getErrorMessage('photos')}
          />
        </div>
      </div>

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
            <label className="text-sm font-semibold text-gray-700 mb-2">
              Jenis Hama/Penyakit Dominan<span className="text-red-500">*</span>
            </label>
            <Select value={jenisHamaPenyakit} onValueChange={(value) => setValue("pest_disease_type", value)}>
              <SelectTrigger className={`w-full h-12 rounded-xl ${getFieldError('pest_disease_type')
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-200 focus:ring-green-500'
                }`}>
                <SelectValue placeholder="Pilih Jenis Hama/Penyakit" />
              </SelectTrigger>
              <SelectContent>
                {JenisHamaPenyakitPerkebunan.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getFieldError('pest_disease_type') && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage('pest_disease_type')}</p>
            )}
          </div>

          {/* Luas Serangan Hama */}
          <div>
            <label className={`text-sm font-semibold mb-2 ${!adaSeranganHama ? 'text-gray-400' : 'text-gray-700'}`}>
              Luas Terserang Hama<span className="text-red-500">*</span>
            </label>
            <Select
              value={luasSeranganHama}
              onValueChange={(value) => setValue("affected_area", value)}
              disabled={!adaSeranganHama}
            >
              <SelectTrigger className={`w-full h-12 rounded-xl ${!adaSeranganHama
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
            {getFieldError('affected_area') && adaSeranganHama && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage('affected_area')}</p>
            )}
          </div>

          {/* Tindakan Pengendalian Hama */}
          <div>
            <label className={`text-sm font-semibold mb-2 ${!adaSeranganHama ? 'text-gray-400' : 'text-gray-700'}`}>
              Tindakan Pengendalian Hama*
            </label>
            <Select
              value={tindakanPengendalianHama}
              onValueChange={(value) => setValue("pest_control_action", value)}
              disabled={!adaSeranganHama}
            >
              <SelectTrigger className={`w-full h-12 rounded-xl ${!adaSeranganHama
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                : getFieldError('pest_control_action')
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-200 focus:ring-green-500'
                }`}>
                <SelectValue placeholder="Pilih Tindakan Pengendalian" />
              </SelectTrigger>
              <SelectContent>
                {TindakanPengendalianHamaPerkebunan.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getFieldError('pest_control_action') && adaSeranganHama && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage('pest_control_action')}</p>
            )}
          </div>

          {/* Cuaca 7 Hari Terakhir */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2">
              Cuaca 7 Hari Terakhir<span className="text-red-500">*</span>
            </label>
            <Select value={cuaca7Hari} onValueChange={(value) => setValue("weather_condition", value)}>
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
              Dampak Cuaca <span className="text-red-500">*</span>
            </label>
            <Select value={dampakCuaca} onValueChange={(value) => setValue("weather_impact", value)}>
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
        description="Anda yakin ingin kembali? Data yang telah diisi di Komoditas Perkebunan akan dihapus."
        confirmText="Ya, Kembali"
        cancelText="Batal"
      />
    </div>
  );
}