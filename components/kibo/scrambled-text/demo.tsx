import { ScrambledText } from "./component";

export default function ScrambledTextDemo() {
  return (
    <div className="flex h-full w-full w-full items-center justify-center bg-transparent px-4 text-center">
      <ScrambledText
        radius={100}
        duration={1.2}
        speed={0.5}
        className="text-base sm:text-lg font-mono text-white max-w-md"
      >
        Hover near this text to scramble individual characters in real time.
      </ScrambledText>
    </div>
  );
}
