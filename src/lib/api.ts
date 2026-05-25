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
  const endpoint = `${url}/user/inventory/categories`
  const res = await fetch(endpoint, { signal })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Failed to load categories: ${res.status} ${res.statusText} ${text}`)
  }
  const data = await res.json().catch(() => null)
  if (!data || !data.success) {
    throw new Error('Categories response did not include success=true')
  }
  return data.categories || []
}

export async function getProducts(signal?: AbortSignal): Promise<ApiProduct[]> {
  const endpoint = `${url}/user/inventory/items`

  // Check if user is logged in and get token
  const authToken = localStorage.getItem('authToken')

  const headers: Record<string, string> = {}

  // Only include Authorization header if token exists
  if (authToken) {
    headers['Authorization'] = authToken
  }

  const res = await fetch(endpoint, {
    signal,
    headers: Object.keys(headers).length > 0 ? headers : undefined
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Failed to load products: ${res.status} ${res.statusText} ${text}`)
  }

  const data = await res.json().catch(() => null)
  if (!data || !data.success) {
    throw new Error('Products response did not include success=true')
  }

  return data.items || []
}

export async function getProductDetail(productId: string, signal?: AbortSignal): Promise<ApiProductDetail> {
  const endpoint = `${url}/user/inventory/item/${productId}`

  // Check if user is logged in and get token
  const authToken = localStorage.getItem('authToken')

  const headers: Record<string, string> = {}

  // Only include Authorization header if token exists
  if (authToken) {
    headers['Authorization'] = authToken
  }

  const res = await fetch(endpoint, {
    signal,
    headers: Object.keys(headers).length > 0 ? headers : undefined
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Failed to load product details: ${res.status} ${res.statusText} ${text}`)
  }

  const data = await res.json().catch(() => null)
  if (!data || !data.success) {
    throw new Error('Product detail response did not include success=true')
  }

  return data.item
}

export async function signup(signupData: SignupData, googleToken?: string): Promise<SignupResponse> {
  const endpoint = `${url}/user/auth/signup`
  const body = {
    ...signupData
  }

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }

  // Include Google token in Authorization header if provided
  if (googleToken) {
    headers['Authorization'] = `${googleToken}`
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })

  const data = await res.json().catch(() => null)
  if (!res.ok || !data || !data.success) {
    const errorMsg = (data && (data.message || JSON.stringify(data))) || `${res.status} ${res.statusText}`
    throw new Error(errorMsg)
  }

  return data
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
  paymentType: "COD"
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
}

export interface OrdersResponse {
  success: boolean
  orders: ApiOrder[]
}

export async function createOrder(orderData: CreateOrderData): Promise<CreateOrderResponse> {
  const endpoint = `${url}/user/orders`
  const authToken = localStorage.getItem('authToken')

  if (!authToken) {
    throw new Error('Authentication required to create order')
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': authToken
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(orderData),
  })

  const data = await res.json().catch(() => null)
  if (!res.ok || !data || !data.success) {
    const errorMsg = (data && (data.message || JSON.stringify(data))) || `${res.status} ${res.statusText}`
    throw new Error(errorMsg)
  }

  return data
}

export async function getOrders(signal?: AbortSignal): Promise<ApiOrder[]> {
  const endpoint = `${url}/user/orders`
  const authToken = localStorage.getItem('authToken')

  if (!authToken) {
    throw new Error('Authentication required to view orders')
  }

  const headers: Record<string, string> = {
    'Authorization': authToken
  }

  const res = await fetch(endpoint, {
    signal,
    headers
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Failed to load orders: ${res.status} ${res.statusText} ${text}`)
  }

  const data = await res.json().catch(() => null)
  if (!data || !data.success) {
    throw new Error('Orders response did not include success=true')
  }

  return data.orders || []
}

export async function cancelOrder(orderId: string): Promise<{ success: boolean; message?: string }> {
  const endpoint = `${url}/user/orders/${orderId}/cancel`
  const authToken = localStorage.getItem('authToken')

  if (!authToken) {
    throw new Error('Authentication required to cancel order')
  }

  const res = await fetch(endpoint, {
    method: 'PUT',
    headers: {
      'Authorization': authToken,
      'Content-Type': 'application/json'
    }
  })

  const data = await res.json().catch(() => null)
  if (!res.ok || !data || !data.success) {
    const errorMsg = (data && (data.message || JSON.stringify(data))) || `${res.status} ${res.statusText}`
    throw new Error(errorMsg)
  }

  return data
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
}

export interface AddAddressData {
  city: string
  pincode: string
  flatnumber: number
  state: string
  phone: string
}

export interface AddressResponse {
  success: boolean
  addresses?: Address[]
}

export async function addAddress(addressData: AddAddressData): Promise<{ success: boolean }> {
  const token = localStorage.getItem('authToken')
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }

  if (token) {
    headers['Authorization'] = `${token}`
  }

  const endpoint = `${url}/user/address/add`
  const res = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(addressData)
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Failed to add address: ${res.status} ${res.statusText} ${text}`)
  }

  const data = await res.json().catch(() => null)
  return { success: data?.success || false }
}

export async function getAllAddresses(signal?: AbortSignal): Promise<Address[]> {
  const token = localStorage.getItem('authToken')
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }

  if (token) {
    headers['Authorization'] = `${token}`
  }

  const endpoint = `${url}/user/address/all`
  const res = await fetch(endpoint, {
    method: 'GET',
    signal,
    headers
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Failed to load addresses: ${res.status} ${res.statusText} ${text}`)
  }

  const data = await res.json().catch(() => null)
  if (!data || !data.success) {
    throw new Error('Addresses response did not include success=true')
  }

  return data.addresses || []
}

// Future API helpers can be added here to keep all network calls in one place.
