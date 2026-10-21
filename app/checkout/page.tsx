'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/CartContext';
import { supabase } from '@/lib/supabase';
import { ShieldCheck, Truck, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, clearCart } = useCart();

  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 70;
  const total = subtotal + shipping;

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Aurangabad');
  const [state, setState] = useState('Maharashtra');
  const [pincode, setPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-16 bg-white border border-slate-200 rounded-xl p-8 space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Your cart is currently empty</h2>
        <p className="text-xs text-slate-500">Please add items to your cart before proceeding to checkout.</p>
        <Link
          href="/"
          className="inline-block bg-slate-900 text-white text-xs font-semibold px-5 py-2.5 rounded-lg"
        >
          Return to Store
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (phone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (pincode.length < 6) {
      setErrorMsg('Please enter a valid 6-digit PIN code.');
      return;
    }

    setLoading(true);

    try {
      // Unique Indian order identifier: SC-YEAR-RANDOM
      const orderNumber = 'SC-' + Math.floor(100000 + Math.random() * 900000);

      // 1. Insert into orders table
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            order_number: orderNumber,
            customer_name: name,
            customer_phone: phone,
            customer_email: email || null,
            shipping_address: address,
            city,
            state,
            pincode,
            subtotal,
            shipping_charge: shipping,
            total_amount: total,
            payment_method: paymentMethod,
            payment_status: paymentMethod === 'cod' ? 'pending_cod' : 'pending_online',
            order_status: 'placed',
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Insert order items
      const orderItems = cart.map((item) => ({
        order_id: orderData.id,
        product_id: item.id.length === 36 ? item.id : null,
        product_name: item.name,
        unit_price: item.price,
        quantity: item.quantity,
        total_price: item.price * item.quantity,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      // 3. Clear local cart & redirect
      clearCart();
      router.push(`/order-success?orderNumber=${orderNumber}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to place order. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      <div className="border-b border-slate-200 pb-3">
        <h1 className="text-2xl font-bold text-slate-900">Secure Checkout</h1>
        <p className="text-xs text-slate-500">Provide your delivery details to complete your order</p>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 p-3 rounded-xl flex items-center gap-2 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Form: Delivery Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-500" />
              1. Delivery Address (India)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Patil"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mobile Number (Calling & WhatsApp) *</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="10-digit number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Email Address (Optional for Invoice)</label>
                <input
                  type="email"
                  placeholder="yourname@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">House / Flat No., Building, Street *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Flat 302, Green Heights, Opp. Bus Stand"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">PIN Code *</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="e.g. 431001"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">City *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aurangabad"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">State *</label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-slate-900 bg-white"
                >
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Other">Other States</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              2. Payment Mode
            </h2>

            <div className="space-y-2 text-xs">
              <label
                className={`flex items-start gap-3 p-3.5 border rounded-xl cursor-pointer transition-colors ${
                  paymentMethod === 'cod' ? 'border-slate-900 bg-slate-50' : 'border-slate-200'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-0.5 text-slate-900"
                />
                <div>
                  <span className="font-bold text-slate-900">Cash on Delivery (Pay at Doorstep)</span>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Pay in cash or UPI when your order is delivered by our courier partner.
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3.5 border rounded-xl cursor-pointer transition-colors ${
                  paymentMethod === 'online' ? 'border-slate-900 bg-slate-50' : 'border-slate-200'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  checked={paymentMethod === 'online'}
                  onChange={() => setPaymentMethod('online')}
                  className="mt-0.5 text-slate-900"
                />
                <div>
                  <span className="font-bold text-slate-900">Online Payment (UPI, Cards, Net Banking)</span>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Pay securely using Google Pay, PhonePe, Paytm, or Debit/Credit Cards.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Summary: Items & Total */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Order Summary ({cart.length} items)
            </h3>

            <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto pr-1 space-y-2">
              {cart.map((item) => (
                <div key={item.id} className="pt-2 flex justify-between items-center text-xs">
                  <div className="pr-2">
                    <p className="font-semibold text-slate-900 line-clamp-1">{item.name}</p>
                    <p className="text-slate-500 text-[11px]">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-bold text-slate-900 whitespace-nowrap">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-3 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span>{shipping === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${shipping}`}</span>
              </div>
              <div className="border-t border-slate-100 pt-2 flex justify-between text-sm font-bold text-slate-900">
                <span>Total Payable</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Placing Order...' : `Confirm & Place Order (₹${total.toLocaleString('en-IN')})`}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Indian Dispatch • Easy Returns</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
