"use client";

import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ShuffleProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  shuffleDirection?: 'left' | 'right' | 'up' | 'down';
  duration?: number;
  maxDelay?: number;
  ease?: string;
  threshold?: number;
  rootMargin?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  textAlign?: React.CSSProperties['textAlign'];
  onShuffleComplete?: () => void;
  shuffleTimes?: number;
  animationMode?: 'random' | 'evenodd';
  loop?: boolean;
  loopDelay?: number;
  stagger?: number;
  scrambleCharset?: string;
  colorFrom?: string;
  colorTo?: string;
  triggerOnce?: boolean;
  respectReducedMotion?: boolean;
  triggerOnHover?: boolean;
}

export function Shuffle({
  text,
  className = '',
  style = {},
  shuffleDirection = 'up',
  duration = 0.45,
  maxDelay = 0,
  ease = 'power3.out',
  threshold = 0.1,
  rootMargin = '-100px',
  tag = 'p',
  textAlign = 'center',
  onShuffleComplete,
  shuffleTimes = 4,
  animationMode = 'evenodd',
  loop = false,
  loopDelay = 0,
  stagger = 0.03,
  scrambleCharset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*',
  colorFrom,
  colorTo,
  triggerOnce = false,
  respectReducedMotion = true,
  triggerOnHover = true
}: ShuffleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const isPlayingRef = useRef(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const characters = useMemo(() => text.split(''), [text]);

  const isVertical = shuffleDirection === 'up' || shuffleDirection === 'down';

  const runAnimation = useCallback(() => {
    if (!containerRef.current) return;

    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    isPlayingRef.current = true;
    const strips = containerRef.current.querySelectorAll<HTMLElement>('.shuffle-strip');

    const tl = gsap.timeline({
      repeat: loop ? -1 : 0,
      repeatDelay: loop ? loopDelay : 0,
      onComplete: () => {
        isPlayingRef.current = false;
        onShuffleComplete?.();
      }
    });

    timelineRef.current = tl;

    strips.forEach((strip, index) => {
      const delay = animationMode === 'evenodd' 
        ? (index % 2) * stagger * 3 
        : maxDelay > 0 
          ? Math.random() * maxDelay 
          : index * stagger;

      let startPos = '0em';
      let targetPos = '0em';

      if (shuffleDirection === 'up') {
        startPos = '0em';
        targetPos = `${-shuffleTimes * 1.2}em`;
      } else if (shuffleDirection === 'down') {
        startPos = `${-shuffleTimes * 1.2}em`;
        targetPos = '0em';
      } else if (shuffleDirection === 'left') {
        startPos = '0ch';
        targetPos = `${-shuffleTimes * 1}ch`;
      } else if (shuffleDirection === 'right') {
        startPos = `${-shuffleTimes * 1}ch`;
        targetPos = '0ch';
      }

      tl.fromTo(
        strip,
        isVertical ? { y: startPos } : { x: startPos },
        {
          [isVertical ? 'y' : 'x']: targetPos,
          duration,
          ease,
          force3D: true
        },
        delay
      );

      if (colorFrom && colorTo) {
        tl.fromTo(
          strip,
          { color: colorFrom },
          { color: colorTo, duration, ease },
          delay
        );
      }
    });
  }, [shuffleDirection, isVertical, duration, maxDelay, ease, shuffleTimes, animationMode, loop, loopDelay, stagger, colorFrom, colorTo, onShuffleComplete]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (respectReducedMotion && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReady(true);
      return;
    }

    setReady(true);
    runAnimation();

    const handleMouseEnter = () => {
      if (triggerOnHover) {
        runAnimation();
      }
    };

    el.addEventListener('mouseenter', handleMouseEnter);
    return () => {
      el.removeEventListener('mouseenter', handleMouseEnter);
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [runAnimation, respectReducedMotion, triggerOnHover]);

  const Tag = tag as any;

  return (
    <Tag
      ref={containerRef}
      className={`inline-flex flex-wrap items-center justify-center overflow-hidden font-mono uppercase select-none cursor-pointer ${className}`}
      style={{ textAlign, ...style }}
    >
      {characters.map((char, i) => {
        if (char === ' ') {
          return <span key={i} className="inline-block w-[0.5ch]">&nbsp;</span>;
        }

        const rolls = Array.from({ length: shuffleTimes }, () =>
          scrambleCharset[Math.floor(Math.random() * scrambleCharset.length)]
        );

        const stripItems = (shuffleDirection === 'down' || shuffleDirection === 'right')
          ? [char, ...rolls]
          : [...rolls, char];

        return (
          <span
            key={i}
            className={`relative inline-block overflow-hidden h-[1.2em] leading-[1.2em] align-middle ${
              !isVertical ? 'w-[1ch]' : ''
            }`}
          >
            <span
              className={`shuffle-strip inline-flex ${
                isVertical ? 'flex-col' : 'flex-row'
              } will-change-transform`}
              style={{
                transform: isVertical
                  ? `translate3d(0, ${shuffleDirection === 'down' ? `${-shuffleTimes * 1.2}em` : '0em'}, 0)`
                  : `translate3d(${shuffleDirection === 'right' ? `${-shuffleTimes}ch` : '0ch'}, 0, 0)`
              }}
            >
              {stripItems.map((item, idx) => (
                <span
                  key={idx}
                  className={`h-[1.2em] leading-[1.2em] text-center inline-block ${
                    !isVertical ? 'w-[1ch]' : ''
                  }`}
                >
                  {item}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </Tag>
  );
}

export default Shuffle;
