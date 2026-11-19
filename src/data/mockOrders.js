/**
 * Mock Orders Data
 * Sourced for BuildKart AI Demonstration
 * Ready for future SAP S/4HANA Sales Order / SAP BTP Event Mesh integration
 */

export const INITIAL_ORDERS = [
  {
    id: "ORD-BK-8821", // Spotlight order for Vendor Failure Simulation!
    customerId: "1004", // Demo Client Rahul Verma
    customerName: "Rahul Verma",
    customerPhone: "+91 94250 88991",
    deliveryAddress: {
      flat: "Villa 14, Green Meadows",
      locality: "Arera Colony",
      city: "Bhopal",
      state: "Madhya Pradesh",
      pincode: "462016",
      landmark: "Near Campion School",
      latitude: 23.2140,
      longitude: 77.4270
    },
    vendorId: "3267", // Sharma Cement Traders (Demo Vendor)
    vendorName: "Sharma Cement Traders",
    items: [
      {
        productId: "PROD-CEM-001",
        productName: "UltraTech Weather Pro Cement 50kg",
        brand: "UltraTech",
        category: "Cement",
        unit: "Bag (50 kg)",
        quantity: 100, // 100 bags as requested in the scenario!
        price: 375,
        total: 37500
      }
    ],
    subtotal: 37500,
    gstAmount: 10500,
    deliveryFee: 1200,
    totalAmount: 49200,
    orderDate: "2026-11-19T09:30:00.000Z",
    deliveryDeadline: "2026-11-20T09:30:00.000Z", // 24 Hours!
    status: "Confirmed", // Initial state before failure trigger: Confirmed -> Stock Shortage -> Joule AI Recovery -> Approved
    assignedTransport: {
      partnerId: "TRP-002",
      companyName: "MP Heavy Haulers Freight",
      vehicleType: "Heavy Truck",
      registrationNo: "MP 04 HE 7712",
      driverName: "Gurpreet Singh",
      contact: "+91 98264 88772",
      eta: "Within 24 Hours (Nov 20, 09:30 AM)"
    },
    trackingSteps: [
      { stage: "Order Confirmed", time: "09:30 AM", done: true },
      { stage: "Vendor Preparing", time: "Pending", done: false },
      { stage: "Ready for Pickup", time: "Pending", done: false },
      { stage: "Picked Up", time: "Pending", done: false },
      { stage: "In Transit", time: "Pending", done: false },
      { stage: "Delivered", time: "Pending", done: false }
    ],
    failureReason: null,
    recoveryPlan: null
  },
  {
    id: "ORD-BK-8815",
    customerId: "1004",
    customerName: "Rahul Verma",
    customerPhone: "+91 94250 88991",
    deliveryAddress: {
      flat: "Plot 89, Sector B",
      locality: "Kolar Road",
      city: "Bhopal",
      state: "Madhya Pradesh",
      pincode: "462042",
      landmark: "Near D-Mart",
      latitude: 23.1895,
      longitude: 77.4190
    },
    vendorId: "5202",
    vendorName: "Gupta Electricals & Hardware",
    items: [
      {
        productId: "PROD-ELE-001",
        productName: "Havells Life Line Plus FR-LSH Copper Wire 2.5 sq mm",
        brand: "Havells",
        category: "Electrical",
        unit: "Coil (90m)",
        quantity: 4,
        price: 2650,
        total: 10600
      },
      {
        productId: "PROD-ELE-003",
        productName: "Schneider Electric Acti9 16A Single Pole MCB C-Curve",
        brand: "Schneider",
        category: "Electrical",
        unit: "Piece",
        quantity: 12,
        price: 280,
        total: 3360
      }
    ],
    subtotal: 13960,
    gstAmount: 2512,
    deliveryFee: 180,
    totalAmount: 16652,
    orderDate: "2026-11-18T14:15:00.000Z",
    deliveryDeadline: "2026-11-19T14:15:00.000Z",
    status: "Delivered",
    assignedTransport: {
      partnerId: "TRP-004",
      companyName: "City Rapid Delivery 3-Wheeler",
      vehicleType: "Three-wheeler",
      registrationNo: "MP 04 TR 1120",
      driverName: "Satish Prajapati",
      contact: "+91 98262 66554",
      eta: "Delivered at 01:45 PM"
    },
    trackingSteps: [
      { stage: "Order Confirmed", time: "02:15 PM (Yesterday)", done: true },
      { stage: "Vendor Preparing", time: "03:00 PM (Yesterday)", done: true },
      { stage: "Ready for Pickup", time: "05:30 PM (Yesterday)", done: true },
      { stage: "Picked Up", time: "09:00 AM (Today)", done: true },
      { stage: "In Transit", time: "11:20 AM (Today)", done: true },
      { stage: "Delivered", time: "01:45 PM (Today)", done: true }
    ],
    failureReason: null
  },
  {
    id: "ORD-BK-8819",
    customerId: "1004",
    customerName: "Rahul Verma",
    customerPhone: "+91 94250 88991",
    deliveryAddress: {
      flat: "Villa 14, Green Meadows",
      locality: "Arera Colony",
      city: "Bhopal",
      state: "Madhya Pradesh",
      pincode: "462016",
      landmark: "Near Campion School",
      latitude: 23.2140,
      longitude: 77.4270
    },
    vendorId: "6303",
    vendorName: "City Plumbing Solutions",
    items: [
      {
        productId: "PROD-PLM-001",
        productName: "Astral CPVC PRO Pipe 1-inch (Class 1 SDR 11)",
        brand: "Astral",
        category: "Plumbing",
        unit: "Length (3m / 10ft)",
        quantity: 20,
        price: 385,
        total: 7700
      }
    ],
    subtotal: 7700,
    gstAmount: 1386,
    deliveryFee: 320,
    totalAmount: 9406,
    orderDate: "2026-11-19T08:00:00.000Z",
    deliveryDeadline: "2026-11-19T20:00:00.000Z",
    status: "In Transit",
    assignedTransport: {
      partnerId: "TRP-001",
      companyName: "Bhopal Swift Logistics",
      vehicleType: "Mini Truck",
      registrationNo: "MP 04 GA 3218",
      driverName: "Mahendra Verma",
      contact: "+91 98265 99881",
      eta: "Arriving by 05:30 PM"
    },
    trackingSteps: [
      { stage: "Order Confirmed", time: "08:00 AM", done: true },
      { stage: "Vendor Preparing", time: "09:30 AM", done: true },
      { stage: "Ready for Pickup", time: "11:00 AM", done: true },
      { stage: "Picked Up", time: "01:15 PM", done: true },
      { stage: "In Transit", time: "02:30 PM", done: true },
      { stage: "Delivered", time: "Est. 05:30 PM", done: false }
    ],
    failureReason: null
  },
  {
    id: "ORD-BK-8809",
    customerId: "2001",
    customerName: "Pawan Chhabra (Contractor)",
    customerPhone: "+91 98930 11223",
    deliveryAddress: {
      flat: "Site 12, Bawadiya Kalan",
      locality: "Hoshangabad Road",
      city: "Bhopal",
      state: "Madhya Pradesh",
      pincode: "462026",
      landmark: "Near Aakriti Eco City",
      latitude: 23.1720,
      longitude: 77.4610
    },
    vendorId: "3267",
    vendorName: "Sharma Cement Traders",
    items: [
      {
        productId: "PROD-CEM-002",
        productName: "Ambuja Kawach Waterproof Cement",
        brand: "Ambuja",
        category: "Cement",
        unit: "Bag (50 kg)",
        quantity: 50,
        price: 380,
        total: 19000
      }
    ],
    subtotal: 19000,
    gstAmount: 5320,
    deliveryFee: 850,
    totalAmount: 25170,
    orderDate: "2026-11-19T07:15:00.000Z",
    deliveryDeadline: "2026-11-19T19:15:00.000Z",
    status: "Ready for Pickup",
    assignedTransport: {
      partnerId: "TRP-003",
      companyName: "Kolar Cargo Express",
      vehicleType: "Pickup Truck",
      registrationNo: "MP 04 PB 5491",
      driverName: "Dinesh Malviya",
      contact: "+91 98263 77663",
      eta: "Pickup Scheduled at 03:00 PM"
    },
    trackingSteps: [
      { stage: "Order Confirmed", time: "07:15 AM", done: true },
      { stage: "Vendor Preparing", time: "08:30 AM", done: true },
      { stage: "Ready for Pickup", time: "11:45 AM", done: true },
      { stage: "Picked Up", time: "Pending", done: false },
      { stage: "In Transit", time: "Pending", done: false },
      { stage: "Delivered", time: "Pending", done: false }
    ],
    failureReason: null
  },
  {
    id: "ORD-BK-8804",
    customerId: "2002",
    customerName: "Sanjay Joshi",
    customerPhone: "+91 98931 22334",
    deliveryAddress: {
      flat: "Plot 4, Danish Kunj",
      locality: "Kolar Road",
      city: "Bhopal",
      state: "Madhya Pradesh",
      pincode: "462042",
      landmark: "Near Sarvdharm Bridge",
      latitude: 23.1810,
      longitude: 77.4120
    },
    vendorId: "3267",
    vendorName: "Sharma Cement Traders",
    items: [
      {
        productId: "PROD-CEM-003",
        productName: "ACC Gold Water Shield Cement 50kg",
        brand: "ACC",
        category: "Cement",
        unit: "Bag (50 kg)",
        quantity: 30,
        price: 370,
        total: 11100
      }
    ],
    subtotal: 11100,
    gstAmount: 3108,
    deliveryFee: 650,
    totalAmount: 14858,
    orderDate: "2026-11-18T16:00:00.000Z",
    deliveryDeadline: "2026-11-19T16:00:00.000Z",
    status: "Delivered",
    assignedTransport: {
      partnerId: "TRP-001",
      companyName: "Bhopal Swift Logistics",
      vehicleType: "Mini Truck",
      registrationNo: "MP 04 GA 3218",
      driverName: "Mahendra Verma",
      contact: "+91 98265 99881",
      eta: "Delivered"
    },
    trackingSteps: [
      { stage: "Order Confirmed", time: "04:00 PM (Yesterday)", done: true },
      { stage: "Vendor Preparing", time: "05:30 PM (Yesterday)", done: true },
      { stage: "Ready for Pickup", time: "08:00 AM (Today)", done: true },
      { stage: "Picked Up", time: "10:15 AM (Today)", done: true },
      { stage: "In Transit", time: "11:30 AM (Today)", done: true },
      { stage: "Delivered", time: "01:20 PM (Today)", done: true }
    ],
    failureReason: null
  },
  {
    id: "ORD-BK-8798",
    customerId: "2003",
    customerName: "Rajeev Saxena",
    customerPhone: "+91 98932 33445",
    deliveryAddress: {
      flat: "HIG-22, Shivaji Nagar",
      locality: "MP Nagar",
      city: "Bhopal",
      state: "Madhya Pradesh",
      pincode: "462016",
      landmark: "Near Red Cross Hospital",
      latitude: 23.2325,
      longitude: 77.4326
    },
    vendorId: "4101",
    vendorName: "Bhopal Steel House",
    items: [
      {
        productId: "PROD-STL-001",
        productName: "Tata Tiscon 550D TMT Rebar 12mm",
        brand: "Tata Steel",
        category: "Steel",
        unit: "Piece (12m length)",
        quantity: 40,
        price: 820,
        total: 32800
      }
    ],
    subtotal: 32800,
    gstAmount: 5904,
    deliveryFee: 1500,
    totalAmount: 40204,
    orderDate: "2026-11-18T10:00:00.000Z",
    deliveryDeadline: "2026-11-19T10:00:00.000Z",
    status: "Delivered",
    assignedTransport: {
      partnerId: "TRP-002",
      companyName: "MP Heavy Haulers Freight",
      vehicleType: "Heavy Truck",
      registrationNo: "MP 04 HE 7712",
      driverName: "Gurpreet Singh",
      contact: "+91 98264 88772",
      eta: "Delivered"
    },
    trackingSteps: [
      { stage: "Order Confirmed", time: "10:00 AM (Nov 18)", done: true },
      { stage: "Vendor Preparing", time: "11:30 AM (Nov 18)", done: true },
      { stage: "Ready for Pickup", time: "02:00 PM (Nov 18)", done: true },
      { stage: "Picked Up", time: "04:30 PM (Nov 18)", done: true },
      { stage: "In Transit", time: "06:00 PM (Nov 18)", done: true },
      { stage: "Delivered", time: "09:30 AM (Today)", done: true }
    ],
    failureReason: null
  },
  {
    id: "ORD-BK-8785",
    customerId: "2004",
    customerName: "Meenakshi Rathore",
    customerPhone: "+91 98933 44556",
    deliveryAddress: {
      flat: "E-3/120, Arera Colony",
      locality: "Arera Colony",
      city: "Bhopal",
      state: "Madhya Pradesh",
      pincode: "462016",
      landmark: "Near 10 No. Market",
      latitude: 23.2140,
      longitude: 77.4270
    },
    vendorId: "2808",
    vendorName: "Bharat Paints & Coatings",
    items: [
      {
        productId: "PROD-PNT-001",
        productName: "Asian Paints Apex Ultima Exterior Emulsion 20L",
        brand: "Asian Paints",
        category: "Paint",
        unit: "Bucket (20L)",
        quantity: 3,
        price: 6400,
        total: 19200
      }
    ],
    subtotal: 19200,
    gstAmount: 3456,
    deliveryFee: 350,
    totalAmount: 23006,
    orderDate: "2026-11-17T11:00:00.000Z",
    deliveryDeadline: "2026-11-18T11:00:00.000Z",
    status: "Delivered",
    assignedTransport: {
      partnerId: "TRP-004",
      companyName: "City Rapid Delivery 3-Wheeler",
      vehicleType: "Three-wheeler",
      registrationNo: "MP 04 TR 1120",
      driverName: "Satish Prajapati",
      contact: "+91 98262 66554",
      eta: "Delivered"
    },
    trackingSteps: [
      { stage: "Order Confirmed", time: "11:00 AM (Nov 17)", done: true },
      { stage: "Vendor Preparing", time: "12:30 PM (Nov 17)", done: true },
      { stage: "Ready for Pickup", time: "03:00 PM (Nov 17)", done: true },
      { stage: "Picked Up", time: "04:30 PM (Nov 17)", done: true },
      { stage: "In Transit", time: "05:15 PM (Nov 17)", done: true },
      { stage: "Delivered", time: "06:45 PM (Nov 17)", done: true }
    ],
    failureReason: null
  },
  {
    id: "ORD-BK-8770",
    customerId: "2005",
    customerName: "Govind Narang",
    customerPhone: "+91 98934 55667",
    deliveryAddress: {
      flat: "B-24, Kasturba Nagar",
      locality: "BHEL",
      city: "Bhopal",
      state: "Madhya Pradesh",
      pincode: "462023",
      landmark: "Near Chetak Bridge",
      latitude: 23.2450,
      longitude: 77.4780
    },
    vendorId: "9606",
    vendorName: "Apex Tiles & Sanitary",
    items: [
      {
        productId: "PROD-TIL-001",
        productName: "Kajaria Glazed Vitrified Floor Tile 60x120 cm",
        brand: "Kajaria",
        category: "Tiles",
        unit: "Box (2 pcs / 15.5 sq ft)",
        quantity: 25,
        price: 1250,
        total: 31250
      }
    ],
    subtotal: 31250,
    gstAmount: 5625,
    deliveryFee: 1100,
    totalAmount: 37975,
    orderDate: "2026-11-17T09:00:00.000Z",
    deliveryDeadline: "2026-11-18T09:00:00.000Z",
    status: "Delivered",
    assignedTransport: {
      partnerId: "TRP-001",
      companyName: "Bhopal Swift Logistics",
      vehicleType: "Mini Truck",
      registrationNo: "MP 04 GA 3218",
      driverName: "Mahendra Verma",
      contact: "+91 98265 99881",
      eta: "Delivered"
    },
    trackingSteps: [
      { stage: "Order Confirmed", time: "09:00 AM (Nov 17)", done: true },
      { stage: "Vendor Preparing", time: "10:30 AM (Nov 17)", done: true },
      { stage: "Ready for Pickup", time: "01:00 PM (Nov 17)", done: true },
      { stage: "Picked Up", time: "03:00 PM (Nov 17)", done: true },
      { stage: "In Transit", time: "04:30 PM (Nov 17)", done: true },
      { stage: "Delivered", time: "06:00 PM (Nov 17)", done: true }
    ],
    failureReason: null
  },
  {
    id: "ORD-BK-8762",
    customerId: "2006",
    customerName: "Vijay Pratap",
    customerPhone: "+91 98935 66778",
    deliveryAddress: {
      flat: "Plot 10, Misrod Industrial",
      locality: "Hoshangabad Road",
      city: "Bhopal",
      state: "Madhya Pradesh",
      pincode: "462026",
      landmark: "Near Misrod Flyover",
      latitude: 23.1720,
      longitude: 77.4610
    },
    vendorId: "7404",
    vendorName: "Om Hardware & Paints Store",
    items: [
      {
        productId: "PROD-HDW-001",
        productName: "Bosch GSB 13 RE Professional Impact Drill 600W Kit",
        brand: "Bosch",
        category: "Hardware",
        unit: "Set",
        quantity: 2,
        price: 3799,
        total: 7598
      }
    ],
    subtotal: 7598,
    gstAmount: 1367,
    deliveryFee: 150,
    totalAmount: 9115,
    orderDate: "2026-11-16T15:00:00.000Z",
    deliveryDeadline: "2026-11-17T15:00:00.000Z",
    status: "Delivered",
    assignedTransport: {
      partnerId: "TRP-005",
      companyName: "Speedy Two-Wheeler Couriers",
      vehicleType: "Two-wheeler",
      registrationNo: "MP 04 EV 9081",
      driverName: "Aman Khan",
      contact: "+91 98261 55443",
      eta: "Delivered"
    },
    trackingSteps: [
      { stage: "Order Confirmed", time: "03:00 PM (Nov 16)", done: true },
      { stage: "Vendor Preparing", time: "03:30 PM (Nov 16)", done: true },
      { stage: "Ready for Pickup", time: "04:15 PM (Nov 16)", done: true },
      { stage: "Picked Up", time: "05:00 PM (Nov 16)", done: true },
      { stage: "In Transit", time: "05:30 PM (Nov 16)", done: true },
      { stage: "Delivered", time: "06:30 PM (Nov 16)", done: true }
    ],
    failureReason: null
  },
  {
    id: "ORD-BK-8750",
    customerId: "2007",
    customerName: "Harishankar Tiwari",
    customerPhone: "+91 98936 77889",
    deliveryAddress: {
      flat: "Near Bhanpur Bridge",
      locality: "Ayodhya Bypass",
      city: "Bhopal",
      state: "Madhya Pradesh",
      pincode: "462037",
      landmark: "Opposite People's Hospital",
      latitude: 23.2750,
      longitude: 77.4480
    },
    vendorId: "8505",
    vendorName: "MP Building Materials Co.",
    items: [
      {
        productId: "PROD-BRK-001",
        productName: "Autoclaved High-Density Fly Ash Bricks",
        brand: "MP EcoBlocks",
        category: "Bricks",
        unit: "Pallet (1,000 pcs)",
        quantity: 4,
        price: 5500,
        total: 22000
      }
    ],
    subtotal: 22000,
    gstAmount: 2640,
    deliveryFee: 1600,
    totalAmount: 26240,
    orderDate: "2026-11-16T08:00:00.000Z",
    deliveryDeadline: "2026-11-17T08:00:00.000Z",
    status: "Delivered",
    assignedTransport: {
      partnerId: "TRP-002",
      companyName: "MP Heavy Haulers Freight",
      vehicleType: "Heavy Truck",
      registrationNo: "MP 04 HE 7712",
      driverName: "Gurpreet Singh",
      contact: "+91 98264 88772",
      eta: "Delivered"
    },
    trackingSteps: [
      { stage: "Order Confirmed", time: "08:00 AM (Nov 16)", done: true },
      { stage: "Vendor Preparing", time: "09:30 AM (Nov 16)", done: true },
      { stage: "Ready for Pickup", time: "11:00 AM (Nov 16)", done: true },
      { stage: "Picked Up", time: "01:30 PM (Nov 16)", done: true },
      { stage: "In Transit", time: "02:45 PM (Nov 16)", done: true },
      { stage: "Delivered", time: "04:30 PM (Nov 16)", done: true }
    ],
    failureReason: null
  }
];
