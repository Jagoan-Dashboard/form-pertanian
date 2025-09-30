import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { useNavigate } from "react-router";
import { SuccessAlert } from "~/components/SuccesAlert";
import { checkFieldConsistency, getCharacterCount } from "./validation/validation";
import { useFormContext } from "react-hook-form";
import { useFormContextHook } from "~/context/formProvider";

export default function AspirasiTaniView() {
  const navigate = useNavigate();
  const { watch, setValue, formState: { errors }, trigger } = useFormContext();
  const { submitForm, isSubmitting } = useFormContextHook();
  const [showAlert, setShowAlert] = useState(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  // Watch form values
  const main_constraint = watch('main_constraint');
  const farmer_hope = watch('farmer_hope');
  const training_needed = watch('training_needed');
  const urgent_needs = watch('urgent_needs');
  const water_access = watch('water_access');
  const suggestions = watch('suggestions');

  // Helper functions for error handling
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

  const handleSubmit = async () => {
    setIsSubmittingForm(true);
    try {
      // Validate current step
      const isValid = await trigger(['main_constraint', 'farmer_hope', 'training_needed', 'urgent_needs', 'water_access', 'suggestions']);

      if (isValid) {
        // Submit all form data - get data from the same context we're using
        const allFormData = watch();
        console.log('🔍 AspirasiTani - All form data:', allFormData);

              // Submit using submitForm
              await submitForm();
        // Show success alert
        setShowAlert(true);

        // Navigate to home after 2 seconds
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        console.log('Validation failed:', errors);
      }
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmittingForm(false);
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
                value={main_constraint || ''}
                onValueChange={(value) => {
                  setValue('main_constraint', value);
                  trigger('main_constraint');
                }}
              >
                <SelectTrigger className={`w-full h-12 rounded-xl ${getFieldError('main_constraint') ? 'border-red-500' : 'border-gray-200'}`}>
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
              {getFieldError('main_constraint') && (
                <p className="text-red-500 text-sm mt-1">{getErrorMessage('main_constraint')}</p>
              )}
            </div>

            {/* Harapan */}
            <div>
              <Label className="text-sm font-semibold text-gray-700 mb-2">
                Harapan*
              </Label>
              <Select
                value={farmer_hope || ''}
                onValueChange={(value) => {
                  setValue('farmer_hope', value);
                  trigger('farmer_hope');
                }}
              >
                <SelectTrigger className={`w-full h-12 rounded-xl ${getFieldError('farmer_hope') ? 'border-red-500' : 'border-gray-200'}`}>
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
              {getFieldError('farmer_hope') && (
                <p className="text-red-500 text-sm mt-1">{getErrorMessage('farmer_hope')}</p>
              )}
            </div>

            {/* Pelatihan yang Dibutuhkan */}
            <div>
              <Label className="text-sm font-semibold text-gray-700 mb-2">
                Pelatihan yang Dibutuhkan*
              </Label>
              <Select
                value={training_needed || ''}
                onValueChange={(value) => {
                  setValue('training_needed', value);
                  trigger('training_needed');
                }}
              >
                <SelectTrigger className={`w-full h-12 rounded-xl ${getFieldError('training_needed') ? 'border-red-500' : 'border-gray-200'}`}>
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
              {getFieldError('training_needed') && (
                <p className="text-red-500 text-sm mt-1">{getErrorMessage('training_needed')}</p>
              )}
            </div>

            {/* Kebutuhan Mendesak */}
            <div>
              <Label className="text-sm font-semibold text-gray-700 mb-2">
                Kebutuhan Mendesak*
              </Label>
              <Select
                value={urgent_needs || ''}
                onValueChange={(value) => {
                  setValue('urgent_needs', value);
                  trigger('urgent_needs');
                }}
              >
                <SelectTrigger className={`w-full h-12 rounded-xl ${getFieldError('urgent_needs') ? 'border-red-500' : 'border-gray-200'}`}>
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
              {getFieldError('urgent_needs') && (
                <p className="text-red-500 text-sm mt-1">{getErrorMessage('urgent_needs')}</p>
              )}
            </div>

            {/* Akses Air Pertanian (P2T) */}
            <div className="md:col-span-2">
              <Label className="text-sm font-semibold text-gray-700 mb-2">
                Akses Air Pertanian (P2T)*
              </Label>
              <Select
                value={water_access || ''}
                onValueChange={(value) => {
                  setValue('water_access', value);
                  trigger('water_access');
                }}
              >
                <SelectTrigger className={`w-full h-12 rounded-xl ${getFieldError('water_access') ? 'border-red-500' : 'border-gray-200'}`}>
                  <SelectValue placeholder="Pilih Akses Air Pertanian" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baik">Baik - Tersedia Sepanjang Tahun</SelectItem>
                  <SelectItem value="cukup">Cukup - Tersedia Saat Musim Hujan</SelectItem>
                  <SelectItem value="terbatas">Terbatas - Sering Kekurangan</SelectItem>
                  <SelectItem value="tidak-ada">Tidak Ada Akses</SelectItem>
                </SelectContent>
              </Select>
              {getFieldError('water_access') && (
                <p className="text-red-500 text-sm mt-1">{getErrorMessage('water_access')}</p>
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
              value={suggestions || ''}
              onChange={(e: any) => {
                setValue('suggestions', e.target.value);
                trigger('suggestions');
              }}
              placeholder="Tulis harapan dan saran di sini"
              className={`min-h-[150px] rounded-xl ${getFieldError('suggestions') ? 'border-red-500' : 'border-gray-200'} resize-none focus:ring-2 focus:ring-green-500`}
            />
            {getFieldError('suggestions') && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage('suggestions')}</p>
            )}
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-gray-500">
                Ceritakan harapan, saran, atau masukan untuk perbaikan pertanian di wilayah Anda
              </p>
              <p className={`text-xs ${getCharacterCount(suggestions ?? '').isValid ? 'text-gray-500' : 'text-red-500'}`}>
                {getCharacterCount(suggestions ?? '').current}/1000
              </p>
            </div>
          </div>
          {/* Consistency warnings */}
          {(() => {
            const consistencyCheck = checkFieldConsistency(main_constraint || '', water_access || '');
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
              disabled={isSubmittingForm || isSubmitting}
              className="sm:w-auto w-full bg-green-600 cursor-pointer hover:bg-green-700 text-white font-semibold py-6 px-10 rounded-xl transition-all duration-200 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmittingForm || isSubmitting ? 'Mengirim...' : 'Kirim'}
              <Icon icon="material-symbols:send" className="w-5 h-5" />
            </Button>
          </div>
        </div>

      </div>
    </>
  );
}