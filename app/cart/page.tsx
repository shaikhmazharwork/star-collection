'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, subtotal, cartCount } = useCart();
  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 70;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 bg-white border border-slate-200 rounded-2xl p-8 space-y-4">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Explore genuine mobile accessories, smart cameras, and everyday electronics.
        </p>
        <Link
          href="/"
          className="inline-block bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-6 py-2.5 rounded-lg transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="border-b border-slate-200 pb-3">
        <h1 className="text-2xl font-bold text-slate-900">Shopping Cart ({cartCount})</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-xl p-4 flex gap-4 items-center justify-between"
            >
              <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-2xl shrink-0 select-none">
                📦
              </div>

              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase font-bold text-amber-600">{item.category}</span>
                <h3 className="text-sm font-semibold text-slate-900 truncate">{item.name}</h3>
                <div className="text-xs font-bold text-slate-900 mt-1">₹{item.price.toLocaleString('en-IN')}</div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-l-lg"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-xs font-bold text-slate-900">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-r-lg"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                className="text-slate-400 hover:text-red-600 p-2 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 h-fit space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Order Summary</h2>

          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Shipping</span>
              <span>
                {shipping === 0 ? (
                  <span className="text-emerald-600 font-bold">FREE</span>
                ) : (
                  `₹${shipping}`
                )}
              </span>
            </div>
            {shipping > 0 && (
              <p className="text-[11px] text-amber-600">
                Add items worth ₹{(1000 - subtotal).toLocaleString('en-IN')} more for FREE shipping!
              </p>
            )}
            <div className="border-t border-slate-100 pt-3 flex justify-between text-sm font-bold text-slate-900">
              <span>Total Payable</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/checkout"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Guaranteed safe checkout & verified dispatch</span>
          </div>
        </div>
      </div>
    </div>
  );
}
