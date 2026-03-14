import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'THE HISTORIA — Digital Magazine',
    short_name: 'Historia',
    description: 'A premium digital sanctuary for Islamic literature',
    start_url: '/',
    display: 'standalone',
    background_color: '#0F0F0F',
    theme_color: '#8B1E0F',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
