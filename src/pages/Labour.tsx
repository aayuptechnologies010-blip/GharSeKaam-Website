import { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { url } from "@/constant";
import {
  HardHat,
  Zap,
  Droplets,
  PaintBucket,
  Hammer,
  Users,
  Star,
  CheckCircle2,
  Minus,
  Plus,
  Calendar,
  MapPin,
  Phone,
  User,
  ArrowRight,
  Sparkles,
  Shield,
  Clock,
  IndianRupee,
  ChevronDown,
} from "lucide-react";

/* ─── Labour Category Data ─── */
const labourCategories = [
  {
    id: "mason",
    icon: HardHat,
    title: "Mason / राजमिस्त्री",
    subtitle: "Brickwork, Plastering & Flooring",
    rate: 950,
    unit: "per day",
    color: "from-amber-500 to-orange-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    badge: "Most Booked",
    skills: ["Brick laying", "Plastering", "Tile fixing", "Flooring"],
    rating: 4.8,
    reviews: 1240,
  },
  {
    id: "electrician",
    icon: Zap,
    title: "Electrician / इलेक्ट्रिशियन",
    subtitle: "Wiring, Fittings & Panel Work",
    rate: 1100,
    unit: "per day",
    color: "from-yellow-400 to-amber-500",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    badge: "Certified",
    skills: ["House wiring", "Panel installation", "Fitting & fixtures", "Earthing"],
    rating: 4.9,
    reviews: 870,
  },
  {
    id: "plumber",
    icon: Droplets,
    title: "Plumber / प्लम्बर",
    subtitle: "Pipes, Sanitation & Fittings",
    rate: 900,
    unit: "per day",
    color: "from-blue-500 to-sky-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    badge: "Verified",
    skills: ["Pipe fitting", "Sanitary work", "Water tanks", "Drainage"],
    rating: 4.7,
    reviews: 680,
  },
  {
    id: "painter",
    icon: PaintBucket,
    title: "Painter / पेंटर",
    subtitle: "Interior, Exterior & Texture",
    rate: 800,
    unit: "per day",
    color: "from-purple-500 to-violet-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
    badge: "Expert",
    skills: ["Wall painting", "Texture paint", "Polish", "Waterproofing"],
    rating: 4.6,
    reviews: 520,
  },
  {
    id: "carpenter",
    icon: Hammer,
    title: "Carpenter / बढ़ई",
    subtitle: "Doors, Furniture & Shuttering",
    rate: 1000,
    unit: "per day",
    color: "from-rose-500 to-pink-600",
    bg: "bg-rose-50",
    border: "border-rose-200",
    badge: "Skilled",
    skills: ["Door/window fitting", "Furniture work", "Shuttering", "Wood polish"],
    rating: 4.7,
    reviews: 390,
  },
  {
    id: "helper",
    icon: Users,
    title: "General Helper / सामान्य मजदूर",
    subtitle: "Loading, Cleaning & Support",
    rate: 600,
    unit: "per day",
    color: "from-green-500 to-emerald-600",
    bg: "bg-green-50",
    border: "border-green-200",
    badge: "Affordable",
    skills: ["Material loading", "Site cleaning", "Sand mixing", "General support"],
    rating: 4.5,
    reviews: 1850,
  },
];

/* ─── Animation Variants ─── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};
const cardVariants = {
  hidden: { opacity: 0, scale: 0.94, y: 24 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

/* ─── Animated Section Wrapper ─── */
function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Main Labour Page ─── */
const Labour = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState(labourCategories);
  const [selected, setSelected] = useState<any | null>(null);
  const [qty, setQty] = useState(1);
  const [days, setDays] = useState(1);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [bookingStep, setBookingStep] = useState<"form" | "success">("form");
  const [form, setForm] = useState({ name: "", phone: "", address: "", date: "" });
  const [formLoading, setFormLoading] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      const res = await fetch(`${url}/labour/categories`);
      const data = await res.json();
      if (data.success && data.categories) {
        setCategories(prev => prev.map(c => {
          const match = data.categories.find((dbCat: any) => dbCat.categoryId === c.id);
          return match ? { ...c, rate: match.rate } : c;
        }));
      }
    } catch (err) {
      console.warn("Could not fetch live rates from database, running in local fallback mode:", err);
    }
  };

  const totalCost = selected ? selected.rate * qty * days : 0;

  function handleSelectCategory(cat: typeof labourCategories[0]) {
    const currentCat = categories.find(c => c.id === cat.id) || cat;
    setSelected(currentCat);
    setQty(1);
    setDays(1);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
  }

  async function handleBooking(e: React.FormEvent) {
    e.preventDefault();

    if (!form.address.toLowerCase().includes("gorakhpur")) {
      toast({
        title: "Service Not Available",
        description: "Sorry, currently we are not working in your city. We only support bookings in Gorakhpur.",
        variant: "destructive",
      });
      return;
    }

    setFormLoading(true);

    const payload = {
      name: form.name,
      phone: form.phone,
      address: form.address,
      date: form.date,
      days,
      quantity: qty,
      categoryId: selected?.id
    };

    try {
      const res = await fetch(`${url}/labour/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setBookingStep("success");
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      console.error("Labour booking failed:", err);
      toast({
        title: "Booking Failed",
        description: err.message || "Failed to submit booking. Please check backend connection.",
        variant: "destructive"
      });
    } finally {
      setFormLoading(false);
    }
  }

  function resetBooking() {
    setSelected(null);
    setQty(1);
    setDays(1);
    setForm({ name: "", phone: "", address: "", date: "" });
    setBookingStep("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <Header />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1e3a5f] via-[#1a4f82] to-[#f59e0b] min-h-[480px] flex items-center">
        {/* Animated blobs */}
        <motion.div
          className="absolute top-[-80px] right-[-60px] w-[400px] h-[400px] rounded-full bg-amber-400/20 blur-3xl"
          animate={{ scale: [1, 1.15, 1], rotate: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-60px] left-[-40px] w-[300px] h-[300px] rounded-full bg-blue-400/20 blur-3xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        <div className="container mx-auto px-6 md:px-12 py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 border border-amber-300/30 text-amber-200 text-xs font-semibold uppercase tracking-widest mb-6"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Ghar Se Karo — Labour Services
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-5">
              Skilled Workers,
              <br />
              <span className="text-amber-400">Right at Your Site.</span>
            </h1>
            <p className="text-blue-100 text-lg md:text-xl max-w-xl mb-8 leading-relaxed">
              Book verified masons, electricians, plumbers, painters and more — transparent daily rates, no hidden charges, same-day booking.
            </p>

            <div className="flex flex-wrap gap-5 text-sm">
              {[
                { icon: Shield, label: "Verified Workers" },
                { icon: Clock, label: "Same-Day Booking" },
                { icon: IndianRupee, label: "Transparent Rates" },
              ].map(({ icon: Icon, label }) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center gap-2 text-amber-100"
                >
                  <Icon className="w-4 h-4 text-amber-400" />
                  <span className="font-medium">{label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CATEGORY CARDS ── */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 md:px-12">
          <AnimatedSection>
            <motion.div variants={itemVariants} className="text-center max-w-2xl mx-auto mb-14">
              <p className="text-amber-600 font-bold text-xs uppercase tracking-widest mb-3">Choose Your Worker</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4">
                Select a Labour Category
              </h2>
              <p className="text-slate-500 text-base">
                All workers are background-verified, skilled, and insured. Pick the category, set quantity & duration, then confirm your booking.
              </p>
            </motion.div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, i) => {
              const Icon = cat.icon;
              const isExpanded = expandedCard === cat.id;
              const isSelected = selected?.id === cat.id;

              return (
                <motion.div
                  key={cat.id}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className={`bg-white rounded-2xl border-2 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden ${
                    isSelected ? "border-amber-500 shadow-amber-100" : "border-slate-200 hover:border-amber-300"
                  }`}
                >
                  {/* Card Top */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${cat.bg} ${cat.border} border text-slate-700`}>
                        {cat.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-800 mb-1">{cat.title}</h3>
                    <p className="text-sm text-slate-500 mb-3">{cat.subtitle}</p>

                    <div className="flex items-center gap-1 mb-4">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="font-bold text-slate-800 text-sm">{cat.rating}</span>
                      <span className="text-xs text-slate-400">({cat.reviews.toLocaleString()} reviews)</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-black text-slate-900">₹{cat.rate}</span>
                        <span className="text-xs text-slate-400 ml-1">{cat.unit}</span>
                      </div>
                      <button
                        onClick={() => setExpandedCard(isExpanded ? null : cat.id)}
                        className="text-xs text-amber-600 font-semibold flex items-center gap-1 hover:text-amber-700"
                      >
                        Skills
                        <motion.span animate={{ rotate: isExpanded ? 180 : 0 }}>
                          <ChevronDown className="w-3.5 h-3.5" />
                        </motion.span>
                      </button>
                    </div>

                    {/* Skills Dropdown */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-4 border-t border-slate-100 mt-4 flex flex-wrap gap-2">
                            {cat.skills.map((skill) => (
                              <span key={skill} className={`text-xs px-2.5 py-1 rounded-full ${cat.bg} text-slate-700 font-medium`}>
                                {skill}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Book Button */}
                  <motion.button
                    onClick={() => handleSelectCategory(cat)}
                    whileTap={{ scale: 0.97 }}
                    className={`w-full py-3.5 font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                      isSelected
                        ? "bg-amber-500 text-white"
                        : "bg-slate-50 text-slate-700 hover:bg-amber-500 hover:text-white border-t border-slate-100"
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> Selected — Fill Details Below
                      </>
                    ) : (
                      <>
                        Book Now <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── BOOKING FORM ── */}
      <div ref={formRef}>
        <AnimatePresence mode="wait">
          {selected && (
            <motion.section
              key="booking-form"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="py-20 bg-white"
            >
              <div className="container mx-auto px-6 md:px-12">
                <div className="max-w-5xl mx-auto">

                  {/* Section Header */}
                  <div className="text-center mb-12">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.1 }}>
                      <div className={`w-16 h-16 bg-gradient-to-br ${selected.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                        <selected.icon className="w-8 h-8 text-white" />
                      </div>
                    </motion.div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-2">
                      Configure Your Booking
                    </h2>
                    <p className="text-slate-500">
                      You selected <span className="font-bold text-amber-600">{selected.title}</span> — adjust quantity and duration below.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Left: Controls + Form */}
                    <div className="lg:col-span-3 space-y-6">

                      {/* Quantity & Days */}
                      <AnimatePresence>
                        {bookingStep === "form" && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-6"
                          >
                            {/* Worker Count */}
                            <div>
                              <Label className="text-sm font-bold text-slate-700 mb-3 block">Number of Workers</Label>
                              <div className="flex items-center gap-4">
                                <motion.button
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => setQty(Math.max(1, qty - 1))}
                                  className="w-10 h-10 rounded-xl bg-white border-2 border-slate-200 flex items-center justify-center hover:border-amber-400 hover:text-amber-600 transition-colors"
                                >
                                  <Minus className="w-4 h-4" />
                                </motion.button>
                                <motion.span
                                  key={qty}
                                  initial={{ scale: 1.3, color: "#f59e0b" }}
                                  animate={{ scale: 1, color: "#1e293b" }}
                                  className="text-3xl font-black w-12 text-center"
                                >
                                  {qty}
                                </motion.span>
                                <motion.button
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => setQty(Math.min(20, qty + 1))}
                                  className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center hover:bg-amber-600 transition-colors shadow-sm"
                                >
                                  <Plus className="w-4 h-4" />
                                </motion.button>
                                <span className="text-sm text-slate-400">workers (max 20)</span>
                              </div>
                            </div>

                            {/* Days */}
                            <div>
                              <Label className="text-sm font-bold text-slate-700 mb-3 block">Duration (Days)</Label>
                              <div className="flex items-center gap-4">
                                <motion.button
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => setDays(Math.max(1, days - 1))}
                                  className="w-10 h-10 rounded-xl bg-white border-2 border-slate-200 flex items-center justify-center hover:border-amber-400 hover:text-amber-600 transition-colors"
                                >
                                  <Minus className="w-4 h-4" />
                                </motion.button>
                                <motion.span
                                  key={days}
                                  initial={{ scale: 1.3, color: "#f59e0b" }}
                                  animate={{ scale: 1, color: "#1e293b" }}
                                  className="text-3xl font-black w-12 text-center"
                                >
                                  {days}
                                </motion.span>
                                <motion.button
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => setDays(Math.min(365, days + 1))}
                                  className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center hover:bg-amber-600 transition-colors shadow-sm"
                                >
                                  <Plus className="w-4 h-4" />
                                </motion.button>
                                <span className="text-sm text-slate-400">days (max 365)</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Booking Form */}
                      <AnimatePresence mode="wait">
                        {bookingStep === "form" ? (
                          <motion.form
                            key="form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            onSubmit={handleBooking}
                            className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-sm"
                          >
                            <h3 className="font-bold text-slate-800 text-lg">Your Details</h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <Label className="text-sm font-semibold text-slate-600 flex items-center gap-1.5">
                                  <User className="w-3.5 h-3.5" /> Full Name *
                                </Label>
                                <Input
                                  required
                                  placeholder="Eg: Ramesh Kumar"
                                  value={form.name}
                                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                  className="border-slate-200 focus:border-amber-400 focus:ring-amber-400"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <Label className="text-sm font-semibold text-slate-600 flex items-center gap-1.5">
                                  <Phone className="w-3.5 h-3.5" /> Phone Number *
                                </Label>
                                <Input
                                  required
                                  type="tel"
                                  placeholder="+91 98765 43210"
                                  value={form.phone}
                                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                  className="border-slate-200 focus:border-amber-400 focus:ring-amber-400"
                                />
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <Label className="text-sm font-semibold text-slate-600 flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5" /> Site Address *
                              </Label>
                              <Input
                                required
                                placeholder="House No, Street, City, Pincode"
                                value={form.address}
                                onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                                className="border-slate-200 focus:border-amber-400 focus:ring-amber-400"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <Label className="text-sm font-semibold text-slate-600 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" /> Start Date *
                              </Label>
                              <Input
                                required
                                type="date"
                                min={new Date().toISOString().split("T")[0]}
                                value={form.date}
                                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                                className="border-slate-200 focus:border-amber-400 focus:ring-amber-400"
                              />
                            </div>

                            <motion.button
                              type="submit"
                              disabled={formLoading}
                              whileTap={{ scale: 0.97 }}
                              whileHover={{ scale: 1.01 }}
                              className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-base shadow-lg shadow-amber-200 hover:shadow-amber-300 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                              {formLoading ? (
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                />
                              ) : (
                                <>Confirm Booking — ₹{totalCost.toLocaleString()} <ArrowRight className="w-4 h-4" /></>
                              )}
                            </motion.button>
                          </motion.form>
                        ) : (
                          /* ── SUCCESS STATE ── */
                          <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            className="bg-white rounded-2xl border border-green-200 p-10 text-center shadow-sm"
                          >
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                            >
                              <CheckCircle2 className="w-10 h-10 text-green-600" />
                            </motion.div>
                            <h3 className="text-2xl font-extrabold text-slate-800 mb-2">Booking Confirmed! 🎉</h3>
                            <p className="text-slate-500 mb-2 text-sm">
                              Your booking for <span className="font-bold text-amber-600">{qty} × {selected.title}</span> for <span className="font-bold">{days} day{days > 1 ? "s" : ""}</span> has been confirmed.
                            </p>
                            <p className="text-slate-400 text-xs mb-6">Our team will call you on <span className="font-semibold text-slate-600">{form.phone}</span> within 30 minutes to confirm worker assignment.</p>
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Reference No.</span>
                                <span className="font-bold text-slate-800">#GSK-{Date.now().toString().slice(-6)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Total Amount</span>
                                <span className="font-bold text-amber-600">₹{totalCost.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Payment</span>
                                <span className="font-bold text-green-600">Cash on Delivery</span>
                              </div>
                            </div>
                            <Button onClick={resetBooking} className="bg-amber-500 hover:bg-amber-600 text-white font-bold w-full">
                              Book More Workers
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Right: Live Price Summary */}
                    <div className="lg:col-span-2">
                      <motion.div
                        className="sticky top-24 bg-gradient-to-br from-[#1e3a5f] to-[#1a4f82] rounded-2xl p-6 text-white shadow-2xl"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <p className="text-blue-200 text-xs uppercase font-bold tracking-widest mb-4">Live Price Summary</p>

                        <div className={`w-12 h-12 bg-gradient-to-br ${selected.color} rounded-xl flex items-center justify-center mb-4 shadow`}>
                          <selected.icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-bold text-lg text-white mb-1">{selected.title}</h3>
                        <p className="text-blue-300 text-xs mb-6">{selected.subtitle}</p>

                        <div className="space-y-3 text-sm border-t border-blue-700 pt-4">
                          <div className="flex justify-between text-blue-200">
                            <span>Rate per worker</span>
                            <span className="text-white font-semibold">₹{selected.rate}/day</span>
                          </div>
                          <div className="flex justify-between text-blue-200">
                            <span>Workers</span>
                            <span className="text-white font-semibold">× {qty}</span>
                          </div>
                          <div className="flex justify-between text-blue-200">
                            <span>Duration</span>
                            <span className="text-white font-semibold">× {days} day{days > 1 ? "s" : ""}</span>
                          </div>
                        </div>

                        <div className="mt-5 pt-4 border-t border-blue-600">
                          <div className="flex items-end justify-between">
                            <span className="text-blue-200 text-sm">Total Estimate</span>
                            <motion.span
                              key={totalCost}
                              initial={{ scale: 1.2, color: "#fcd34d" }}
                              animate={{ scale: 1, color: "#ffffff" }}
                              className="text-3xl font-black"
                            >
                              ₹{totalCost.toLocaleString()}
                            </motion.span>
                          </div>
                          <p className="text-[11px] text-blue-300 mt-2">+ no hidden charges • Cash on Delivery</p>
                        </div>

                        <div className="mt-6 space-y-2.5">
                          {["Background Verified Workers", "GST Invoice Provided", "30-min Confirmation Call"].map(f => (
                            <div key={f} className="flex items-center gap-2 text-xs text-blue-100">
                              <CheckCircle2 className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                              {f}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {/* ── TRUST STRIP ── */}
      <AnimatedSection>
        <section className="py-16 bg-amber-50 border-y border-amber-100">
          <div className="container mx-auto px-6 md:px-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { icon: Shield, label: "Verified Workers", value: "100%" },
                { icon: Star, label: "Avg. Rating", value: "4.7★" },
                { icon: Users, label: "Workers Deployed", value: "5,000+" },
                { icon: Clock, label: "On-Time Rate", value: "97%" },
              ].map(({ icon: Icon, label, value }, i) => (
                <motion.div key={label} variants={itemVariants} className="space-y-2">
                  <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto">
                    <Icon className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-800">{value}</div>
                  <div className="text-xs text-slate-500 font-medium">{label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      <Footer />
    </div>
  );
};

export default Labour;
