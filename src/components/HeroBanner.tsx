import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Sparkles, Shield, ArrowRight, Truck, Award, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { url } from "@/constant";

const DEFAULT_SLIDES = [
  {
    id: 1,
    badge: "Premium Construction Hub",
    title: "Heavy Building Materials",
    highlight: "Direct From Brand Plants",
    description: "India's first fully integrated hardware e-store. Get high-strength steel rebars, premium aggregate cements, modular wires, and designer faucets delivered directly to your job site.",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format&fit=crop",
    ctaText: "Shop on Wholesale",
    ctaLink: "/wholesale",
  },
  {
    id: 2,
    badge: "Mega Power Tools Sale",
    title: "Get Industrial Grinders",
    highlight: "With Free Toolkits",
    description: "Get premium angle grinders, impact drills, and high-torque drivers from world leaders like Bosch and Dewalt at unbeatable prices.",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop",
    ctaText: "Browse Power Tools",
    ctaLink: "/category/power-tools",
  },
  {
    id: 3,
    badge: "Verified Site Manpower",
    title: "Book Background Checked",
    highlight: "Labour In 30 Minutes",
    description: "Need professional Rajmistries, plumbers, carpenters, or electricians? Book certified workers on fixed, transparent daily rates with full structural assurance.",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop",
    ctaText: "Book Workers Now",
    ctaLink: "/labour",
  }
];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 800 : -800, opacity: 0 }),
  center: {
    x: 0,
    opacity: 1,
    transition: { x: { type: "spring", stiffness: 260, damping: 26 }, opacity: { duration: 0.35 } },
  },
  exit: (dir: number) => ({
    x: dir < 0 ? 800 : -800,
    opacity: 0,
    transition: { x: { type: "spring", stiffness: 260, damping: 26 }, opacity: { duration: 0.35 } },
  }),
};

