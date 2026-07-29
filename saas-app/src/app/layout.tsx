import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Altus Studio | AI Real Estate Video Platform",
  description: "Transforma listings de Airbnb, Zillow y MLS en recorridos cinemáticos 4K impulsados por IA Veo 3.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0c] text-zinc-100 font-sans selection:bg-[#d4af37]/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
