import { Search, ShoppingCart, User, Package, LogOut, HardHat, MapPin, Sparkles, Menu, ChevronDown, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useLocation } from "react-router-dom";
import { useCartContext } from "@/context/CartContext";
import { useEffect, useState, useRef } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import DrawerCart from "./DrawerCart";
import DrawerAll from "./DrawerAll";

const POPULAR_SUGGESTIONS = [
  { text: "Ultratech Cement 50kg", category: "Cement & Sand" },
  { text: "Bosch Power Drill 600W", category: "Power Tools" },
  { text: "Havells House Wire 1.5sqmm", category: "Electricals" },
  { text: "Asian Paints Apex Ultima White", category: "Paints" },
  { text: "Supreme PVC Pipe 4 inch", category: "Plumbing" },
  { text: "Godrej Padlock Brass 65mm", category: "Hardware" }
];

const pincodeMap: Record<string, string> = {
  "110001": "New Delhi",
  "400001": "Mumbai",
  "560001": "Bengaluru",
  "600001": "Chennai",
  "700001": "Kolkata",
  "500001": "Hyderabad",
  "302001": "Jaipur",
  "226001": "Lucknow"
};

const SEARCH_CATEGORIES = [
  "All Departments",
  "Power Tools",
  "Cement & Sand",
  "Electricals",
  "Paints",
  "Plumbing",
  "Hardware & Locks",
  "Safety Equipment"
];

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get("tab");
  
  const isDealsActive = location.pathname === '/' && activeTab === 'deals';
  const isLabourActive = location.pathname === '/labour';
  const isWholesaleActive = location.pathname === '/wholesale';
  const isBestSellersActive = location.pathname === '/' && activeTab === 'bestsellers';
  const isNewReleasesActive = location.pathname === '/' && activeTab === 'newreleases';
  const isCustomerServiceActive = location.pathname === '/' && activeTab === 'customerservice';

  const { getTotalItems } = useCartContext();
  const [user, setUser] = useState<{ name?: string; email?: string; profile?: string } | null>(null);
  const [showLogout, setShowLogout] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Departments");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAllMenuOpen, setIsAllMenuOpen] = useState(false);
  
  // Pincode Location States
  const [pincode, setPincode] = useState(() => localStorage.getItem('userPincode') || '400001');
  const [pincodeCity, setPincodeCity] = useState(() => localStorage.getItem('userPincodeCity') || 'Mumbai');
  const [showPincodeDialog, setShowPincodeDialog] = useState(false);
  const [tempPincode, setTempPincode] = useState(pincode);
  const [pincodeError, setPincodeError] = useState("");

  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateUserState = () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        setUser({
          name: localStorage.getItem('userName') || '',
          email: localStorage.getItem('userEmail') || '',
          profile: localStorage.getItem('userProfile') || '',
        });
      } else {
        setUser(null);
      }
    };

    updateUserState();

    window.addEventListener('storage', updateUserState);
    window.addEventListener('auth-change', updateUserState);

    const handlePincodeChange = () => {
      setPincode(localStorage.getItem('userPincode') || '400001');
      setPincodeCity(localStorage.getItem('userPincodeCity') || 'Mumbai');
    };
    window.addEventListener('pincode-updated', handlePincodeChange);

    const handleOpenCartDrawer = () => {
      setIsCartOpen(true);
    };
    window.addEventListener('open-cart-drawer', handleOpenCartDrawer);

    const handleOutsideClick = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    
    return () => {
      window.removeEventListener('storage', updateUserState);
      window.removeEventListener('auth-change', updateUserState);
      window.removeEventListener('pincode-updated', handlePincodeChange);
      window.removeEventListener('open-cart-drawer', handleOpenCartDrawer);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userProfile');
    setUser(null);
    navigate('/');
  };

  function handleSearch(term?: string) {
    const finalTerm = term !== undefined ? term : searchValue;
    if (finalTerm.trim()) {
      setSearchFocused(false);
      const catQuery = selectedCategory !== "All Departments" ? `&category=${encodeURIComponent(selectedCategory)}` : "";
      navigate(`/search?q=${encodeURIComponent(finalTerm.trim())}${catQuery}`);
    }
  }

  const handleSavePincode = () => {
    if (!/^\d{6}$/.test(tempPincode)) {
      setPincodeError("Please enter a valid 6-digit pincode.");
      return;
    }

    const city = pincodeMap[tempPincode] || "India";
    localStorage.setItem('userPincode', tempPincode);
    localStorage.setItem('userPincodeCity', city);
    setPincode(tempPincode);
    setPincodeCity(city);
    setPincodeError("");
    setShowPincodeDialog(false);

    window.dispatchEvent(new Event('pincode-updated'));
  };

  const filteredSuggestions = POPULAR_SUGGESTIONS.filter(item =>
    item.text.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.category.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <header className="w-full flex flex-col z-50 sticky top-0 shadow-lg select-none">
      
      {/* Top Banner Highlight Strip */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 text-[9px] md:text-xs font-black py-1.5 px-4 text-center tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-inner">
        <Sparkles className="h-3.5 w-3.5 fill-slate-950 text-slate-950 animate-pulse" />
        <span>Powered by Aman Traders – Your Premium Partner for Wholesale & Retail Site Supplies</span>
      </div>

      {/* 1. Main Nav Belt (Upper Row - Deep Navy #131921) */}
      <div className="bg-[#131921] h-14 md:h-16 flex items-center px-4 gap-3 md:gap-5 justify-between">
        
        {/* Brand Logo - New Premium Image Logo */}
        <div 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 p-1 bg-white rounded-lg border border-transparent hover:border-amber-400/30 cursor-pointer transition-all duration-150 shrink-0 shadow-sm"
        >
          <img 
            src="/logo.png" 
            alt="GharSeKro Logo" 
            className="h-9 md:h-11 w-auto object-contain rounded-md"
          />
          <div className="hidden lg:flex flex-col text-slate-800 pr-1 select-none leading-none">
            <span className="text-[9px] font-bold text-amber-600 uppercase tracking-wider">Sponsored by</span>
            <span className="text-[11px] font-extrabold text-slate-900 tracking-tight">Aman Traders</span>
          </div>
        </div>

        {/* Location Selector - Standard Stacked Layout */}
        <div 
          onClick={() => {
            setTempPincode(pincode);
            setPincodeError("");
            setShowPincodeDialog(true);
          }}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border border-transparent hover:border-white/30 cursor-pointer select-none text-left text-white tracking-wide shrink-0 transition-all duration-150"
        >
          <MapPin className="h-4.5 w-4.5 text-white shrink-0 mt-2.5" />
          <div className="flex flex-col leading-tight">
            <span className="text-[11px] text-gray-300 font-semibold">Deliver to</span>
            <span className="text-xs font-black text-white -mt-0.5">
              {pincodeCity} {pincode}
            </span>
          </div>
        </div>

        {/* Custom Multi-department Search Input Bar */}
        <div ref={searchContainerRef} className="flex-1 max-w-3xl relative hidden sm:block">
          <div className="flex rounded-lg overflow-hidden bg-white border-2 border-transparent focus-within:border-[#f3a847] focus-within:ring-2 focus-within:ring-[#f3a847]/30 shadow transition-all duration-150">
            
            {/* Left Department selector dropdown list */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-1 px-3 bg-gray-100 hover:bg-gray-200 border-r text-[11px] font-black text-slate-600 transition-colors shrink-0">
                  <span>{selectedCategory}</span>
                  <ChevronDown className="h-3 w-3 text-slate-500" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-56 p-1.5 flex flex-col gap-0.5 rounded-xl shadow-2xl bg-white border border-slate-200 z-50">
                {SEARCH_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left text-xs font-bold px-3 py-2 rounded-lg hover:bg-amber-50 hover:text-amber-700 transition-colors ${
                      selectedCategory === cat ? 'bg-amber-50/70 text-amber-700' : 'text-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </PopoverContent>
            </Popover>

            {/* Core input area */}
            <Input
              placeholder={`Search in ${selectedCategory}...`}
              className="flex-1 border-none focus-visible:ring-0 rounded-none text-sm h-10 px-3 bg-transparent text-slate-800 placeholder:text-slate-400 font-semibold"
              value={searchValue}
              onChange={e => {
                setSearchValue(e.target.value);
                setSearchFocused(true);
              }}
              onFocus={() => setSearchFocused(true)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSearch();
              }}
            />

            {/* Right side Amber Magnifier search submit button */}
            <Button
              className="h-10 bg-[#febd69] hover:bg-[#f3a847] rounded-none px-5 text-slate-800 flex items-center justify-center transition-colors shrink-0 shadow-none border-none"
              onClick={() => handleSearch()}
            >
              <Search className="h-5 w-5 font-black text-slate-900" />
            </Button>
          </div>

          {/* Autocomplete dynamic dropdown drawer */}
          {searchFocused && (
            <div className="absolute left-0 right-0 top-11 bg-white border border-slate-200 shadow-2xl rounded-xl p-3 text-sm z-50 animate-fade-in max-h-80 overflow-y-auto">
              <div className="text-[10px] font-black text-amber-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" /> Popular Searches
              </div>
              <div className="space-y-1">
                {filteredSuggestions.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSearchValue(item.text);
                      handleSearch(item.text);
                    }}
                    className="flex justify-between items-center px-2 py-2.5 hover:bg-amber-50/50 rounded-lg cursor-pointer transition-colors"
                  >
                    <span className="font-semibold text-slate-700">{item.text}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-500 font-black uppercase px-2 py-0.5 rounded-md">
                      {item.category}
                    </span>
                  </div>
                ))}
                {filteredSuggestions.length === 0 && (
                  <div className="text-slate-400 py-3 text-center font-bold">No matches. Try searching anyway!</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Widgets Strip */}
        <div className="flex items-center gap-1 sm:gap-2.5">
          
          {/* Mobile search triggers */}
          <div className="block sm:hidden">
            <Button
              size="icon"
              variant="ghost"
              className="p-1.5 hover:bg-white/10 text-white rounded-sm"
              onClick={() => navigate('/search')}
            >
              <Search className="h-6 w-6" />
            </Button>
          </div>

          {/* Interactive Language/Country indicator dropdown */}
          <div className="hidden lg:flex items-center gap-1 px-2.5 py-2.5 rounded-sm border border-transparent hover:border-white/20 cursor-pointer select-none text-white text-xs font-black tracking-wide shrink-0 transition-all duration-150">
            <span className="text-base" role="img" aria-label="India Flag">🇮🇳</span>
            <span>IN</span>
            <ChevronDown className="h-3 w-3 text-gray-400 mt-0.5" />
          </div>

          {/* Accounts & Lists Dropdown Trigger */}
          {user && user.name ? (
            <Popover>
              <PopoverTrigger asChild>
                <div className="flex flex-col px-2.5 py-1.5 rounded-sm border border-transparent hover:border-white/20 cursor-pointer select-none text-left leading-tight text-white shrink-0 transition-all duration-150">
                  <span className="text-[11px] text-gray-300 font-semibold truncate max-w-[80px]">Hello, {user.name.split(' ')[0]}</span>
                  <span className="text-xs font-black flex items-center gap-0.5 -mt-0.5">
                    Account & Lists <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                  </span>
                </div>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-56 p-2 flex flex-col gap-1 rounded-xl shadow-2xl bg-white border border-slate-200 z-50">
                <div className="px-3 py-1.5 border-b mb-1">
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Your Account</p>
                  <p className="text-xs font-black text-slate-700 truncate">{user.email}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs font-bold text-slate-700 hover:bg-slate-50"
                  onClick={() => navigate('/profile')}
                >
                  <User className="h-4 w-4 mr-2.5 text-amber-500" />
                  My Profile
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs font-bold text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => setShowLogout(true)}
                >
                  <LogOut className="h-4 w-4 mr-2.5" />
                  Logout
                </Button>
              </PopoverContent>
            </Popover>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-start leading-tight hover:bg-white/10 hover:text-white px-2.5 py-1.5 h-auto text-left rounded-sm border border-transparent text-white shrink-0 shadow-none border-none transition-all duration-150"
              onClick={() => navigate('/login')}
            >
              <span className="text-[11px] text-gray-300 font-semibold">Hello, sign in</span>
              <span className="text-xs font-black -mt-0.5 flex items-center gap-0.5">
                Account & Lists <ChevronDown className="h-3 w-3 text-gray-400" />
              </span>
            </Button>
          )}

          {/* Returns & Orders widgets */}
          <button
            onClick={() => navigate('/orders')}
            className="flex flex-col items-start leading-tight px-2.5 py-1.5 rounded-sm border border-transparent hover:border-white/20 text-left text-white shrink-0 bg-transparent border-none outline-none cursor-pointer select-none transition-all duration-150"
          >
            <span className="text-[11px] text-gray-300 font-semibold">Returns</span>
            <span className="text-xs font-black -mt-0.5">& Orders</span>
          </button>

          {/* Wheeled Cart Icon - Custom Amazon style */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-end gap-1 px-2 py-1 md:px-2.5 md:py-1.5 rounded-sm border border-transparent hover:border-white/20 text-white shrink-0 bg-transparent border-none outline-none cursor-pointer select-none transition-all duration-150 relative"
          >
            <div className="relative flex items-center">
              {/* Wheeled Cart body design */}
              <ShoppingCart className="h-6 w-6 stroke-[2]" />
              
              {/* Yellow Counter badge resting on the top of the handle */}
              {getTotalItems() > 0 && (
                <Badge variant="destructive" className="absolute -top-2.5 left-2 h-5 min-w-5 rounded-full p-0 flex items-center justify-center text-[10.5px] font-black bg-[#f3a847] hover:bg-[#febd69] text-slate-900 border-none shadow animate-scale-in">
                  {getTotalItems()}
                </Badge>
              )}
            </div>
            <span className="text-xs font-black tracking-wide hidden md:inline mb-0.5">Cart</span>
          </button>
        </div>
      </div>

      {/* 2. Secondary Nav Belt (Lower Row - Medium Navy #232f3e) */}
      <div className="bg-[#232f3e] h-10 flex items-center justify-between px-4 text-white text-xs font-extrabold shadow-inner overflow-hidden select-none">
        
        {/* Hamburger Menu & Horizontal Quicklinks */}
        <div className="flex items-center gap-1.5 md:gap-3.5 overflow-x-auto scrollbar-none pb-0.5 pt-0.5 flex-1">
          
          {/* Hamburger All departments */}
          <div 
            onClick={() => setIsAllMenuOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm cursor-pointer shrink-0 hover:bg-white/5 transition-all duration-150"
          >
            <Menu className="h-4.5 w-4.5" />
            <span>All</span>
          </div>

          <span 
            onClick={() => navigate('/?tab=deals')} 
            className={`px-2 py-1.5 rounded-sm transition-all duration-150 cursor-pointer shrink-0 ${
              isDealsActive 
                ? "text-[#febd69] bg-white/10" 
                : "text-white hover:text-[#febd69] hover:bg-white/5"
            }`}
          >
            Today's Deals
          </span>
          <span 
            onClick={() => navigate('/labour')} 
            className={`px-2 py-1.5 rounded-sm flex items-center gap-1 transition-all duration-150 cursor-pointer shrink-0 ${
              isLabourActive 
                ? "text-[#febd69] bg-white/10" 
                : "text-[#febd69] hover:text-white hover:bg-white/5"
            }`}
          >
            <HardHat className="h-3.5 w-3.5" /> Labour Services
          </span>
          <span 
            onClick={() => navigate('/services')} 
            className={`px-2 py-1.5 rounded-sm flex items-center gap-1 transition-all duration-150 cursor-pointer shrink-0 ${
              location.pathname === '/services'
                ? "text-[#febd69] bg-white/10" 
                : "text-white hover:text-[#febd69] hover:bg-white/5"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Site Services
          </span>

          {user && (
            <span 
              onClick={() => navigate('/wholesale')} 
              className={`px-2 py-1.5 rounded-sm transition-all duration-150 cursor-pointer shrink-0 ${
                isWholesaleActive 
                  ? "text-[#febd69] bg-white/10" 
                  : "text-white hover:text-[#febd69] hover:bg-white/5"
              }`}
            >
              Wholesale Store
            </span>
          )}

          <span 
            onClick={() => navigate('/?tab=bestsellers')} 
            className={`px-2 py-1.5 rounded-sm transition-all duration-150 cursor-pointer shrink-0 ${
              isBestSellersActive 
                ? "text-[#febd69] bg-white/10" 
                : "text-white hover:text-[#febd69] hover:bg-white/5"
            }`}
          >
            Best Sellers
          </span>
          <span 
            onClick={() => navigate('/?tab=newreleases')} 
            className={`px-2 py-1.5 rounded-sm transition-all duration-150 cursor-pointer shrink-0 ${
              isNewReleasesActive 
                ? "text-[#febd69] bg-white/10" 
                : "text-white hover:text-[#febd69] hover:bg-white/5"
            }`}
          >
            New Releases
          </span>
          <span 
            onClick={() => navigate('/?tab=customerservice')} 
            className={`px-2 py-1.5 rounded-sm transition-all duration-150 cursor-pointer shrink-0 ${
              isCustomerServiceActive 
                ? "text-[#febd69] bg-white/10" 
                : "text-white hover:text-[#febd69] hover:bg-white/5"
            }`}
          >
            Customer Service
          </span>
        </div>

        {/* GST Billing Right Promotion link */}
        <div 
          onClick={() => navigate('/profile')}
          className="hidden lg:flex items-center gap-1 text-[#febd69] hover:text-[#f3a847] hover:underline cursor-pointer tracking-wider text-[11px] font-black py-1.5 shrink-0 transition-all duration-150"
        >
          <Sparkles className="h-3.5 w-3.5 animate-pulse" />
          <span>GharSeKro Business: GST Input Tax Credit benefit - Save up to 28%!</span>
        </div>
      </div>

      {/* Pincode Location modal selector */}
      <Dialog open={showPincodeDialog} onOpenChange={setShowPincodeDialog}>
        <DialogContent className="max-w-sm rounded-2xl p-6 bg-white border border-slate-200 shadow-2xl z-50 text-left">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-slate-800 flex items-center gap-2 border-b pb-3">
              <MapPin className="h-5.5 w-5.5 text-amber-500" /> Enter Delivery Pincode
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              Apna delivery pincode enter karein taaki hum aapko live delivery times aur accurate bulk/wholesale estimates dikha sakein.
            </p>
            <div className="space-y-2">
              <Input
                type="text"
                maxLength={6}
                placeholder="Enter 6-digit Pincode (e.g. 400001)"
                value={tempPincode}
                onChange={e => {
                  setTempPincode(e.target.value.replace(/\D/g, ''));
                  setPincodeError("");
                }}
                className="border border-slate-200 focus:border-amber-500 text-base font-black text-center tracking-widest h-11 rounded-xl bg-slate-50"
              />
              {pincodeError && <p className="text-xs text-red-500 font-black">{pincodeError}</p>}
            </div>
            <div className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3 font-semibold leading-normal">
              💡 Simulated Codes: Try entering "110001" (Delhi), "400001" (Mumbai), or "560001" (Bengaluru) to see real city-based updates!
            </div>
          </div>
          <DialogFooter className="flex sm:justify-end gap-2 border-t pt-4">
            <Button variant="outline" onClick={() => setShowPincodeDialog(false)} className="rounded-xl font-bold">Cancel</Button>
            <Button onClick={handleSavePincode} className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-black shadow-md border-none transition-colors">Apply Pincode</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Logout confirmation Dialog box */}
      <Dialog open={showLogout} onOpenChange={setShowLogout}>
        <DialogContent className="max-w-xs rounded-2xl p-5 bg-white border border-slate-200 shadow-2xl z-50 text-left">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold text-slate-800">Confirm Logout</DialogTitle>
          </DialogHeader>
          <div className="py-2 text-xs text-slate-500 font-bold">Kya aap sach mein log out karna chahte hain?</div>
          <DialogFooter className="flex gap-2 justify-end pt-4 border-t mt-2">
            <Button variant="outline" size="sm" onClick={() => setShowLogout(false)} className="rounded-lg text-xs font-bold">Cancel</Button>
            <Button variant="destructive" size="sm" onClick={handleLogout} className="rounded-lg text-xs font-black shadow bg-red-600 hover:bg-red-700 border-none text-white">Logout</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Drawer Cart slide-over */}
      <DrawerCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Drawer All slide-over left-sided menu */}
      <DrawerAll isOpen={isAllMenuOpen} onClose={() => setIsAllMenuOpen(false)} />
    </header>
  );
};

export default Header;
