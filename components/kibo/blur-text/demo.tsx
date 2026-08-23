import { BlurText } from "./component";

export default function BlurTextDemo() {
  return (
    <div className="flex h-full w-full w-full items-center justify-center bg-transparent px-4">
      <BlurText
        text="Experience motion like never before."
        className="text-2xl sm:text-3xl font-medium text-white text-center"
        delay={150}
        direction="top"
        animateBy="words"
      />
    </div>
  );
}
