"use client";

import React, { useEffect, useMemo, useRef, type ReactNode, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollFloatProps {
  children: ReactNode;
  scrollContainerRef?: RefObject<HTMLElement | null>;
  containerClassName?: string;
  textClassName?: string;
  animationDuration?: number;
  ease?: string;
  scrollStart?: string;
  scrollEnd?: string;
  stagger?: number;
  triggerOnHover?: boolean;
}

export const ScrollFloat: React.FC<ScrollFloatProps> = ({
  children,
  scrollContainerRef,
  containerClassName = '',
  textClassName = '',
  animationDuration = 0.8,
  ease = 'back.out(2)',
  scrollStart = 'top bottom+=40%',
  scrollEnd = 'bottom bottom-=40%',
  stagger = 0.025,
  triggerOnHover = true
}) => {
  const containerRef = useRef<HTMLHeadingElement>(null);

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    return text.split('').map((char, index) => (
      <span className="inline-block char-item will-change-transform" key={index}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const charElements = el.querySelectorAll<HTMLElement>('.char-item');
    if (!charElements.length) return;

    const playFloat = () => {
      gsap.fromTo(
        charElements,
        {
          opacity: 0,
          yPercent: 120,
          scaleY: 2.2,
          scaleX: 0.75,
          transformOrigin: '50% 0%'
        },
        {
          duration: animationDuration,
          ease: ease,
          opacity: 1,
          yPercent: 0,
          scaleY: 1,
          scaleX: 1,
          stagger: stagger,
          force3D: true
        }
      );
    };

    const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;

    const st = ScrollTrigger.create({
      trigger: el,
      scroller,
      start: scrollStart,
      end: scrollEnd,
      scrub: true,
      animation: gsap.fromTo(
        charElements,
        {
          opacity: 0,
          yPercent: 120,
          scaleY: 2.2,
          scaleX: 0.75,
          transformOrigin: '50% 0%'
        },
        {
          duration: animationDuration,
          ease: ease,
          opacity: 1,
          yPercent: 0,
          scaleY: 1,
          scaleX: 1,
          stagger: stagger
        }
      )
    });

    playFloat();

    const handleMouseEnter = () => {
      if (triggerOnHover) {
        playFloat();
      }
    };

    el.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      st.kill();
      el.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [scrollContainerRef, animationDuration, ease, scrollStart, scrollEnd, stagger, triggerOnHover]);

  return (
    <h2 ref={containerRef} className={`overflow-hidden cursor-pointer ${containerClassName}`}>
      <span className={`inline-block leading-[1.4] ${textClassName}`}>{splitText}</span>
    </h2>
  );
};

export default ScrollFloat;