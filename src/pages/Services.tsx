import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  Droplets,
  Layers,
  Flame,
  Wrench,
  Construction,
  Phone,
  MessageCircle,
  Sparkles,
  Shield,
  Star,
  CheckCircle2,
  Clock,
  ArrowRight,
  Info
} from "lucide-react";

interface ServiceItem {
  id: string;
  title: string;
  titleHi: string;
  icon: any;
  rate?: string;
  description: string;
  descriptionHi: string;
  longDescription: string;
  image: string;
  color: string;
  badge: string;
  features: string[];
}

const SERVICES_DATA: ServiceItem[] = [
  {
    id: "boring",
    title: "Nal Boring & Handpump Installation",
    titleHi: "नल गढ़वाना / बोरिंग सेवा",
    icon: Droplets,
    badge: "Most Demanded",
    rate: "Rates on Request",
    description: "Complete water boring, submersible pump fitting, and traditional handpump installations.",
    descriptionHi: "पानी बोरिंग, सबमर्सिबल पंप फिटिंग और पारंपरिक हैंडपंप लगाने की पूरी सेवा।",
    longDescription: "Get complete, hassle-free site-level water boring and pump installations. We deploy heavy casing pipes, drill through robust layers of soil/rock, and fit high-durability submersible pumps or classic manual handpumps. Ideal for residential, commercial, or agricultural sites.",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=600&auto=format&fit=crop",
    color: "from-blue-600 to-sky-500",
    features: [
      "Deep-boring up to 400+ feet",
      "High-grade GI & PVC casing pipes",
      "Submersible pump matching & setup",
      "1 Year operational warranty"
    ]
  },
  {
    id: "soil-filling",
    title: "Soil Filling & Plot Leveling (Mitti Patwana)",
    titleHi: "मिट्टी पटवाना / समतलीकरण",
    icon: Layers,
    badge: "Site Prep",
    rate: "Rates on Request",
    description: "Professional soil delivery, leveling, compaction, and foundation preparation.",
    descriptionHi: "नींव और प्लॉट के लिए मिट्टी की डिलीवरी, समतलीकरण और रोलर कॉम्पैक्शन सेवा।",
    longDescription: "Get high-quality clay or river silt soil delivered in bulk via tractors and trucks to fill and raise your low-lying plot or foundation. Our service includes heavy soil dumping, mechanical leveling, and roller compaction for a rock-solid structural base.",
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=600&auto=format&fit=crop",
    color: "from-amber-600 to-amber-500",
    features: [
      "River silt/clay soil delivery in bulk",
      "Tractor leveling & grader leveling",
      "Compaction with heavy vibratory rollers",
      "Precise site alignment and mapping"
    ]
  },
  {
    id: "brick-kiln",
    title: "Direct Brick Kiln Supply (Eent Bhatta Delivery)",
    titleHi: "ईंट भट्ठा सीधी सप्लाई",
    icon: Flame,
    badge: "Direct Kiln Rate",
    rate: "Rates on Request",
    description: "Direct truckload delivery of premium red clay bricks and fly-ash blocks.",
    descriptionHi: "स्थानीय भट्ठों से सीधे ट्रैक्टर/ट्रक लोड लाल ईंटें और फ्लाई-ऐश ब्लॉक डिलीवरी।",
    longDescription: "Order premium first-class red clay bricks (No. 1 Eent) or high-grade fly-ash cement blocks directly from our partner kilns. Delivered in full tractor or dumper loads straight to your construction site with zero middlemen markup.",
    image: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?q=80&w=600&auto=format&fit=crop",
    color: "from-rose-600 to-orange-500",
    features: [
      "Grade-A solid red clay bricks",
      "Bulk dumper dispatch (2000-5000 units)",
      "Direct kiln wholesale rates",
      "Minimal breakage handling"
    ]
  },
  {
    id: "septic-clean",
    title: "Septic Tank & Sewer Maintenance",
    titleHi: "सेप्टिक टैंक / नाला सफाई",
    icon: Wrench,
    badge: "Urgent Service",
    rate: "Rates on Request",
    description: "Mechanized vacuum pumping, sewer clearing, and high-pressure jet cleaning.",
    descriptionHi: "मशीनीकृत वैक्यूम पंपिंग, सेप्टिक टैंक खाली करना और ड्रेनेज लाइन सफाई।",
    longDescription: "We provide high-power vacuum suction trucks and motorized pipeline cleaning devices to pump out, clean, and clear blockages in domestic septic tanks and complex site drainage structures. Swift, hygienic, and entirely mechanical.",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600&auto=format&fit=crop",
    color: "from-emerald-600 to-teal-500",
    features: [
      "High-power vacuum pumping tankers",
      "Blockage extraction with sewer rods",
      "High-pressure jet washing",
      "Eco-friendly waste disposal"
    ]
  },
  {
    id: "roof-casting",
    title: "Roof Casting & Concrete Lantar",
    titleHi: "छत ढलाई / लेंटर सेवा",
    icon: Construction,
    badge: "Structural",
    rate: "Rates on Request",
    description: "Reinforcement steel laying, shuttering, and mechanized concrete casting.",
    descriptionHi: "छत की ढलाई, शटरिंग लगाने और कंक्रीट मिक्सिंग व फिनिशिंग की पूर्ण सेवा।",
    longDescription: "Get end-to-end support for casting your concrete ceilings/roofs (Lantar). We manage modular steel reinforcing bar placement (TMT wire binding), professional plywood shuttering support, and machine concrete mixing (cement, aggregate, sand) to build a robust structural shell.",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600&auto=format&fit=crop",
    color: "from-purple-600 to-indigo-500",
    features: [
      "Plywood/MS structural shuttering",
      "Rebar placement & structural verification",
      "Mechanized concrete mixture casting",
      "Waterproofing additives integration"
    ]
  }
];

