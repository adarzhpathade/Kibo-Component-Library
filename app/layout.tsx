import type { Metadata } from "next";
import "./globals.css";

import { Sidebar } from "@/components/layout/sidebar";

export const metadata: Metadata = {
  title: "Kibo — Component Library",
  description:
    "A modern, motion-focused React component library. Discover, preview, and install beautiful UI components.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex bg-[var(--background)] text-[var(--foreground)]">
        <main className="flex-1 lg:pr-[368px]">{children}</main>
        <Sidebar />
      </body>
    </html>
  );
}
