import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FreshCheck — Autonomous Temporal AI Verification",
  description: "Detect stale and outdated factual claims in AI answers using Bifrost and Tavily.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased min-h-screen text-[#0F172A] bg-gradient-to-br from-[#DCE6F5] via-[#E7EDF9] to-[#E3EAF7] selection:bg-[#6366F1]/20">
        {children}
      </body>
    </html>
  );
}
