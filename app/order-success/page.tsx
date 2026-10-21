'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, PackageCheck, Home, PhoneCall } from 'lucide-react';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') || 'SC-CONFIRMED';

  return (
    <div className="max-w-xl mx-auto my-12 bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-6 shadow-xs">
      <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">Thank You! Order Confirmed</h1>
        <p className="text-xs text-slate-500">
          Your order has been recorded in our dispatch system and is being processed for delivery.
        </p>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-1">
        <span className="text-slate-500">Order Reference Number:</span>
        <p className="text-base font-black tracking-wider text-slate-900 uppercase">{orderNumber}</p>
      </div>

      <div className="text-xs text-slate-600 space-y-2 bg-amber-50/60 border border-amber-200/60 p-4 rounded-xl text-left">
        <p className="font-bold text-amber-900 flex items-center gap-1.5">
          <PackageCheck className="w-4 h-4 text-amber-700" /> What happens next?
        </p>
        <p className="text-slate-600 text-[11px] leading-relaxed">
          1. Our team from Aurangabad will verify the delivery address and dispatch your package via express courier.
        </p>
        <p className="text-slate-600 text-[11px] leading-relaxed">
          2. You will receive active courier tracking details via SMS/WhatsApp once the package is dispatched.
        </p>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-6 py-2.5 rounded-lg transition-colors"
        >
          <Home className="w-4 h-4" /> Continue Shopping
        </Link>
      </div>

      <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-4 flex items-center justify-center gap-1">
        <PhoneCall className="w-3.5 h-3.5" />
        <span>Need urgent help? Support contact: Aurangabad, MH</span>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-xs text-slate-400">Loading order details...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
