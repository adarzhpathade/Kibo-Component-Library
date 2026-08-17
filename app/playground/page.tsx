import BlurTextDemo from "@/components/kibo/blur-text/demo";
import ShinyTextDemo from "@/components/kibo/shiny-text/demo";
import SplitTextDemo from "@/components/kibo/split-text/demo";
import TextPressureDemo from "@/components/kibo/text-pressure/demo";
import TextLoopDemo from "@/components/kibo/text-loop/demo";

export default function PlaygroundPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto space-y-16">
        <div>
          <h1 className="text-4xl font-bold mb-4">Text Effects Playground</h1>
          <p className="text-neutral-400">Previewing the first batch of 5 ported React Bits text components.</p>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-neutral-200">1. BlurText</h2>
          <div className="rounded-xl overflow-hidden border border-neutral-800">
            <BlurTextDemo />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-neutral-200">2. ShinyText</h2>
          <div className="rounded-xl overflow-hidden border border-neutral-800">
            <ShinyTextDemo />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-neutral-200">3. SplitText</h2>
          <div className="rounded-xl overflow-hidden border border-neutral-800">
            <SplitTextDemo />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-neutral-200">4. TextPressure</h2>
          <div className="rounded-xl overflow-hidden border border-neutral-800">
            <TextPressureDemo />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-neutral-200">5. TextLoop</h2>
          <div className="rounded-xl overflow-hidden border border-neutral-800">
            <TextLoopDemo />
          </div>
        </section>
      </div>
    </div>
  );
}
