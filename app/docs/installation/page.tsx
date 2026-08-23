import React from "react";

export default function InstallationPage() {
  return (
    <div className="min-h-screen px-[24px] sm:px-[32px] lg:px-[40px] pt-[100px] pb-[80px]">
      {/* ── Header ──────────────────────────────────────────────── */}
      <header className="max-w-full">
        <h1 className="text-[48px] sm:text-[56px] lg:text-[64px] font-normal leading-[1.05] tracking-[-0.02em] text-[var(--foreground)] opacity-90">
          Installation
        </h1>
        <p className="mt-[12px] text-[15px] sm:text-[16px] leading-[1.6] text-[var(--foreground)] opacity-40">
          How to install and use Kibo UI components in your project.
        </p>
      </header>

      {/* ── Divider ──────────────────────────────────────────── */}
      <div className="mt-[32px] sm:mt-[40px]">
        <div className="h-px w-full bg-[var(--foreground)] opacity-[0.12]" />
      </div>

      {/* ── Content ──────────────────────────────────────────── */}
      <div className="mt-[48px] w-full flex flex-col gap-[48px]">
        
        {/* Prerequisites */}
        <section>
          <h2 className="text-[24px] sm:text-[28px] font-medium leading-[1.2] mb-[16px] text-[var(--foreground)] opacity-90 tracking-[-0.01em]">
            Prerequisites
          </h2>
          <div className="flex flex-col gap-[16px] text-[15px] sm:text-[16px] leading-[1.6] text-[var(--foreground)] opacity-70">
            <p>
              To use Kibo UI components, you need a React framework initialized with Tailwind CSS. We highly recommend using <strong className="text-[var(--accent)] font-medium">Next.js</strong> (App Router).
            </p>
          </div>
        </section>

        {/* Step 1 */}
        <section>
          <h2 className="text-[24px] sm:text-[28px] font-medium leading-[1.2] mb-[16px] text-[var(--foreground)] opacity-90 tracking-[-0.01em]">
            1. Initialize Kibo
          </h2>
          <div className="flex flex-col gap-[16px] text-[15px] sm:text-[16px] leading-[1.6] text-[var(--foreground)] opacity-70">
            <p>
              Run the Kibo initialization command in your project root to set up the registry, design tokens, and base utilities:
            </p>
            <pre className="bg-[var(--foreground)]/[0.03] border border-[var(--foreground)]/[0.08] rounded-[8px] p-[16px] overflow-x-auto text-[14px] font-mono text-[var(--foreground)] opacity-90">
              <code>npx kibo init</code>
            </pre>
          </div>
        </section>

        {/* Step 2 */}
        <section>
          <h2 className="text-[24px] sm:text-[28px] font-medium leading-[1.2] mb-[16px] text-[var(--foreground)] opacity-90 tracking-[-0.01em]">
            2. Add Components
          </h2>
          <div className="flex flex-col gap-[16px] text-[15px] sm:text-[16px] leading-[1.6] text-[var(--foreground)] opacity-70">
            <p>
              Browse our component registry and install exactly what you need. 
              The actual source code will be downloaded directly into your project.
            </p>
            <pre className="bg-[var(--foreground)]/[0.03] border border-[var(--foreground)]/[0.08] rounded-[8px] p-[16px] overflow-x-auto text-[14px] font-mono text-[var(--foreground)] opacity-90">
              <code>npx kibo add text-3d-flip{"\n"}npx kibo add letter-3d-swap</code>
            </pre>
          </div>
        </section>

        {/* Step 3 */}
        <section>
          <h2 className="text-[24px] sm:text-[28px] font-medium leading-[1.2] mb-[16px] text-[var(--foreground)] opacity-90 tracking-[-0.01em]">
            3. Use the Component
          </h2>
          <div className="flex flex-col gap-[16px] text-[15px] sm:text-[16px] leading-[1.6] text-[var(--foreground)] opacity-70">
            <p>
              Once added, the component is instantly available in your <code className="text-[14px] bg-[var(--accent)]/[0.1] text-[var(--accent)] px-[4px] py-[2px] rounded-[4px]">components/ui</code> directory. You can import and use it like any other React component:
            </p>
            <pre className="bg-[var(--foreground)]/[0.03] border border-[var(--foreground)]/[0.08] rounded-[8px] p-[16px] overflow-x-auto text-[14px] font-mono text-[var(--foreground)] opacity-90">
              <code>{`import { Text3DFlip } from "@/components/ui/text-3d-flip"

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Text3DFlip text="Kibo UI" />
    </div>
  )
}`}</code>
            </pre>
          </div>
        </section>

      </div>
    </div>
  );
}
