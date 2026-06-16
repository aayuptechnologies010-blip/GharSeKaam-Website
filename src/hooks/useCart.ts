import { useState, useCallback, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'

export interface CartItem {
  id: string  // Changed from number to string to match API
  name: string
  price: number
  quantity: number
  image: string
  isWholesale?: boolean
  variant?: {
    size: string
    price: number
  }
}

const CART_STORAGE_KEY = 'GharSeKro-cart'

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const { toast } = useToast()

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY)
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart)
        }
      } catch (error) {
        console.error('Failed to parse saved cart:', error)
        localStorage.removeItem(CART_STORAGE_KEY)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = useCallback((product: Omit<CartItem, 'quantity'>) => {
    setCartItems(prevItems => {
      // Create a unique identifier that includes variant information and wholesale status
      const itemKey = product.variant 
        ? `${product.id}-${product.variant.size}-${product.isWholesale ? 'wholesale' : 'retail'}` 
        : `${product.id}-${product.isWholesale ? 'wholesale' : 'retail'}`
      
      const existingItem = prevItems.find(item => {
        const existingKey = item.variant 
          ? `${item.id}-${item.variant.size}-${item.isWholesale ? 'wholesale' : 'retail'}` 
          : `${item.id}-${item.isWholesale ? 'wholesale' : 'retail'}`
        return existingKey === itemKey
      })
      
      if (existingItem) {
        toast({
          title: "Updated Cart",
          description: `${product.name}${product.variant ? ` (${product.variant.size})` : ''} quantity increased`,
        })
        return prevItems.map(item => {
          const existingKey = item.variant 
            ? `${item.id}-${item.variant.size}-${item.isWholesale ? 'wholesale' : 'retail'}` 
            : `${item.id}-${item.isWholesale ? 'wholesale' : 'retail'}`
          return existingKey === itemKey
            ? { ...item, quantity: item.quantity + 1 }
            : item
        })
      } else {
        toast({
          title: "Added to Cart",
          description: `${product.name}${product.variant ? ` (${product.variant.size})` : ''} added to cart`,
        })
        return [...prevItems, { ...product, quantity: 1 }]
      }
    })
  }, [toast])

  const removeFromCart = useCallback((productId: string, variant?: { size: string }, isWholesale?: boolean) => {
    setCartItems(prevItems => {
      const itemToRemove = prevItems.find(item => {
        const matchWholesale = isWholesale !== undefined ? item.isWholesale === isWholesale : true
        if (variant) {
          return item.id === productId && item.variant?.size === variant.size && matchWholesale
        }
        return item.id === productId && matchWholesale
      })
      
      if (itemToRemove) {
        const itemName = `${itemToRemove.name}${itemToRemove.variant ? ` (${itemToRemove.variant.size})` : ''}`
        toast({
          title: "Removed from Cart",
          description: `${itemName} removed from cart`,
        })
      }
      
      return prevItems.filter(item => {
        const matchWholesale = isWholesale !== undefined ? item.isWholesale === isWholesale : true
        if (variant) {
          return !(item.id === productId && item.variant?.size === variant.size && matchWholesale)
        }
        return !(item.id === productId && matchWholesale)
      })
    })
  }, [toast])

  const updateQuantity = useCallback((productId: string, quantity: number, variant?: { size: string }, isWholesale?: boolean) => {
    if (quantity <= 0) {
      removeFromCart(productId, variant, isWholesale)
      return
    }
    
    setCartItems(prevItems =>
      prevItems.map(item => {
        const matchWholesale = isWholesale !== undefined ? item.isWholesale === isWholesale : true
        if (variant) {
          return (item.id === productId && item.variant?.size === variant.size && matchWholesale)
            ? { ...item, quantity }
            : item
        }
        return (item.id === productId && matchWholesale)
          ? { ...item, quantity }
          : item
      })
    )
  }, [removeFromCart])

  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }, [cartItems])

  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }, [cartItems])

  const clearCart = useCallback(() => {
    setCartItems([])
    localStorage.removeItem(CART_STORAGE_KEY)
    toast({
      title: "Cart Cleared",
      description: "All items removed from cart",
    })
  }, [toast])

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalItems,
    getTotalPrice,
    clearCart
  }
}