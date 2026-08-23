import { EchoText } from "./component";

export default function EchoTextDemo() {
  return (
    <div className="flex h-full w-full w-full items-center justify-center bg-transparent px-4">
      <EchoText
        text="REVERB"
        className="text-4xl sm:text-5xl font-black text-white"
      />
    </div>
  );
}
