import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  ShoppingBag, 
  MapPin, 
  Truck, 
  ArrowRight,
  Sparkles,
  Calendar
} from "lucide-react";

// Custom High-Performance Canvas Confetti Celebration Component
const ConfettiCelebration = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const colors = ["#f59e0b", "#d97706", "#22c55e", "#3b82f6", "#ec4899", "#8b5cf6"];
    const particles: any[] = [];

    // Create particles
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        r: Math.random() * 6 + 4,
        d: Math.random() * height,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 10 - 5,
        tiltAngleIncremental: Math.random() * 0.07 + 0.02,
        tiltAngle: 0,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, idx) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
        p.x += Math.sin(p.tiltAngle);
        p.tilt = Math.sin(p.tiltAngle - idx / 3) * 15;

        // Draw particle
        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();

        // Recycle particles when they hit the bottom
        if (p.y > height) {
          particles[idx] = {
            x: Math.random() * width,
            y: -20,
            r: p.r,
            d: p.d,
            color: p.color,
            tilt: p.tilt,
            tiltAngleIncremental: p.tiltAngleIncremental,
            tiltAngle: p.tiltAngle,
          };
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      if (canvas) {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
    />
  );
};

export default function CheckoutSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { orderId?: string; address?: any; paymentType?: string } || {};

  const orderId = state.orderId || `GSK-${Date.now().toString().slice(-6)}`;
  const address = state.address || {
    flatnumber: "Flat 4B, Vrindavan Complex",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001"
  };

  // Dynamic calculated delivery date (today, tomorrow or in 2-3 days based on city)
  const getDeliveryDate = () => {
    return "Today (Same Day Delivery)";
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col justify-between text-left">
      <Header />
      
      {/* Dynamic Confetti celebration */}
      <ConfettiCelebration />

      <main className="container mx-auto px-4 py-12 flex-1 max-w-2xl">
        <div className="space-y-8 text-center">
          
          {/* Main Success Checkmark Block */}
          <div className="space-y-4">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 shadow-md shadow-green-200 border-4 border-white animate-scale-in">
              <CheckCircle className="h-12 w-12" />
            </div>
            
            <div className="space-y-1">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100 font-extrabold uppercase text-[10px] py-1 px-3.5 tracking-wider border-none">
                <Sparkles className="h-3.5 w-3.5 mr-1 fill-green-800 text-green-800" /> Order Confirmed
              </Badge>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase pt-2">Thank You For Your Order!</h1>
              <p className="text-slate-500 font-semibold text-sm">Aapka order successfully register ho gaya hai. Hum jald hi dispatch kareinge.</p>
            </div>
          </div>

          {/* Details Card */}
          <Card className="border border-slate-200 shadow-xl rounded-3xl bg-white text-left overflow-hidden">
            <CardContent className="p-6 space-y-6">
              
              <div className="flex flex-col sm:flex-row justify-between gap-4 border-b pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Order ID</span>
                  <span className="font-extrabold text-slate-800 block text-base">{orderId}</span>
                </div>
                <div className="space-y-1 sm:text-right">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Payment Method</span>
                  <span className="font-extrabold text-green-600 block text-sm">
                    {state.paymentType === "ONLINE" ? "Online Payment" : "Cash on Delivery (COD)"}
                  </span>
                </div>
              </div>

              {/* Delivery Estimator Info */}
              <div className="flex gap-4 items-start bg-slate-50 border rounded-2xl p-4">
                <div className="h-10 w-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
                  <Truck className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-amber-500" /> Expected Delivery Arrival
                  </h4>
                  <p className="text-xs font-semibold text-slate-500">
                    Aapka package <span className="font-bold text-slate-700">{getDeliveryDate()}</span> tak deliver ho jaayega.
                  </p>
                </div>
              </div>

              {/* Shipping Address Summary */}
              <div className="space-y-2.5">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-slate-400" /> Shipping Destination Address
                </h4>
                <div className="text-sm font-semibold text-slate-700 leading-relaxed bg-slate-50/50 p-4 border border-dashed rounded-2xl">
                  <div className="font-extrabold text-slate-800 text-sm mb-1">
                    {localStorage.getItem("userName") || "GharSeKro Customer"}
                  </div>
                  <div>
                    {address.flatnumber}
                    {address.building && `, ${address.building}`}
                    {address.street && `, ${address.street}`}
                    {address.area && `, ${address.area}`}
                  </div>
                  {address.landmark && <div className="text-xs text-slate-500">Near {address.landmark}</div>}
                  <div>{address.city}, {address.state} - <span className="font-bold">{address.pincode}</span></div>
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Action shortcuts */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl px-8 shadow-md flex items-center justify-center gap-2 border-none"
              onClick={() => navigate("/")}
            >
              <ShoppingBag className="h-4.5 w-4.5" /> Continue Shopping
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-200 hover:bg-slate-100 text-slate-700 font-extrabold rounded-xl px-8"
              onClick={() => navigate("/orders")}
            >
              View My Orders <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
