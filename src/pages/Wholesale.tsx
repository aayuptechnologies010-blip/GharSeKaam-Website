import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Header from "@/components/Header"
import CategoryNav from "@/components/CategoryNav"
import ProductGrid from "@/components/ProductGrid"
import Footer from "@/components/Footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, ShieldCheck, ArrowRight, AlertCircle, Sparkles, BadgeCheck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/

const Wholesale = () => {
  const navigate = useNavigate()
  const { toast } = useToast()

  const [gstVerified, setGstVerified] = useState(false)
  const [gstInput, setGstInput] = useState("")
  const [shopNameInput, setShopNameInput] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Check if GST already verified in session
  useEffect(() => {
    const savedGst = sessionStorage.getItem("wholesaleGST")
    const savedShop = sessionStorage.getItem("wholesaleShopName") || localStorage.getItem("userShopName") || ""
    if (savedGst) {
      setGstVerified(true)
      setGstInput(savedGst)
      setShopNameInput(savedShop)
    }
  }, [])

  const handleVerifyGST = () => {
    setError("")
    const trimmedGst = gstInput.trim().toUpperCase()
    const trimmedShop = shopNameInput.trim()

    if (!trimmedShop) {
      setError("Shop name is required to access wholesale pricing.")
      return
    }
    if (!trimmedGst) {
      setError("GST number is required to access wholesale pricing.")
      return
    }
    if (!GST_REGEX.test(trimmedGst)) {
      setError("Invalid GST number format. Example: 27ABCDE1234F1Z5")
      return
    }

    setLoading(true)
    setTimeout(() => {
      sessionStorage.setItem("wholesaleGST", trimmedGst)
      sessionStorage.setItem("wholesaleShopName", trimmedShop)
      localStorage.setItem("userGST", trimmedGst)
      localStorage.setItem("userShopName", trimmedShop)
      localStorage.setItem("userType", "WHOLESALER")
      setGstVerified(true)
      setLoading(false)
      toast({
        title: "Wholesale Access Unlocked ✓",
        description: "Welcome to GharSeKro Wholesale. Exclusive B2B bulk rates unlocked!",
      })
    }, 800)
  }

  // GST Gate Screen
  if (!gstVerified) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-md">

            {/* Card */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Top accent */}
              <div className="h-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />

              <div className="p-8 space-y-6">
                {/* Header */}
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto border border-amber-100">
                    <Building2 className="h-8 w-8 text-amber-500" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Wholesale Access</h1>
                    <p className="text-sm text-slate-500 font-medium mt-1">
                      Enter your GST number to unlock exclusive bulk pricing
                    </p>
                  </div>
                </div>

                {/* Benefits */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Bulk Discounts", sub: "Up to 28% off" },
                    { label: "GST Invoice", sub: "18% input credit" },
                    { label: "Direct Rates", sub: "Plant pricing" },
                    { label: "Priority Dispatch", sub: "Same day ship" },
                  ].map((item) => (
                    <div key={item.label} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <BadgeCheck className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                        <span className="text-[11px] font-black text-slate-700 uppercase tracking-wide">{item.label}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-semibold pl-5">{item.sub}</p>
                    </div>
                  ))}
                </div>

                {/* Shop Name Input */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Shop Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="e.g. Aman Traders"
                    value={shopNameInput}
                    onChange={(e) => {
                      setShopNameInput(e.target.value)
                      setError("")
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleVerifyGST()}
                    className="h-12 text-sm font-bold border-slate-200 focus:border-amber-500 focus:ring-amber-500"
                  />
                </div>

                {/* GST Input */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    GST Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="e.g. 27ABCDE1234F1Z5"
                    value={gstInput}
                    onChange={(e) => {
                      setGstInput(e.target.value.toUpperCase())
                      setError("")
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleVerifyGST()}
                    className="h-12 text-sm font-bold tracking-widest border-slate-200 focus:border-amber-500 focus:ring-amber-500 uppercase"
                    maxLength={15}
                  />
                  {error && (
                    <div className="flex items-center gap-2 text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <p className="text-xs font-semibold">{error}</p>
                    </div>
                  )}
                  <p className="text-[10px] text-slate-400 font-medium">
                    15-digit GST Identification Number as per Government of India records
                  </p>
                </div>

                {/* Submit */}
                <Button
                  onClick={handleVerifyGST}
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-500/20 gap-2 text-sm"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      Verifying...
                    </span>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      Verify & Access Wholesale
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <button
                    onClick={() => navigate("/")}
                    className="text-xs text-slate-400 hover:text-slate-600 font-semibold transition-colors"
                  >
                    ← Back to Retail Store
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom note */}
            <p className="text-center text-xs text-slate-500 mt-4 font-medium">
              <Sparkles className="h-3 w-3 inline mr-1 text-amber-500" />
              Your GST data is encrypted and never shared
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Wholesale Products Page (after GST verified)
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CategoryNav />

      {/* Wholesale Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950/80 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <Badge className="bg-amber-500 text-slate-950 font-black mb-2 text-[10px] uppercase tracking-widest">
                <ShieldCheck className="h-3 w-3 mr-1" /> GST Verified Wholesale
              </Badge>
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Wholesale Products</h1>
              <p className="text-slate-300 text-sm font-semibold mt-1">
                Special bulk pricing for registered wholesale buyers
              </p>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-sm flex gap-6">
              <div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Shop Name</p>
                <p className="font-black text-white">{shopNameInput || "Registered Shop"}</p>
              </div>
              <div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Active GST</p>
                <p className="font-black text-amber-400 tracking-widest">{gstInput}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProductGrid wholesale={true} />
      <Footer />
    </div>
  )
}

export default Wholesale
