import React from "react";

export default function IntroductionPage() {
  return (
    <div className="min-h-screen px-[24px] sm:px-[32px] lg:px-[40px] pt-[100px] pb-[80px]">
      {/* ── Header ──────────────────────────────────────────────── */}
      <header className="max-w-full">
        <h1 className="text-[48px] sm:text-[56px] lg:text-[64px] font-normal leading-[1.05] tracking-[-0.02em] text-[var(--foreground)] opacity-90">
          Introduction
        </h1>
        <p className="mt-[12px] text-[15px] sm:text-[16px] leading-[1.6] text-[var(--foreground)] opacity-40">
          Kibo UI — A modern, motion-focused React component library built for developer ownership.
        </p>
      </header>

      {/* ── Divider ──────────────────────────────────────────── */}
      <div className="mt-[32px] sm:mt-[40px]">
        <div className="h-px w-full bg-[var(--foreground)] opacity-[0.12]" />
      </div>

      {/* ── Content ──────────────────────────────────────────── */}
      <div className="mt-[48px] w-full flex flex-col gap-[32px]">
        {/* Intro Text */}
        <section className="flex flex-col gap-[16px] text-[15px] sm:text-[16px] leading-[1.6] text-[var(--foreground)] opacity-70">
          <p>
            Kibo UI is not just another component library. It is a collection of meticulously crafted, animation-heavy, premium React components designed to elevate your application's user experience.
          </p>
          <p>
            Instead of hiding behind opaque npm packages, Kibo distributes its components via source code. When you add a Kibo component, the actual source code is injected directly into your project. You own the code, you customize the styles, and you control the behavior.
          </p>
        </section>

        {/* Core Principles */}
        <section>
          <h2 className="text-[24px] sm:text-[28px] font-medium leading-[1.2] mb-[16px] text-[var(--foreground)] opacity-90 tracking-[-0.01em]">
            Core Principles
          </h2>
          <div className="flex flex-col gap-[16px] text-[15px] sm:text-[16px] leading-[1.6] text-[var(--foreground)] opacity-70">
            <p>
              To ensure the highest quality experience for both developers and end-users, Kibo is built on these foundational pillars:
            </p>
            
            <ul className="flex flex-col gap-[16px] pl-[16px] mt-[4px]">
              <li className="relative before:content-[''] before:absolute before:left-[-16px] before:top-[10px] before:w-[4px] before:h-[4px] before:bg-[var(--accent)] before:rounded-full">
                <strong className="text-[var(--accent)] font-medium">Developer Ownership:</strong> Components are installed directly into your source code via our CLI. No hidden abstraction layers. No untyped props. You have full visibility and control over what runs in your app.
              </li>
              <li className="relative before:content-[''] before:absolute before:left-[-16px] before:top-[10px] before:w-[4px] before:h-[4px] before:bg-[var(--accent)] before:rounded-full">
                <strong className="text-[var(--accent)] font-medium">Motion-First:</strong> Built-in, high-performance, frame-perfect animations powered by GSAP and Framer Motion. Motion is not an afterthought; it is fundamental to how Kibo components feel.
              </li>
              <li className="relative before:content-[''] before:absolute before:left-[-16px] before:top-[10px] before:w-[4px] before:h-[4px] before:bg-[var(--accent)] before:rounded-full">
                <strong className="text-[var(--accent)] font-medium">Premium Aesthetics:</strong> Every component is designed with painstaking attention to detail, utilizing a strict, sophisticated design system that stands out from generic defaults.
              </li>
              <li className="relative before:content-[''] before:absolute before:left-[-16px] before:top-[10px] before:w-[4px] before:h-[4px] before:bg-[var(--accent)] before:rounded-full">
                <strong className="text-[var(--accent)] font-medium">Accessible:</strong> Built with semantic HTML, keyboard navigation, and ARIA attributes in mind. Animations also respect <code className="text-[14px] bg-[var(--accent)]/[0.1] text-[var(--accent)] px-[4px] py-[2px] rounded-[4px]">prefers-reduced-motion</code> automatically.
              </li>
              <li className="relative before:content-[''] before:absolute before:left-[-16px] before:top-[10px] before:w-[4px] before:h-[4px] before:bg-[var(--accent)] before:rounded-full">
                <strong className="text-[var(--accent)] font-medium">Fully Typed:</strong> Written entirely in TypeScript for an excellent developer experience, auto-completion, and peace of mind.
              </li>
            </ul>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="mt-[16px]">
          <h2 className="text-[24px] sm:text-[28px] font-medium leading-[1.2] mb-[16px] text-[var(--foreground)] opacity-90 tracking-[-0.01em]">
            Tech Stack
          </h2>
          <div className="flex flex-col gap-[16px] text-[15px] sm:text-[16px] leading-[1.6] text-[var(--foreground)] opacity-70">
            <p>
              Kibo UI components are designed to drop seamlessly into modern React ecosystems. They rely on the following stack:
            </p>
            
            <ul className="flex flex-col gap-[12px] pl-[16px] mt-[4px]">
              <li className="relative before:content-[''] before:absolute before:left-[-16px] before:top-[10px] before:w-[4px] before:h-[4px] before:bg-[var(--accent)] before:rounded-full">
                <strong className="text-[var(--accent)] font-medium">Framework:</strong> React 18+ (Next.js is highly recommended)
              </li>
              <li className="relative before:content-[''] before:absolute before:left-[-16px] before:top-[10px] before:w-[4px] before:h-[4px] before:bg-[var(--accent)] before:rounded-full">
                <strong className="text-[var(--accent)] font-medium">Styling:</strong> Tailwind CSS for effortless utility-based customization
              </li>
              <li className="relative before:content-[''] before:absolute before:left-[-16px] before:top-[10px] before:w-[4px] before:h-[4px] before:bg-[var(--accent)] before:rounded-full">
                <strong className="text-[var(--accent)] font-medium">Animation:</strong> GSAP and Framer Motion for handling complex physics and timeline sequences
              </li>
              <li className="relative before:content-[''] before:absolute before:left-[-16px] before:top-[10px] before:w-[4px] before:h-[4px] before:bg-[var(--accent)] before:rounded-full">
                <strong className="text-[var(--accent)] font-medium">Icons:</strong> Lucide React
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
