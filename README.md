# BuildKart AI - Autonomous Construction Commerce Frontend

> **"Your Construction Needs. Local Vendors. Delivered Faster."**

BuildKart AI connects project contractors, builders, and homeowners with verified local construction material vendors across Bhopal, Madhya Pradesh (covering cement, steel, bricks, electrical, plumbing, paints, hardware, tiles, and home improvement).

The platform guarantees eligible jobsite delivery within 24 hours and features an **Autonomous Supply Chain Recovery System** powered by a multi-agent AI architecture (Joule AI) that auto-detects supplier stockouts and dynamically re-routes orders to alternative local yards.

---

## 🔑 Demo Access Credentials (Auto-Role Derivation)

*Note: The application enforces the **Login Page as the FIRST screen** upon opening. No separate role-selection screen is needed; credentials automatically resolve the dashboard and permissions.*

| Role | User ID | Password | Portal Landed | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Vendor Account** | `3267` | `0000` | **Vendor Dashboard** | Ramesh Sharma (Sharma Cement Traders, MP Nagar Zone II, Bhopal) |
| **Client Account** | `1004` | `1234` | **Client Marketplace** | Rahul Verma (Contractor, Villa 14 Green Meadows, Arera Colony, Bhopal) |

*A one-click "Click to Auto-fill" button is provided on the login card for instant demonstration.*

---

## 🛠️ Technology Stack

- **Framework**: React 18 + Vite
- **Routing**: React Router v6 (Role-protected route guards)
- **Styling**: Tailwind CSS (White & Deep Navy `#102A43` theme, Royal Blue `#2563EB`, Emerald Green `#16A34A` accent)
- **Icons**: Lucide React
- **Charts & Telematics**: Recharts
- **Geospatial Mapping**: Leaflet & React-Leaflet (Interactive Bhopal Yard Coordinates)
- **State Management**: Centralized `AppDataContext` synced with browser `localStorage`
- **Celebration Effects**: Canvas Confetti

---

## 📁 Project Architecture & Folder Structure

