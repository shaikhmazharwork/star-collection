'use client';
export const dynamic = 'force-dynamic';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { PlusCircle, Package, ArrowLeft, RefreshCw, CheckCircle2, ShoppingBag, Truck, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders'>('inventory');
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('10');
  const [badge, setBadge] = useState('');
  const [description, setDescription] = useState('');

  // Data Fetching
  const loadData = async () => {
    // 1. Categories
    const { data: catData } = await supabase.from('categories').select('*').order('name');
    if (catData && catData.length > 0) {
      setCategories(catData);
      if (!categoryId) setCategoryId(catData[0].id);
    }

    // 2. Products
    const { data: prodData } = await supabase
      .from('products')
      .select('*, categories(name)')
      .order('created_at', { ascending: false });
    if (prodData) setProducts(prodData);

    // 3. Orders with items
    const { data: ordersData } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });
    if (ordersData) setOrders(ordersData);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Add Product
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return alert('Name aur Price zaroori hain');

    setLoading(true);
    setSuccessMsg('');

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();

    const { error } = await supabase.from('products').insert([
      {
        name,
        slug,
        category_id: categoryId || null,
        price: parseFloat(price),
        original_price: originalPrice ? parseFloat(originalPrice) : null,
        stock_quantity: parseInt(stockQuantity, 10) || 0,
        badge: badge || null,
        description: description || null,
        is_active: true,
      },
    ]);

    setLoading(false);

    if (error) {
      alert('Error: ' + error.message);
    } else {
      setSuccessMsg('Product successfully database me add ho gaya!');
      setName('');
      setPrice('');
      setOriginalPrice('');
      setDescription('');
      setBadge('');
      loadData();
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  // Update Order Status
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ order_status: newStatus })
      .eq('id', orderId);

    if (error) {
      alert('Status update error: ' + error.message);
    } else {
      loadData();
    }
  };

  // WhatsApp Link Generator
  const sendWhatsAppUpdate = (order: any) => {
    const cleanPhone = order.customer_phone.replace(/\D/g, '');
    const phoneWithCode = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    
    const message = `Namaste ${order.customer_name}!%0A%0AAapka Star Collection order (${order.order_number}) confirm ho chuka hai.%0ATotal Amount: ₹${order.total_amount} (${order.payment_method.toUpperCase()}).%0ADelivery Address: ${order.shipping_address}, ${order.city}.%0A%0AHamara courier partner jald hi tracking details share karega. Shukriya!`;

    window.open(`https://wa.me/${phoneWithCode}?text=${message}`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <Link href="/" className="text-slate-500 hover:text-slate-900 text-xs flex items-center gap-1 font-medium">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Storefront
          </Link>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight mt-1">
            Star Collection <span className="text-amber-500">Admin Control</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Tab Switcher */}
          <div className="bg-slate-100 p-1 rounded-lg flex text-xs font-semibold">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'inventory' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Inventory ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'orders' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Customer Orders ({orders.length})
            </button>
          </div>

          <button
            onClick={loadData}
            className="flex items-center gap-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 sm:px-3 sm:py-2 rounded-lg transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* TAB 1: INVENTORY MANAGEMENT */}
      {activeTab === 'inventory' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Product Form */}
          <div className="lg:col-span-1 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <PlusCircle className="w-5 h-5 text-amber-500" />
              <h2 className="font-bold text-slate-900 text-sm">Add New Product</h2>
            </div>

            {successMsg && (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 100W Fast Charging Cable"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-slate-900 bg-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="499"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Original MRP (₹)</label>
                  <input
                    type="number"
                    placeholder="999"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Badge</label>
                  <input
                    type="text"
                    placeholder="e.g. Hot, New"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  placeholder="Specs, features..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-lg transition-colors disabled:opacity-50 mt-1"
              >
                {loading ? 'Adding...' : 'Save Product'}
              </button>
            </form>
          </div>

          {/* Products List */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Package className="w-5 h-5 text-amber-500" />
              <h2 className="font-bold text-slate-900 text-sm">Store Inventory ({products.length})</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="py-2.5 px-3">Product Name</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Price</th>
                    <th className="py-2.5 px-3">Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3 font-medium text-slate-900 max-w-xs truncate">{p.name}</td>
                      <td className="py-3 px-3 text-slate-500">{p.categories?.name || 'General'}</td>
                      <td className="py-3 px-3 font-semibold text-slate-900">₹{p.price}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.stock_quantity > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {p.stock_quantity} left
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CUSTOMER ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <ShoppingBag className="w-5 h-5 text-amber-500" />
            <h2 className="font-bold text-slate-900 text-sm">Placed Customer Orders ({orders.length})</h2>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-500">
              No orders placed yet. As customers checkout, orders will show up here automatically.
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50/40">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-slate-900">{order.order_number}</span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                          {order.payment_method}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* WhatsApp Quick Notification Button */}
                      <button
                        onClick={() => sendWhatsAppUpdate(order)}
                        className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-xs"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Notify on WhatsApp</span>
                      </button>

                      {/* Status Dropdown */}
                      <select
                        value={order.order_status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="text-xs font-bold border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-800 focus:outline-none"
                      >
                        <option value="placed">Status: Placed</option>
                        <option value="confirmed">Status: Confirmed</option>
                        <option value="dispatched">Status: Dispatched 🚚</option>
                        <option value="delivered">Status: Delivered ✅</option>
                        <option value="cancelled">Status: Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Customer Delivery Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="font-semibold text-slate-500 uppercase text-[10px] tracking-wider">Customer Details</span>
                      <p className="font-bold text-slate-900 mt-0.5">{order.customer_name}</p>
                      <p className="text-slate-600">Phone: {order.customer_phone}</p>
                      {order.customer_email && <p className="text-slate-500">{order.customer_email}</p>}
                    </div>

                    <div>
                      <span className="font-semibold text-slate-500 uppercase text-[10px] tracking-wider">Shipping Address</span>
                      <p className="text-slate-800 mt-0.5">{order.shipping_address}</p>
                      <p className="text-slate-600">{order.city}, {order.state} - {order.pincode}</p>
                    </div>
                  </div>

                  {/* Ordered Items List */}
                  <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-1.5 text-xs">
                    <span className="font-semibold text-slate-500 text-[10px] uppercase">Purchased Items</span>
                    {order.order_items?.map((item: any) => (
                      <div key={item.id} className="flex justify-between items-center text-slate-800">
                        <span>{item.quantity}x {item.product_name}</span>
                        <span className="font-semibold">₹{item.total_price}</span>
                      </div>
                    ))}
                    <div className="border-t border-slate-100 pt-2 flex justify-between font-bold text-sm text-slate-900">
                      <span>Total Amount ({order.shipping_charge === 0 ? 'Free Shipping' : '+ ₹70 Shipping'})</span>
                      <span>₹{order.total_amount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}