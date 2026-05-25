import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { HardHat, Star, Shield, Users, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const LabourPromo = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-amber-400/10 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Interactive Cards & Visuals */}
          <div className="lg:col-span-5 order-2 lg:order-1 relative">
            
            {/* Visual badge stack */}
            <div className="relative space-y-4">
              
              {/* Card 1 */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white p-5 rounded-2xl border border-slate-100 shadow-md flex items-center gap-4 max-w-sm ml-0"
              >
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
                  <HardHat className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Professional Masons</h4>
                  <p className="text-xs text-slate-500">Verified Rajmistry for brickwork & plaster</p>
                </div>
              </motion.div>

              {/* Card 2 */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white p-5 rounded-2xl border border-amber-200 shadow-lg shadow-amber-50 flex items-center gap-4 max-w-sm ml-6 md:ml-12"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                  <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Top-Rated Electricians</h4>
                  <p className="text-xs text-slate-500">4.9★ average rating on 850+ jobs</p>
                </div>
              </motion.div>

              {/* Card 3 */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white p-5 rounded-2xl border border-slate-100 shadow-md flex items-center gap-4 max-w-sm ml-0"
              >
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Insured & Safe Work</h4>
                  <p className="text-xs text-slate-500">Full background check & job guarantee</p>
                </div>
              </motion.div>

            </div>

            {/* Overlapping badge */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
              className="absolute -top-6 -right-6 md:right-10 bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-full w-28 h-28 flex flex-col items-center justify-center shadow-xl text-center p-3 border-4 border-white"
            >
              <span className="text-xl font-black">5,000+</span>
              <span className="text-[9px] font-bold uppercase tracking-wider">Bookings Done</span>
            </motion.div>
          </div>

          {/* Right Column: Information & Call to Action */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-700 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Specialist Service
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-800 leading-tight">
                Need Skilled Construction <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
                  Labour & Workers?
                </span>
              </h2>
              <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-xl">
                Skip the hassle of local daily markets. Book expert rajmistry, certified electricians, plumbers, painters, and general helpers directly online. Complete transparency, on-time arrivals, and professional output guaranteed.
              </p>
            </motion.div>

            {/* Features check grid */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md"
            >
              {[
                { icon: Shield, title: "100% Verified Identity" },
                { icon: Users, title: "Insured & Trained Staff" },
                { icon: Star, title: "Fixed Daily Base Rates" },
                { icon: ArrowRight, title: "Same-Day Deployment" },
              ].map(({ icon: Icon, title }) => (
                <div key={title} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                    <Icon className="w-3 h-3" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{title}</span>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="pt-4 flex flex-col sm:flex-row gap-4"
            >
              <Button
                size="lg"
                onClick={() => navigate("/labour")}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-6 rounded-xl shadow-lg shadow-amber-200 flex items-center gap-2 group transition-all duration-300"
              >
                Hire Labour Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/wholesale")}
                className="border-slate-200 hover:bg-slate-100 text-slate-700 font-bold px-8 py-6 rounded-xl"
              >
                Buy Materials Instead
              </Button>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default LabourPromo;
