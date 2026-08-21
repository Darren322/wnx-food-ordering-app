import type { Metadata } from "next";
import "@fontsource-variable/instrument-sans";
import "@fontsource-variable/newsreader";
import "./globals.css";
import { getSiteUrl, siteDescription, siteName } from "@/lib/seo";
import { CartProvider } from "@/components/cart/CartProvider";
import { Header } from "@/components/customer/Header";
import { Footer } from "@/components/customer/Footer";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${siteName} — Preorder Chicken Rice & Dry Laksa`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName,
    title: siteName,
    description: siteDescription,
    images: [
      {
        url: "/images/signboard.png",
        width: 1000,
        height: 520,
        alt: "Whampoa Nan Xiang Chicken Rice stall signboard",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="app-canvas flex min-h-screen flex-col font-sans text-stone-900 antialiased">
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-50 -translate-y-24 rounded-md bg-graphite px-4 py-2 font-semibold text-white transition focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
        >
          Skip to content
        </a>
        <CartProvider>
          <Header />
          <main
            id="main-content"
            className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8"
          >
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
