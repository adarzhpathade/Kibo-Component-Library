import { useRef } from "react";
import { VariableProximity } from "./component";

export default function VariableProximityDemo() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="flex h-full w-full items-center justify-center bg-transparent px-6 text-center cursor-default"
    >
      <VariableProximity
        label="Hover near these dynamic letters"
        fromFontVariationSettings="'wght' 100, 'opsz' 12"
        toFontVariationSettings="'wght' 900, 'opsz' 48"
        containerRef={containerRef}
        radius={160}
        falloff="gaussian"
        className="text-2xl sm:text-3xl md:text-4xl text-white text-center tracking-wide"
      />
    </div>
  );
}
