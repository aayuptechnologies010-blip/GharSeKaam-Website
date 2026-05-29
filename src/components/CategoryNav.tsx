import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { getCategories, ApiCategory } from "@/lib/api"
import { Sparkles, Star } from "lucide-react"

// Premium Hardcoded Category Fallbacks matching standard hardware categories
const DUMMY_CATEGORIES: ApiCategory[] = [
  {
    id: "pt-1",
    title: "Power Tools",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=250&auto=format&fit=crop"
  },
  {
    id: "cs-1",
    title: "Cement & Sand",
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=250&auto=format&fit=crop"
  },
  {
    id: "el-1",
    title: "Electricals",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=250&auto=format&fit=crop"
  },
  {
    id: "pa-1",
    title: "Paints",
    image: "https://images.unsplash.com/photo-1595206133361-b1fe343e5e23?q=80&w=250&auto=format&fit=crop"
  },
  {
    id: "pl-1",
    title: "Plumbing",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=250&auto=format&fit=crop"
  },
  {
    id: "sf-1",
    title: "Safety Equipment",
    image: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?q=80&w=250&auto=format&fit=crop"
  },
  {
    id: "hw-1",
    title: "Hardware & Locks",
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=250&auto=format&fit=crop"
  },
  {
    id: "st-1",
    title: "Steel & Iron",
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=250&auto=format&fit=crop"
  }
];

const CategoryNav = () => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState<ApiCategory[]>(DUMMY_CATEGORIES)

  useEffect(() => {
    const ac = new AbortController()
    getCategories(ac.signal)
      .then((cats) => {
        if (cats && cats.length > 0) {
          const enhanced = cats.map(c => {
            const match = DUMMY_CATEGORIES.find(d => d.title.toLowerCase() === c.title.toLowerCase());
            return {
              ...c,
              image: c.image || match?.image || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=150&auto=format&fit=crop"
            };
          });
          setCategories(enhanced);
        } else {
          setCategories(DUMMY_CATEGORIES);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch categories, using premium hardcoded fallbacks:', err)
        setCategories(DUMMY_CATEGORIES);
      })
    return () => ac.abort()
  }, [])


  return (
    <div className="bg-white border-b relative">
      {/* Decorative top strip matching Amazon active brand styling */}
      <div className="h-1 bg-[#f3a847] w-full" />
      
      <div className="container mx-auto px-4 md:px-8 pt-6 pb-5">
        
        {/* Outstanding Header Strip */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-[1px] bg-gradient-to-r from-transparent to-slate-200 flex-1 hidden sm:block" />
          <div className="flex items-center gap-2">
            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            <h3 className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">Shop by Category</h3>
            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
          </div>
          <div className="h-[1px] bg-gradient-to-l from-transparent to-slate-200 flex-1 hidden sm:block" />
        </div>

        <div className="relative">
          {/* Horizontal scrollable category container */}
          <div className="flex items-center justify-between overflow-x-auto scrollbar-none pb-1 snap-x">
            <div className="flex items-center gap-6 md:gap-10 mx-auto py-1">
              
              {/* Category Circle Items */}
              {categories.map((category) => {
                const categorySlug = category.title.toLowerCase().replace(/\s+/g, '-');
                
                return (
                  <button
                    key={category.id}
                    className="flex flex-col items-center gap-2.5 group snap-center bg-transparent border-none outline-none cursor-pointer focus:outline-none"
                    onClick={() => navigate(`/category/${categorySlug}`)}
                  >
                    {/* Circle Image Wrapper with Premium Glowing Highlights */}
                    <div className="relative h-16 w-16 md:h-20 md:w-20 rounded-full flex items-center justify-center p-[2.5px] bg-white border border-slate-200 shadow-sm group-hover:shadow-md group-hover:border-amber-500/80 transition-all duration-300 transform group-hover:scale-105">
                      
                      {/* Outer pulsing glow ring */}
                      <div className="absolute inset-[-2px] rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 p-[4px] blur-[2px] animate-pulse" />
                      
                      {/* Inner circle border */}
                      <div className="h-full w-full rounded-full overflow-hidden bg-slate-50 flex items-center justify-center border border-slate-100">
                        <img 
                          src={category.image} 
                          alt={category.title} 
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-115"
                          onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=150&auto=format&fit=crop";
                          }}
                        />
                      </div>

                      {/* Sparkle badge for special trending categories */}
                      {["Power Tools", "Cement & Sand"].includes(category.title) && (
                        <span className="absolute -top-1 -right-1 bg-amber-500 text-[8px] text-slate-950 font-black p-0.5 rounded-full border border-white flex items-center justify-center shadow">
                          <Sparkles className="h-2 w-2 fill-slate-950" />
                        </span>
                      )}
                    </div>

                    {/* Category Label */}
                    <span className="text-[10px] md:text-xs font-black text-slate-700 group-hover:text-amber-600 transition-colors uppercase tracking-wider text-center max-w-[85px] leading-tight">
                      {category.title}
                    </span>
                  </button>
                );
              })}

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryNav