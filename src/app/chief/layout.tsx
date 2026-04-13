import type { Metadata } from 'next';
import ChiefLayoutClient from './ChiefLayoutClient';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Admin | THE INKSPIRE',
  description: 'Command Center for The Inkspire Digital Magazine.',
  icons: {
    icon: '/maink.png',
    apple: '/maink.png',
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black antialiased">
        {/* Force Pure Color Filter for Logo Transparency Issues */}
        <svg style={{ visibility: 'hidden', position: 'absolute' }} width="0" height="0" xmlns="http://www.w3.org/2000/svg" version="1.1">
          <defs>
            <filter id="force-pure-black">
              <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 100 -1" />
            </filter>
            <filter id="force-pure-white">
              <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 100 -1" />
            </filter>
          </defs>
        </svg>
        <ChiefLayoutClient>
          {children}
        </ChiefLayoutClient>
      </body>
    </html>
  );
}
