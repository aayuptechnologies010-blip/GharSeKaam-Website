import { useNavigate } from "react-router-dom";
import { ChevronRight, ArrowRight, ShieldCheck, Tag, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getHardwareSvgFallback } from "@/lib/api";

// High-Fidelity Hardware 2x2 Category Grid Data
const HARDWARE_GRID_BOXES = [
  {
    id: "g1",
    title: "Power Tools Specials | Up to 40% Off",
    items: [
      {
        name: "Impact Drills",
        slug: "power-tools",
        image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=250&q=80"
      },
      {
        name: "Angle Grinders",
        slug: "power-tools",
        image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=250&q=80"
      },
      {
        name: "Rotary Hammers",
        slug: "power-tools",
        image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=250&q=80"
      },
      {
        name: "Screwdriver Kits",
        slug: "power-tools",
        image: "https://images.unsplash.com/photo-1608613304899-ea8098577e38?auto=format&fit=crop&w=250&q=80"
      }
    ],
    seeAllText: "Explore Power Tools",
    seeAllLink: "/category/power-tools"
  },
  {
    id: "g2",
    title: "Plumbing & Fittings | Starting ₹199",
    items: [
      {
        name: "Designer Taps",
        slug: "plumbing",
        image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=250&q=80"
      },
      {
        name: "Showerheads",
        slug: "plumbing",
        image: "https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=250&q=80"
      },
      {
        name: "Pressure Pipes",
        slug: "plumbing",
        image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=250&q=80"
      },
      {
        name: "Drainage Joints",
        slug: "plumbing",
        image: "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=250&q=80"
      }
    ],
    seeAllText: "Explore Plumbing",
    seeAllLink: "/category/plumbing"
  },
  {
    id: "g3",
    title: "Electricals & Wiring | Up to 25% Off",
    items: [
      {
        name: "Copper Wires",
        slug: "electricals",
        image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=250&q=80"
      },
      {
        name: "Switch Panels",
        slug: "electricals",
        image: "https://images.unsplash.com/photo-1558211583-d26f610c1eb1?auto=format&fit=crop&w=250&q=80"
      },
      {
        name: "Industrial MCBs",
        slug: "electricals",
        image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=250&q=80"
      },
      {
        name: "LED Panels",
        slug: "electricals",
        image: "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=250&q=80"
      }
    ],
    seeAllText: "Explore Electricals",
    seeAllLink: "/category/electricals"
  },
  {
    id: "g4",
    title: "Contractor Bulk | Direct Plant Rates",
    items: [
      {
        name: "Portland Cement",
        slug: "cement-&-sand",
        image: "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=250&q=80"
      },
      {
        name: "Steel Rebars",
        slug: "cement-&-sand",
        image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=250&q=80"
      },
      {
        name: "River Aggregates",
        slug: "cement-&-sand",
        image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=250&q=80"
      },
      {
        name: "Waterproofing",
        slug: "cement-&-sand",
        image: "https://images.unsplash.com/photo-1595206133361-b1fe343e5e23?auto=format&fit=crop&w=250&q=80"
      }
    ],
    seeAllText: "Shop Bulk Materials",
    seeAllLink: "/wholesale"
  },
  {
    id: "g5",
    title: "Home Security & Hardware | Godrej & more",
    items: [
      {
        name: "Brass Locks",
        slug: "hardware-&-locks",
        image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=250&q=80"
      },
      {
        name: "Door Handles",
        slug: "hardware-&-locks",
        image: "https://images.unsplash.com/photo-1509395062183-67c5ad6faff9?auto=format&fit=crop&w=250&q=80"
      },
      {
        name: "Cabinet Slides",
        slug: "hardware-&-locks",
        image: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=250&q=80"
      },
      {
        name: "Digital Locks",
        slug: "hardware-&-locks",
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=250&q=80"
      }
    ],
    seeAllText: "Explore Security Gear",
    seeAllLink: "/category/hardware-&-locks"
  },
  {
    id: "g6",
    title: "Safety Wear & Gear | ISO Certified",
    items: [
      {
        name: "Safety Helmets",
        slug: "safety-equipment",
        image: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=250&q=80"
      },
      {
        name: "Reflector Vests",
        slug: "safety-equipment",
        image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=250&q=80"
      },
      {
        name: "Leather Gloves",
        slug: "safety-equipment",
        image: "https://images.unsplash.com/photo-1595853035070-59a39fe84de3?auto=format&fit=crop&w=250&q=80"
      },
      {
        name: "Caution Tapes",
        slug: "safety-equipment",
        image: "https://images.unsplash.com/photo-1566908829550-e6551b00979b?auto=format&fit=crop&w=250&q=80"
      }
    ],
    seeAllText: "Shop Safety Wear",
    seeAllLink: "/category/safety-equipment"
  }
];

