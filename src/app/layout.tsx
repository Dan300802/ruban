import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ruban — La mémoire de votre atelier",
  description:
    "Ruban remplace l'agenda papier des couturiers par des fiches de mesure sécurisées, jamais perdues.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
     
      </head>
      <body>{children}</body>
    </html>
  );
}