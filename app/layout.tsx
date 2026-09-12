import type { Metadata } from "next";
import "./globals.css";
import "./book-material.css";
import "./chapters.css";
import "./makeover.css";
export const metadata: Metadata = {
  title: "Negar Pirasteh — Software Developer",
  description:
    "Backend-focused software developer in Montréal. Selected work and experience in Python, TypeScript, and the systems behind the interface.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
