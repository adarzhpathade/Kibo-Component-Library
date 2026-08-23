import { GlitchText } from "./component";

export default function GlitchTextDemo() {
  return (
    <div className="flex h-full w-full w-full items-center justify-center bg-transparent px-4">
      <GlitchText
        speed={1}
        enableShadows={true}
        enableOnHover={true}
        className="text-4xl sm:text-5xl font-black text-white"
      >
        CYBER
      </GlitchText>
    </div>
  );
}
