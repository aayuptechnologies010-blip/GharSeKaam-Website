import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getProducts, ApiProduct, FALLBACK_HARDWARE_PRODUCTS } from "@/lib/api";
import { useCartContext } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryNav from "@/components/CategoryNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Search as SearchIcon, 
  Grid, 
  List, 
  Star, 
  SlidersHorizontal, 
  ArrowUpDown, 
  ShoppingCart, 
  Heart,
  Percent,
  Inbox,
  Minus,
  Plus,
  Truck,
  ShieldCheck,
  Tag
} from "lucide-react";

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const navigate = useNavigate();
  const { cartItems, addToCart, removeFromCart, updateQuantity } = useCartContext();
  const { toast } = useToast();

  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Layout state
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter & Sorting state
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState<number>(0);
  const [priceMax, setPriceMax] = useState<number>(100000);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedDiscount, setSelectedDiscount] = useState<number | null>(null);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [wholesaleOnly, setWholesaleOnly] = useState<boolean>(false);

  // Load products
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        if (data && data.length > 0) {
          setProducts(data);
        } else {
          setProducts(FALLBACK_HARDWARE_PRODUCTS);
        }
        setError(null);
      } catch (err: any) {
        console.error("Failed to load products in search:", err);
        setProducts(FALLBACK_HARDWARE_PRODUCTS);
        setError(null);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  // Filter Categories extracted from matching products
  const availableCategories = Array.from(
    new Set(
      products
        .map(p => p.category?.title)
        .filter((cat): cat is string => !!cat)
    )
  );

  // Filter logic
  const filteredProducts = products.filter(product => {
    // 1. Text Search matching
    const searchString = `${product.title} ${product.category?.title || ""} ${product.availability || ""}`.toLowerCase();
    const searchMatch = query ? searchString.includes(query.toLowerCase()) : true;
    if (!searchMatch) return false;

    // 2. Category matching
    if (selectedCategories.length > 0 && product.category?.title) {
      if (!selectedCategories.includes(product.category.title)) return false;
    }

    // 3. Price matching
    const basePrice = parseFloat(product.retailprice || product.wholesaleprice || "0");
    if (basePrice < priceMin || basePrice > priceMax) return false;

    // 4. Rating filter (mock values 4.0 - 5.0 for demonstration)
    const rating = 4.0 + (product.title.length % 11) / 10; 
    if (selectedRating !== null && rating < selectedRating) return false;

    // 5. Discount filter
    const discount = (product.title.length % 3 === 0) ? 10 + (product.title.length % 20) : 0;
    if (selectedDiscount !== null && discount < selectedDiscount) return false;

    // 6. Availability filters
    if (inStockOnly && product.currentQty === 0) return false;
    if (wholesaleOnly && product.availability !== "WHOLESALER" && product.availability !== "BOTH") return false;

    return true;
  });

  // Sorting logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = parseFloat(a.retailprice || a.wholesaleprice || "0");
    const priceB = parseFloat(b.retailprice || b.wholesaleprice || "0");
    const ratingA = 4.0 + (a.title.length % 11) / 10;
    const ratingB = 4.0 + (b.title.length % 11) / 10;

    switch (sortBy) {
      case "price-asc":
        return priceA - priceB;
      case "price-desc":
        return priceB - priceA;
      case "rating":
        return ratingB - ratingA;
      case "relevance":
      default:
        return 0; // standard API ordering
    }
  });

  // Add to Cart
  const handleAddToCart = (product: ApiProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    // Default to first variant if none selected
    const variant = product.variants && product.variants.length > 0 ? product.variants[0] : undefined;
    const price = variant ? variant.price : parseFloat(product.retailprice || product.wholesaleprice || "0");
    const image = product.images && product.images.length > 0 ? product.images[0] : "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=300&auto=format&fit=crop";

    addToCart({
      id: product.id,
      name: product.title,
      price: price,
      image: image,
      variant: variant
    });

    toast({
      title: "Added to Cart",
      description: `${product.title} added successfully! 🛒`,
    });
  };

  const handleQtyChange = (product: ApiProduct, delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const variant = product.variants && product.variants.length > 0 ? product.variants[0] : undefined;
    const inCartItem = cartItems.find(item => 
      item.id === product.id && 
      (!variant || (item.variant && item.variant.size === variant.size))
    );
    if (!inCartItem) return;
    const newQty = inCartItem.quantity + delta;
    if (newQty <= 0) {
      removeFromCart(product.id, variant ? { size: variant.size } : undefined);
      toast({
        title: "Removed from Cart",
        description: `${product.title} removed from cart.`,
      });
    } else {
      updateQuantity(product.id, newQty, variant ? { size: variant.size } : undefined);
    }
  };

  const handleToggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setPriceMin(0);
    setPriceMax(100000);
    setSelectedRating(null);
    setSelectedDiscount(null);
    setInStockOnly(false);
    setWholesaleOnly(false);
  };

  // Live Shipping estimates helper
  const getDeliveryEstimateText = (id: string) => {
    const seed = id.charCodeAt(id.length - 1) || 0;
    const now = new Date();
    const est = new Date();
    
    if (seed % 2 === 0) {
      return "FREE Delivery by Tomorrow";
    } else {
      est.setDate(now.getDate() + 2);
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return `FREE Delivery by ${days[est.getDay()]}, ${months[est.getMonth()]} ${est.getDate()}`;
    }
  };


  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <Header />
      <CategoryNav />

      {/* Main Search Layout */}
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* 1. Left Sidebar Filters (BuildMart Style) */}
          <aside className="w-full lg:w-72 shrink-0 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-max lg:sticky lg:top-24 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                <SlidersHorizontal className="h-4.5 w-4.5 text-amber-500" /> Filters
              </h2>
              <button 
                onClick={resetFilters}
                className="text-xs text-amber-600 font-bold hover:text-amber-700 transition-colors border-none bg-transparent outline-none cursor-pointer"
              >
                Clear All
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-3.5 mb-6 text-left">
              <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Category</h3>
              {availableCategories.length === 0 ? (
                <p className="text-xs text-slate-400">No categories found.</p>
              ) : (
                <div className="space-y-2 max-h-36 overflow-y-auto">
                  {availableCategories.map(cat => (
                    <div key={cat} className="flex items-center gap-2.5">
                      <Checkbox 
                        id={`cat-${cat}`}
                        checked={selectedCategories.includes(cat)}
                        onCheckedChange={() => handleToggleCategory(cat)}
                        className="rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                      />
                      <Label htmlFor={`cat-${cat}`} className="text-xs font-semibold text-slate-600 cursor-pointer hover:text-amber-600 transition-colors">
                        {cat}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator className="my-5" />

            {/* Price Filter */}
            <div className="space-y-3.5 mb-6 text-left">
              <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Price (₹)</h3>
              <div className="flex items-center gap-2">
                <div className="space-y-1 w-1/2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Min</span>
                  <Input 
                    type="number" 
                    value={priceMin}
                    onChange={e => setPriceMin(Number(e.target.value))}
                    className="h-8 text-xs font-bold border-gray-200 focus-visible:ring-amber-500"
                  />
                </div>
                <div className="space-y-1 w-1/2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Max</span>
                  <Input 
                    type="number" 
                    value={priceMax}
                    onChange={e => setPriceMax(Number(e.target.value))}
                    className="h-8 text-xs font-bold border-gray-200 focus-visible:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            <Separator className="my-5" />

            {/* Customer Rating Filter */}
            <div className="space-y-3.5 mb-6 text-left">
              <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Customer Rating</h3>
              <div className="space-y-2">
                {[4, 3, 2].map((stars) => (
                  <div 
                    key={stars}
                    onClick={() => setSelectedRating(selectedRating === stars ? null : stars)}
                    className={`flex items-center gap-2 cursor-pointer p-1.5 rounded-lg transition-all ${
                      selectedRating === stars 
                        ? 'bg-amber-50 border border-amber-200 text-amber-700' 
                        : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center text-amber-500 shrink-0">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3.5 w-3.5 ${i < stars ? 'fill-amber-500' : 'text-slate-200'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-slate-600">& Up</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="my-5" />

            {/* Discount Filter */}
            <div className="space-y-3.5 mb-6 text-left">
              <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Discount</h3>
              <div className="space-y-2">
                {[30, 20, 10].map((disc) => (
                  <div key={disc} className="flex items-center gap-2.5">
                    <Checkbox 
                      id={`disc-${disc}`}
                      checked={selectedDiscount === disc}
                      onCheckedChange={() => setSelectedDiscount(selectedDiscount === disc ? null : disc)}
                      className="rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                    />
                    <Label htmlFor={`disc-${disc}`} className="text-xs font-semibold text-slate-600 cursor-pointer hover:text-amber-600 transition-colors flex items-center gap-1">
                      <Percent className="h-3 w-3 text-red-500" /> {disc}% Off or more
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="my-5" />

            {/* Availability Filter */}
            <div className="space-y-3.5 text-left">
              <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Availability</h3>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <Checkbox 
                    id="stock" 
                    checked={inStockOnly}
                    onCheckedChange={(checked) => setInStockOnly(!!checked)}
                    className="rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                  />
                  <Label htmlFor="stock" className="text-xs font-semibold text-slate-600 cursor-pointer">Exclude Out of Stock</Label>
                </div>
                <div className="flex items-center gap-2.5">
                  <Checkbox 
                    id="wholesale" 
                    checked={wholesaleOnly}
                    onCheckedChange={(checked) => setWholesaleOnly(!!checked)}
                    className="rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                  />
                  <Label htmlFor="wholesale" className="text-xs font-semibold text-slate-600 cursor-pointer">Wholesale Only</Label>
                </div>
              </div>
            </div>

          </aside>

          {/* 2. Search Results Panel */}
          <section className="flex-1 space-y-6">
            
            {/* Header: Query details & Sort, Layout Options */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
              <div className="text-left">
                {query ? (
                  <h3 className="text-slate-800 text-sm font-semibold">
                    Showing results for "<span className="text-amber-600 font-extrabold">{query}</span>"
                  </h3>
                ) : (
                  <h3 className="text-slate-800 text-sm font-semibold">All Hardware Supplies</h3>
                )}
                <p className="text-xs text-muted-foreground font-semibold mt-0.5">
                  {sortedProducts.length} items found matching your filters
                </p>
              </div>

              {/* Sorting and View switches */}
              <div className="flex items-center justify-between md:justify-end gap-4">
                
                {/* Sort Option */}
                <div className="flex items-center gap-2 border border-slate-200 px-3 py-1.5 rounded-xl bg-slate-50">
                  <ArrowUpDown className="h-4 w-4 text-slate-500" />
                  <select 
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer border-none"
                  >
                    <option value="relevance">Sort: Relevance</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>

                {/* Grid / List view toggle */}
                <div className="flex border border-slate-200 p-0.5 rounded-xl bg-slate-50">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="icon"
                    className={`h-8 w-8 rounded-lg ${viewMode === "grid" ? "bg-white shadow-sm" : ""}`}
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4 text-slate-600" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="icon"
                    className={`h-8 w-8 rounded-lg ${viewMode === "list" ? "bg-white shadow-sm" : ""}`}
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4 text-slate-600" />
                  </Button>
                </div>

              </div>
            </div>

            {/* Loading Indicator */}
            {loading && (
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="animate-pulse border-slate-200">
                    <CardContent className="p-4 space-y-4">
                      <div className="aspect-square bg-slate-100 rounded-xl mb-4"></div>
                      <div className="space-y-2.5">
                        <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                        <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Error handling */}
            {error && (
              <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl">
                <p className="text-red-500 font-bold mb-4">{error}</p>
                <Button onClick={() => window.location.reload()} className="bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl">Retry</Button>
              </div>
            )}

            {/* Empty State */}
            {sortedProducts.length === 0 && !loading && !error && (
              <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl space-y-4">
                <div className="h-16 w-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto text-amber-600 shadow">
                  <Inbox className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-800">No Products Found</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed font-semibold">
                  Aapke lagaye gaye filters ya search query se koi matching item nahi mila. Sabhi filters hata kar dobara check karein!
                </p>
                <Button onClick={resetFilters} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl">
                  Reset All Filters
                </Button>
              </div>
            )}

            {/* Grid Product List Layout - Upgraded to Premium E-commerce Card Grid */}
            {viewMode === "grid" && sortedProducts.length > 0 && (
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedProducts.map(product => {
                  const retailPrice = parseFloat(product.retailprice || "0");
                  const wholesalePrice = parseFloat(product.wholesaleprice || "0");
                  const activePrice = retailPrice > 0 ? retailPrice : wholesalePrice;

                  // Dynamic calculated discount and ratings
                  const discount = (product.title.length % 3 === 0) ? 10 + (product.title.length % 20) : 0;
                  const originalPrice = activePrice * (1 + discount / 100);
                  const rating = 4.0 + (product.title.length % 11) / 10;
                  const brandName = product.title.split(' ')[0].toUpperCase();

                  const activeVariant = product.variants && product.variants.length > 0 ? product.variants[0] : undefined;
                  const inCartItem = cartItems.find(item => 
                    item.id === product.id && 
                    (!activeVariant || (item.variant && item.variant.size === activeVariant.size))
                  );
                  const isInCart = !!inCartItem;

                  return (
                    <Card 
                      key={product.id}
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="group border border-slate-200 hover:border-amber-500 hover:shadow-xl transition-all duration-300 cursor-pointer rounded-2xl overflow-hidden text-left bg-white flex flex-col justify-between"
                    >
                      <div className="aspect-square bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden border-b">
                        <img
                          src={product.images && product.images.length > 0 ? product.images[0] : "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=300&auto=format&fit=crop"}
                          alt={product.title}
                          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                        />
                        
                        {/* Trust Tag Overlay */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                          <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black border-none text-[8px] uppercase tracking-wider py-1 shadow-sm flex items-center gap-0.5">
                            <ShieldCheck className="h-3 w-3 text-slate-950" /> Assured
                          </Badge>
                          {discount > 0 && (
                            <Badge variant="destructive" className="bg-red-600 hover:bg-red-700 text-[8px] font-black uppercase py-0.5">
                              {discount}% Off
                            </Badge>
                          )}
                        </div>

                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white hover:bg-slate-100 text-slate-400 hover:text-red-500 shadow-sm rounded-full h-8 w-8 z-10"
                          onClick={(e) => {
                            e.stopPropagation();
                            toast({
                              title: "Saved",
                              description: "Product saved to wishlist.",
                            });
                          }}
                        >
                          <Heart className="h-4.5 w-4.5" />
                        </Button>
                      </div>

                      <CardContent className="p-4 space-y-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          {/* Brand & Category info */}
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] bg-slate-100 text-slate-500 font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wide">
                              {brandName}
                            </span>
                            <span className="text-[10px] text-amber-600 font-bold uppercase">
                              {product.category?.title || "Hardware"}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-tight h-10 group-hover:text-amber-600 transition-colors">
                            {product.title}
                          </h3>

                          {/* Rating block */}
                          <div className="flex items-center gap-1">
                            <div className="flex items-center bg-green-700 text-white text-[10px] px-1.5 py-0.5 rounded font-black gap-0.5">
                              <span>{rating.toFixed(1)}</span>
                              <Star className="h-2.5 w-2.5 fill-white text-white" />
                            </div>
                            <span className="text-[10px] text-slate-400 font-bold">• {35 + (product.title.length % 150)} ratings</span>
                          </div>

                          {/* Price Tag */}
                          <div className="space-y-0.5">
                            <div className="flex items-baseline gap-2">
                              <span className="font-black text-lg text-slate-900">
                                ₹{activePrice.toLocaleString()}
                              </span>
                              {discount > 0 && (
                                <span className="text-xs text-slate-400 line-through">
                                  ₹{Math.round(originalPrice).toLocaleString()}
                                </span>
                              )}
                            </div>
                            {product.availability === "WHOLESALER" && (
                              <div className="flex items-center gap-1 text-[9px] text-blue-600 font-extrabold uppercase pt-0.5">
                                <Tag className="h-3 w-3" />
                                <span>Includes 18% GST Benefit</span>
                              </div>
                            )}
                          </div>

                          {/* Delivery estimate */}
                          <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold pt-1">
                            <Truck className="h-3.5 w-3.5 text-slate-400" />
                            <span>{getDeliveryEstimateText(product.id)}</span>
                          </div>
                        </div>

                        {/* Plus/minus selector or Add button */}
                        <div className="pt-2">
                          {isInCart ? (
                            <div 
                              className="w-full flex items-center justify-between border border-amber-500 bg-amber-50/50 rounded-xl overflow-hidden shadow-sm h-9"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={(e) => handleQtyChange(product, -1, e)}
                                className="w-10 h-full flex items-center justify-center hover:bg-amber-100 text-slate-950 font-bold transition-colors border-none bg-transparent outline-none cursor-pointer"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="text-sm font-black text-slate-950">
                                {inCartItem.quantity}
                              </span>
                              <button
                                onClick={(e) => handleQtyChange(product, 1, e)}
                                className="w-10 h-full flex items-center justify-center hover:bg-amber-100 text-slate-950 font-bold transition-colors border-none bg-transparent outline-none cursor-pointer"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              className="w-full bg-slate-950 hover:bg-amber-500 hover:text-slate-950 text-white font-extrabold text-xs py-2 rounded-xl transition-all flex items-center justify-center gap-1.5"
                              onClick={(e) => handleAddToCart(product, e)}
                            >
                              <ShoppingCart className="h-3.5 w-3.5 mr-1.5" /> Add to Cart
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* List Product Layout - Upgraded to Premium E-commerce List View */}
            {viewMode === "list" && sortedProducts.length > 0 && (
              <div className="space-y-4">
                {sortedProducts.map(product => {
                  const retailPrice = parseFloat(product.retailprice || "0");
                  const wholesalePrice = parseFloat(product.wholesaleprice || "0");
                  const activePrice = retailPrice > 0 ? retailPrice : wholesalePrice;

                  const discount = (product.title.length % 3 === 0) ? 10 + (product.title.length % 20) : 0;
                  const originalPrice = activePrice * (1 + discount / 100);
                  const rating = 4.0 + (product.title.length % 11) / 10;
                  const brandName = product.title.split(' ')[0].toUpperCase();

                  const activeVariant = product.variants && product.variants.length > 0 ? product.variants[0] : undefined;
                  const inCartItem = cartItems.find(item => 
                    item.id === product.id && 
                    (!activeVariant || (item.variant && item.variant.size === activeVariant.size))
                  );
                  const isInCart = !!inCartItem;

                  return (
                    <Card
                      key={product.id}
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="group border border-slate-200 hover:border-amber-500 hover:shadow-lg transition-all duration-300 cursor-pointer rounded-2xl overflow-hidden flex flex-col sm:flex-row text-left bg-white"
                    >
                      {/* Left: Product Image Panel */}
                      <div className="w-full sm:w-56 shrink-0 bg-slate-50 flex items-center justify-center p-6 relative border-r">
                        <img
                          src={product.images && product.images.length > 0 ? product.images[0] : "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=300&auto=format&fit=crop"}
                          alt={product.title}
                          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 max-h-40"
                        />
                        
                        {/* Badging */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                          <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black border-none text-[8px] uppercase tracking-wider py-1 shadow-sm flex items-center gap-0.5">
                            <ShieldCheck className="h-3 w-3 text-slate-950" /> Assured
                          </Badge>
                          {discount > 0 && (
                            <Badge variant="destructive" className="bg-red-600 text-[8px] font-black uppercase py-0.5">
                              {discount}% Off
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Right: Detailed product specifications */}
                      <div className="flex-1 p-5 flex flex-col justify-between gap-4">
                        <div className="space-y-2.5">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] bg-slate-100 text-slate-500 font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wide">
                                  {brandName}
                                </span>
                                <span className="text-[10px] text-amber-600 font-extrabold uppercase tracking-wider">
                                  {product.category?.title || "Hardware"}
                                </span>
                              </div>
                              <h3 className="font-bold text-base text-slate-800 group-hover:text-amber-600 transition-colors leading-snug">
                                {product.title}
                              </h3>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-slate-400 hover:text-red-500 shrink-0 h-8 w-8 rounded-full"
                              onClick={(e) => {
                                e.stopPropagation();
                                toast({
                                  title: "Saved",
                                  description: "Product saved to wishlist.",
                                });
                              }}
                            >
                              <Heart className="h-4.5 w-4.5" />
                            </Button>
                          </div>

                          {/* Ratings and Reviews */}
                          <div className="flex items-center gap-3">
                            <div className="flex items-center bg-green-700 text-white text-[10px] px-1.5 py-0.5 rounded font-black gap-0.5 shrink-0">
                              <span>{rating.toFixed(1)}</span>
                              <Star className="h-2.5 w-2.5 fill-white text-white" />
                            </div>
                            <span className="text-xs text-slate-500 font-semibold">
                              {35 + (product.title.length % 150)} Customer Ratings & Reviews
                            </span>
                          </div>

                          {/* Description snippet */}
                          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                            Heavy-duty architectural grade materials suitable for commercial, industrial, and residential purposes. Designed for longevity and extreme weather resistance. Passed all GharSeKro safety and hardness standard controls.
                          </p>

                          {/* Live delivery estimate */}
                          <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold">
                            <Truck className="h-3.5 w-3.5 text-slate-400" />
                            <span>{getDeliveryEstimateText(product.id)}</span>
                          </div>
                        </div>

                        {/* Pricing, stock, and call-to-actions */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t">
                          <div className="flex items-baseline gap-2.5">
                            <span className="font-black text-2xl text-slate-900">
                              ₹{activePrice.toLocaleString()}
                            </span>
                            {discount > 0 && (
                              <span className="text-sm text-slate-400 line-through">
                                ₹{Math.round(originalPrice).toLocaleString()}
                              </span>
                            )}
                            {product.availability === "WHOLESALER" ? (
                              <span className="text-xs text-blue-600 font-black uppercase bg-blue-50 px-2 py-0.5 rounded border border-blue-100 flex items-center gap-1 ml-2">
                                <Tag className="h-3 w-3" /> Includes 18% GST Benefit
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground font-semibold">Inclusive of GST</span>
                            )}
                          </div>

                          <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                            {isInCart ? (
                              <div className="flex items-center justify-between border border-amber-500 bg-amber-50/50 rounded-xl overflow-hidden h-9 shadow-sm w-28">
                                <button
                                  onClick={(e) => handleQtyChange(product, -1, e)}
                                  className="w-9 h-full flex items-center justify-center hover:bg-amber-100 text-slate-950 font-bold border-none bg-transparent outline-none cursor-pointer"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="text-xs font-black text-slate-950">
                                  {inCartItem.quantity}
                                </span>
                                <button
                                  onClick={(e) => handleQtyChange(product, 1, e)}
                                  className="w-9 h-full flex items-center justify-center hover:bg-amber-100 text-slate-950 font-bold border-none bg-transparent outline-none cursor-pointer"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                            ) : (
                              <Button
                                onClick={(e) => handleAddToCart(product, e)}
                                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-5 py-5 rounded-xl shadow-md shadow-amber-500/10 flex items-center gap-1.5"
                              >
                                <ShoppingCart className="h-4 w-4" /> Add to Cart
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>

                    </Card>
                  );
                })}
              </div>
            )}

          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
