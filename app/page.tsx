import React from 'react';
import { Shield, Truck, Clock, Sparkles, Camera, Smartphone, Cpu } from 'lucide-react';
import ProductCard, { Product } from '@/components/ProductCard';
import { supabase } from '@/lib/supabase';

// Real database se active products fetch karne ka function
async function getProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, price, original_price, stock_quantity, badge, image_url, categories(name)')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase fetch error:', error.message);
      return [];
    }

    return (data || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      category: item.categories?.name || 'Accessories',
      price: Number(item.price),
      originalPrice: item.original_price ? Number(item.original_price) : undefined,
      inStock: item.stock_quantity > 0,
      image: item.image_url || '',
      badge: item.badge || undefined,
    }));
  } catch (err) {
    console.error('Failed to load products:', err);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="space-y-12">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 rounded-2xl p-6 sm:p-12 text-white shadow-lg overflow-hidden relative">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            Verified Tech Essentials
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Premium Accessories & Security for Your Lifestyle.
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Discover dependable CCTV security cameras, high-speed mobile chargers, and everyday smart gadgets at honest prices.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <a
              href="#products-section"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-lg text-sm transition-all shadow-md inline-block"
            >
              Shop All Products
            </a>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">Featured Categories</h2>
          <p className="text-xs text-slate-500">Browse genuine products tailored for your needs</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-400 transition-colors cursor-pointer group flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Mobile Accessories</h3>
              <p className="text-xs text-slate-500">Chargers, cables & protection</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-400 transition-colors cursor-pointer group flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">CCTV & Security</h3>
              <p className="text-xs text-slate-500">WiFi cameras & surveillance</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-400 transition-colors cursor-pointer group flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Smart Gadgets</h3>
              <p className="text-xs text-slate-500">Everyday trending electronics</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Products Grid */}
      <section id="products-section" className="space-y-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">Featured Products</h2>
          <p className="text-xs text-slate-500">Real-time inventory directly from our database</p>
        </div>

        {products.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 text-sm">
            No active products found in the database.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Trust Badges */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
          <div className="p-2.5 bg-slate-100 rounded-lg text-slate-900">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900">Pan-India Courier Shipping</h3>
            <p className="text-[11px] text-slate-500">Fast delivery with active tracking numbers</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
          <div className="p-2.5 bg-slate-100 rounded-lg text-slate-900">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900">100% Verified Quality</h3>
            <p className="text-[11px] text-slate-500">Tested products with warranty support</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
          <div className="p-2.5 bg-slate-100 rounded-lg text-slate-900">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900">Aurangabad Support Hub</h3>
            <p className="text-[11px] text-slate-500">Direct phone & WhatsApp order support</p>
          </div>
        </div>
      </section>
    </div>
  );
}