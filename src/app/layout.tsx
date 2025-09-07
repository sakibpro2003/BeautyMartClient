import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/Providers/Providers";
import ToastProvider from "@/Providers/ToastProvider";


export const metadata: Metadata = {
  title: "Dashboard - BeautyMart",
  description: "Learn more about BeautyMart and our commitment to healthcare excellence.",
};
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <html lang="en" data-theme="light">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <ToastProvider />
          {children}
        </body>
      </html>
    </Providers>
  );
}
