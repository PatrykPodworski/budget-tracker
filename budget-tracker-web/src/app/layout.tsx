import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Budget Tracker",
  description: "Track your expenses with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="container p-4">{children}</body>
    </html>
  );
}
