import type { Metadata } from "next";
import "./globals.css";

import { Sidebar } from "@/components/layout/sidebar";
import { SmoothScroll } from "@/components/layout/smooth-scroll";

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
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,100..1000&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex bg-[var(--background)] text-[var(--foreground)]">
        <SmoothScroll>
          <>
            <main id="main-content" className="flex-1 lg:pr-[368px]">{children}</main>
            <Sidebar />
          </>
        </SmoothScroll>
      </body>
    </html>
  );
}
