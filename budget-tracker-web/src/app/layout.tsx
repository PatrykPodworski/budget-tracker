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
      <body className="min-h-dvh text-zinc-900 bg-zinc-50 bg-dots">
        <main className="sm:p-4">{children}</main>
      </body>
    </html>
  );
}
