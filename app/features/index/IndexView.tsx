import { useEffect, useState } from "react";
import { z } from "zod";
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
import { useNavigate } from "react-router";

import { indexViewSchema } from "~/features/index/validation/validation";

export function IndexView() {
  const [position, setPosition] = useState<[number, number]>([-7.4034, 111.4464]); // Default: Ngawi
  const [latitude, setLatitude] = useState('-7.4034');
  const [longitude, setLongitude] = useState('111.4464');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [date, setDate] = useState<Date>();
  const [namaPenyuluh, setNamaPenyuluh] = useState('');
  const [namaPetani, setNamaPetani] = useState('');
  const [namaKelompokTani, setNamaKelompokTani] = useState('');
  const [desaKecamatan, setDesaKecamatan] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  // Sync position dengan input values
  useEffect(() => {
    if (position) {
      setLatitude(position[0].toString());
      setLongitude(position[1].toString());
    }
  }, [position]);

  // Handle manual input latitude
  const handleLatitudeChange = (value: string) => {
    setLatitude(value);
    const lat = parseFloat(value);
    if (!isNaN(lat) && !isNaN(parseFloat(longitude))) {
      setPosition([lat, parseFloat(longitude)]);
    }
  };

  // Handle manual input longitude
  const handleLongitudeChange = (value: string) => {
    setLongitude(value);
    const lng = parseFloat(value);
    if (!isNaN(lng) && !isNaN(parseFloat(latitude))) {
      setPosition([parseFloat(latitude), lng]);
    }
  };

  // Aktifkan GPS location
  const aktivasiLokasi = () => {
    setIsLoadingLocation(true);
    
    // Check if geolocation is supported
    if (!("geolocation" in navigator)) {
      alert("Geolocation tidak didukung oleh browser Anda.");
      setIsLoadingLocation(false);
      return;
    }

    // Check if running on localhost (HTTP) vs production (HTTPS)
    const isSecureContext = window.isSecureContext;
    if (!isSecureContext) {
      console.warn("Geolocation might not work properly in non-HTTPS environment");
    }

    // Use more specific options for mobile
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPosition: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setPosition(newPosition);
        setIsLoadingLocation(false);
        console.log(`Location received: ${newPosition[0]}, ${newPosition[1]}`);
      },
      (error) => {
        setIsLoadingLocation(false);
        console.error("Error getting location:", error);
        
        // Provide more specific error messages
        let errorMessage = "Tidak dapat mengakses lokasi. ";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += "Izin lokasi ditolak. Silakan aktifkan izin lokasi di pengaturan browser/device Anda.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Informasi lokasi tidak tersedia.";
            break;
          case error.TIMEOUT:
            errorMessage += "Permintaan lokasi timeout.";
            break;
          default:
            errorMessage += "Pastikan izin lokasi diaktifkan dan coba lagi.";
            break;
        }
        alert(errorMessage);
      },
      {
        enableHighAccuracy: true,  // Use GPS if available for better accuracy
        timeout: 10000,           // 10 seconds timeout
        maximumAge: 60000         // Accept cached position up to 1 minute old
      }
    );
  };

  const formatIndonesianLong = (date: Date) => {
    const bulan = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    return `${date.getDate()} ${bulan[date.getMonth()]} ${date.getFullYear()}`;
  };

  // Validation function
  // Fixed validation function
