import { SplitText } from "./component";

export default function SplitTextDemo() {
  return (
    <div className="flex h-[400px] w-full items-center justify-center bg-neutral-950 px-4">
      <SplitText
        text="A new era of motion design"
        className="text-4xl font-semibold text-white md:text-5xl lg:text-6xl"
        delay={30}
        from={{ opacity: 0, y: 30 }}
        to={{ opacity: 1, y: 0 }}
        splitType="chars"
      />
    </div>
  );
}
