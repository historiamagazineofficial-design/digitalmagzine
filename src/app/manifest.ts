import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'THE INKSPIRE - Digital Magazine',
    short_name: 'Inkspire',
    description: 'A premium digital sanctuary for Islamic literature',
    start_url: '/',
    display: 'standalone',
    background_color: '#0F0F0F',
    theme_color: '#07308D',
    icons: [
      {
        src: '/maink.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  };
}
