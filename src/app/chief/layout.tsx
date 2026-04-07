import type { Metadata } from 'next';
import ChiefLayoutClient from './ChiefLayoutClient';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Admin | THE INKSPIRE',
  description: 'Command Center for The Inkspire Digital Magazine.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black antialiased">
        <ChiefLayoutClient>
          {children}
        </ChiefLayoutClient>
      </body>
    </html>
  );
}