export const HardwareGrids = () => {
  const navigate = useNavigate();

  return (
    <section className="py-12 bg-slate-100 relative overflow-hidden">
      {/* Decorative ambient spotlight background */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10 space-y-12">
        
        {/* Premium Brands Banner Header Strip */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm text-left">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500 fill-amber-500/10" />
              <h2 className="text-lg md:text-2xl font-black text-slate-800 uppercase tracking-tight">
                GharSeKro Hardware Multi-Item Grids
              </h2>
            </div>
            <p className="text-xs md:text-sm text-slate-500 font-extrabold uppercase tracking-wide">
              Top recommended building components and modular tools curated for contractors
            </p>
          </div>
          
          <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black border-none text-[10px] uppercase tracking-wider py-1.5 px-3.5 shadow flex items-center gap-1 w-max">
            <ShieldCheck className="h-4 w-4 text-slate-950" /> GharSeKro Assured
          </Badge>
        </div>

        {/* 2x2 Multi-Item Card Box Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {HARDWARE_GRID_BOXES.map((box) => (
            <div
              key={box.id}
              className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-[450px] text-left hover-pulse-glow"
            >
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                {/* Box Title */}
                <h3 className="font-black text-slate-800 text-base leading-tight tracking-tight uppercase border-b pb-3">
                  {box.title}
                </h3>

                {/* 2x2 Grid of items */}
                <div className="grid grid-cols-2 gap-4 flex-1 items-center">
                  {box.items.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => navigate(`/category/${item.slug}`)}
                      className="group flex flex-col cursor-pointer text-left space-y-1.5"
                    >
                      {/* Image panel */}
                      <div className="aspect-square bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden flex items-center justify-center p-3 transition-all duration-300 group-hover:border-amber-500/60 group-hover:shadow-md relative">
                        {/* Shimmer sweep effect */}
                        <div className="absolute top-0 -left-16 w-16 h-32 bg-white/10 rotate-12 transition-transform duration-750 group-hover:translate-x-[200%] pointer-events-none" />
                        
                        <img
                          src={item.image}
                          alt=""
                          className="h-full w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.src = getHardwareSvgFallback(item.name);
                          }}
                        />
                      </div>
                      
                      {/* Label */}
                      <span className="text-[10px] font-black text-slate-500 group-hover:text-amber-600 transition-colors uppercase tracking-wide leading-tight line-clamp-1 truncate">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom shop all link */}
              <div 
                onClick={() => navigate(box.seeAllLink)}
                className="text-xs text-amber-600 hover:text-amber-700 font-black uppercase tracking-widest pt-4 border-t border-slate-100 flex items-center gap-1.5 cursor-pointer mt-4 group/link"
              >
                <span>{box.seeAllText}</span>
                <ChevronRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}

          {/* BuildMart Business Ad Banner Box */}
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/80 border border-white/10 p-6 rounded-3xl shadow-xl flex flex-col justify-between h-[450px] text-left text-white relative overflow-hidden group hover-pulse-glow">
            {/* Visual shine sweep */}
            <div className="absolute top-0 -right-24 w-48 h-96 bg-white/5 rotate-12 transition-transform duration-1000 group-hover:translate-x-[-150%] pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-44 h-44 rounded-full bg-amber-500/10 blur-[80px] pointer-events-none" />

            <div className="space-y-4">
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black uppercase tracking-wider shadow shadow-amber-500/20">
                <Tag className="h-3 w-3 text-slate-950 fill-slate-950/10" /> Wholesale Benefit
              </div>
              
              <h3 className="font-black text-2xl uppercase tracking-tight leading-tight">
                Bulk order discounts <br />
                <span className="text-amber-500">+ 10% Cash Back Guarantee</span>
              </h3>
              
              <p className="text-xs text-slate-300 leading-relaxed font-semibold max-w-sm">
                Unlock exclusive business-only prices. Save up to 28% extra with GST input tax credit benefit by registering your business details today.
              </p>
            </div>

            <div className="border-t border-white/10 pt-6 flex flex-col gap-4">
              <div className="flex items-center gap-4 text-xs font-black text-slate-200">
                <span>✔️ Verified Suppliers</span>
                <span>✔️ Tax Savings</span>
              </div>
              <button
                onClick={() => navigate("/profile")}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-3 rounded-2xl shadow-lg shadow-amber-500/20 text-xs uppercase tracking-widest border-none transition-all duration-200 hover:scale-102 cursor-pointer flex items-center justify-center gap-1"
              >
                Create a Free Account <ArrowRight className="h-4.5 w-4.5 text-slate-950" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