const Services = () => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

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

      {/* Service Grid Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center space-y-2.5 mb-14">
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tight">Available Contracting Offerings</h2>
            <p className="text-sm text-slate-500 font-semibold max-w-md mx-auto">
              Select one of our premium site service specialties below to see configuration details and make direct booking inquiries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES_DATA.map((service, idx) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
                  onClick={() => setSelectedService(service)}
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-50">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute top-3 right-3 bg-amber-500 text-[8px] font-black text-slate-950 px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
                      {service.badge}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2 text-left">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center text-white shadow-md`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-black text-slate-800 leading-tight">
                        {service.title}
                        <span className="block text-xs font-semibold text-slate-400 mt-0.5 font-sans">
                          {service.titleHi}
                        </span>
                      </h3>
                      <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t flex items-center justify-between">
                      <span className="text-[10px] text-amber-600 font-black uppercase tracking-wider">
                        {service.rate}
                      </span>
                      <Button
                        size="sm"
                        className="bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white font-extrabold text-[10px] uppercase rounded-xl h-8 px-4"
                      >
                        View Options <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Service Details & Contact Dialog */}
      <Dialog open={!!selectedService} onOpenChange={(open) => !open && setSelectedService(null)}>
        {selectedService && (
          <DialogContent className="sm:max-w-[500px] rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-2xl p-0 [&>button]:top-5 [&>button]:right-5 [&>button]:bg-slate-100 [&>button]:hover:bg-slate-200 [&>button]:p-1.5 [&>button]:rounded-full [&>button]:transition-all">
            <div className={`h-2 bg-gradient-to-r ${selectedService.color}`} />
            
            <div className="p-6 md:p-8 space-y-6">
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

              <div className="space-y-4 text-left font-sans">
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-semibold text-slate-650 leading-relaxed">
                  {selectedService.longDescription}
                </div>

                <div className="space-y-2">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Included Features</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedService.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                        <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Highly structured contact area */}
                <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 space-y-3.5">
                  <div className="flex items-center gap-2 text-amber-800 text-xs font-black uppercase tracking-wider">
                    <Info className="w-4.5 h-4.5 text-amber-600 shrink-0" />
                    B2B Booking & Inquiry
                  </div>
                  <p className="text-xs text-amber-700 font-semibold leading-relaxed">
                    This service requires custom site measurements and specific aggregate volume quotes. Click below to contact **Aman Traders** directly via phone or WhatsApp.
                  </p>
                  
                  <div className="text-sm text-amber-950 font-black bg-amber-100/60 p-2.5 rounded-xl border border-amber-200/50 text-center tracking-wide">
                    📞 Contact on this number: <a href="tel:+919876543210" className="underline hover:text-amber-800 transition-colors">+91 98765 43210</a>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 pt-1">
                    <a
                      href="tel:+919876543210"
                      className="flex-1 flex items-center justify-center gap-2 font-black text-sm text-white bg-slate-900 hover:bg-slate-800 py-3 rounded-xl shadow-md transition-all border border-transparent"
                    >
                      <Phone className="w-4.5 h-4.5 text-amber-400" />
                      Call Agent
                    </a>
                    <a
                      href={`https://wa.me/919876543210?text=Hello%20Aman%20Traders,%20I%20want%20to%20inquire%20about%20your%20site%20service:%20${encodeURIComponent(selectedService.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 font-black text-sm text-white bg-green-600 hover:bg-green-700 py-3 rounded-xl shadow-md transition-all border border-transparent"
                    >
                      <MessageCircle className="w-4.5 h-4.5 fill-white text-green-600" />
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              <DialogFooter className="border-t pt-4">
                <Button
                  onClick={() => setSelectedService(null)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl"
                >
                  Close
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        )}
      </Dialog>

      <Footer />
    </div>
  );
};

export default Services;
