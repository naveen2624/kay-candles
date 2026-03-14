'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft, MessageCircle, MapPin, Phone, User,
  CheckCircle, Loader2, CreditCard, Lock,
} from 'lucide-react';
import { useCartStore, cartItemKey } from '@/lib/cartStore';
import { buildWhatsAppUrl } from '@/utils/whatsappOrder';
import { cn } from '@/utils/cn';

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

type FormData = {
  name: string;
  phone: string;
  address: string;
  paymentMethod: 'COD' | 'Razorpay';
};
type FormErrors = Partial<Record<keyof FormData, string>>;

export default function CheckoutPageClient() {
  const { items, getSubtotal, clearCart } = useCartStore();
  const router = useRouter();
  const subtotal = getSubtotal();

  const [form, setForm] = useState<FormData>({
    name: '', phone: '', address: '', paymentMethod: 'COD',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [deliveryFee, setDeliveryFee] = useState<number | null>(null);
  const [isLoadingDelivery, setIsLoadingDelivery] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [rzpLoaded, setRzpLoaded] = useState(false);

  // Load Razorpay SDK
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRzpLoaded(true);
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !orderPlaced) router.push('/cart');
  }, [items, router, orderPlaced]);

  // Fetch delivery fee
  useEffect(() => {
    if (!items.length) return;
    setIsLoadingDelivery(true);
    fetch('/api/delivery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: items.map((i) => ({ product_id: i.id, quantity: i.quantity })),
        subtotal,
      }),
    })
      .then((r) => r.json())
      .then((d) => setDeliveryFee(d.deliveryFee ?? 0))
      .catch(() => setDeliveryFee(subtotal > 999 ? 0 : 80))
      .finally(() => setIsLoadingDelivery(false));
  }, [items, subtotal]);

  const total = subtotal + (deliveryFee ?? 0);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    else if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, '')))
      e.phone = 'Enter a valid 10-digit Indian mobile number';
    if (!form.address.trim()) e.address = 'Address is required';
    else if (form.address.trim().length < 20) e.address = 'Please enter a complete address';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name as keyof FormErrors]) setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const saveOrderToDB = async (paymentId?: string, razorpayOrderId?: string) => {
    await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: form.name,
        phone: form.phone,
        address: form.address,
        items: items.map((i) => ({
          product_id: i.id,
          variant_id: i.variantId,
          name: i.name,
          variant_name: i.variantName,
          price: i.price,
          quantity: i.quantity,
          image_url: i.image_url,
        })),
        subtotal,
        delivery_fee: deliveryFee ?? 0,
        total,
        payment_method: form.paymentMethod,
        payment_id: paymentId,
        razorpay_order_id: razorpayOrderId,
      }),
    });
  };

  const openWhatsApp = () => {
    const url = buildWhatsAppUrl({
      name: form.name,
      phone: form.phone,
      address: form.address,
      items,
      subtotal,
      deliveryFee: deliveryFee ?? 0,
      total,
    });
    window.open(url, '_blank');
  };

  const handleCOD = async () => {
    if (!validate()) return;
    setIsPlacingOrder(true);
    try {
      await saveOrderToDB();
      setOrderPlaced(true);
      clearCart();
      setTimeout(openWhatsApp, 600);
    } catch (err) {
      console.error(err);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleRazorpay = async () => {
    if (!validate()) return;
    if (!rzpLoaded) {
      alert('Payment SDK is loading, please try again in a moment.');
      return;
    }
    setIsPlacingOrder(true);

    try {
      // 1. Create Razorpay order server-side
      const res = await fetch('/api/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total }),
      });
      const { orderId } = await res.json();

      // 2. Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: total * 100,
        currency: 'INR',
        name: 'Kay Candles and Craft',
        description: `Order for ${form.name}`,
        order_id: orderId,
        prefill: {
          name: form.name,
          contact: `+91${form.phone}`,
        },
        theme: { color: '#ff6b8a' },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          // 3. Verify signature server-side
          const verifyRes = await fetch('/api/razorpay', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
          });
          const { verified } = await verifyRes.json();

          if (verified) {
            await saveOrderToDB(response.razorpay_payment_id, response.razorpay_order_id);
            setOrderPlaced(true);
            clearCart();
            setTimeout(openWhatsApp, 600);
          } else {
            alert('Payment verification failed. Please contact us via WhatsApp.');
          }
          setIsPlacingOrder(false);
        },
        modal: {
          ondismiss: () => setIsPlacingOrder(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      setIsPlacingOrder(false);
    }
  };

  const handlePlaceOrder = () => {
    if (form.paymentMethod === 'Razorpay') handleRazorpay();
    else handleCOD();
  };

  // ── Order success screen ──
  if (orderPlaced) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-20 bg-blush-50">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mx-auto mb-6 animate-fade-up">
            <CheckCircle size={44} className="text-green-500" />
          </div>
          <h1 className="font-display text-4xl font-light text-blush-900 mb-3 animate-fade-up delay-100">
            Order Placed! 🎉
          </h1>
          <p className="font-body text-blush-600 mb-2 animate-fade-up delay-200">
            Thank you, <strong>{form.name}</strong>! Your order has been received.
          </p>
          <p className="font-body text-sm text-blush-500 mb-8 animate-fade-up delay-300">
            We&apos;ve opened WhatsApp so you can confirm your order with us. We&apos;ll get back to you shortly!
          </p>
          <div className="space-y-3 animate-fade-up delay-400">
            <Link href="/" className="block w-full py-3.5 bg-blush-400 hover:bg-blush-500 text-white font-body font-medium rounded-xl transition-colors text-center">
              Continue Shopping
            </Link>
            <button
              onClick={openWhatsApp}
              className="block w-full py-3.5 border border-blush-200 text-blush-600 font-body text-sm rounded-xl hover:bg-blush-50 transition-colors text-center"
            >
              Open WhatsApp Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blush-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/cart" className="flex items-center gap-1.5 font-body text-sm text-blush-500 hover:text-blush-700 transition-colors">
            <ArrowLeft size={15} /> Back to Cart
          </Link>
          <div className="h-4 w-px bg-blush-200" />
          <h1 className="font-display text-3xl sm:text-4xl font-light text-blush-900">Checkout</h1>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-10">
          {['Cart', 'Checkout', 'Order Placed'].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-body font-semibold',
                i === 1 ? 'bg-blush-400 text-white' : i < 1 ? 'bg-blush-200 text-blush-600' : 'bg-blush-100 text-blush-300'
              )}>{i + 1}</div>
              <span className={cn('font-body text-xs', i === 1 ? 'text-blush-700 font-medium' : 'text-blush-400')}>
                {step}
              </span>
              {i < 2 && <div className="w-8 h-px bg-blush-200" />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── Form ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Details */}
            <div className="bg-white rounded-2xl border border-blush-100 p-6 space-y-5">
              <h2 className="font-accent text-lg font-semibold text-blush-900 flex items-center gap-2">
                <MapPin size={18} className="text-blush-400" /> Delivery Details
              </h2>

              {/* Name */}
              <div className="space-y-1.5">
                <label className="font-body text-xs text-blush-600 font-medium flex items-center gap-1.5">
                  <User size={12} className="text-blush-400" /> Full Name *
                </label>
                <input
                  type="text" name="name" value={form.name} onChange={handleChange}
                  placeholder="Enter your full name"
                  className={cn(
                    'w-full px-4 py-3 bg-blush-50 border rounded-xl font-body text-sm text-blush-800 placeholder-blush-300 focus:outline-none focus:ring-2 focus:ring-blush-300 transition-all',
                    errors.name ? 'border-red-300 bg-red-50' : 'border-blush-100'
                  )}
                />
                {errors.name && <p className="font-body text-xs text-red-500">{errors.name}</p>}
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="font-body text-xs text-blush-600 font-medium flex items-center gap-1.5">
                  <Phone size={12} className="text-blush-400" /> Phone Number *
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center px-3 bg-blush-50 border border-blush-100 rounded-xl">
                    <span className="font-body text-sm text-blush-500">🇮🇳 +91</span>
                  </div>
                  <input
                    type="tel" name="phone" value={form.phone} onChange={handleChange}
                    placeholder="10-digit mobile number" maxLength={10}
                    className={cn(
                      'flex-1 px-4 py-3 bg-blush-50 border rounded-xl font-body text-sm text-blush-800 placeholder-blush-300 focus:outline-none focus:ring-2 focus:ring-blush-300 transition-all',
                      errors.phone ? 'border-red-300 bg-red-50' : 'border-blush-100'
                    )}
                  />
                </div>
                {errors.phone && <p className="font-body text-xs text-red-500">{errors.phone}</p>}
              </div>

              {/* Address */}
              <div className="space-y-1.5">
                <label className="font-body text-xs text-blush-600 font-medium flex items-center gap-1.5">
                  <MapPin size={12} className="text-blush-400" /> Delivery Address *
                </label>
                <textarea
                  name="address" value={form.address} onChange={handleChange}
                  placeholder="House/Flat No., Street, Area, City, State, PIN code"
                  rows={4}
                  className={cn(
                    'w-full px-4 py-3 bg-blush-50 border rounded-xl font-body text-sm text-blush-800 placeholder-blush-300 focus:outline-none focus:ring-2 focus:ring-blush-300 transition-all resize-none',
                    errors.address ? 'border-red-300 bg-red-50' : 'border-blush-100'
                  )}
                />
                {errors.address && <p className="font-body text-xs text-red-500">{errors.address}</p>}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl border border-blush-100 p-6 space-y-4">
              <h2 className="font-accent text-lg font-semibold text-blush-900 flex items-center gap-2">
                <Lock size={16} className="text-blush-400" /> Payment Method
              </h2>

              <div className="space-y-3">
                {/* COD */}
                <label className={cn(
                  'flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all',
                  form.paymentMethod === 'COD' ? 'border-blush-400 bg-blush-50' : 'border-blush-100 hover:border-blush-200'
                )}>
                  <input
                    type="radio" name="paymentMethod" value="COD"
                    checked={form.paymentMethod === 'COD'}
                    onChange={handleChange}
                    className="accent-pink-400"
                  />
                  <div className="flex-1">
                    <p className="font-body text-sm font-semibold text-blush-800">Cash on Delivery</p>
                    <p className="font-body text-xs text-blush-400">Pay when your order arrives at your door</p>
                  </div>
                  <span className="px-2.5 py-1 bg-green-50 text-green-600 text-[10px] font-body font-semibold rounded-full">
                    Available
                  </span>
                </label>

                {/* Razorpay */}
                <label className={cn(
                  'flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all',
                  form.paymentMethod === 'Razorpay' ? 'border-blush-400 bg-blush-50' : 'border-blush-100 hover:border-blush-200'
                )}>
                  <input
                    type="radio" name="paymentMethod" value="Razorpay"
                    checked={form.paymentMethod === 'Razorpay'}
                    onChange={handleChange}
                    className="accent-pink-400"
                  />
                  <div className="flex-1">
                    <p className="font-body text-sm font-semibold text-blush-800 flex items-center gap-2">
                      <CreditCard size={14} className="text-blush-400" />
                      Online Payment
                    </p>
                    <p className="font-body text-xs text-blush-400">UPI · Cards · Net Banking via Razorpay</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Lock size={10} className="text-green-500" />
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-[10px] font-body font-semibold rounded-full">
                      Secure
                    </span>
                  </div>
                </label>
              </div>

              {form.paymentMethod === 'Razorpay' && (
                <p className="text-[11px] font-body text-blush-400 flex items-center gap-1.5 bg-blush-50 rounded-lg px-3 py-2">
                  <Lock size={10} className="text-blush-300" />
                  Your payment is secured by Razorpay — India&apos;s most trusted payment gateway.
                </p>
              )}
            </div>
          </div>

          {/* ── Order Summary ── */}
          <div>
            <div className="bg-white rounded-2xl border border-blush-100 p-6 space-y-4 sticky top-24">
              <h2 className="font-accent text-lg font-semibold text-blush-900">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 max-h-56 overflow-y-auto">
                {items.map((item) => (
                  <div key={cartItemKey(item)} className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-blush-50 shrink-0">
                      <Image src={item.image_url} alt={item.name} fill className="object-cover" sizes="48px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-xs font-medium text-blush-800 truncate">{item.name}</p>
                      {item.variantName && (
                        <p className="font-body text-[10px] text-blush-400">{item.variantName}</p>
                      )}
                      <p className="font-body text-[11px] text-blush-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-body text-sm font-semibold text-blush-700 shrink-0">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-blush-50 pt-4 space-y-2.5">
                <div className="flex justify-between font-body text-sm">
                  <span className="text-blush-500">Subtotal</span>
                  <span className="text-blush-800">₹{subtotal}</span>
                </div>
                <div className="flex justify-between font-body text-sm">
                  <span className="text-blush-500">Delivery</span>
                  <span className="text-blush-800">
                    {isLoadingDelivery ? '...' : deliveryFee === 0
                      ? <span className="text-green-600">FREE 🎉</span>
                      : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between font-body border-t border-blush-100 pt-3">
                  <span className="font-semibold text-blush-700">Total</span>
                  <span className="font-display text-2xl font-semibold text-blush-700">
                    ₹{isLoadingDelivery ? '...' : total}
                  </span>
                </div>
              </div>

              {/* Place Order */}
              <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder || isLoadingDelivery}
                className={cn(
                  'w-full flex items-center justify-center gap-2 py-4 font-body font-medium rounded-xl transition-all',
                  isPlacingOrder || isLoadingDelivery
                    ? 'bg-blush-200 text-blush-400 cursor-not-allowed'
                    : 'bg-blush-400 hover:bg-blush-500 text-white hover:shadow-lg hover:shadow-blush-200'
                )}
              >
                {isPlacingOrder ? (
                  <><Loader2 size={18} className="animate-spin" /> Processing…</>
                ) : form.paymentMethod === 'Razorpay' ? (
                  <><CreditCard size={18} /> Pay ₹{total} Securely</>
                ) : (
                  <><MessageCircle size={18} /> Place Order via WhatsApp</>
                )}
              </button>

              <p className="font-body text-[11px] text-blush-400 text-center leading-relaxed">
                {form.paymentMethod === 'Razorpay'
                  ? 'After payment, your order will be confirmed via WhatsApp.'
                  : 'Your order will be confirmed via WhatsApp after placement.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
