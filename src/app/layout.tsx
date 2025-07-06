import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Livability Map',
  description: "Where to live in London? A map of livability scores based on tube stops, supermarkets, and shops.",
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col h-screen bg-gray-100">
        <header className="bg-white shadow-md py-4 px-6 text-2xl font-semibold text-gray-800">
          Livability Map
        </header>
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  )
}
