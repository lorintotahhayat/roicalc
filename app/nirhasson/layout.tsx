import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nir Hasson - Digital Business Card",
  description: "Digital Business Card - Nir Hasson",
};

export default function NirHassonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

