import { useEffect, useState } from "react";
import Maps from "./components/Maps";
import { Icon } from "@iconify/react";
import Banner from "./components/Banner";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";

export function Index() {
  const [currentStep, setCurrentStep] = useState(1);
  const [position, setPosition] = useState<[number, number]>([-7.4034, 111.4464]); // Default: Ngawi
  const [latitude, setLatitude] = useState('-7.4034');
  const [longitude, setLongitude] = useState('111.4464');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const steps = [
    { number: 1, title: 'Data Penyuluh', desc: 'Masukan identitas penyuluh dan petani' },
    { number: 2, title: 'Komoditas', desc: 'Pilih jenis komoditas yang ditanam' },
    { number: 3, title: 'Data Komoditas', desc: 'Lengkapi informasi detail terkait komoditas' },
    { number: 4, title: 'Aspirasi Petani', desc: 'Bagikan aspirasi dan masukan dari petani' }
  ];

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
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPosition: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setPosition(newPosition);
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Tidak dapat mengakses lokasi. Pastikan izin lokasi diaktifkan.");
          setIsLoadingLocation(false);
        }
      );
    } else {
      alert("Geolocation tidak didukung oleh browser Anda.");
      setIsLoadingLocation(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F3F5]">


      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-[300px,1fr] gap-6">

          <main className="space-y-6">
            <Banner />

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
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="-7.4034"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Longitude*
                    </label>
                    <Input
                      type="text"
                      value={longitude}
                      onChange={(e) => handleLongitudeChange(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="111.4464"
                    />
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
                    placeholder="Contoh: Penyuluh 012"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tanggal Kunjungan*
                  </label>
                  <div className="relative">
                    <Input
                      type="date"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                    <Icon icon="material-symbols:calendar" className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Petani*
                  </label>
                  <Input
                    type="text"
                    placeholder="Contoh: Samsudin"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Kelompok Tani*
                  </label>
                  <Input
                    type="text"
                    placeholder="Contoh: Poktan Kampung Bukit"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Desa/Kecamatan*
                  </label>
                  <Select>
                    <SelectTrigger className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none bg-white">
                      <SelectValue placeholder="Pilih Desa/Kecamatan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desa-a">Desa A</SelectItem>
                      <SelectItem value="desa-b">Desa B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-8 flex w-full justify-end ">
                <Button className="bg-green-600 sm:w-fit cursor-pointer w-full hover:bg-green-700 text-white font-semibold py-6 px-10 rounded-xl transition-all duration-200 shadow-lg flex items-center gap-2">
                  Selanjutnya
                  <Icon icon="material-symbols:chevron-right" className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}