"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { useInView } from "framer-motion";
import Text3DFlip from "@/components/ui/3d-stagger-flip";
import { textComponents, filters, Filter, TagKind, TextComponent } from "@/lib/data/text-animations";

/* ─── Dot separator ─────────────────────────────────────────────── */

function Dot({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block w-[4px] h-[4px] rounded-full bg-[var(--foreground)] opacity-40 mx-[10px] translate-y-[-1px] ${className}`}
    />
  );
}

/* ─── Tag badge row ─────────────────────────────────────────────── */

function TagRow({ tags }: { tags: TagKind[] }) {
  if (!tags || tags.length === 0) return null;
  
  return (
    <span className="flex items-center text-[12px] text-[var(--foreground)] opacity-30">
      <span>{tags[0]}</span>
    </span>
  );
}

/* ─── Video Preview Component ───────────────────────────────────── */

function HoverVideoPreview({ src, isHovered }: { src: string; isHovered: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "200px" });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isHovered) {
      video.currentTime = 0;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } else {
      video.pause();
      if (video.duration && !isNaN(video.duration) && isFinite(video.duration)) {
        video.currentTime = Math.min(video.duration * 0.35, 1);
      }
    }
  }, [isHovered]);

  const handleLoadedData = () => {
    const video = videoRef.current;
    if (video && !isHovered && video.duration && !isNaN(video.duration) && isFinite(video.duration)) {
      video.currentTime = Math.min(video.duration * 0.35, 1);
    }
  };

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden rounded-[7px]">
      <div className="absolute inset-0 bg-[#151314]" />
      {isInView && (
        <video
          ref={videoRef}
          src={src}
          onLoadedData={handleLoadedData}
          loop
          muted
          playsInline
          preload="auto"
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
            isHovered ? "opacity-100 scale-[1.02]" : "opacity-60 grayscale-[0.2]"
          }`}
        />
      )}
    </div>
  );
}

/* ─── Component card ────────────────────────────────────────────── */

