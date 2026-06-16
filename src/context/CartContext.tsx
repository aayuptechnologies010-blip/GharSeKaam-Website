import React, { createContext, useContext } from 'react'
import { useCart, CartItem } from '@/hooks/useCart'

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (product: Omit<CartItem, 'quantity'>) => void
  removeFromCart: (productId: string, variant?: { size: string }, isWholesale?: boolean) => void
  updateQuantity: (productId: string, quantity: number, variant?: { size: string }, isWholesale?: boolean) => void
  getTotalItems: () => number
  getTotalPrice: () => number
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const cart = useCart()

  return (
    <CartContext.Provider value={cart}>
      {children}
    </CartContext.Provider>
  )
}

export const useCartContext = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider')
  }
  return context
}