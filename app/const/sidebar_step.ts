import type { SidebarStep } from "~/types/sidebar";

export const ALL_STEPS: SidebarStep[] = [
  { number: 1, title: 'Data Penyuluh', desc: 'Masukan identitas penyuluh dan petani.', path: '/' },
  { number: 2, title: 'Komoditas', desc: 'Pilih jenis komoditas yang ditanam.', path: '/komoditas' },
  { number: 3, title: 'Data Komoditas', desc: 'Lengkapi informasi detail terkait komoditas.', path: '/data-komoditas' },
  { number: 4, title: 'Aspirasi Petani', desc: 'Bagikan aspirasi dan masukan dari petani.', path: '/aspirasi-tani' }
];