function ComponentCard({ component, index }: { component: TextComponent; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const formattedIndex = String(index).padStart(3, '0');

  return (
    <Link
      href={`/docs/text-animations/${component.slug}`}
      target="_blank"
      className="group flex flex-col gap-[10px] cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Preview frame (black placeholder with video) */}
      <div className="w-full aspect-[16/10] rounded-[8px] bg-[#151314] border border-[var(--foreground)]/[0.06] transition-all duration-300 group-hover:border-[var(--foreground)]/[0.12] p-[1px]">
        <HoverVideoPreview src={component.previewVideo || `/preview/${component.slug}.webm`} isHovered={isHovered} />
      </div>

      <div className="flex items-center justify-between px-[4px]">
        <div className="flex flex-col gap-[2px]">
          {/* Name */}
          <h3 className="text-[15px] text-[var(--foreground)] opacity-90 leading-tight">
            {component.name}
            <sup className="text-[10px] font-mono opacity-40 ml-[4px]">({formattedIndex})</sup>
          </h3>

          {/* Tags */}
          <TagRow tags={component.tags} />
        </div>
        <div className="flex items-center gap-[6px]">
          <div className="w-[12px] h-[12px] rounded-full bg-[var(--foreground)] opacity-40 cursor-pointer transition-opacity hover:opacity-100" />
          <div className="w-[12px] h-[12px] rounded-full bg-[var(--accent)] opacity-80 cursor-pointer transition-opacity hover:opacity-100" />
        </div>
      </div>
    </Link>
  );
}

/* ─── Page ──────────────────────────────────────────────────────── */

export default function TextAnimationsPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredComponents = useMemo(() => {
    let filtered = textComponents;
    
    if (activeFilter !== "All") {
      filtered = filtered.filter((c) => c.tags.includes(activeFilter));
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((c) => c.name.toLowerCase().includes(query));
    }
    
    return filtered;
  }, [activeFilter, searchQuery]);

  return (
    <div className="min-h-screen px-[24px] sm:px-[32px] lg:px-[40px] pt-[100px] pb-[80px]">
      {/* ── Header ──────────────────────────────────────────────── */}
      <header className="max-w-full">
        <h1 className="text-[48px] sm:text-[56px] lg:text-[64px] font-normal leading-[1.05] tracking-[-0.02em] text-[var(--foreground)] opacity-90">
          Text Animations
        </h1>
        <p className="mt-[12px] text-[15px] sm:text-[16px] leading-[1.6] text-[var(--foreground)] opacity-40 max-w-[600px]">
          A collection of smooth, engaging text animations built with React and GSAP.
          <br /> Ready to copy, paste, and customize.
        </p>
      </header>

      {/* ── Filter bar ──────────────────────────────────────────── */}
      <div className="mt-[32px] sm:mt-[40px]">
        {/* Divider */}
        <div className="h-px w-full bg-[var(--foreground)] opacity-[0.12]" />

        <div className="flex items-center justify-between py-[16px]">
          {/* Category filters */}
          <div className="flex items-center">
            {filters.map((filter, i) => (
              <span key={filter} className="flex items-center">
                {i > 0 && <Dot className="mx-[12px]" />}
                <button
                  onClick={() => setActiveFilter(filter)}
                  className={`text-[14px] cursor-pointer transition-all duration-300 ${
                    activeFilter === filter
                      ? "text-[var(--accent)] font-medium"
                      : "text-[var(--foreground)] opacity-50 hover:opacity-100"
                  }`}
                >
                  <Text3DFlip 
                    text={filter} 
                    tag="span" 
                    staggerDuration={0.025} 
                    color="inherit" 
                    font={{ fontSize: "inherit", fontFamily: "inherit", fontWeight: "inherit", letterSpacing: "inherit", lineHeight: "inherit" }} 
                    style={{ width: "auto" }}
                    rotateDirection="bottom"
                  />
                </button>
              </span>
            ))}
          </div>

          {/* Search bar */}
          <div className={`group flex items-center transition-all duration-300 border-b pb-[4px] focus-within:border-[var(--accent)] focus-within:gap-[8px] ${
            searchQuery ? "gap-[8px] border-[var(--foreground)]/[0.12]" : "gap-0 border-transparent hover:border-[var(--foreground)]/[0.12]"
          }`}>
            <label htmlFor="search-input" className="cursor-pointer flex items-center">
              <span className="inline-block w-[4px] h-[4px] rounded-full bg-[var(--foreground)] opacity-40 mr-[8px] translate-y-[-1px] transition-colors duration-300 group-focus-within:bg-[var(--accent)] group-focus-within:opacity-100" />
              <span className="text-[14px] text-[var(--foreground)] opacity-50 transition-all duration-300 group-focus-within:text-[var(--accent)] group-focus-within:font-medium group-focus-within:opacity-100 hover:opacity-100">
                <Text3DFlip 
                  text="Search" 
                  tag="span" 
                  staggerDuration={0.025} 
                  color="inherit" 
                  font={{ fontSize: "inherit", fontFamily: "inherit", fontWeight: "inherit", letterSpacing: "inherit", lineHeight: "inherit" }} 
                  style={{ width: "auto" }}
                  rotateDirection="bottom"
                />
              </span>
            </label>
            <input
              id="search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`bg-transparent border-none outline-none text-[14px] text-[var(--foreground)] transition-all duration-300 focus:w-[160px] focus:opacity-100 ${
                searchQuery ? "w-[160px] opacity-100" : "w-0 opacity-0"
              }`}
            />
          </div>
        </div>
      </div>

      {/* ── Components ──────────────────────────────────────────── */}
      <div className="mt-[24px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-[24px] gap-y-[40px]">
        {filteredComponents.map((component) => {
          const absoluteIndex = textComponents.findIndex(c => c.slug === component.slug) + 1;
          return <ComponentCard key={component.slug} component={component} index={absoluteIndex} />;
        })}
      </div>
    </div>
  );
}
