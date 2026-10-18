import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SI-GATI — Catatan Gangguan Layanan TI SPBE',
    short_name: 'SI-GATI',
    description: 'Portal Pencatatan & Pemantauan Insiden Gangguan Layanan TI SPBE',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#BE0000',
    icons: [
      {
        src: '/icon-192x192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
      },
      {
        src: '/icon-512x512.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
      },
    ],
  };
}
