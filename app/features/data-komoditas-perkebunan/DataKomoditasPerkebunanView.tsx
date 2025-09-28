import { CalendarIcon } from "lucide-react";
import { useState } from "react";
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

export default function DataKomoditasPerkebunanView() {
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

  // State untuk upload foto
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Data Komoditas Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Data Komoditas</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Komoditas Perkebunan yang Ditanam */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2">
              Komoditas Perkebunan yang Ditanam*
            </Label>
            <Select>
              <SelectTrigger className="w-full h-12 rounded-xl border-gray-200">
                <SelectValue placeholder="Pilih Komoditas Perkebunan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kelapa-sawit">Kelapa Sawit</SelectItem>
                <SelectItem value="karet">Karet</SelectItem>
                <SelectItem value="kopi">Kopi</SelectItem>
                <SelectItem value="tebu">Tebu</SelectItem>
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

          {/* Luas Lahan (Ha) */}
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

          {/* Umur Tanaman (Hari) */}
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
                <SelectItem value="intensif">Intensif</SelectItem>
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
                    <span className="text-gray-400">DD/MM/YYYY</span>
                  )}
                  <CalendarIcon className="ml-2 h-5 w-5 text-gray-700" />
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
                    <span className="text-gray-400">DD/MM/YYYY</span>
                  )}
                  <CalendarIcon className="ml-2 h-5 w-5 text-gray-700" />
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

          {/* Keterlambatan Tanam/Panen */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2">
              Keterlambatan Tanam/Panen*
            </Label>
            <Select>
              <SelectTrigger className="w-full h-12 rounded-xl border-gray-200">
                <SelectValue placeholder="Pilih Keterlambatan Tanam/Panen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="terlambat">Terlambat</SelectItem>
                <SelectItem value="lebih-awal">Lebih Awal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Foto Lokasi + Unggah Button */}


          {/* Masalah Produksi */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2">
              Masalah Produksi*
            </Label>
            <Select>
              <SelectTrigger className="w-full h-12 rounded-xl border-gray-200">
                <SelectValue placeholder="Pilih Masalah Produksi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tidak-ada">Tidak Ada</SelectItem>
                <SelectItem value="rendah">Hasil Rendah</SelectItem>
                <SelectItem value="kualitas">Kualitas Buruk</SelectItem>
                <SelectItem value="pasar">Masalah Pasar</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label className="text-sm font-semibold text-gray-700 mb-4 mt-6">
            Foto Lokasi*
          </Label>
          <ImageUpload />
        </div>
      </div>

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