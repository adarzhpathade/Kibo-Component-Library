import { ASCIIText } from "./component";

export default function ASCIITextDemo() {
  return (
    <div className="relative flex h-full w-full w-full items-center justify-center bg-transparent px-4 overflow-hidden">
      <ASCIIText
        text="KIBO"
        
        asciiFontSize={8}
      />
    </div>
  );
}
