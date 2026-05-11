import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Providers } from '@/components/providers';
import './globals.css';

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  title: {
    default: 'Halix Cloud — VPS Control',
    template: '%s · Halix Cloud',
  },
  description:
    'Premium dark VPS management: Proxmox-backed compute, IPAM, billing-ready API, and realtime panels.',
  metadataBase: new URL('https://halix.cloud'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans halix-grid`}
      >
        {children}
        <Providers />
      </body>
    </html>
  );
}
