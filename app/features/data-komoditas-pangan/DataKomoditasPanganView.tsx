import React, { useEffect } from "react";
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

export default function DataKomoditasPanganView() {
  const { register, formState: { errors }, setValue, getValues, watch, trigger } = useFormContext<FullFormType>();
  const navigate = useNavigate();

  // Set komoditas value to "pangan" when component mounts
  React.useEffect(() => {
    setValue("komoditas", "pangan");
  }, [setValue]);

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
  const hasPestDisease = watch("has_pest_disease");
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
    ]);

    if (isValid) {
      navigate("/aspirasi-tani");
    }
  };


  // 1. Debug realtime perubahan field tertentu
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
          {/* Komoditas Pangan */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2">
              Komoditas Pangan yang Ditanam*
            </Label>
            <Select onValueChange={(value) => setValue("food_commodity", value)} value={foodCommodity}>
              <SelectTrigger className={`w-full h-12 rounded-xl ${getFieldError('food_commodity')
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-200 focus:ring-green-500'
                }`}>
                <SelectValue placeholder="Pilih Komoditas Pangan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="padi">Padi</SelectItem>
                <SelectItem value="jagung">Jagung</SelectItem>
                <SelectItem value="kedelai">Kedelai</SelectItem>
              </SelectContent>
            </Select>
            {getFieldError('food_commodity') && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage('food_commodity')}</p>
            )}
          </div>

          {/* Status Lahan */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2">
              Status Lahan*
            </Label>
            <Select onValueChange={(value) => setValue("food_land_status", value)} value={foodLandStatus}>
              <SelectTrigger className={`w-full h-12 rounded-xl ${getFieldError('food_land_status')
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
            {getFieldError('food_land_status') && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage('food_land_status')}</p>
            )}
          </div>

          {/* Luas Lahan */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2">
              Luas Lahan (Ha)*
            </Label>
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
            <Label className="text-sm font-semibold text-gray-700 mb-2">
              Fase Pertumbuhan*
            </Label>
            <Select onValueChange={(value) => setValue("food_growth_phase", value)} value={foodGrowthPhase}>
              <SelectTrigger className={`w-full h-12 rounded-xl ${getFieldError('food_growth_phase')
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
            {getFieldError('food_growth_phase') && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage('food_growth_phase')}</p>
            )}
          </div>

          {/* Umur Tanaman */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2">
              Umur Tanaman (Hari)*
            </Label>
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
            <Label className="text-sm font-semibold text-gray-700 mb-2">
              Teknologi/Metode*
            </Label>
            <Select onValueChange={(value) => setValue("food_technology", value)} value={foodTechnology}>
              <SelectTrigger className={`w-full h-12 rounded-xl ${getFieldError('food_technology')
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
            {getFieldError('food_technology') && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage('food_technology')}</p>
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
                    getFieldError('food_planting_date')
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-200 focus:ring-green-500'
                  )}
                >
                  <CalendarIcon className="mr-2 h-5 w-5 text-gray-700" />
                  {dateTanam ? (
                    <span className="text-gray-900">
                      {formatIndonesianLong(new Date(dateTanam))}
                    </span>
                  ) : (
                    <span className={getFieldError('food_planting_date') ? 'text-red-500' : 'text-gray-400'}>Pilih tanggal kunjungan</span>
                  )}
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
            <Label className="text-sm font-semibold text-gray-700 mb-2">
              Tanggal Perkiraan Panen*
            </Label>
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
                  <CalendarIcon className="mr-2 h-5 w-5 text-gray-700" />
                  {datePerkiraanPanen ? (
                    <span className="text-gray-900">
                      {formatIndonesianLong(new Date(datePerkiraanPanen))}
                    </span>
                  ) : (
                    <span className={getFieldError('food_harvest_date') ? 'text-red-500' : 'text-gray-400'}>Pilih tanggal kunjungan</span>
                  )}
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

          {/* Keterangan Tanam/Panen */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2">
              Keterangan Tanam/Panen*
            </Label>
            <Select onValueChange={(value) => setValue("food_delay_reason", value)} value={foodDelayReason}>
              <SelectTrigger className={`w-full h-12 rounded-xl ${getFieldError('food_delay_reason')
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-200 focus:ring-green-500'
                }`}>
                <SelectValue placeholder="Pilih Keterangan Tanam/Panen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="terlambat">Terlambat</SelectItem>
                <SelectItem value="lebih-awal">Lebih Awal</SelectItem>
              </SelectContent>
            </Select>
            {getFieldError('food_delay_reason') && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage('food_delay_reason')}</p>
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
            <Select onValueChange={(value) => setValue("has_pest_disease", value === "ya")} value={hasPestDisease ? "ya" : "tidak"}>
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
            <Label className="text-sm font-semibold text-gray-700 mb-2">
              Jenis Hama/Penyakit Dominan*
            </Label>
            <Select onValueChange={(value) => setValue("pest_disease_type", value)} value={pestDiseaseType}>
              <SelectTrigger className={`w-full h-12 rounded-xl ${getFieldError('pest_disease_type')
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
            {getFieldError('pest_disease_type') && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage('pest_disease_type')}</p>
            )}
          </div>

          {/* Luas Serangan Hama */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2">
              Luas Terserang Hama*
            </Label>
            <Input
              type="number"
              {...register("affected_area", { valueAsNumber: true })}
              placeholder="Contoh: 10"
              className={`h-12 rounded-xl ${getFieldError('affected_area')
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-200 focus:ring-green-500'
                }`}
            />
            {getFieldError('affected_area') && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage('affected_area')}</p>
            )}
          </div>

          {/* Tindakan Pengendalian Hama */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2">
              Tindakan Pengendalian Hama*
            </Label>
            <Select onValueChange={(value) => setValue("pest_control_action", value)} value={pestControlAction}>
              <SelectTrigger className={`w-full h-12 rounded-xl ${getFieldError('pest_control_action')
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
            {getFieldError('pest_control_action') && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage('pest_control_action')}</p>
            )}
          </div>

          {/* Cuaca 7 Hari Terakhir */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2">
              Cuaca 7 Hari Terakhir*
            </Label>
            <Select onValueChange={(value) => setValue("weather_condition", value)} value={weatherCondition}>
              <SelectTrigger className={`w-full h-12 rounded-xl ${getFieldError('weather_condition')
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
            <Select onValueChange={(value) => setValue("weather_impact", value)} value={weatherImpact}>
              <SelectTrigger className={`w-full h-12 rounded-xl ${getFieldError('weather_impact')
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