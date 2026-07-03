import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin,
  Globe,
  DollarSign,
  Code2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <footer className="w-full flex flex-col mt-auto select-none">
      
      {/* 1. Back to Top Bar (Amazon style #37475a) */}
      <button 
        onClick={handleScrollToTop}
        className="w-full bg-[#37475a] hover:bg-[#485769] py-3.5 text-center text-xs font-black text-white cursor-pointer select-none transition-colors border-none outline-none"
      >
        Back to top
      </button>

      {/* 2. Main Columns Directory Belt (Amazon style #232f3e) */}
      <div className="bg-[#232f3e] text-slate-100 border-b border-slate-700/60">
        <div className="container mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-5xl text-left">
          
          {/* Column 1: Get to Know Us */}
          <div className="space-y-3.5">
            <h4 className="text-sm font-black text-white uppercase tracking-wider">Get to Know Us</h4>
            <ul className="space-y-2 text-xs font-bold text-slate-300">
              <li><a href="#" className="hover:underline transition-all">About GharSeKro</a></li>
              {localStorage.getItem("authToken") && (
                <li><span onClick={() => navigate('/wholesale')} className="hover:underline cursor-pointer transition-all">Wholesale Program</span></li>
              )}
              <li><span onClick={() => navigate('/labour')} className="hover:underline cursor-pointer transition-all">Worker Portal</span></li>
              <li><a href="#" className="hover:underline transition-all">Careers</a></li>
              <li><a href="#" className="hover:underline transition-all">Press Releases</a></li>
            </ul>
          </div>

          {/* Column 2: Connect with Us */}
          <div className="space-y-3.5">
            <h4 className="text-sm font-black text-white uppercase tracking-wider">Connect with Us</h4>
            <ul className="space-y-2 text-xs font-bold text-slate-300">
              <li className="flex items-center gap-2">
                <Facebook className="h-3.5 w-3.5 text-slate-400" />
                <a href="#" className="hover:underline">Facebook</a>
              </li>
              <li className="flex items-center gap-2">
                <Twitter className="h-3.5 w-3.5 text-slate-400" />
                <a href="#" className="hover:underline">Twitter</a>
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="h-3.5 w-3.5 text-slate-400" />
                <a href="#" className="hover:underline">Instagram</a>
              </li>
              <li className="flex items-center gap-2">
                <Linkedin className="h-3.5 w-3.5 text-slate-400" />
                <a href="#" className="hover:underline">LinkedIn</a>
              </li>
              <li className="flex items-center gap-2 border-t border-slate-700/50 pt-2 mt-2">
                <Mail className="h-3.5 w-3.5 text-[#febd69]" />
                <a href="mailto:amanwork0099@gmail.com" className="hover:underline text-slate-200">amanwork0099@gmail.com</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Make Money with Us */}
          <div className="space-y-3.5">
            <h4 className="text-sm font-black text-white uppercase tracking-wider">Make Money with Us</h4>
            <ul className="space-y-2 text-xs font-bold text-slate-300">
              <li><a href="#" className="hover:underline transition-all flex items-center gap-1"><DollarSign className="h-3.5 w-3.5 text-[#febd69]" /> Sell on GharSeKro</a></li>
              <li><a href="#" className="hover:underline transition-all">Become a Vendor</a></li>
              <li><a href="#" className="hover:underline transition-all">Advertise Products</a></li>
              <li><a href="#" className="hover:underline transition-all">Fulfilment by GSK</a></li>
              <li><a href="#" className="hover:underline transition-all"> GSK Merchant Hub</a></li>
            </ul>
          </div>

          {/* Column 4: Let Us Help You */}
          <div className="space-y-3.5">
            <h4 className="text-sm font-black text-white uppercase tracking-wider">Let Us Help You</h4>
            <ul className="space-y-2 text-xs font-bold text-slate-300">
              <li><span onClick={() => navigate('/profile')} className="hover:underline cursor-pointer transition-all">Your GSK Account</span></li>
              <li><span onClick={() => navigate('/orders')} className="hover:underline cursor-pointer transition-all">Returns & Orders</span></li>
              <li><a href="#" className="hover:underline transition-all">GST Input Assistance</a></li>
              <li><a href="#" className="hover:underline transition-all"> GSK Help Center</a></li>
              <li><a href="#" className="hover:underline transition-all">Shipping & Rates</a></li>
            </ul>
          </div>

        </div>

        {/* Global Settings row inside Medium Navy bar */}
        <div className="border-t border-slate-700/50 py-7 flex flex-wrap gap-5 justify-center items-center">
          <div className="flex items-center leading-none text-white p-1">
            <span className="text-lg font-black tracking-tight">GharSeKro</span>
            <span className="text-xs font-black text-[#febd69] ml-0.5">.in</span>
          </div>
          <div className="flex gap-3 text-xs font-bold text-slate-300">
            <div className="flex items-center gap-1.5 border border-slate-600 rounded px-2.5 py-1 hover:border-slate-400 cursor-pointer">
              <Globe className="h-3.5 w-3.5 text-slate-400" />
              <span>English</span>
            </div>
            <div className="flex items-center gap-1.5 border border-slate-600 rounded px-2.5 py-1 hover:border-slate-400 cursor-pointer">
              <span className="text-xs">🇮🇳</span>
              <span>India</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Legal strip (Amazon style #131921) */}
      <div className="bg-[#131921] py-8 text-slate-400 text-xs font-bold border-t border-slate-800/40">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-6">
          
          {/* Prominent Technology Partner Badge */}
          <div className="bg-[#1a232d]/90 border border-slate-800 hover:border-[#febd69]/30 rounded-xl py-3 px-5 max-w-xl mx-auto shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-300 hover:bg-[#1a232d]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#232f3e] text-[#febd69] border border-slate-700/50 flex items-center justify-center">
                <Code2 className="h-4.5 w-4.5" />
              </div>
              <div className="text-left">
                <h5 className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold leading-none mb-1">Official Tech Partner</h5>
                <p className="text-xs text-slate-200 font-bold">Platform Engineered & Maintained By</p>
              </div>
            </div>
            
            <a 
              href="https://www.aayuptechnologies.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group text-[#febd69] hover:text-[#ff9900] text-xs font-black tracking-wide transition-all duration-300 flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#131921] border border-slate-800 hover:border-slate-600 hover:scale-[1.02] shadow-sm select-none"
            >
              <span>Aayup Technologies</span>
              <span className="inline-block transition-transform duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-xs text-[#febd69] group-hover:text-[#ff9900]">↗</span>
            </a>
          </div>

          {/* Sub-Footer fine links */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center text-[10.5px]">
            <a href="#" className="hover:underline">Conditions of Use & Sale</a>
            <a href="#" className="hover:underline">Privacy Notice</a>
            <a href="#" className="hover:underline">Interest-Based Ads</a>
            <span>© 2024-{new Date().getFullYear()}, GharSeKro Connect, Inc. or its affiliates</span>
          </div>

          <p className="text-[10px] text-slate-500 font-semibold leading-relaxed max-w-2xl mx-auto">
            GharSeKro.in is India's leading fully integrated e-commerce and logistics marketplace for heavy structural materials, modular power tools, premium paints, and certified job-site labor.
          </p>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
