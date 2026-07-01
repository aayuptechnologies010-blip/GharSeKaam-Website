import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Package, Calendar, MapPin, Store, CreditCard } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { getOrders, ApiOrder, cancelOrder } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import LiveTrackingMap from "@/components/LiveTrackingMap"

const Orders = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [orders, setOrders] = useState<ApiOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      const authToken = localStorage.getItem('authToken')
      if (!authToken) {
        navigate('/login')
        return
      }

      try {
        setLoading(true)
        const fetchedOrders = await getOrders()
        setOrders(fetchedOrders)
        setError(null)
      } catch (err: any) {
        console.error('Failed to fetch orders:', err)
        setError(err?.message || 'Failed to load orders')
        if (err?.message?.includes('Authentication')) {
          navigate('/login')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [navigate])

  // Establish WebSocket connection for real-time customer updates
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (!token) return

    let customerId = ''
    try {
      const payloadBase64 = token.split('.')[1]
      const payloadDecoded = JSON.parse(atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/')))
      customerId = payloadDecoded.customerid || ''
    } catch (e) {
      console.error("Failed to decode token for WS:", e)
    }

    if (!customerId) return

    const wsUrl = `ws://localhost:3000/?role=customer&id=${customerId}`
    console.log("[WS Connection] Connecting to:", wsUrl)

    let ws: WebSocket | null = null

    try {
      ws = new WebSocket(wsUrl)

      ws.onopen = () => {
        console.log("[WS Client] Connected to socket as customer", customerId)
      }

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data)
          console.log("[WS Client] Received message:", payload)
          if (payload.event === 'ORDER_STATUS_UPDATE' && payload.data) {
            const updatedOrder = payload.data
            // Show toast alert
            toast({
              title: `Order Update!`,
              description: `Order #${updatedOrder.id.slice(-8)} status changed to ${updatedOrder.status}.`,
            })
            // Update orders state
            setOrders((prevOrders) =>
              prevOrders.map((o) =>
                o.id === updatedOrder.id
                  ? { 
                      ...o, 
                      status: updatedOrder.status, 
                      deliveryGuy: updatedOrder.deliveryGuy !== undefined ? updatedOrder.deliveryGuy : o.deliveryGuy 
                    }
                  : o
              )
            )
          }
        } catch (err) {
          console.error("[WS Client] Error handling message:", err)
        }
      }

      ws.onerror = (err) => {
        console.error("[WS Client] Error:", err)
      }

      ws.onclose = () => {
        console.log("[WS Client] Disconnected from server")
      }
    } catch (err) {
      console.error("[WS Client] Connection error:", err)
    }

    return () => {
      if (ws) {
        ws.close()
      }
    }
  }, [toast])

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      case 'DELIVERY_PICKUP':
        return 'bg-amber-100 text-amber-800 animate-pulse border border-amber-300'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Loading Orders...</h1>
          </div>
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <Package className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-3xl font-bold mb-2">No Orders Yet</h1>
            <p className="text-muted-foreground mb-6">
              You haven't placed any orders yet. Start shopping to see your orders here.
            </p>
            <Button onClick={() => navigate('/')} size="lg">
              Start Shopping
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Orders</h1>
          <Badge variant="secondary">{orders.length} orders</Badge>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Order #{order.id.slice(-8)}</CardTitle>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(order.createdAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Store className="h-4 w-4" />
                        {order.shopkeeper.shopname === "abc" ? "Aman Traders" : order.shopkeeper.shopname}
                      </div>
                      <div className="flex items-center gap-1">
                        <CreditCard className="h-4 w-4" />
                        {order.paymentType}
                      </div>
                    </div>
                    {order.estimatedDelivery && (
                      <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/65 text-amber-800 text-xs font-black shadow-xs">
                        <span className="animate-pulse">🚀</span>
                        <span>Estimated Delivery:</span>
                        <span className="font-extrabold uppercase tracking-wide">{order.estimatedDelivery}</span>
                      </div>
                    )}
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                        <img
                          src={item.item.images[0] || 'https://images.unsplash.com/photo-1608613304899-ea8098577e38?auto=format&fit=crop&w=400&q=80'}
                          alt={item.item.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1608613304899-ea8098577e38?auto=format&fit=crop&w=400&q=80'
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.item.title}</h4>
                        {item.variant && (
                          <p className="text-xs text-gray-600">Size: {item.variant.size}</p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity} × ₹{parseFloat(item.unitPrice).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{parseFloat(item.lineTotal).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                {/* Live Rider Tracking map if in DELIVERY_PICKUP status */}
                {order.status.toUpperCase() === "DELIVERY_PICKUP" && (
                  <div className="mt-2 mb-6">
                    <LiveTrackingMap
                      orderId={order.id}
                      riderName={order.deliveryGuy?.name}
                      riderPhone={order.deliveryGuy?.phone}
                      riderImage={order.deliveryGuy?.profileimage}
                      shopName={order.shopkeeper.shopname}
                      destinationCity={order.deliveryAddress.city}
                    />
                  </div>
                )}

                {/* Delivery Address */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Delivery Address
                    </h4>
                    <div className="text-sm text-muted-foreground">
                      <p>
                        {order.deliveryAddress.flatnumber}
                        {order.deliveryAddress.building && `, ${order.deliveryAddress.building}`}
                        {order.deliveryAddress.street && `, ${order.deliveryAddress.street}`}
                        {order.deliveryAddress.area && `, ${order.deliveryAddress.area}`}
                      </p>
                      {order.deliveryAddress.landmark && <p>Landmark: {order.deliveryAddress.landmark}</p>}
                      <p>{order.deliveryAddress.city}, {order.deliveryAddress.state}</p>
                      <p>PIN: {order.deliveryAddress.pincode}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="space-y-1">
                      <div className="text-2xl font-bold">
                        ₹{parseFloat(order.totalPrice).toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total Amount
                      </div>
                    </div>
                  </div>
                </div>
                {['PENDING', 'PROCESSING', 'ACCEPTED', 'ASSIGNED'].includes(order.status.toUpperCase()) && (
                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={cancellingOrderId === order.id}
                      onClick={async () => {
                        if (!window.confirm('Are you sure you want to cancel this order?')) {
                          return
                        }

                        try {
                          setCancellingOrderId(order.id)
                          const result = await cancelOrder(order.id)
                          toast({ title: result.message || 'Order cancelled successfully' })
                          setOrders((prevOrders) =>
                            prevOrders.map((prevOrder) =>
                              prevOrder.id === order.id
                                ? { ...prevOrder, status: 'CANCELLED' }
                                : prevOrder
                            )
                          )
                        } catch (cancelError: any) {
                          toast({
                            title: 'Unable to cancel order',
                            description: cancelError?.message || 'Please try again later',
                            variant: 'destructive',
                          })
                        } finally {
                          setCancellingOrderId(null)
                        }
                      }}
                    >
                      {cancellingOrderId === order.id ? 'Cancelling...' : 'Cancel Order'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Orders
