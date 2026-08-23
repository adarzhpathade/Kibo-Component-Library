import { TrueFocus } from "./component";

export default function TrueFocusDemo() {
  return (
    <div className="flex h-full w-full w-full items-center justify-center bg-transparent px-4 text-center">
      <TrueFocus
        sentence="True Focus Locks On Words"
        manualMode={false}
        blurAmount={5}
        borderColor="#ef4444"
        glowColor="rgba(239, 68, 68, 0.4)"
        fontSize="text-xl sm:text-2xl md:text-3xl font-black text-white"
      />
    </div>
  );
}
