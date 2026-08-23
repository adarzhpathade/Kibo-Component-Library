import { FoldText } from "./component";

export default function FoldTextDemo() {
  return (
    <div className="flex h-full w-full w-full items-center justify-center bg-transparent px-4">
      <FoldText
        text="ORIGAMI"
        className="text-4xl sm:text-5xl font-black text-white"
      />
    </div>
  );
}
