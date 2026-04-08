import { Button } from "@/components/ui/button";
import { Home, Bell, Award, Menu, X, Shield } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useSettings } from "@/lib/useSettings";
import { motion, AnimatePresence } from "motion/react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { settings } = useSettings();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logoUrl = settings.logo_url || "https://api.dicebear.com/7.x/initials/svg?seed=GECV&backgroundColor=ffffff&fontFamily=Arial&fontSize=45&bold=true&fontColor=0a192f";

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-[#0a192f]/95 backdrop-blur-md shadow-lg py-3"
          : "bg-gradient-to-r from-[#0a192f] to-[#1a237e] py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute -inset-1 bg-yellow-400 rounded-full blur opacity-25"></div>
            <img
              src={logoUrl}
              alt="GEC Vaishali Logo"
              className="relative w-14 h-14 rounded-full border-2 border-yellow-400 shadow-lg bg-white p-1"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h1 className="text-white font-black text-xl md:text-2xl tracking-tight leading-none italic uppercase">
              TRAINING & PLACEMENT PORTAL
            </h1>
            <p className="text-yellow-400 text-xs md:text-sm font-bold tracking-[0.15em] italic uppercase mt-1">
              CIVIL ENGINEERING, GEC VAISHALI
            </p>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-10">
          <NavLink label="Home" active />
          <NavLink label="Notification" />
          <NavLink label="Achievement" />
          <a 
            href="/admin/login" 
            className="flex items-center gap-2 bg-yellow-400 text-slate-900 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-white transition-all"
          >
            <Shield size={14} /> Admin
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden text-white hover:bg-white/10"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-full left-0 w-full bg-[#0a192f] border-t border-white/10 shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col p-6 space-y-4">
              <MobileNavLink label="Home" active onClick={() => setIsMenuOpen(false)} />
              <MobileNavLink label="Notification" onClick={() => setIsMenuOpen(false)} />
              <MobileNavLink label="Achievement" onClick={() => setIsMenuOpen(false)} />
              <div className="pt-4 border-t border-white/10">
                <a 
                  href="/admin/login" 
                  className="flex items-center justify-center gap-2 w-full bg-yellow-400 text-slate-900 py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-white transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Shield size={18} /> Admin Access
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function NavLink({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <a
      href="#"
      className={`text-sm font-bold tracking-widest transition-all hover:text-yellow-400 uppercase ${
        active ? "text-yellow-400 border-b-2 border-yellow-400 pb-1" : "text-white/80"
      }`}
    >
      <span>{label}</span>
    </a>
  );
}

function MobileNavLink({ label, active = false, onClick }: { label: string; active?: boolean; onClick: () => void }) {
  return (
    <a
      href="#"
      onClick={onClick}
      className={`text-lg font-bold tracking-widest transition-all uppercase block py-2 ${
        active ? "text-yellow-400" : "text-white/80"
      }`}
    >
      {label}
    </a>
  );
}
