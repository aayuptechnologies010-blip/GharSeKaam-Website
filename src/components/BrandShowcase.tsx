import { useNavigate } from "react-router-dom";
import { Award, CheckCircle, Flame, Sparkles } from "lucide-react";

interface Brand {
  name: string;
  tagline: string;
  color: string;
  bgColor: string;
  logo: React.ReactNode;
}

const BRANDS: Brand[] = [
  {
    name: "Apollo",
    tagline: "Official Piping Partner",
    color: "border-slate-200 hover:border-orange-400 hover:shadow-orange-50/50",
    bgColor: "bg-white",
    logo: (
      <svg className="h-8 max-w-full transition-transform group-hover:scale-105" viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(5, 5)">
          <circle cx="15" cy="15" r="12" stroke="#005691" strokeWidth="2.5" fill="none" strokeDasharray="30 15" />
          <circle cx="15" cy="15" r="7" stroke="#E67E22" strokeWidth="2.5" fill="none" strokeDasharray="15 10" />
          <circle cx="15" cy="15" r="2.5" fill="#005691" />
        </g>
        <text x="40" y="22" fontFamily="Inter, system-ui, sans-serif" fontWeight="900" fontSize="16" fill="#0E2E50" letterSpacing="0.5">APOLLO</text>
        <text x="40" y="32" fontFamily="Inter, system-ui, sans-serif" fontWeight="800" fontSize="9" fill="#E67E22" letterSpacing="2">PIPES</text>
      </svg>
    )
  },
  {
    name: "Hilife",
    tagline: "Premium Bath fittings",
    color: "border-slate-200 hover:border-blue-400 hover:shadow-blue-50/50",
    bgColor: "bg-white",
    logo: (
      <svg className="h-8 max-w-full transition-transform group-hover:scale-105" viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 6C15 6 8 15 8 19C8 23 11 26 15 26C19 26 22 23 22 19C22 15 15 6 15 6Z" fill="#0284C7" />
        <text x="32" y="24" fontFamily="Georgia, serif" fontSize="18" fontWeight="bold" fill="#0F172A" letterSpacing="0.5">Hilife</text>
        <text x="32" y="32" fontFamily="Inter, system-ui, sans-serif" fontWeight="700" fontSize="7.5" fill="#0284C7" letterSpacing="1">BATH FITTINGS</text>
      </svg>
    )
  },
  {
    name: "Metro",
    tagline: "Locks & Architectural Hardware",
    color: "border-slate-200 hover:border-slate-400 hover:shadow-slate-50/50",
    bgColor: "bg-white",
    logo: (
      <svg className="h-8 max-w-full transition-transform group-hover:scale-105" viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(6, 6)" fill="#475569">
          <rect x="5" y="10" width="16" height="12" rx="2" />
          <path d="M8 10V7C8 4.8 9.8 3 12 3C14.2 3 16 4.8 16 7V10" stroke="#475569" strokeWidth="2.5" fill="none" />
          <circle cx="13" cy="15" r="1.5" fill="white" />
          <line x1="13" y1="16.5" x2="13" y2="19.5" stroke="white" strokeWidth="1.5" />
        </g>
        <text x="36" y="23" fontFamily="Impact, Arial Black, sans-serif" fontSize="17" fill="#1E293B" letterSpacing="1">METRO</text>
        <text x="36" y="32" fontFamily="Inter, system-ui, sans-serif" fontWeight="800" fontSize="7.5" fill="#475569" letterSpacing="1">HARDWARE & LOCKS</text>
      </svg>
    )
  },
  {
    name: "Prince",
    tagline: "Drainage Systems & Pipes",
    color: "border-slate-200 hover:border-red-400 hover:shadow-red-50/50",
    bgColor: "bg-white",
    logo: (
      <svg className="h-8 max-w-full transition-transform group-hover:scale-105" viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 24L10 12L15 17L20 12L25 24H5Z" fill="#DC2626" />
        <circle cx="10" cy="10" r="1.5" fill="#DC2626" />
        <circle cx="15" cy="15" r="1.5" fill="#DC2626" />
        <circle cx="20" cy="10" r="1.5" fill="#DC2626" />
        <text x="32" y="22" fontFamily="Impact, Arial Black, sans-serif" fontSize="18" fill="#DC2626" letterSpacing="0.5">PRINCE</text>
        <text x="32" y="32" fontFamily="Inter, system-ui, sans-serif" fontWeight="800" fontSize="7.5" fill="#1E3A8A" letterSpacing="1.5">PIPING SYSTEMS</text>
      </svg>
    )
  },
  {
    name: "Asian",
    tagline: "Paints & Premium Coatings",
    color: "border-slate-200 hover:border-pink-400 hover:shadow-pink-50/50",
    bgColor: "bg-white",
    logo: (
      <svg className="h-9 max-w-full transition-transform group-hover:scale-105" viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(5, 4)">
          <path d="M12 25C17.5228 25 22 20.5228 22 15C22 9.47715 17.5228 5 12 5C6.47715 5 2 9.47715 2 15C2 20.5228 6.47715 25 12 25Z" fill="#E11D48" />
          <path d="M12 20C14.7614 20 17 17.7614 17 15C17 12.2386 14.7614 10 12 10C9.23858 10 7 12.2386 7 15C7 17.7614 9.23858 20 12 20Z" fill="white" />
          <path d="M17 15V30H22V15H17Z" fill="#E67E22" />
          <path d="M2 15C2 17.5 4 21 7 23L4 27C1 24 -1 19 0 15H2Z" fill="#F59E0B" />
        </g>
        <text x="36" y="20" fontFamily="Inter, system-ui, sans-serif" fontWeight="900" fontSize="13" fill="#1E293B">asian</text>
        <text x="73" y="20" fontFamily="Inter, system-ui, sans-serif" fontWeight="400" fontSize="13" fill="#E11D48">paints</text>
        <text x="36" y="30" fontFamily="Inter, system-ui, sans-serif" fontWeight="700" fontSize="6.5" fill="#64748B" letterSpacing="1.5">LEADER IN QUALITY</text>
      </svg>
    )
  },
  {
    name: "Indi-16",
    tagline: "Heavy Duty Iron & Steel",
    color: "border-slate-200 hover:border-amber-500 hover:shadow-amber-50/50",
    bgColor: "bg-white",
    logo: (
      <svg className="h-8 max-w-full transition-transform group-hover:scale-105" viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="5" width="28" height="28" rx="6" fill="#475569" />
        <path d="M10 10L28 28M15 10L28 23M10 15L23 28" stroke="#94A3B8" strokeWidth="2.5" />
        <text x="13" y="23" fontFamily="Inter, system-ui, sans-serif" fontWeight="950" fontSize="12" fill="white">I</text>
        <text x="40" y="22" fontFamily="Inter, system-ui, sans-serif" fontWeight="900" fontSize="15" fill="#0F172A" letterSpacing="0.5">INDI-16</text>
        <text x="40" y="31" fontFamily="Inter, system-ui, sans-serif" fontWeight="800" fontSize="7.5" fill="#475569" letterSpacing="1.5">TMT STEEL REBAR</text>
      </svg>
    )
  },
  {
    name: "Pidilite",
    tagline: "Adhesives & Waterproofing",
    color: "border-slate-200 hover:border-indigo-400 hover:shadow-indigo-50/50",
    bgColor: "bg-white",
    logo: (
      <svg className="h-8 max-w-full transition-transform group-hover:scale-105" viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(5, 5)">
          <path d="M0 15C5 5, 10 5, 15 15C20 25, 25 25, 30 15" stroke="#1D4ED8" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M0 20C5 10, 10 10, 15 20C20 30, 25 30, 30 20" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        </g>
        <text x="42" y="25" fontFamily="Inter, system-ui, sans-serif" fontWeight="900" fontSize="17" fill="#0F172A">Pidilite</text>
      </svg>
    )
  },
  {
    name: "Forever",
    tagline: "Power Tools Accessories",
    color: "border-slate-200 hover:border-amber-400 hover:shadow-amber-50/50",
    bgColor: "bg-white",
    logo: (
      <svg className="h-8 max-w-full transition-transform group-hover:scale-105" viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(6, 6)">
          <circle cx="12" cy="12" r="6" stroke="#F59E0B" strokeWidth="3.5" fill="none" />
          <circle cx="12" cy="12" r="2.5" fill="#F59E0B" />
          <rect x="10.5" y="1" width="3" height="3" fill="#F59E0B" />
          <rect x="10.5" y="20" width="3" height="3" fill="#F59E0B" />
          <rect x="1" y="10.5" width="3" height="3" fill="#F59E0B" />
          <rect x="20" y="10.5" width="3" height="3" fill="#F59E0B" />
        </g>
        <text x="36" y="22" fontFamily="Impact, Arial Black, sans-serif" fontSize="17" fontStyle="italic" fill="#0F172A" letterSpacing="0.5">FOREVER</text>
        <text x="36" y="31" fontFamily="Inter, system-ui, sans-serif" fontWeight="800" fontSize="7.5" fill="#F59E0B" letterSpacing="1">POWER TOOLS ACC.</text>
      </svg>
    )
  },
  {
    name: "R.R. Kabel",
    tagline: "Industrial Wires & Cabling",
    color: "border-slate-200 hover:border-red-400 hover:shadow-red-50/50",
    bgColor: "bg-white",
    logo: (
      <svg className="h-8 max-w-full transition-transform group-hover:scale-105" viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="5" width="28" height="28" rx="14" fill="#E11D48" />
        <path d="M12 24V11H17C19 11 20 12 20 13.5C20 15 19 16 17 16H15.5L18.5 24H14.5L12 18H14.5V14H15.5C16.5 14 17 13.5 17 13C17 12.5 16.5 12 15.5 12H14V24H12Z" fill="white" />
        <path d="M26 24V11H21C19 11 18 12 18 13.5C18 15 19 16 21 16H22.5L19.5 24H23.5L26 18H23.5V14H22.5C21.5 14 21 13.5 21 13C21 12.5 21.5 12 22.5 12H24V24H26Z" fill="white" opacity="0.3" />
        <text x="40" y="24" fontFamily="Inter, system-ui, sans-serif" fontWeight="900" fontSize="15" fill="#1E293B" letterSpacing="0.2">RR KABEL</text>
      </svg>
    )
  },
  {
    name: "Anchor",
    tagline: "Modular Switches & LED Lights",
    color: "border-slate-200 hover:border-cyan-400 hover:shadow-cyan-50/50",
    bgColor: "bg-white",
    logo: (
      <svg className="h-8 max-w-full transition-transform group-hover:scale-105" viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(6, 4)" stroke="#DC2626" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="3" />
          <line x1="12" y1="11" x2="12" y2="26" />
          <line x1="6" y1="16" x2="18" y2="16" />
          <path d="M4 20C4 26 20 26 20 20" />
          <path d="M2 19L4 21L6 19" />
          <path d="M22 19L20 21L18 19" />
        </g>
        <text x="36" y="24" fontFamily="Inter, system-ui, sans-serif" fontWeight="900" fontSize="16" fill="#DC2626" letterSpacing="0.5">ANCHOR</text>
        <text x="36" y="33" fontFamily="Inter, system-ui, sans-serif" fontWeight="600" fontSize="7" fill="#64748B" letterSpacing="0.5">by Panasonic</text>
      </svg>
    )
  }
];

