import { ShinyText } from "./component";

export default function ShinyTextDemo() {
  return (
    <div className="flex h-full w-full w-full items-center justify-center bg-transparent px-4">
      <ShinyText
        text="Next-generation interactivity"
        className="text-2xl sm:text-3xl font-semibold tracking-tight text-center"
        color="#737373" // text-neutral-500
        shineColor="#ffffff"
        speed={3}
      />
    </div>
  );
}
