import type { Metadata, Viewport } from "next";
import Nav from "./Nav";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hackers Read It",
  description: "A Reddit-style Hacker News reader",
  appleWebApp: {
    capable: true,
    title: "Read It",
    statusBarStyle: "black",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d1114",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="text-text-primary max-w-[1000px] mx-auto px-3 sm:px-5"
    >
      <body className={`${inter.className} bg-surface-primary relative`}>
        <Nav />
        <main className="pt-2">{children}</main>
      </body>
    </html>
  );
}
