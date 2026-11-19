/**
 * Mock Transport Partners & Logistics Fleet
 * Ready for future SAP Transportation Management (SAP TM) API Integration
 */

export const INITIAL_TRANSPORT_PARTNERS = [
  {
    id: "TRP-001",
    companyName: "Bhopal Swift Logistics",
    contactPerson: "Mahendra Verma",
    phone: "+91 98265 99881",
    vehicleType: "Mini Truck",
    vehicleModel: "Tata Ace Gold Plus (Chhota Hathi)",
    registrationNo: "MP 04 GA 3218",
    capacityKg: 1200,
    capacityCementBags: 24,
    baseFare: 250,
    ratePerKm: 26,
    avgSpeedKmH: 28,
    status: "Available",
    currentLocation: "MP Nagar Zone 1",
    serviceAreas: ["MP Nagar", "Arera Colony", "Kolar Road", "Hoshangabad Road"],
    rating: 4.8,
    assignedOrders: []
  },
  {
    id: "TRP-002",
    companyName: "MP Heavy Haulers Freight",
    contactPerson: "Gurpreet Singh",
    phone: "+91 98264 88772",
    vehicleType: "Heavy Truck",
    vehicleModel: "Eicher Pro 3019 (6-Wheeler)",
    registrationNo: "MP 04 HE 7712",
    capacityKg: 12000,
    capacityCementBags: 240,
    baseFare: 1200,
    ratePerKm: 75,
    avgSpeedKmH: 32,
    status: "Available",
    currentLocation: "Ayodhya Bypass Hub",
    serviceAreas: ["Ayodhya Bypass", "BHEL", "Hoshangabad Road", "Mandideep"],
    rating: 4.9,
    assignedOrders: []
  },
  {
    id: "TRP-003",
    companyName: "Kolar Cargo Express",
    contactPerson: "Dinesh Malviya",
    phone: "+91 98263 77663",
    vehicleType: "Pickup Truck",
    vehicleModel: "Mahindra Bolero Maxi Truck HD",
    registrationNo: "MP 04 PB 5491",
    capacityKg: 2000,
    capacityCementBags: 40,
    baseFare: 450,
    ratePerKm: 34,
    avgSpeedKmH: 30,
    status: "Available",
    currentLocation: "Kolar Road D-Mart",
    serviceAreas: ["Kolar Road", "Arera Colony", "Chuna Bhatti", "Shahpura"],
    rating: 4.7,
    assignedOrders: []
  },
  {
    id: "TRP-004",
    companyName: "City Rapid Delivery 3-Wheeler",
    contactPerson: "Satish Prajapati",
    phone: "+91 98262 66554",
    vehicleType: "Three-wheeler",
    vehicleModel: "Bajaj Maxima C Diesel Loader",
    registrationNo: "MP 04 TR 1120",
    capacityKg: 600,
    capacityCementBags: 12,
    baseFare: 150,
    ratePerKm: 18,
    avgSpeedKmH: 25,
    status: "Available",
    currentLocation: "BHEL Govindpura",
    serviceAreas: ["BHEL", "MP Nagar", "Habibganj", "Indrapuri"],
    rating: 4.6,
    assignedOrders: []
  },
  {
    id: "TRP-005",
    companyName: "Speedy Two-Wheeler Couriers",
    contactPerson: "Aman Khan",
    phone: "+91 98261 55443",
    vehicleType: "Two-wheeler",
    vehicleModel: "Ather Rizta Heavy Commercial EV",
    registrationNo: "MP 04 EV 9081",
    capacityKg: 75,
    capacityCementBags: 1,
    baseFare: 60,
    ratePerKm: 12,
    avgSpeedKmH: 35,
    status: "Available",
    currentLocation: "Arera Colony 10 No. Market",
    serviceAreas: ["Arera Colony", "MP Nagar", "Kolar Road", "Char Imli"],
    rating: 4.9,
    assignedOrders: []
  }
];

export const VEHICLE_TYPES = [
  { type: "Two-wheeler", capacityKg: 75, maxDistanceKm: 15, avgSpeed: 35, icon: "Bike" },
  { type: "Three-wheeler", capacityKg: 600, maxDistanceKm: 25, avgSpeed: 25, icon: "Truck" },
  { type: "Mini Truck", capacityKg: 1200, maxDistanceKm: 35, avgSpeed: 28, icon: "Truck" },
  { type: "Pickup Truck", capacityKg: 2000, maxDistanceKm: 45, avgSpeed: 32, icon: "Truck" },
  { type: "Medium Truck", capacityKg: 5000, maxDistanceKm: 60, avgSpeed: 30, icon: "Truck" },
  { type: "Heavy Truck", capacityKg: 12000, maxDistanceKm: 80, avgSpeed: 32, icon: "Truck" }
];
