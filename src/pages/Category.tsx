import { useParams, Link, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import Header from "@/components/Header"
import CategoryNav from "@/components/CategoryNav"
import ProductGrid from "@/components/ProductGrid"
import ContractingOfferings from "@/components/ContractingOfferings"
import Footer from "@/components/Footer"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, Truck, Award, ChevronRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Category Custom Copy & Styling configurations for premium storefront banners
const CATEGORY_STYLES: Record<string, { desc: string; bg: string; accent: string; tagline: string }> = {
  "power-tools": {
    desc: "Industrial-grade high-torque drills, heavy angle grinders, saws, and professional engineering accessory kits.",
    bg: "from-slate-900 via-slate-800 to-amber-950/60",
    accent: "Power Tool Expo",
    tagline: "Up to 40% Off on Global Brands"
  },
  "cement-&-sand": {
    desc: "Premium Grade PPC/OPC building cement, aggregate river sand, structural brickwork aggregates, and high-grade TMT bars.",
    bg: "from-slate-900 via-stone-800 to-amber-900/60",
    accent: "Bulk Construction Supplies",
    tagline: "Direct-from-Plant Factory Rates"
  },
  "electricals": {
    desc: "Havells high-safety house wires, premium modular electrical switches, Distribution Boards, and durable industrial MCBs.",
    bg: "from-slate-900 via-slate-850 to-orange-950/50",
    accent: "Safety Certified Wiring",
    tagline: "Flat 10% Extra Discount on Coils"
  },
  "paints": {
    desc: "Asian Paints Apex Ultima high-gloss exterior emulsions, designer interior wall primers, thinners, and painting equipment.",
    bg: "from-slate-900 via-slate-800 to-yellow-950/40",
    accent: "Premium Coatings & Emulsions",
    tagline: "100% Genuine Weatherproof Color Match"
  },
  "plumbing": {
    desc: "Supreme PVC pressure pipes, Class-3 heavy fittings, water tank connectors, and designer bathroom chrome basin faucets.",
    bg: "from-slate-900 via-slate-800 to-amber-900/40",
    accent: "Leaking Resistant Fixtures",
    tagline: "Architectural Fittings & PVC Columns"
  },
  "safety-equipment": {
    desc: "Durable high-visibility construction helmets, heavy safety goggles, leather hand gloves, and specialized warning ribbons.",
    bg: "from-slate-900 via-slate-800 to-blue-950/40",
    accent: "Site Protection Gear",
    tagline: "Certified ISO Standard Safety Wear"
  },
  "hardware-&-locks": {
    desc: "Godrej multi-lever lock pads, premium brass hinges, tower bolts, architectural handles, and cabinetry accessories.",
    bg: "from-slate-900 via-slate-800 to-emerald-950/30",
    accent: "Secure Locking systems",
    tagline: "Heavy Security Hardware & Brass Fittings"
  }
};

const Category = () => {
  const { categoryName } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const isLoggedIn = !!localStorage.getItem('authToken')


  
  const rawName = categoryName || "products"
  const formattedSlug = rawName.toLowerCase().replace(/\s+/g, '-')
  
  const config = CATEGORY_STYLES[formattedSlug] || {
    desc: `Explore our wide premium selection of heavy-duty ${rawName.replace(/-/g, ' ')} hardware items.`,
    bg: "from-slate-900 via-slate-850 to-amber-950/40",
    accent: "Assured Hardware Supplies",
    tagline: "India's Integrated Construction Portal"
  }

  // Proper Title casing
  const categoryDisplayName = rawName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')


  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <Header />
      <CategoryNav />
      
      {/* 1. Breadcrumbs Navigation */}
      <div className="bg-white border-b py-2 text-left">
        <div className="container mx-auto px-4 md:px-8 flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          <Link to="/" className="hover:text-amber-500 transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-500">Categories</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-amber-600 font-extrabold">{categoryDisplayName}</span>
        </div>
      </div>

      {/* 2. Outstanding Category Showcase Hero Banner */}
      <div className={`relative bg-gradient-to-br ${config.bg} text-white py-12 md:py-16 overflow-hidden border-b`}>
        {/* Background visual spotlight */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_-10%,rgba(245,158,11,0.15),rgba(255,255,255,0))]" />
        
        <div className="container mx-auto px-4 md:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Banner content */}
          <div className="lg:col-span-2 space-y-4 text-left">
            <Badge className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black uppercase text-[9px] tracking-widest px-2.5 py-1 rounded shadow-sm shadow-amber-500/20">
              {config.accent}
            </Badge>
            <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tight leading-tight">
              {categoryDisplayName}
              <br />
              <span className="text-amber-500 text-lg md:text-xl font-black block mt-1 tracking-normal lowercase first-letter:uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500">
                {config.tagline}
              </span>
            </h1>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-semibold max-w-2xl">
              {config.desc}
            </p>
          </div>

          {/* Quick value trust cards */}
          <div className="grid grid-cols-3 lg:grid-cols-1 gap-3 shrink-0">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-2.5 backdrop-blur-sm shadow-sm text-left">
              <Award className="h-5 w-5 text-amber-500 shrink-0" />
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-200">100% Genuine</h4>
                <p className="text-[8px] text-slate-400 font-bold leading-tight">Direct from brand plants</p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-2.5 backdrop-blur-sm shadow-sm text-left">
              <Truck className="h-5 w-5 text-amber-500 shrink-0" />
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-200">Express Delivery</h4>
                <p className="text-[8px] text-slate-400 font-bold leading-tight">Within 24-48 hours max</p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-2.5 backdrop-blur-sm shadow-sm text-left">
              <ShieldCheck className="h-5 w-5 text-amber-500 shrink-0" />
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-200">GharSeKro Checked</h4>
                <p className="text-[8px] text-slate-400 font-bold leading-tight">Assured quality standards</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 3. Upgraded product listing grid or Service Offerings */}
      <main className="flex-1 bg-slate-50">
        {formattedSlug === "service" ? (
          <ContractingOfferings />
        ) : (
          <ProductGrid category={categoryName} />
        )}
      </main>

      <Footer />
    </div>
  )
}

export default Category