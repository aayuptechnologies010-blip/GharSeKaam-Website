import { url } from "@/constant"

export interface ApiCategory {
  id: string
  title: string
  image?: string
  createdAt?: string
}

export interface SignupData {
  city: string
  pincode: string
  flatnumber: number
  state: string
  phone: string
  type: "RETAILER" | "WHOLESALER"
  // Optional wholesaler fields
  shopname?: string
  shopnumber?: string
  gstnumber?: string
  adhaarnumber?: string
  latitude?: number
  longitude?: number
}

export interface SignupResponse {
  success: boolean
  token?: string
  name?: string
  email?: string
  message?: string
}

export interface ProductVariant {
  size: string
  price: number
  wholesaleprice?: number
}

export interface ApiProduct {
  id: string
  title: string
  retailprice?: string
  wholesaleprice?: string
  images: string[]
  variants?: ProductVariant[]
  category?: {
    id: string
    title: string
  }
  availability?: 'RETAILER' | 'WHOLESALER' | 'BOTH'
  currentQty?: number
  unit?: string
  description?: string
  warranty?: string
  discount?: number
  shopkeeper?: {
    shopname: string
    shopaddress: Array<{ city: string; state: string; pincode: string; flatnumber: number }>
  }
  specifications?: Record<string, string>
  highlights?: string[]
}

export interface ApiProductDetail {
  id: string
  title: string
  images: string[]
  wholesaleprice?: string
  retailprice?: string
  unit: string
  description: string
  warranty: string
  addons: any[]
  discount: number
  variants?: ProductVariant[]
  shopkeeper: {
    shopname: string
    shopaddress: Array<{
      city: string
      state: string
      pincode: string
      flatnumber: number
    }>
  }
  category: {
    id: string
    title: string
    image: string
  }
}

export interface ProductDetailResponse {
  success: boolean
  item: ApiProductDetail
}

export interface ProductsResponse {
  success: boolean
  items: ApiProduct[]
}

export async function getCategories(signal?: AbortSignal): Promise<ApiCategory[]> {
  if (url !== "__BACKEND_DISABLED__") {
    try {
      const response = await fetch(`${url}/categories`, { signal })
      const data = await response.json()
      if (data.success && Array.isArray(data.categories)) {
        return data.categories
      }
    } catch (error) {
      console.error("Backend getCategories failed, falling back to mock:", error)
    }
  }
  return DUMMY_CATEGORIES
}

export async function getProducts(signal?: AbortSignal): Promise<ApiProduct[]> {
  if (url !== "__BACKEND_DISABLED__") {
    const token = localStorage.getItem('authToken')
    try {
      const headers: HeadersInit = {}
      if (token) {
        headers['Authorization'] = token
      }
      const response = await fetch(`${url}/items`, { headers, signal })
      const data = await response.json()
      if (data.success && Array.isArray(data.items)) {
        return data.items
      }
    } catch (error) {
      console.error("Backend getProducts failed, falling back to mock:", error)
    }
  }
  return FALLBACK_HARDWARE_PRODUCTS
}

export async function getProductDetail(productId: string, signal?: AbortSignal): Promise<ApiProductDetail> {
  if (url !== "__BACKEND_DISABLED__") {
    const token = localStorage.getItem('authToken')
    try {
      const headers: HeadersInit = {}
      if (token) {
        headers['Authorization'] = token
      }
      const response = await fetch(`${url}/item/${productId}`, { headers, signal })
      const data = await response.json()
      if (data.success && data.item) {
        return data.item
      }
    } catch (error) {
      console.error("Backend getProductDetail failed, falling back to mock:", error)
    }
  }

  const found = FALLBACK_HARDWARE_PRODUCTS.find(p => p.id === productId)
  if (!found) throw new Error('Product not found')
  return {
    id: found.id,
    title: found.title,
    images: found.images,
    wholesaleprice: found.wholesaleprice,
    retailprice: found.retailprice,
    unit: found.unit || 'piece',
    description: found.description || '',
    warranty: found.warranty || '1 Year Brand Warranty',
    addons: [],
    discount: found.discount || 20,
    variants: found.variants,
    shopkeeper: found.shopkeeper || { shopname: 'GharSeKro Verified Store', shopaddress: [{ city: 'Mumbai', state: 'Maharashtra', pincode: '400001', flatnumber: 1 }] },
    category: found.category ? { id: found.category.id, title: found.category.title, image: '' } : { id: 'gen', title: 'Hardware', image: '' }
  }
}

