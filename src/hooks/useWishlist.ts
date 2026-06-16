import { useState, useCallback, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'

export interface WishlistItem {
  id: string
  title: string
  price: number
  image: string
}

const WISHLIST_STORAGE_KEY = 'GharSeKro-wishlist'

export const useWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const { toast } = useToast()

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY)
    if (savedWishlist) {
      try {
        const parsed = JSON.parse(savedWishlist)
        if (Array.isArray(parsed)) {
          setWishlistItems(parsed)
        }
      } catch (error) {
        console.error('Failed to parse saved wishlist:', error)
        localStorage.removeItem(WISHLIST_STORAGE_KEY)
      }
    }
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistItems))
  }, [wishlistItems])

  const addToWishlist = useCallback((item: WishlistItem) => {
    setWishlistItems(prev => {
      if (prev.some(i => i.id === item.id)) return prev
      toast({
        title: "Saved to Wishlist",
        description: `${item.title} has been added to your wishlist.`,
      })
      return [...prev, item]
    })
  }, [toast])

  const removeFromWishlist = useCallback((id: string) => {
    setWishlistItems(prev => {
      const item = prev.find(i => i.id === id)
      if (item) {
        toast({
          title: "Removed from Wishlist",
          description: `${item.title} has been removed from your wishlist.`,
        })
      }
      return prev.filter(i => i.id !== id)
    })
  }, [toast])

  const toggleWishlist = useCallback((item: WishlistItem) => {
    setWishlistItems(prev => {
      const exists = prev.some(i => i.id === item.id)
      if (exists) {
        toast({
          title: "Removed from Wishlist",
          description: `${item.title} has been removed from your wishlist.`,
        })
        return prev.filter(i => i.id !== item.id)
      } else {
        toast({
          title: "Added to Wishlist",
          description: `${item.title} has been saved to your wishlist.`,
        })
        return [...prev, item]
      }
    })
  }, [toast])

  const isInWishlist = useCallback((id: string) => {
    return wishlistItems.some(i => i.id === id)
  }, [wishlistItems])

  return {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist
  }
}
