import { Button } from "@/components/ui/button";
import { Home, Bell, Award, Menu } from "lucide-react";
import React, { useState, useEffect } from "react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
              src="https://picsum.photos/seed/gec-logo/100/100"
              alt="GEC Logo"
              className="relative w-14 h-14 rounded-full border-2 border-yellow-400 shadow-lg"
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

        <div className="hidden lg:flex items-center gap-10">
          <NavLink label="Home" active />
          <NavLink label="Notification" />
          <NavLink label="Achievement" />
        </div>

        <Button variant="ghost" size="icon" className="lg:hidden text-white">
          <Menu size={28} />
        </Button>
      </div>
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
