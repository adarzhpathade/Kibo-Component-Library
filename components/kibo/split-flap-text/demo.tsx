import { SplitFlapText } from "./component";

export default function SplitFlapTextDemo() {
  return (
    <div className="flex h-full w-full w-full items-center justify-center bg-transparent px-4">
      <SplitFlapText
        text="DEPARTURES"
        className="text-2xl sm:text-3xl font-mono text-amber-400 font-bold"
      />
    </div>
  );
}
