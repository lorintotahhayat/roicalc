import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Embedded World 2025 - Aurora Labs Complete Event Guide",
  description: "Aurora Labs - LOCI Platform Event Guide for Embedded World 2025",
};

export default function EventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

