import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CODE JJ',
  description: 'Consent-based autonomous AI operating system',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
