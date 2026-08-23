import { StrokeText } from "./component";

export default function StrokeTextDemo() {
  return (
    <div className="flex h-full w-full w-full items-center justify-center bg-transparent px-4">
      <StrokeText
        text="OUTLINE"
        strokeColor="#ffffff"
        fillColor="transparent"
        fontSize={56}
        className="text-white"
      />
    </div>
  );
}
