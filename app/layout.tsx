import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CartProvider } from '../lib/CartContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Star Collection | Mobile Accessories, CCTV & Smart Gadgets',
  description: 'Shop genuine mobile accessories, security CCTV setups, and trending gadgets with fast shipping across India.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-slate-50 text-slate-900`}>
        <CartProvider>
          <Header />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}