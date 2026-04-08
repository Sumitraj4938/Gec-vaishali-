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
        
        <p className="text-slate-900 text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-4">
          © 2026 OFFICIAL TPO PORTAL • GECV
        </p>
        
        <div className="flex justify-center gap-4">
          <a href="/admin/login" className="text-[10px] text-slate-300 hover:text-blue-600 transition-colors uppercase font-bold tracking-widest">
            Admin Access
          </a>
        </div>
      </div>
    </footer>
  );
}
