import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Elysian Project — Premium Web Development",
  description:
    "We turn business ideas into digital reality. From landing pages to complex web systems — built with care, speed, and real craftsmanship.",
  keywords: [
    "web development",
    "landing page",
    "e-commerce",
    "web application",
    "Next.js",
    "Indonesia",
  ],
  openGraph: {
    title: "Elysian Project — Premium Web Development",
    description:
      "We turn business ideas into digital reality that works.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
