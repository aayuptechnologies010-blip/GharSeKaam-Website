import Header from "@/components/Header"
import CategoryNav from "@/components/CategoryNav"
import HeroBanner from "@/components/HeroBanner"
import LabourPromo from "@/components/LabourPromo"
import { GharSeKroInfo } from "@/components/GharSeKroInfo"
import ProductGrid from "@/components/ProductGrid"
import Footer from "@/components/Footer"

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CategoryNav />
      <HeroBanner />
      <LabourPromo />
      <GharSeKroInfo />
      <ProductGrid />
      <Footer />
    </div>
  );
};

export default Index;
