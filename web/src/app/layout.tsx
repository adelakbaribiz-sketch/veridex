import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Veridex — Vendor Compliance & Risk Tracking",
  description:
    "Veridex tracks vendor insurance certificates, SOC 2 reports, and contracts, and flags compliance risk before it becomes a problem. Demo project — no real vendors, customers, or investment.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sourceSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-canvas text-ink-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
