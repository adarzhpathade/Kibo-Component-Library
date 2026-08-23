import { RotatingText } from "./component";

export default function RotatingTextDemo() {
  return (
    <div className="flex h-full w-full w-full items-center justify-center bg-transparent px-4">
      <div className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-white">
        <span>Ship</span>
        <RotatingText
          texts={['Modern', 'Performant', 'Accessible', 'Stunning']}
          mainClassName="px-2.5 py-0.5 bg-red-600/20 text-red-400 rounded-lg border border-red-500/30 overflow-hidden"
          staggerDuration={0.03}
        />
        <span>Interfaces</span>
      </div>
    </div>
  );
}