export const BrandShowcase = () => {
  const navigate = useNavigate();

  const handleBrandClick = (brandName: string) => {
    navigate(`/search?brand=${encodeURIComponent(brandName)}`);
  };

  return (
    <section className="py-12 bg-slate-50/50 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-amber-500/5 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10 space-y-10">
        
        {/* Title Section */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider">
            <Sparkles className="h-3 w-3 fill-amber-800" /> Plant Authorized Partnerships
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tight">
            Our Brand Partners
          </h2>
          <p className="text-xs md:text-sm text-slate-500 font-semibold leading-relaxed">
            We partner directly with leading brands to supply authentic hardware products with original warranties at direct-from-plant wholesale rates.
          </p>
        </div>

        {/* Brand Showcase Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left: Apollo Strategic Highlight Card (lg:col-span-5) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950 border border-slate-800 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl text-left group flex flex-col justify-between">
            {/* Ambient orange light */}
            <div className="absolute top-[-10%] right-[-10%] w-60 h-60 rounded-full bg-orange-600/20 blur-[60px] pointer-events-none" />
            
            <div className="space-y-6 relative z-10">
              <div className="flex justify-between items-start">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500 text-slate-950 text-[9px] font-black uppercase tracking-wider">
                  <Flame className="h-3 w-3 text-slate-950 fill-slate-950" /> Strategic Partner
                </div>
                
                {/* White transparent Apollo Logo overlay */}
                <div className="bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/10">
                  <svg className="h-7 w-auto" viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g transform="translate(5, 5)">
                      <circle cx="15" cy="15" r="12" stroke="#ffffff" strokeWidth="2.5" fill="none" strokeDasharray="30 15" />
                      <circle cx="15" cy="15" r="7" stroke="#FF7A00" strokeWidth="2.5" fill="none" strokeDasharray="15 10" />
                      <circle cx="15" cy="15" r="2.5" fill="#ffffff" />
                    </g>
                    <text x="40" y="22" fontFamily="Inter, system-ui, sans-serif" fontWeight="900" fontSize="17" fill="#ffffff" letterSpacing="0.5">APOLLO</text>
                    <text x="40" y="32" fontFamily="Inter, system-ui, sans-serif" fontWeight="800" fontSize="9" fill="#FF7A00" letterSpacing="2">PIPES</text>
                  </svg>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-3xl font-black uppercase tracking-tight flex items-baseline gap-1.5">
                  Apollo <span className="text-sm font-extrabold text-orange-400">Fitting & Pipes</span>
                </h3>
                <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                  We are proud to stand as an authorized distributor of Apollo Fittings and Piping Systems. Get the entire premium catalog of agriculture pipes, plumbing fittings, and column pipes directly sourced from Apollo plants.
                </p>
              </div>

              <div className="space-y-2 border-t border-white/10 pt-4 text-xs font-bold text-slate-200">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-orange-500 shrink-0" />
                  <span>100% Original Apollo Leak-Proof Fittings</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-orange-500 shrink-0" />
                  <span>Direct Plant Prices & Bulk Packing Discounts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-orange-500 shrink-0" />
                  <span>Manufacturer Warranty Included</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleBrandClick("Apollo")}
              className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-slate-950 font-black py-3.5 rounded-2xl text-xs uppercase tracking-widest transition-all hover:scale-102 border-none cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-orange-500/20"
            >
              <Award className="h-4 w-4 text-slate-950" /> View Apollo Fitting Catalog
            </button>
          </div>

          {/* Right: Grid of Brand Badges (lg:col-span-7) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {BRANDS.map((brand) => (
              <div
                key={brand.name}
                onClick={() => handleBrandClick(brand.name)}
                className={`border rounded-2xl p-4 flex flex-col justify-between items-center text-center cursor-pointer shadow-xs hover:shadow-md transition-all duration-300 ${brand.bgColor} ${brand.color} group h-[120px]`}
              >
                <div className="flex-1 flex flex-col justify-center items-center w-full">
                  {brand.logo}
                </div>
                <div className="space-y-0.5 mt-2">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wide group-hover:text-slate-500 transition-colors">
                    {brand.tagline}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
