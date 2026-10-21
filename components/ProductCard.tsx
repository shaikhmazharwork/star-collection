'use client';

import React, { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../lib/CartContext';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  image: string;
  badge?: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAdd = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      category: product.category,
      image: product.image,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-all flex flex-col justify-between">
      <div className="relative aspect-square bg-slate-100 flex items-center justify-center overflow-hidden p-4">
        {product.badge && (
          <span className="absolute top-2.5 left-2.5 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wide z-10 uppercase">
            {product.badge}
          </span>
        )}

        {discount > 0 && (
          <span className="absolute top-2.5 right-2.5 bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded z-10">
            {discount}% OFF
          </span>
        )}

        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 group-hover:scale-105 transition-transform duration-300">
          <span className="text-4xl select-none">📦</span>
          <span className="text-[11px] text-slate-400 mt-2 font-medium">{product.category}</span>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-semibold text-amber-600">
            {product.category}
          </span>
          <h3 className="font-semibold text-sm text-slate-800 line-clamp-2 mt-1 group-hover:text-amber-600 transition-colors">
            {product.name}
          </h3>
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-slate-900">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-slate-400 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
            {product.inStock ? 'In Stock (Fast Dispatch)' : 'Out of Stock'}
          </p>

          <button
            onClick={handleAdd}
            disabled={!product.inStock}
            className={`w-full mt-3 text-xs font-semibold py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors ${
              added
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-50'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" /> Added to Cart
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}