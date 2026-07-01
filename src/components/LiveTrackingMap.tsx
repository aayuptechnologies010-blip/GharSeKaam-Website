import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Bike, Phone, MapPin, Store, Compass, Shield, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface LiveTrackingMapProps {
  orderId: string
  riderName?: string
  riderPhone?: string
  riderImage?: string
  shopName?: string
  destinationCity?: string
}

const LiveTrackingMap = ({
  orderId,
  riderName = "Aman Singh",
  riderPhone = "8957035082",
  riderImage = "",
  shopName = "Aman Traders",
  destinationCity = "Gorakhpur"
}: LiveTrackingMapProps) => {
  const displayRiderName = riderName || "Aman Singh"
  const displayRiderPhone = (
    riderPhone &&
    riderPhone !== "null" &&
    riderPhone !== "undefined" &&
    riderPhone.trim() !== ""
  ) ? riderPhone.trim() : "8957035082"
  const displayShopName = (
    shopName &&
    shopName !== "abc" &&
    shopName.trim() !== ""
  ) ? shopName : "Aman Traders"

  const [progress, setProgress] = useState(0.1)
  const [estimatedMinutes, setEstimatedMinutes] = useState(15)

  // Simulate progress of rider along path
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 1) {
          setEstimatedMinutes(15)
          return 0.05 // loop the animation for live effect
        }
        const nextProgress = prev + 0.02
        // Update estimated minutes based on remaining path
        const nextMins = Math.max(1, Math.round(15 * (1 - nextProgress)))
        setEstimatedMinutes(nextMins)
        return nextProgress
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Gorakhpur-themed stylized route SVG coordinates
  // Start point (Store): 80, 260
  // End point (Home): 420, 80
  const startX = 80
  const startY = 260
  const endX = 420
  const endY = 80

  // Stylized S-curve path
  const pathD = `M ${startX} ${startY} C 160 ${startY - 20}, 200 ${startY - 140}, 280 ${startY - 100} S 360 ${endY + 20}, ${endX} ${endY}`

  // Calculate current rider position based on progress along the curve (linear approximation for visual display)
  // Bézier curve calculation: B(t) = (1-t)³P₀ + 3(1-t)²tP₁ + 3(1-t)t²P₂ + t³P₃
  const getCoordinatesAtProgress = (t: number) => {
    // P0: 80,260 | P1: 160,240 | P2: 200,120 | P3: 280,160
    // S-curve handles:
    // H1: P3: 280,160 | H2: 360,100 | H3: 420,80
    // Simple split-bezier or interpolation for smooth visual rendering
    const x = startX + (endX - startX) * t
    const y = startY + (endY - startY) * t - Math.sin(t * Math.PI) * 60
    return { x, y }
  }

  const riderPos = getCoordinatesAtProgress(progress)

  return (
    <Card className="overflow-hidden border border-slate-200 shadow-xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl">
      <div className="p-4 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          <span className="text-xs font-black uppercase tracking-wider text-slate-300">Live Rider Tracking</span>
        </div>
        <div className="text-[11px] text-amber-400 font-extrabold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
          Gorakhpur Express Delivery
        </div>
      </div>

      <div className="relative h-64 bg-slate-900 overflow-hidden flex items-center justify-center">
        {/* Background Stylized Map Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            {/* Grid street mock shapes */}
            <rect x="30" y="40" width="80" height="60" rx="4" fill="white" />
            <rect x="150" y="30" width="100" height="40" rx="4" fill="white" />
            <rect x="290" y="50" width="90" height="70" rx="4" fill="white" />
            <rect x="60" y="140" width="120" height="50" rx="4" fill="white" />
            <rect x="210" y="150" width="70" height="80" rx="4" fill="white" />
          </svg>
        </div>

        {/* Visual Route Representation SVG */}
        <svg className="absolute inset-0 w-full h-full p-6" viewBox="0 0 500 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Main Delivery Route Line (Dashed Track) */}
          <path
            d={pathD}
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Highlight completed path */}
          <path
            d={pathD}
            stroke="#f59e0b" // Amber accent
            strokeWidth="4"
            strokeDasharray="500"
            strokeDashoffset={500 * (1 - progress)}
            strokeLinecap="round"
            className="transition-all duration-300"
          />

          {/* Store / Vendor Point */}
          <g transform={`translate(${startX}, ${startY})`}>
            <circle r="16" fill="rgba(245, 158, 11, 0.2)" className="animate-pulse" />
            <circle r="8" fill="#f59e0b" />
            <foreignObject x="-10" y="-10" width="20" height="20">
              <div className="text-slate-950 flex items-center justify-center h-full">
                <Store className="h-3.5 w-3.5 text-white" />
              </div>
            </foreignObject>
            <text x="22" y="4" fill="rgba(255,255,255,0.7)" className="text-[10px] font-bold">Store</text>
          </g>

          {/* Customer Destination Point */}
          <g transform={`translate(${endX}, ${endY})`}>
            <circle r="20" fill="rgba(34, 197, 94, 0.2)" className="animate-pulse" />
            <circle r="8" fill="#22c55e" />
            <foreignObject x="-10" y="-10" width="20" height="20">
              <div className="text-slate-950 flex items-center justify-center h-full">
                <MapPin className="h-3.5 w-3.5 text-white" />
              </div>
            </foreignObject>
            <text x="-50" y="4" fill="rgba(255,255,255,0.7)" className="text-[10px] font-bold">Home</text>
          </g>

          {/* Moving Rider Icon */}
          <g transform={`translate(${riderPos.x}, ${riderPos.y})`}>
            <circle r="18" fill="#f59e0b" className="shadow-lg" />
            <foreignObject x="-11" y="-11" width="22" height="22">
              <div className="text-slate-950 flex items-center justify-center h-full">
                <Bike className="h-4 w-4 text-slate-950 stroke-[2.5]" />
              </div>
            </foreignObject>
          </g>
        </svg>

        {/* Live compass overlay */}
        <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] font-bold text-slate-400 border border-slate-800 flex items-center gap-1.5 shadow">
          <Compass className="h-3.5 w-3.5 text-amber-500 animate-spin-slow" />
          <span>Tracking via GPS...</span>
        </div>

        {/* ETA Bubble */}
        <div className="absolute top-3 right-3 bg-amber-500 text-slate-950 px-3 py-1.5 rounded-2xl text-xs font-black shadow-lg flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          <span>ETA: {estimatedMinutes} Mins</span>
        </div>
      </div>

      <CardContent className="p-6 bg-slate-950 border-t border-slate-800/80 space-y-4">
        {/* Rider Details */}
        <div className="flex items-center gap-4 bg-slate-900/50 p-3 rounded-2xl border border-slate-800/60">
          <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center font-black text-slate-950 uppercase border-2 border-slate-700 shadow-md overflow-hidden">
            {riderImage ? (
              <img src={riderImage} alt={displayRiderName} className="w-full h-full object-cover" />
            ) : (
              displayRiderName.split(" ").map(n => n[0]).join("")
            )}
          </div>
          <div className="flex-1 text-left">
            <h4 className="font-extrabold text-sm tracking-wide text-slate-200">{displayRiderName}</h4>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <Shield className="h-3.5 w-3.5 text-green-500 fill-green-500/25" />
              <span>GharSeKro Verified Rider</span>
            </p>
          </div>
          <a
            href={`tel:${displayRiderPhone}`}
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `tel:${displayRiderPhone}`;
            }}
            className="flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl h-10 w-10 shadow-md transition-all cursor-pointer relative z-50"
            title={`Call Rider: ${displayRiderPhone}`}
          >
            <Phone className="h-4.5 w-4.5 stroke-[2.5] pointer-events-none" />
          </a>
        </div>

        {/* Order delivery meta info */}
        <div className="grid grid-cols-2 gap-3 text-left">
          <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800/40 space-y-1">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Pickup From</p>
            <p className="text-xs font-extrabold text-slate-300 truncate">{displayShopName}</p>
          </div>
          <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800/40 space-y-1">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Deliver To</p>
            <p className="text-xs font-extrabold text-slate-300 truncate">{destinationCity}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default LiveTrackingMap
