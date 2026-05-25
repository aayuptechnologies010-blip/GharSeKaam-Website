import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Minus, Plus, Trash2, ShoppingBag, MapPin, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useCartContext } from "@/context/CartContext"
import { createOrder, CreateOrderData, getAllAddresses, Address } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import AddAddressModal from "@/components/AddAddressModal"

const Cart = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCartContext()
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string>("")
  const [loadingAddresses, setLoadingAddresses] = useState(false)
  const [showAddAddressModal, setShowAddAddressModal] = useState(false)

  // Load addresses when component mounts
  useEffect(() => {
    loadAddresses()
  }, [])

  const loadAddresses = async () => {
    const authToken = localStorage.getItem('authToken')
    if (!authToken) return

    try {
      setLoadingAddresses(true)
      const fetchedAddresses = await getAllAddresses()
      setAddresses(fetchedAddresses)

      // Auto-select first address if available
      if (fetchedAddresses.length > 0 && !selectedAddressId) {
        setSelectedAddressId(fetchedAddresses[0].id)
      }
    } catch (error) {
      console.error('Failed to load addresses:', error)
    } finally {
      setLoadingAddresses(false)
    }
  }

  const handleAddressAdded = () => {
    loadAddresses()
  }

  const handleQuantityChange = (productId: string, newQuantity: number, variant?: { size: string }) => {
    if (newQuantity < 1) {
      removeFromCart(productId, variant)
    } else {
      updateQuantity(productId, newQuantity, variant)
    }
  }

  const handleCreateOrder = async () => {
    const authToken = localStorage.getItem('authToken')
    if (!authToken) {
      toast({
        title: "Login Required",
        description: "Please login to place an order",
        variant: "destructive"
      })
      navigate('/login')
      return
    }

    if (cartItems.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Add items to cart before placing an order",
        variant: "destructive"
      })
      return
    }

    if (!selectedAddressId) {
      toast({
        title: "Address Required",
        description: "Please select a delivery address",
        variant: "destructive"
      })
      return
    }

    try {
      setIsCreatingOrder(true)

      const orderData: CreateOrderData = {
        addressId: selectedAddressId,
        paymentType: "COD",
        items: cartItems.map(item => ({
          itemId: item.id,
          quantity: item.quantity,
          variant: item.variant
        }))
      }

      const result = await createOrder(orderData)

      if (result.success) {
        clearCart()
        toast({
          title: "Order Placed Successfully!",
          description: `Order ID: ${result.orderId || 'Generated'}`,
        })
        navigate('/orders')
      }
    } catch (error: any) {
      console.error('Order creation failed:', error)
      toast({
        title: "Order Failed",
        description: error?.message || "Failed to place order. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsCreatingOrder(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-3xl font-bold mb-2">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-6">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Button onClick={() => navigate('/')} size="lg">
              Continue Shopping
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">Shopping Cart</h1>
              <Badge variant="secondary">{cartItems.length} items</Badge>
            </div>

            <div className="space-y-4">
              {cartItems.map((item) => {
                const uniqueKey = item.variant 
                  ? `${item.id}-${item.variant.size}` 
                  : item.id
                return (
                  <Card key={uniqueKey}>
                    <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg'
                          }}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="font-medium text-sm mb-1">{item.name}</h3>
                        {item.variant && (
                          <p className="text-xs text-gray-600 mb-1">Size: {item.variant.size}</p>
                        )}
                        <p className="text-lg font-bold">₹{item.price.toLocaleString()}</p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.variant)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.variant)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right min-w-[100px]">
                        <p className="font-bold">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>

                      {/* Remove Button */}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => removeFromCart(item.id, item.variant)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                )
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-80">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                {/* Address Selection */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Delivery Address
                    </h3>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowAddAddressModal(true)}
                      className="text-xs"
                    >
                      <PlusCircle className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  </div>

                  {loadingAddresses ? (
                    <div className="text-sm text-muted-foreground">Loading addresses...</div>
                  ) : addresses.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                      <p className="mb-2">No addresses found.</p>
                      <Button
                        size="sm"
                        onClick={() => setShowAddAddressModal(true)}
                        className="w-full"
                      >
                        Add Your First Address
                      </Button>
                    </div>
                  ) : (
                    <RadioGroup value={selectedAddressId} onValueChange={setSelectedAddressId}>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {addresses.map((address) => (
                          <div key={address.id} className="flex items-start space-x-2">
                            <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                            <Label htmlFor={address.id} className="text-xs leading-relaxed cursor-pointer">
                              <div className="font-medium">{address.flatnumber}, {address.city}</div>
                              <div className="text-muted-foreground">
                                {address.state} - {address.pincode}
                              </div>
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{getTotalPrice().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-success">Free</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{getTotalPrice().toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleCreateOrder}
                  disabled={isCreatingOrder || !selectedAddressId}
                >
                  {isCreatingOrder ? "Placing Order..." : "Place Order (COD)"}
                </Button>

                <Button
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => navigate('/')}
                >
                  Continue Shopping
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      <AddAddressModal
        isOpen={showAddAddressModal}
        onClose={() => setShowAddAddressModal(false)}
        onAddressAdded={handleAddressAdded}
      />

      <Footer />
    </div>
  )
}

export default Cart
