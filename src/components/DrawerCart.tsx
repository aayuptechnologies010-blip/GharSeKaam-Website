import { useNavigate } from "react-router-dom";
import { X, Minus, Plus, Trash2, ShoppingBag, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartContext } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

interface DrawerCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DrawerCart({ isOpen, onClose }: DrawerCartProps) {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice } = useCartContext();

  const handleQuantityChange = (productId: string, newQuantity: number, variant?: { size: string }) => {
    if (newQuantity < 1) {
      removeFromCart(productId, variant);
    } else {
      updateQuantity(productId, newQuantity, variant);
    }
  };

  const handleCheckout = () => {
    onClose();
    navigate("/cart");
  };

  // Pricing calculations
  const subtotal = getTotalPrice();
  const savings = Math.round(subtotal * 0.18);
  const netTotal = subtotal;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-xs select-none"
          />

          {/* Drawer Cart Container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 35 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] bg-white shadow-2xl z-50 flex flex-col font-sans text-left border-l border-slate-200 select-none"
          >
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 bg-amber-500 rounded-xl flex items-center justify-center text-slate-950 font-black shadow-sm">
                  <ShoppingBag className="h-4.5 w-4.5" />
                </div>
                <h2 className="font-extrabold text-slate-800 text-base uppercase tracking-tight">
                  My Cart ({cartItems.length})
                </h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 hover:bg-slate-200 rounded-full"
              >
                <X className="h-5 w-5 text-slate-600" />
              </Button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-20 space-y-4">
                  <div className="h-20 w-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-500 shadow-sm">
                    <ShoppingBag className="h-10 w-10" />
                  </div>
                  <h3 className="font-extrabold text-slate-800">Your Cart is Empty</h3>
                  <p className="text-xs text-slate-400 max-w-[240px] mx-auto leading-normal">
                    Add products from our catalog to get started with your construction purchase.
                  </p>
                  <Button onClick={onClose} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded-xl text-xs py-2 px-5">
                    Start Shopping
                  </Button>
                </div>
              ) : (
                cartItems.map((item, idx) => {
                  const uniqueKey = item.variant 
                    ? `${item.id}-${item.variant.size}` 
                    : item.id;
                  return (
                    <div 
                      key={uniqueKey}
                      className="flex gap-3 p-3 bg-white border border-slate-150 rounded-2xl hover:border-amber-500 transition-colors shadow-xs relative group"
                    >
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain mix-blend-multiply"
                        />
                      </div>

                      {/* Info & Quantity controls */}
                      <div className="flex-1 space-y-1.5 text-left">
                        <h4 className="font-bold text-xs text-slate-800 line-clamp-1 leading-snug">
                          {item.name}
                        </h4>
                        {item.variant && (
                          <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded">
                            Size: {item.variant.size}
                          </span>
                        )}

                        <div className="flex justify-between items-center pt-0.5">
                          <div className="flex items-center border rounded-lg overflow-hidden bg-slate-50">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.variant)}
                              className="h-6 w-6 hover:bg-slate-100 flex items-center justify-center border-none bg-transparent cursor-pointer"
                            >
                              <Minus className="h-2.5 w-2.5" />
                            </button>
                            <span className="px-2 text-[11px] font-black text-slate-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.variant)}
                              className="h-6 w-6 hover:bg-slate-100 flex items-center justify-center border-none bg-transparent cursor-pointer"
                            >
                              <Plus className="h-2.5 w-2.5" />
                            </button>
                          </div>
                          
                          <span className="font-black text-sm text-slate-900">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id, item.variant)}
                        className="absolute -top-1.5 -right-1.5 bg-red-100 text-red-600 hover:bg-red-200 h-6 w-6 rounded-full flex items-center justify-center border border-red-200 cursor-pointer shadow opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {cartItems.length > 0 && (
              <div className="p-4 border-t bg-slate-50 space-y-4">
                <div className="space-y-2.5 text-xs font-semibold">
                  <div className="flex justify-between text-slate-500">
                    <span>Cart Subtotal</span>
                    <span className="font-bold text-slate-700">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Discount Savings</span>
                    <span className="text-green-600 font-extrabold">- ₹{savings.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm font-black text-slate-800">
                    <span>Net Payable</span>
                    <span>₹{netTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Savings Banner */}
                <div className="bg-green-50 border border-green-200 text-green-700 text-[11px] font-bold rounded-xl p-2.5 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 shrink-0 text-green-600 animate-pulse" />
                  <span>You are saving ₹{savings.toLocaleString()} on this order! 🎉</span>
                </div>

                <Button
                  onClick={handleCheckout}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-5 rounded-xl shadow-md flex items-center justify-center gap-1.5 text-sm"
                >
                  Proceed to Checkout <ArrowRight className="h-4.5 w-4.5" />
                </Button>
              </div>
            )}

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
