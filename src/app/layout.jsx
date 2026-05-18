import { Noto_Sans_Bengali, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cartContext";
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  variable: "--font-bengali",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Sobkisu Bazar - Bangladesh's Multivendor Marketplace",
  description: "Shop from thousands of verified sellers across Bangladesh. Fashion, Electronics, Food, and more.",
};

// Default fetch caching strategy for data reuse
export const fetchCache = "force-cache";
export const revalidate = 3600;

export default function RootLayout({ children }) {
  return (
    <html lang="bn" className={`${inter.variable} ${notoSansBengali.variable}`}>
      <body className="font-sans bg-gray-50 antialiased">
        <CartProvider>
          <TopBar />
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
