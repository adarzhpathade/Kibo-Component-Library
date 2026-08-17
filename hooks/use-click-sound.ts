"use client";

import { useCallback, useRef } from "react";

export function useClickSound() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const play = useCallback(() => {
    try {
      // Initialize AudioContext on first interaction
      if (!audioCtxRef.current) {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return; // Browser doesn't support Web Audio API
        audioCtxRef.current = new AudioContext();
      }
      
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      // Sine wave works best for soft UI pops
      oscillator.type = "sine";
      
      // Sweep the frequency down quickly for a "pop" sound
      oscillator.frequency.setValueAtTime(600, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.05);
      
      // Sharp decay for the volume
      gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.05);
    } catch (e) {
      // Safely ignore errors if audio cannot be played
      console.warn("Audio playback failed", e);
    }
  }, []);

  return { play };
}
