import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  Droplets,
  Layers,
  Wrench,
  Phone,
  MessageCircle,
  Sparkles,
  ArrowRight,
  Info,
  CheckCircle
} from "lucide-react";

interface PromoService {
  id: string;
  title: string;
  titleHi: string;
  icon: any;
  description: string;
  descriptionHi: string;
  longDescription: string;
  image: string;
  color: string;
  badge: string;
  features: string[];
}

const PROMO_SERVICES: PromoService[] = [
  {
    id: "boring",
    title: "Nal Boring & Handpump Installation",
    titleHi: "नल गढ़वाना / बोरिंग सेवा",
    icon: Droplets,
    badge: "Most Demanded",
    description: "Complete water boring, submersible pump fitting, and traditional handpump installations.",
    descriptionHi: "पानी बोरिंग, सबमर्सिबल पंप फिटिंग और पारंपरिक हैंडपंप लगाने की पूरी सेवा।",
    longDescription: "Get complete, hassle-free site-level water boring and pump installations. We deploy heavy casing pipes, drill through robust layers of soil/rock, and fit high-durability submersible pumps or classic manual handpumps. Ideal for residential, commercial, or agricultural sites.",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=600&auto=format&fit=crop",
    color: "from-blue-600 to-sky-500",
    features: ["Deep-boring up to 400+ feet", "High-grade GI & PVC casing", "Submersible pump setup"]
  },
  {
    id: "soil-filling",
    title: "Soil Filling & Plot Leveling (Mitti Patwana)",
    titleHi: "मिट्टी पटवाना / समतलीकरण",
    icon: Layers,
    badge: "Site Prep",
    description: "Professional soil delivery, leveling, compaction, and foundation preparation.",
    descriptionHi: "नींव और प्लॉट के लिए मिट्टी की डिलीवरी, समतलीकरण और रोलर कॉम्पैक्शन सेवा।",
    longDescription: "Get high-quality clay or river silt soil delivered in bulk via tractors and trucks to fill and raise your low-lying plot or foundation. Our service includes heavy soil dumping, mechanical leveling, and roller compaction for a rock-solid structural base.",
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=600&auto=format&fit=crop",
    color: "from-amber-600 to-amber-500",
    features: ["River silt/clay delivery", "Tractor leveling", "Heavy roller compaction"]
  },
  {
    id: "septic-clean",
    title: "Septic Tank & Sewer Maintenance",
    titleHi: "सेप्टिक टैंक / नाला सफाई",
    icon: Wrench,
    badge: "Urgent Service",
    description: "Mechanized vacuum pumping, sewer clearing, and high-pressure jet cleaning.",
    descriptionHi: "मशीनीकृत वैक्यूम पंपिंग, सेप्टिक टैंक खाली करना और ड्रेनेज लाइन सफाई।",
    longDescription: "We provide high-power vacuum suction trucks and motorized pipeline cleaning devices to pump out, clean, and clear blockages in domestic septic tanks and complex site drainage structures. Swift, hygienic, and entirely mechanical.",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600&auto=format&fit=crop",
    color: "from-emerald-600 to-teal-500",
    features: ["Vacuum suction tankers", "Sewer blockages clearing", "High-pressure jet washing"]
  }
];