const HeroBanner = () => {
  const navigate = useNavigate();
  const [index, setIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(0);
  const [slides, setSlides] = useState(DEFAULT_SLIDES);

  // Fetch shop banner images from backend
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const baseUrl = url.replace("/user", "");
        const res = await fetch(`${baseUrl}/user/inventory/shop-images`);
        const data = await res.json();
        if (data.success && Array.isArray(data.images) && data.images.length > 0) {
          const bannerImgs = data.images.filter((img: any) =>
            img.description?.toLowerCase().includes("banner") ||
            img.description?.toLowerCase().includes("offer")
          );
          const toUse = bannerImgs.length > 0 ? bannerImgs : data.images;
          setSlides(
            toUse.slice(0, 5).map((img: any, i: number) => ({
              id: 100 + i,
              badge: img.description || DEFAULT_SLIDES[i % DEFAULT_SLIDES.length].badge,
              title: DEFAULT_SLIDES[i % DEFAULT_SLIDES.length].title,
              highlight: DEFAULT_SLIDES[i % DEFAULT_SLIDES.length].highlight,
              description: DEFAULT_SLIDES[i % DEFAULT_SLIDES.length].description,
              image: img.imageurl,
              ctaText: DEFAULT_SLIDES[i % DEFAULT_SLIDES.length].ctaText,
              ctaLink: DEFAULT_SLIDES[i % DEFAULT_SLIDES.length].ctaLink,
            }))
          );
        }
      } catch {
        // fallback to DEFAULT_SLIDES silently
      }
    };
    fetchBanners();
  }, []);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrev = () => {
    setDirection(-1);
    setIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const currentSlide = slides[index] ?? DEFAULT_SLIDES[0];

  return (
    <div className="relative overflow-hidden w-full bg-slate-950 text-white min-h-[540px] lg:min-h-[580px] flex flex-col justify-between shadow-2xl">

      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(245,158,11,0.18),rgba(255,255,255,0))]" />
      <div className="absolute bottom-10 right-20 w-[450px] h-[450px] rounded-full bg-amber-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute top-10 left-10 w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-[90px] pointer-events-none" />

      {/* Carousel */}
      <div className="w-full relative z-10 py-12 md:py-16 flex-1 flex items-center">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlide.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="container mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
          >
            <div className="space-y-6 text-left">
              <div className="space-y-3">
                <Badge variant="secondary" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-3.5 py-1 rounded-full uppercase tracking-widest text-[9px] flex items-center gap-1.5 w-max shadow-md shadow-amber-500/20">
                  <Sparkles className="h-3.5 w-3.5 fill-sbhailate-950 text-slate-950" /> {currentSlide.badge}
                </Badge>
                <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-tight uppercase">
                  {currentSlide.title}
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 font-black">
                    {currentSlide.highlight}
                  </span>
                </h1>
              </div>

              <p className="text-xs md:text-sm text-slate-300 max-w-lg leading-relaxed font-semibold">
                {currentSlide.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 !text-slate-950 font-black px-8 py-6 rounded-xl shadow-lg shadow-amber-500/25 flex items-center gap-2 group transition-all duration-300 border-none"
                  onClick={() => navigate(currentSlide.ctaLink)}
                >
                  {currentSlide.ctaText}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform text-slate-950" />
                </Button>
              </div>

              <div className="flex items-center gap-8 text-sm pt-5 border-t border-white/10 max-w-md">
                <div className="text-left">
                  <div className="font-black text-xl text-white">5,000+</div>
                  <div className="text-slate-400 text-[9px] font-black uppercase tracking-wider">Site Deliveries</div>
                </div>
                <div className="text-left">
                  <div className="font-black text-xl text-amber-500 flex items-center gap-1">
                    <Shield className="h-4 w-4 text-amber-500 fill-amber-500/10" /> 100%
                  </div>
                  <div className="text-slate-400 text-[9px] font-black uppercase tracking-wider">Quality Assured</div>
                </div>
                <div className="text-left">
                  <div className="font-black text-xl text-white">Same-Day</div>
                  <div className="text-slate-400 text-[9px] font-black uppercase tracking-wider">Direct Dispatch</div>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex justify-center items-center">
              <div className="relative w-full max-w-md aspect-[4/3] rounded-3xl p-3 bg-gradient-to-tr from-amber-500/20 to-transparent border border-white/10 shadow-2xl backdrop-blur-sm group overflow-hidden animate-float">
                <img
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700 shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent rounded-2xl" />
                <div className="absolute bottom-6 left-6 text-left flex items-center gap-2">
                  <span className="text-[9px] bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full font-black uppercase tracking-wider shadow-sm">
                    GharSeKro Certified
                  </span>
                  <span className="text-[9px] bg-slate-950/80 border border-white/15 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shadow-sm backdrop-blur-md">
                    Direct Rates
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 !bg-white/5 hover:!bg-white/15 !text-white hover:!text-amber-500 rounded-full h-11 w-11 transition-all z-20 border border-white/5 hidden md:flex items-center justify-center shadow-lg"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 !bg-white/5 hover:!bg-white/15 !text-white hover:!text-amber-500 rounded-full h-11 w-11 transition-all z-20 border border-white/5 hidden md:flex items-center justify-center shadow-lg"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); }}
            aria-label={`Go to slide ${i + 1}`}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 border-none ${
              i === index ? "bg-amber-500 w-8 shadow-md shadow-amber-500/40" : "bg-white/35 hover:bg-white/60"
            }`}
          />
        ))}
      </div>

      {/* Bottom gradient overlay */}
      <div className="absolute bottom-[72px] left-0 right-0 h-40 bg-gradient-to-t from-[#eaeded] to-transparent pointer-events-none z-10" />

      {/* Value ribbon */}
      <div className="bg-[#eaeded] border-t border-slate-200 relative z-20 w-full py-4 shadow-sm">
        <div className="container mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
          <div className="flex items-center gap-3 text-left bg-white p-3 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
            <Award className="h-6 w-6 text-[#f3a847] shrink-0" />
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-800">Direct Brand plants</h4>
              <p className="text-[9.5px] text-slate-500 font-extrabold leading-tight">100% Sealed Genuine Supplies</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-left bg-white p-3 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
            <Truck className="h-6 w-6 text-[#f3a847] shrink-0" />
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-800">Direct Site Delivery</h4>
              <p className="text-[9.5px] text-slate-500 font-extrabold leading-tight">Dispatch within 24-48 Hours</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-left bg-white p-3 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
            <Sparkles className="h-6 w-6 text-[#f3a847] shrink-0" />
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-800">Tax Savings Enabled</h4>
              <p className="text-[9.5px] text-slate-500 font-extrabold leading-tight">18% GST Input benefit</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-left bg-white p-3 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
            <Users className="h-6 w-6 text-[#f3a847] shrink-0" />
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-800">Registered Labours</h4>
              <p className="text-[9.5px] text-slate-500 font-extrabold leading-tight">Daily wage verified workers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
