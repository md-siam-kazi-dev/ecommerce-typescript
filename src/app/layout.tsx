import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Navbar } from "@/components/navbar";
import { SiteFooter } from "@/components/site-footer";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/lib/cart";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aesthete — Curated essentials",
  description:
    "A considered edit of home goods, textiles, and tableware for daily ritual.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <CartProvider>
            <Navbar />
            <TooltipProvider>
            <div className="flex flex-1 flex-col">
              {children}
              <SiteFooter />
            </div>
            <Toaster position="top-center" />
          </TooltipProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
