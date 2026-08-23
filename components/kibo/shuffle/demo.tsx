import { Shuffle } from "./component";

export default function ShuffleDemo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-transparent px-4">
      <Shuffle
        text="SHUFFLE TEXT"
        shuffleDirection="up"
        shuffleTimes={5}
        duration={0.45}
        stagger={0.03}
        className="text-3xl sm:text-4xl md:text-5xl font-mono font-black text-white text-center tracking-wider"
      />
    </div>
  );
}