export async function signup(signupData: SignupData, googleToken?: string): Promise<SignupResponse> {
  if (url !== "__BACKEND_DISABLED__") {
    try {
      const response = await fetch(`${url}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(googleToken ? { 'Authorization': googleToken } : {})
        },
        body: JSON.stringify(signupData)
      })
      const data = await response.json()
      if (data.success) {
        return {
          success: true,
          token: data.token,
          name: data.name,
          email: data.email,
          message: data.message
        }
      } else {
        throw new Error(data.message || 'Signup failed')
      }
    } catch (error: any) {
      console.error("Backend signup failed:", error)
      throw error
    }
  }
  return { success: true, token: 'demo-token', name: 'Demo User', email: 'demo@gharsekro.com' }
}

// Order related interfaces and functions
export interface OrderItem {
  itemId: string
  quantity: number
  variant?: {
    size: string
    price: number
  }
}

export interface CreateOrderData {
  addressId: string
  paymentType: "COD" | "ONLINE"
  items: OrderItem[]
}

export interface CreateOrderResponse {
  success: boolean
  orderId?: string
  message?: string
}

export interface ApiOrderItem {
  id: string
  quantity: number
  unitPrice: string
  lineTotal: string
  variant?: {
    size: string
    price: number
  }
  item: {
    title: string
    images: string[]
  }
}

export interface ApiOrder {
  id: string
  paymentType: string
  totalPrice: string
  status: string
  createdAt: string
  orderItems: ApiOrderItem[]
  shopkeeper: {
    shopname: string
  }
  deliveryAddress: {
    city: string
    state: string
    pincode: string
    flatnumber: number
  }
  estimatedDelivery?: string
  deliveryGuy?: {
    id: string;
    name: string;
    phone: string;
    profileimage: string;
    status: string;
  } | null
}

export interface OrdersResponse {
  success: boolean
  orders: ApiOrder[]
}

export async function createOrder(orderData: CreateOrderData): Promise<CreateOrderResponse> {
  if (url !== "__BACKEND_DISABLED__") {
    const token = localStorage.getItem('authToken')
    if (token) {
      try {
        const response = await fetch(`${url}/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          },
          body: JSON.stringify(orderData)
        })
        const data = await response.json()
        if (data.success && data.order) {
          return { success: true, orderId: data.order.id }
        }
        return { success: false, message: data.message || "Failed to create order on backend" }
      } catch (error: any) {
        console.error("Backend createOrder failed:", error)
        return { success: false, message: error.message || "Network error while placing order" }
      }
    }
  }
  return { success: true, orderId: 'DEMO-' + Date.now() }
}

export async function getOrders(_signal?: AbortSignal): Promise<ApiOrder[]> {
  if (url !== "__BACKEND_DISABLED__") {
    const token = localStorage.getItem('authToken')
    if (token) {
      try {
        const response = await fetch(`${url}/orders`, {
          headers: {
            'Authorization': token
          },
          signal: _signal
        })
        const data = await response.json()
        if (data.success && Array.isArray(data.orders)) {
          return data.orders
        }
        throw new Error(data.message || "Failed to retrieve orders from backend")
      } catch (error) {
        console.error("Backend getOrders failed:", error)
        throw error
      }
    }
  }
  return DEMO_ORDERS
}

export async function cancelOrder(orderId: string): Promise<{ success: boolean; message?: string }> {
  if (url !== "__BACKEND_DISABLED__") {
    const token = localStorage.getItem('authToken')
    if (token) {
      try {
        const response = await fetch(`${url}/orders/${orderId}/cancel`, {
          method: 'PUT',
          headers: {
            'Authorization': token
          }
        })
        const data = await response.json()
        if (data.success) {
          return { success: true, message: data.message }
        }
        return { success: false, message: data.message || "Failed to cancel order on backend" }
      } catch (error: any) {
        console.error("Backend cancelOrder failed:", error)
        return { success: false, message: error.message || "Network error while cancelling order" }
      }
    }
  }
  return { success: true, message: 'Order cancelled successfully' }
}

// Address related interfaces and functions
export interface Address {
  id: string
  city: string
  state: string
  pincode: string
  flatnumber: number
  customerid: string
  shopkeeperid: string | null
  latitude?: number | string | null
  longitude?: number | string | null
}

