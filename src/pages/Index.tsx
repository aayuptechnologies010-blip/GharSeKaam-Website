import Header from "@/components/Header"
import CategoryNav from "@/components/CategoryNav"
import HeroBanner from "@/components/HeroBanner"
import { HardwareGrids } from "@/components/HardwareGrids"
import { DealsSection } from "@/components/DealsSection"
import LabourPromo from "@/components/LabourPromo"
import { GharSeKroInfo } from "@/components/GharSeKroInfo"
import ProductGrid from "@/components/ProductGrid"
import Footer from "@/components/Footer"
import { useEffect } from "react"
import { useLocation } from "react-router-dom"

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get("tab");
    if (tab) {
      let targetId = "";
      if (tab === "deals") {
        targetId = "deals-section";
      } else if (tab === "bestsellers" || tab === "newreleases") {
        targetId = "products-section";
      } else if (tab === "customerservice") {
        targetId = "info-section";
      }

      if (targetId) {
        setTimeout(() => {
          const element = document.getElementById(targetId);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 150);
      }
    }
  }, [location.search]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CategoryNav />
      <HeroBanner />
      <HardwareGrids />
      <div id="deals-section" className="scroll-mt-20">
        <DealsSection />
      </div>
      <div id="products-section" className="scroll-mt-20">
        <ProductGrid />
      </div>
      <LabourPromo />
      <div id="info-section" className="scroll-mt-20">
        <GharSeKroInfo />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
