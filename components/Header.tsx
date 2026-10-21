'use client';

import React from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, ShieldCheck, PhoneCall } from 'lucide-react';
import { useCart } from '../lib/CartContext';

export default function Header() {
  const { cartCount } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="bg-slate-900 text-slate-100 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Genuine Mobile Accessories & Gadgets | Pan-India Delivery</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-slate-300">
            <span className="flex items-center gap-1">
              <PhoneCall className="w-3.5 h-3.5" /> Support: Aurangabad, MH
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase">
              Star <span className="text-amber-500">Collection</span>
            </span>
            <span className="text-[10px] tracking-wider text-slate-500 font-medium uppercase -mt-1">
              Gadgets & Security
            </span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-lg mx-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search mobile accessories, CCTV cameras, gadgets..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:border-slate-900 focus:bg-white transition-all text-slate-800"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/cart"
              className="relative flex items-center gap-2 p-2 px-3 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-colors border border-slate-200"
            >
              <ShoppingBag className="w-5 h-5 text-slate-800" />
              <span className="hidden sm:inline text-xs font-semibold">Cart</span>
              <span className="inline-flex items-center justify-center w-5 h-5 text-[11px] font-bold text-white bg-slate-900 rounded-full">
                {cartCount}
              </span>
            </Link>
          </div>
        </div>

        <div className="mt-3 md:hidden">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <nav className="flex items-center gap-6 mt-3 pt-2 border-t border-slate-100 text-xs font-medium text-slate-600 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="text-slate-900 font-semibold hover:text-slate-900">All Products</Link>
          <Link href="/" className="hover:text-slate-900">Mobile Accessories</Link>
          <Link href="/" className="hover:text-slate-900">CCTV & Security</Link>
          <Link href="/" className="hover:text-slate-900">Smart Gadgets</Link>
          <Link href="/admin" className="text-amber-600 font-bold hover:text-amber-700 ml-auto">Admin Panel</Link>
        </nav>
      </div>
    </header>
  );
}