"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Text3DFlip from "@/components/ui/3d-stagger-flip";
import { useClickSound } from "@/hooks/use-click-sound";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const categories = [
  { name: "Text Animations", count: 81, href: "/docs/text-animations" },
  { name: "Animations", count: 30, href: "/docs/animations" },
  { name: "Components", count: 56, href: "/docs/components" },
  { name: "Backgrounds", count: 25, href: "/docs/backgrounds" },
];

function DotGrid({ onClick, isOpen }: { onClick: () => void; isOpen: boolean }) {
  const crossIndices = [0, 2, 4, 6, 8];

  return (
    <button
      onClick={onClick}
      className="grid grid-cols-3 gap-[3px] p-1 cursor-pointer transition-opacity hover:opacity-80"
      aria-label="Toggle sidebar"
    >
      {Array.from({ length: 9 }).map((_, i) => {
        const isActive = !isOpen || crossIndices.includes(i);
        return (
          <span
            key={i}
            className={`block w-[5px] h-[5px] rounded-full bg-[var(--foreground)] transition-opacity duration-200 ${
              isActive ? "opacity-100" : "opacity-20"
            }`}
          />
        );
      })}
    </button>
  );
}

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();
  const { play } = useClickSound();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const isAnimating = useRef(false);

  const { contextSafe } = useGSAP(() => {
    if (!isOpen) {
      gsap.set(panelRef.current, { xPercent: 120 });
      gsap.set(".kibo-prelayer", { xPercent: 120, opacity: 1 });
      gsap.set(".sidebar-link-item", { y: 20, opacity: 0 });
    } else {
      gsap.set(panelRef.current, { xPercent: 0 });
      gsap.set(".kibo-prelayer", { xPercent: 0, opacity: 0 });
      gsap.set(".sidebar-link-item", { y: 0, opacity: 1 });
    }
  }, { scope: containerRef });

  const toggleMenu = useCallback((targetState: boolean) => {
    if (isAnimating.current || targetState === isOpen) return;
    
    isAnimating.current = true;
    setIsOpen(targetState);
    play();

    contextSafe(() => {
      const panel = panelRef.current;
      const preLayers = gsap.utils.toArray(".kibo-prelayer") as HTMLElement[];
      const links = gsap.utils.toArray(".sidebar-link-item") as HTMLElement[];
    
    if (targetState) {
      // Opening Animation
      gsap.set(panel, { xPercent: 120 });
      gsap.set(preLayers, { xPercent: 120, opacity: 1 });
      gsap.set(links, { y: 20, opacity: 0 });
      
      const tl = gsap.timeline({
        onComplete: () => { 
          isAnimating.current = false; 
          gsap.set(preLayers, { opacity: 0 });
        }
      });
      
      tl.to(preLayers, {
        xPercent: 0,
        duration: 0.5,
        ease: "power4.out",
        stagger: 0.08
      });
      
      tl.to(panel, {
        xPercent: 0,
        duration: 0.45,
        ease: "power4.out"
      }, "-=0.45");
      
      tl.to(links, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.05
      }, "-=0.3");
      
    } else {
      // Closing Animation
      gsap.set(preLayers, { opacity: 1 });

      const tl = gsap.timeline({
        onComplete: () => { 
          isAnimating.current = false; 
          gsap.set(links, { y: 20, opacity: 0 });
        }
      });
      
      const allLayers = [panel, ...preLayers.slice().reverse()];
      tl.to(allLayers, {
        xPercent: 120,
        duration: 0.4,
        ease: "power3.inOut",
        stagger: 0.04
      });
    }
    })();
  }, [contextSafe, isOpen, play]);

  return (
    <div ref={containerRef}>
      {/* Fixed Toggle Button (Always visible) */}
      <div className="fixed top-[24px] right-[24px] sm:top-[48px] sm:right-[48px] z-[60] h-[48px] flex items-center pointer-events-auto">
        <DotGrid onClick={() => toggleMenu(!isOpen)} isOpen={isOpen} />
      </div>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 sm:hidden transition-opacity"
          onClick={() => toggleMenu(false)}
        />
      )}

      {/* Pre-layers for GSAP Animation */}
      <div 
        className="fixed z-40 top-0 right-0 h-screen w-full sm:w-[320px] sm:top-6 sm:right-6 sm:bottom-6 sm:h-auto sm:rounded-[5px] pointer-events-none overflow-hidden"
      >
        <div className="kibo-prelayer absolute inset-0 bg-[#2b2527]" />
        <div className="kibo-prelayer absolute inset-0 bg-[var(--accent)]" />
      </div>

      {/* Sidebar */}
      <aside
        ref={panelRef}
        className="fixed z-50 flex flex-col bg-[#151314] top-0 right-0 h-screen w-full sm:w-[320px] sm:top-6 sm:right-6 sm:bottom-6 sm:h-auto sm:rounded-[5px] sm:shadow-2xl"
      >
        {/* Header — Logo (Toggle button is fixed above) */}
        <div className="flex items-center justify-start pl-[12px] pr-[24px] mt-[24px] h-[48px] shrink-0">
          <Image
            src="/logo/kibo-logo-light.png"
            alt="Kibo Logo"
            width={48}
            height={48}
            className="object-contain pointer-events-none"
          />
        </div>

        {/* Upper Options */}
        <nav className="flex flex-col gap-[12px] pl-[24px] mt-[20px] sm:mt-[32px]">
          <Link
            href="/docs/introduction"
            onClick={play}
            className={`sidebar-link-item text-[24px] leading-none transition-opacity duration-200 hover:opacity-100 ${pathname === "/docs/introduction" ? "text-accent" : "text-[var(--foreground)] opacity-80"}`}
          >
            <Text3DFlip 
              text="Introduction" 
              tag="span" 
              staggerDuration={0.025} 
              color="inherit" 
              font={{ fontSize: "inherit", fontFamily: "inherit", fontWeight: "inherit", letterSpacing: "inherit", lineHeight: "inherit" }} 
              style={{ width: "auto" }}
              rotateDirection="bottom"
            />
          </Link>
          <Link
            href="/docs/installation"
            onClick={play}
            className={`sidebar-link-item text-[24px] leading-none transition-opacity duration-200 hover:opacity-100 ${pathname === "/docs/installation" ? "text-accent" : "text-[var(--foreground)] opacity-60"}`}
          >
            <Text3DFlip 
              text="Installation" 
              tag="span" 
              staggerDuration={0.025} 
              color="inherit" 
              font={{ fontSize: "inherit", fontFamily: "inherit", fontWeight: "inherit", letterSpacing: "inherit", lineHeight: "inherit" }} 
              style={{ width: "auto" }}
              rotateDirection="bottom"
            />
          </Link>
        </nav>

        {/* Divider */}
        <div className="ml-[24px] mr-[35px] mt-[24px] mb-[16px] sm:mt-[32px] sm:mb-[24px]">
          <div className="h-px w-full bg-[var(--foreground)] opacity-[0.2]" />
        </div>

        {/* Main Options */}
        <nav className="flex flex-col gap-[12px] pl-[24px] flex-1 overflow-y-auto">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              onClick={play}
              className={`sidebar-link-item flex items-start gap-[10px] text-[20px] sm:text-[24px] leading-none transition-opacity duration-200 hover:opacity-100 ${pathname === cat.href ? "text-accent" : "text-[var(--foreground)] opacity-80"}`}
            >
              <Text3DFlip 
                text={cat.name} 
                tag="span" 
                staggerDuration={0.025} 
                color="inherit" 
                font={{ fontSize: "inherit", fontFamily: "inherit", fontWeight: "inherit", letterSpacing: "inherit", lineHeight: "inherit" }} 
                style={{ width: "auto" }}
                rotateDirection="bottom"
              />
              <span className="text-[10px] sm:text-[12px] leading-none text-[var(--foreground)] opacity-60 translate-y-1">
                ({cat.count})
              </span>
            </Link>
          ))}
        </nav>

        {/* Lower Divider */}
        <div className="ml-[24px] mr-[35px] mb-4 mt-4 sm:mt-auto">
          <div className="h-px w-full bg-[var(--foreground)] opacity-[0.2]" />
        </div>

        {/* Lower Options */}
        <div className="flex items-center justify-between pl-[24px] pr-[35px] mb-[16px] sm:mb-[24px]">
          <span className="sidebar-link-item text-[var(--foreground)] font-black text-[18px] leading-none tracking-wide">
            Adarz
          </span>
          <div className="sidebar-link-item flex items-center gap-[12px]">
            <div 
              className="w-[12px] h-[12px] rounded-full bg-[var(--foreground)] cursor-pointer hover:opacity-80 transition-opacity" 
              title="Toggle Theme"
            />
            <button 
              onClick={play}
              className="w-[12px] h-[12px] rounded-full bg-[var(--accent)] cursor-pointer hover:opacity-80 transition-opacity"
              title="Logout"
              aria-label="Logout"
            />
          </div>
        </div>
      </aside>
    </div>
  );
}