```
BuildSure/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx                     # Vite root entry
    ├── App.jsx                      # Protected routing & role guards
    ├── index.css                    # Tailwind CSS & scrollbar styling
    ├── context/
    │   ├── AuthContext.jsx          # Session state & credential verification
    │   └── AppDataContext.jsx       # Unified single source of truth (shared by Vendor & Client)
    ├── data/
    │   ├── mockVendors.js           # 10 verified Bhopal suppliers (MP Nagar, Kolar, Arera Colony, BHEL, etc.)
    │   ├── mockProducts.js          # 30+ products across 10 building material categories
    │   ├── mockOrders.js            # 10 orders including spotlight order ORD-BK-8821
    │   ├── mockTransport.js         # 5 transport partners (2-wheelers up to 12-tonne heavy trucks)
    │   └── mockAgents.js            # 7 Autonomous Joule agents with telemetry metrics
    ├── services/
    │   ├── authService.js           # Simulated auth (SAP Cloud Identity ready)
    │   ├── productService.js        # Catalog mutations (SAP Material Master ready)
    │   ├── vendorService.js         # Supplier profiles (SAP Ariba ready)
    │   ├── inventoryService.js      # Shared stock reservation (SAP IBP / MM-IM ready)
    │   ├── orderService.js          # Sales orders (SAP S/4HANA SD / Event Mesh ready)
    │   ├── transportService.js      # Logistics dispatch (SAP TM ready)
    │   ├── jouleService.js          # Conversational & recovery engine (SAP Joule ready)
    │   ├── notificationService.js   # Real-time event notifications
    │   └── analyticsService.js      # Recharts sales rollup (SAP Analytics Cloud ready)
    ├── utils/
    │   ├── formatters.js            # Currency (₹), date & time formatting
    │   └── bhopalGeo.js             # Haversine distance & 24h delivery feasibility logic
    ├── layouts/
    │   ├── VendorLayout.jsx         # Professional enterprise sidebar & quick failure simulator
    │   └── ClientLayout.jsx         # Modern e-commerce layout with Bhopal locality selector
    ├── pages/
    │   ├── Login.jsx                # First screen login card with demo access helpers
    │   ├── vendor/
    │   │   └── VendorDashboard.jsx  # Vendor management portal
    │   └── client/
    │       └── ClientDashboard.jsx  # Customer marketplace dashboard
    └── components/
        ├── common/
        │   ├── NotificationDropdown.jsx
        │   └── DeliveryFeasibilityBadge.jsx
        ├── vendor/
        │   ├── VendorOverview.jsx   # 8 KPI summary cards, Recharts sales velocity, recent orders
        │   ├── VendorProfile.jsx    # Store profile, GSTIN, Bhopal GPS coordinates, edit modal
        │   ├── VendorProducts.jsx   # Catalog cards & table, add/edit/delete, image preview
        │   ├── VendorInventory.jsx  # SKU table, in-stock/low-stock badges, live stock updates
        │   ├── VendorPricing.jsx    # Retail price, bulk discount tiers, MOQ, active toggle
        │   ├── VendorOrders.jsx     # Order actions + "Report Stock Shortage" trigger
        │   ├── VendorTransport.jsx  # Yard fleet management, availability toggle, new vehicle modal
        │   ├── VendorAnalytics.jsx  # Daily/weekly/monthly charts, bestseller commodities
        │   └── AddProductModal.jsx  # Add commodity form modal with image preview
        ├── client/
        │   ├── ClientHome.jsx       # 24h delivery banner, category grid, best deals, popular products
        │   ├── ProductCard.jsx      # Reusable commodity card with feasibility badge
        │   ├── CategoryGrid.jsx     # Visual cards across 8 material categories
        │   ├── VendorDiscovery.jsx  # Cards view + Interactive Leaflet map of Bhopal suppliers
        │   ├── PriceComparison.jsx  # Side-by-side comparison (Best Price, Fastest Delivery, Best Overall)
        │   ├── CartDrawer.jsx       # Multi-vendor cart with quantity steppers & freight calculation
        │   ├── CheckoutModal.jsx    # Address selector, order summary, simulated payment, confirmation
        │   ├── OrderHistory.jsx     # Order list with details and tracking launcher
        │   └── DeliveryTracker.jsx  # 6-stage delivery stepper & assigned transport details
        └── joule/
            ├── JouleAssistantModal.jsx    # Floating AI chatbot with structured responses & suggested prompts
            ├── AgentActivityPanel.jsx     # Multi-Agent status timeline (Requirement, Discovery, Logistics, Recovery)
            └── SupplyChainRecoveryModal.jsx # Centerpiece: Autonomous Failover & Order Re-routing
```

---

## 🌟 Centerpiece Feature: Autonomous Supply Chain Recovery

When a vendor cannot fulfill an order (simulated via the top **"SIMULATE VENDOR FAILURE"** button or when a vendor clicks **"Report Stock Shortage"** on an order):

