import Header from "@/components/Header"
import CategoryNav from "@/components/CategoryNav"
import ProductGrid from "@/components/ProductGrid"
import Footer from "@/components/Footer"
import { Badge } from "@/components/ui/badge"

const Wholesale = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CategoryNav />
      
      {/* Wholesale Banner */}
      <div className="bg-gradient-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Badge variant="secondary" className="bg-secondary text-secondary-foreground mb-2">
              Wholesale Only
            </Badge>
            <h1 className="text-3xl font-bold mb-2">Wholesale Products</h1>
            <p className="text-primary-foreground/90">
              Special bulk pricing for registered wholesale buyers
            </p>
          </div>
        </div>
      </div>
      
      <ProductGrid wholesale={true} />
      <Footer />
    </div>
  )
}

export default Wholesale