import { ParticleText } from "./component";

export default function ParticleTextDemo() {
  return (
    <div className="relative flex h-full w-full w-full items-center justify-center bg-transparent px-4 overflow-hidden">
      <ParticleText
        text="PARTICLES"
        className="w-full h-full text-white"
      />
    </div>
  );
}
