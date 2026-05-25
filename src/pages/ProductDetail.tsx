import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getProductDetail, ApiProductDetail } from '@/lib/api'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
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
  Share2
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'


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

  // Check if user is logged in and their type
  const userType = localStorage.getItem('userType')
  const isWholesaler = userType === 'WHOLESALER'
  const isLoggedIn = !!localStorage.getItem('authToken')

  useEffect(() => {
    if (!id) return

    const fetchProduct = async () => {
      try {
        setLoading(true)
        const productDetail = await getProductDetail(id)
        setProduct(productDetail)
        setError(null)
      } catch (err: any) {
        console.error('Failed to fetch product details:', err)
        setError(err?.message || 'Failed to load product details')
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const getProductPrice = () => {
    if (!product) return 0
    
    // If a variant is selected, use its price
    if (selectedVariant && product.variants) {
      const variant = product.variants.find(v => v.size === selectedVariant)
      if (variant) {
        return variant.price
      }
    }
    
    // Show wholesale price if wholesale price exists
    if (product.wholesaleprice) {
      console.log('Showing wholesale price:', product.wholesaleprice)
      return parseFloat(product.wholesaleprice)
    }
    // Otherwise show retail price
    return parseFloat(product.retailprice)
  }

  const getOriginalPrice = () => {
    if (!product) return 0
    const price = getProductPrice()
    const discountedPrice = price * (1 + product.discount / 100)
    return discountedPrice
  }

  const handleAddToCart = () => {
    if (!product) return

    const price = getProductPrice()
    const variant = selectedVariant && product.variants 
      ? product.variants.find(v => v.size === selectedVariant) 
      : undefined

    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.title,
        price: price,
        image: product.images[0] || '/placeholder.svg',
        variant: variant
      })
    }

    toast({
      title: "Added to Cart",
      description: `${quantity} ${product.title}${variant ? ` (${variant.size})` : ''} added to cart`,
    })
  }

  const handleQuantityChange = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta))
  }

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
                    <div key={i} className="w-20 h-20 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-10 bg-gray-200 rounded w-1/3"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
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
  const hasDiscount = product.discount > 0
  const isWholesaleProduct = isLoggedIn && isWholesaler && product.wholesaleprice

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <img
                src={product.images[selectedImage] || '/placeholder.svg'}
                alt={product.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg'
                }}
              />
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === index ? 'border-primary' : 'border-gray-200'
                      }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg'
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Product Info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{product.category.title}</Badge>
                {isWholesaleProduct && (
                  <Badge variant="secondary">Wholesale</Badge>
                )}
              </div>

              <h1 className="text-3xl font-bold mb-2">{product.title}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 text-gray-300" />
                </div>
                <span className="text-sm text-muted-foreground">(4.0)</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-bold">₹{price.toLocaleString()}</span>
                {hasDiscount && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      ₹{originalPrice.toLocaleString()}
                    </span>
                    <Badge variant="destructive">
                      {product.discount}% OFF
                    </Badge>
                  </>
                )}
                <span className="text-sm text-muted-foreground">per {product.unit}</span>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-6">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600">In Stock</span>
              </div>
            </div>

            <Separator />

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-3">Select Size:</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.size}
                        onClick={() => setSelectedVariant(variant.size)}
                        className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                          selectedVariant === variant.size
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {variant.size} - ₹{variant.price.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>
                <Separator />
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1"
                  size="lg"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <Separator />

            {/* Product Details */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Product Details</h3>
              <p className="text-muted-foreground">{product.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">
                    <span className="font-medium">Warranty:</span> {product.warranty}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-green-600" />
                  <span className="text-sm">
                    <span className="font-medium">Unit:</span> {product.unit}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Seller Information */}
            <Card>
              <CardContent className="p-4">
                <h4 className="font-bold mb-3">Seller Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Shop:</span>
                    <span>{product.shopkeeper.shopname}</span>
                  </div>
                  {product.shopkeeper.shopaddress.map((address, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {address.flatnumber}, {address.city}, {address.state} - {address.pincode}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default ProductDetail
