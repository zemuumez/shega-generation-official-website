import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Syne, Plus_Jakarta_Sans, Space_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";
import PageLoader from "@/components/PageLoader";
import { safeFetch } from "@/sanity/lib/client";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import "./globals.css";

const bodoniModa = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#F4F3EE",
};

export const metadata: Metadata = {
  title: "Shega Generations | ሽጋ ትውልድ",
  description:
    "Free tech orientation, life skills, and indigenous knowledge for underprivileged geniuses across Ethiopia.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const siteSettings = await safeFetch<any>(SITE_SETTINGS_QUERY, {}, null);

  return (
    <html lang="en" className={`is-page-loading ${bodoniModa.variable} ${syne.variable} ${plusJakarta.variable} ${spaceMono.variable}`}>
      <head>
        <ThemeProvider siteSettings={siteSettings} />
      </head>
      <body className="font-body bg-ivory text-ink antialiased min-h-screen relative overflow-x-clip selection:bg-ochre/20 selection:text-ochre-dark">
        <Navbar
          showChallengesNav={siteSettings?.showChallengesNav !== false}
          challengesNavLabel={siteSettings?.challengesNavLabel}
        />

        <main className="relative z-10 min-h-[85vh]">{children}</main>

        <Footer showChallengesNav={siteSettings?.showChallengesNav !== false} />
        <PageLoader />
      </body>
    </html>
  );
}
