import { useEffect, useState, useRef } from "react";
import { Star, Clock, Flame, Percent, ShoppingCart, Minus, Plus, ShieldCheck, Truck, Receipt, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useCartContext } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { getHardwareSvgFallback, getProducts, ApiProduct } from "@/lib/api";

// E-commerce 3-Column Promo Banners Block Data
const PROMO_BANNERS = [
  {
    id: "p1",
    tag: "COMBO SAVER",
    title: "Cement & Steel aggregate bundle",
    desc: "Flat ₹800 discount on 50+ cement bags + 10 TMT rods purchase.",
    cta: "View Combo Details",
    link: "/category/cement-&-sand",
    bgGradient: "from-amber-500 via-amber-600 to-amber-700",
    textCol: "text-slate-950 hover:bg-slate-900 hover:text-white"
  },
  {
    id: "p2",
    tag: "POWER HOUR OFFER",
    title: "Bosch Drills Accessories Toolkit",
    desc: "Get an extra 15-piece screwdriver set free with any professional drill machine.",
    cta: "Grab Toolkit Now",
    link: "/category/power-tools",
    bgGradient: "from-slate-950 via-slate-900 to-slate-800",
    textCol: "text-white bg-amber-500 hover:bg-amber-600 text-slate-950 border-none"
  },
  {
    id: "p3",
    tag: "CONTRACTOR CORNER",
    title: "GST Billing & 18% Input Credit",
    desc: "Verify your GSTIN on sign-up to unlock exclusive bulk tax rebates instantly.",
    cta: "Register GSTIN",
    link: "/profile",
    bgGradient: "from-amber-950 via-slate-950 to-slate-900",
    textCol: "text-amber-500 border-amber-500/30 hover:bg-amber-500 hover:text-slate-950"
  }
];

