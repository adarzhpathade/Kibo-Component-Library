import { FallingText } from "./component";

export default function FallingTextDemo() {
  return (
    <div className="relative flex h-full w-full w-full items-center justify-center bg-transparent px-4 overflow-hidden">
      <FallingText
        text="Kibo React Motion Design System Components Tailwind NextJS"
        trigger="auto"
        gravity={0.8}
        fontSize="1.15rem"
      />
    </div>
  );
}
