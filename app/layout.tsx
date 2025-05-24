import '../styles/globals.css';

export const metadata = {
  title: 'Voilà Ton Chauffeur',
  description: 'Réservez votre trajet privé en toute simplicité.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        
      </head>
      <body>{children}</body>
    </html>
  );
}
