import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  User, 
  Phone, 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatters';
import { BHOPAL_LOCALITIES } from '../../utils/bhopalGeo';

export const CheckoutModal = ({ isOpen, onClose, onOrderPlaced }) => {
  const { cart, createOrder, transportPartners, activeLocality } = useAppData();
  const { currentUser } = useAuth();

  const [selectedAddress, setSelectedAddress] = useState({
    flat: 'Villa 14, Green Meadows',
    locality: activeLocality || 'Arera Colony',
    city: 'Bhopal',
    state: 'Madhya Pradesh',
    pincode: '462016',
    landmark: 'Near Campion School',
    latitude: 23.2140,
    longitude: 77.4270
  });

  const [paymentMethod, setPaymentMethod] = useState('CONTRACTOR_CREDIT');
  const [isPlacing, setIsPlacing] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(null);

  if (!isOpen) return null;

  // Compute Cart Financials
  const subtotal = cart.reduce((sum, item) => sum + (item.product.discountPrice * item.quantity), 0);
  const gstAmount = Math.round(subtotal * 0.18);
  const deliveryFee = cart.length > 0 ? 450 : 0;
  const totalAmount = subtotal + gstAmount + deliveryFee;

  // Primary vendor from cart
  const primaryVendorId = cart[0]?.product.vendorId || '3267';
  const primaryVendorName = cart[0]?.product.vendorName || 'Sharma Cement Traders';

  // Matched transport partner
  const matchedTransport = transportPartners.find((t) => t.status === 'Available') || transportPartners[0];

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setIsPlacing(true);

    setTimeout(() => {
      const orderItems = cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        brand: item.product.brand,
        category: item.product.category,
        unit: item.product.unit,
        quantity: item.quantity,
        price: item.product.discountPrice,
        total: item.product.discountPrice * item.quantity
      }));

      const newOrder = createOrder({
        customerId: currentUser?.id || '1004',
        customerName: currentUser?.name || 'Rahul Verma',
        customerPhone: currentUser?.phone || '+91 94250 88991',
        deliveryAddress: selectedAddress,
        vendorId: primaryVendorId,
        vendorName: primaryVendorName,
        items: orderItems,
        subtotal,
        gstAmount,
        deliveryFee,
        totalAmount,
        deliveryDeadline: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
        assignedTransport: {
          partnerId: matchedTransport.id,
          companyName: matchedTransport.companyName,
          vehicleType: matchedTransport.vehicleType,
          registrationNo: matchedTransport.registrationNo,
          driverName: matchedTransport.contactPerson,
          contact: matchedTransport.phone,
          eta: "Within 24 Hours (Guaranteed Jobsite Delivery)"
        }
      });

      setIsPlacing(false);
      setOrderConfirmed(newOrder);

      // Confetti celebration!
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.log(err);
      }
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-[#102A43] text-white p-5 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">Checkout & Dispatch Confirmation</h3>
            <p className="text-xs text-slate-300">24-Hour Guaranteed Jobsite Delivery in Bhopal</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-white rounded-xl"
            aria-label="Close Checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If Order is Confirmed */}
        {orderConfirmed ? (
          <div className="p-8 text-center space-y-5 animate-in zoom-in-95">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Order Confirmed Successfully
              </span>
              <h2 className="text-2xl font-black text-[#102A43] mt-1">
                Order #{orderConfirmed.id}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Dispatch request transmitted to <strong>{orderConfirmed.vendorName}</strong>. Assigned vehicle: <strong>{orderConfirmed.assignedTransport?.vehicleType}</strong> ({orderConfirmed.assignedTransport?.registrationNo}).
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-left max-w-md mx-auto space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Total Landed Amount:</span>
                <span className="font-extrabold text-[#102A43]">{formatCurrency(orderConfirmed.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Destination:</span>
                <span className="font-medium text-slate-800">{orderConfirmed.deliveryAddress?.flat}, {orderConfirmed.deliveryAddress?.locality}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Guaranteed Arrival:</span>
                <span className="font-bold text-emerald-600">Within 24 Hours</span>
              </div>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  onOrderPlaced?.(orderConfirmed);
                }}
                className="px-6 py-3 rounded-2xl bg-[#102A43] hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
              >
                Go to Order Tracker
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handlePlaceOrder} className="p-6 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
            
            {/* Customer Details */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
                  <User className="w-4 h-4 text-slate-500" /> Customer & Jobsite Contact
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Demo Client ID: 1004</span>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-1 text-slate-800">
                <div>
                  <span className="text-slate-400 block text-[11px]">Contractor / Name</span>
                  <span className="font-bold">{currentUser?.name || 'Rahul Verma'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Direct Phone</span>
                  <span className="font-bold">{currentUser?.phone || '+91 94250 88991'}</span>
                </div>
              </div>
            </div>

            {/* Delivery Locality Selector */}
            <div className="space-y-2">
              <label className="font-bold text-slate-700 block flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-500" /> Bhopal Jobsite Delivery Address
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {BHOPAL_LOCALITIES.map((loc) => (
                  <div
                    key={loc.name}
                    onClick={() =>
                      setSelectedAddress({
                        ...selectedAddress,
                        locality: loc.name,
                        latitude: loc.lat,
                        longitude: loc.lng
                      })
                    }
                    className={`p-3 rounded-xl border cursor-pointer transition ${
                      selectedAddress.locality === loc.name
                        ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-slate-900">{loc.name}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{loc.description}</div>
                  </div>
                ))}
              </div>

              <input
                type="text"
                value={selectedAddress.flat}
                onChange={(e) => setSelectedAddress({ ...selectedAddress, flat: e.target.value })}
                placeholder="Plot / Villa / Landmark"
                className="w-full mt-2 px-3 py-2 border rounded-xl"
                required
              />
            </div>

            {/* Product Summary */}
            <div className="space-y-2">
              <span className="font-bold text-slate-700 block">Order Summary ({cart.length} item kinds)</span>
              <div className="divide-y divide-slate-100 max-h-36 overflow-y-auto bg-slate-50 p-3 rounded-2xl border border-slate-200">
                {cart.map((item, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800">{item.quantity}x {item.product.name}</span>
                      <div className="text-[10px] text-slate-400">Supplier: {item.product.vendorName}</div>
                    </div>
                    <span className="font-bold text-slate-900">
                      {formatCurrency(item.product.discountPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financials Breakdown */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal (Materials)</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>GST (Estimated 18%)</span>
                <span>{formatCurrency(gstAmount)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Direct Truck Logistics Freight</span>
                <span>{formatCurrency(deliveryFee)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-extrabold text-sm text-[#102A43]">
                <span>Total Amount Payable</span>
                <span className="text-blue-700 text-base">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            {/* Simulated Payment Modes */}
            <div className="space-y-2">
              <span className="font-bold text-slate-700 block">Payment Method (Simulated)</span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div
                  onClick={() => setPaymentMethod('CONTRACTOR_CREDIT')}
                  className={`p-3 rounded-xl border cursor-pointer font-semibold ${
                    paymentMethod === 'CONTRACTOR_CREDIT'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Contractor 30-Day Pay Later (Simulated)
                </div>
                <div
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-3 rounded-xl border cursor-pointer font-semibold ${
                    paymentMethod === 'UPI'
                      ? 'border-blue-600 bg-blue-50 text-blue-800'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  UPI / Instant Bank Pay (Simulated)
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <div className="text-slate-500 text-[11px] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>24h Dispatch Guarantee</span>
              </div>

              <button
                type="submit"
                disabled={isPlacing || cart.length === 0}
                className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/20 transition flex items-center gap-2"
              >
                {isPlacing ? (
                  <span>Transmitting to Yard...</span>
                ) : (
                  <>
                    <span>PLACE ORDER NOW</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
