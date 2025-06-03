import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PocketLog - Smart Financial Management",
  description:
    "Track your expenses, manage budgets, and gain insights into your financial habits with our modern expense tracking application.",
  keywords:
    "expense tracker, budget management, financial planning, money management",
  authors: [{ name: "PocketLog" }],
  openGraph: {
    title: "PocketLog - Smart Financial Management",
    description:
      "Track your expenses, manage budgets, and gain insights into your financial habits.",
    type: "website",
  },
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
