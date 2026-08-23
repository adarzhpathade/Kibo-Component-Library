import { ScrollVelocity } from "./component";

export default function ScrollVelocityDemo() {
  return (
    <div className="flex h-full w-full w-full flex-col justify-center bg-transparent px-4 overflow-hidden gap-4">
      <ScrollVelocity
        texts={['KIBO COMPONENT LIBRARY', 'NEXT.JS & TAILWIND']}
        velocity={80}
        className="text-2xl sm:text-3xl font-black text-white"
      />
    </div>
  );
}
