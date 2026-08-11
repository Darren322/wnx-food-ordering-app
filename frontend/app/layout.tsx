import type { Metadata } from "next";
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
      <body className="min-h-screen bg-amber-50/40 text-neutral-900 antialiased">
        <CartProvider>
          <Header />
          <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
