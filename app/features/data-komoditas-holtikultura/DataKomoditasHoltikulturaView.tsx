import React, { useEffect, useMemo } from "react";
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

export default function DataKomoditasHortikulturaView() {
  const { register, formState: { errors }, setValue, getValues, watch, trigger } = useFormContext<FullFormType>();
  const navigate = useNavigate();

  // Set komoditas value and ensure has_pest_disease initial state when component mounts
  useEffect(() => {
    setValue("komoditas", "hortikultura");

    // Ensure has_pest_disease has proper initial value
    const currentValue = getValues("has_pest_disease");
    if (currentValue === undefined || currentValue === null) {
      setValue("has_pest_disease", false);
    }
  }, [setValue, getValues]);

  // Type guard for hortikultura-specific errors
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

  const dateTanam = watch("horti_planting_date");
  const datePerkiraanPanen = watch("horti_harvest_date");
  const jenisHortikultura = watch("horti_commodity");
  const komoditasHortikultura = watch("horti_sub_commodity");
  const statusLahan = watch("horti_land_status");
  const fasePertumbuhan = watch("horti_growth_phase");
  const teknologiMetode = watch("horti_technology");
  const keterlambatanTanamPanen = watch("horti_delay_reason");
  const masalahPascapanen = watch("post_harvest_problems");
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
      console.log('🚀 DataKomoditasHoltikultura - Starting validation...');

      const fieldsToValidate: FieldPath<FullFormType>[] = [
        "horti_commodity",
        "horti_sub_commodity",
        "horti_land_status",
        "horti_land_area",
        "horti_growth_phase",
        "horti_plant_age",
        "horti_technology",
        "horti_planting_date",
        "horti_harvest_date",
        "horti_delay_reason",
        "post_harvest_problems",
        "photos",
        "has_pest_disease",
        "pest_disease_type",
        "affected_area",
        "pest_control_action",
        "weather_condition",
        "weather_impact",
      ];

      const isValid = await trigger(fieldsToValidate);

      console.log('📋 DataKomoditasHoltikultura - Validation result:', isValid);
      console.log('🔍 DataKomoditasHoltikultura - Current errors:', errors);

      if (isValid) {
        console.log('✅ DataKomoditasHoltikultura - Validation passed, navigating to aspirasi-tani');
        navigate("/aspirasi-tani");
      } else {
        console.log('❌ DataKomoditasHoltikultura - Validation failed');

        // Find first error field and scroll to it
        const firstErrorField = fieldsToValidate.find(field =>
          errors[field as keyof typeof errors]
        );

        if (firstErrorField) {
          console.log('🎯 DataKomoditasHoltikultura - First error field:', firstErrorField);

          // Find and scroll to the error element
          const errorElement = document.querySelector(`[name="${firstErrorField}"]`) ||
                              document.querySelector(`input[name="${firstErrorField}"]`) ||
                              document.querySelector(`select[name="${firstErrorField}"]`) ||
                              document.querySelector(`textarea[name="${firstErrorField}"]`);

          if (errorElement) {
            errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            console.log('📍 DataKomoditasHoltikultura - Scrolled to error field:', firstErrorField);
          } else {
            console.log('⚠️ DataKomoditasHoltikultura - Could not find error element for:', firstErrorField);
          }
        }

        // Show user feedback
        const errorCount = Object.keys(errors).length;
        console.log(`🚨 DataKomoditasHoltikultura - Please fix ${errorCount} validation error(s) before continuing`);
      }
    } catch (error) {
      console.error('💥 DataKomoditasHoltikultura - Error in handleNext:', error);
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
          {/* Jenis Hortikultura yang Ditanam */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2">
              Jenis Hortikultura yang Ditanam*
            </Label>
            <Select value={jenisHortikultura} onValueChange={(value) => {
              setValue("horti_commodity", value);
              // When jenis hortikultura changes, clear komoditas hortikultura
              setValue("horti_sub_commodity", "");
            }}>
              <SelectTrigger className={`w-full h-12 rounded-xl ${
                getFieldError('horti_commodity')
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-200 focus:ring-green-500'
              }`}>
                <SelectValue placeholder="Pilih Jenis Hortikultura" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sayuran">Sayuran</SelectItem>
                <SelectItem value="buah">Buah</SelectItem>
                <SelectItem value="tanaman-hias">Tanaman Hias</SelectItem>
              </SelectContent>
            </Select>
            {getFieldError('horti_commodity') && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage('horti_commodity')}</p>
            )}
          </div>

          {/* Komoditas Hortikultura yang Ditanam */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2">
              Komoditas Hortikultura yang Ditanam*
            </Label>
            <Select value={komoditasHortikultura} onValueChange={(value) => setValue("horti_sub_commodity", value)}>
              <SelectTrigger className={`w-full h-12 rounded-xl ${
                getFieldError('horti_sub_commodity')
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-200 focus:ring-green-500'
              }`}>
                <SelectValue placeholder="Pilih Komoditas Hortikultura" />
              </SelectTrigger>
              <SelectContent>
                {jenisHortikultura === "sayuran" && (
                  <>
                    <SelectItem value="tomat">Tomat</SelectItem>
                    <SelectItem value="cabai">Cabai</SelectItem>
                    <SelectItem value="sawi">Sawi</SelectItem>
                    <SelectItem value="bayam">Bayam</SelectItem>
                    <SelectItem value="kangkung">Kangkung</SelectItem>
                    <SelectItem value="terong">Terong</SelectItem>
                  </>
                )}
                {jenisHortikultura === "buah" && (
                  <>
                    <SelectItem value="jeruk">Jeruk</SelectItem>
                    <SelectItem value="mangga">Mangga</SelectItem>
                    <SelectItem value="apel">Apel</SelectItem>
                    <SelectItem value="pisang">Pisang</SelectItem>
                    <SelectItem value="pepaya">Pepaya</SelectItem>
                    <SelectItem value="jambu">Jambu</SelectItem>
                  </>
                )}
                {jenisHortikultura === "tanaman-hias" && (
                  <>
                    <SelectItem value="mawar">Mawar</SelectItem>
                    <SelectItem value="anggrek">Anggrek</SelectItem>
                    <SelectItem value="melati">Melati</SelectItem>
                    <SelectItem value="kamboja">Kamboja</SelectItem>
                    <SelectItem value="bougenville">Bougenville</SelectItem>
                  </>
                )}
                {/* Default options if no jenis hortikultura selected */}
                {jenisHortikultura === "" && (
                  <>
                    <SelectItem value="tomat">Tomat</SelectItem>
                    <SelectItem value="cabai">Cabai</SelectItem>
                    <SelectItem value="jeruk">Jeruk</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
            {getFieldError('horti_sub_commodity') && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage('horti_sub_commodity')}</p>
            )}
          </div>

          {/* Status Lahan */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2">
              Status Lahan*
            </Label>
            <Select value={statusLahan} onValueChange={(value) => setValue("horti_land_status", value)}>
              <SelectTrigger className={`w-full h-12 rounded-xl ${
                getFieldError('horti_land_status') 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-200 focus:ring-green-500'
              }`}>
                <SelectValue placeholder="Pilih Status Lahan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="milik">Milik Sendiri</SelectItem>
                <SelectItem value="sewa">Sewa</SelectItem>
                <SelectItem value="bagi-hasil">Bagi Hasil</SelectItem>
              </SelectContent>
            </Select>
            {getFieldError('horti_land_status') && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage('horti_land_status')}</p>
            )}
          </div>

          {/* Luas Lahan (Ha) */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2">
              Luas Lahan (Ha)*
            </Label>
            <Input
              type="number"
              {...register("horti_land_area", { valueAsNumber: true })}
              placeholder="Contoh: 10"
              className={`h-12 rounded-xl ${
                getFieldError('horti_land_area') 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-200 focus:ring-green-500'
              }`}
            />
            {getFieldError('horti_land_area') && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage('horti_land_area')}</p>
            )}
          </div>

          {/* Fase Pertumbuhan */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2">
              Fase Pertumbuhan*
            </Label>
            <Select value={fasePertumbuhan} onValueChange={(value) => setValue("horti_growth_phase", value)}>
              <SelectTrigger className={`w-full h-12 rounded-xl ${
                getFieldError('horti_growth_phase') 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-200 focus:ring-green-500'
              }`}>
                <SelectValue placeholder="Pilih Fase Pertumbuhan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vegetatif">Vegetatif</SelectItem>
                <SelectItem value="generatif">Generatif</SelectItem>
                <SelectItem value="panen">Panen</SelectItem>
              </SelectContent>
            </Select>
            {getFieldError('horti_growth_phase') && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage('horti_growth_phase')}</p>
            )}
          </div>

          {/* Umur Tanaman (Hari) */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2">
              Umur Tanaman (Hari)*
            </Label>
            <Input
              type="number"
              {...register("horti_plant_age", { valueAsNumber: true })}
              placeholder="Contoh: 15"
              className={`h-12 rounded-xl ${
                getFieldError('horti_plant_age') 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-200 focus:ring-green-500'
              }`}
            />
            {getFieldError('horti_plant_age') && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage('horti_plant_age')}</p>
            )}
          </div>

          {/* Tanggal Tanam */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2">
              Tanggal Tanam*
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-between text-left items-center font-normal px-4 py-6 rounded-xl hover:bg-gray-50 focus:ring-2 focus:border-transparent transition-all",
                    getFieldError('horti_planting_date') 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-200 focus:ring-green-500'
                  )}
                >
                  {dateTanam ? (
                    <span className="text-gray-900">
                      {formatIndonesianLong(new Date(dateTanam))}
                    </span>
                  ) : (
                    <span className={getFieldError('horti_planting_date') ? 'text-red-500' : 'text-gray-400'}>Pilih tanggal tanam</span>
                  )}
                  <CalendarIcon className="mr-2 h-5 w-5 text-gray-700" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-2xl border-gray-200" align="start">
                <Calendar
                  mode="single"
                  selected={dateTanam ? new Date(dateTanam) : undefined}
                  onSelect={(date) => setValue("horti_planting_date", date?.toISOString() || "")}
                  locale={idLocale}
                  className="rounded-2xl"
                />
              </PopoverContent>
            </Popover>
{getFieldError('horti_planting_date') && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage('horti_planting_date')}</p>
            )}
          </div>

          {/* Tanggal Perkiraan Panen */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2">
              Tanggal Perkiraan Panen*
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-between items-center text-left font-normal px-4 py-6 rounded-xl hover:bg-gray-50 focus:ring-2 focus:border-transparent transition-all",
                    getFieldError('horti_harvest_date') 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-200 focus:ring-green-500'
                  )}
                >
                  {datePerkiraanPanen ? (
                    <span className="text-gray-900">
                      {formatIndonesianLong(new Date(datePerkiraanPanen))}
                    </span>
                  ) : (
                    <span className={getFieldError('horti_harvest_date') ? 'text-red-500' : 'text-gray-400'}>Pilih tanggal panen</span>
                  )}
                  <CalendarIcon className="mr-2 h-5 w-5 text-gray-700" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-2xl border-gray-200" align="start">
                <Calendar
                  mode="single"
                  selected={datePerkiraanPanen ? new Date(datePerkiraanPanen) : undefined}
                  onSelect={(date) => setValue("horti_harvest_date", date?.toISOString() || "")}
                  locale={idLocale}
                  className="rounded-2xl"
                />
              </PopoverContent>
            </Popover>
{getFieldError('horti_harvest_date') && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage('horti_harvest_date')}</p>
            )}
          </div>

          {/* Keterlambatan Tanam/Panen* */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2">
              Keterlambatan Tanam/Panen*
            </Label>
            <Select value={keterlambatanTanamPanen} onValueChange={(value) => setValue("horti_delay_reason", value)}>
              <SelectTrigger className={`w-full h-12 rounded-xl ${
                getFieldError('horti_delay_reason') 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-200 focus:ring-green-500'
              }`}>
                <SelectValue placeholder="Pilih Keterlambatan Tanam/Panen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="terlambat">Terlambat</SelectItem>
                <SelectItem value="lebih-awal">Lebih Awal</SelectItem>
              </SelectContent>
            </Select>
{getFieldError('horti_delay_reason') && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage('horti_delay_reason')}</p>
            )}
          </div>

          {/* Teknologi/Metode */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2">
              Teknologi/Metode*
            </Label>
            <Select value={teknologiMetode} onValueChange={(value) => setValue("horti_technology", value)}>
              <SelectTrigger className={`w-full h-12 rounded-xl ${
                getFieldError('horti_technology') 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-200 focus:ring-green-500'
              }`}>
                <SelectValue placeholder="Pilih Teknologi/Metode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="konvensional">Konvensional</SelectItem>
                <SelectItem value="organik">Organik</SelectItem>
                <SelectItem value="hidroponik">Hidroponik</SelectItem>
              </SelectContent>
            </Select>
            {getFieldError('horti_technology') && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage('horti_technology')}</p>
            )}
          </div>

          {/* Masalah Pascapanen */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2">
              Masalah Pascapanen*
            </Label>
            <Select value={masalahPascapanen} onValueChange={(value) => setValue("post_harvest_problems", value)}>
              <SelectTrigger className={`w-full h-12 rounded-xl ${
                getFieldError('post_harvest_problems') 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-200 focus:ring-green-500'
              }`}>
                <SelectValue placeholder="Pilih Masalah Pascapanen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tidak-ada">Tidak Ada</SelectItem>
                <SelectItem value="kerusakan">Kerusakan Fisik</SelectItem>
                <SelectItem value="penyimpanan">Masalah Penyimpanan</SelectItem>
              </SelectContent>
            </Select>
            {getFieldError('post_harvest_problems') && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage('post_harvest_problems')}</p>
            )}
          </div>

        </div>
          {/* Foto Lokasi */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-4 mt-6">
              Foto Lokasi*
            </Label>
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
            <Label className="text-sm font-semibold text-gray-700 mb-2">
              Ada Serangan Hama/Penyakit?*
            </Label>
            <Select onValueChange={(value) => {
              const hasDisease = value === "ya";
              setValue("has_pest_disease", hasDisease, { shouldValidate: true });

              // Clear related fields when "tidak" is selected
              if (!hasDisease) {
                setValue("pest_disease_type", "");
                setValue("affected_area", 0);
                setValue("pest_control_action", "");
              }
            }} value={pestDiseaseSelectValue}>
              <SelectTrigger className={`w-full h-12 rounded-xl ${
                getFieldError('has_pest_disease') 
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
            <Label className={`text-sm font-semibold mb-2 ${!adaSeranganHama ? 'text-gray-400' : 'text-gray-700'}`}>
              Jenis Hama/Penyakit Dominan*
            </Label>
            <Select
              value={jenisHamaPenyakit}
              onValueChange={(value) => setValue("pest_disease_type", value)}
              disabled={!adaSeranganHama}
            >
              <SelectTrigger className={`w-full h-12 rounded-xl ${
                !adaSeranganHama
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                  : getFieldError('pest_disease_type')
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-200 focus:ring-green-500'
              }`}>
                <SelectValue placeholder="Pilih Jenis Hama/Penyakit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wereng">Wereng</SelectItem>
                <SelectItem value="tikus">Tikus</SelectItem>
                <SelectItem value="blast">Blast</SelectItem>
              </SelectContent>
            </Select>
            {getFieldError('pest_disease_type') && adaSeranganHama && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage('pest_disease_type')}</p>
            )}
          </div>

          {/* Luas Serangan Hama */}
          <div>
            <Label className={`text-sm font-semibold mb-2 ${!adaSeranganHama ? 'text-gray-400' : 'text-gray-700'}`}>
              Luas Terserang Hama*
            </Label>
            <Input
              type="number"
              {...register("affected_area", { valueAsNumber: true })}
              placeholder="Contoh: 10"
              defaultValue={0}
              disabled={!adaSeranganHama}
              className={`h-12 rounded-xl ${
                !adaSeranganHama
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                  : getFieldError('affected_area')
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-200 focus:ring-green-500'
                }`}
            />
            {getFieldError('affected_area') && adaSeranganHama && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage('affected_area')}</p>
            )}
          </div>

          {/* Tindakan Pengendalian Hama */}
          <div>
            <Label className={`text-sm font-semibold mb-2 ${!adaSeranganHama ? 'text-gray-400' : 'text-gray-700'}`}>
              Tindakan Pengendalian Hama*
            </Label>
            <Select
              value={tindakanPengendalianHama}
              onValueChange={(value) => setValue("pest_control_action", value)}
              disabled={!adaSeranganHama}
            >
              <SelectTrigger className={`w-full h-12 rounded-xl ${
                !adaSeranganHama
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                  : getFieldError('pest_control_action')
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-200 focus:ring-green-500'
              }`}>
                <SelectValue placeholder="Pilih Tindakan Pengendalian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kimia">Pestisida Kimia</SelectItem>
                <SelectItem value="organik">Pestisida Organik</SelectItem>
                <SelectItem value="hayati">Pengendalian Hayati</SelectItem>
              </SelectContent>
            </Select>
            {getFieldError('pest_control_action') && adaSeranganHama && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage('pest_control_action')}</p>
            )}
          </div>

          {/* Cuaca 7 Hari Terakhir */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2">
              Cuaca 7 Hari Terakhir*
            </Label>
            <Select value={cuaca7Hari} onValueChange={(value) => setValue("weather_condition", value)}>
              <SelectTrigger className={`w-full h-12 rounded-xl ${
                getFieldError('weather_condition') 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-200 focus:ring-green-500'
              }`}>
                <SelectValue placeholder="Pilih Cuaca" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cerah">Cerah</SelectItem>
                <SelectItem value="berawan">Berawan</SelectItem>
                <SelectItem value="hujan">Hujan</SelectItem>
              </SelectContent>
            </Select>
            {getFieldError('weather_condition') && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage('weather_condition')}</p>
            )}
          </div>

          {/* Dampak Cuaca */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2">
              Dampak Cuaca*
            </Label>
            <Select value={dampakCuaca} onValueChange={(value) => setValue("weather_impact", value)}>
              <SelectTrigger className={`w-full h-12 rounded-xl ${
                getFieldError('weather_impact') 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-200 focus:ring-green-500'
              }`}>
                <SelectValue placeholder="Pilih Dampak Cuaca" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="baik">Baik/Normal</SelectItem>
                <SelectItem value="kekeringan">Kekeringan</SelectItem>
                <SelectItem value="banjir">Banjir/Tergenang</SelectItem>
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
          onClick={() => navigate("/komoditas")}
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
    </div>
  );
}