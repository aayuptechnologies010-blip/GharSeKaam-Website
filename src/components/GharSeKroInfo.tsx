import React from "react";
import { 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  GitCompare, 
  CreditCard, 
  Truck, 
  HardHat, 
  MapPin, 
  Activity, 
  DollarSign, 
  Users,
  ShieldCheck,
  TrendingUp,
  Percent
} from "lucide-react";

export const GharSeKroInfo = () => {
  return (
    <section className="py-16 bg-slate-50 overflow-hidden">
      <div className="container mx-auto px-6 sm:px-12 space-y-24">
        
        {/* ================= PROBLEM & SOLUTION CONTAINER ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          
          {/* Problem Card */}
          <div className="bg-red-50/60 border border-red-100 rounded-3xl p-8 md:p-10 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-100/30 rounded-full blur-2xl -mr-10 -mt-10" />
            
            <div className="space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100/80 text-red-700 text-xs font-semibold uppercase tracking-wider">
                <AlertTriangle className="w-3.5 h-3.5" />
                The Problem
              </div>
              
              <div className="space-y-3">
                <h3 className="text-3xl font-extrabold text-red-950 leading-tight">
                  India's Construction Sector Is Broken
                </h3>
                <p className="text-red-800/80 text-base font-medium">
                  Over <span className="font-bold text-red-900">₹12 lakh crore</span> invested annually — yet the market remains deeply fragmented and inefficient.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="space-y-2">
                  <h4 className="font-bold text-red-950 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                    No Price Transparency
                  </h4>
                  <p className="text-sm text-red-800/70">Rates vary wildly between vendors with no benchmarking.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-red-950 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                    Unreliable Delivery
                  </h4>
                  <p className="text-sm text-red-800/70">Delayed materials stall projects and inflate overall construction costs.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-red-950 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                    Zero Vendor Trust
                  </h4>
                  <p className="text-sm text-red-800/70">No verification, background checks, or accountability in the supply chain.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-red-950 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                    Fully Unorganised
                  </h4>
                  <p className="text-sm text-red-800/70">90% of suppliers operate entirely offline with no digital records or tracking.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Solution Card */}
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl p-8 md:p-10 flex flex-col justify-between shadow-lg text-white relative overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-amber-400/30 rounded-full blur-3xl -mb-12 -mr-12" />
            
            <div className="space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-white text-xs font-semibold uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                Our Solution
              </div>
              
              <div className="space-y-3">
                <h3 className="text-3xl font-extrabold leading-tight">
                  One Platform. Everything You Need to Build.
                </h3>
                <p className="text-amber-100 text-base font-medium">
                  Ghar Se Karo is a <span className="font-bold text-white">full-stack construction marketplace</span> — connecting buyers with verified vendors, skilled labour, and reliable logistics in a single seamless experience.
                </p>
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-3 bg-white/10 p-4 rounded-2xl border border-white/10 hover:bg-white/15 transition-all duration-200">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Verified Vendors</h4>
                    <p className="text-xs text-amber-100/90 mt-0.5">Every supplier is thoroughly vetted for quality, authenticity, and reliability.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/10 p-4 rounded-2xl border border-white/10 hover:bg-white/15 transition-all duration-200">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Transparent Pricing</h4>
                    <p className="text-xs text-amber-100/90 mt-0.5">Get real-time rates directly from wholesalers and local vendors with zero hidden charges.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/10 p-4 rounded-2xl border border-white/10 hover:bg-white/15 transition-all duration-200">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Truck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">End-to-End Delivery</h4>
                    <p className="text-xs text-amber-100/90 mt-0.5">Tracked, safe, and lightning-fast logistics layer sending materials directly from warehouse to site.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ================= SERVICES SECTION ================= */}
        <div className="space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 font-semibold px-4 py-1 rounded-full text-xs uppercase tracking-wider">
              Our Services
            </Badge>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800">
              Everything Under One Roof
            </h2>
            <p className="text-slate-500 text-base">
              Say goodbye to juggling multiple suppliers. Ghar Se Karo integrates everything you need to execute your construction projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="bg-white border border-slate-200/60 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
              <div className="space-y-6">
                <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shadow-inner group-hover:scale-105 transition-transform duration-300">
                  <Truck className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-800">Construction Materials</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Cement, steel, sand, bricks, pipes, and tools — sourced from premium verified suppliers at competitive wholesale and retail rates.
                  </p>
                </div>
              </div>
              <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between text-xs text-slate-400">
                <span>Cement, Bricks, Steel & Tools</span>
                <span className="font-semibold text-amber-600">Available</span>
              </div>
            </div>

            {/* Service 2 */}
            <div className="bg-white border border-slate-200/60 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
              <div className="space-y-6">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner group-hover:scale-105 transition-transform duration-300">
                  <HardHat className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-800">Labour Services</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Skilled and semi-skilled workers on demand — experienced masons, certified electricians, plumbers, carpenters, and general site helpers.
                  </p>
                </div>
              </div>
              <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between text-xs text-slate-400">
                <span>Masons, Electricians & Plumbers</span>
                <span className="font-semibold text-blue-600 font-medium">On-Demand</span>
              </div>
            </div>

            {/* Service 3 */}
            <div className="bg-white border border-slate-200/60 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
              <div className="space-y-6">
                <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 shadow-inner group-hover:scale-105 transition-transform duration-300">
                  <Activity className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-800">Fast Delivery</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Same-day and next-day logistics with real-time tracking from warehouse to site, ensuring your construction project never stops.
                  </p>
                </div>
              </div>
              <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between text-xs text-slate-400">
                <span>Hyperlocal Tracked Logistics</span>
                <span className="font-semibold text-green-600 font-medium">Same-Day</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= HOW IT WORKS ================= */}
        <div className="bg-white rounded-3xl border border-slate-200/60 p-8 md:p-12 space-y-12 shadow-sm">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 font-semibold px-4 py-1 rounded-full text-xs uppercase tracking-wider">
              Process
            </Badge>
            <h2 className="text-3xl font-extrabold text-slate-800">
              From Search to Site in Four Steps
            </h2>
            <p className="text-slate-500 text-sm">
              A frictionless procurement journey designed to save contractors, builders, and homeowners days of calling around.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            
            {/* Step 1 */}
            <div className="space-y-4 text-center group relative z-10">
              <div className="w-16 h-16 bg-slate-100 group-hover:bg-amber-100 rounded-full flex items-center justify-center mx-auto transition-colors duration-300 border border-slate-200/60 shadow-sm">
                <Search className="w-6 h-6 text-slate-700 group-hover:text-amber-700 transition-colors duration-300" />
              </div>
              <div className="space-y-1">
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Step 1</div>
                <h4 className="font-bold text-slate-800">Select</h4>
                <p className="text-xs text-slate-500 px-4">Browse our verified catalog of materials or select labour on demand.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-4 text-center group relative z-10">
              <div className="w-16 h-16 bg-slate-100 group-hover:bg-amber-100 rounded-full flex items-center justify-center mx-auto transition-colors duration-300 border border-slate-200/60 shadow-sm">
                <GitCompare className="w-6 h-6 text-slate-700 group-hover:text-amber-700 transition-colors duration-300" />
              </div>
              <div className="space-y-1">
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Step 2</div>
                <h4 className="font-bold text-slate-800">Compare</h4>
                <p className="text-xs text-slate-500 px-4">Compare rates, check reviews, quality grades, and delivery schedules.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="space-y-4 text-center group relative z-10">
              <div className="w-16 h-16 bg-slate-100 group-hover:bg-amber-100 rounded-full flex items-center justify-center mx-auto transition-colors duration-300 border border-slate-200/60 shadow-sm">
                <CreditCard className="w-6 h-6 text-slate-700 group-hover:text-amber-700 transition-colors duration-300" />
              </div>
              <div className="space-y-1">
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Step 3</div>
                <h4 className="font-bold text-slate-800">Order</h4>
                <p className="text-xs text-slate-500 px-4">Check out safely using Cash-on-Delivery (COD) or instant cash payments.</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="space-y-4 text-center group relative z-10">
              <div className="w-16 h-16 bg-slate-100 group-hover:bg-amber-100 rounded-full flex items-center justify-center mx-auto transition-colors duration-300 border border-slate-200/60 shadow-sm">
                <Truck className="w-6 h-6 text-slate-700 group-hover:text-amber-700 transition-colors duration-300" />
              </div>
              <div className="space-y-1">
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Step 4</div>
                <h4 className="font-bold text-slate-800">Delivered</h4>
                <p className="text-xs text-slate-500 px-4">Your order is shipped and tracked live to your doorstep or site.</p>
              </div>
            </div>
            
          </div>
        </div>

        {/* ================= WHY WE WIN ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-4 flex flex-col justify-center">
            <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 font-semibold px-4 py-1 rounded-full text-xs uppercase tracking-wider w-max">
              Why Ghar Se Karo Wins
            </Badge>
            <h2 className="text-3xl font-extrabold text-slate-800 leading-tight">
              Leading the Construction Revolution
            </h2>
            <p className="text-slate-500 text-sm">
              We match local sourcing networks with modern tech integration to bring transparency, efficiency, and scale to building projects.
            </p>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Advantage 1 */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 flex gap-4 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0 text-orange-600">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 text-sm">Local + Digital Model</h4>
                <p className="text-xs text-slate-500">Hyperlocal vendor network powered by a seamless, intuitive digital experience.</p>
              </div>
            </div>

            {/* Advantage 2 */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 flex gap-4 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0 text-indigo-600">
                <Activity className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 text-sm">Faster Supply Chain</h4>
                <p className="text-xs text-slate-500">Proprietary logistics layer reduces traditional material delivery time by up to 40%.</p>
              </div>
            </div>

            {/* Advantage 3 */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 flex gap-4 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0 text-green-600">
                <Percent className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 text-sm">Best-in-Class Pricing</h4>
                <p className="text-xs text-slate-500">Aggregated demand and bulk procurement rates deliver direct 10-15% savings to buyers.</p>
              </div>
            </div>

            {/* Advantage 4 */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 flex gap-4 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center flex-shrink-0 text-rose-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 text-sm">Trust & Verification</h4>
                <p className="text-xs text-slate-500">Every supplier, worker, and order is double-verified to build absolute transaction trust.</p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= TRACTION / METRICS ================= */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -ml-20 -mt-20" />
          
          <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-slate-700/60">
            {/* Stat 1 */}
            <div className="space-y-2 pt-6 lg:pt-0">
              <div className="text-4xl md:text-5xl font-black text-amber-500">500+</div>
              <div className="text-xs text-slate-300 font-bold uppercase tracking-wider">Orders Fulfilled</div>
              <p className="text-[10px] text-slate-400 max-w-[150px] mx-auto">Fulfilled across pilot cities since initial launch.</p>
            </div>

            {/* Stat 2 */}
            <div className="space-y-2 pt-6 lg:pt-0">
              <div className="text-4xl md:text-5xl font-black text-amber-500">120+</div>
              <div className="text-xs text-slate-300 font-bold uppercase tracking-wider">Verified Vendors</div>
              <p className="text-[10px] text-slate-400 max-w-[150px] mx-auto">Active suppliers onboarding catalog daily.</p>
            </div>

            {/* Stat 3 */}
            <div className="space-y-2 pt-6 lg:pt-0">
              <div className="text-4xl md:text-5xl font-black text-amber-500">3</div>
              <div className="text-xs text-slate-300 font-bold uppercase tracking-wider">Cities Live</div>
              <p className="text-[10px] text-slate-400 max-w-[150px] mx-auto font-medium">Expanding to 10 cities by Year 2.</p>
            </div>

            {/* Stat 4 */}
            <div className="space-y-2 pt-6 lg:pt-0">
              <div className="text-4xl md:text-5xl font-black text-amber-500">₹2.4Cr</div>
              <div className="text-xs text-slate-300 font-bold uppercase tracking-wider">GMV (Projected)</div>
              <p className="text-[10px] text-slate-400 max-w-[150px] mx-auto">Target GMV runrate for Year 1.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </span>
  );
};
