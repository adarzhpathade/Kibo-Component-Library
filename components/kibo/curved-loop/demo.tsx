import { CurvedLoop } from "./component";

export default function CurvedLoopDemo() {
  return (
    <div className="flex h-full w-full w-full items-center justify-center bg-transparent px-4 overflow-hidden">
      <CurvedLoop
        marqueeText="KIBO COMPONENT LIBRARY "
        speed={1.5}
        curveAmount={200}
      />
    </div>
  );
}
