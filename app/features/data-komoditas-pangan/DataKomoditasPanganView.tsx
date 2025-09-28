import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Icon } from "@iconify/react";
import { useStepStore } from "~/store/stepStore";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import { id as idLocale } from "date-fns/locale/id";
import { Calendar } from "~/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { ImageUpload } from "~/components/ImageUplaod";


export default function DataKomoditasPanganView() {
  const [dateTanam, setDateTanam] = useState<Date>();
  const [datePerkiraanPanen, setDatePerkiraanPanen] = useState<Date>();
  const navigate = useNavigate();

  const formatIndonesianLong = (date: Date) => {
    const bulan = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    return `${date.getDate()} ${bulan[date.getMonth()]} ${date.getFullYear()}`;
  };

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
            <Select>
              <SelectTrigger className="w-full h-12 rounded-xl border-gray-200">
                <SelectValue placeholder="Pilih Komoditas Pangan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="padi">Padi</SelectItem>
                <SelectItem value="jagung">Jagung</SelectItem>
                <SelectItem value="kedelai">Kedelai</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Lahan */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2">
              Status Lahan*
            </Label>
            <Select>
              <SelectTrigger className="w-full h-12 rounded-xl border-gray-200">
                <SelectValue placeholder="Pilih Status Lahan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="milik">Milik Sendiri</SelectItem>
                <SelectItem value="sewa">Sewa</SelectItem>
                <SelectItem value="bagi-hasil">Bagi Hasil</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Luas Lahan */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2">
              Luas Lahan (Ha)*
            </Label>
            <Input
              type="number"
              placeholder="Contoh: 10"
              className="h-12 rounded-xl border-gray-200"
            />
          </div>

          {/* Fase Pertumbuhan */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2">
              Fase Pertumbuhan*
            </Label>
            <Select>
              <SelectTrigger className="w-full h-12 rounded-xl border-gray-200">
                <SelectValue placeholder="Pilih Fase Pertumbuhan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vegetatif">Vegetatif</SelectItem>
                <SelectItem value="generatif">Generatif</SelectItem>
                <SelectItem value="panen">Panen</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Umur Tanaman */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2">
              Umur Tanaman (Hari)*
            </Label>
            <Input
              type="number"
              placeholder="Contoh: 15"
              className="h-12 rounded-xl border-gray-200"
            />
          </div>

          {/* Teknologi/Metode */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2">
              Teknologi/Metode*
            </Label>
            <Select>
              <SelectTrigger className="w-full h-12 rounded-xl border-gray-200">
                <SelectValue placeholder="Pilih Teknologi/Metode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="konvensional">Konvensional</SelectItem>
                <SelectItem value="organik">Organik</SelectItem>
                <SelectItem value="hidroponik">Hidroponik</SelectItem>
              </SelectContent>
            </Select>
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
                    "w-full justify-between text-left items-center font-normal px-4 py-6 border-gray-200 rounded-xl hover:bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all",
                    !dateTanam && "text-gray-500"
                  )}
                >
                  {dateTanam ? (
                    <span className="text-gray-900">
                      {formatIndonesianLong(dateTanam)}
                    </span>
                  ) : (
                    <span className="text-gray-400">Pilih tanggal kunjungan</span>
                  )}
                  <CalendarIcon className="mr-2 h-5 w-5 text-gray-700" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-2xl border-gray-200" align="start">
                <Calendar
                  mode="single"
                  selected={dateTanam}
                  onSelect={setDateTanam}

                  locale={idLocale}
                  className="rounded-2xl"
                />
              </PopoverContent>
            </Popover>
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
                    "w-full justify-between items-center text-left font-normal px-4 py-6 border-gray-200 rounded-xl hover:bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all",
                    !datePerkiraanPanen && "text-gray-500"
                  )}
                >
                  {datePerkiraanPanen ? (
                    <span className="text-gray-900">
                      {formatIndonesianLong(datePerkiraanPanen)}
                    </span>
                  ) : (
                    <span className="text-gray-400">Pilih tanggal kunjungan</span>
                  )}
                  <CalendarIcon className="mr-2 h-5 w-5 text-gray-700" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-2xl border-gray-200" align="start">
                <Calendar
                  mode="single"
                  selected={datePerkiraanPanen}
                  onSelect={setDatePerkiraanPanen}

                  locale={idLocale}
                  className="rounded-2xl"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Keterangan Tanam/Panen */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2">
              Keterangan Tanam/Panen*
            </Label>
            <Select>
              <SelectTrigger className="w-full h-12 rounded-xl border-gray-200">
                <SelectValue placeholder="Pilih Keterangan Tanam/Panen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="terlambat">Terlambat</SelectItem>
                <SelectItem value="lebih-awal">Lebih Awal</SelectItem>
              </SelectContent>
            </Select>
          </div>


        </div>
        {/* Foto Lokasi */}
        <div>
          <Label className="text-sm font-semibold text-gray-700 mb-4 mt-6">
            Foto Lokasi*
          </Label>
          <ImageUpload />
        </div>

        {/* Upload Button - Mobile */}
        <div className="mt-6 md:hidden">
          <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-6 rounded-xl">
            <Icon icon="mdi:upload" className="w-5 h-5 mr-2" />
            Unggah
          </Button>
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
            <Select>
              <SelectTrigger className="w-full h-12 rounded-xl border-gray-200">
                <SelectValue placeholder="Pilih Serangan Hama/Penyakit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ya">Ya</SelectItem>
                <SelectItem value="tidak">Tidak</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Jenis Hama/Penyakit */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2">
              Jenis Hama/Penyakit Dominan*
            </Label>
            <Select>
              <SelectTrigger className="w-full h-12 rounded-xl border-gray-200">
                <SelectValue placeholder="Pilih Jenis Hama/Penyakit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wereng">Wereng</SelectItem>
                <SelectItem value="tikus">Tikus</SelectItem>
                <SelectItem value="blast">Blast</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Luas Serangan Hama */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2">
              Luas Terserang Hama*
            </Label>
            <Select>
              <SelectTrigger className="w-full h-12 rounded-xl border-gray-200">
                <SelectValue placeholder="Pilih Tingkat Luas Terserang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ringan">Ringan (0-25%)</SelectItem>
                <SelectItem value="sedang">Sedang (26-50%)</SelectItem>
                <SelectItem value="berat">Berat (50%)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tindakan Pengendalian Hama */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2">
              Tindakan Pengendalian Hama*
            </Label>
            <Select>
              <SelectTrigger className="w-full h-12 rounded-xl border-gray-200">
                <SelectValue placeholder="Pilih Tindakan Pengendalian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kimia">Pestisida Kimia</SelectItem>
                <SelectItem value="organik">Pestisida Organik</SelectItem>
                <SelectItem value="hayati">Pengendalian Hayati</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Cuaca 7 Hari Terakhir */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2">
              Cuaca 7 Hari Terakhir*
            </Label>
            <Select>
              <SelectTrigger className="w-full h-12 rounded-xl border-gray-200">
                <SelectValue placeholder="Pilih Cuaca" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cerah">Cerah</SelectItem>
                <SelectItem value="berawan">Berawan</SelectItem>
                <SelectItem value="hujan">Hujan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dampak Cuaca */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2">
              Dampak Cuaca*
            </Label>
            <Select>
              <SelectTrigger className="w-full h-12 rounded-xl border-gray-200">
                <SelectValue placeholder="Pilih Dampak Cuaca" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="baik">Baik/Normal</SelectItem>
                <SelectItem value="kekeringan">Kekeringan</SelectItem>
                <SelectItem value="banjir">Banjir/Tergenang</SelectItem>
              </SelectContent>
            </Select>
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
          onClick={() => navigate("/aspirasi-tani")}
          className="sm:w-auto w-full bg-green-600 cursor-pointer hover:bg-green-700 text-white font-semibold py-6 px-10 rounded-xl transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
        >
          Selanjutnya
          <Icon icon="material-symbols:chevron-right" className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}