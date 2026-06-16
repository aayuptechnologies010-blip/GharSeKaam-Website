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
  flatnumber: string
  state: string
  phone: string
  type: "RETAILER" | "WHOLESALER"
  landmark?: string
  building?: string
  street?: string
  area?: string
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
    shopaddress: Array<{ city: string; state: string; pincode: string; flatnumber: string }>
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
      flatnumber: string
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
  const token = localStorage.getItem('authToken')
  const headers: HeadersInit = {}
  if (token) {
    headers['Authorization'] = token
  }
  const response = await fetch(`${url}/items`, { headers, signal })
  const data = await response.json()
  if (data.success && Array.isArray(data.items)) {
    return data.items
  }
  throw new Error(data.message || "Failed to retrieve items")
}

export async function getProductDetail(productId: string, signal?: AbortSignal): Promise<ApiProductDetail> {
  const token = localStorage.getItem('authToken')
  const headers: HeadersInit = {}
  if (token) {
    headers['Authorization'] = token
  }
  const response = await fetch(`${url}/item/${productId}`, { headers, signal })
  const data = await response.json()
  if (data.success && data.item) {
    return data.item
  }
  throw new Error(data.message || 'Product not found')
}

export async function signup(signupData: SignupData, googleToken?: string): Promise<SignupResponse> {
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
    flatnumber: string
    landmark?: string | null
    building?: string | null
    street?: string | null
    area?: string | null
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
  const token = localStorage.getItem('authToken')
  if (!token) throw new Error("Unauthorized");
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
}

export async function getOrders(_signal?: AbortSignal): Promise<ApiOrder[]> {
  const token = localStorage.getItem('authToken')
  if (!token) throw new Error("Unauthorized");
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
}

export async function cancelOrder(orderId: string): Promise<{ success: boolean; message?: string }> {
  const token = localStorage.getItem('authToken')
  if (!token) throw new Error("Unauthorized");
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
}

// Address related interfaces and functions
export interface Address {
  id: string
  city: string
  state: string
  pincode: string
  flatnumber: string
  landmark?: string | null
  building?: string | null
  street?: string | null
  area?: string | null
  customerid: string
  shopkeeperid: string | null
  latitude?: number | string | null
  longitude?: number | string | null
}

export interface AddAddressData {
  city: string
  pincode: string
  flatnumber: string
  landmark?: string
  building?: string
  street?: string
  area?: string
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



export async function addAddress(addressData: AddAddressData): Promise<{ success: boolean; message?: string }> {
  const token = localStorage.getItem('authToken')
  if (!token) throw new Error("Unauthorized");
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
      landmark: addressData.landmark,
      building: addressData.building,
      street: addressData.street,
      area: addressData.area,
      latitude: addressData.latitude,
      longitude: addressData.longitude
    })
  })
  const data = await response.json()
  if (data.success) {
    return { success: true }
  }
  return { success: false, message: data.message || "Failed to add address on backend" }
}

export async function getAllAddresses(_signal?: AbortSignal): Promise<Address[]> {
  const token = localStorage.getItem('authToken')
  if (!token) throw new Error("Unauthorized");
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
}



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
  try {
    const response = await fetch(`${url}/auth/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ emailOrPhone })
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || "Failed to send OTP")
    }
    return data
  } catch (error: any) {
    console.error("Backend sendOtp failed:", error)
    return { success: false, message: error.message || "Failed to send OTP" }
  }
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
  try {
    const response = await fetch(`${url}/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ emailOrPhone, otp, name })
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || "Verification failed")
    }
    return data
  } catch (error: any) {
    console.error("Backend verifyOtp failed:", error)
    return { success: false, registered: false, message: error.message || "Verification failed" }
  }
}