const validateForm = () => {
  try {
    indexViewSchema.parse({
      latitude,
      longitude,
      namaPenyuluh,
      tanggalKunjungan: date,
      namaPetani,
      namaKelompokTani,
      desaKecamatan
    });
    
    // If validation passes, clear errors
    setErrors({});
    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const newErrors: Record<string, string> = {};
      error.issues.forEach((err) => {
        // Use the field path as key, not the message
        if (err.path && err.path.length > 0) {
          const fieldName = err.path[0] as string;
          newErrors[fieldName] = err.message;
        }
      });
      setErrors(newErrors);
      return false;
    }
    return false;
  }
};
  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      // If validation passes, navigate to next page
      navigate("/komoditas");
    }
  };

  console.log(errors);

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
                Latitude*
              </label>
              <Input
                type="text"
                value={latitude}
                onChange={(e) => handleLatitudeChange(e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                  errors.latitude 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-200 focus:ring-green-500'
                }`}
                placeholder="-7.4034"
              />
              {errors.latitude && (
                <p className="text-red-500 text-sm mt-1">{errors.latitude}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Longitude*
              </label>
              <Input
                type="text"
                value={longitude}
                onChange={(e) => handleLongitudeChange(e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                  errors.longitude 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-200 focus:ring-green-500'
                }`}
                placeholder="111.4464"
              />
              {errors.longitude && (
                <p className="text-red-500 text-sm mt-1">{errors.longitude}</p>
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
              Nama Penyuluh*
            </label>
            <Input
              type="text"
              value={namaPenyuluh}
              onChange={(e) => setNamaPenyuluh(e.target.value)}
              placeholder="Contoh: Penyuluh 012"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                errors.namaPenyuluh 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-200 focus:ring-green-500'
              }`}
            />
            {errors.namaPenyuluh && (
              <p className="text-red-500 text-sm mt-1">{errors.namaPenyuluh}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tanggal Kunjungan*
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal px-4 py-6 rounded-xl hover:bg-gray-50 focus:ring-2 focus:border-transparent transition-all",
                    errors.tanggalKunjungan 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-200 focus:ring-green-500'
                  )}
                >
                  <Icon icon="material-symbols:calendar" className="mr-2 h-5 w-5 text-gray-400" />
                  {date ? (
                    <span className="text-gray-900">
                      {formatIndonesianLong(date)}
                    </span>
                  ) : (
                    <span className={`${errors.tanggalKunjungan ? 'text-red-500' : 'text-gray-400'}`}>Pilih tanggal kunjungan</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-2xl border-gray-200" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}

                  locale={idLocale}
                  className="rounded-2xl"
                />
              </PopoverContent>
            </Popover>
            {errors.tanggalKunjungan && (
              <p className="text-red-500 text-sm mt-1">{errors.tanggalKunjungan}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nama Petani*
            </label>
            <Input
              type="text"
              value={namaPetani}
              onChange={(e) => setNamaPetani(e.target.value)}
              placeholder="Contoh: Samsudin"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                errors.namaPetani 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-200 focus:ring-green-500'
              }`}
            />
            {errors.namaPetani && (
              <p className="text-red-500 text-sm mt-1">{errors.namaPetani}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nama Kelompok Tani*
            </label>
            <Input
              type="text"
              value={namaKelompokTani}
              onChange={(e) => setNamaKelompokTani(e.target.value)}
              placeholder="Contoh: Poktan Kampung Bukit"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                errors.namaKelompokTani 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-200 focus:ring-green-500'
              }`}
            />
            {errors.namaKelompokTani && (
              <p className="text-red-500 text-sm mt-1">{errors.namaKelompokTani}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Desa/Kecamatan*
            </label>
            <Select value={desaKecamatan} onValueChange={setDesaKecamatan}>
              <SelectTrigger className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:border-transparent transition-all appearance-none bg-white ${
                errors.desaKecamatan 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-200 focus:ring-green-500'
              }`}>
                <SelectValue placeholder="Pilih Desa/Kecamatan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desa-a">Desa A</SelectItem>
                <SelectItem value="desa-b">Desa B</SelectItem>
              </SelectContent>
            </Select>
            {errors.desaKecamatan && (
              <p className="text-red-500 text-sm mt-1">{errors.desaKecamatan}</p>
            )}
          </div>
        </div>

        <div className="mt-8 flex w-full justify-end ">
          <Button onClick={handleSubmit} className="bg-green-600 sm:w-fit cursor-pointer w-full hover:bg-green-700 text-white font-semibold py-6 px-10 rounded-xl transition-all duration-200 shadow-lg flex items-center gap-2">
            Selanjutnya
            <Icon icon="material-symbols:chevron-right" className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </main>

  );
}