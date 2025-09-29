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
import { FormWrapper } from "~/context/formProvider";
import { useFormContext } from "react-hook-form";
import type { FullFormType } from "~/global-validation/validation-step-schemas";

export function IndexView() {
  const { register, formState: { errors } } = useFormContext<FullFormType>();
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
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${errors.latitude
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
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${errors.longitude
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
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${errors.namaPenyuluh
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
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${errors.namaPetani
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
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${errors.namaKelompokTani
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
              <SelectTrigger className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:border-transparent transition-all appearance-none bg-white ${errors.desaKecamatan
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