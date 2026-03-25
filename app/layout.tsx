import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/src/components/site-footer";
import { SiteHeader } from "@/src/components/site-header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://watchdecode.com"),
  title: {
    default: "WatchDecode | Decoding watches for everyday buyers",
    template: "%s | WatchDecode",
  },
  description:
    "WatchDecode helps everyday buyers choose better watches with practical reviews, buying guides, and no-hype advice.",
  openGraph: {
    title: "WatchDecode | Decoding watches for everyday buyers",
    description:
      "WatchDecode helps everyday buyers choose better watches with practical reviews, buying guides, and no-hype advice.",
    type: "website",
    url: "https://watchdecode.com",
    siteName: "WatchDecode",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "WatchDecode",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WatchDecode | Decoding watches for everyday buyers",
    description:
      "WatchDecode helps everyday buyers choose better watches with practical reviews, buying guides, and no-hype advice.",
    images: ["/twitter-image"],
  },
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "https://watchdecode.com/rss.xml",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white text-zinc-900">
        <div className="flex min-h-full flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
