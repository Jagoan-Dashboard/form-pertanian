import { Button } from "~/components/ui/button";
import { Icon } from "@iconify/react";

export default function DataKomoditasView() {
  return (
    <div>
      <h1>Data Komoditas</h1>
      <Button className="bg-green-600 sm:w-fit cursor-pointer w-full hover:bg-green-700 text-white font-semibold py-6 px-10 rounded-xl transition-all duration-200 shadow-lg flex items-center gap-2">
        Selanjutnya
        <Icon icon="material-symbols:chevron-right" className="w-5 h-5" />
      </Button>
    </div>
  )
}