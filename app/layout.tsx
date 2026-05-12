import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/Geist-Regular.ttf",
  variable: "--font-geist-sans",
});

const geistMono = localFont({
  src: "./fonts/GeistMono-Regular.ttf",
  variable: "--font-geist-mono",
});

const inter = localFont({
  src: "./fonts/Inter-Regular.woff2",
  variable: "--font-inter",
});

const caveat = localFont({
  src: [
    {
      path: "./fonts/Caveat-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Caveat-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Caveat-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/Caveat-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-caveat",
});

import { Providers } from "../components/Providers";

export const metadata: Metadata = {
  title: "BookNest",
  description: "Books open minds. Knowledge shapes futures.",
};

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
      <html
          lang="en"
          className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} ${inter.variable} h-full antialiased`}
      >
      <body className="min-h-full flex flex-col">
      <Providers>{children}</Providers>
      </body>
      </html>
  );
}