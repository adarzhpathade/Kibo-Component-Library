import { TextLoop } from "./component";

export default function TextLoopDemo() {
  return (
    <div className="flex h-full w-full w-full items-center justify-center bg-transparent p-8">
      <div className="relative w-full overflow-hidden">
        <TextLoop
          text="Limitless Design"
          shape="infinity"
          separator="✦"
          ribbonColor="#3b82f6" // blue-500
          ribbonWidth={100}
        />
      </div>
    </div>
  );
}
