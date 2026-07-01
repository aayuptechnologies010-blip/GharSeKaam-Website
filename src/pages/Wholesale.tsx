import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Building2, Sparkles, Home, Clock } from "lucide-react"

const Wholesale = () => {
  const navigate = useNavigate()
  const [showComingSoon, setShowComingSoon] = useState(true)

  return (
    <>
      {/* Background container with blur effect */}
      <div className="min-h-screen bg-slate-950 flex flex-col select-none pointer-events-none">
        <div className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-md bg-white/5 rounded-3xl p-8 border border-white/10 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl animate-pulse" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-white/10 rounded w-1/3 animate-pulse" />
                <div className="h-3 bg-white/10 rounded w-1/2 animate-pulse" />
              </div>
            </div>
            <div className="h-10 bg-white/10 rounded animate-pulse" />
            <div className="h-10 bg-white/10 rounded animate-pulse" />
            <div className="h-12 bg-white/10 rounded animate-pulse" />
          </div>
        </div>
      </div>

      <Dialog open={showComingSoon} onOpenChange={(open) => {
        if (!open) {
          navigate("/")
        }
      }}>
        <DialogContent className="sm:max-w-md border-slate-200 bg-white rounded-3xl p-8 shadow-2xl overflow-hidden gap-0">
          {/* Decorative premium color bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />
          
          <div className="flex flex-col items-center text-center space-y-6 pt-4">
            {/* Animated Logo Container */}
            <div className="relative">
              <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center border border-amber-100/80 shadow-inner animate-pulse">
                <Building2 className="h-10 w-10 text-amber-500" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center shadow-lg border border-slate-800">
                <Sparkles className="h-3 w-3 text-amber-400" />
              </div>
            </div>

            <div className="space-y-2">
              <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                Wholesale Program
              </DialogTitle>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-200/50">
                <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" /> Coming Soon
              </div>
            </div>

            <DialogDescription className="text-sm text-slate-500 font-medium leading-relaxed max-w-sm">
              We are building a premium wholesale (B2B) ecosystem for contractors, dealers, and builders. You'll soon be able to unlock bulk plant-direct prices, GST input credits, and custom logistics management.
            </DialogDescription>

            {/* Upcoming Features preview */}
            <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-100/80 text-left space-y-3">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Planned Features</h4>
              <div className="grid grid-cols-1 gap-2.5">
                {[
                  { title: "Direct Factory Rates", desc: "No middleman, buy directly at manufacturer cost." },
                  { title: "Tax Credit (GST Ready)", desc: "Receive automated 18% / 28% GST invoices." },
                  { title: "Custom Bulk Logistics", desc: "Heavy vehicles routing and onsite weight quotes." }
                ].map((feat, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start">
                    <span className="w-5 h-5 rounded-full bg-amber-500/10 border border-amber-200 flex items-center justify-center text-[10px] font-bold text-amber-600 shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <h5 className="text-xs font-black text-slate-800 tracking-wide">{feat.title}</h5>
                      <p className="text-[10.5px] text-slate-400 font-medium mt-0.5">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="w-full pt-2 flex flex-col gap-2.5">
              <Button
                onClick={() => navigate("/")}
                className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-xl shadow-lg shadow-slate-900/10 gap-2 text-sm transition-all"
              >
                <Home className="w-4 h-4 text-amber-400" />
                Back to Retail Store
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Wholesale
