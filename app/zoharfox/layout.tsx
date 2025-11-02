import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zohar Fox - Digital Business Card",
  description: "Digital Business Card - Zohar Fox, CEO & Co Founder",
};

export default function ZoharFoxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

