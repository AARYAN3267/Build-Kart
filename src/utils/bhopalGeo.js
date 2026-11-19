/**
 * Bhopal Geospatial & Delivery Feasibility Engine
 * Coordinates, Distance calculation & 24-Hour Feasibility Logic
 */

export const BHOPAL_LOCALITIES = [
  { name: "MP Nagar", lat: 23.2325, lng: 77.4326, description: "Central Commercial & Retail Hub" },
  { name: "Arera Colony", lat: 23.2140, lng: 77.4270, description: "Prime Residential & Institutional Belt" },
  { name: "Kolar Road", lat: 23.1895, lng: 77.4190, description: "Rapidly Expanding Residential Corridor" },
  { name: "Hoshangabad Road", lat: 23.1720, lng: 77.4610, description: "Major Highway & Industrial Logistics Strip" },
  { name: "BHEL", lat: 23.2450, lng: 77.4780, description: "Industrial Heavy Engineering & Warehouse Zone" },
  { name: "Ayodhya Bypass", lat: 23.2750, lng: 77.4480, description: "Northern Freight Bypass & Building Materials Hub" }
];

export const BHOPAL_CENTER = [23.2325, 77.4326]; // MP Nagar

/**
 * Calculates great-circle distance between two points in km using Haversine formula
 */
export const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 5.0; // fallback avg distance
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return parseFloat(d.toFixed(1));
};

/**
 * 24-Hour Delivery Feasibility Assessment
 * Analyzes stock, distance, vendor operating status, prep time, and transport availability.
 */
export const evaluateDeliveryFeasibility = ({
  requestedQty = 1,
  availableStock = 0,
  distanceKm = 5,
  vendorDeliveryRadius = 25,
  hasAvailableTransport = true,
  category = "General"
}) => {
  // Case 1: Out of stock
  if (availableStock <= 0) {
    return {
      status: "alternative_required",
      badge: "Alternative Vendor Required",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
      icon: "AlertTriangle",
      is24HrEligible: false,
      estimatedHours: null,
      message: "Current vendor has 0 stock. Joule AI alternative routing required."
    };
  }

  // Case 2: Insufficient stock for requested quantity
  if (availableStock < requestedQty) {
    return {
      status: "approval_required",
      badge: "Revised Delivery Approval Required",
      badgeColor: "bg-purple-100 text-purple-800 border-purple-300",
      icon: "HelpCircle",
      is24HrEligible: false,
      estimatedHours: 48,
      message: `Only ${availableStock} units in stock. Backorder or multi-vendor split required.`
    };
  }

  // Case 3: Distance exceeds delivery radius
  if (distanceKm > vendorDeliveryRadius) {
    return {
      status: "unavailable",
      badge: "24-Hour Delivery Unavailable",
      badgeColor: "bg-rose-100 text-rose-800 border-rose-300",
      icon: "XCircle",
      is24HrEligible: false,
      estimatedHours: null,
      message: `Location (${distanceKm} km) exceeds vendor service radius (${vendorDeliveryRadius} km).`
    };
  }

  // Case 4: No transport ready
  if (!hasAvailableTransport) {
    return {
      status: "approval_required",
      badge: "Transport Queue Scheduled",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
      icon: "Clock",
      is24HrEligible: false,
      estimatedHours: 36,
      message: "Local fleet busy. Next day dispatch queue assigned."
    };
  }

  // Case 5: Feasible within 24 Hours!
  // Calculate estimated arrival hours:
  // Prep time (1-2h) + Transit time (dist / 25kmh + buffer)
  const transitHours = distanceKm / 20; // 20 km/h city average
  const prepHours = requestedQty > 50 ? 2 : 1;
  const totalEstimatedHours = Math.ceil(prepHours + transitHours + 1);

  return {
    status: "eligible",
    badge: "Eligible for 24-Hour Delivery",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    icon: "CheckCircle",
    is24HrEligible: true,
    estimatedHours: totalEstimatedHours <= 24 ? totalEstimatedHours : 24,
    deliveryWindowText: totalEstimatedHours <= 4 ? "Express (Within 4 Hours)" : `Guaranteed Delivery in ${totalEstimatedHours}h`,
    message: `In stock. Dispatched via nearby hub (${distanceKm} km away).`
  };
};