export interface AddAddressData {
  city: string
  pincode: string
  flatnumber: number
  state: string
  phone: string
  latitude?: number | null
  longitude?: number | null
}

export interface AddressResponse {
  success: boolean
  addresses?: Address[]
}


export const DUMMY_CATEGORIES: ApiCategory[] = [
  { id: "cat-hl", title: "Hardware & Locks", image: "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=300&auto=format&fit=crop" },
  { id: "cat-el", title: "Electrical", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=300&auto=format&fit=crop" },
  { id: "cat-pt", title: "Paint", image: "https://images.unsplash.com/photo-1595206133361-b1fe343e5e23?q=80&w=300&auto=format&fit=crop" },
  { id: "cat-pl", title: "Plumbing Fitting", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=300&auto=format&fit=crop" },
  { id: "cat-sv", title: "Service", image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=300&auto=format&fit=crop" },
  { id: "cat-ts", title: "Tools & Safety Equipments", image: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?q=80&w=300&auto=format&fit=crop" },
  { id: "cat-bm", title: "Building Material (Cement, Sand, Iron)", image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=300&auto=format&fit=crop" },
]

export const DEMO_ADDRESSES: Address[] = [
  { id: "addr-1", city: "Mumbai", state: "Maharashtra", pincode: "400001", flatnumber: 12, customerid: "demo-user", shopkeeperid: null },
  { id: "addr-2", city: "New Delhi", state: "Delhi", pincode: "110001", flatnumber: 5, customerid: "demo-user", shopkeeperid: null },
]

// In-memory mutable addresses store
let _addresses: Address[] = [...DEMO_ADDRESSES]

export async function addAddress(addressData: AddAddressData): Promise<{ success: boolean; message?: string }> {
  if (url !== "__BACKEND_DISABLED__") {
    const token = localStorage.getItem('authToken')
    if (token) {
      try {
        const response = await fetch(`${url}/address/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          },
          body: JSON.stringify({
            city: addressData.city,
            state: addressData.state,
            pincode: addressData.pincode,
            flatnumber: addressData.flatnumber,
            latitude: addressData.latitude,
            longitude: addressData.longitude
          })
        })
        const data = await response.json()
        if (data.success) {
          return { success: true }
        }
        return { success: false, message: data.message || "Failed to add address on backend" }
      } catch (error: any) {
        console.error("Backend addAddress failed:", error)
        return { success: false, message: error.message || "Network error while adding address" }
      }
    }
  }

  const newAddress: Address = {
    id: 'addr-' + Date.now(),
    city: addressData.city,
    state: addressData.state,
    pincode: addressData.pincode,
    flatnumber: addressData.flatnumber,
    customerid: 'demo-user',
    shopkeeperid: null,
    latitude: addressData.latitude,
    longitude: addressData.longitude
  }
  _addresses = [..._addresses, newAddress]
  return { success: true }
}

export async function getAllAddresses(_signal?: AbortSignal): Promise<Address[]> {
  if (url !== "__BACKEND_DISABLED__") {
    const token = localStorage.getItem('authToken')
    if (token) {
      try {
        const response = await fetch(`${url}/address/all`, {
          headers: {
            'Authorization': token
          },
          signal: _signal
        })
        const data = await response.json()
        if (data.success && Array.isArray(data.addresses)) {
          return data.addresses
        }
        throw new Error(data.message || "Failed to retrieve addresses from backend")
      } catch (error) {
        console.error("Backend getAllAddresses failed:", error)
        throw error
      }
    }
  }

  return _addresses
}

export const DEMO_ORDERS: ApiOrder[] = [
  {
    id: "ORD-2024-001",
    paymentType: "COD",
    totalPrice: "4298",
    status: "DELIVERED",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    orderItems: [
      { id: "oi-1", quantity: 1, unitPrice: "2499", lineTotal: "2499", item: { title: "Bosch GSB 500 RE Impact Drill", images: ["https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=300&auto=format&fit=crop"] } },
      { id: "oi-2", quantity: 2, unitPrice: "899", lineTotal: "1799", item: { title: "Godrej Brass Padlock 65mm", images: ["https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=300&auto=format&fit=crop"] } },
    ],
    shopkeeper: { shopname: "GharSeKro Verified Store" },
    deliveryAddress: { city: "Mumbai", state: "Maharashtra", pincode: "400001", flatnumber: 12 },
    estimatedDelivery: "Delivered on time"
  },
  {
    id: "ORD-2024-002",
    paymentType: "COD",
    totalPrice: "3200",
    status: "PROCESSING",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    orderItems: [
      { id: "oi-3", quantity: 1, unitPrice: "3200", lineTotal: "3200", item: { title: "Asian Paints Apex Ultima 10L", images: ["https://images.unsplash.com/photo-1595206133361-b1fe343e5e23?q=80&w=300&auto=format&fit=crop"] } },
    ],
    shopkeeper: { shopname: "GharSeKro Verified Store" },
    deliveryAddress: { city: "Mumbai", state: "Maharashtra", pincode: "400001", flatnumber: 12 },
    estimatedDelivery: "Within 2 Hours"
  },
]

export const FALLBACK_HARDWARE_PRODUCTS: ApiProduct[] = [
  {
    id: "drill-001",
    title: "Bosch GSB 500 RE Professional Impact Drill Machine",
    retailprice: "2499",
    wholesaleprice: "2199",
    images: ["https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600&auto=format&fit=crop"],
    category: { id: "cat-ts", title: "Tools & Safety Equipments" },
    availability: "BOTH",
    currentQty: 150,
    variants: [
      { size: "500W Standard", price: 2499 },
      { size: "600W Heavy Duty", price: 2999 }
    ]
  },
  {
    id: "cement-001",
    title: "Ultratech Premium Portland Pozzolana Cement (PPC)",
    retailprice: "375",
    wholesaleprice: "350",
    images: ["https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&auto=format&fit=crop"],
    category: { id: "cat-bm", title: "Building Material (Cement, Sand, Iron)" },
    availability: "BOTH",
    currentQty: 500,
    variants: [
      { size: "50kg Bag", price: 375 },
      { size: "1 Ton Bundle", price: 7200 }
    ]
  },
  {
    id: "wire-001",
    title: "Havells Life Line FR-LSH House Wire (Length 90m)",
    retailprice: "1599",
    wholesaleprice: "1399",
    images: ["https://images.unsplash.com/photo-1563770660941-20978e870e26?q=80&w=600&auto=format&fit=crop"],
    category: { id: "cat-el", title: "Electrical" },
    availability: "BOTH",
    currentQty: 250,
    variants: [
      { size: "1.0 Sqmm", price: 1299 },
      { size: "1.5 Sqmm", price: 1599 },
      { size: "2.5 Sqmm", price: 2499 }
    ]
  },
  {
    id: "lock-001",
    title: "Godrej Brass Nav-Tal Padlock 6-Levers with 3 Keys",
    retailprice: "799",
    wholesaleprice: "699",
    images: ["https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=600&auto=format&fit=crop"],
    category: { id: "cat-hl", title: "Hardware & Locks" },
    availability: "BOTH",
    currentQty: 180,
    variants: [
      { size: "50mm Size", price: 650 },
      { size: "65mm Size", price: 799 },
      { size: "85mm Giant", price: 1199 }
    ]
  },
  {
    id: "paint-001",
    title: "Asian Paints Apex Ultima Exterior Emulsion White",
    retailprice: "3200",
    wholesaleprice: "2890",
    images: ["https://images.unsplash.com/photo-1595206133361-b1fe343e5e23?q=80&w=600&auto=format&fit=crop"],
    category: { id: "cat-pt", title: "Paint" },
    availability: "BOTH",
    currentQty: 90,
    variants: [
      { size: "4 Litre", price: 1450 },
      { size: "10 Litre", price: 3200 },
      { size: "20 Litre", price: 5900 }
    ]
  },
  {
    id: "pipe-001",
    title: "Supreme PVC Pressure Pipe 4 Inch Class-3 (6m)",
    retailprice: "499",
    wholesaleprice: "420",
    images: ["https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600&auto=format&fit=crop"],
    category: { id: "cat-pl", title: "Plumbing Fitting" },
    availability: "BOTH",
    currentQty: 300,
    variants: [
      { size: "3 Inch Pipe", price: 399 },
      { size: "4 Inch Pipe", price: 499 }
    ]
  },
  {
    id: "rebar-001",
    title: "Tata Tiscon TMT Steel Rebar Fe 550D High Strength",
    retailprice: "850",
    wholesaleprice: "760",
    images: ["https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=600&auto=format&fit=crop"],
    category: { id: "cat-bm", title: "Building Material (Cement, Sand, Iron)" },
    availability: "BOTH",
    currentQty: 120,
    variants: [
      { size: "10mm (per rod)", price: 650 },
      { size: "12mm (per rod)", price: 850 },
      { size: "16mm (per rod)", price: 1450 }
    ]
  },
  {
    id: "faucet-001",
    title: "Cera Brass Designer Basin Faucet (Chrome Finish)",
    retailprice: "1799",
    wholesaleprice: "1499",
    images: ["https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600&auto=format&fit=crop"],
    category: { id: "cat-pl", title: "Plumbing Fitting" },
    availability: "BOTH",
    currentQty: 80,
    variants: [
      { size: "Standard Cold", price: 1799 },
      { size: "Quarter Turn Mixer", price: 2999 }
    ]
  }
];

export function getHardwareSvgFallback(titleOrCategory: string): string {
  const query = (titleOrCategory || '').toLowerCase();
  
  if (query.includes('drill') || query.includes('power') || query.includes('grinder') || query.includes('hammer') || query.includes('screwdriver') || query.includes('tool')) {
    // 1. Power Tools (Real high-fidelity drill/tools)
    return "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=400&q=80";
  }
  
  if (query.includes('cement') || query.includes('sand') || query.includes('gravel') || query.includes('aggregate') || query.includes('mortar') || query.includes('bulk') || query.includes('concrete')) {
    // 2. Cement & Bulk (Real cement/industrial concrete bags)
    return "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=400&q=80";
  }
  
  if (query.includes('tap') || query.includes('faucet') || query.includes('plumbing') || query.includes('shower') || query.includes('joint') || query.includes('pipe')) {
    // 3. Faucet / Bath fittings (Premium designer faucet)
    return "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80";
  }
  
  if (query.includes('lock') || query.includes('security') || query.includes('handle') || query.includes('cabinet') || query.includes('slide') || query.includes('hardware')) {
    // 4. Secure Padlocks & Hardware (Real brass padlock)
    return "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=400&q=80";
  }
  
  if (query.includes('wire') || query.includes('electrical') || query.includes('switch') || query.includes('panel') || query.includes('mcb') || query.includes('led')) {
    // 5. Electrical wires & panels (Real electrical meters/panels)
    return "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=400&q=80";
  }
  
  if (query.includes('paint') || query.includes('emulsion') || query.includes('brush') || query.includes('coating')) {
    // 6. Paints & Coating (Premium paint bucket/tools)
    return "https://images.unsplash.com/photo-1595206133361-b1fe343e5e23?auto=format&fit=crop&w=400&q=80";
  }
  
  if (query.includes('safety') || query.includes('helmet') || query.includes('vest') || query.includes('glove') || query.includes('tape') || query.includes('caution')) {
    // 7. Safety Gear (Premium yellow hardhat)
    return "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=400&q=80";
  }
  
  // 8. Default Wrench / Hand tools
  return "https://images.unsplash.com/photo-1608613304899-ea8098577e38?auto=format&fit=crop&w=400&q=80";
}

export async function sendOtp(emailOrPhone: string): Promise<{ success: boolean; message: string; otp?: string }> {
  if (url !== "__BACKEND_DISABLED__") {
    try {
      const response = await fetch(`${url}/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ emailOrPhone })
      })
      return await response.json()
    } catch (error: any) {
      console.error("Backend sendOtp failed:", error)
      return { success: false, message: error.message || "Failed to send OTP" }
    }
  }
  return { success: true, message: `Mock OTP sent to ${emailOrPhone}`, otp: '123456' }
}

export async function verifyOtp(emailOrPhone: string, otp: string, name?: string): Promise<{
  success: boolean;
  registered: boolean;
  token?: string;
  tempToken?: string;
  name?: string;
  email?: string;
  profile?: string;
  type?: string;
  message?: string;
}> {
  if (url !== "__BACKEND_DISABLED__") {
    try {
      const response = await fetch(`${url}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ emailOrPhone, otp, name })
      })
      return await response.json()
    } catch (error: any) {
      console.error("Backend verifyOtp failed:", error)
      return { success: false, registered: false, message: error.message || "Verification failed" }
    }
  }
  if (otp === '123456') {
    return {
      success: true,
      registered: true,
      token: 'demo-token-gharsekro',
      name: name || 'Rahul Sharma',
      email: 'rahul@gharsekro.com',
      profile: 'https://github.com/identicons/mock.png',
      type: 'RETAILER'
    }
  }
  return { success: false, registered: false, message: "Invalid OTP" }
}

