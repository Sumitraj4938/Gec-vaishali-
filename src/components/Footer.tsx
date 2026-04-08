import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="bg-white py-12 border-t-4 border-yellow-400">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-black text-slate-200 tracking-widest italic uppercase mb-4 mix-blend-difference">
          TRAINING & PLACEMENT PORTAL
        </h2>
        <p className="text-slate-400 text-sm md:text-base font-medium italic mb-8">
          Government Engineering College, Vaishali, Bihar - 844101
        </p>
        
        <p className="text-slate-900 text-xs md:text-sm font-bold tracking-[0.2em] uppercase">
          © 2026 OFFICIAL TPO PORTAL • GECV
        </p>
      </div>
    </footer>
  );
}