export default function ServicesPromo() {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<PromoService | null>(null);

  const contactNumber = "+919876543210";
  const displayContact = "+91 98765 43210";

  return (
    <section className="py-20 bg-gradient-to-b from-slate-100 to-white relative overflow-hidden">
      {/* Decorative ambient spotlights */}
      <div className="absolute top-1/4 left-1/10 w-80 h-80 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10 text-left">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-800 text-[10px] font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 fill-amber-500/20 text-amber-600" />
              Special Contract Services
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight leading-none uppercase">
              Heavy Site & <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600">
                Contracting Services
              </span>
            </h2>
            <p className="text-slate-500 text-sm md:text-base font-semibold leading-relaxed">
              Drill deep water boring, order plot clay fillings, or hire vacuum septic tankers directly. No brokers, direct support, and fixed transparent estimations.
            </p>
          </div>
          
          <Button
            onClick={() => navigate("/services")}
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase py-6 px-8 rounded-xl shadow-lg flex items-center justify-center gap-2 group transition-all shrink-0 self-start md:self-end"
          >
            View All Services
            <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PROMO_SERVICES.map((service, idx) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                onClick={() => setSelectedService(service)}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                {/* Header Image */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-50 border-b">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className="absolute top-4 right-4 bg-amber-500 text-[8px] font-black text-slate-950 px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
                    {service.badge}
                  </span>
                </div>

                {/* Content Block */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center text-white shadow-md`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-800 leading-tight">
                        {service.title}
                      </h3>
                      <span className="block text-xs font-bold text-amber-600 mt-0.5">
                        {service.titleHi}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                      {service.descriptionHi}
                    </p>
                  </div>

                  {/* Bullet points & action */}
                  <div className="space-y-4 pt-3 border-t">
                    <div className="space-y-1.5">
                      {service.features.slice(0, 2).map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button
                      size="sm"
                      className="w-full bg-slate-100 group-hover:bg-amber-500 text-slate-800 font-black text-[10px] uppercase rounded-xl h-9 hover:bg-amber-500 hover:text-slate-950 border border-slate-200/50"
                    >
                      Book Service <Phone className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Service Contact Dialog */}
      <Dialog open={!!selectedService} onOpenChange={(open) => !open && setSelectedService(null)}>
        {selectedService && (
          <DialogContent className="sm:max-w-[480px] rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-2xl p-0 [&>button]:top-5 [&>button]:right-5 [&>button]:bg-slate-100 [&>button]:hover:bg-slate-200 [&>button]:p-1.5 [&>button]:rounded-full [&>button]:transition-all">
            <div className={`h-2 bg-gradient-to-r ${selectedService.color}`} />
            
            <div className="p-6 sm:p-8 space-y-6">
              <DialogHeader className="text-left space-y-2">
                <div className="flex items-start gap-3 pt-2">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedService.color} flex items-center justify-center text-white shadow shrink-0`}>
                    <selectedService.icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <DialogTitle className="text-lg font-black text-slate-800 leading-snug">
                      {selectedService.title}
                    </DialogTitle>
                    <span className="block text-xs font-bold text-amber-600">
                      {selectedService.titleHi}
                    </span>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-5 text-left font-sans">
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-semibold text-slate-650 leading-relaxed">
                  {selectedService.longDescription}
                </div>

                <div className="space-y-2">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Included Features</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedService.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Area */}
                <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 space-y-3.5">
                  <div className="flex items-center gap-2 text-amber-800 text-xs font-black uppercase tracking-wider">
                    <Info className="w-4.5 h-4.5 text-amber-600 shrink-0" />
                    Direct Booking & Inquiry
                  </div>
                  <p className="text-xs text-amber-700 font-semibold leading-relaxed">
                    This service requires custom measurements. Contact **Aman Traders** directly to book or receive estimates.
                  </p>
                  
                  <div className="text-sm text-amber-950 font-black bg-amber-100/60 p-2.5 rounded-xl border border-amber-200/50 text-center tracking-wide">
                    📞 Contact on this number: <a href={`tel:${contactNumber}`} className="underline hover:text-amber-800 transition-colors">{displayContact}</a>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 pt-1">
                    <a
                      href={`tel:${contactNumber}`}
                      className="flex-1 flex items-center justify-center gap-2 font-black text-xs text-white bg-slate-900 hover:bg-slate-800 py-3 rounded-xl shadow-md transition-all uppercase tracking-wider"
                    >
                      <Phone className="w-4 h-4 text-amber-400" />
                      Call Agent
                    </a>
                    <a
                      href={`https://wa.me/${contactNumber.replace("+", "")}?text=Hello%20Aman%20Traders,%20I%20want%20to%20inquire%20about%20your%20site%20service:%20${encodeURIComponent(selectedService.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 font-black text-xs text-white bg-green-600 hover:bg-green-700 py-3 rounded-xl shadow-md transition-all uppercase tracking-wider"
                    >
                      <MessageCircle className="w-4 h-4 fill-white text-green-600" />
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              <DialogFooter className="border-t pt-4 flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={() => {
                    setSelectedService(null);
                    navigate("/services");
                  }}
                  className="w-full sm:flex-1 bg-amber-500 hover:bg-amber-600 text-white font-extrabold uppercase text-[10px] rounded-xl tracking-wider border-none"
                >
                  View All Options
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedService(null)}
                  className="w-full sm:flex-1 bg-slate-150 hover:bg-slate-200 text-slate-800 font-extrabold uppercase text-[10px] rounded-xl tracking-wider"
                >
                  Close
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
}
