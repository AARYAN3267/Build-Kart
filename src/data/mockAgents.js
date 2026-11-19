/**
 * Multi-Agent System Definitions for BuildKart AI (Simulated Joule Architecture)
 * Sourced for interactive agent activity dashboard & autonomous recovery pipeline
 */

export const INITIAL_AGENTS = [
  {
    id: "agent-req",
    name: "Requirement Understanding Agent",
    role: "NLP & Intent Resolution",
    description: "Parses user construction specs, calculates bill of quantities (BOQ) and checks material compatibility.",
    status: "Completed",
    lastTask: "Parsed order ORD-BK-8821: 100 bags UltraTech PPC 53 Cement for structural slab casting at Arera Colony.",
    result: "Confidence 99.4% | Matched standard IS:1489 specifications.",
    executionMs: 145,
    timestamp: "2 mins ago"
  },
  {
    id: "agent-ven",
    name: "Vendor Discovery Agent",
    role: "Geospatial Supplier Mapping",
    description: "Filters verified suppliers in Bhopal radius (MP Nagar, Kolar, Arera Colony, Ayodhya Bypass) with active GSTIN.",
    status: "Completed",
    lastTask: "Queried active cement distributors within 25km radius of Arera Colony.",
    result: "Discovered 4 qualified vendors: Sharma Cement, MP Building Materials, Bhopal Steel, Narmada.",
    executionMs: 230,
    timestamp: "1 min ago"
  },
  {
    id: "agent-inv",
    name: "Inventory Analysis Agent",
    role: "Real-time Stock Verification",
    description: "Inspects live supplier ERP inventory, reserved batches, and real-time physical availability.",
    status: "Completed",
    lastTask: "Verified stock levels for 100 bags PPC Cement across qualified local vendors.",
    result: "MP Building Materials (650 bags available), Bhopal Steel (500 bags available).",
    executionMs: 180,
    timestamp: "45s ago"
  },
  {
    id: "agent-prc",
    name: "Procurement Optimization Agent",
    role: "Cost & Commercial Optimization",
    description: "Calculates volume tier discounts, price differences, and net landed price per unit.",
    status: "Completed",
    lastTask: "Benchmarked alternative supplier price vs original order rate.",
    result: "Best Match: MP Building Materials Co. @ ₹372/bag (Net savings: ₹3/bag vs initial ₹375).",
    executionMs: 195,
    timestamp: "30s ago"
  },
  {
    id: "agent-log",
    name: "Logistics Optimization Agent",
    role: "SAP TM Transport Dispatch",
    description: "Assigns closest available heavy/medium transport vehicle matching payload weight and turnaround time.",
    status: "Completed",
    lastTask: "Payload: 5,000 kg (100 bags x 50kg). Matched with Eicher Pro 6-Wheeler or BharatBenz 1217C.",
    result: "Assigned MP Heavy Haulers (TRP-002) - Pickup time 45 mins, Transit 35 mins.",
    executionMs: 310,
    timestamp: "20s ago"
  },
  {
    id: "agent-rec",
    name: "Supply Chain Recovery Agent",
    role: "Autonomous Stock Shortage Resolution",
    description: "Monitors vendor fulfillment signals, auto-detects shortages, and crafts multi-objective recovery alternatives.",
    status: "Waiting",
    lastTask: "Standby monitoring active orders for vendor stock depletion or dispatch delays.",
    result: "No active anomaly detected. Ready to trigger failover pipeline.",
    executionMs: 0,
    timestamp: "Just now"
  },
  {
    id: "agent-cmp",
    name: "Compliance & Approval Agent",
    role: "Governance & Quality Safeguard",
    description: "Ensures brand equivalence, ISI certifications, and customer sign-off prior to order mutations.",
    status: "Completed",
    lastTask: "Verified UltraTech brand guarantee and IS:1489 certificate for failover suppliers.",
    result: "Specification match 100%. Customer approval workflow armed.",
    executionMs: 85,
    timestamp: "Just now"
  }
];
