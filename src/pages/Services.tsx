import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContractingOfferings from "@/components/ContractingOfferings";
import { Sparkles, Shield, Clock, Star } from "lucide-react";
import { motion } from "framer-motion";

const Services = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header />

      {/* Hero Header Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1e3a5f] via-[#1a4f82] to-amber-950/80 py-24 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(245,158,11,0.15),rgba(255,255,255,0))]" />
        <div className="absolute bottom-[-50px] right-[-30px] w-96 h-96 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute top-10 left-10 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto space-y-4"
          >
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-400/25 border border-amber-300/35 text-amber-200 text-[10px] font-black uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 fill-amber-200 text-amber-200" />
              Special Site Contracting Services
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none uppercase">
              Heavy Contracting & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600">
                Site Operations
              </span>
            </h1>
            <p className="text-slate-350 text-sm md:text-base font-semibold max-w-xl mx-auto leading-relaxed">
              Order heavy structural machinery, plot soil fillings, or drill deep water boring. We deliver high-reliability contracting directly with transparent quotes and direct support.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Trust Strip */}
      <div className="bg-[#eaeded] py-4 border-b border-slate-200">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          {[
            { icon: Shield, title: "100% Quality Assurance", desc: "No compromised materials or shortcuts" },
            { icon: Clock, title: "Punctual Delivery", desc: "Scheduled dispatch on your timelines" },
            { icon: Star, title: "Expert Support", desc: "Consult directly with Aman Traders" }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-center gap-3 bg-white p-3.5 rounded-xl border border-slate-250/70 shadow-xs">
              <item.icon className="h-6 w-6 text-amber-500 shrink-0" />
              <div className="text-left">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide leading-tight">{item.title}</h4>
                <p className="text-[10px] text-slate-500 font-bold leading-none mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contracting Offerings Section */}
      <ContractingOfferings />

      <Footer />
    </div>
  );
};

export default Services;
