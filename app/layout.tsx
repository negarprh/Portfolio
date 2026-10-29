import type { Metadata } from "next";
import "./globals.css";
import "./book-material.css";
import "./chapters.css";
import "./makeover.css";
const deploymentHost =
  process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      (deploymentHost ? `https://${deploymentHost}` : "http://localhost:3000"),
  ),
  title: "Negar Pirasteh - Software Developer",
  description:
    "Backend-focused software developer in Montréal. Selected work and experience in Python, TypeScript, and the systems behind the interface.",
  openGraph: {
    type: "website",
    siteName: "Negar Pirasteh",
  },
  twitter: {
    card: "summary_large_image",
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/fonts/orbitron.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/editorial.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/body.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
