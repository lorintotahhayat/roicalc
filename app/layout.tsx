import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ROI Calculator - Development Savings",
  description: "Calculate your development savings with LOCI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

