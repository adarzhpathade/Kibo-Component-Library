import { DecryptedText } from "./component";

export default function DecryptedTextDemo() {
  return (
    <div className="flex h-full w-full w-full items-center justify-center bg-transparent px-4">
      <DecryptedText
        text="Kibo is modern motion."
        speed={70}
        maxIterations={15}
        animateOn="hover"
        revealDirection="start"
        className="text-xl sm:text-2xl md:text-3xl font-mono text-white text-center"
      />
    </div>
  );
}
