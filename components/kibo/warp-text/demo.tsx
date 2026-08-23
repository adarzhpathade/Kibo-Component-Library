import { WarpText } from "./component";

export default function WarpTextDemo() {
  return (
    <div className="relative flex h-full w-full w-full items-center justify-center bg-transparent px-4 overflow-hidden">
      <WarpText
        text="WARPED"
        fontSize={64}
        speed={1.2}
        warpScale={2.0}
        warpStrength={0.15}
        className="w-full h-full"
      />
    </div>
  );
}
