import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mor Hayat - Digital Business Card",
  description: "Digital Business Card - Mor Hayat, Director Business Development at Aurora Labs",
};

export default function MorHayatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

