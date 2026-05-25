import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin,
  Truck,
  Shield,
  Clock,
  CreditCard
} from "lucide-react"
import logo from '../../public/logo.png';

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t">
      {/* Features Section */}
      <div className="bg-gradient-card border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Truck className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <div className="font-semibold">Fast Delivery</div>
                <div className="text-sm text-muted-foreground">Same day delivery available</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success rounded-lg">
                <Shield className="h-5 w-5 text-success-foreground" />
              </div>
              <div>
                <div className="font-semibold">Quality Assured</div>
                <div className="text-sm text-muted-foreground">100% authentic products</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary rounded-lg">
                <Clock className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <div className="font-semibold">24/7 Support</div>
                <div className="text-sm text-muted-foreground">Always here to help</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning rounded-lg">
                <CreditCard className="h-5 w-5 text-warning-foreground" />
              </div>
              <div>
                <div className="font-semibold">Secure Payment</div>
                <div className="text-sm text-muted-foreground">Multiple payment options</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
                <img src={logo} alt="GharSeKro logo" className="w-16 h-16 object-contain" />
                <div>
                  <h3
                    className="text-2xl font-bold bg-clip-text text-transparent"
                    style={{ backgroundImage: 'linear-gradient(90deg, #f59e0b, #d97706)' }}
                  >
                    GharSeKro
                  </h3>
                  <span className="text-sm text-muted-foreground">Do it from home.</span>
                </div>
              </div>
            <p className="text-sm text-muted-foreground">
              Your trusted partner for all construction supply needs. 
              From hardware to heavy machinery, we've got you covered.
            </p>
            <div className="flex space-x-3">
              <Button size="icon" variant="ghost">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Wholesale Program</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Become a Supplier</a></li>
              <li><a href="/labour" className="text-muted-foreground hover:text-primary transition-colors">Worker Hiring</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Track Order</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="font-semibold">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Hardware & Tools</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Plumbing Supplies</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Electrical Materials</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Building Materials</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Safety Equipment</a></li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h4 className="font-semibold">Stay Connected</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-primary" />
                <span>+91 8957035082</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-primary" />
                <span>amanwork0099@gmail.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Gorakhpur, Uttar Pradesh</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h5 className="text-sm font-medium">Newsletter</h5>
              <div className="flex gap-2">
                <Input placeholder="Enter email" className="text-sm" />
                <Button size="sm">Subscribe</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator />
      
      {/* Bottom Footer */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div>
            © 2024 GharSeKro Connect. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Return Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
