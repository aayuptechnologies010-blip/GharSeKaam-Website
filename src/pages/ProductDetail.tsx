import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getProductDetail, getProducts, ApiProductDetail, ApiProduct, getHardwareSvgFallback } from '@/lib/api'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCartContext } from '@/context/CartContext'
import { useWishlistContext } from '@/context/WishlistContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  ShoppingCart,
  Star,
  ArrowLeft,
  MapPin,
  Shield,
  Package,
  Minus,
  Plus,
  Heart,
  Share2,
  Truck,
  CheckCircle,
  HelpCircle,
  ThumbsUp
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

// Mock Details for All Products (BuildMart-like High-Fidelity Dummy Data)
const MOCK_DEAL_DETAILS: Record<string, any> = {};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addToCart } = useCartContext()
  const { toggleWishlist, isInWishlist } = useWishlistContext()
  const { toast } = useToast()

  const [product, setProduct] = useState<ApiProductDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState<string>('')
  const [purchaseMode, setPurchaseMode] = useState<'piece' | 'bundle'>('piece')
  
  // Related products states
  const [relatedProducts, setRelatedProducts] = useState<ApiProduct[]>([])
  
  // Delivery Pincode checker states
  const [pincode, setPincode] = useState(() => localStorage.getItem('userPincode') || '400001');
  const [pincodeCity, setPincodeCity] = useState(() => localStorage.getItem('userPincodeCity') || 'Mumbai');
  const [tempPincode, setTempPincode] = useState(pincode);
  const [pincodeChecked, setPincodeChecked] = useState(true);
  const [pincodeError, setPincodeError] = useState("");
  
  // Hover Zoom state
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Check if user is logged in and their type
  const userType = localStorage.getItem('userType')
  const userGST = localStorage.getItem('userGST') || sessionStorage.getItem('wholesaleGST')
  const isWholesaler = userType === 'WHOLESALER' && !!userGST
  const isLoggedIn = !!localStorage.getItem('authToken')

  useEffect(() => {
    if (!isLoggedIn) {
      toast({
        title: "Access Restricted",
        description: "Please login or register to view product details and pricing.",
        variant: "destructive"
      });
      navigate("/login", { replace: true });
      return;
    }

    if (!id) return

    const fetchProduct = async () => {
      try {
        setLoading(true)
        
        // Fetch from real backend API
        const productDetail = await getProductDetail(id)
        setProduct(productDetail)
        setError(null)

        // Fetch related products
        try {
          const allProducts = await getProducts();
          if (allProducts && allProducts.length > 0) {
            const viewingWholesale = isWholesaler || !!sessionStorage.getItem('wholesaleGST');
            const filteredRelated = allProducts.filter(p => {
              if (p.id === id) return false;
              const avail = p.availability;
              if (!avail) return true;
              
              if (avail !== 'RETAILER' && avail !== 'WHOLESALE' && avail !== 'WHOLESALER' && avail !== 'BOTH') {
                return true;
              }
              
              if (avail === 'BOTH') return true;
              if (viewingWholesale) return avail === 'WHOLESALE' || avail === 'WHOLESALER';
              return avail === 'RETAILER';
            });
            setRelatedProducts(filteredRelated.slice(0, 4));
          } else {
            setRelatedProducts([]);
          }
        } catch (relErr) {
          console.warn('Failed to fetch related products from API:', relErr);
          setRelatedProducts([]);
        }

      } catch (err: any) {
        console.error('Failed to fetch product details:', err)
        setError(err?.message || 'Failed to load product details')
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()

    // Sync Pincode updates from Header
    const handlePincodeUpdate = () => {
      const savedPin = localStorage.getItem('userPincode') || '400001';
      const savedCity = localStorage.getItem('userPincodeCity') || 'Mumbai';
      setPincode(savedPin);
      setTempPincode(savedPin);
      setPincodeCity(savedCity);
      setPincodeChecked(true);
    };
    window.addEventListener('pincode-updated', handlePincodeUpdate);

    return () => {
      window.removeEventListener('pincode-updated', handlePincodeUpdate);
    };
  }, [id])

  const getProductPrice = () => {
    if (!product) return 0

    const hasWholesaleAccess = false

    if (selectedVariant && product.variants) {
      const variant = product.variants.find(v => v.size === selectedVariant)
      if (variant) {
        if (purchaseMode === 'bundle') {
          if (hasWholesaleAccess && (variant as any).bundleWholesalePrice) {
            return typeof (variant as any).bundleWholesalePrice === 'string'
              ? parseFloat((variant as any).bundleWholesalePrice)
              : (variant as any).bundleWholesalePrice
          }
          if ((variant as any).bundlePrice) {
            return typeof (variant as any).bundlePrice === 'string'
              ? parseFloat((variant as any).bundlePrice)
              : (variant as any).bundlePrice
          }
        }
        if (hasWholesaleAccess && variant.wholesaleprice !== undefined && variant.wholesaleprice !== null) {
          return typeof variant.wholesaleprice === 'string' ? parseFloat(variant.wholesaleprice) : variant.wholesaleprice
        }
        return typeof variant.price === 'string' ? parseFloat(variant.price) : variant.price
      }
    }

    if (hasWholesaleAccess && product.wholesaleprice) {
      return parseFloat(product.wholesaleprice)
    }
    return parseFloat(product.retailprice || "0")
  }

  const getOriginalPrice = () => {
    if (!product) return 0
    const price = getProductPrice()
    const discountedPrice = price * (1 + (product.discount || 0) / 100)
    return discountedPrice
  }

  const handleAddToCart = () => {
    if (!product) return

    const price = getProductPrice()
    const variant = selectedVariant && product.variants 
      ? product.variants.find(v => v.size === selectedVariant) 
      : undefined

    const bundleQty = variant && purchaseMode === 'bundle' ? (variant as any).bundleQty : null
    const itemName = bundleQty
      ? `${product.title}${variant ? ` (${variant.size})` : ''} — Bundle of ${bundleQty} pcs`
      : product.title

    const finalVariant = variant && purchaseMode === 'bundle' ? {
      ...variant,
      price: price.toString(),
      wholesaleprice: price.toString(),
      isBundle: true,
      bundleQty: bundleQty.toString()
    } : variant

    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: bundleQty ? `${product.id}-bundle-${variant?.size}` : product.id,
        name: itemName,
        price: price,
        image: product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1608613304899-ea8098577e38?auto=format&fit=crop&w=400&q=80',
        variant: finalVariant,
        isWholesale: false
      })
    }

    toast({
      title: "Added to Cart",
      description: `${quantity} × ${itemName} added successfully! 🛒`,
    })
  }

  const handleQuantityChange = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta))
  }

  // Pincode validation & city match
  const handleCheckPincode = async () => {
    if (!/^\d{6}$/.test(tempPincode)) {
      setPincodeError("Please enter a valid 6-digit pincode.");
      setPincodeChecked(false);
      return;
    }

    const pincodeMap: Record<string, string> = {
      "110001": "New Delhi",
      "400001": "Mumbai",
      "560001": "Bengaluru",
      "600001": "Chennai",
      "700001": "Kolkata",
      "500001": "Hyderabad"
    };

    let city = tempPincode.startsWith("273") ? "Gorakhpur" : (pincodeMap[tempPincode] || "India");

    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${tempPincode}`);
      const data = await res.json();
      if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice?.[0]) {
        city = data[0].PostOffice[0].District || city;
      }
    } catch (e) {
      console.warn("Pincode API lookup failed, using fallback:", e);
    }

    localStorage.setItem('userPincode', tempPincode);
    localStorage.setItem('userPincodeCity', city);
    setPincode(tempPincode);
    setPincodeCity(city);
    setPincodeError("");
    setPincodeChecked(true);

    // Trigger update event
    window.dispatchEvent(new Event('pincode-updated'));
  };

  // Hover zoom handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setHoverPosition({ x, y });
  };

  // Calculate dynamic delivery date
  const getDeliveryDate = () => {
    const isGorakhpur = pincode.startsWith("273") || pincodeCity === "Gorakhpur";
    const daysToAdd = isGorakhpur ? 0 : (pincode === "400001" ? 1 : 3);
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    const dateStr = date.toLocaleDateString("en-IN", { weekday: 'long', month: 'short', day: 'numeric' });
    return isGorakhpur ? `Today (within 2-3 hours)` : dateStr;
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="aspect-square bg-gray-200 rounded-lg"></div>
                <div className="flex gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="w-20 h-20 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded w-1/3 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (error || !product) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error || 'Product not found'}</p>
            <Button onClick={() => navigate(-1)}>Go Back</Button>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const price = getProductPrice()
  const originalPrice = getOriginalPrice()
  const discount = product.discount || 0
  const isWholesaleProduct = false

  // Spec list construction
  const specifications = (product as any).specifications || {
    "Brand": product.shopkeeper?.shopname.includes("Authorized") ? "Authorized Supplier" : "Premium Supplier",
    "Availability Mode": product.availability || "Retail & Wholesale",
    "Packaging": product.unit ? `Standard 1 ${product.unit}` : "Bulk Boxed",
    "Safety Standards": "ISI Certified Quality"
  };

  // Bullet highlights list construction
  const highlights = (product as any).highlights || [
    "High-grade architectural quality tested for high durability.",
    "Comes with verified quality check standards by GharSeKro.",
    "Free expert site consultation and bulk estimates available.",
    "Laminated package shield protection to prevent weathering."
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-left">
      <Header />
      <div className="container mx-auto px-4 py-8">
        
        {/* Breadcrumb / Back Button */}
        <div className="flex items-center gap-2 mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-xs font-bold hover:bg-slate-100 rounded-xl"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Products
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* 1. Left Image Zoom Panel (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
            
            {/* Main Active Image with Zoom effect */}
            <div 
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="aspect-square bg-white border border-slate-200 rounded-3xl overflow-hidden relative cursor-zoom-in flex items-center justify-center p-6 shadow-sm"
            >

              <img
                src={product.images && product.images.length > 0 ? product.images[selectedImage] : 'https://images.unsplash.com/photo-1608613304899-ea8098577e38?auto=format&fit=crop&w=400&q=80'}
                alt={product.title}
                className={`w-full h-full object-contain mix-blend-multiply transition-transform duration-fast ${isHovered ? 'scale-150' : 'scale-100'}`}
                style={isHovered ? {
                  transformOrigin: `${hoverPosition.x}% ${hoverPosition.y}%`
                } : undefined}
                onError={(e) => {
                  e.currentTarget.src = getHardwareSvgFallback(product.title)
                }}
              />
              
              {/* Badges Overlays */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                {discount > 0 && (
                  <Badge variant="destructive" className="bg-red-600 font-black uppercase text-[10px]">
                    {discount}% OFF
                  </Badge>
                )}
                {isWholesaleProduct && (
                  <Badge className="bg-slate-900 text-amber-500 font-bold text-[9px] uppercase border border-amber-500/20">
                    Bulk Special Rate
                  </Badge>
                )}
              </div>
            </div>

            {/* Interactive Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1 pt-1 justify-start">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all p-1 bg-white shadow-sm ${
                      selectedImage === index ? 'border-amber-500 scale-105 shadow-amber-100' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-contain mix-blend-multiply"
                      onError={(e) => {
                        e.currentTarget.src = getHardwareSvgFallback(product.title)
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Middle Details Panel (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="space-y-2 text-left">
              <Badge variant="outline" className="border-amber-500/20 bg-amber-50 text-amber-700 font-extrabold uppercase text-[9px]">
                {product.category?.title || "Hardware"}
              </Badge>
              <h1 className="text-2xl font-black text-slate-800 leading-snug">{product.title}</h1>
              
              {/* Ratings */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-green-700 text-white text-[10px] px-1.5 py-0.5 rounded font-black gap-0.5">
                  <span>4.7</span>
                  <Star className="h-2.5 w-2.5 fill-white text-white" />
                </div>
                <span className="text-xs text-slate-500 font-semibold">• 142 ratings & reviews</span>
              </div>
            </div>

            <Separator />

            {/* Pricing Section */}
            <div className="space-y-2 text-left">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-slate-900">₹{price.toLocaleString()}</span>
                {discount > 0 && (
                  <>
                    <span className="text-lg text-slate-400 line-through">
                      ₹{Math.round(originalPrice).toLocaleString()}
                    </span>
                    <Badge variant="secondary" className="bg-red-50 text-red-600 border border-red-100 text-[10px] font-bold">
                      Save ₹{Math.round(originalPrice - price).toLocaleString()}
                    </Badge>
                  </>
                )}
              </div>
              <p className="text-xs text-muted-foreground font-semibold">
                Inclusive of all taxes • Base rate per <span className="font-extrabold text-slate-700">{product.unit || 'piece'}</span>
              </p>
            </div>

            <Separator />

            {/* Key Highlights list (BuildMart style) */}
            <div className="space-y-3.5 text-left">
              <h3 className="font-bold text-slate-800 text-sm">Key Highlights</h3>
              <ul className="space-y-2.5 text-slate-600 text-xs">
                {highlights.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <span className="leading-normal font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            {/* Technical Specifications Table */}
            <div className="space-y-4 text-left">
              <h3 className="font-bold text-slate-800 text-sm">Product Specifications</h3>
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
                <table className="w-full text-xs">
                  <tbody>
                    {Object.entries(specifications).map(([key, val], idx) => (
                      <tr key={key} className={idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                        <td className="px-4 py-3 font-bold text-slate-500 border-r w-1/3 text-left">{key}</td>
                        <td className="px-4 py-3 font-extrabold text-slate-800 text-left">{val as string}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* 3. Right Purchase & Delivery Sidebox (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-24">
            
            {/* Purchase Control Card */}
            <Card className="border border-slate-200 shadow-lg rounded-3xl overflow-hidden text-left bg-white">
              <CardContent className="p-6 space-y-5">
                
                {/* Stock status indicator */}
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 bg-green-500 rounded-full animate-ping"></div>
                  <span className="text-sm font-extrabold text-green-600 uppercase tracking-wider">In Stock</span>
                </div>

                <div className="flex justify-between items-baseline pt-1">
                  <span className="text-xs font-semibold text-slate-400">Total Price:</span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-slate-900">₹{(price * quantity).toLocaleString()}</span>
                    {purchaseMode === 'bundle' && selectedVariant && (() => {
                      const v = product.variants?.find(x => x.size === selectedVariant)
                      const bQty = v ? (v as any).bundleQty : null
                      return bQty ? (
                        <span className="block text-[10px] text-amber-600 font-bold">
                          {quantity} packet × {bQty} pcs = {quantity * bQty} pcs total
                        </span>
                      ) : null
                    })()}
                  </div>
                </div>

                {/* Variant selector */}
                {product.variants && product.variants.length > 0 && (
                  <div className="space-y-3">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Select Variant / Size:</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {product.variants.map((v) => (
                        <button
                          key={v.size}
                          onClick={() => { setSelectedVariant(v.size); setPurchaseMode('piece'); }}
                          className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all ${
                            selectedVariant === v.size
                              ? 'border-amber-500 bg-amber-50 text-amber-700 shadow-sm'
                              : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <span>{v.size}</span>
                          <span className="block text-[10px] text-muted-foreground font-semibold">₹{v.price.toLocaleString()}/pc</span>
                        </button>
                      ))}
                    </div>

                    {/* Bundle / Packet Toggle — only shows if selected variant has bundleQty */}
                    {selectedVariant && (() => {
                      const selV = product.variants?.find(x => x.size === selectedVariant)
                      const bQty = selV ? (selV as any).bundleQty : null
                      const bPrice = selV ? (selV as any).bundlePrice : null
                      if (!bQty) return null
                      return (
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Purchase Mode:</Label>
                          <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-slate-50 p-0.5 gap-0.5">
                            <button
                              onClick={() => setPurchaseMode('piece')}
                              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                                purchaseMode === 'piece'
                                  ? 'bg-white text-slate-800 shadow-sm border border-slate-200'
                                  : 'text-slate-500 hover:text-slate-700'
                              }`}
                            >
                              🔩 Piece
                            </button>
                            <button
                              onClick={() => setPurchaseMode('bundle')}
                              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                                purchaseMode === 'bundle'
                                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                                  : 'text-slate-500 hover:text-slate-700'
                              }`}
                            >
                              📦 Bundle
                            </button>
                          </div>
                          {purchaseMode === 'bundle' && (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-1">
                              <p className="text-xs font-black text-amber-700">📦 Bundle of {bQty} pcs</p>
                              <p className="text-sm font-black text-slate-900">₹{Number(bPrice).toLocaleString()} <span className="text-[10px] font-semibold text-slate-400">per packet</span></p>
                              {selV && (selV as any).price && (
                                <p className="text-[10px] text-green-700 font-bold">
                                  Save ₹{Math.max(0, Math.round((Number((selV as any).price) * bQty) - Number(bPrice))).toLocaleString()} vs buying loose!
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })()}
                  </div>
                )}

                {/* Quantity selector */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Quantity:</span>
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="h-8 w-8 hover:bg-slate-100 rounded-none border-none"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="px-4 text-xs font-black text-slate-800">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuantityChange(1)}
                      className="h-8 w-8 hover:bg-slate-100 rounded-none border-none"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Delivery Checker Box (BuildMart style) */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-1.5 text-slate-800">
                    <Truck className="h-4 w-4 text-amber-500" />
                    <span className="text-xs font-bold">Delivery Estimator</span>
                  </div>

                  <div className="flex gap-2">
                    <Input 
                      placeholder="Pincode"
                      maxLength={6}
                      value={tempPincode}
                      onChange={e => {
                        setTempPincode(e.target.value.replace(/\D/g, ''));
                        setPincodeChecked(false);
                        setPincodeError("");
                      }}
                      className="h-9 text-xs font-bold text-center tracking-widest border-gray-200 focus-visible:ring-amber-500 focus-visible:border-amber-500"
                    />
                    <Button 
                      size="sm"
                      onClick={handleCheckPincode}
                      className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold h-9 px-3 rounded-lg"
                    >
                      Check
                    </Button>
                  </div>
                  {pincodeError && <p className="text-[10px] text-red-500 font-semibold text-left">{pincodeError}</p>}
                  
                  {pincodeChecked && (
                    <div className="text-[11px] font-medium bg-slate-50 border rounded-xl p-2.5 text-left text-slate-700 space-y-1">
                      <span className="text-green-600 font-bold block flex items-center gap-1">
                        <CheckCircle className="h-3.5 w-3.5" /> Fast Delivery Available
                      </span>
                      <span>Expected delivery to <span className="font-bold text-slate-800">{pincodeCity}</span> by:</span>
                      <span className="font-extrabold text-slate-800 block text-xs">{getDeliveryDate()}</span>
                    </div>
                  )}
                </div>

                {/* Add to Cart Actions */}
                <div className="space-y-2 pt-2">
                  <Button
                    onClick={handleAddToCart}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-5 rounded-xl shadow-md shadow-amber-500/10 flex items-center justify-center gap-2 text-sm"
                  >
                    <ShoppingCart className="h-4.5 w-4.5" />
                    {purchaseMode === 'bundle' && selectedVariant && (() => {
                      const v = product.variants?.find(x => x.size === selectedVariant)
                      const bQty = v ? (v as any).bundleQty : null
                      return bQty ? `Add Bundle (${bQty} pcs) to Cart` : 'Add to Cart'
                    })()}
                    {(purchaseMode === 'piece' || !selectedVariant || !product.variants?.find(x => x.size === selectedVariant && (x as any).bundleQty)) && 'Add to Cart'}
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className={`flex-1 rounded-xl h-10 border-slate-200 transition-all ${
                        isInWishlist(product.id) ? 'bg-red-50 hover:bg-red-100 border-red-100' : 'hover:bg-slate-50'
                      }`}
                      onClick={() => {
                        toggleWishlist({
                          id: product.id,
                          title: product.title,
                          price: price,
                          image: product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1608613304899-ea8098577e38?auto=format&fit=crop&w=400&q=80'
                        });
                      }}
                    >
                      <Heart className={`h-4 w-4 mr-1.5 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
                      <span>{isInWishlist(product.id) ? 'Wishlisted' : 'Wishlist'}</span>
                    </Button>
                    <Button variant="outline" className="flex-1 rounded-xl h-10 hover:bg-slate-50 border-slate-200">
                      <Share2 className="h-4 w-4 mr-1 text-slate-500" /> Share
                    </Button>
                  </div>
                </div>

              </CardContent>
            </Card>

            {/* Seller Information */}
            <Card className="border border-slate-200 rounded-3xl overflow-hidden shadow bg-white text-left p-4 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">Sold & Serviced By</h4>
              <div>
                <span className="font-extrabold text-slate-800 text-sm block">
                  {product.shopkeeper?.shopname === "abc" ? "GharSeKro" : product.shopkeeper?.shopname}
                </span>
                {product.shopkeeper?.shopaddress && product.shopkeeper.shopaddress.map((address, index) => (
                  <span key={index} className="text-xs text-muted-foreground leading-normal block mt-1">
                    {address.flatnumber}
                    {(address as any).building && `, ${(address as any).building}`}
                    {(address as any).street && `, ${(address as any).street}`}
                    {(address as any).area && `, ${(address as any).area}`}
                    , {address.city}, {address.state} - {address.pincode}
                  </span>
                ))}
              </div>
              <div className="text-[10px] bg-amber-50 text-amber-700 p-2 rounded-lg font-bold border border-amber-100 flex items-center gap-1.5">
                <Shield className="h-4.5 w-4.5 shrink-0" /> Verified Merchant Guarantee
              </div>
            </Card>
          </div>

        </div>

        {/* 4. Related Products Slider Carousel at Bottom */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 space-y-6">
            <div className="border-t pt-10 text-left">
              <h3 className="text-lg md:text-xl font-black text-slate-800 uppercase tracking-tight">Customers Who Bought This Also Bought</h3>
              <p className="text-xs text-muted-foreground font-semibold">Frequently cross-purchased construction items</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              {relatedProducts.map((p) => {
                const itemPrice = parseFloat(p.retailprice || p.wholesaleprice || "0");
                return (
                  <Card 
                    key={p.id}
                    onClick={() => {
                      setSelectedImage(0);
                      navigate(`/product/${p.id}`);
                      window.scrollTo(0, 0);
                    }}
                    className="border border-slate-200 hover:border-amber-500 hover:shadow-lg transition-all duration-normal cursor-pointer rounded-2xl overflow-hidden text-left"
                  >
                    <div className="aspect-square bg-slate-50 flex items-center justify-center p-4">
                      <img
                        src={p.images && p.images.length > 0 ? p.images[0] : 'https://images.unsplash.com/photo-1608613304899-ea8098577e38?auto=format&fit=crop&w=400&q=80'}
                        alt={p.title}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </div>
                    <div className="p-3 border-t space-y-2">
                      <h4 className="font-bold text-xs text-slate-800 line-clamp-1 leading-snug">{p.title}</h4>
                      <div className="flex justify-between items-center">
                        <span className="font-black text-sm text-slate-900">₹{itemPrice.toLocaleString()}</span>
                        <Badge className="text-[8px] bg-slate-100 text-slate-600 border border-slate-200 font-bold uppercase">{p.category?.title || 'Tools'}</Badge>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

      </div>
      <Footer />
    </div>
  )
}

export default ProductDetail
