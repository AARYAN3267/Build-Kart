import React, { useState } from 'react';
import { 
  ShoppingBag, 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Truck, 
  Clock, 
  ShieldCheck,
  Building2
} from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { formatCurrency } from '../../utils/formatters';
import { CheckoutModal } from './CheckoutModal';

export const CartDrawer = ({ isOpen, onClose, onOrderPlaced }) => {
  const { cart, removeFromCart, updateCartQuantity, clearCart } = useAppData();
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + (item.product.discountPrice * item.quantity), 0);
  const gstAmount = Math.round(subtotal * 0.18);
  const deliveryFee = cart.length > 0 ? 450 : 0;
  const totalAmount = subtotal + gstAmount + deliveryFee;

  // Group items by vendor to highlight multi-vendor capability
  const itemsByVendor = {};
  cart.forEach((item) => {
    const vName = item.product.vendorName || 'Local Yard';
    if (!itemsByVendor[vName]) itemsByVendor[vName] = [];
    itemsByVendor[vName].push(item);
  });

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <div 
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
            
            {/* Header */}
            <div className="p-5 bg-[#102A43] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base">Your Building Cart</h3>
                  <span className="text-xs text-slate-300">
                    {cart.reduce((s, i) => s + i.quantity, 0)} items ({Object.keys(itemsByVendor).length} supplier{Object.keys(itemsByVendor).length > 1 ? 's' : ''})
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 text-slate-300 hover:text-white rounded-xl transition"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items Stream */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-[#F8FAFC]">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-base text-slate-700">Your cart is empty</h4>
                  <p className="text-xs text-slate-400 max-w-xs">
                    Explore Bhopal verified construction materials, cement, TMT rebar, and electrical supplies.
                  </p>
                </div>
              ) : (
                Object.entries(itemsByVendor).map(([vendorName, items]) => (
                  <div key={vendorName} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
                    {/* Vendor Group Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-blue-700">
                        <Building2 className="w-3.5 h-3.5" />
                        <span>Fulfillment: {vendorName}</span>
                      </div>
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-200">
                        24h Dispatch
                      </span>
                    </div>

                    {/* Products for this vendor */}
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item.product.id} className="flex gap-3 text-xs">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-16 h-16 rounded-xl object-cover border flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <h5 className="font-bold text-slate-800 line-clamp-1">{item.product.name}</h5>
                              <span className="text-[11px] text-slate-400 font-medium">
                                {formatCurrency(item.product.discountPrice)} / {item.product.unit}
                              </span>
                            </div>

                            <div className="flex items-center justify-between mt-2">
                              {/* Quantity Stepper */}
                              <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
                                <button
                                  onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                                  className="p-1 hover:bg-slate-200 text-slate-600 transition"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="px-2 font-bold text-slate-800 text-xs">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                                  className="p-1 hover:bg-slate-200 text-slate-600 transition"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              <span className="font-extrabold text-slate-900">
                                {formatCurrency(item.product.discountPrice * item.quantity)}
                              </span>

                              <button
                                onClick={() => removeFromCart(item.product.id)}
                                className="text-slate-400 hover:text-rose-600 transition p-1"
                                title="Remove item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Checkout Footer */}
            {cart.length > 0 && (
              <div className="p-5 bg-white border-t border-slate-200 space-y-3">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-800">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>GST (Estimated 18%)</span>
                    <span className="font-semibold text-slate-800">{formatCurrency(gstAmount)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Delivery Logistics Freight</span>
                    <span className="font-semibold text-slate-800">{formatCurrency(deliveryFee)}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between font-extrabold text-base text-[#102A43]">
                    <span>Total Amount</span>
                    <span className="text-blue-700">{formatCurrency(totalAmount)}</span>
                  </div>
                </div>

                <button
                  onClick={() => setCheckoutModalOpen(true)}
                  className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-xs shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2"
                >
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        onOrderPlaced={(order) => {
          setCheckoutModalOpen(false);
          onClose();
          onOrderPlaced?.(order);
        }}
      />
    </>
  );
};
