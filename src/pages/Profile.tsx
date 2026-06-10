import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getOrders, getAllAddresses, addAddress, ApiOrder, Address } from "@/lib/api";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  HardHat,
  ShieldCheck,
  Edit2,
  Check,
  LogOut,
  Camera,
  Calendar,
  IndianRupee,
  ShoppingBag,
  Info,
  Clock,
  Sparkles,
  Lock,
  Users,
} from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"info" | "orders" | "labour" | "settings">("info");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // User details state
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    profile: "",
    phone: "",
    userType: "RETAILER",
  });

  // Address details state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [newAddress, setNewAddress] = useState({
    flatnumber: "",
    city: "Gorakhpur",
    state: "Uttar Pradesh",
    pincode: "",
    phone: "",
  });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);

  // Orders and Labour bookings states
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [labourBookings, setLabourBookings] = useState<any[]>([]);

  // Load user data on mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast({
        title: "Access Denied",
        description: "Please login to view your profile",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    // Read from localStorage
    setUserInfo({
      name: localStorage.getItem("userName") || "GharSeKro User",
      email: localStorage.getItem("userEmail") || "user@gharsekro.com",
      profile: localStorage.getItem("userProfile") || "",
      phone: localStorage.getItem("userPhone") || "+91 98765 43210",
      userType: localStorage.getItem("userType") || "RETAILER",
    });

    // Fetch addresses
    const fetchAddresses = async () => {
      try {
        const addrList = await getAllAddresses();
        setAddresses(addrList);
      } catch (err) {
        console.error("Failed to load addresses", err);
      }
    };

    // Fetch orders
    const fetchOrders = async () => {
      try {
        setOrdersLoading(true);
        const orderList = await getOrders();
        setOrders(orderList);
      } catch (err) {
        console.error("Failed to load orders", err);
      } finally {
        setOrdersLoading(false);
      }
    };

    // Fetch labour bookings from backend
    const fetchLabourBookings = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const phone = localStorage.getItem("userPhone");
        if (!phone) return;
        const { url: apiUrl } = await import("@/constant");
        const res = await fetch(`${apiUrl}/labour/mybookings?phone=${encodeURIComponent(phone)}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.bookings)) {
          setLabourBookings(
            data.bookings.map((b: any) => ({
              id: b.id,
              categoryName: b.labourService?.title || "Labour",
              qty: b.quantity,
              days: b.days,
              total: b.totalCost,
              date: b.date,
              status: b.status,
              color: "from-amber-500 to-orange-600",
            }))
          );
        }
      } catch {
        // leave empty — no dummy data
      }
    };

    fetchAddresses();
    fetchOrders();
    fetchLabourBookings();
  }, [navigate, toast]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userProfile");
    localStorage.removeItem("userType");
    localStorage.removeItem("userPhone");
    
    // Dispatch auth change event
    window.dispatchEvent(new Event("auth-change"));
    
    toast({
      title: "Logged Out",
      description: "Successfully logged out from your account",
    });
    navigate("/");
  };

  // Save info edits
  const handleSaveInfo = () => {
    setIsEditing(false); // Close edit mode immediately so user can't type further
    setIsSaving(true);
    setTimeout(() => {
      localStorage.setItem("userName", userInfo.name);
      localStorage.setItem("userPhone", userInfo.phone);
      localStorage.setItem("userProfile", userInfo.profile);
      
      // Dispatch event to update layout header
      window.dispatchEvent(new Event("auth-change"));

      setIsSaving(false);
      toast({
        title: "Profile Updated",
        description: "Your personal details have been saved successfully.",
      });
    }, 800);
  };

  // Handle Profile Pic File selection & convert to base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Image size should be less than 2MB",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setUserInfo((prev) => ({ ...prev, profile: reader.result as string }));
        toast({
          title: "Photo Selected",
          description: "Click 'Save Changes' to save your new profile picture.",
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Add new address
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.flatnumber || !newAddress.pincode || !newAddress.phone) {
      toast({
        title: "Required Fields",
        description: "Please fill out all address details",
        variant: "destructive",
      });
      return;
    }

    if (!newAddress.city || !newAddress.state || newAddress.state.toLowerCase() !== 'uttar pradesh' || newAddress.city.toLowerCase() !== 'gorakhpur') {
      toast({
        title: "Service Not Available",
        description: "Sorry, currently we are not working in your city. We only support orders in Gorakhpur.",
        variant: "destructive",
      });
      return;
    }

    setAddressLoading(true);
    try {
      const result = await addAddress({
        city: newAddress.city,
        state: newAddress.state,
        pincode: newAddress.pincode,
        flatnumber: parseInt(newAddress.flatnumber, 10),
        phone: newAddress.phone,
      });

      if (!result.success) {
        toast({
          title: "Failed to add address",
          description: result.message || "Something went wrong",
          variant: "destructive",
        });
        return;
      }

      // Reload addresses
      const addrList = await getAllAddresses();
      setAddresses(addrList);
      
      setNewAddress({
        flatnumber: "",
        city: "Gorakhpur",
        state: "Uttar Pradesh",
        pincode: "",
        phone: "",
      });
      setShowAddressForm(false);
      toast({
        title: "Address Added",
        description: "New delivery address has been saved successfully.",
      });
    } catch (err: any) {
      toast({
        title: "Failed to add address",
        description: err.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setAddressLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col justify-between">
      <div>
        <Header />

        {/* ── PROFILE HEADER BANNER ── */}
        <section className="relative bg-gradient-to-r from-[#1e3a5f] to-[#1a4f82] py-20 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-amber-500/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-blue-400/10 blur-3xl" />

          <div className="container mx-auto px-6 md:px-12 relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-8">
              
              {/* User Avatar */}
              <div className="relative group">
                <input
                  type="file"
                  id="profile-upload"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                  disabled={!isEditing}
                />
                <div
                  onClick={() => isEditing && document.getElementById("profile-upload")?.click()}
                  className={`w-28 h-28 rounded-full border-4 border-white/20 bg-slate-700 flex items-center justify-center text-4xl font-black text-white shadow-xl overflow-hidden relative ${
                    isEditing ? "cursor-pointer group-hover:border-amber-400/80 transition-all duration-300" : ""
                  }`}
                >
                  {userInfo.profile ? (
                    <img src={userInfo.profile} alt={userInfo.name} className="w-full h-full object-cover" />
                  ) : (
                    (userInfo.name || "User").split(" ").filter(Boolean).map(w => w[0]).join("").toUpperCase().slice(0, 2)
                  )}

                  {/* Edit Mode Hover Overlay */}
                  {isEditing && (
                    <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Camera className="w-5 h-5 mb-1 text-amber-400" />
                      CHANGE PHOTO
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div
                    onClick={() => document.getElementById("profile-upload")?.click()}
                    className="absolute bottom-0 right-0 bg-amber-500 p-2 rounded-full border-2 border-slate-900 cursor-pointer shadow-md hover:bg-amber-600 transition-colors"
                  >
                    <Camera className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              {/* User Meta */}
              <div className="text-center md:text-left space-y-2.5">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{userInfo.name}</h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified {userInfo.userType === "WHOLESALER" ? "Wholesaler" : "Retailer"}
                  </span>
                </div>
                <p className="text-blue-200 text-sm flex items-center justify-center md:justify-start gap-1.5">
                  <Mail className="w-4 h-4" /> {userInfo.email}
                </p>
                <p className="text-blue-200 text-sm flex items-center justify-center md:justify-start gap-1.5">
                  <Phone className="w-4 h-4" /> {userInfo.phone}
                </p>
              </div>

              {/* Action Logout */}
              <div className="md:ml-auto flex gap-4">
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="!border-white/20 !text-white hover:!bg-white/10 hover:!text-white font-bold !bg-transparent gap-2 py-5 px-6 rounded-xl"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>

            </div>
          </div>
        </section>

        {/* ── PROFILE CONTENT CONTAINER ── */}
        <section className="py-12">
          <div className="container mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Premium Animated Sidebar Navigation */}
              <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-1.5">
                {[
                  { id: "info", label: "My Profile", icon: User },
                  { id: "orders", label: "Material Orders", icon: Package },
                  { id: "labour", label: "Hired Labour", icon: HardHat },
                  { id: "settings", label: "Security & Settings", icon: Lock },
                ].map(({ id, label, icon: Icon }) => {
                  const isActive = activeTab === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id as any)}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 relative ${
                        isActive ? "text-amber-600 bg-amber-50" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="active-bar"
                          className="absolute left-0 top-3 bottom-3 w-1 bg-amber-500 rounded-full"
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        />
                      )}
                      <Icon className={`w-4 h-4 ${isActive ? "text-amber-500" : "text-slate-400"}`} />
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* Right Column: Tab Contents */}
              <div className="lg:col-span-9">
                <AnimatePresence mode="wait">
                  
                  {/* TAB 1: PERSONAL INFORMATION */}
                  {activeTab === "info" && (
                    <motion.div
                      key="info"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-6"
                    >
                      {/* Profile Card */}
                      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <User className="w-5 h-5 text-amber-500" /> Account Information
                          </h3>
                          <Button
                            variant={isEditing ? "outline" : "default"}
                            onClick={() => {
                              if (isEditing) handleSaveInfo();
                              else setIsEditing(true);
                            }}
                            className={isEditing ? "border-slate-200 text-slate-700" : "bg-amber-500 hover:bg-amber-600 text-white font-bold"}
                            disabled={isSaving}
                          >
                            {isSaving ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                                className="w-4 h-4 border-2 border-slate-700 border-t-transparent rounded-full"
                              />
                            ) : isEditing ? (
                              <>
                                <Check className="w-4 h-4 mr-1.5" /> Save Changes
                              </>
                            ) : (
                              <>
                                <Edit2 className="w-4 h-4 mr-1.5" /> Edit Profile
                              </>
                            )}
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          
                          <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</Label>
                            <Input
                              disabled={!isEditing}
                              value={userInfo.name}
                              onChange={e => setUserInfo(u => ({ ...u, name: e.target.value }))}
                              className="border-slate-200 disabled:bg-slate-50 disabled:text-slate-600 disabled:cursor-not-allowed font-medium focus:border-amber-400 focus:ring-amber-400"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</Label>
                            <Input
                              disabled
                              value={userInfo.email}
                              className="border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed font-medium"
                            />
                            <p className="text-[10px] text-slate-400">Google accounts emails cannot be edited.</p>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mobile Number</Label>
                            <Input
                              disabled={!isEditing}
                              value={userInfo.phone}
                              onChange={e => setUserInfo(u => ({ ...u, phone: e.target.value }))}
                              className="border-slate-200 disabled:bg-slate-50 disabled:text-slate-600 disabled:cursor-not-allowed font-medium focus:border-amber-400 focus:ring-amber-400"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Membership Category</Label>
                            <Input
                              disabled
                              value={userInfo.userType}
                              className="border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed font-medium"
                            />
                          </div>

                        </div>
                      </div>

                      {/* Address Book Card */}
                      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-amber-500" /> Saved Delivery Addresses
                          </h3>
                          <Button
                            onClick={() => setShowAddressForm(!showAddressForm)}
                            className="bg-slate-900 hover:bg-slate-800 text-white font-bold"
                          >
                            {showAddressForm ? "Cancel" : "Add Address"}
                          </Button>
                        </div>

                        {/* Add address subform */}
                        <AnimatePresence>
                          {showAddressForm && (
                            <motion.form
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              onSubmit={handleAddAddress}
                              className="border border-amber-200 bg-amber-50/30 rounded-xl p-5 mb-6 space-y-4 overflow-hidden"
                            >
                              <h4 className="font-bold text-slate-800 text-sm">Create New Address</h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                  <Label className="text-xs font-bold text-slate-600">Flat / House No. *</Label>
                                  <Input
                                    required
                                    placeholder="Eg: 27B"
                                    value={newAddress.flatnumber}
                                    onChange={e => setNewAddress(a => ({ ...a, flatnumber: e.target.value }))}
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs font-bold text-slate-600">Pincode *</Label>
                                  <Input
                                    required
                                    maxLength={6}
                                    placeholder="Eg: 273015"
                                    value={newAddress.pincode}
                                    onChange={e => setNewAddress(a => ({ ...a, pincode: e.target.value.replace(/\D/g, "") }))}
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs font-bold text-slate-600">Contact Number *</Label>
                                  <Input
                                    required
                                    placeholder="Eg: 9876543210"
                                    value={newAddress.phone}
                                    onChange={e => setNewAddress(a => ({ ...a, phone: e.target.value }))}
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                  <Label className="text-xs font-bold text-slate-600">City</Label>
                                  <Input disabled value={newAddress.city} className="bg-slate-100" />
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs font-bold text-slate-600">State</Label>
                                  <Input disabled value={newAddress.state} className="bg-slate-100" />
                                </div>
                              </div>

                              <Button
                                type="submit"
                                disabled={addressLoading}
                                className="bg-amber-500 hover:bg-amber-600 text-white font-bold w-full md:w-auto"
                              >
                                {addressLoading ? "Saving..." : "Save Address"}
                              </Button>
                            </motion.form>
                          )}
                        </AnimatePresence>

                        {/* List of saved addresses */}
                        {addresses.length === 0 ? (
                          <div className="text-center py-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl space-y-2">
                            <MapPin className="w-8 h-8 text-slate-300 mx-auto" />
                            <p className="text-slate-500 font-bold text-sm">No saved addresses found</p>
                            <p className="text-slate-400 text-xs">Add an address to checkout quickly on orders.</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {addresses.map((addr) => (
                              <div key={addr.id} className="border border-slate-200 p-4 rounded-xl space-y-2 shadow-sm hover:border-amber-400 transition-colors">
                                <span className="inline-block bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                                  Home Address
                                </span>
                                <p className="text-sm text-slate-800 font-semibold leading-relaxed">
                                  Flat {addr.flatnumber}, {addr.city}, {addr.state} - {addr.pincode}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 2: MATERIAL ORDERS */}
                  {activeTab === "orders" && (
                    <motion.div
                      key="orders"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-6"
                    >
                      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
                        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6">
                          <ShoppingBag className="w-5 h-5 text-amber-500" /> Material Purchase History
                        </h3>

                        {ordersLoading ? (
                          <div className="space-y-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                              <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse" />
                            ))}
                          </div>
                        ) : orders.length === 0 ? (
                          <div className="text-center py-12 space-y-3">
                            <Package className="w-12 h-12 text-slate-300 mx-auto animate-bounce" />
                            <p className="text-slate-500 font-bold text-base">No orders found yet</p>
                            <p className="text-slate-400 text-sm max-w-sm mx-auto">You haven't ordered any building materials or tools yet. Find premium construction items on our wholesale catalog!</p>
                            <Button onClick={() => navigate("/")} className="bg-amber-500 hover:bg-amber-600 text-white font-bold mt-2">
                              Browse Store Catalog
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {orders.map((order) => (
                              <div key={order.id} className="border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                                
                                {/* Header order card */}
                                <div className="bg-slate-50/50 p-4 border-b border-slate-200 flex flex-wrap justify-between items-center gap-2 text-sm text-slate-500">
                                  <div>
                                    Order ID: <span className="font-bold text-slate-800">#GSK-{order.id.slice(-6)}</span>
                                  </div>
                                  <div>
                                    Placed: <span className="font-bold text-slate-800">{new Date(order.createdAt).toLocaleDateString()}</span>
                                  </div>
                                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                    order.status === "PENDING"
                                      ? "bg-amber-100 text-amber-800"
                                      : order.status === "SHIPPED"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-green-100 text-green-800"
                                  }`}>
                                    {order.status}
                                  </span>
                                </div>

                                {/* Items list inside order */}
                                <div className="p-4 space-y-3">
                                  {order.orderItems.map((item) => (
                                    <div key={item.id} className="flex gap-4 items-center justify-between">
                                      <div className="flex gap-3 items-center">
                                        <div className="w-12 h-12 rounded-lg border bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                                          {item.item.images[0] ? (
                                            <img src={item.item.images[0]} alt={item.item.title} className="w-full h-full object-cover" />
                                          ) : (
                                            <Package className="w-5 h-5 text-slate-400" />
                                          )}
                                        </div>
                                        <div>
                                          <h4 className="font-bold text-slate-800 text-sm">{item.item.title}</h4>
                                          <p className="text-xs text-slate-500">
                                            Qty: {item.quantity} {item.variant ? `• Size: ${item.variant.size}` : ""}
                                          </p>
                                        </div>
                                      </div>
                                      <span className="font-bold text-slate-700 text-sm">₹{Number(item.lineTotal).toLocaleString()}</span>
                                    </div>
                                  ))}
                                </div>

                                {/* Summary bottom order card */}
                                <div className="p-4 border-t border-slate-200 bg-slate-50/20 flex justify-between items-center text-sm font-semibold text-slate-700">
                                  <span>Payment: {order.paymentType}</span>
                                  <div>
                                    Total Price: <span className="text-lg font-black text-amber-600">₹{Number(order.totalPrice).toLocaleString()}</span>
                                  </div>
                                </div>

                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 3: HIRED LABOUR */}
                  {activeTab === "labour" && (
                    <motion.div
                      key="labour"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-6"
                    >
                      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
                        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6">
                          <HardHat className="w-5 h-5 text-amber-500" /> Hired Construction Workers
                        </h3>

                        {labourBookings.length === 0 ? (
                          <div className="text-center py-12 space-y-3">
                            <HardHat className="w-12 h-12 text-slate-300 mx-auto animate-bounce" />
                            <p className="text-slate-500 font-bold text-base">No active worker bookings found</p>
                            <p className="text-slate-400 text-sm max-w-sm mx-auto">Hire Rajmistry, electricians, plumbers, or loaders directly at flat daily rates.</p>
                            <Button onClick={() => navigate("/labour")} className="bg-amber-500 hover:bg-amber-600 text-white font-bold mt-2">
                              Book Workers
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {labourBookings.map((booking) => (
                              <div key={booking.id} className="border border-slate-200 p-5 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-amber-400 transition-colors shadow-sm">
                                
                                <div className="flex items-center gap-4">
                                  <div className={`w-12 h-12 bg-gradient-to-br ${booking.color} rounded-xl flex items-center justify-center text-white shrink-0 shadow`}>
                                    <HardHat className="w-6 h-6" />
                                  </div>
                                  <div>
                                    <h4 className="font-extrabold text-slate-800 text-sm">{booking.categoryName}</h4>
                                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                      <Users className="w-3.5 h-3.5" /> {booking.qty} Worker{booking.qty > 1 ? "s" : ""} •
                                      <Calendar className="w-3.5 h-3.5 ml-1" /> {booking.days} Day{booking.days > 1 ? "s" : ""}
                                    </p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">Start Date: {booking.date}</p>
                                  </div>
                                </div>

                                <div className="w-full md:w-auto flex md:flex-col justify-between items-end gap-2 text-right">
                                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                    booking.status === "Confirmed" ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"
                                  }`}>
                                    {booking.status}
                                  </span>
                                  <div className="font-black text-slate-800 text-base">
                                    ₹{booking.total.toLocaleString()}
                                  </div>
                                </div>

                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 4: SECURITY & SETTINGS */}
                  {activeTab === "settings" && (
                    <motion.div
                      key="settings"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-6"
                    >
                      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
                        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6">
                          <Lock className="w-5 h-5 text-amber-500" /> Account Security & Settings
                        </h3>

                        <div className="space-y-6">
                          
                          <div className="border border-amber-200 bg-amber-50/20 p-5 rounded-xl flex items-start gap-3">
                            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-bold text-slate-800 text-sm">Google Linked Account</h4>
                              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                Your account is linked and secured with Google Authentication. Password changes are managed directly within your Google Account settings.
                              </p>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h4 className="font-bold text-slate-800 text-sm">Preferences</h4>
                            <div className="flex items-center justify-between border-b pb-4">
                              <div>
                                <h5 className="text-sm font-semibold text-slate-700">Notification Alerts</h5>
                                <p className="text-xs text-slate-400 mt-0.5">Receive order tracking SMS updates on phone</p>
                              </div>
                              <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-bold">Enabled</span>
                            </div>

                            <div className="flex items-center justify-between border-b pb-4">
                              <div>
                                <h5 className="text-sm font-semibold text-slate-700">App Language Preference</h5>
                                <p className="text-xs text-slate-400 mt-0.5">Preferred default interface language</p>
                              </div>
                              <span className="text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-full font-bold">
                                {localStorage.getItem("appLanguage") === "hi" ? "Hindi (हिंदी)" : "English"}
                              </span>
                            </div>
                          </div>

                        </div>
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
