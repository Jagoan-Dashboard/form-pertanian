import { useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { useNavigate } from "react-router";
import { SuccessAlert } from "~/components/SuccesAlert";
import { aspirasiTaniSchema, checkFieldConsistency, getCharacterCount, type AspirasiTaniFormData } from "./validation/validation";
import { z } from "zod";

export default function AspirasiTaniView() {

  const navigate = useNavigate();
  const [formData, setFormData] = useState<AspirasiTaniFormData>({
    kendalaUtama: '',
    harapan: '',
    pelatihanDibutuhkan: '',
    kebutuhanMendesak: '',
    aksesAir: '',
    harapanMasaDepan: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showAlert, setShowAlert] = useState(false);

  // Function to validate the form
  const validateForm = () => {
    try {
      aspirasiTaniSchema.parse(formData);
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
        console.log('Validation errors:', newErrors);
        return false;
      }
      return false;
    }
  };


  const handleSubmit = () => {
    if (validateForm()) {
      console.log("Form submitted:", formData);
      // Handle submit logic here
      setShowAlert(true);
    } else {
      console.log("Validation failed:", errors);
    }
  };

  // Function to clear specific error when field is updated
  const clearError = (fieldName: string) => {
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  return (
    <>
      <SuccessAlert
        open={showAlert}
        onClose={() => setShowAlert(false)}
        title="Data Tersimpan!"
        description="Data komoditas berhasil disimpan"
      />
      <div className="space-y-6">
        {/* Aspirasi dan Kebutuhan Petani Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Aspirasi dan Kebutuhan Petani
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Kendala Utama */}
            <div>
              <Label className="text-sm font-semibold text-gray-700 mb-2">
                Kendala Utama*
              </Label>
              <Select
                value={formData.kendalaUtama}
                onValueChange={(value) => {
                  setFormData({ ...formData, kendalaUtama: value });
                  clearError('kendalaUtama');
                }}
              >
                <SelectTrigger className={`w-full h-12 rounded-xl ${errors.kendalaUtama ? 'border-red-500' : 'border-gray-200'}`}>
                  <SelectValue placeholder="Pilih Kendala Utama" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modal">Modal Terbatas</SelectItem>
                  <SelectItem value="hama">Serangan Hama/Penyakit</SelectItem>
                  <SelectItem value="cuaca">Cuaca Tidak Menentu</SelectItem>
                  <SelectItem value="pupuk">Harga Pupuk Mahal</SelectItem>
                  <SelectItem value="air">Kekurangan Air</SelectItem>
                  <SelectItem value="lainnya">Lainnya</SelectItem>
                </SelectContent>
              </Select>
              {errors.kendalaUtama && (
                <p className="text-red-500 text-sm mt-1">{errors.kendalaUtama}</p>
              )}
            </div>

            {/* Harapan */}
            <div>
              <Label className="text-sm font-semibold text-gray-700 mb-2">
                Harapan*
              </Label>
              <Select
                value={formData.harapan}
                onValueChange={(value) => {
                  setFormData({ ...formData, harapan: value });
                  clearError('harapan');
                }}
              >
                <SelectTrigger className={`w-full h-12 rounded-xl ${errors.harapan ? 'border-red-500' : 'border-gray-200'}`}>
                  <SelectValue placeholder="Pilih Harapan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="subsidi">Subsidi Pupuk/Bibit</SelectItem>
                  <SelectItem value="pelatihan">Pelatihan/Pendampingan</SelectItem>
                  <SelectItem value="bantuan-modal">Bantuan Modal</SelectItem>
                  <SelectItem value="teknologi">Akses Teknologi</SelectItem>
                  <SelectItem value="pasar">Akses Pasar</SelectItem>
                  <SelectItem value="lainnya">Lainnya</SelectItem>
                </SelectContent>
              </Select>
              {errors.harapan && (
                <p className="text-red-500 text-sm mt-1">{errors.harapan}</p>
              )}
            </div>

            {/* Pelatihan yang Dibutuhkan */}
            <div>
              <Label className="text-sm font-semibold text-gray-700 mb-2">
                Pelatihan yang Dibutuhkan*
              </Label>
              <Select
                value={formData.pelatihanDibutuhkan}
                onValueChange={(value) => {
                  setFormData({ ...formData, pelatihanDibutuhkan: value });
                  clearError('pelatihanDibutuhkan');
                }}
              >
                <SelectTrigger className={`w-full h-12 rounded-xl ${errors.pelatihanDibutuhkan ? 'border-red-500' : 'border-gray-200'}`}>
                  <SelectValue placeholder="Pilih Pelatihan yang Dibutuhkan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="budidaya">Teknik Budidaya Modern</SelectItem>
                  <SelectItem value="organik">Pertanian Organik</SelectItem>
                  <SelectItem value="hama">Pengendalian Hama Terpadu</SelectItem>
                  <SelectItem value="pasca-panen">Pasca Panen</SelectItem>
                  <SelectItem value="manajemen">Manajemen Usaha Tani</SelectItem>
                  <SelectItem value="teknologi">Penggunaan Teknologi</SelectItem>
                </SelectContent>
              </Select>
              {errors.pelatihanDibutuhkan && (
                <p className="text-red-500 text-sm mt-1">{errors.pelatihanDibutuhkan}</p>
              )}
            </div>

            {/* Kebutuhan Mendesak */}
            <div>
              <Label className="text-sm font-semibold text-gray-700 mb-2">
                Kebutuhan Mendesak*
              </Label>
              <Select
                value={formData.kebutuhanMendesak}
                onValueChange={(value) => {
                  setFormData({ ...formData, kebutuhanMendesak: value });
                  clearError('kebutuhanMendesak');
                }}
              >
                <SelectTrigger className={`w-full h-12 rounded-xl ${errors.kebutuhanMendesak ? 'border-red-500' : 'border-gray-200'}`}>
                  <SelectValue placeholder="Pilih Kebutuhan Mendesak" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pupuk">Pupuk</SelectItem>
                  <SelectItem value="pestisida">Pestisida</SelectItem>
                  <SelectItem value="bibit">Bibit Unggul</SelectItem>
                  <SelectItem value="alat">Alat Pertanian</SelectItem>
                  <SelectItem value="modal">Modal Usaha</SelectItem>
                  <SelectItem value="irigasi">Perbaikan Irigasi</SelectItem>
                </SelectContent>
              </Select>
              {errors.kebutuhanMendesak && (
                <p className="text-red-500 text-sm mt-1">{errors.kebutuhanMendesak}</p>
              )}
            </div>

            {/* Akses Air Pertanian (P2T) */}
            <div className="md:col-span-2">
              <Label className="text-sm font-semibold text-gray-700 mb-2">
                Akses Air Pertanian (P2T)*
              </Label>
              <Select
                value={formData.aksesAir}
                onValueChange={(value) => {
                  setFormData({ ...formData, aksesAir: value });
                  clearError('aksesAir');
                }}
              >
                <SelectTrigger className={`w-full h-12 rounded-xl ${errors.aksesAir ? 'border-red-500' : 'border-gray-200'}`}>
                  <SelectValue placeholder="Pilih Akses Air Pertanian" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baik">Baik - Tersedia Sepanjang Tahun</SelectItem>
                  <SelectItem value="cukup">Cukup - Tersedia Saat Musim Hujan</SelectItem>
                  <SelectItem value="terbatas">Terbatas - Sering Kekurangan</SelectItem>
                  <SelectItem value="tidak-ada">Tidak Ada Akses</SelectItem>
                </SelectContent>
              </Select>
              {errors.aksesAir && (
                <p className="text-red-500 text-sm mt-1">{errors.aksesAir}</p>
              )}
            </div>
          </div>
        </div>

        {/* Harapan di Masa Depan Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Harapan di Masa Depan
          </h2>

          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2">
              Apa harapan dan saran Bapak/Ibu ke depan agar pertanian lebih baik?*
            </Label>
            <Textarea
              value={formData.harapanMasaDepan}
              onChange={(e: any) => {
                setFormData({ ...formData, harapanMasaDepan: e.target.value });
                clearError('harapanMasaDepan');
              }}
              placeholder="Tulis harapan dan saran di sini"
              className={`min-h-[150px] rounded-xl ${errors.harapanMasaDepan ? 'border-red-500' : 'border-gray-200'} resize-none focus:ring-2 focus:ring-green-500`}
            />
            {errors.harapanMasaDepan && (
              <p className="text-red-500 text-sm mt-1">{errors.harapanMasaDepan}</p>
            )}
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-gray-500">
                Ceritakan harapan, saran, atau masukan untuk perbaikan pertanian di wilayah Anda
              </p>
              <p className={`text-xs ${getCharacterCount(formData.harapanMasaDepan ?? '').isValid ? 'text-gray-500' : 'text-red-500'}`}>
                {getCharacterCount(formData.harapanMasaDepan ?? '').current}/1000
              </p>
            </div>
          </div>
          {/* Consistency warnings */}
          {(() => {
            const consistencyCheck = checkFieldConsistency(formData.kendalaUtama, formData.aksesAir);
            if (!consistencyCheck.isConsistent && consistencyCheck.warning) {
              return (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-700">{consistencyCheck.warning}</p>
                </div>
              );
            }
            return null;
          })()}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end mt-5 gap-3">
            <Button
              onClick={() => navigate(`/komoditas/${localStorage.getItem("komoditas") || "/"}`)}
              variant="outline"
              className="sm:w-auto w-full hover:text-green-600 cursor-pointer text-green-600 border-green-600 hover:bg-green-50 font-semibold py-6 px-10 rounded-xl transition-all duration-200"
            >
              Kembali
            </Button>
            <Button
              onClick={handleSubmit}
              className="sm:w-auto w-full bg-green-600 cursor-pointer hover:bg-green-700 text-white font-semibold py-6 px-10 rounded-xl transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
            >
              Kirim
              <Icon icon="material-symbols:send" className="w-5 h-5" />
            </Button>
          </div>
        </div>

      </div>
    </>
  );
}