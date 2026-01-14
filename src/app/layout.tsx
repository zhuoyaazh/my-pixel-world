import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Font untuk heading (bold & tebal)
const pressStart = localFont({
  src: "./fonts/PressStart2P.ttf",
  variable: "--font-press",
  weight: "400",
});

// Font untuk body text (ramping & mudah dibaca)
const neuePixel = localFont({
  src: "./fonts/NeuePixelSans.ttf",
  variable: "--font-neue",
  weight: "400",
});

export const metadata: Metadata = {
  title: "zhuoyaazh's Space",
  description: "Welcome to my pixel playground",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${pressStart.variable} ${neuePixel.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
