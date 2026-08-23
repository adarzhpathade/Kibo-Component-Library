import { DepthText } from "./component";

export default function DepthTextDemo() {
  return (
    <div className="flex h-full w-full w-full items-center justify-center bg-transparent px-4">
      <DepthText
        text="DEPTH"
        className="text-4xl sm:text-5xl font-black text-white"
      />
    </div>
  );
}
