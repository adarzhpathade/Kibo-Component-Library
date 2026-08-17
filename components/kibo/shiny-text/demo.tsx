import { ShinyText } from "./component";

export default function ShinyTextDemo() {
  return (
    <div className="flex h-[400px] w-full items-center justify-center bg-neutral-950 px-4">
      <ShinyText
        text="Next-generation interactivity"
        className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
        color="#737373" // text-neutral-500
        shineColor="#ffffff"
        speed={3}
      />
    </div>
  );
}
