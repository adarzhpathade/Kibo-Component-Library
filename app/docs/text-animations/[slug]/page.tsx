"use client";

import { notFound } from "next/navigation";
import { use, Suspense, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Check, Copy, RotateCw, Maximize2, Minimize2 } from "lucide-react";
import { textComponents } from "@/lib/data/text-animations";
import { componentDocs } from "@/lib/data/component-docs";
import { CodeHighlighter } from "@/components/ui/code-highlighter";

/* ─── Component map for dynamic imports ────────────────────────── */

const demoMap: Record<string, React.ComponentType> = {
  "blur-text": dynamic(() => import("@/components/kibo/blur-text/demo")),
  "shiny-text": dynamic(() => import("@/components/kibo/shiny-text/demo")),
  "split-text": dynamic(() => import("@/components/kibo/split-text/demo")),
  "text-pressure": dynamic(() => import("@/components/kibo/text-pressure/demo")),
  "text-loop": dynamic(() => import("@/components/kibo/text-loop/demo")),
  "ascii-text": dynamic(() => import("@/components/kibo/ascii-text/demo")),
  "circular-text": dynamic(() => import("@/components/kibo/circular-text/demo")),
  "count-up": dynamic(() => import("@/components/kibo/count-up/demo")),
  "curved-loop": dynamic(() => import("@/components/kibo/curved-loop/demo")),
  "decrypted-text": dynamic(() => import("@/components/kibo/decrypted-text/demo")),
  "depth-text": dynamic(() => import("@/components/kibo/depth-text/demo")),
  "echo-text": dynamic(() => import("@/components/kibo/echo-text/demo")),
  "falling-text": dynamic(() => import("@/components/kibo/falling-text/demo")),
  "fold-text": dynamic(() => import("@/components/kibo/fold-text/demo")),
  "fuzzy-text": dynamic(() => import("@/components/kibo/fuzzy-text/demo")),
  "glitch-text": dynamic(() => import("@/components/kibo/glitch-text/demo")),
  "gradient-text": dynamic(() => import("@/components/kibo/gradient-text/demo")),
  "masked-heading": dynamic(() => import("@/components/kibo/masked-heading/demo")),
  "particle-text": dynamic(() => import("@/components/kibo/particle-text/demo")),
  "rotating-text": dynamic(() => import("@/components/kibo/rotating-text/demo")),
  "scrambled-text": dynamic(() => import("@/components/kibo/scrambled-text/demo")),
  "scroll-float": dynamic(() => import("@/components/kibo/scroll-float/demo")),
  "scroll-reveal": dynamic(() => import("@/components/kibo/scroll-reveal/demo")),
  "scroll-velocity": dynamic(() => import("@/components/kibo/scroll-velocity/demo")),
  "shuffle": dynamic(() => import("@/components/kibo/shuffle/demo")),
  "split-flap-text": dynamic(() => import("@/components/kibo/split-flap-text/demo")),
  "stroke-text": dynamic(() => import("@/components/kibo/stroke-text/demo")),
  "text-cursor": dynamic(() => import("@/components/kibo/text-cursor/demo")),
  "text-type": dynamic(() => import("@/components/kibo/text-type/demo")),
  "true-focus": dynamic(() => import("@/components/kibo/true-focus/demo")),
  "variable-proximity": dynamic(() => import("@/components/kibo/variable-proximity/demo")),
  "warp-text": dynamic(() => import("@/components/kibo/warp-text/demo")),
};

type PkgManager = "cli" | "npm" | "pnpm" | "yarn" | "bun";
type CodeLang = "ts" | "js";
type CodeTab = "usage" | "component";

/* ─── Page ─────────────────────────────────────────────────────── */

