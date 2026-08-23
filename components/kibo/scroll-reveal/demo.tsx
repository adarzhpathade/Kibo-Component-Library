import { useRef } from "react";
import { ScrollReveal } from "./component";

export default function ScrollRevealDemo() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative h-full w-full bg-transparent overflow-hidden rounded-[8px]">
      {/* Scrollable container with hidden scrollbar and Lenis scroll prevention */}
      <div
        ref={scrollContainerRef}
        data-lenis-prevent="true"
        className="h-full w-full overflow-y-auto overflow-x-hidden overscroll-contain px-6 py-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {/* Top spacer / intro */}
        <div className="h-[240px] flex flex-col items-center justify-center text-center">
          <span className="text-[12px] font-mono text-[var(--foreground)] opacity-40 uppercase tracking-widest animate-pulse">
            ↓ Scroll down inside window
          </span>
        </div>

        {/* Scroll Reveal Block 1 */}
        <div className="my-[120px] flex items-center justify-center text-center">
          <ScrollReveal
            scrollContainerRef={scrollContainerRef}
            baseOpacity={0.06}
            enableBlur={true}
            baseRotation={3}
            blurStrength={6}
            scrollStart="top 85%"
            rotationEnd="top 35%"
            wordAnimationEnd="top 35%"
            containerClassName="text-xl sm:text-2xl md:text-3xl font-bold text-white max-w-lg text-center"
          >
            Crafting interfaces with motion is about rhythm, responsiveness, and tactile feedback.
          </ScrollReveal>
        </div>

        {/* Scroll Reveal Block 2 */}
        <div className="my-[140px] flex items-center justify-center text-center">
          <ScrollReveal
            scrollContainerRef={scrollContainerRef}
            baseOpacity={0.06}
            enableBlur={true}
            baseRotation={3}
            blurStrength={6}
            scrollStart="top 85%"
            rotationEnd="top 35%"
            wordAnimationEnd="top 35%"
            containerClassName="text-xl sm:text-2xl md:text-3xl font-bold text-white max-w-lg text-center"
          >
            Reveal every character with fluid motion as you explore deep into the document.
          </ScrollReveal>
        </div>

        {/* Scroll Reveal Block 3 */}
        <div className="my-[140px] flex items-center justify-center text-center">
          <ScrollReveal
            scrollContainerRef={scrollContainerRef}
            baseOpacity={0.06}
            enableBlur={true}
            baseRotation={3}
            blurStrength={6}
            scrollStart="top 85%"
            rotationEnd="top 35%"
            wordAnimationEnd="top 35%"
            containerClassName="text-xl sm:text-2xl md:text-3xl font-bold text-white max-w-lg text-center"
          >
            Built for developers who demand complete source code ownership and uncompromising design.
          </ScrollReveal>
        </div>

        {/* Bottom spacer */}
        <div className="h-[240px] flex flex-col items-center justify-center text-center">
          <span className="text-[12px] font-mono text-[var(--foreground)] opacity-30 uppercase tracking-widest">
            ↑ Scroll back up
          </span>
        </div>
      </div>
    </div>
  );
}