export const DealsSection = () => {
  const navigate = useNavigate();
  const { cartItems, addToCart, removeFromCart, updateQuantity } = useCartContext();
  const { toast } = useToast();
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const isLoggedIn = !!localStorage.getItem('authToken');

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 340;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);
        const allProducts = await getProducts();
        
        const userType = localStorage.getItem('userType');
        const isWholesaler = userType === 'WHOLESALER';
        const viewingWholesale = isWholesaler || !!sessionStorage.getItem('wholesaleGST');
        
        const filtered = allProducts.filter((product) => {
          const avail = product.availability;
          if (!avail) return true;
          
          // Treat legacy/unknown values (like "In Stock") as visible to everyone
          if (avail !== 'RETAILER' && avail !== 'WHOLESALE' && avail !== 'WHOLESALER' && avail !== 'BOTH') {
            return true;
          }
          
          if (avail === 'BOTH') return true;
          if (viewingWholesale) return avail === 'WHOLESALE' || avail === 'WHOLESALER';
          return avail === 'RETAILER';
        });

        const mapped = filtered.slice(0, 8).map((p, index) => {
          const basePrice = parseFloat(p.retailprice || "0");
          const discountPercent = p.discount || 15 + (index % 3) * 5;
          const dealPrice = Math.round(basePrice * (1 - discountPercent / 100));
          return {
            id: p.id,
            title: p.title,
            basePrice: basePrice,
            dealPrice: dealPrice,
            discount: Math.round(discountPercent),
            rating: 4.0 + (p.title.length % 11) / 10,
            reviews: 50 + (p.title.length % 300),
            claimed: 30 + (p.title.length % 60),
            image: p.images && p.images.length > 0 ? p.images[0] : "",
            category: p.category?.title || "Hardware",
            brand: p.title.split(" ")[0].toUpperCase(),
            stockLeft: p.currentQty || 5
          };
        });
        setDeals(mapped);
      } catch (err) {
        console.error("Failed to load deals:", err);
      } finally {
        setLoading(false);
      }
    };
    if (isLoggedIn) {
      fetchDeals();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const diff = endOfDay.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.title,
      price: product.dealPrice,
      image: product.image,
    });
    toast({
      title: "Added to Cart",
      description: `${product.title} added to cart at Special Deal Rate! 🎉`,
    });
  };

  const handleQtyChange = (productId: string, delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const existing = cartItems.find(item => item.id === productId);
    if (!existing) return;
    const newQty = existing.quantity + delta;
    if (newQty <= 0) {
      removeFromCart(productId);
      toast({
        title: "Removed from Cart",
        description: "Product removed from cart.",
      });
    } else {
      updateQuantity(productId, newQty);
    }
  };

  const formatTime = (num: number) => num.toString().padStart(2, "0");


  return (
    <section className="py-16 bg-gradient-to-b from-amber-500/5 via-slate-50 to-slate-50 relative overflow-hidden border-b">
      {/* Ambient background spotlights */}
      <div className="absolute top-0 right-1/4 w-[350px] h-[350px] rounded-full bg-amber-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[300px] h-[300px] rounded-full bg-blue-500/5 blur-[80px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        
        {/* Premium 3-Column Promo Banners Block with Hover Lift */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {PROMO_BANNERS.map((promo) => (
            <div
              key={promo.id}
              className={`bg-gradient-to-br ${promo.bgGradient} rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between text-left text-white border border-slate-200/10 relative overflow-hidden group hover-pulse-glow`}
            >
              {/* Background shine effect */}
              <div className="absolute top-0 -right-16 w-32 h-64 bg-white/5 rotate-12 transition-transform duration-750 group-hover:translate-x-[-130%] pointer-events-none" />
              
              <div className="space-y-2">
                <span className="text-[10px] tracking-widest font-black uppercase text-amber-300">
                  {promo.tag}
                </span>
                <h3 className="text-lg font-black leading-tight uppercase tracking-tight">
                  {promo.title}
                </h3>
                <p className="text-xs text-white/80 leading-relaxed font-semibold">
                  {promo.desc}
                </p>
              </div>

              <div className="pt-6 flex items-center justify-between z-10">
                {promo.id === "p3" ? (
                  <Receipt className="h-9 w-9 text-amber-500/40" />
                ) : promo.id === "p2" ? (
                  <ShieldCheck className="h-9 w-9 text-white/20" />
                ) : (
                  <Truck className="h-9 w-9 text-slate-900/25" />
                )}
                
                <Button
                  onClick={() => navigate(promo.link)}
                  className={`text-xs font-black px-4 py-2.5 rounded-xl transition-all ${
                    promo.id === "p1"
                      ? "bg-slate-950 text-white hover:bg-slate-900"
                      : promo.id === "p2"
                      ? "bg-white text-slate-950 hover:bg-slate-100"
                      : "bg-transparent border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-slate-950"
                  }`}
                >
                  {promo.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b pb-6 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 bg-amber-500 rounded-2xl flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/25 border border-amber-400">
              <Flame className="h-6 w-6 fill-slate-950 animate-bounce" style={{ animationDuration: "2s" }} />
            </div>
            <div className="text-left space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl md:text-3xl font-black text-slate-800 uppercase tracking-tight">
                  Lightning Deals of the Day
                </h2>
                <Badge className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-[9px] uppercase tracking-wider animate-pulse shadow-md shadow-emerald-500/25 px-2.5 py-0.5 rounded-full border-none shrink-0 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 bg-slate-950 rounded-full animate-ping" />
                  Live Now
                </Badge>
              </div>
              <p className="text-xs md:text-sm text-slate-500 font-extrabold uppercase tracking-wide">
                Super savings on premium-quality structural hardware
              </p>
            </div>
          </div>

          {/* Premium Glassmorphic Live Countdown Timer */}
          <div className="flex items-center gap-3 bg-white/90 border-2 border-amber-500/30 backdrop-blur-md px-4 py-2 rounded-2xl w-max shadow-md hover:border-amber-500 transition-all duration-300">
            <Clock className="h-4.5 w-4.5 text-amber-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider mr-1">Ends in:</span>
            <div className="flex items-center gap-1.5">
              <span className="bg-slate-900 text-white font-extrabold text-xs px-2.5 py-1 rounded-lg shadow-sm tracking-wide">
                {formatTime(timeLeft.hours)}h
              </span>
              <span className="font-extrabold text-amber-500">:</span>
              <span className="bg-slate-900 text-white font-extrabold text-xs px-2.5 py-1 rounded-lg shadow-sm tracking-wide">
                {formatTime(timeLeft.minutes)}m
              </span>
              <span className="font-extrabold text-amber-500">:</span>
              <span className="bg-amber-500 text-slate-950 font-black text-xs px-2.5 py-1 rounded-lg shadow-md animate-pulse tracking-wide">
                {formatTime(timeLeft.seconds)}s
              </span>
            </div>
          </div>
        </div>

        {!isLoggedIn ? (
          <div className="relative z-10 w-full rounded-3xl bg-white border border-slate-200 p-8 shadow-xl text-center max-w-2xl mx-auto overflow-hidden group hover-pulse-glow">
            {/* Visual ambient highlights */}
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />
            
            <div className="space-y-6 py-8 relative z-10 flex flex-col items-center">
              <div className="h-16 w-16 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-center text-amber-600 shadow-md">
                <Flame className="h-8 w-8 fill-amber-500 text-amber-500 animate-pulse" />
              </div>
              <div className="space-y-2 max-w-md">
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">🔒 Lightning Deals Locked</h3>
                <p className="text-xs text-slate-500 font-extrabold uppercase tracking-wider leading-relaxed">
                  Log in or register your account to unlock today's hot builder deals, tools discount rates, and wholesale plant pricing.
                </p>
              </div>
              <Button
                onClick={() => navigate("/login")}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-6 py-3 rounded-2xl shadow-lg shadow-amber-500/20 text-xs uppercase tracking-widest border-none transition-all duration-200 hover:scale-102 cursor-pointer"
              >
                Login / Register to View Deals
              </Button>
            </div>
          </div>
        ) : (
          <div className="relative group/carousel z-10">
            {/* Scroll Left Button */}
            <button
              onClick={() => scroll('left')}
              className="absolute left-[-16px] top-1/2 -translate-y-1/2 bg-white hover:bg-slate-50 text-slate-700 hover:text-amber-500 border border-slate-200 h-10 w-10 rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-all duration-200 hover:scale-105 z-20 opacity-0 group-hover/carousel:opacity-100 hidden md:flex"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Scroll Right Button */}
            <button
              onClick={() => scroll('right')}
              className="absolute right-[-16px] top-1/2 -translate-y-1/2 bg-white hover:bg-slate-50 text-slate-700 hover:text-amber-500 border border-slate-200 h-10 w-10 rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-all duration-200 hover:scale-105 z-20 opacity-0 group-hover/carousel:opacity-100 hidden md:flex"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {loading ? (
              <div className="text-center py-8 text-slate-400 font-semibold text-sm">
                Loading deals...
              </div>
            ) : deals.length === 0 ? (
              <div className="text-center py-8 text-slate-400 font-semibold text-sm">
                No active deals available.
              </div>
            ) : (
              <div 
                ref={carouselRef}
                className="flex gap-6 overflow-x-auto pb-6 pt-2 snap-x scrollbar-none scroll-smooth"
              >
                {deals.map((deal) => {
                  const inCartItem = cartItems.find(item => item.id === deal.id);
                  const isInCart = !!inCartItem;
                  
                  return (
                <Card
                  key={deal.id}
                  onClick={() => navigate(`/product/${deal.id}`)}
                  className="w-[290px] sm:w-[320px] shrink-0 card-glossy hover-lift gold-glow cursor-pointer snap-start relative group/card rounded-2xl overflow-hidden bg-white text-left transition-all duration-300 border border-slate-200"
                >
                  
                  {/* Clean Top Corner Badges (No overlaps!) */}
                  <div className="absolute top-3.5 left-3.5 z-10">
                    <Badge variant="destructive" className="bg-red-600 hover:bg-red-700 text-[9px] font-black uppercase tracking-wider py-1 px-2.5 shadow-md border-none flex items-center gap-0.5 rounded-lg">
                      <Percent className="h-3 w-3" /> {deal.discount}% Off
                    </Badge>
                  </div>

                  {/* Stock Left Urgency Badge - clean styling */}
                  <div className="absolute top-3.5 right-3.5 z-10">
                    <span className="bg-red-50 text-red-600 border border-red-150 text-[8.5px] font-black uppercase px-2 py-1 rounded-lg animate-pulse flex items-center justify-center shadow-sm">
                      Only {deal.stockLeft} Left!
                    </span>
                  </div>

                  {/* Product Image Panel with beautiful visual grid-mesh background */}
                  <div className="aspect-[4/3] w-full bg-gradient-to-tr from-slate-50 via-slate-100/50 to-amber-500/5 flex items-center justify-center p-6 relative overflow-hidden border-b">
                    {/* Glowing decorative circle grid background */}
                    <div className="absolute h-36 w-36 rounded-full bg-gradient-to-tr from-slate-100 to-slate-200/50 p-2 scale-90 group-hover/card:scale-105 transition-transform duration-500" />
                    
                    <img
                      src={deal.image}
                      alt=""
                      className="max-h-[140px] max-w-[80%] object-contain mix-blend-multiply group-hover/card:scale-105 transition-transform duration-500 z-10"
                      onError={(e) => {
                        e.currentTarget.src = getHardwareSvgFallback(deal.title);
                      }}
                    />
                  </div>

                  {/* Card Main Info Content */}
                  <CardContent className="p-5 space-y-4">
                    {/* Brand, Category, and prime-like Assured badge row */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] bg-slate-950 text-amber-500 font-black px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
                            {deal.brand}
                          </span>
                          
                          {/* GharSeKro Assured badge positioned perfectly here! */}
                          <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:from-amber-600 hover:to-amber-700 border-none text-[8px] font-black uppercase tracking-wider py-0.5 px-1.5 shadow flex items-center gap-0.5 shrink-0">
                            <ShieldCheck className="h-3 w-3 text-slate-950" /> Assured
                          </Badge>
                        </div>
                        
                        <span className="text-[10px] text-amber-600 font-extrabold uppercase tracking-wide">
                          {deal.category}
                        </span>
                      </div>
                      
                      {/* Product Title */}
                      <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-tight h-10 group-hover:text-amber-600 transition-colors">
                        {deal.title}
                      </h3>
                    </div>

                    {/* Rating & reviews with Flipkart-Style green chip */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-green-700 text-white text-[10px] px-2 py-0.5 rounded font-black gap-0.5 shadow-sm shadow-green-700/10">
                        <span>{deal.rating}</span>
                        <Star className="h-2.5 w-2.5 fill-white text-white" />
                      </div>
                      <span className="text-slate-400 font-bold text-[10px]">({deal.reviews} Reviews)</span>
                    </div>

                    {/* Price Block featuring Dashed Capsule exact money saved indicator */}
                    <div className="flex items-center justify-between gap-2 pt-0.5">
                      <div className="space-y-0.5">
                        <div className="flex items-baseline gap-2">
                          <span className="font-black text-xl text-slate-900 tracking-tight">
                            ₹{deal.dealPrice.toLocaleString()}
                          </span>
                          <span className="text-xs text-slate-400 line-through">
                            ₹{deal.basePrice.toLocaleString()}
                          </span>
                        </div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase block">Inclusive of GST</span>
                      </div>

                      <div className="border border-dashed border-amber-500/80 bg-amber-50/50 rounded-xl px-2.5 py-1 flex items-center justify-center shrink-0">
                        <span className="text-[9.5px] font-black text-amber-600 uppercase tracking-wide">
                          Save ₹{(deal.basePrice - deal.dealPrice).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Claimed Indicator Progress Bar with Premium Shimmer effect */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-[10px] font-bold text-slate-600">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-red-500 animate-pulse" />
                          <span>{deal.claimed}% Claimed</span>
                        </span>
                        <span className="text-red-600 font-black animate-pulse uppercase tracking-wide text-[9px]">Hurry, Almost Full!</span>
                      </div>
                      {/* Main Bar Wrapper */}
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/50 shadow-inner">
                        {/* Active Shimmer fill container */}
                        <div
                          className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 h-full rounded-full transition-all duration-500 animate-shimmer"
                          style={{ width: `${deal.claimed}%` }}
                        />
                      </div>
                    </div>

                    {/* Dynamic delivery estimate line */}
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold border-t pt-3">
                      <Truck className="h-4 w-4 text-slate-400 animate-bounce" style={{ animationDuration: "2.5s" }} />
                      <span>FREE Delivery by <strong className="text-slate-700 font-extrabold">Tomorrow</strong></span>
                    </div>

                    {/* Dynamic plus-minus inline selector or Add to Cart button */}
                    <div className="pt-1">
                      {isInCart ? (
                        <div 
                          className="w-full flex items-center justify-between border border-amber-500 bg-amber-50/50 rounded-xl overflow-hidden shadow-sm h-9.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={(e) => handleQtyChange(deal.id, -1, e)}
                            className="w-11 h-full flex items-center justify-center hover:bg-amber-100 text-slate-950 font-bold transition-colors border-none bg-transparent outline-none cursor-pointer"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="text-sm font-black text-slate-950">
                            {inCartItem.quantity}
                          </span>
                          <button
                            onClick={(e) => handleQtyChange(deal.id, 1, e)}
                            className="w-11 h-full flex items-center justify-center hover:bg-amber-100 text-slate-950 font-bold transition-colors border-none bg-transparent outline-none cursor-pointer"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <Button
                          className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs py-2.5 rounded-xl transition-all shadow-md shadow-amber-500/10 flex items-center justify-center gap-2 border-none"
                          onClick={(e) => handleAddToCart(deal, e)}
                        >
                          <ShoppingCart className="h-4 w-4 text-slate-950" />
                          Add to Cart
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
