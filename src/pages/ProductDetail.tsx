import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getProductDetail, getProducts, ApiProductDetail, ApiProduct, getHardwareSvgFallback, FALLBACK_HARDWARE_PRODUCTS } from '@/lib/api'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCartContext } from '@/context/CartContext'
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
const MOCK_DEAL_DETAILS: Record<string, any> = {
  "drill-001": {
    id: "drill-001",
    title: "Bosch GSB 500 RE Professional Impact Drill Machine",
    images: [
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=800&auto=format&fit=crop"
    ],
    wholesaleprice: "2199",
    retailprice: "2499",
    unit: "piece",
    description: "The Bosch GSB 500 RE is a powerful, compact, and reliable impact drill machine designed for both professional tasks and home DIY projects. Powered by a robust 500W motor, it easily cuts through concrete, masonry, steel, and wood. Its ergonomic lightweight construction reduces stress during overhead drilling.",
    warranty: "1 Year Brand Warranty",
    addons: [],
    discount: 37,
    shopkeeper: {
      shopname: "Bosch Authorized Tools Store",
      shopaddress: [{ city: "Mumbai", state: "Maharashtra", pincode: "400001", flatnumber: 12 }]
    },
    category: { id: "pt-1", title: "Power Tools", image: "" },
    variants: [
      { size: "500W Standard", price: 2499 },
      { size: "600W Heavy Duty", price: 2999 }
    ],
    specifications: {
      "Brand": "Bosch",
      "Model Number": "GSB 500 RE",
      "Power Input": "500 Watts",
      "Chuck Capacity": "10 mm",
      "No Load Speed": "0 - 2600 RPM",
      "Impact Rate": "0 - 41600 BPM",
      "Weight": "1.5 kg"
    },
    highlights: [
      "Powerful 500W motor for high-performance drilling.",
      "Dual mode option: Impact drilling or rotary drilling.",
      "Ergonomic handle grip for ultimate comfort and control.",
      "Includes a 1-year brand warranty card."
    ]
  },
  "cement-001": {
    id: "cement-001",
    title: "Ultratech Premium Portland Pozzolana Cement (PPC)",
    images: [
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?q=80&w=800&auto=format&fit=crop"
    ],
    wholesaleprice: "350",
    retailprice: "375",
    unit: "bag",
    description: "Ultratech Premium is a concrete-specialist Portland Pozzolana Cement (PPC) manufactured using cutting-edge clinker technology. It contains high-grade active mineral additives that deliver superior concrete strength, maximum waterproofing, and high resistance against chloride and sulfate attacks.",
    warranty: "No Warranty (Standard Expiry Checked)",
    addons: [],
    discount: 16,
    shopkeeper: {
      shopname: "Vrindavan Aggregates & Cement",
      shopaddress: [{ city: "Mumbai", state: "Maharashtra", pincode: "400001", flatnumber: 45 }]
    },
    category: { id: "cs-1", title: "Cement & Sand", image: "" },
    variants: [
      { size: "50kg Bag", price: 375 },
      { size: "1 Ton Bundle", price: 7200 }
    ],
    specifications: {
      "Brand": "Ultratech",
      "Type": "Premium PPC",
      "Weight": "50 kg",
      "Packaging": "Laminated PP Bag (Moisture Resistant)",
      "Initial Setting Time": "30 Minutes",
      "Compressive Strength": "53 MPa (after 28 days)"
    },
    highlights: [
      "Concrete-specialist clinker gives unmatched structure durability.",
      "Moisture-proof laminated packaging protects against moisture damage.",
      "Superior waterproofing reduces capillary action in slabs.",
      "Recommended for columns, beams, foundations, and slab casting."
    ]
  },
  "wire-001": {
    id: "wire-001",
    title: "Havells Life Line FR-LSH House Wire (Length 90m)",
    images: [
      "https://images.unsplash.com/photo-1563770660941-20978e870e26?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop"
    ],
    wholesaleprice: "1399",
    retailprice: "1599",
    unit: "piece",
    description: "Havells Life Line is a premium range of building wires insulated with flame-retardant, low-smoke, and low-halogen (FR-LSH) compound. Using 99.97% pure electrolytic grade copper conductors, it maximizes power delivery, reduces heating, and increases the overall lifespan of house wiring circuits.",
    warranty: "20 Years Manufacturer Warranty",
    addons: [],
    discount: 24,
    shopkeeper: {
      shopname: "Havells Brand Gallery",
      shopaddress: [{ city: "New Delhi", state: "Delhi", pincode: "110001", flatnumber: 8 }]
    },
    category: { id: "el-1", title: "Electricals", image: "" },
    variants: [
      { size: "1.0 Sqmm", price: 1299 },
      { size: "1.5 Sqmm", price: 1599 },
      { size: "2.5 Sqmm", price: 2499 }
    ],
    specifications: {
      "Brand": "Havells",
      "Type": "FR-LSH Single Core",
      "Conductor": "99.97% Pure Electrolytic Copper",
      "Length": "90 Meters",
      "Voltage Rating": "1100 Volts",
      "Standards": "IS 694 Certified"
    },
    highlights: [
      "Flame-Retardant, Low-Smoke, and Halogen protected insulation.",
      "High current-carrying capacity for extreme power loads.",
      "Anti-termite and anti-rodent compound coating prevents cable damage.",
      "Excellent flex life for smooth conduit pulling and wiring."
    ]
  },
  "lock-001": {
    id: "lock-001",
    title: "Godrej Brass Nav-Tal Padlock 6-Levers with 3 Keys",
    images: [
      "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509395062183-67c5ad6faff9?q=80&w=800&auto=format&fit=crop"
    ],
    wholesaleprice: "699",
    retailprice: "799",
    unit: "piece",
    description: "The iconic Godrej Nav-Tal padlock has been safeguarding houses across India for generations. Built with an ultra-strong, rivetless brass body and a hardened steel shackle, it offers unparalleled security and robust resistance to crowbar and hacksaw attacks.",
    warranty: "5 Years Manufacturer Warranty",
    addons: [],
    discount: 26,
    shopkeeper: {
      shopname: "National Locks & Hardware",
      shopaddress: [{ city: "Mumbai", state: "Maharashtra", pincode: "400001", flatnumber: 89 }]
    },
    category: { id: "hw-1", title: "Hardware", image: "" },
    variants: [
      { size: "50mm Size", price: 650 },
      { size: "65mm Size", price: 799 },
      { size: "85mm Giant", price: 1199 }
    ],
    specifications: {
      "Brand": "Godrej Lock",
      "Model": "Nav-Tal 6 Levers",
      "Material": "Extruded Brass Body",
      "Shackle Material": "Hardened Alloy Steel",
      "Levers Count": "6 Levers",
      "Keys Included": "3 Heavy Brass Keys"
    },
    highlights: [
      "Rivetless brass body with dual-locking shackle protection.",
      "6-lever pick-resistant key technology provides heavy safety.",
      "Hardened steel shackle resists hacksaw cutting attempts.",
      "Highly durable construction, operational in all weather."
    ]
  },
  "paint-001": {
    id: "paint-001",
    title: "Asian Paints Apex Ultima Exterior Emulsion White",
    images: [
      "https://images.unsplash.com/photo-1595206133361-b1fe343e5e23?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=800&auto=format&fit=crop"
    ],
    wholesaleprice: "2890",
    retailprice: "3200",
    unit: "piece",
    description: "Asian Paints Apex Ultima is a premium water-based, high-performance exterior wall paint. Fortified with silicone additives and advanced dirt-pick-up resistance, it forms a highly durable shield that protects exterior walls from harsh rains, heat, UV degradation, algae growth, and paint peeling.",
    warranty: "7 Years Performance Warranty",
    addons: [],
    discount: 31,
    shopkeeper: {
      shopname: "Kamdhenu Paints & Home Decor",
      shopaddress: [{ city: "Mumbai", state: "Maharashtra", pincode: "400002", flatnumber: 101 }]
    },
    category: { id: "pa-1", title: "Paints", image: "" },
    variants: [
      { size: "4 Litre", price: 1450 },
      { size: "10 Litre", price: 3200 },
      { size: "20 Litre", price: 5900 }
    ],
    specifications: {
      "Brand": "Asian Paints",
      "Type": "Premium Exterior Emulsion",
      "Finish": "Rich Smooth Matt Finish",
      "Coverage": "50-60 sq.ft/Litre for 2 coats",
      "Drying Time": "30-40 Minutes",
      "Fungus Resistance": "Yes (Advanced Anti-Algal)"
    },
    highlights: [
      "Silicone additives offer outstanding water repellent protection.",
      "Anti-algal formula prevents black spots on exterior walls.",
      "Excellent UV-protection prevents colors from fading.",
      "Sleek dirt-resistant paint technology keeps walls clean."
    ]
  },
  "pipe-001": {
    id: "pipe-001",
    title: "Supreme PVC Pressure Pipe 4 Inch Class-3 (6m)",
    images: [
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=800&auto=format&fit=crop"
    ],
    wholesaleprice: "420",
    retailprice: "499",
    unit: "piece",
    description: "Supreme Class-3 PVC Pressure Pipes are manufactured in state-of-the-art extrusion plants. Ideal for water supply networks, plumbing installations, and agricultural irrigation, they provide robust pressure handling capacity, zero leakage, chemical inertness, and a prolonged rust-free operational life.",
    warranty: "10 Years Brand Warranty",
    addons: [],
    discount: 23,
    shopkeeper: {
      shopname: "Supreme Pipes Agency",
      shopaddress: [{ city: "Pune", state: "Maharashtra", pincode: "411001", flatnumber: 22 }]
    },
    category: { id: "pl-1", title: "Plumbing", image: "" },
    variants: [
      { size: "3 Inch Pipe", price: 399 },
      { size: "4 Inch Pipe", price: 499 }
    ],
    specifications: {
      "Brand": "Supreme",
      "Material": "Unplasticized PVC (uPVC)",
      "Pipe Diameter": "4 Inches (110 mm)",
      "Standard Length": "6 Meters",
      "Pressure Class": "Class-3 (6 kgf/cm²)",
      "Joint Type": "Solvent Weld socket"
    },
    highlights: [
      "High tensile & impact strength handles pressure surges easily.",
      "Lead-free, non-toxic compound ensures safe drinking water.",
      "Chemical and corrosion resistant prevents calcification.",
      "Smooth internal surface ensures maximum hydraulic flow."
    ]
  },
  "rebar-001": {
    id: "rebar-001",
    title: "Tata Tiscon TMT Steel Rebar Fe 550D High Strength",
    images: [
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop"
    ],
    wholesaleprice: "760",
    retailprice: "850",
    unit: "piece",
    description: "Tata Tiscon Fe 550D is a high-strength thermo-mechanically treated (TMT) steel rebar designed to provide absolute seismic safety to concrete structures. Made from pure virgin iron ore, it features uniform rib patterns for excellent bonding with cement, great ductility, and premium corrosion resistance.",
    warranty: "No Warranty (Quality certificate provided)",
    addons: [],
    discount: 18,
    shopkeeper: {
      shopname: "Laxmi Steel & Iron Suppliers",
      shopaddress: [{ city: "Mumbai", state: "Maharashtra", pincode: "400001", flatnumber: 56 }]
    },
    category: { id: "cs-1", title: "Cement & Sand", image: "" },
    variants: [
      { size: "10mm (per rod)", price: 650 },
      { size: "12mm (per rod)", price: 850 },
      { size: "16mm (per rod)", price: 1450 }
    ],
    specifications: {
      "Brand": "Tata Tiscon",
      "Grade": "Fe 550D High Ductility",
      "Steel Type": "Virgin Steel TMT",
      "Standard Length": "12 Meters (per rod)",
      "Rib Design": "Uniform High-Bond Ribs",
      "Seismic Grade": "Yes (Earthquake Resistant)"
    },
    highlights: [
      "Pure virgin iron ore steel increases load-bearing capacity.",
      "Fe 550D grade provides high ductility to absorb seismic energy.",
      "Uniform double-helical rib pattern bonds flawlessly with cement.",
      "Thermo-mechanically treated for excellent rust resistance."
    ]
  },
  "faucet-001": {
    id: "faucet-001",
    title: "Cera Brass Designer Basin Faucet (Chrome Finish)",
    images: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop"
    ],
    wholesaleprice: "1499",
    retailprice: "1799",
    unit: "piece",
    description: "Bring a touch of modern luxury to your bathroom with the Cera Brass Designer Basin Faucet. Fabricated from premium virgin brass and coated with a thick multilayer mirror chrome finish, it features a smooth ceramic disc cartridge that guarantees drip-free, whisper-quiet operation for years.",
    warranty: "7 Years Manufacturer Warranty",
    addons: [],
    discount: 31,
    shopkeeper: {
      shopname: "Bath & Sanitary World",
      shopaddress: [{ city: "Bengaluru", state: "Karnataka", pincode: "560001", flatnumber: 14 }]
    },
    category: { id: "pl-1", title: "Plumbing", image: "" },
    variants: [
      { size: "Standard Cold", price: 1799 },
      { size: "Quarter Turn Mixer", price: 2999 }
    ],
    specifications: {
      "Brand": "Cera",
      "Material": "High-Grade Virgin Brass",
      "Finish Type": "Multilayer Mirror Chrome",
      "Cartridge Type": "Ceramic Disc Cartridge",
      "Aerator": "Honeycomb aerator (soft splash-free flow)",
      "Drip Resistance": "Verified for 5,00,000 cycles"
    },
    highlights: [
      "Premium solid brass casting ensures robust durability.",
      "Sparkling mirror chrome finish resists corrosion and tarnish.",
      "High-performance ceramic disc cartridge ensures drip-free usage.",
      "Honeycomb aerator provides a soft, bubbly, water-saving stream."
    ]
  }
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addToCart } = useCartContext()
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
  const isWholesaler = userType === 'WHOLESALER'
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
        
        // 1. Resolve Special Mock Deal Details first
        if (MOCK_DEAL_DETAILS[id]) {
          setProduct(MOCK_DEAL_DETAILS[id]);
          setError(null);
        } else {
          // 2. Fetch from real backend API
          const productDetail = await getProductDetail(id)
          setProduct(productDetail)
          setError(null)
        }

        // Fetch related products - wrapped in try-catch to be 100% offline-friendly!
        try {
          const allProducts = await getProducts();
          if (allProducts && allProducts.length > 0) {
            setRelatedProducts(allProducts.filter(p => p.id !== id).slice(0, 4));
          } else {
            setRelatedProducts(FALLBACK_HARDWARE_PRODUCTS.filter(p => p.id !== id).slice(0, 4));
          }
        } catch (relErr) {
          console.warn('Failed to fetch related products from API, using premium mock fallback:', relErr);
          setRelatedProducts(FALLBACK_HARDWARE_PRODUCTS.filter(p => p.id !== id).slice(0, 4));
        }

      } catch (err: any) {
        console.error('Failed to fetch product details, trying fallback catalog:', err)
        
        // Try resolving this product from FALLBACK_HARDWARE_PRODUCTS to handle offline gracefully
        const fallbackProd = FALLBACK_HARDWARE_PRODUCTS.find(p => p.id === id);
        if (fallbackProd) {
          const resolvedDetail: ApiProductDetail = {
            id: fallbackProd.id,
            title: fallbackProd.title,
            images: fallbackProd.images,
            wholesaleprice: fallbackProd.wholesaleprice,
            retailprice: fallbackProd.retailprice,
            unit: "piece",
            description: fallbackProd.title + " - Premium grade architectural hardware product engineered for heavy structural loads, certified safety standards, and decades of reliable service life.",
            warranty: "1 Year Brand Warranty",
            addons: [],
            discount: 20,
            variants: fallbackProd.variants,
            shopkeeper: {
              shopname: "National Hardware Hub Store",
              shopaddress: [{ city: "Mumbai", state: "Maharashtra", pincode: "400001", flatnumber: 22 }]
            },
            category: {
              id: fallbackProd.category?.id || "gen-1",
              title: fallbackProd.category?.title || "Hardware",
              image: ""
            }
          };
          setProduct(resolvedDetail);
          setRelatedProducts(FALLBACK_HARDWARE_PRODUCTS.filter(p => p.id !== id).slice(0, 4));
          setError(null);
        } else {
          setError(err?.message || 'Failed to load product details')
          setProduct(null)
        }
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

    const hasWholesaleAccess = isLoggedIn && (isWholesaler || !!sessionStorage.getItem('wholesaleGST'))

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
        variant: finalVariant
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
  const isWholesaleProduct = isLoggedIn && (isWholesaler || !!sessionStorage.getItem('wholesaleGST')) && product.wholesaleprice

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
                    <Button variant="outline" className="flex-1 rounded-xl h-10 hover:bg-slate-50 border-slate-200">
                      <Heart className="h-4 w-4 mr-1 text-red-500" /> Wishlist
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
                <span className="font-extrabold text-slate-800 text-sm block">{product.shopkeeper?.shopname}</span>
                {product.shopkeeper?.shopaddress && product.shopkeeper.shopaddress.map((address, index) => (
                  <span key={index} className="text-xs text-muted-foreground leading-normal block mt-1">
                    {address.flatnumber}, {address.city}, {address.state} - {address.pincode}
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
