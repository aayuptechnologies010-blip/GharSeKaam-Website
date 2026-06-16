import { useNavigate } from "react-router-dom";
import { X, Trash2, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlistContext } from "@/context/WishlistContext";
import { useCartContext } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

interface DrawerWishlistProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DrawerWishlist({ isOpen, onClose }: DrawerWishlistProps) {
  const navigate = useNavigate();
  const { wishlistItems, toggleWishlist } = useWishlistContext();
  const { addToCart } = useCartContext();

  const handleProductClick = (productId: string) => {
    onClose();
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (item: any, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: item.id,
      name: item.title,
      price: item.price,
      image: item.image,
    });
  };

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

          {/* Drawer Wishlist Container */}
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
                <div className="h-9 w-9 bg-red-500 rounded-xl flex items-center justify-center text-white font-black shadow-sm animate-scale-in">
                  <Heart className="h-4.5 w-4.5 fill-white text-white" />
                </div>
                <h2 className="font-extrabold text-slate-800 text-base uppercase tracking-tight">
                  My Wishlist ({wishlistItems.length})
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

            {/* Wishlist Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {wishlistItems.length === 0 ? (
                <div className="text-center py-20 space-y-4">
                  <div className="h-20 w-20 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500 shadow-sm animate-pulse">
                    <Heart className="h-10 w-10 fill-red-500 text-red-500" />
                  </div>
                  <h3 className="font-extrabold text-slate-800">Your Wishlist is Empty</h3>
                  <p className="text-xs text-slate-400 max-w-[240px] mx-auto leading-normal">
                    Save products from our catalog to your favorites list and view them here.
                  </p>
                  <Button onClick={onClose} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded-xl text-xs py-2 px-5">
                    Start Browsing
                  </Button>
                </div>
              ) : (
                wishlistItems.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => handleProductClick(item.id)}
                    className="flex gap-3 p-3 bg-white border border-slate-150 rounded-2xl hover:border-amber-500 transition-colors shadow-xs relative group cursor-pointer"
                  >
                    {/* Product Image */}
                    <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-1.5 text-left pr-6">
                      <h4 className="font-bold text-xs text-slate-800 line-clamp-2 leading-tight">
                        {item.title}
                      </h4>
                      <div className="flex justify-between items-center pt-1">
                        <span className="font-black text-sm text-slate-900">
                          ₹{item.price.toLocaleString()}
                        </span>
                        
                        <Button
                          size="sm"
                          className="h-7 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[10px] px-2.5 rounded-lg flex items-center gap-1 shadow-sm border-none cursor-pointer"
                          onClick={(e) => handleAddToCart(item, e)}
                        >
                          <ShoppingCart className="h-3 w-3" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(item);
                      }}
                      className="absolute top-2 right-2 bg-red-50 text-red-600 hover:bg-red-100 h-6 w-6 rounded-full flex items-center justify-center border border-red-100 cursor-pointer shadow transition-all duration-150"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
