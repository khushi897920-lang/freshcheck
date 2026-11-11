import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body className="antialiased min-h-screen text-[#1E232B] selection:bg-[#6366F1]/20">
        {children}
      </body>
    </html>
  );
}
