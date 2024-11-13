'use client';

import localFont from "next/font/local";
import "./globals.css";
// import { BrowserRouter } from "react-router-dom";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <BrowserRouter> */}
        {/* Wrap only specific components in BrowserRouter if needed */}
          {children} 
        {/* Ensure your routing hooks are within BrowserRouter */}
          {/* </BrowserRouter> */}
      </body>
    </html>
  );
}

