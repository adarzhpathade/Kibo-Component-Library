import { MaskedHeading } from "./component";

export default function MaskedHeadingDemo() {
  return (
    <div className="flex h-full w-full w-full items-center justify-center bg-transparent px-4">
      <MaskedHeading
        text="KINETIC TYPOGRAPHY"
        className="text-2xl sm:text-3xl font-black text-white text-center"
      />
    </div>
  );
}
