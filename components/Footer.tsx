import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-16 text-sm">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold tracking-tight uppercase">
              Star <span className="text-amber-500">Collection</span>
            </h3>
            <p className="mt-3 text-xs text-slate-400 leading-relaxed">
              Your trusted store for verified mobile accessories, smart home security cameras, and trending tech essentials.
            </p>
            <p className="mt-3 text-xs text-slate-400">
              📍 Aurangabad (Chhatrapati Sambhajinagar), Maharashtra
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Categories</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/" className="hover:text-white">Mobile Accessories</Link></li>
              <li><Link href="/" className="hover:text-white">CCTV & Security Cameras</Link></li>
              <li><Link href="/" className="hover:text-white">Smart Gadgets</Link></li>
              <li><Link href="/" className="hover:text-white">New Arrivals</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Customer Support</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/about" className="hover:text-white">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
              <li><Link href="/track-order" className="hover:text-white">Track Order</Link></li>
              <li><Link href="/shipping-policy" className="hover:text-white">Shipping & Delivery Policy</Link></li>
              <li><Link href="/return-policy" className="hover:text-white">Returns & Refunds</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">100% Safe Payments</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              We support UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, and Cash on Delivery.
            </p>
            <div className="inline-block bg-slate-800 border border-slate-700 px-3 py-1.5 rounded text-[11px] text-slate-300">
              🛡️ Verified Indian Business
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
          © 2026 Star Collection. All rights reserved.
        </div>
      </div>
    </footer>
  );
}