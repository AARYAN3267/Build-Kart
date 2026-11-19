import React from 'react';
import { ArrowRight } from 'lucide-react';

export const CATEGORIES = [
  {
    id: "Cement",
    name: "Cement & Construction",
    subtitle: "PPC 53, Waterproof, Slag & Rapid Slabs",
    image: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=500&auto=format&fit=crop&q=80",
    badge: "Fast Dispatch"
  },
  {
    id: "Steel",
    name: "Steel & Structural Metal",
    subtitle: "Fe550D TMT, Angles, Beams & Binding Wire",
    image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=500&auto=format&fit=crop&q=80",
    badge: "Direct Mill Rate"
  },
  {
    id: "Electrical",
    name: "Electrical Components",
    subtitle: "FR-LSH Copper Wires, MCBs & Switchgear",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&auto=format&fit=crop&q=80",
    badge: "100% Certified"
  },
  {
    id: "Plumbing",
    name: "Plumbing & Sanitary",
    subtitle: "CPVC/UPVC Pipes, Overhead Tanks & Fittings",
    image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=500&auto=format&fit=crop&q=80",
    badge: "Leak-Proof"
  },
  {
    id: "Paint",
    name: "Paints & Waterproofing",
    subtitle: "Exterior Emulsions, Primers & Polymer Sealants",
    image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=500&auto=format&fit=crop&q=80",
    badge: "7-Year Warranty"
  },
  {
    id: "Tiles",
    name: "Tiles & Flooring",
    subtitle: "Vitrified 60x120, Ceramic & Granite Slabs",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&auto=format&fit=crop&q=80",
    badge: "Italian Finish"
  },
  {
    id: "Hardware",
    name: "Hardware & Tools",
    subtitle: "Impact Drills, High Security Locks & Fasteners",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500&auto=format&fit=crop&q=80",
    badge: "Pro Kit"
  },
  {
    id: "Home Improvement",
    name: "Home Improvement",
    subtitle: "Kitchen Sinks, Diverters, Fixtures & Bath",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop&q=80",
    badge: "Modern Bath"
  }
];

export const CategoryGrid = ({ onSelectCategory }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-[#102A43]">Explore Building Commodities</h2>
          <p className="text-xs text-slate-500">Source certified supplies directly from Bhopal yards</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer h-44 bg-slate-900 border border-slate-200"
          >
            {/* Background Image with Dark Vignette */}
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-60 group-hover:opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent"></div>

            {/* Badge */}
            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#102A43] text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
              {cat.badge}
            </span>

            {/* Content at Bottom */}
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <h3 className="font-extrabold text-sm sm:text-base leading-tight group-hover:text-emerald-400 transition">
                {cat.name}
              </h3>
              <p className="text-[11px] text-slate-300 mt-1 line-clamp-1">
                {cat.subtitle}
              </p>
              <div className="mt-2 text-[10px] font-bold text-emerald-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>View Products</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
