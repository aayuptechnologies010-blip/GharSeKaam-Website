import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Star, ChevronDown } from "lucide-react"
import { useCartContext } from "@/context/CartContext"
import { useEffect, useState } from "react"
import { getProducts, ApiProduct, ProductVariant } from "@/lib/api"
import { useNavigate } from "react-router-dom"

interface ProductGridProps {
  category?: string
  wholesale?: boolean
}

interface SelectedVariants {
  [productId: string]: ProductVariant
}

const ProductGrid = ({ category, wholesale = false }: ProductGridProps) => {
  const { addToCart } = useCartContext()
  const navigate = useNavigate()
  const [products, setProducts] = useState<ApiProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedVariants, setSelectedVariants] = useState<SelectedVariants>({})

  const userType = localStorage.getItem('userType')
  const isWholesaler = userType === 'WHOLESALER'
  const isLoggedIn = !!localStorage.getItem('authToken')
  const viewingWholesale = wholesale || isWholesaler

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const fetchedProducts = await getProducts()
        setProducts(fetchedProducts)
        setError(null)
      } catch (err: any) {
        console.error('Failed to fetch products:', err)
        setError(err?.message || 'Failed to load products')
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const filteredByCategory = category
    ? products.filter(product =>
        product.category &&
        product.category.title &&
        product.category.title.toLowerCase().replace(/\s+/g, '-') === category.toLowerCase()
      )
    : products

  const filteredProducts = filteredByCategory.filter((product) => {
    if (!product.availability) return true
    if (product.availability === 'BOTH') return true
    if (viewingWholesale) return product.availability === 'WHOLESALER'
    return product.availability === 'RETAILER'
  })

  const getProductPrice = (product: ApiProduct) => {
    const variant = selectedVariants[product.id]
    
    // If variant is selected, use variant price
    if (variant) {
      return variant.price
    }

    // Otherwise use base price
    if (isLoggedIn && isWholesaler && product.wholesaleprice) {
      return parseFloat(product.wholesaleprice)
    }
    return parseFloat(product.retailprice || '0')
  }

  const handleVariantSelect = (productId: string, variant: ProductVariant) => {
    setSelectedVariants(prev => ({
      ...prev,
      [productId]: variant
    }))
  }

  const getProductImage = (product: ApiProduct) => {
    return product.images && product.images.length > 0 ? product.images[0] : '/placeholder.svg'
  }

  const handleAddToCart = (product: ApiProduct) => {
    // If product has variants and no variant is selected, show an alert
    if (product.variants && product.variants.length > 0 && !selectedVariants[product.id]) {
      alert('Please select a variant/size before adding to cart')
      return
    }

    const price = getProductPrice(product)
    const variant = selectedVariants[product.id]
    
    addToCart({
      id: product.id,
      name: product.title,
      price: price,
      image: getProductImage(product),
      variant: variant
    })
  }

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`)
  }

  if (loading) {
    return (
      <div className="w-full">
        {/* Desktop Loading */}
        <div className="hidden sm:block container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Loading Products...</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Mobile Loading */}
        <div className="sm:hidden bg-white">
          <div className="px-3 py-3 border-b">
            <div className="h-5 bg-gray-200 rounded w-40 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 gap-2 p-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-sm overflow-hidden">
                <div className="p-3">
                  <div className="aspect-square bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="p-2 pt-0 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>
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

  return (
    <div className="w-full">
      {/* Desktop/Tablet View */}
      <div className="hidden sm:block container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Products` :
              viewingWholesale ? 'Wholesale Products' : 'Featured Products'}
          </h2>
          <Button variant="outline">View All</Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => {
            const price = getProductPrice(product)
            const isWholesaleProduct = isLoggedIn && isWholesaler && product.wholesaleprice

            return (
              <Card key={product.id} className="group hover:shadow-lg transition-all duration-normal border hover:border-primary/20 cursor-pointer">
                <CardContent className="p-4">
                  <div
                    className="relative mb-4"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden mb-3 group-hover:scale-105 transition-transform duration-normal">
                      <img
                        src={getProductImage(product)}
                        alt={product.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg'
                        }}
                      />
                    </div>

                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {isWholesaleProduct && (
                        <Badge variant="secondary" className="text-xs">
                          Wholesale
                        </Badge>
                      )}
                    </div>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-normal"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <h3
                      className="font-medium text-sm line-clamp-2 leading-5 cursor-pointer hover:text-primary"
                      onClick={() => handleProductClick(product.id)}
                    >
                      {product.title}
                    </h3>

                    <div className="flex items-center gap-1">
                      <div className="flex items-center">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs ml-1">4.0</span>
                      </div>
                      <span className="text-xs text-muted-foreground">(--)</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">
                        ₹{price.toLocaleString()}
                      </span>
                      {isWholesaleProduct && (
                        <Badge variant="secondary" className="text-xs">
                          Wholesale Rate
                        </Badge>
                      )}
                    </div>

                    <div className="text-xs">
                      <span className="text-green-600">In Stock</span>
                    </div>

                    {product.variants && product.variants.length > 0 && (
                      <div className="pt-2 border-t">
                        <label className="text-xs font-medium text-gray-600 block mb-2">
                          Select Size:
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {product.variants.map((variant) => (
                            <button
                              key={variant.size}
                              onClick={() => handleVariantSelect(product.id, variant)}
                              className={`px-2 py-1 text-xs rounded border transition-colors ${
                                selectedVariants[product.id]?.size === variant.size
                                  ? 'bg-primary text-white border-primary'
                                  : 'border-gray-300 hover:border-gray-400'
                              }`}
                            >
                              <span className="font-medium">{variant.size}</span>
                              {variant.price && (
                                <span className="block text-[10px]">₹{variant.price}</span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button
                      size="sm"
                      className="w-full mt-3"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAddToCart(product)
                      }}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-8">
            <p className="text-gray-500">No products found</p>
          </div>
        )}
      </div>

      {/* Mobile View - Flipkart Style */}
      <div className="sm:hidden bg-white min-h-screen">
        {/* Header */}
        <div className="px-3 py-3 bg-white border-b sticky top-0 z-10">
          <h2 className="text-base font-semibold text-gray-900">
            {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Products` :
              viewingWholesale ? 'Wholesale Products' : 'Featured Products'}
          </h2>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-0 bg-gray-100">
          {filteredProducts.map((product) => {
            const price = getProductPrice(product)
            const isWholesaleProduct = isLoggedIn && isWholesaler && product.wholesaleprice

            return (
              <div
                key={product.id}
                className="bg-white border-r border-b border-gray-200 active:bg-gray-50 transition-colors"
                onClick={() => handleProductClick(product.id)}
              >
                {/* Product Image Container */}
                <div className="relative bg-white p-4">
                  <div className="aspect-square flex items-center justify-center">
                    <img
                      src={getProductImage(product)}
                      alt={product.title}
                      className="w-full h-full object-contain mix-blend-multiply"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg'
                      }}
                    />
                  </div>
                  
                  {/* Wholesale Badge */}
                  {isWholesaleProduct && (
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4 font-medium">
                        Wholesale
                      </Badge>
                    </div>
                  )}

                  {/* Wishlist Icon */}
                  <button
                    className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm border border-gray-200 active:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                  >
                    <Heart className="h-3 w-3 text-gray-600" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-3 pt-1 space-y-1.5 border-t border-gray-100">
                  {/* Product Title */}
                  <h3 className="text-xs font-normal text-gray-700 line-clamp-2 leading-tight h-8">
                    {product.title}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center bg-green-700 text-white text-[10px] px-1.5 py-0.5 rounded-sm gap-0.5">
                      <span className="font-medium">4.0</span>
                      <Star className="h-2 w-2 fill-white" />
                    </div>
                    <span className="text-[10px] text-gray-500 font-medium">(--)</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1.5 pt-0.5">
                    <span className="font-bold text-base text-gray-900">
                      ₹{price.toLocaleString()}
                    </span>
                    {isWholesaleProduct && (
                      <span className="text-[9px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                        W. Rate
                      </span>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div className="text-[10px] text-green-700 font-medium">
                    In Stock
                  </div>

                  {/* Variants */}
                  {product.variants && product.variants.length > 0 && (
                    <div className="border-t pt-2 mt-2">
                      <p className="text-[9px] font-medium text-gray-600 mb-1.5">
                        Select Size:
                      </p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {product.variants.map((variant) => (
                          <button
                            key={variant.size}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleVariantSelect(product.id, variant)
                            }}
                            className={`px-1.5 py-1 text-[9px] rounded border transition-colors ${
                              selectedVariants[product.id]?.size === variant.size
                                ? 'bg-blue-600 text-white border-blue-600 font-medium'
                                : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                            }`}
                          >
                            <span className="block font-medium">{variant.size}</span>
                            {variant.price && (
                              <span className="block text-[8px]">₹{variant.price}</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add to Cart Button */}
                  <button
                    className="w-full mt-2 py-1.5 text-[11px] font-bold text-blue-600 border border-blue-600 rounded-sm hover:bg-blue-50 active:bg-blue-100 transition-colors tracking-wide"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAddToCart(product)
                    }}
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-12 px-4">
            <p className="text-gray-500 text-sm">No products found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductGrid