import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FreshCheck — Spell-check for facts that expire",
  description: "Detect stale and outdated factual claims in AI answers using Bifrost and Tavily.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0B0D12] text-[#E6E8EE] antialiased selection:bg-[#6366F1]/30">
        {children}
      </body>
    </html>
  );
}

