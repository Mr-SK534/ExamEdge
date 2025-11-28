import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ExamEdge",
  description: "All-in-One AI Exam Prep for JEE • NEET • CUET • UPSC • NDA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body className="min-h-screen bg-dark-blue">
        {children}
      </body>
    </html>
  );
}