import React from 'react';
import { CheckCircle, AlertTriangle, HelpCircle, XCircle, Clock } from 'lucide-react';
import { evaluateDeliveryFeasibility } from '../../utils/bhopalGeo';

export const DeliveryFeasibilityBadge = ({
  requestedQty = 1,
  availableStock = 0,
  distanceKm = 5,
  vendorDeliveryRadius = 25,
  hasAvailableTransport = true,
  category = "General",
  compact = false
}) => {
  const result = evaluateDeliveryFeasibility({
    requestedQty,
    availableStock,
    distanceKm,
    vendorDeliveryRadius,
    hasAvailableTransport,
    category
  });

  const getIcon = () => {
    switch (result.status) {
      case 'eligible':
        return <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />;
      case 'alternative_required':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />;
      case 'approval_required':
        return <HelpCircle className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />;
      default:
        return <XCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />;
    }
  };

  if (compact) {
    return (
      <span
        title={result.message}
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${result.badgeColor}`}
      >
        {getIcon()}
        <span>{result.is24HrEligible ? "24h Guaranteed" : result.badge}</span>
      </span>
    );
  }

  return (
    <div className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${result.badgeColor}`}>
      <div className="flex items-center gap-2">
        {getIcon()}
        <div>
          <div className="font-bold leading-tight">{result.badge}</div>
          <div className="text-[11px] opacity-80 mt-0.5">{result.message}</div>
        </div>
      </div>
      {result.is24HrEligible && (
        <span className="text-[10px] font-mono font-bold bg-white/70 px-2 py-0.5 rounded border border-emerald-300">
          {result.deliveryWindowText}
        </span>
      )}
    </div>
  );
};
