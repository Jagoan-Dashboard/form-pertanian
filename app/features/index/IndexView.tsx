import { useEffect, useState } from "react";
import Maps from "./components/Maps";
import { Icon } from "@iconify/react";
import Banner from "./components/Banner";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import { id as idLocale } from "date-fns/locale/id";
import { Calendar } from "~/components/ui/calendar";
import { useFormContext } from "react-hook-form";
import { format } from "date-fns";
import type { FullFormType } from "~/global-validation/validation-step-schemas";
import { useNavigate } from "react-router";
import { CalendarIcon } from "lucide-react";
import { DesaKecamatan } from "~/const/wilayah";

export function IndexView() {
  const { register, formState: { errors }, setValue, getValues, watch, trigger } = useFormContext<FullFormType>();
  const navigate = useNavigate();

  // Watch field values to use them in the UI
  const latitude = watch('lat', '');
  const longitude = watch('long', '');
  const tanggalKunjungan = watch('visit_date');
  const village = watch('village', '');

  // Handle date selection
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setValue('visit_date', date.toISOString(), { shouldValidate: true });
    }
  };

  // Handle location activation using GPS
  const aktivasiLokasi = () => {
    if (!navigator.geolocation) {
      alert('Geolokasi tidak didukung oleh browser ini');
      return;
    }

    setIsLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // Update form values
        setValue('lat', lat.toString(), { shouldValidate: true });
        setValue('long', lng.toString(), { shouldValidate: true });

        // Update map position
        setPosition([lat, lng]);

        setIsLoadingLocation(false);
        console.log(`Lokasi ditemukan: ${lat}, ${lng}`);
      },
      (error) => {
        setIsLoadingLocation(false);
        let errorMessage = 'Tidak dapat mengambil lokasi';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Akses lokasi ditolak. Silakan izinkan akses lokasi di browser Anda.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Informasi lokasi tidak tersedia.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Permintaan lokasi timeout.';
            break;
        }

        alert(errorMessage);
        console.error('Error getting location:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Format date for display (in Indonesian format)
  const formatIndonesianLong = (date: Date) => {
    return format(date, 'dd MMMM yyyy', { locale: idLocale });
  };
  // Position state for maps - derive from form values
  const [position, setPosition] = useState<[number, number]>([-7.4034, 111.4464]);

  // Update position when latitude/longitude values change in the form
  useEffect(() => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (!isNaN(lat) && !isNaN(lng)) {
      setPosition([lat, lng]);
    }
  }, [latitude, longitude]);



  // 1. Debug realtime perubahan field tertentu
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      console.log("📌 Field berubah:", name, "Type:", type, "Value:", value);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // 2. Debug semua data saat tombol Next ditekan
  const handleNext = async () => {
    const isValid = await trigger([
      "lat",
      "long",
      "extension_officer",
      "visit_date",
      "farmer_name",
      "farmer_group",
      "village",
    ]);

    console.log("📝 Data sekarang:", getValues()); // log semua field

    if (isValid) {
      console.log("✅ Data valid:", getValues());
      navigate("/komoditas");
    } else {
      console.log("❌ Data tidak valid:", getValues());
    }
  };
  return (
    <main className="space-y-6">

      <div className="hidden sm:block">
        <Banner />
      </div>
      {/* Koordinat Lokasi */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Icon icon="material-symbols:map" className="w-6 h-6 text-green-600" />
            <span className="text-lg">
              Koordinat Lokasi
            </span>
          </h3>
          <span className="text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full inline-block sm:inline">
            Klik peta untuk menandai lokasi
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Maps Component */}
          <Maps
            position={position}
            setPosition={setPosition}
            height="h-64"
            zoom={13}
          />

          {/* Coordinate Inputs */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Latitude<span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="-7.4034"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${errors.lat
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-green-500"
                  }`}
                {...register("lat")}
              />
              {errors.lat && (
                <p className="text-red-500 text-sm mt-1">{errors.lat?.message?.toString()}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Longitude<span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="111.4464"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${errors.long
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-green-500"
                  }`}
                {...register('long')}
              />
              {errors.long && (
                <p className="text-red-500 text-sm mt-1">{errors.long?.message?.toString()}</p>
              )}
            </div>

            <Button
              onClick={aktivasiLokasi}
              disabled={isLoadingLocation}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg  flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingLocation ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Mengambil Lokasi...
                </>
              ) : (
                <>
                  <Icon icon="material-symbols:navigation" className="w-5 h-5" />
                  Aktifkan Lokasi
                </>
              )}
            </Button>
            <p className="text-xs text-gray-500 text-center">
              Atau klik pada peta untuk menentukan lokasi
            </p>
          </div>
        </div>
      </div>

      {/* Data Penyuluh */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Icon icon="material-symbols:user" className="w-6 h-6 text-green-600" />
          Data Penyuluh
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nama Penyuluh<span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="Contoh: Penyuluh"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${errors.extension_officer
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-200 focus:ring-green-500"
                }`}
              {...register('extension_officer')}
            />
            {errors.extension_officer && (
              <p className="text-red-500 text-sm mt-1">{errors.extension_officer?.message?.toString()}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tanggal Kunjungan<span className="text-red-500">*</span>
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-between text-left font-normal px-4 py-6 rounded-xl hover:bg-gray-50 focus:ring-2 focus:border-transparent transition-all",
                    errors.visit_date
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-200 focus:ring-green-500'
                  )}
                >
                  {tanggalKunjungan ? (
                    <span className="text-gray-900">
                      {formatIndonesianLong(new Date(tanggalKunjungan))}
                    </span>
                  ) : (
                    <span className={`${errors.visit_date ? 'text-red-500' : 'text-gray-400'}`}>Pilih tanggal kunjungan</span>
                  )}
                  <CalendarIcon className="mr-2 h-5 w-5 text-gray-400" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-2xl border-gray-200" align="start">
                <Calendar
                  mode="single"
                  selected={tanggalKunjungan ? new Date(tanggalKunjungan) : undefined}
                  onSelect={handleDateChange}
                  locale={idLocale}
                  className="rounded-2xl"
                />
              </PopoverContent>
            </Popover>
            {errors.visit_date && (
              <p className="text-red-500 text-sm mt-1">{errors.visit_date?.message?.toString()}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nama Petani<span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="Contoh: Samsudin"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${errors.farmer_name
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-200 focus:ring-green-500"
                }`}
              {...register("farmer_name")}
            />
            {errors.farmer_name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.farmer_name?.message?.toString()}
              </p>
            )}

          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nama Kelompok Tani<span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="Contoh: Poktan Kampung Bukit"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${errors.farmer_group
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-200 focus:ring-green-500"
                }`}
              {...register('farmer_group')}
            />
            {errors.farmer_group && (
              <p className="text-red-500 text-sm mt-1">{errors.farmer_group?.message?.toString()}</p>
            )}
          </div>

        </div>
        <div>
          <label className="block mt-5 text-sm font-semibold text-gray-700 mb-2">
            Desa/Kecamatan<span className="text-red-500">*</span>
          </label>
          <Select
            value={village}
            onValueChange={(value) => {
              setValue('village', value, { shouldValidate: true });
              setValue('district', value, { shouldValidate: true });
            }}
          >
            <SelectTrigger className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:border-transparent transition-all appearance-none bg-white ${errors.village ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-green-500'
              }`}>
              <SelectValue placeholder="Pilih Desa/Kecamatan" />
            </SelectTrigger>
            <SelectContent>
              {DesaKecamatan.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.village && (
            <p className="text-red-500 text-sm mt-1">{errors.village?.message?.toString()}</p>
          )}
        </div>

        <div className="mt-8 flex w-full justify-end ">
          <Button
            type="button" // ⚡ penting: jangan submit default
            onClick={handleNext}
            className="bg-green-600 sm:w-fit cursor-pointer w-full hover:bg-green-700 text-white font-semibold py-6 px-10 rounded-xl transition-all duration-200 shadow-lg flex items-center gap-2"
          >
            Selanjutnya
            <Icon icon="material-symbols:chevron-right" className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </main>

  );
}