1. **Failure Anomaly Logged**: Order `ORD-BK-8821` (100 bags UltraTech Cement) is flagged for physical stock shortage.
2. **Joule AI Search**: Joule queries the live shared inventory across alternative Bhopal vendors (e.g. MP Building Materials Co. #8505 with 650 bags available).
3. **Multi-Objective Benchmark**: Compares available stock, unit price (₹372/bag vs ₹375), distance (Ayodhya Bypass vs MP Nagar), and transport availability (Eicher Pro heavy hauler).
4. **Three Customer Actions**:
   - **Approve Alternative**: Transfers order to the replacement vendor, deducts 100 bags from the alternative vendor's shared inventory, reallocates logistics, preserves the 24-hour delivery promise, and fires celebration confetti!
   - **Reject Alternative**: Cancels order.
   - **Choose Another Vendor**: Lets customer pick among other candidate suppliers discovered by Joule.

---

## 🔄 Shared Frontend State Management (Zero Disconnected Copies)

Both the Vendor Portal and Client Marketplace operate on a **single unified `AppDataContext` synced with `localStorage`**:
- **Stock update in Vendor Dashboard** &rarr; Immediately reflected in Client Marketplace, Search, Cart, Price Comparison, and Joule AI.
- **Price or discount edit in Vendor Dashboard** &rarr; Instantly updates Client Price Comparison and Cart.
- **New product added by Vendor** &rarr; Instantly visible in Customer Marketplace catalog.
- **Customer places order at checkout** &rarr; Stock is reserved, and incoming order appears in Vendor Portal.
- **Demo Reset Option**: Under Vendor Dashboard &rarr; Settings, click **"Reset All Demo Data"** to restore clean baseline state anytime.

---

## 🚚 24-Hour Delivery Feasibility Engine

The application evaluates delivery feasibility in real-time based on:
- Product physical stock vs requested quantity
- Vendor distance vs delivery radius (Bhopal localities)
- Vehicle payload capacity (2-wheeler, 3-wheeler, Mini Truck, Pickup, Medium Truck, Heavy Truck)
- Preparation and transit turnaround time

Statuses surfaced:
- `Eligible for 24-Hour Delivery` (Emerald Green badge)
- `Alternative Vendor Required` (Amber badge)
- `Revised Delivery Approval Required` (Purple badge)
- `24-Hour Delivery Unavailable` (Rose badge)

---

## 🔮 Future SAP Integration Points (Architecture Ready)

All service modules in `src/services/` are decoupled with clear integration hooks for enterprise deployment:

| SAP System / Module | Integration Point in Code | Future Production Role |
| :--- | :--- | :--- |
| **SAP BTP Destination Service** | `src/services/authService.js` | Single sign-on (SSO) via SAP Cloud Identity Services |
| **SAP S/4HANA Material Master** | `src/services/productService.js` | Enterprise material master records, SKUs, and pricing conditions |
| **SAP IBP & MM-IM** | `src/services/inventoryService.js` | Integrated business planning, multi-echelon safety stock, and yard inventory |
| **SAP S/4HANA Sales & Distribution** | `src/services/orderService.js` | Sales order creation, billing documents, and delivery scheduling |
| **SAP BTP Event Mesh** | `src/services/notificationService.js` | Asynchronous pub/sub event stream for order status changes and shortage triggers |
| **SAP Transportation Management (TM)** | `src/services/transportService.js` | Vehicle routing, carrier scheduling, freight tendering, and loading optimization |
| **SAP Joule & SAP AI Core** | `src/services/jouleService.js` | Foundation models on SAP BTP GenAI Hub for natural language supply chain intelligence |
| **SAP Analytics Cloud (SAC)** | `src/services/analyticsService.js` | Live CDS view rollups and real-time executive dashboard KPIs |

---

## 🚀 How to Run the Application Locally

### 1. Prerequisites
- **Node.js**: v18+ or v20+ recommended (Node v24 supported)
- **npm** or **pnpm**

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
npm run preview
```

---

## 🧪 Functional Verification Guide

1. **Initial Screen Check**: Verify that opening the site directly opens the **Login Screen**. No dashboards or catalogues are accessible prior to login.
2. **Vendor Login**: Enter `3267` / `0000` (or click "Click to Auto-fill"). Verify redirection to the **Vendor Dashboard**.
3. **Update Inventory**: Go to **Inventory Management**, change Cement stock from `420` to `50`. Open **Pricing Management** and check updated figures.
4. **Logout**: Click **Logout** from sidebar &rarr; Verify redirect back to Login.
5. **Client Login**: Enter `1004` / `1234`. Verify redirection to the **Customer Marketplace**.
6. **Verify Shared Stock**: Observe that Cement stock now shows `50` units in the marketplace and price comparison.
7. **Simulate Autonomous Recovery**: Click the prominent **"SIMULATE VENDOR FAILURE"** button in top header &rarr; Observe Joule AI detect the shortage, formulate the failover plan with MP Building Materials Co., click **"Approve Alternative"** &rarr; Order is recovered, 24h delivery SLA preserved, and celebration confetti fires!
