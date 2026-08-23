import { CircularText } from "./component";

export default function CircularTextDemo() {
  return (
    <div className="flex h-full w-full w-full items-center justify-center bg-transparent px-4">
      <CircularText
        text="KIBO*MOTION*EXPERIENCE*"
        onHover="speedUp"
        spinDuration={20}
        className="text-white"
      />
    </div>
  );
}
