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
import { dataKomoditasHortikulturaSchema } from "./validation/validation";
import { z } from "zod";

export default function DataKomoditasHortikulturaView() {
  const [dateTanam, setDateTanam] = useState<Date>();
  const [datePerkiraanPanen, setDatePerkiraanPanen] = useState<Date>();
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [jenisHortikultura, setJenisHortikultura] = useState<string>("");
  const [komoditasHortikultura, setKomoditasHortikultura] = useState<string>("");
  const [statusLahan, setStatusLahan] = useState<string>("");
  const [luasLahan, setLuasLahan] = useState<string>("");
  const [fasePertumbuhan, setFasePertumbuhan] = useState<string>("");
  const [umurTanaman, setUmurTanaman] = useState<string>("");
  const [keterlambatanTanamPanen, setKeterlambatanTanamPanen] = useState<string>("");
  const [teknologiMetode, setTeknologiMetode] = useState<string>("");
  const [masalahPascapanen, setMasalahPascapanen] = useState<string>("");
  const [adaSeranganHama, setAdaSeranganHama] = useState<string>("");
  const [jenisHamaPenyakit, setJenisHamaPenyakit] = useState<string>("");
  const [luasSeranganHama, setLuasSeranganHama] = useState<string>("");
  const [tindakanPengendalianHama, setTindakanPengendalianHama] = useState<string>("");
  const [cuaca7Hari, setCuaca7Hari] = useState<string>("");
  const [dampakCuaca, setDampakCuaca] = useState<string>("");

  const formatIndonesianLong = (date: Date) => {
    const bulan = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    return `${date.getDate()} ${bulan[date.getMonth()]} ${date.getFullYear()}`;
  };

  // State untuk file upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Validation function
const validateForm = () => {
  try {
    dataKomoditasHortikulturaSchema.parse({
      jenisHortikultura,
      komoditasHortikultura,
      statusLahan,
      luasLahan,
      fasePertumbuhan,
      umurTanaman,
      tanggalTanam: dateTanam,
      tanggalPerkiraanPanen: datePerkiraanPanen,
      keterlambatanTanamPanen,
      teknologiMetode,
      masalahPascapanen,
      fotoLokasi: selectedFile,
      adaSeranganHama,
      jenisHamaPenyakit,
      luasSeranganHama,
      tindakanPengendalianHama,
      cuaca7Hari,
      dampakCuaca
    });
    
    setErrors({});
    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const newErrors: Record<string, string> = {};
      error.issues.forEach((err) => {
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
              setJenisHortikultura(value);
              // When jenis hortikultura changes, clear komoditas hortikultura
              setKomoditasHortikultura("");
            }}>
              <SelectTrigger className={`w-full h-12 rounded-xl ${
                errors.jenisHortikultura 
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
            {errors.jenisHortikultura && (
              <p className="text-red-500 text-sm mt-1">{errors.jenisHortikultura}</p>
            )}
          </div>

          {/* Komoditas Hortikultura yang Ditanam */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2">
              Komoditas Hortikultura yang Ditanam*
            </Label>
            <Select value={komoditasHortikultura} onValueChange={setKomoditasHortikultura}>
              <SelectTrigger className={`w-full h-12 rounded-xl ${
                errors.komoditasHortikultura 
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
            {errors.komoditasHortikultura && (
              <p className="text-red-500 text-sm mt-1">{errors.komoditasHortikultura}</p>
            )}
          </div>

          {/* Status Lahan */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2">
              Status Lahan*
            </Label>
            <Select value={statusLahan} onValueChange={setStatusLahan}>
              <SelectTrigger className={`w-full h-12 rounded-xl ${
                errors.statusLahan 
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
            {errors.statusLahan && (
              <p className="text-red-500 text-sm mt-1">{errors.statusLahan}</p>
            )}
          </div>

          {/* Luas Lahan (Ha) */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2">
              Luas Lahan (Ha)*
            </Label>
            <Input
              type="number"
              value={luasLahan}
              onChange={(e) => setLuasLahan(e.target.value)}
              placeholder="Contoh: 10"
              className={`h-12 rounded-xl ${
                errors.luasLahan 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-200 focus:ring-green-500'
              }`}
            />
            {errors.luasLahan && (
              <p className="text-red-500 text-sm mt-1">{errors.luasLahan}</p>
            )}
          </div>

          {/* Fase Pertumbuhan */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2">
              Fase Pertumbuhan*
            </Label>
            <Select value={fasePertumbuhan} onValueChange={setFasePertumbuhan}>
              <SelectTrigger className={`w-full h-12 rounded-xl ${
                errors.fasePertumbuhan 
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
            {errors.fasePertumbuhan && (
              <p className="text-red-500 text-sm mt-1">{errors.fasePertumbuhan}</p>
            )}
          </div>

          {/* Umur Tanaman (Hari) */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2">
              Umur Tanaman (Hari)*
            </Label>
            <Input
              type="number"
              value={umurTanaman}
              onChange={(e) => setUmurTanaman(e.target.value)}
              placeholder="Contoh: 15"
              className={`h-12 rounded-xl ${
                errors.umurTanaman 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-200 focus:ring-green-500'
              }`}
            />
            {errors.umurTanaman && (
              <p className="text-red-500 text-sm mt-1">{errors.umurTanaman}</p>
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
                    errors.tanggalTanam 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-200 focus:ring-green-500'
                  )}
                >
                  <CalendarIcon className="mr-2 h-5 w-5 text-gray-700" />
                  {dateTanam ? (
                    <span className="text-gray-900">
                      {formatIndonesianLong(dateTanam)}
                    </span>
                  ) : (
                    <span className={errors.tanggalTanam ? 'text-red-500' : 'text-gray-400'}>DD/MM/YYYY</span>
                  )}
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
            {errors.tanggalTanam && (
              <p className="text-red-500 text-sm mt-1">{errors.tanggalTanam}</p>
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
                    errors.tanggalPerkiraanPanen 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-200 focus:ring-green-500'
                  )}
                >
                  <CalendarIcon className="mr-2 h-5 w-5 text-gray-700" />
                  {datePerkiraanPanen ? (
                    <span className="text-gray-900">
                      {formatIndonesianLong(datePerkiraanPanen)}
                    </span>
                  ) : (
                    <span className={errors.tanggalPerkiraanPanen ? 'text-red-500' : 'text-gray-400'}>DD/MM/YYYY</span>
                  )}
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
            {errors.tanggalPerkiraanPanen && (
              <p className="text-red-500 text-sm mt-1">{errors.tanggalPerkiraanPanen}</p>
            )}
          </div>

          {/* Keterlambatan Tanam/Panen* */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2">
              Keterlambatan Tanam/Panen*
            </Label>
            <Select value={keterlambatanTanamPanen} onValueChange={setKeterlambatanTanamPanen}>
              <SelectTrigger className={`w-full h-12 rounded-xl ${
                errors.keterlambatanTanamPanen 
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
            {errors.keteranganTanamPanen && (
              <p className="text-red-500 text-sm mt-1">{errors.keteranganTanamPanen}</p>
            )}
          </div>

          {/* Teknologi/Metode */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2">
              Teknologi/Metode*
            </Label>
            <Select value={teknologiMetode} onValueChange={setTeknologiMetode}>
              <SelectTrigger className={`w-full h-12 rounded-xl ${
                errors.teknologiMetode 
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
            {errors.teknologiMetode && (
              <p className="text-red-500 text-sm mt-1">{errors.teknologiMetode}</p>
            )}
          </div>

          {/* Masalah Pascapanen */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2">
              Masalah Pascapanen*
            </Label>
            <Select value={masalahPascapanen} onValueChange={setMasalahPascapanen}>
              <SelectTrigger className={`w-full h-12 rounded-xl ${
                errors.masalahPascapanen 
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
            {errors.masalahPascapanen && (
              <p className="text-red-500 text-sm mt-1">{errors.masalahPascapanen}</p>
            )}
          </div>

        </div>
          {/* Foto Lokasi */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-4 mt-6">
              Foto Lokasi*
            </Label>
            <ImageUpload 
              onFileChange={setSelectedFile}
              initialFile={selectedFile}
              error={errors.fotoLokasi}
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
            <Select value={adaSeranganHama} onValueChange={setAdaSeranganHama}>
              <SelectTrigger className={`w-full h-12 rounded-xl ${
                errors.adaSeranganHama 
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
            {errors.adaSeranganHama && (
              <p className="text-red-500 text-sm mt-1">{errors.adaSeranganHama}</p>
            )}
          </div>

          {/* Jenis Hama/Penyakit */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2">
              Jenis Hama/Penyakit Dominan*
            </Label>
            <Select value={jenisHamaPenyakit} onValueChange={setJenisHamaPenyakit}>
              <SelectTrigger className={`w-full h-12 rounded-xl ${
                errors.jenisHamaPenyakit 
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
            {errors.jenisHamaPenyakit && (
              <p className="text-red-500 text-sm mt-1">{errors.jenisHamaPenyakit}</p>
            )}
          </div>

          {/* Luas Serangan Hama */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2">
              Luas Terserang Hama*
            </Label>
            <Select value={luasSeranganHama} onValueChange={setLuasSeranganHama}>
              <SelectTrigger className={`w-full h-12 rounded-xl ${
                errors.luasSeranganHama 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-200 focus:ring-green-500'
              }`}>
                <SelectValue placeholder="Pilih Tingkat Luas Terserang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ringan">Ringan (0-25%)</SelectItem>
                <SelectItem value="sedang">Sedang (26-50%)</SelectItem>
                <SelectItem value="berat">Berat (50%)</SelectItem>
              </SelectContent>
            </Select>
            {errors.luasSeranganHama && (
              <p className="text-red-500 text-sm mt-1">{errors.luasSeranganHama}</p>
            )}
          </div>

          {/* Tindakan Pengendalian Hama */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2">
              Tindakan Pengendalian Hama*
            </Label>
            <Select value={tindakanPengendalianHama} onValueChange={setTindakanPengendalianHama}>
              <SelectTrigger className={`w-full h-12 rounded-xl ${
                errors.tindakanPengendalianHama 
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
            {errors.tindakanPengendalianHama && (
              <p className="text-red-500 text-sm mt-1">{errors.tindakanPengendalianHama}</p>
            )}
          </div>

          {/* Cuaca 7 Hari Terakhir */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2">
              Cuaca 7 Hari Terakhir*
            </Label>
            <Select value={cuaca7Hari} onValueChange={setCuaca7Hari}>
              <SelectTrigger className={`w-full h-12 rounded-xl ${
                errors.cuaca7Hari 
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
            {errors.cuaca7Hari && (
              <p className="text-red-500 text-sm mt-1">{errors.cuaca7Hari}</p>
            )}
          </div>

          {/* Dampak Cuaca */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2">
              Dampak Cuaca*
            </Label>
            <Select value={dampakCuaca} onValueChange={setDampakCuaca}>
              <SelectTrigger className={`w-full h-12 rounded-xl ${
                errors.dampakCuaca 
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
            {errors.dampakCuaca && (
              <p className="text-red-500 text-sm mt-1">{errors.dampakCuaca}</p>
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
          onClick={() => {
            if (validateForm()) {
              // If validation passes, navigate to next page
              navigate("/aspirasi-tani");
            }
          }}
          className="sm:w-auto w-full bg-green-600 cursor-pointer hover:bg-green-700 text-white font-semibold py-6 px-10 rounded-xl transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
        >
          Selanjutnya
          <Icon icon="material-symbols:chevron-right" className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}