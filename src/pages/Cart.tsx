import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Minus, Plus, Trash2, ShoppingBag, MapPin, PlusCircle, CheckCircle, Percent, Gift, Truck, CreditCard, Smartphone, ShieldCheck, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
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

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

const Cart = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCartContext()
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string>("")
  const [loadingAddresses, setLoadingAddresses] = useState(false)
  const [showAddAddressModal, setShowAddAddressModal] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "delivery">("cart")
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE">("COD")
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentSimulating, setPaymentSimulating] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [paymentTab, setPaymentTab] = useState<"upi" | "card">("upi")
  const [upiId, setUpiId] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvv, setCardCvv] = useState("")

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

  const handleQuantityChange = (productId: string, newQuantity: number, variant?: { size: string }, isWholesale?: boolean) => {
    if (newQuantity < 1) {
      removeFromCart(productId, variant, isWholesale)
    } else {
      updateQuantity(productId, newQuantity, variant, isWholesale)
    }
  }

  // Calculate pricing breakdown
  const subtotal = getTotalPrice()
  const discountSavings = Math.round(subtotal * 0.18) // Simulated 18% general discount
  const originalSubtotal = subtotal + discountSavings
  const shippingCharges = subtotal >= 1000 ? 0 : (subtotal >= 500 ? 25 : 49)
  const netTotal = subtotal + shippingCharges

  const executeOrderCreation = async (type: "COD" | "ONLINE") => {
    try {
      setIsCreatingOrder(true)

      const orderData: CreateOrderData = {
        addressId: selectedAddressId,
        paymentType: type,
        items: cartItems.map(item => ({
          itemId: item.id.includes('-bundle-') ? item.id.split('-bundle-')[0] : item.id,
          quantity: item.quantity,
          variant: item.variant,
          isWholesale: !!item.isWholesale
        }))
      }

      const result = await createOrder(orderData)

      if (result.success) {
        clearCart()
        toast({
          title: "Order Placed Successfully!",
          description: `Order ID: ${result.orderId || 'Generated'}`,
        })
        navigate('/checkout-success', { state: { orderId: result.orderId || `GSK-${Date.now().toString().slice(-6)}`, address: addresses.find(a => a.id === selectedAddressId), paymentType: type } })
      } else {
        toast({
          title: "Order Failed",
          description: result.message || "Failed to place order.",
          variant: "destructive"
        })
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

    const selectedAddress = addresses.find(a => a.id === selectedAddressId)
    if (selectedAddress && (selectedAddress.city.toLowerCase() !== 'gorakhpur' || selectedAddress.state.toLowerCase() !== 'uttar pradesh')) {
      toast({
        title: "Service Not Available",
        description: "Sorry, currently we are not working in your city. We only support orders in Gorakhpur.",
        variant: "destructive"
      })
      return
    }

    if (paymentMethod === "ONLINE") {
      setIsCreatingOrder(true)
      const sdkLoaded = await loadRazorpayScript()
      if (!sdkLoaded) {
        toast({
          title: "Payment Gateway Error",
          description: "Failed to load payment gateway. Please check your internet connection.",
          variant: "destructive"
        })
        setIsCreatingOrder(false)
        return
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_live_TE6fr1TqKLYn5F",
        amount: Math.round(netTotal * 100),
        currency: "INR",
        name: "GharSeKro",
        description: "Payment for order",
        image: "/logo.png",
        handler: async function (response: any) {
          toast({
            title: "Payment Successful",
            description: `Payment ID: ${response.razorpay_payment_id}. Creating order...`,
          })
          await executeOrderCreation("ONLINE")
        },
        prefill: {
          name: localStorage.getItem('userName') || '',
          email: localStorage.getItem('userEmail') || '',
        },
        theme: {
          color: "#f59e0b"
        },
        modal: {
          ondismiss: function() {
            setIsCreatingOrder(false)
          }
        }
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.open()
      return
    }

    await executeOrderCreation("COD")
  }

  const handleSimulatePayment = () => {
    if (paymentTab === "upi" && !upiId.includes("@")) {
      toast({
        title: "Invalid UPI ID",
        description: "Please enter a valid UPI address (e.g. user@upi)",
        variant: "destructive"
      })
      return
    }
    if (paymentTab === "card" && (cardNumber.replace(/\D/g, "").length < 16 || cardCvv.length < 3)) {
      toast({
        title: "Invalid Card Details",
        description: "Please fill out standard 16-digit card and 3-digit CVV fields.",
        variant: "destructive"
      })
      return
    }

    setPaymentSimulating(true)
    setTimeout(() => {
      setPaymentSimulating(false)
      setPaymentSuccess(true)
      setTimeout(async () => {
        setShowPaymentModal(false)
        setPaymentSuccess(false)
        setUpiId("")
        setCardNumber("")
        setCardExpiry("")
        setCardCvv("")
        await executeOrderCreation("ONLINE")
      }, 1500)
    }, 2000)
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <div>
          <Header />
          <div className="container mx-auto px-4 py-16">
            <div className="text-center py-16 bg-white border rounded-3xl max-w-2xl mx-auto shadow-sm space-y-6 p-8">
              <div className="h-24 w-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-500 shadow">
                <ShoppingBag className="h-12 w-12" />
              </div>
              <h1 className="text-3xl font-black text-slate-800">Your Cart is Empty</h1>
              <p className="text-slate-500 max-w-sm mx-auto leading-relaxed text-sm font-semibold">
                Looks like you haven't added any premium hardware supplies or tools to your cart yet. Let's add some!
              </p>
              <Button onClick={() => navigate('/')} size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl px-8 shadow-md">
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col text-left">
      <Header />
      
      {/* Interactive Flipkart-Style Progress Stepper */}
      <div className="bg-white border-b py-5 shadow-sm">
        <div className="container mx-auto px-4 max-w-3xl flex items-center justify-between text-xs font-bold text-slate-500">
          <div 
            onClick={() => setCheckoutStep("cart")}
            className={`flex items-center gap-2 cursor-pointer transition-colors ${checkoutStep === "cart" ? 'text-amber-600' : 'hover:text-slate-600'}`}
          >
            <span className={`h-6 w-6 rounded-full flex items-center justify-center border-2 ${checkoutStep === "cart" ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-slate-300'}`}>1</span>
            <span>Shopping Cart</span>
          </div>
          <div className="flex-1 h-0.5 bg-slate-200 mx-4"></div>
          <div 
            onClick={() => {
              const authToken = localStorage.getItem('authToken')
              if (!authToken) {
                toast({
                  title: "Login Required",
                  description: "Please login to proceed to checkout",
                  variant: "destructive"
                })
                navigate('/login')
                return
              }
              if (checkoutStep === "delivery" || checkoutStep === "cart") {
                setCheckoutStep("delivery");
              }
            }}
            className={`flex items-center gap-2 cursor-pointer transition-colors ${checkoutStep === "delivery" ? 'text-amber-600' : 'hover:text-slate-600'}`}
          >
            <span className={`h-6 w-6 rounded-full flex items-center justify-center border-2 ${checkoutStep === "delivery" ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-slate-300'}`}>2</span>
            <span>Shipping & Review</span>
          </div>
          <div className="flex-1 h-0.5 bg-slate-200 mx-4"></div>
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-full flex items-center justify-center border-2 border-slate-300">3</span>
            <span>Payment (COD)</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Column: Interactive Cart Details */}
          <div className="flex-1 space-y-6">
            
            {checkoutStep === "cart" ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Shopping Cart</h1>
                  <Badge variant="secondary" className="bg-slate-800 text-amber-500 hover:bg-slate-800 font-extrabold uppercase px-2.5 py-1">
                    {cartItems.length} items
                  </Badge>
                </div>

                <div className="space-y-4">
                  {cartItems.map((item) => {
                    const uniqueKey = item.variant 
                      ? `${item.id}-${item.variant.size}-${item.isWholesale ? 'wholesale' : 'retail'}` 
                      : `${item.id}-${item.isWholesale ? 'wholesale' : 'retail'}`
                    return (
                      <Card key={uniqueKey} className="border border-slate-200 hover:shadow-md transition-shadow rounded-2xl overflow-hidden bg-white">
                        <CardContent className="p-5">
                          <div className="flex flex-col sm:flex-row items-center gap-4">
                            
                            {/* Product Image */}
                            <div className="w-24 h-24 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-contain mix-blend-multiply"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://images.unsplash.com/photo-1608613304899-ea8098577e38?auto=format&fit=crop&w=400&q=80'
                                }}
                              />
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 text-center sm:text-left space-y-1">
                              <h3 className="font-bold text-slate-800 text-sm leading-tight hover:text-amber-600 cursor-pointer" onClick={() => navigate(`/product/${item.id}`)}>{item.name}</h3>
                              {item.variant && (
                                <p className="text-xs text-slate-500 font-semibold">Size: <span className="text-slate-800">{item.variant.size}</span></p>
                              )}
                              <p className="text-[10px] text-green-600 font-bold uppercase">Seller: Authorized Supplier</p>
                              
                              <div className="flex items-baseline gap-2 justify-center sm:justify-start pt-1">
                                <span className="text-base font-black text-slate-900">₹{item.price.toLocaleString()}</span>
                                <span className="text-xs text-slate-400 line-through">₹{Math.round(item.price * 1.2).toLocaleString()}</span>
                              </div>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2 bg-slate-50 border rounded-xl overflow-hidden">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 hover:bg-slate-100 border-none rounded-none"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.variant, item.isWholesale)}
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </Button>
                              <span className="w-10 text-center text-xs font-black text-slate-800">{item.quantity}</span>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 hover:bg-slate-100 border-none rounded-none"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.variant, item.isWholesale)}
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </Button>
                            </div>

                            {/* Item Total */}
                            <div className="text-right min-w-[100px] shrink-0">
                              <p className="font-black text-slate-900 text-base">₹{(item.price * item.quantity).toLocaleString()}</p>
                              <p className="text-[10px] text-green-600 font-bold">18% discount applied</p>
                            </div>

                            {/* Remove Button */}
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-9 w-9 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
                              onClick={() => removeFromCart(item.id, item.variant, item.isWholesale)}
                            >
                              <Trash2 className="h-4.5 w-4.5" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                <div className="flex justify-end pt-4">
                  <Button 
                    size="lg"
                    onClick={() => {
                      const authToken = localStorage.getItem('authToken')
                      if (!authToken) {
                        toast({
                          title: "Login Required",
                          description: "Please login to proceed to delivery details",
                          variant: "destructive"
                        })
                        navigate('/login')
                        return
                      }
                      setCheckoutStep("delivery")
                    }}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl px-8 shadow-md"
                  >
                    Proceed to Delivery address
                  </Button>
                </div>
              </div>
            ) : (
              // Step 2: Address Selection
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                    <MapPin className="h-6 w-6 text-amber-500" /> Select Delivery Address
                  </h2>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowAddAddressModal(true)}
                    className="text-xs font-bold border-slate-200 rounded-xl"
                  >
                    <PlusCircle className="h-4 w-4 mr-1.5 text-amber-500" /> Add Address
                  </Button>
                </div>

                {loadingAddresses ? (
                  <div className="text-sm font-semibold text-slate-500 py-8 text-center animate-pulse">Loading saved addresses...</div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-12 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                    <p className="text-sm font-semibold text-slate-500">No saved addresses found. Please add a shipping location.</p>
                    <Button
                      size="sm"
                      onClick={() => setShowAddAddressModal(true)}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl"
                    >
                      Add Your First Address
                    </Button>
                  </div>
                ) : (
                  <RadioGroup value={selectedAddressId} onValueChange={setSelectedAddressId}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map((address) => {
                        const isSelected = selectedAddressId === address.id
                        return (
                          <div 
                            key={address.id} 
                            onClick={() => setSelectedAddressId(address.id)}
                            className={`flex items-start gap-3 p-5 rounded-2xl border-2 bg-white shadow-sm cursor-pointer transition-all ${
                              isSelected ? 'border-amber-500 bg-amber-50/20' : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                            <Label htmlFor={address.id} className="text-xs leading-relaxed cursor-pointer text-left space-y-1 block flex-1">
                              <div className="font-extrabold text-sm text-slate-800">Address Location</div>
                              <div className="font-bold text-slate-700">
                                {address.flatnumber}
                                {address.building && `, ${address.building}`}
                                {address.street && `, ${address.street}`}
                                {address.area && `, ${address.area}`}
                              </div>
                              <div className="text-slate-500 font-semibold">
                                {address.landmark && <span className="block text-slate-500 text-xs mt-0.5">Near {address.landmark}</span>}
                                {address.city}, {address.state} - <span className="font-bold text-slate-800">{address.pincode}</span>
                              </div>
                              {isSelected && (
                                <Badge className="bg-amber-500 text-slate-950 font-bold uppercase tracking-wider text-[8px] mt-2 border-none">
                                  Selected Destination
                                </Badge>
                              )}
                            </Label>
                          </div>
                        )
                      })}
                    </div>
                  </RadioGroup>
                )}

                {/* Payment Selection */}
                <div className="space-y-4 pt-6 border-t mt-6">
                  <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">Select Payment Method</h3>
                  <RadioGroup value={paymentMethod} onValueChange={(val: any) => setPaymentMethod(val)}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div 
                        onClick={() => setPaymentMethod("COD")}
                        className={`flex items-center space-x-3 p-4 rounded-xl border-2 bg-white cursor-pointer transition-all ${
                          paymentMethod === "COD" ? 'border-amber-500 bg-amber-50/10' : 'border-slate-200 hover:border-slate-350'
                        }`}
                      >
                        <RadioGroupItem value="COD" id="pay-cod" />
                        <Label htmlFor="pay-cod" className="font-bold cursor-pointer text-xs text-slate-700">Cash on Delivery (COD)</Label>
                      </div>
                      <div 
                        onClick={() => setPaymentMethod("ONLINE")}
                        className={`flex items-center space-x-3 p-4 rounded-xl border-2 bg-white cursor-pointer transition-all ${
                          paymentMethod === "ONLINE" ? 'border-amber-500 bg-amber-50/10' : 'border-slate-200 hover:border-slate-350'
                        }`}
                      >
                        <RadioGroupItem value="ONLINE" id="pay-online" />
                        <Label htmlFor="pay-online" className="font-bold cursor-pointer text-xs text-slate-700 flex items-center justify-between w-full">
                          <span>Pay Online (Pre-paid)</span>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex justify-between items-center pt-6 border-t mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => setCheckoutStep("cart")}
                    className="border-slate-200 rounded-xl font-bold"
                  >
                    Back to Cart
                  </Button>
                  <Button
                    size="lg"
                    onClick={handleCreateOrder}
                    disabled={isCreatingOrder || !selectedAddressId}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl px-8 shadow-md"
                  >
                    {isCreatingOrder ? "Placing Order..." : paymentMethod === "ONLINE" ? "Pay & Confirm Order" : "Confirm & Place Order"}
                  </Button>
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Premium Order Price Breakdown (lg:w-96) */}
          <div className="w-full lg:w-[360px] shrink-0 lg:sticky lg:top-24">
            <Card className="border border-slate-200 shadow-xl rounded-3xl overflow-hidden bg-white text-left">
              
              {/* Header Badge */}
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4 text-white flex items-center justify-between">
                <h3 className="font-black text-sm uppercase tracking-wide">Price Details</h3>
                <Gift className="h-4.5 w-4.5" />
              </div>

              <CardContent className="p-6 space-y-4">
                
                {/* Stepper info */}
                <div className="flex items-center gap-2 bg-slate-50 border rounded-xl p-2.5 text-[11px] font-semibold text-slate-600">
                  <Truck className="h-4 w-4 text-amber-500 shrink-0" />
                  <span>Free delivery above ₹1000 orders! (₹25 below ₹1000, ₹49 below ₹500)</span>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="flex justify-between text-slate-500 font-semibold">
                    <span>Base MRP ({cartItems.length} items)</span>
                    <span className="line-through">₹{originalSubtotal.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between text-slate-500 font-semibold">
                    <span>Discount Savings</span>
                    <span className="text-green-600 font-bold">- ₹{discountSavings.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-slate-500 font-semibold">
                    <span>Order Subtotal</span>
                    <span className="font-extrabold text-slate-800">₹{subtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-slate-500 font-semibold">
                    <span>Shipping Fee</span>
                    {shippingCharges === 0 ? (
                      <span className="text-green-600 font-extrabold uppercase">Free Delivery</span>
                    ) : (
                      <span className="font-bold text-slate-800">₹{shippingCharges}</span>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between text-base font-black text-slate-900 pt-1">
                    <span>Total Amount</span>
                    <span>₹{netTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Celebratory Savings Banner */}
                <div className="bg-green-50 border border-green-200 text-green-700 text-xs font-bold rounded-2xl p-3 flex items-center gap-2.5 animate-pulse">
                  <CheckCircle className="h-5 w-5 shrink-0" />
                  <div>
                    <span>You save ₹{discountSavings.toLocaleString()} on this order! 🎉</span>
                    <span className="block text-[10px] text-green-600/80 font-medium">GharSeKro Mega Savings applied</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2.5 text-[10px] text-slate-400 leading-normal font-semibold">
                  <p>✔️ 100% Secure Transaction Guarantee</p>
                  <p>✔️ Easy replacement on damaged hardware items</p>
                  <p>✔️ Same-day dispatch on prompt confirmations</p>
                </div>

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

      {/* Mock Razorpay Secure Payment Gateway Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 flex flex-col justify-between"
            >
              
              {/* Razorpay branded header */}
              <div className="bg-[#172b4d] p-5 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-base shadow">GSK</span>
                  <div>
                    <h4 className="font-extrabold text-sm tracking-tight text-slate-100">Secure Checkout</h4>
                    <span className="text-[9px] text-[#febd69] font-black uppercase tracking-wider">Secure Payment Gateway</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase">Payable Amount</span>
                  <span className="text-lg font-black text-white">₹{netTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Loader screen when payment is simulating */}
              {paymentSimulating ? (
                <div className="p-10 flex flex-col items-center justify-center space-y-4 text-center min-h-[300px]">
                  <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                  <div>
                    <h5 className="font-bold text-slate-800 text-base">Processing Transaction...</h5>
                    <p className="text-xs text-slate-400 mt-1">Please do not refresh the page or click back button.</p>
                  </div>
                </div>
              ) : paymentSuccess ? (
                <div className="p-10 flex flex-col items-center justify-center space-y-4 text-center min-h-[300px]">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center shadow-inner">
                    <CheckCircle className="w-10 h-10 text-green-600 animate-bounce" />
                  </div>
                  <div>
                    <h5 className="font-black text-green-700 text-lg">Payment Successful!</h5>
                    <p className="text-xs text-slate-500 font-semibold mt-1">₹{netTotal.toLocaleString()} successfully captured.</p>
                  </div>
                </div>
              ) : (
                /* Payment form */
                <div className="p-6 space-y-6">
                  {/* Tabs */}
                  <div className="flex border-b text-xs font-bold text-slate-500">
                    <button 
                      onClick={() => setPaymentTab("upi")}
                      className={`flex-1 pb-3 flex items-center justify-center gap-1.5 border-b-2 cursor-pointer transition-all ${
                        paymentTab === "upi" ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-700'
                      }`}
                    >
                      <Smartphone className="w-4 h-4" /> UPI / GooglePay
                    </button>
                    <button 
                      onClick={() => setPaymentTab("card")}
                      className={`flex-1 pb-3 flex items-center justify-center gap-1.5 border-b-2 cursor-pointer transition-all ${
                        paymentTab === "card" ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-700'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" /> Debit/Credit Card
                    </button>
                  </div>

                  {paymentTab === "upi" ? (
                    <div className="space-y-4 text-left">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Enter Virtual Payment Address (VPA)</label>
                        <input
                          placeholder="username@upi"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="w-full h-11 border border-slate-200 rounded-xl px-4 text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-600"
                        />
                      </div>
                      <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-100 text-[10px] text-blue-800 leading-normal font-semibold">
                        💡 Click the simulate button below to process this virtual payment instantly. You can enter any mock address (e.g. buildmart@okhdfcbank).
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 text-left">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Card Number</label>
                        <input
                          placeholder="4111 2222 3333 4444"
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => {
                            let val = e.target.value.replace(/\D/g, "");
                            let parts = [];
                            for (let i = 0; i < val.length; i += 4) {
                              parts.push(val.substring(i, i + 4));
                            }
                            setCardNumber(parts.join(" "));
                          }}
                          className="w-full h-11 border border-slate-200 rounded-xl px-4 text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-600"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Expiry Date</label>
                          <input
                            placeholder="MM/YY"
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => {
                              let val = e.target.value.replace(/\D/g, "");
                              if (val.length > 2) val = val.substring(0, 2) + "/" + val.substring(2);
                              setCardExpiry(val);
                            }}
                            className="w-full h-11 border border-slate-200 rounded-xl px-4 text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-600"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">CVV Code</label>
                          <input
                            placeholder="123"
                            maxLength={3}
                            type="password"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                            className="w-full h-11 border border-slate-200 rounded-xl px-4 text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-600"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-3 pt-2">
                    <Button 
                      variant="ghost" 
                      onClick={() => setShowPaymentModal(false)}
                      className="flex-1 border-none hover:bg-slate-50 text-slate-500 font-bold"
                    >
                      Cancel Payment
                    </Button>
                    <Button 
                      onClick={handleSimulatePayment}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-md gap-1"
                    >
                      <ShieldCheck className="w-4.5 h-4.5" /> Simulate Success
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}

export default Cart
