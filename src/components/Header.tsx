import { Search, ShoppingCart, User, Package, LogOut, HardHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useCartContext } from "@/context/CartContext";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import logo from '../../public/logo.png';

const Header = () => {
  const navigate = useNavigate();
  const { getTotalItems } = useCartContext();
  const [user, setUser] = useState<{ name?: string; email?: string; profile?: string } | null>(null);
  const [showLogout, setShowLogout] = useState(false);
  const [searchValue, setSearchValue] = useState("");

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

    // Initial load
    updateUserState();

    // Listen for storage changes (e.g., logout in another tab)
    window.addEventListener('storage', updateUserState);
    
    // Listen for custom auth-change event (e.g., after signup)
    window.addEventListener('auth-change', updateUserState);
    
    return () => {
      window.removeEventListener('storage', updateUserState);
      window.removeEventListener('auth-change', updateUserState);
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

  // Search handler
  function handleSearch() {
    if (searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
    }
  }

  return (
    <header className="bg-white/90 backdrop-blur border-b shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-2 py-2 flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none" onClick={() => navigate('/')}> 
          <img src={logo} alt="GharSeKro logo" className="w-16 h-10 sm:w-25 sm:h-20 object-contain" />
          <div className="flex flex-col leading-tight">
            <h1
              className="text-lg sm:text-2xl font-bold bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(90deg, #f59e0b, #d97706)' }}
            >
              GharSeKro
            </h1>
            <span className="text-[10px] sm:text-xs text-muted-foreground">Do it from home.</span>
          </div>
        </div>
        {/* Search Bar */}
        {/* Search Bar - Responsive */}
        <div className="flex-1 max-w-2xl relative hidden sm:block">
          <div className="relative flex">
            <Input
              placeholder="Search for construction supplies, tools, materials..."
              className="pr-12 h-10 border-2 focus:border-primary"
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSearch();
              }}
            />
            <Button
              size="sm"
              className="absolute right-0 top-0 h-10 rounded-l-none text-white"
              style={{ background: '#f59e0b' }}
              onClick={handleSearch}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {/* Mobile Search Icon */}
        <div className="block sm:hidden">
          <Button
            size="icon"
            variant="ghost"
            className="p-2"
            aria-label="Search"
            onClick={handleSearch}
          >
            <Search className="h-6 w-6 text-gray-700" />
          </Button>
        </div>
        {/* Action buttons */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 font-semibold"
            onClick={() => navigate('/labour')}
          >
            <HardHat className="h-4 w-4" />
            <span className="hidden sm:inline">Labour</span>
          </Button>
          {user && user.name ? (
            <Popover>
              <PopoverTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer">
                  {user.profile ? (
                    <img
                      src={user.profile}
                      alt={user.name}
                      className="w-8 h-8 rounded-full border object-cover"
                    />
                  ) : (
                    <User className="h-8 w-8 text-gray-400" />
                  )}
                  <span className="font-medium max-w-[80px] sm:max-w-[120px] truncate" title={user.name}>{user.name}</span>
                </div>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-56 p-2 flex flex-col gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs font-bold text-slate-700"
                  onClick={() => navigate('/profile')}
                >
                  <User className="h-3.5 w-3.5 mr-2 text-amber-500" />
                  My Profile
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs font-bold text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => setShowLogout(true)}
                >
                  <LogOut className="h-3.5 w-3.5 mr-2" />
                  Logout
                </Button>
              </PopoverContent>
            </Popover>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => navigate('/login')}
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Login</span>
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => navigate('/orders')}
          >
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Orders</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 relative"
            onClick={() => navigate('/cart')}
          >
            <ShoppingCart className="h-4 w-4" />
            {getTotalItems() > 0 && (
              <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {getTotalItems()}
              </Badge>
            )}
            <span className="hidden sm:inline">Cart</span>
          </Button>
        </div>
      </div>
      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogout} onOpenChange={setShowLogout}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
          </DialogHeader>
          <div className="py-2 text-sm">Are you sure you want to log out?</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLogout(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleLogout}>Logout</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  )
}

export default Header
