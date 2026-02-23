import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MiniMed Event Log Dashboard",
  description: "eCommerce Funnel · Day One Operations View",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
