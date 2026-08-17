import { BlurText } from "./component";

export default function BlurTextDemo() {
  return (
    <div className="flex h-[400px] w-full items-center justify-center bg-neutral-950 px-4">
      <BlurText
        text="Experience motion like never before."
        className="text-4xl font-semibold text-white md:text-5xl lg:text-6xl"
        delay={150}
        direction="top"
        animateBy="words"
      />
    </div>
  );
}
