import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Star, Minus, Plus, Truck, ShieldCheck, Tag } from "lucide-react"
import { useCartContext } from "@/context/CartContext"
import { useEffect, useState } from "react"
import { getProducts, ApiProduct, ProductVariant, getHardwareSvgFallback } from "@/lib/api"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { useWishlistContext } from "@/context/WishlistContext"

interface ProductGridProps {
  category?: string
  wholesale?: boolean
}

interface SelectedVariants {
  [productId: string]: ProductVariant
}

const ProductGrid = ({ category, wholesale = false }: ProductGridProps) => {
  const { cartItems, addToCart, removeFromCart, updateQuantity } = useCartContext()
  const { toggleWishlist, isInWishlist } = useWishlistContext()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [products, setProducts] = useState<ApiProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedVariants, setSelectedVariants] = useState<SelectedVariants>({})

  const userType = localStorage.getItem('userType')
  const userGST = localStorage.getItem('userGST') || sessionStorage.getItem('wholesaleGST')
  const isWholesaler = userType === 'WHOLESALER' && !!userGST
  const isLoggedIn = !!localStorage.getItem('authToken')
  const viewingWholesale = wholesale || isWholesaler

  // Wholesale price show karo agar: wholesale page ho
  const hasWholesaleAccess = !!wholesale

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const fetchedProducts = await getProducts()
        if (fetchedProducts && fetchedProducts.length > 0) {
          setProducts(fetchedProducts)
        } else {
          setProducts([])
        }
        setError(null)
      } catch (err: any) {
        console.error('Failed to fetch products:', err)
        setProducts([])
        setError("Failed to load products. Please check backend connection.")
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const getNormalizedCategory = (catName: string) => {
    const s = catName.toLowerCase().trim();
    if (s === 'power-tools' || s === 'safety-equipment' || s === 'tools-&-safety-equipments') {
      return ['tools & safety equipments', 'tools-&-safety-equipments'];
    }
    if (s === 'plumbing' || s === 'plumbing-fitting') {
      return ['plumbing fitting', 'plumbing-fitting'];
    }
    if (s === 'electricals' || s === 'electrical') {
      return ['electrical'];
    }
    if (s === 'cement-&-sand' || s === 'building-material-(cement,-sand,-iron)') {
      return ['building material (cement, sand, iron)', 'cement-&-sand'];
    }
    if (s === 'paints' || s === 'paint') {
      return ['paint'];
    }
    if (s === 'hardware-&-locks') {
      return ['hardware & locks'];
    }
    return [s];
  }

  const filteredByCategory = category
    ? products.filter(product => {
        if (!product.category || !product.category.title) return false;
        const productCat = product.category.title.toLowerCase().trim();
        const targets = getNormalizedCategory(category);
        return targets.some(target => 
          productCat === target || 
          productCat.replace(/\s+/g, '-') === target
        );
      })
    : products

  const filteredProducts = filteredByCategory.filter((product) => {
    const avail = product.availability;
    if (!avail) return true;
    
    // Treat legacy / unknown values (like "In Stock") as visible to everyone
    if (avail !== 'RETAILER' && avail !== 'WHOLESALE' && avail !== 'WHOLESALER' && avail !== 'BOTH') {
      return true;
    }
    
    if (avail === 'BOTH') return true;
    if (viewingWholesale) return avail === 'WHOLESALE' || avail === 'WHOLESALER';
    return avail === 'RETAILER';
  })

  const getProductPrice = (product: ApiProduct) => {
    const variant = selectedVariants[product.id]

    if (variant) {
      if (hasWholesaleAccess && variant.wholesaleprice !== undefined && variant.wholesaleprice !== null) {
        return typeof variant.wholesaleprice === 'string' ? parseFloat(variant.wholesaleprice) : variant.wholesaleprice
      }
      return typeof variant.price === 'string' ? parseFloat(variant.price) : variant.price
    }

    if (hasWholesaleAccess && product.wholesaleprice) {
      return parseFloat(product.wholesaleprice)
    }
    return parseFloat(product.retailprice || '0')
  }

  const handleVariantSelect = (productId: string, variant: ProductVariant, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedVariants(prev => ({
      ...prev,
      [productId]: variant
    }))
  }

  const getProductImage = (product: ApiProduct) => {
    return product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=300&auto=format&fit=crop'
  }

  const handleAddToCart = (product: ApiProduct, e: React.MouseEvent) => {
    e.stopPropagation()
    // If product has variants and no variant is selected, default to the first one automatically for a smooth quick-add experience!
    let variant = selectedVariants[product.id]
    if (product.variants && product.variants.length > 0 && !variant) {
      variant = product.variants[0]
      setSelectedVariants(prev => ({
        ...prev,
        [product.id]: product.variants![0]
      }))
    }

    const price = getProductPrice(product)
    
    addToCart({
      id: product.id,
      name: product.title,
      price: price,
      image: getProductImage(product),
      variant: variant,
      isWholesale: hasWholesaleAccess
    })

    toast({
      title: "Added to Cart",
      description: `${product.title} ${variant ? `(${variant.size})` : ''} added successfully! 🛒`,
    })
  }

  const handleQtyChange = (product: ApiProduct, delta: number, e: React.MouseEvent) => {
    e.stopPropagation()
    const variant = selectedVariants[product.id] || (product.variants && product.variants.length > 0 ? product.variants[0] : undefined)
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
      })
    } else {
      updateQuantity(product.id, newQty, variant ? { size: variant.size } : undefined);
    }
  }

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`)
  }

  // Live Relative Delivery Projections helper
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
  }

  if (loading) {
    return (
      <div className="w-full">
        {/* Desktop Loading */}
        <div className="hidden sm:block container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <div className="h-8 bg-slate-200 rounded w-64 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="animate-pulse border-slate-200">
                <CardContent className="p-4 space-y-4">
                  <div className="aspect-square bg-slate-100 rounded-xl"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                    <div className="h-8 bg-slate-100 rounded w-full"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Mobile Loading */}
        <div className="sm:hidden bg-slate-50">
          <div className="px-3 py-3 border-b bg-white">
            <div className="h-5 bg-slate-200 rounded w-40 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 gap-2 p-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl overflow-hidden p-3 space-y-3">
                <div className="aspect-square bg-slate-100 rounded-lg animate-pulse"></div>
                <div className="h-3 bg-slate-100 rounded w-full animate-pulse"></div>
                <div className="h-3 bg-slate-100 rounded w-1/2 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="w-full bg-slate-50 py-16">
        <div className="container mx-auto px-4 text-center max-w-2xl relative overflow-hidden bg-white border border-slate-200 p-8 rounded-3xl shadow-xl group hover-pulse-glow">
          {/* Ambient lighting spots */}
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />

          <div className="space-y-6 py-8 relative z-10 flex flex-col items-center">
            <div className="h-16 w-16 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-center text-amber-600 shadow-md">
              <ShieldCheck className="h-8 w-8 text-amber-500" />
            </div>
            <div className="space-y-2 max-w-md">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">🔒 Premium Materials Catalog Locked</h3>
              <p className="text-xs text-slate-500 font-extrabold uppercase tracking-wider leading-relaxed">
                Unlock our entire database of certified power tools, cement, sand, electricals, paints, plumbing, and safety wear by logging in.
              </p>
            </div>
            <Button
              onClick={() => navigate("/login")}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-6 py-3 rounded-2xl shadow-lg shadow-amber-500/20 text-xs uppercase tracking-widest border-none transition-all duration-200 hover:scale-102 cursor-pointer"
            >
              Log In or Register to Browse
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Desktop/Tablet View - Premium E-commerce Card Grid */}
      <div className="hidden sm:block container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <h2 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight">
            {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Products` :
              viewingWholesale ? 'Wholesale Hardware Supplies' : 'Featured Hardware Supplies'}
          </h2>
          <Button variant="outline" className="text-xs font-black uppercase rounded-xl hover:bg-slate-100 border-slate-200">
            View All
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const price = getProductPrice(product)
            const isWholesaleProduct = hasWholesaleAccess && product.wholesaleprice
            const brandName = product.title.split(' ')[0].toUpperCase()
            
            // Calculate dummy ratings
            const ratingScore = 4.0 + (product.title.length % 11) / 10
            const reviewsCount = 45 + (product.title.length % 350)
            
            // Determine active variant
            const activeVariant = selectedVariants[product.id] || (product.variants && product.variants.length > 0 ? product.variants[0] : undefined);
            
            // Cart state checking
            const inCartItem = cartItems.find(item => 
              item.id === product.id && 
              (!activeVariant || (item.variant && item.variant.size === activeVariant.size))
            );
            const isInCart = !!inCartItem;
            
            return (
              <Card 
                key={product.id} 
                onClick={() => handleProductClick(product.id)}
                className="group card-glossy hover-lift gold-glow cursor-pointer rounded-2xl overflow-hidden flex flex-col bg-white text-left transition-all duration-300 border border-slate-200"
              >                {/* Image and badges panel */}
                <div className="relative aspect-square w-full bg-slate-50 flex items-center justify-center p-6 border-b overflow-hidden">
                  <img
                    src={getProductImage(product)}
                    alt={product.title}
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = getHardwareSvgFallback(product.title)
                    }}
                  />

                  {/* Trust Badge & Discount overlay */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                    <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black border-none text-[8.5px] uppercase tracking-wider py-1 shadow-sm flex items-center gap-0.5">
                      <ShieldCheck className="h-3 w-3 text-slate-950" /> Assured
                    </Badge>
                    {isWholesaleProduct && (
                      <Badge className="bg-blue-600 text-white font-extrabold border-none text-[8px] uppercase tracking-wider py-0.5">
                        Bulk Savings
                      </Badge>
                    )}
                  </div>

                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-3 right-3 bg-white hover:bg-slate-100 shadow-sm rounded-full h-8 w-8 z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist({
                        id: product.id,
                        title: product.title,
                        price: price,
                        image: getProductImage(product)
                      });
                    }}
                  >
                    <Heart className={`h-4.5 w-4.5 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-slate-400 hover:text-red-500'}`} />
                  </Button>
                </div>

                {/* Info and action panel */}
                <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {/* Brand & Category */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] bg-slate-100 text-slate-500 font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wide">
                        {brandName}
                      </span>
                      <span className="text-[10px] text-amber-600 font-bold uppercase">
                        {product.category?.title || 'Hardware'}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-sm text-slate-800 line-clamp-2 leading-tight h-10 group-hover:text-amber-600 transition-colors">
                      {product.title}
                    </h3>

                    {/* Ratings */}
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center bg-green-700 text-white text-[10px] px-1.5 py-0.5 rounded font-black gap-0.5 shadow-sm">
                        <span>{ratingScore.toFixed(1)}</span>
                        <Star className="h-2.5 w-2.5 fill-white text-white" />
                      </div>
                      <span className="text-slate-400 font-bold text-[10px]">({reviewsCount} Reviews)</span>
                    </div>

                    {/* Pricing */}
                    <div className="space-y-0.5">
                      <div className="flex items-baseline gap-2">
                        <span className="font-black text-lg text-slate-900">
                          ₹{price.toLocaleString()}
                        </span>
                        {isWholesaleProduct && product.retailprice && (
                          <span className="text-xs text-slate-400 line-through">
                            ₹{parseFloat(product.retailprice).toLocaleString()}
                          </span>
                        )}
                        {!isWholesaleProduct && (
                          <span className="text-xs text-slate-400 line-through">
                            ₹{Math.round(price * 1.3).toLocaleString()}
                          </span>
                        )}
                        <span className="text-xs font-black text-green-600">
                          {isWholesaleProduct && product.retailprice
                            ? `${Math.round((1 - parseFloat(product.wholesaleprice!) / parseFloat(product.retailprice)) * 100)}% OFF`
                            : '23% OFF'}
                        </span>
                      </div>
                      
                      {isWholesaleProduct ? (
                        <div className="flex items-center gap-1 text-[9px] text-blue-600 font-extrabold uppercase">
                          <Tag className="h-3 w-3" />
                          <span>Wholesale Price · 18% GST Benefit</span>
                        </div>
                      ) : (
                        <span className="text-[9px] text-slate-400 font-bold block uppercase">Inclusive of all taxes</span>
                      )}
                    </div>

                    {/* Live delivery estimate */}
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold pt-1.5">
                      <Truck className="h-3.5 w-3.5 text-slate-400" />
                      <span>{getDeliveryEstimateText(product.id)}</span>
                    </div>

                    {/* Variants chips */}
                    {product.variants && product.variants.length > 0 && (
                      <div className="pt-2.5 border-t" onClick={(e) => e.stopPropagation()}>
                        <label className="text-[9px] font-black uppercase text-slate-500 block mb-1.5">
                          Select Size:
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {product.variants.map((v) => (
                            <button
                              key={v.size}
                              onClick={(e) => handleVariantSelect(product.id, v, e)}
                              className={`px-2 py-1 text-[10px] font-extrabold rounded-lg border transition-all ${
                                activeVariant?.size === v.size
                                  ? 'bg-amber-500 border-amber-500 text-slate-950 shadow-sm'
                                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 text-slate-600'
                              }`}
                            >
                              <span>{v.size}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Add to Cart button or Stateful inline counter */}
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
                        className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs py-2 rounded-xl transition-all shadow-md shadow-amber-500/10 flex items-center justify-center gap-1.5"
                        onClick={(e) => handleAddToCart(product, e)}
                      >
                        <ShoppingCart className="h-3.5 w-3.5" />
                        Add to Cart
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-slate-500 text-sm">No products found</p>
          </div>
        )}
      </div>

      {/* Mobile View - Flipkart Style E-commerce Row Layout */}
      <div className="sm:hidden bg-slate-100 min-h-screen">
        <div className="px-4 py-3.5 bg-white border-b sticky top-0 z-10 text-left">
          <h2 className="text-base font-black text-slate-800 uppercase tracking-wide">
            {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Products` :
              viewingWholesale ? 'Wholesale supplies' : 'Hardware supplies'}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-[1px] bg-slate-200">
          {filteredProducts.map((product) => {
            const price = getProductPrice(product)
            const isWholesaleProduct = hasWholesaleAccess && product.wholesaleprice
            
            const brandName = product.title.split(' ')[0].toUpperCase()
            const ratingScore = 4.0 + (product.title.length % 11) / 10
            
            const activeVariant = selectedVariants[product.id] || (product.variants && product.variants.length > 0 ? product.variants[0] : undefined);
            
            const inCartItem = cartItems.find(item => 
              item.id === product.id && 
              (!activeVariant || (item.variant && item.variant.size === activeVariant.size))
            );
            const isInCart = !!inCartItem;

            return (
              <div
                key={product.id}
                className="bg-white p-3 space-y-3.5 active:bg-slate-50 transition-colors flex flex-col justify-between text-left"
                onClick={() => handleProductClick(product.id)}
              >
                {/* Image & Assured Overlay */}
                <div className="relative bg-white aspect-square flex items-center justify-center p-2">
                  <img
                    src={getProductImage(product)}
                    alt={product.title}
                    className="w-full h-full object-contain mix-blend-multiply"
                    onError={(e) => {
                      e.currentTarget.src = getHardwareSvgFallback(product.title)
                    }}
                  />
                  <div className="absolute top-1 left-1">
                    <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black border-none text-[7.5px] px-1 py-0 h-4 uppercase shadow-sm">
                      Assured
                    </Badge>
                  </div>
                  
                  <button
                    className="absolute top-1 right-1 p-1 bg-white rounded-full shadow border border-slate-100 z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist({
                        id: product.id,
                        title: product.title,
                        price: price,
                        image: getProductImage(product)
                      });
                    }}
                  >
                    <Heart className={`h-3 w-3 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-slate-400 hover:text-red-500'}`} />
                  </button>
                </div>

                {/* Information blocks */}
                <div className="space-y-2 pt-1 border-t border-slate-50 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[9px] font-bold text-slate-400">
                      <span>{brandName}</span>
                      <span className="text-amber-600">{product.category?.title || 'Tools'}</span>
                    </div>
                    
                    <h3 className="text-[11px] font-bold text-slate-800 line-clamp-2 leading-tight h-8">
                      {product.title}
                    </h3>
                  </div>

                  <div className="space-y-1">
                    {/* Rating badge */}
                    <div className="flex items-center gap-1">
                      <div className="flex items-center bg-green-700 text-white text-[9px] px-1 py-0.2 rounded font-black gap-0.5 shrink-0">
                        <span>{ratingScore.toFixed(1)}</span>
                        <Star className="h-2 w-2 fill-white" />
                      </div>
                      <span className="text-[9px] text-slate-400 font-bold">({45 + (product.title.length % 150)})</span>
                    </div>

                    {/* Price Tag */}
                    <div className="flex items-baseline gap-1 pt-0.5 flex-wrap">
                      <span className="font-black text-[13px] text-slate-950">
                        ₹{price.toLocaleString()}
                      </span>
                      <span className="text-[9px] text-slate-400 line-through">
                        ₹{Math.round(price * 1.3).toLocaleString()}
                      </span>
                    </div>

                    {/* Delivery estimate */}
                    <div className="text-[8.5px] text-slate-500 font-bold leading-tight">
                      FREE Delivery **Tomorrow**
                    </div>

                    {/* Variant bubble chips */}
                    {product.variants && product.variants.length > 0 && (
                      <div className="pt-1.5 border-t border-slate-100" onClick={(e) => e.stopPropagation()}>
                        <div className="flex flex-wrap gap-1">
                          {product.variants.map((v) => (
                            <button
                              key={v.size}
                              onClick={(e) => handleVariantSelect(product.id, v, e)}
                              className={`px-1.5 py-0.5 text-[8px] font-black rounded border transition-all ${
                                activeVariant?.size === v.size
                                  ? 'bg-amber-500 border-amber-500 text-slate-950'
                                  : 'border-slate-200 bg-slate-50 text-slate-500'
                              }`}
                            >
                              <span>{v.size}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Add to Cart or counter */}
                  <div className="pt-2" onClick={(e) => e.stopPropagation()}>
                    {isInCart ? (
                      <div className="w-full flex items-center justify-between border border-amber-500 bg-amber-50/50 rounded-lg overflow-hidden h-7 shadow-sm">
                        <button
                          onClick={(e) => handleQtyChange(product, -1, e)}
                          className="w-8 h-full flex items-center justify-center hover:bg-amber-100 text-slate-950 font-bold border-none bg-transparent outline-none"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-xs font-black text-slate-950">
                          {inCartItem.quantity}
                        </span>
                        <button
                          onClick={(e) => handleQtyChange(product, 1, e)}
                          className="w-8 h-full flex items-center justify-center hover:bg-amber-100 text-slate-950 font-bold border-none bg-transparent outline-none"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        className="w-full py-1.5 text-[10px] font-black text-slate-950 bg-amber-500 hover:bg-amber-600 rounded-lg shadow transition-colors uppercase tracking-wide border-none cursor-pointer flex items-center justify-center gap-1"
                        onClick={(e) => handleAddToCart(product, e)}
                      >
                        <ShoppingCart className="h-3 w-3" /> Add
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ProductGrid