import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Header } from "./header";
import { Toaster } from "@/components/ui/toaster";

import { ConvexClientProvider } from "./ConvexClientProvider";
import { Footer } from "./footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "File Rhino",
  description: "File storage system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <ConvexClientProvider>
          <Toaster />
          <Header />
          <div className="flex-1">{children}</div>{" "}
          {/* This will grow the content area */}
          <Footer />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
