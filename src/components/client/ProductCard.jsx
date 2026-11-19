import React from 'react';
import { 
  ShoppingBag, 
  Star, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { formatCurrency } from '../../utils/formatters';
import { calculateDistanceKm } from '../../utils/bhopalGeo';
import { DeliveryFeasibilityBadge } from '../common/DeliveryFeasibilityBadge';

export const ProductCard = ({ product, onSelectProduct, onCompareProduct }) => {
  const { addToCart, vendors, activeLocality } = useAppData();

  // Find vendor and calculate distance
  const vendor = vendors.find((v) => v.id === product.vendorId) || {
    name: product.vendorName,
    locality: product.vendorLocality || 'Bhopal',
    rating: 4.8,
    deliveryRadiusKm: 25,
    verified: true
  };

  // Mock distance based on vendor locality vs active locality
  const distanceKm = product.vendorLocality === activeLocality ? 2.5 : 6.8;

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div 
      onClick={() => onSelectProduct?.(product)}
      className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-200 flex flex-col justify-between group cursor-pointer"
    >
      <div>
        {/* Product Image & Badges */}
        <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          <span className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-sm text-[#102A43] text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm">
            {product.category}
          </span>

          <div className="absolute top-2.5 right-2.5">
            <DeliveryFeasibilityBadge
              requestedQty={1}
              availableStock={product.availableQuantity}
              distanceKm={distanceKm}
              vendorDeliveryRadius={vendor.deliveryRadiusKm || 25}
              compact={true}
            />
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-2">
          {/* Brand & Stock */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">
              {product.brand}
            </span>
            <span className={`text-[11px] font-bold ${
              product.availableQuantity > 0 ? 'text-emerald-700' : 'text-rose-600'
            }`}>
              {product.availableQuantity > 0 ? `${product.availableQuantity} in stock` : 'Out of Stock'}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="font-extrabold text-sm text-[#102A43] line-clamp-2 leading-snug group-hover:text-blue-700 transition">
            {product.name}
          </h3>

          {/* Vendor Info */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <div className="flex items-center gap-1 truncate max-w-[170px]">
              <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
              <span className="font-medium truncate">{vendor.name} ({vendor.locality})</span>
            </div>
            <span className="flex items-center gap-0.5 text-amber-500 font-bold flex-shrink-0">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{vendor.rating || 4.8}</span>
            </span>
          </div>

          {/* Pricing */}
          <div className="pt-2 flex items-baseline gap-2">
            <span className="text-xl font-black text-slate-900">
              {formatCurrency(product.discountPrice)}
            </span>
            {product.sellingPrice > product.discountPrice && (
              <span className="text-xs text-slate-400 line-through">
                {formatCurrency(product.sellingPrice)}
              </span>
            )}
            <span className="text-[11px] text-slate-400 ml-auto">
              {product.unit}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCompareProduct?.(product);
          }}
          className="text-xs text-blue-600 hover:text-blue-800 font-bold transition px-2 py-1.5 rounded-lg hover:bg-blue-50"
        >
          Compare Prices
        </button>

        <button
          onClick={handleAdd}
          disabled={product.availableQuantity <= 0}
          className="px-3.5 py-1.5 rounded-xl bg-[#102A43] hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm active:scale-95"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};
