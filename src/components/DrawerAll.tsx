import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  User, 
  ChevronRight, 
  TrendingUp, 
  Wrench, 
  Activity, 
  Package, 
  Globe, 
  HelpCircle, 
  LogOut, 
  HardHat, 
  ShoppingBag, 
  Store 
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface DrawerAllProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DrawerAll({ isOpen, onClose }: DrawerAllProps) {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("hi");
  const [user, setUser] = useState<{ name?: string; email?: string; profile?: string } | null>(null);

  useEffect(() => {
    const checkUserAndLang = () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        setUser({
          name: localStorage.getItem("userName") || "",
          email: localStorage.getItem("userEmail") || "",
          profile: localStorage.getItem("userProfile") || "",
        });
      } else {
        setUser(null);
      }

      const savedLang = localStorage.getItem("appLanguage") || "hi";
      setLanguage(savedLang);
    };

    checkUserAndLang();

    // Listen to changes in auth or storage
    window.addEventListener("storage", checkUserAndLang);
    window.addEventListener("auth-change", checkUserAndLang);
    
    return () => {
      window.removeEventListener("storage", checkUserAndLang);
      window.removeEventListener("auth-change", checkUserAndLang);
    };
  }, [isOpen]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userProfile");
    setUser(null);
    window.dispatchEvent(new Event("auth-change"));
    onClose();
    navigate("/");
  };

  const handleLanguageToggle = () => {
    const nextLang = language === "hi" ? "en" : "hi";
    setLanguage(nextLang);
    localStorage.setItem("appLanguage", nextLang);
    // Dispatch language-changed event so the rest of the application updates immediately
    window.dispatchEvent(new Event("storage"));
  };

  const handleNavigation = (path: string, isScrollTab?: boolean) => {
    onClose();
    if (isScrollTab) {
      // If it's a tab trigger on home (e.g. deals, bestsellers, newreleases, customerservice)
      navigate(path);
      // Let the Index.tsx router listen and scroll
    } else {
      navigate(path);
    }
  };

  // Translations
  const t = {
    hi: {
      helloSign: "नमस्ते, लॉगिन करें",
      helloUser: "नमस्ते, {name}",
      sections: {
        trending: "ट्रेंडिंग",
        categories: "कैटेगरी अनुसार खरीदें",
        programs: "प्रोग्राम और फीचर्स",
        help: "सहायता और सेटिंग्स",
      },
      items: {
        bestsellers: "बेस्ट सेलर्स",
        newreleases: "न्यू रिलीज़ेस",
        deals: "आज के डील्स",
        wholesale: "होलसेल स्टोर",
        labour: "लेबर सर्विसेज",
        account: "आपका खाता",
        cs: "ग्राहक सेवा",
        signout: "लॉग आउट करें",
        signin: "लॉग इन करें",
        lang: "English (भाषा बदलें)"
      }
    },
    en: {
      helloSign: "Hello, Sign In",
      helloUser: "Hello, {name}",
      sections: {
        trending: "Trending",
        categories: "Shop By Category",
        programs: "Programs & Features",
        help: "Help & Settings",
      },
      items: {
        bestsellers: "Best Sellers",
        newreleases: "New Releases",
        deals: "Today's Deals",
        wholesale: "Wholesale Store",
        labour: "Labour Services",
        account: "Your Account",
        cs: "Customer Service",
        signout: "Sign Out",
        signin: "Sign In",
        lang: "हिंदी (भाषा बदलें)"
      }
    }
  };

  const current = t[language as "hi" | "en"] || t.hi;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Sidenav Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-xs select-none"
          />

          {/* Left Slide-out Sidenav Panel */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 36 }}
            className="fixed left-0 top-0 bottom-0 w-[290px] sm:w-[350px] bg-white shadow-2xl z-50 flex flex-col font-sans text-left border-r border-slate-200 select-none"
          >
            
            {/* Dark Sidenav Header (Amazon style #232f3e) */}
            <div className="bg-[#232f3e] text-white px-5 py-4 flex items-center justify-between shrink-0 shadow-md">
              <div 
                onClick={() => {
                  onClose();
                  if (user) navigate("/profile");
                  else navigate("/login");
                }}
                className="flex items-center gap-3 cursor-pointer hover:underline"
              >
                <div className="h-8.5 w-8.5 bg-slate-100/10 border border-white/20 rounded-full flex items-center justify-center overflow-hidden shadow-inner">
                  {user?.profile ? (
                    <img src={user.profile} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-4.5 w-4.5 text-slate-300" />
                  )}
                </div>
                <span className="font-extrabold text-sm sm:text-base tracking-wide">
                  {user && user.name 
                    ? current.helloUser.replace("{name}", user.name.split(" ")[0])
                    : current.helloSign}
                </span>
              </div>

              {/* Close Button floating or integrated inside header */}
              <button
                onClick={onClose}
                className="h-8 w-8 hover:bg-white/10 text-gray-300 hover:text-white rounded-full flex items-center justify-center transition-colors border-none bg-transparent cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Sidenav Items Scroll Area */}
            <div className="flex-1 overflow-y-auto py-3.5 px-0 space-y-4">
              
              {/* SECTION 1: Trending & Deals */}
              <div className="space-y-1">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-5 pb-1">
                  {current.sections.trending}
                </h3>
                <div className="flex flex-col">
                  <button
                    onClick={() => handleNavigation("/?tab=bestsellers", true)}
                    className="w-full flex items-center justify-between py-3 px-5 hover:bg-slate-50 transition-colors text-slate-700 font-semibold text-xs sm:text-sm border-none bg-transparent cursor-pointer text-left"
                  >
                    <span className="flex items-center gap-3">
                      <TrendingUp className="h-4 w-4 text-amber-500 shrink-0" />
                      {current.items.bestsellers}
                    </span>
                    <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                  </button>

                  <button
                    onClick={() => handleNavigation("/?tab=newreleases", true)}
                    className="w-full flex items-center justify-between py-3 px-5 hover:bg-slate-50 transition-colors text-slate-700 font-semibold text-xs sm:text-sm border-none bg-transparent cursor-pointer text-left"
                  >
                    <span className="flex items-center gap-3">
                      <Package className="h-4 w-4 text-amber-500 shrink-0" />
                      {current.items.newreleases}
                    </span>
                    <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                  </button>

                  <button
                    onClick={() => handleNavigation("/?tab=deals", true)}
                    className="w-full flex items-center justify-between py-3 px-5 hover:bg-slate-50 transition-colors text-slate-700 font-semibold text-xs sm:text-sm border-none bg-transparent cursor-pointer text-left"
                  >
                    <span className="flex items-center gap-3">
                      <ShoppingBag className="h-4 w-4 text-amber-500 shrink-0" />
                      {current.items.deals}
                    </span>
                    <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                  </button>
                </div>
              </div>

              <Separator className="mx-5 bg-slate-100" />

              {/* SECTION 2: Shop by Department */}
              <div className="space-y-1">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-5 pb-1">
                  {current.sections.categories}
                </h3>
                <div className="flex flex-col">
                  {[
                    { en: "Power Tools", hi: "पावर टूल्स" },
                    { en: "Cement & Sand", hi: "सीमेंट और रेत" },
                    { en: "Electricals", hi: "इलेक्ट्रिकल्स" },
                    { en: "Paints", hi: "पेंट्स" },
                    { en: "Plumbing", hi: "प्लंबिंग" },
                    { en: "Hardware & Locks", hi: "हार्डवेयर और ताले" },
                    { en: "Safety Equipment", hi: "सुरक्षा उपकरण" }
                  ].map((cat) => (
                    <button
                      key={cat.en}
                      onClick={() => handleNavigation(`/search?category=${encodeURIComponent(cat.en)}`)}
                      className="w-full flex items-center justify-between py-2.5 px-5 hover:bg-slate-50 transition-colors text-slate-700 font-bold text-xs sm:text-sm border-none bg-transparent cursor-pointer text-left"
                    >
                      <span className="flex items-center gap-3.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        {language === "hi" ? cat.hi : cat.en}
                      </span>
                      <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              <Separator className="mx-5 bg-slate-100" />

              {/* SECTION 3: Programs & Features */}
              <div className="space-y-1">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-5 pb-1">
                  {current.sections.programs}
                </h3>
                <div className="flex flex-col">
                  <button
                    onClick={() => handleNavigation("/labour")}
                    className="w-full flex items-center justify-between py-3 px-5 hover:bg-slate-50 transition-colors text-slate-700 font-semibold text-xs sm:text-sm border-none bg-transparent cursor-pointer text-left"
                  >
                    <span className="flex items-center gap-3">
                      <HardHat className="h-4 w-4 text-amber-500 shrink-0" />
                      {current.items.labour}
                    </span>
                    <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                  </button>

                  <button
                    onClick={() => handleNavigation("/services")}
                    className="w-full flex items-center justify-between py-3 px-5 hover:bg-slate-50 transition-colors text-slate-700 font-semibold text-xs sm:text-sm border-none bg-transparent cursor-pointer text-left"
                  >
                    <span className="flex items-center gap-3">
                      <Wrench className="h-4 w-4 text-amber-500 shrink-0" />
                      {language === "hi" ? "साइट सेवाएँ (बोरिंग/मिट्टी)" : "Site Services (Boring/Soil)"}
                    </span>
                    <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                  </button>

                  <button
                    onClick={() => handleNavigation("/wholesale")}
                    className="w-full flex items-center justify-between py-3 px-5 hover:bg-slate-50 transition-colors text-slate-700 font-semibold text-xs sm:text-sm border-none bg-transparent cursor-pointer text-left"
                  >
                    <span className="flex items-center gap-3">
                      <Store className="h-4 w-4 text-amber-500 shrink-0" />
                      {current.items.wholesale}
                    </span>
                    <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                  </button>
                </div>
              </div>

              <Separator className="mx-5 bg-slate-100" />

              {/* SECTION 4: Help & Settings */}
              <div className="space-y-1">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-5 pb-1">
                  {current.sections.help}
                </h3>
                <div className="flex flex-col">
                  {user && (
                    <button
                      onClick={() => handleNavigation("/profile")}
                      className="w-full flex items-center justify-between py-3 px-5 hover:bg-slate-50 transition-colors text-slate-700 font-semibold text-xs sm:text-sm border-none bg-transparent cursor-pointer text-left"
                    >
                      <span className="flex items-center gap-3">
                        <User className="h-4 w-4 text-amber-500 shrink-0" />
                        {current.items.account}
                      </span>
                      <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                    </button>
                  )}

                  {/* Language Switcher Link */}
                  <button
                    onClick={handleLanguageToggle}
                    className="w-full flex items-center justify-between py-3 px-5 hover:bg-slate-50 transition-colors text-slate-700 font-semibold text-xs sm:text-sm border-none bg-transparent cursor-pointer text-left"
                  >
                    <span className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-amber-500 shrink-0" />
                      {current.items.lang}
                    </span>
                    <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-black border border-amber-250 shrink-0">
                      {language === "hi" ? "हिन्दी" : "English"}
                    </span>
                  </button>

                  <button
                    onClick={() => handleNavigation("/?tab=customerservice", true)}
                    className="w-full flex items-center justify-between py-3 px-5 hover:bg-slate-50 transition-colors text-slate-700 font-semibold text-xs sm:text-sm border-none bg-transparent cursor-pointer text-left"
                  >
                    <span className="flex items-center gap-3">
                      <HelpCircle className="h-4 w-4 text-amber-500 shrink-0" />
                      {current.items.cs}
                    </span>
                    <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                  </button>

                  {user ? (
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-between py-3 px-5 hover:bg-red-50 text-red-600 transition-colors font-bold text-xs sm:text-sm border-none bg-transparent cursor-pointer text-left"
                    >
                      <span className="flex items-center gap-3">
                        <LogOut className="h-4 w-4 shrink-0 text-red-500" />
                        {current.items.signout}
                      </span>
                      <ChevronRight className="h-4 w-4 text-red-400 shrink-0" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleNavigation("/login")}
                      className="w-full flex items-center justify-between py-3 px-5 hover:bg-amber-50 text-amber-700 transition-colors font-bold text-xs sm:text-sm border-none bg-transparent cursor-pointer text-left"
                    >
                      <span className="flex items-center gap-3">
                        <User className="h-4 w-4 shrink-0 text-amber-500" />
                        {current.items.signin}
                      </span>
                      <ChevronRight className="h-4 w-4 text-amber-500 shrink-0" />
                    </button>
                  )}
                </div>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
