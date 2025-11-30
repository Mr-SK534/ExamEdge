

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "ExamEdge",
  description: "All-in-One AI Exam Prep for JEE • NEET • CUET • UPSC • NDA",
  manifest: "/manifest.json",
  themeColor: "#0f172a",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${inter.className} min-h-screen bg-dark-blue text-white antialiased`}>
        {children}

        {/* Fixed Sonner Toaster – Works with Sonner v1+ */}
        <Toaster
          position="top-center"
          closeButton
          richColors
          expand
          duration={4000}
          toastOptions={{
            style: {
              background: "#1e293b",
              color: "#e2e8f0",
              border: "1px solid #334155",
              fontSize: "15px",
            },
            classNames: {
              toast: "shadow-2xl",
              success: "bg-green-900/90 border-green-700 text-green-100",
              error: "bg-red-900/90 border-red-700 text-red-100",
              loading: "bg-blue-900/90 border-blue-700",
              info: "bg-slate-800 border-slate-600",
            },
          }}
        />
      </body>
    </html>
  );
}