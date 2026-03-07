import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mind Canvas - משטח חקר חכם",
  description: "סביבת חקר חכמה לתלמידי חטיבת ביניים",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
