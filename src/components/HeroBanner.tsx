import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { url } from "@/constant.js"


const HeroBanner = () => {
  const navigate = useNavigate()

  const [banners, setBanners] = useState<any[]>([])
  const [index, setIndex] = useState<number>(0)

  useEffect(() => {
    const fetchUrl = `${url}/user/inventory/shop-Images`
    let mounted = true
    const fetchBanners = async () => {
      try {
        const res = await fetch(fetchUrl)
        const data = await res.json()
        if (!mounted) return
        if (data?.success && Array.isArray(data.shopImages)) {
          const mains = data.shopImages.filter((s: any) => /^Main Banner \d+$/.test(s.description))
          if (mains.length > 0) {
            setBanners(mains)
            setIndex(0)
            return
          }
        }
      } catch (e) {
        // ignore fetch errors and fall back to default image
      }
    }

    fetchBanners()
    return () => {
      mounted = false
    }
  }, [])

  const prev = () => setIndex((i) => (banners.length ? (i - 1 + banners.length) % banners.length : i))
  const next = () => setIndex((i) => (banners.length ? (i + 1) % banners.length : i))

  return (
    <div className="bg-gradient-hero text-primary-foreground relative overflow-hidden">
      <div className="container mx-auto px-15 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Badge variant="secondary" className="bg-secondary text-secondary-foreground font-semibold px-3 py-1 rounded-full uppercase tracking-wider text-[10px]">
                Marketplace Platform
              </Badge>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                Ghar Se Karo
                <br />
                <span className="text-secondary">Build Better, Together</span>
              </h1>
            </div>

            <p className="text-lg text-primary-foreground/90 max-w-lg leading-relaxed">
              India's first integrated construction marketplace — materials, labour, and delivery, all in one trusted platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                variant="secondary"
                className="bg-secondary hover:bg-secondary-hover font-semibold px-6 py-6 rounded-xl"
                onClick={() => navigate('/wholesale')}
              >
                Shop Wholesale
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground text-primary hover:bg-primary-foreground hover:text-primary font-semibold px-6 py-6 rounded-xl"
                onClick={() => navigate('/')}
              >
                Browse Retail
              </Button>
            </div>

            <div className="flex items-center gap-8 text-sm pt-2">
              <div className="text-left">
                <div className="font-black text-2xl text-white">500+</div>
                <div className="text-primary-foreground/80 text-xs">Orders Fulfilled</div>
              </div>
              <div className="text-left">
                <div className="font-black text-2xl text-white">120+</div>
                <div className="text-primary-foreground/80 text-xs">Verified Vendors</div>
              </div>
              <div className="text-left">
                <div className="font-black text-2xl text-white">3</div>
                <div className="text-primary-foreground/80 text-xs">Cities Live</div>
              </div>
            </div>
          </div>

          {/* Hero Image/Illustration */}
          <div className="container mx-auto max-w-lg lg:max-w-none lg:justify-end lg:flex">
            <div className="bg-primary-foreground/10 rounded-2xl p-4 backdrop-blur-sm">
              <div className="">
                <img
                  src={banners.length ? banners[index].imageurl : "/const.png"}
                  alt={banners.length ? banners[index].description : "Construction tools and materials"}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <Button
        variant="ghost"
        size="icon"
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>

      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {(banners.length ? banners : [1]).map((b: any, i: number) => (
          <button
            key={b.id ?? i}
            onClick={() => banners.length && setIndex(i)}
            aria-label={b.description ?? `dot-${i}`}
            className={`w-2 h-2 rounded-full transition-all duration-normal ${i === index ? 'bg-primary-foreground' : 'bg-primary-foreground/50'}`}
          />
        ))}
      </div>
    </div>
  )
}

export default HeroBanner