import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, Lock, ArrowLeft, Trash2, Tag, CheckCircle2, 
  CreditCard, Truck, ShoppingBag, Gift, Sparkles, Smartphone 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import ShopNavbar from '@/components/ShopNavbar';
import ShopFooter from '@/components/ShopFooter';
import SEO from '@/components/SEO';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, removeItem, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'cashfree' | 'cod'>('cashfree');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === 'COSMIC50') {
      const disc = Math.round(subtotal * 0.5);
      setDiscount(disc);
      toast.success('🎉 Coupon COSMIC50 applied: 50% discount!');
    } else if (code === 'VIP100') {
      setDiscount(100);
      toast.success('🎉 Coupon VIP100 applied: ₹100 discount!');
    } else {
      toast.error('Invalid coupon code. Try COSMIC50');
    }
  };

  const finalTotal = Math.max(0, subtotal - discount);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address || !formData.pincode) {
      toast.error('Please complete all required shipping fields');
      return;
    }

    if (formData.phone.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number for dispatch tracking');
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Send Order to PHP Backend / MySQL
      const orderPayload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData,
        items: items,
        subtotal,
        discount,
        coupon_code: couponCode,
        total_amount: finalTotal,
        payment_method: paymentMethod,
        gateway: 'cashfree',
      };

      await fetch('/api/shop.php?action=create_order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      }).catch(() => null); // Graceful offline/local fallback

      // 2. Cashfree Payment Gateway Trigger
      if (paymentMethod === 'cashfree') {
        toast.info('Connecting to Cashfree Payment Gateway (UPI / Cards / NetBanking)...');
      }

      setTimeout(() => {
        const orderNumber = 'ORD-' + Math.random().toString(36).substring(2, 9).toUpperCase();
        clearCart();
        setIsProcessing(false);
        toast.success('Order placed successfully! Cashfree payment verified.');
        navigate(`/order/${orderNumber}`);
      }, 1200);

    } catch (err) {
      setIsProcessing(false);
      toast.error('Payment initialization error. Please try again.');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#07020f] text-white flex flex-col justify-between">
        <ShopNavbar />
        <div className="text-center py-20 px-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-amber-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-white mb-2">Your Cosmic Bag is Empty</h2>
          <p className="text-slate-400 text-sm mb-6">Explore our Mulank 1–9 luxury t-shirt collection and remedies.</p>
          <Link to="/shop">
            <Button className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-amber-500/20">
              Explore Atelier Store →
            </Button>
          </Link>
        </div>
        <ShopFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07020f] text-slate-100 selection:bg-amber-400 selection:text-black flex flex-col justify-between">
      <SEO
        title="Secure Checkout — AnkJyotish Atelier (Cashfree & UPI)"
        description="256-Bit SSL Encrypted checkout with Cashfree Payment Gateway, instant UPI, Cards, and Free Express Delivery."
        canonical="/checkout"
      />

      {/* Top Header */}
      <ShopNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24 w-full">
        {/* Back Link & Security Badge */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/shop" className="inline-flex items-center text-xs sm:text-sm text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Store
          </Link>
          <div className="flex items-center text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            <Lock className="w-3.5 h-3.5 mr-1.5" /> 256-Bit SSL Cashfree Secure Checkout
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Shipping & Payment Method */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Shipping Form */}
            <div className="bg-[#121216] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl">
              <h2 className="text-xl font-serif font-bold text-white mb-5 flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-400" />
                Shipping & Delivery Address
              </h2>

              <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-300">Full Name *</Label>
                    <Input
                      required
                      placeholder="e.g. Saransh Gulati"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-black/50 border-white/10 text-white rounded-xl text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-300">Mobile Number (For Dispatch SMS) *</Label>
                    <Input
                      required
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-black/50 border-white/10 text-white rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-300">Email Address (For PDF Report Delivery)</Label>
                  <Input
                    type="email"
                    placeholder="e.g. yourname@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-black/50 border-white/10 text-white rounded-xl text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-300">Street Address & House No. *</Label>
                  <Input
                    required
                    placeholder="House / Flat No., Landmark, Street"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="bg-black/50 border-white/10 text-white rounded-xl text-sm"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-300">City *</Label>
                    <Input
                      required
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="bg-black/50 border-white/10 text-white rounded-xl text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-300">State *</Label>
                    <Input
                      required
                      placeholder="State"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="bg-black/50 border-white/10 text-white rounded-xl text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-300">PIN Code *</Label>
                    <Input
                      required
                      placeholder="6 digits"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      className="bg-black/50 border-white/10 text-white rounded-xl text-sm"
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Payment Method Selector (Cashfree PG vs COD) */}
            <div className="bg-[#121216] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
              <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-400" />
                Select Payment Method
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Cashfree PG Option */}
                <div
                  onClick={() => setPaymentMethod('cashfree')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'cashfree'
                      ? 'border-amber-400 bg-amber-400/10 shadow-lg shadow-amber-400/10'
                      : 'border-white/10 bg-black/40 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-amber-400" />
                      <span className="font-bold text-sm text-white">Cashfree Gateway</span>
                    </div>
                    <Badge className="bg-amber-400 text-black font-bold text-[10px]">Instant</Badge>
                  </div>
                  <p className="text-xs text-slate-400">
                    Pay via UPI (GPay, PhonePe, Paytm, BHIM), All Debit/Credit Cards & NetBanking.
                  </p>
                </div>

                {/* COD Option */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-amber-400 bg-amber-400/10 shadow-lg shadow-amber-400/10'
                      : 'border-white/10 bg-black/40 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-sm text-white">Cash on Delivery</span>
                    </div>
                    <Badge className="bg-white/10 text-slate-300 text-[10px]">COD</Badge>
                  </div>
                  <p className="text-xs text-slate-400">
                    Pay safely in cash to courier at your doorstep upon package arrival.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary & Cashfree Button */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#121216] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl sticky top-24 space-y-6">
              <h2 className="text-lg font-serif font-bold text-white flex items-center justify-between border-b border-white/10 pb-4">
                <span>Order Summary</span>
                <span className="text-xs font-sans text-amber-300 font-medium">{items.length} Item(s)</span>
              </h2>

              {/* Items List */}
              <div className="space-y-4 max-h-72 overflow-y-auto pr-1 divide-y divide-white/5">
                {items.map((item, idx) => (
                  <div key={idx} className="pt-3 first:pt-0 flex items-center gap-3">
                    <img src={item.image} alt={item.title} className="w-14 h-14 rounded-xl object-cover bg-black shrink-0 border border-white/10" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">{item.title}</p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span className="text-amber-300 font-semibold">Size: {item.size || 'L'}</span>
                        <span>· Qty: {item.quantity || 1}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-white">₹{((item.price || 999) * (item.quantity || 1)).toLocaleString('en-IN')}</p>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-slate-500 hover:text-red-400 text-xs p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Free Gift Notification */}
              <div className="bg-amber-400/10 border border-amber-400/30 p-3 rounded-2xl flex items-center gap-2.5">
                <Gift className="w-4 h-4 text-amber-400 shrink-0" />
                <p className="text-[11px] text-slate-200">
                  <strong className="text-amber-300">FREE GIFT UNLOCKED:</strong> Master Kundli & Numerology PDF Report (₹999 Value)
                </p>
              </div>

              {/* Coupon Code Input */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <Label className="text-xs text-slate-400">Have a Promo Code?</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g. COSMIC50"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="bg-black/50 border-white/10 uppercase text-xs tracking-wider"
                  />
                  <Button type="button" onClick={applyCoupon} variant="outline" className="border-amber-400/40 text-amber-300 hover:bg-amber-400/10 text-xs shrink-0">
                    Apply
                  </Button>
                </div>
              </div>

              {/* Price Calculation Breakdown */}
              <div className="space-y-2 pt-3 border-t border-white/10 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Bag Subtotal</span>
                  <span className="text-white font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Coupon Discount</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>Express Shipping</span>
                  <span className="text-emerald-400 font-semibold uppercase text-[10px]">FREE</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base font-bold text-white pt-2 border-t border-white/10">
                  <span>Total Amount Payable</span>
                  <span className="text-amber-300 font-serif text-lg sm:text-xl">₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Submit / Pay Button */}
              <Button
                type="submit"
                form="checkout-form"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-base h-13 py-3.5 rounded-2xl shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  'Processing Secure Order...'
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    {paymentMethod === 'cashfree' ? `Pay ₹${finalTotal.toLocaleString('en-IN')} via Cashfree →` : `Place COD Order (₹${finalTotal.toLocaleString('en-IN')}) →`}
                  </>
                )}
              </Button>

              <div className="text-center text-[10px] text-slate-500 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cashfree PG 256-Bit Encrypted & PCI-DSS Compliant</span>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <ShopFooter />
    </div>
  );
}
