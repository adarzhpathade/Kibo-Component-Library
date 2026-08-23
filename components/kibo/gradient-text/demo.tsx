import { GradientText } from "./component";

export default function GradientTextDemo() {
  return (
    <div className="flex h-full w-full w-full items-center justify-center bg-transparent px-4">
      <GradientText
        colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
        animationSpeed={3}
        showBorder={false}
        className="text-2xl sm:text-3xl font-bold text-center"
      >
        Gradient Motion
      </GradientText>
    </div>
  );
}
