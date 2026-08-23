import { SplitText } from "./component";

export default function SplitTextDemo() {
  return (
    <div className="flex h-full w-full w-full items-center justify-center bg-transparent px-4">
      <SplitText
        text="A new era of motion design"
        className="text-2xl sm:text-3xl font-semibold text-white text-center"
        delay={30}
        from={{ opacity: 0, y: 30 }}
        to={{ opacity: 1, y: 0 }}
        splitType="chars"
      />
    </div>
  );
}
