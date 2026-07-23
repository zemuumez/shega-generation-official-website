import type { Metadata } from "next";
import { Syne, Plus_Jakarta_Sans, Space_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shega Generations | ሽጋ ትውልድ",
  description:
    "Free tech orientation, life skills, and indigenous knowledge for underprivileged geniuses across Ethiopia.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${plusJakarta.variable} ${spaceMono.variable}`}>
      <body className="font-body bg-ivory text-ink antialiased min-h-screen relative overflow-x-hidden selection:bg-ochre/20 selection:text-ochre-dark">
        <Navbar />

        <main className="relative z-10">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
