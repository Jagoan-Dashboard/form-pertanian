import { assets } from "~/assets/assets";

export default function Banner() {
  return <div className="">
    {/* Hero Banner */}
    <div 
      className="relative rounded-3xl p-8 md:p-12 mb-5 text-white overflow-hidden "
      style={{
        backgroundImage: `linear-gradient(to top, rgba(34, 197, 94, 0.8), rgba(34, 197, 94, 0.4)), url(${assets.imageBaner})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center bottom',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="relative z-10 text-center">
        <h1 className="text-2xl md:text-4xl font-bold mb-3">Selamat Datang!</h1>
        <h2 className="text-lg md:text-2xl font-semibold mb-4 text-green-50">
          Formulir Penyuluh Pertanian Kab. Ngawi
        </h2>
        <p className="text-xs md:text-base text-green-50 leading-relaxed max-w-3xl">
          Formulir ini adalah formulir kelompok penyuluh pertanian kabupaten Ngawi. Formulir ini bertujuan untuk mengumpulkan data lengkap terkait komoditas yang ditanam di setiap area kelompok Ngawi.
        </p>
        <div className="mt-4 inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-xs">
          Lengkapi formulir ini dengan teliti
        </div>
      </div>
    </div>
  </div>
}