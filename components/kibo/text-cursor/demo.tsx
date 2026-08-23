import { TextCursor } from "./component";

export default function TextCursorDemo() {
  return (
    <div className="relative flex h-full w-full w-full items-center justify-center bg-transparent px-4 text-center overflow-hidden">
      <TextCursor
        text="✨ KIBO"
        spacing={80}
        maxPoints={6}
      />
      <p className="text-base sm:text-lg font-medium text-white max-w-md pointer-events-none select-none">
        Move your cursor across this area to see the trail effect.
      </p>
    </div>
  );
}