export default function ComponentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const component = textComponents.find((c) => c.slug === slug);
  const doc = componentDocs[slug];

  const [activePkg, setActivePkg] = useState<PkgManager>("cli");
  const [lang, setLang] = useState<CodeLang>("ts");
  const [codeTab, setCodeTab] = useState<CodeTab>("usage");
  const [copiedInstall, setCopiedInstall] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  if (!component) {
    notFound();
  }

  const index = textComponents.findIndex((c) => c.slug === slug) + 1;
  const formattedIndex = String(index).padStart(3, "0");

  const DemoComponent = demoMap[slug];

  const installCommand =
    activePkg === "cli"
      ? lang === "ts"
        ? doc?.installation.cliTs || `npx kibo add ${slug}`
        : doc?.installation.cliJs || `npx kibo add ${slug} --js`
      : doc?.installation[activePkg] || `npm i ${slug}`;

  const displayedCode =
    codeTab === "usage"
      ? lang === "ts"
        ? doc?.usageTs || `import { ${component.name.replace(/\s+/g, "")} } from "@/components/kibo/${slug}/component";`
        : doc?.usageJs || `import { ${component.name.replace(/\s+/g, "")} } from "@/components/kibo/${slug}/component";`
      : lang === "ts"
        ? doc?.componentSourceTs || ""
        : doc?.componentSourceJs || "";

  const copyToClipboard = (text: string, type: "install" | "code") => {
    navigator.clipboard.writeText(text);
    if (type === "install") {
      setCopiedInstall(true);
      setTimeout(() => setCopiedInstall(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="min-h-screen px-[24px] sm:px-[32px] lg:px-[40px] pt-[100px] pb-[80px]">
      {/* ── 1. Header ─────────────────────────────────────────── */}
      <header className="max-w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-[48px] sm:text-[56px] lg:text-[64px] font-normal leading-[1.05] tracking-[-0.02em] text-[var(--foreground)] opacity-90">
            {component.name}
            <sup className="text-[14px] sm:text-[18px] font-mono opacity-40 ml-[8px]">
              ({formattedIndex})
            </sup>
          </h1>

          {/* Header indicator dots */}
          <div className="flex items-center gap-[6px]">
            <div
              className="w-[12px] h-[12px] rounded-full bg-[var(--foreground)] opacity-40 cursor-pointer transition-opacity hover:opacity-100"
              title="Toggle theme"
            />
            <div
              className="w-[12px] h-[12px] rounded-full bg-[var(--accent)] opacity-80 cursor-pointer transition-opacity hover:opacity-100"
              title="Kibo accent"
            />
          </div>
        </div>

        {/* Description */}
        <p className="mt-[12px] text-[15px] sm:text-[16px] leading-[1.6] text-[var(--foreground)] opacity-40 max-w-[640px]">
          {component.description}
        </p>

        {/* Tags & Dependencies Row */}
        <div className="flex items-center gap-[12px] flex-wrap mt-[16px] text-[13px] text-[var(--foreground)] opacity-40">
          <div className="flex items-center">
            {component.tags.map((tag, i) => (
              <span key={tag} className="flex items-center">
                {i > 0 && (
                  <span className="inline-block w-[4px] h-[4px] rounded-full bg-[var(--foreground)] opacity-40 mx-[10px] translate-y-[-1px]" />
                )}
                <span>{tag}</span>
              </span>
            ))}
          </div>

          {doc && doc.dependencies && Object.keys(doc.dependencies).length > 0 && (
            <>
              <span className="inline-block w-[4px] h-[4px] rounded-full bg-[var(--foreground)] opacity-40 mx-[2px] translate-y-[-1px]" />
              <div className="flex items-center gap-[6px] flex-wrap">
                <span className="text-[11px] font-mono opacity-70">Requires:</span>
                {Object.keys(doc.dependencies).map((dep) => (
                  <span
                    key={dep}
                    className="px-2 py-0.5 text-[11px] font-mono rounded bg-white/[0.04] border border-white/[0.08] text-white/80"
                  >
                    {dep}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </header>

      {/* ── 2. Preview Frame ───────────────────────────────────── */}
      <div className="w-full aspect-[16/10] rounded-[8px] bg-[#151314] border border-[var(--foreground)]/[0.06] mt-[32px] relative overflow-hidden">
        {/* Demo Viewport */}
        <div className="w-full h-full flex items-center justify-center [&>*]:w-full [&>*]:h-full">
          {DemoComponent ? (
            <Suspense
              fallback={
                <span className="text-[var(--foreground)] opacity-30 text-[14px]">
                  Loading…
                </span>
              }
            >
              <DemoComponent key={replayKey} />
            </Suspense>
          ) : (
            <span className="text-[var(--foreground)] opacity-20 text-[14px]">
              Preview unavailable
            </span>
          )}
        </div>

        {/* Overlay Action Buttons: Replay & Fullscreen */}
        <div className="absolute bottom-3.5 right-3.5 z-20 flex items-center gap-1.5 p-1 rounded-[6px] bg-[#201d1d]/80 backdrop-blur-md border border-[var(--foreground)]/[0.1] shadow-lg pointer-events-auto">
          <button
            onClick={() => setReplayKey((k) => k + 1)}
            className="p-1.5 rounded-[4px] text-white/60 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer group"
            title="Replay animation"
            aria-label="Replay animation"
          >
            <RotateCw className="w-4 h-4 transition-transform group-hover:rotate-180 duration-500" />
          </button>
          <button
            onClick={() => setIsFullscreen(true)}
            className="p-1.5 rounded-[4px] text-white/60 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer"
            title="Full screen preview"
            aria-label="Full screen preview"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Fullscreen Overlay Modal ──────────────────────────── */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-[#201d1d] flex flex-col justify-between p-6 sm:p-10 animate-in fade-in duration-200">
          {/* Top Bar */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <span className="text-[16px] font-normal text-[var(--foreground)] opacity-90">
                {component.name}
              </span>
              <span className="text-[12px] font-mono text-[var(--foreground)] opacity-30">
                ({formattedIndex})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setReplayKey((k) => k + 1)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-mono text-white/70 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] rounded-[6px] border border-white/[0.08] transition-all cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Replay</span>
              </button>
              <button
                onClick={() => setIsFullscreen(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-mono text-white/70 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] rounded-[6px] border border-white/[0.08] transition-all cursor-pointer"
                title="Exit fullscreen (Esc)"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Exit (Esc)</span>
              </button>
            </div>
          </div>

          {/* Main Interactive Demo Container */}
          <div className="flex-1 flex items-center justify-center w-full max-w-6xl mx-auto [&>*]:w-full [&>*]:h-full my-6">
            {DemoComponent && <DemoComponent key={`fs-${replayKey}`} />}
          </div>

          {/* Bottom Keyboard Hint */}
          <div className="text-center text-[12px] font-mono text-[var(--foreground)] opacity-30">
            Press Esc to exit full screen
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="h-px w-full bg-[var(--foreground)] opacity-[0.12] my-[48px]" />

      {/* ── 3. Documentation Sections ─────────────────────────── */}
      <div className="flex flex-col gap-[48px] max-w-full">
        {/* 3.1 Installation */}
        <section className="flex flex-col gap-[16px]">
          <h2 className="text-[24px] sm:text-[28px] font-normal leading-[1.2] tracking-[-0.01em] text-[var(--foreground)] opacity-90">
            Installation
          </h2>

          <div className="rounded-[8px] border border-white/[0.08] bg-[#151314] overflow-hidden shadow-lg">
            {/* Package Manager Selector Header Bar */}
            <div className="flex items-center justify-between flex-wrap gap-2 bg-[#1a1718]/80 border-b border-white/[0.06] px-4 py-2.5">
              <div className="flex items-center rounded-[6px] bg-white/[0.04] p-0.5 border border-white/[0.06]">
                {(["cli", "npm", "pnpm", "yarn", "bun"] as PkgManager[]).map((pkg) => (
                  <button
                    key={pkg}
                    onClick={() => setActivePkg(pkg)}
                    className={`px-3 py-1 text-[12px] font-mono rounded-[4px] transition-all cursor-pointer ${
                      activePkg === pkg
                        ? "bg-white/[0.12] text-white font-medium shadow-sm"
                        : "text-white/40 hover:text-white/80"
                    }`}
                  >
                    {pkg === "cli" ? "kibo cli" : pkg}
                  </button>
                ))}
              </div>

              {/* Copy Command Button */}
              <button
                onClick={() => copyToClipboard(installCommand, "install")}
                className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono text-white/60 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] rounded-[5px] border border-white/[0.06] transition-all cursor-pointer"
                title="Copy command"
              >
                {copiedInstall ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Command Line Body */}
            <div className="p-4 overflow-x-auto font-mono text-[13px] text-white/90 flex items-center gap-2">
              <span className="text-white/30 select-none">$</span>
              <span>
                <span className="text-[var(--accent)] font-semibold">{installCommand.split(" ")[0]}</span>{" "}
                <span className="text-white/90">{installCommand.split(" ").slice(1).join(" ")}</span>
              </span>
            </div>
          </div>
        </section>

        {/* 3.2 Usage & Component Code */}
        <section className="flex flex-col gap-[16px]">
          <h2 className="text-[24px] sm:text-[28px] font-normal leading-[1.2] tracking-[-0.01em] text-[var(--foreground)] opacity-90">
            Usage
          </h2>

          {/* Unified Code Card with Integrated Header Bar */}
          <div className="rounded-[8px] border border-white/[0.08] bg-[#151314] overflow-hidden shadow-lg">
            {/* Integrated Top Bar */}
            <div className="flex items-center justify-between flex-wrap gap-2 bg-[#1a1718]/80 border-b border-white/[0.06] px-4 py-2.5">
              {/* Left Side: Usage vs Component Source Tabs */}
              <div className="flex items-center rounded-[6px] bg-white/[0.04] p-0.5 border border-white/[0.06]">
                <button
                  onClick={() => setCodeTab("usage")}
                  className={`px-3 py-1 text-[12px] font-mono rounded-[4px] transition-all cursor-pointer ${
                    codeTab === "usage"
                      ? "bg-white/[0.12] text-white font-medium shadow-sm"
                      : "text-white/40 hover:text-white/80"
                  }`}
                >
                  Usage
                </button>
                <button
                  onClick={() => setCodeTab("component")}
                  className={`px-3 py-1 text-[12px] font-mono rounded-[4px] transition-all cursor-pointer ${
                    codeTab === "component"
                      ? "bg-white/[0.12] text-white font-medium shadow-sm"
                      : "text-white/40 hover:text-white/80"
                  }`}
                >
                  Component Code
                </button>
              </div>

              {/* Right Side: Language Toggle + Copy Button */}
              <div className="flex items-center gap-2">
                {/* Language Switcher: TS + TW / JS + TW */}
                <div className="flex items-center rounded-[6px] bg-white/[0.04] p-0.5 border border-white/[0.06]">
                  <button
                    onClick={() => setLang("ts")}
                    className={`px-2.5 py-1 text-[11px] font-mono rounded-[4px] transition-all cursor-pointer ${
                      lang === "ts"
                        ? "bg-[var(--accent)] text-black font-semibold shadow-sm"
                        : "text-white/40 hover:text-white/80"
                    }`}
                  >
                    TS + TW
                  </button>
                  <button
                    onClick={() => setLang("js")}
                    className={`px-2.5 py-1 text-[11px] font-mono rounded-[4px] transition-all cursor-pointer ${
                      lang === "js"
                        ? "bg-[var(--accent)] text-black font-semibold shadow-sm"
                        : "text-white/40 hover:text-white/80"
                    }`}
                  >
                    JS + TW
                  </button>
                </div>

                {/* Copy Code Button */}
                <button
                  onClick={() => copyToClipboard(displayedCode, "code")}
                  className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono text-white/60 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] rounded-[5px] border border-white/[0.06] transition-all cursor-pointer"
                  title="Copy code"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Code Body */}
            <div className="p-4 h-[360px] overflow-auto [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.2)_transparent] [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar]:h-[4px] [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">
              <CodeHighlighter code={displayedCode} />
            </div>
          </div>
        </section>

        {/* 3.3 Props Reference Table */}
        <section className="flex flex-col gap-[16px]">
          <h2 className="text-[24px] sm:text-[28px] font-normal leading-[1.2] tracking-[-0.01em] text-[var(--foreground)] opacity-90">
            Props Reference
          </h2>

          {doc && doc.props && doc.props.length > 0 ? (
            <div className="rounded-[8px] border border-white/[0.08] bg-[#151314] overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#1a1718]/80 border-b border-white/[0.06]">
                      <th className="py-3 px-4 text-[11px] font-mono font-medium text-white/50 uppercase tracking-wider">
                        Prop
                      </th>
                      <th className="py-3 px-4 text-[11px] font-mono font-medium text-white/50 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="py-3 px-4 text-[11px] font-mono font-medium text-white/50 uppercase tracking-wider">
                        Default
                      </th>
                      <th className="py-3 px-4 text-[11px] font-mono font-medium text-white/50 uppercase tracking-wider">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {doc.props.map((p) => (
                      <tr key={p.name} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4 align-top">
                          <code className="text-[12px] font-mono text-[var(--accent)] font-medium">
                            {p.name}
                          </code>
                        </td>
                        <td className="py-3.5 px-4 align-top">
                          <code className="text-[12px] font-mono text-white/70 break-all bg-white/[0.03] px-1.5 py-0.5 rounded border border-white/[0.06]">
                            {p.type}
                          </code>
                        </td>
                        <td className="py-3.5 px-4 align-top">
                          <span className="text-[12px] font-mono text-white/40">
                            {p.default || "-"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 align-top text-[13px] text-white/70 leading-relaxed min-w-[240px]">
                          {p.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="rounded-[8px] border border-white/[0.08] bg-[#151314] p-6 text-center text-white/40 text-[14px]">
              No configuration props required for this component.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
