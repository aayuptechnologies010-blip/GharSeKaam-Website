import { useParams } from "react-router-dom"
import Header from "@/components/Header"
import CategoryNav from "@/components/CategoryNav"
import ProductGrid from "@/components/ProductGrid"
import Footer from "@/components/Footer"
import { Badge } from "@/components/ui/badge"

const Category = () => {
  const { categoryName } = useParams()
  
  const categoryDisplayName = categoryName?.charAt(0).toUpperCase() + categoryName?.slice(1) || "Products"

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CategoryNav />
      
      {/* Category Banner */}
      <div className="bg-gradient-card py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Badge variant="outline" className="mb-2">
              Category
            </Badge>
            <h1 className="text-3xl font-bold mb-2">{categoryDisplayName}</h1>
            <p className="text-muted-foreground">
              Browse our wide selection of {categoryDisplayName.toLowerCase()} products
            </p>
          </div>
        </div>
      </div>
      
      <ProductGrid category={categoryName} />
      <Footer />
    </div>
  )
}

export default Category