import './globals.css';
import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Voilà Ton Chauffeur',
  description: 'Service de réservation de chauffeur privé',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <header className="bg-white shadow">
          <nav className="max-w-4xl mx-auto px-4 py-4 flex justify-between">
            <Link href="/" className="text-xl font-bold">Voilà Ton Chauffeur</Link>
            <Link href="/reservation" className="text-blue-600 hover:underline">Réservation</Link>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
