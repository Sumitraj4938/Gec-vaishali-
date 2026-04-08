import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#1a237e] py-24 md:py-32">
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-transparent"></div>
      
      <div className="container relative mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block mb-8">
            <Badge className="bg-slate-800/50 text-slate-300 border border-slate-700 px-6 py-2 text-xs font-bold uppercase tracking-[0.2em] rounded-full backdrop-blur-sm">
              OFFICIAL CAREER PORTAL 2024-25
            </Badge>
          </div>
          
          <h1 className="mb-8 text-6xl md:text-8xl font-black text-white tracking-tight italic">
            Step Into Your <span className="text-yellow-400">Future</span>
          </h1>
          
          <p className="mx-auto max-w-3xl text-xl md:text-2xl text-slate-200 font-medium leading-relaxed italic opacity-90">
            Empowering the engineers of tomorrow by bridging the gap between academic excellence and industry standards.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
