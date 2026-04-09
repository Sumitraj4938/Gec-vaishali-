import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";

export function Hero() {
  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-[#0a192f]">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1541339907198-e08756eaa589?auto=format&fit=crop&q=80&w=2000" 
          alt="College Campus" 
          className="w-full h-full object-cover opacity-30"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a192f] via-[#0a192f]/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] to-transparent"></div>
      </div>
      
      <div className="container relative z-10 mx-auto px-4">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block mb-6">
              <Badge className="bg-yellow-400 text-slate-900 border-none px-6 py-2 text-xs font-black uppercase tracking-[0.2em] rounded-full shadow-lg shadow-yellow-400/20">
                OFFICIAL CAREER PORTAL 2024-25
              </Badge>
            </div>
            
            <h1 className="mb-6 text-6xl md:text-8xl font-black text-white tracking-tight italic leading-[0.9]">
              BUILDING THE <br />
              <span className="text-yellow-400">ARCHITECTS</span> <br />
              OF TOMORROW
            </h1>
            
            <p className="max-w-2xl text-xl md:text-2xl text-slate-300 font-medium leading-relaxed italic opacity-90 border-l-4 border-yellow-400 pl-6">
              Empowering the engineers of tomorrow by bridging the gap between academic excellence and industry standards.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <button className="bg-yellow-400 text-slate-900 px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-yellow-400/10">
                Explore Opportunities
              </button>
              <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-white/20 transition-all">
                Our Placements
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Element */}
      <div className="absolute bottom-0 right-0 w-1/3 h-full hidden lg:block">
        <div className="w-full h-full bg-gradient-to-l from-yellow-400/10 to-transparent skew-x-12 transform translate-x-1/2"></div>
      </div>
    </section>
  );
}
