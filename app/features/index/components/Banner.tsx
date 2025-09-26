export default function Banner() {
  return <div className="">
    {/* Hero Banner */}
    <div className="relative bg-gradient-to-r from-green-600 to-emerald-700 rounded-3xl p-8 md:p-12 text-white overflow-hidden ">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.15),transparent_50%)]"></div>
      </div>
      <div className="relative z-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Selamat Datang!</h1>
        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-green-50">
          Formulir Penyuluh Pertanian Kab. Ngawi
        </h2>
        <p className="text-sm md:text-base text-green-50 leading-relaxed max-w-3xl">
          Formulir ini adalah formulir kelompok penyuluh pertanian kabupaten Ngawi. Formulir ini bertujuan untuk mengumpulkan data lengkap terkait komoditas yang ditanam di setiap area kelompok Ngawi.
        </p>
        <div className="mt-4 inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-sm">
          Lengkapi formulir ini dengan teliti
        </div>
      </div>
    </div>
  </div>
}