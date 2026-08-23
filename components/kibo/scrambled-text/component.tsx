"use client";

import React, { useEffect, useRef, useMemo } from 'react';

export interface ScrambledTextProps {
  radius?: number;
  duration?: number;
  speed?: number;
  scrambleChars?: string;
  className?: string;
  style?: React.CSSProperties;
  children: string;
}

export function ScrambledText({
  radius = 100,
  duration = 1.2,
  speed = 0.5,
  scrambleChars = '.:!#@$%^&*()_+~|}{[]',
  className = '',
  style = {},
  children
}: ScrambledTextProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const charsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const originalChars = useMemo(() => children.split(''), [children]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const intervals = new Map<number, NodeJS.Timeout>();
    const timeouts = new Map<number, NodeJS.Timeout>();

    const handlePointerMove = (e: PointerEvent) => {
      charsRef.current.forEach((span, idx) => {
        if (!span) return;
        const rect = span.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);

        if (dist < radius && !intervals.has(idx)) {
          const origChar = originalChars[idx];
          if (origChar === ' ' || origChar === '\n') return;

          const intervalTime = Math.max(30, Math.floor(100 * speed));
          const intervalId = setInterval(() => {
            const randomChar = scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
            span.textContent = randomChar;
          }, intervalTime);

          intervals.set(idx, intervalId);

          const restoreDelay = (duration * 1000) * (1 - dist / radius);
          const timeoutId = setTimeout(() => {
            clearInterval(intervals.get(idx));
            intervals.delete(idx);
            span.textContent = origChar;
            timeouts.delete(idx);
          }, restoreDelay);

          timeouts.set(idx, timeoutId);
        }
      });
    };

    el.addEventListener('pointermove', handlePointerMove);

    return () => {
      el.removeEventListener('pointermove', handlePointerMove);
      intervals.forEach(id => clearInterval(id));
      timeouts.forEach(id => clearTimeout(id));
    };
  }, [radius, duration, speed, scrambleChars, originalChars]);

  return (
    <div
      ref={rootRef}
      className={`font-mono text-white select-none inline-block ${className}`}
      style={style}
    >
      <p className="flex flex-wrap">
        {originalChars.map((char, index) => (
          <span
            key={index}
            ref={el => { charsRef.current[index] = el; }}
            className="inline-block transition-colors will-change-transform"
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </p>
    </div>
  );
}

export default ScrambledText;
