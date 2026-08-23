import { CountUp } from "./component";

export default function CountUpDemo() {
  return (
    <div className="flex h-full w-full w-full items-center justify-center bg-transparent px-4">
      <CountUp
        from={0}
        to={100}
        separator=","
        direction="up"
        duration={1.5}
        className="text-5xl sm:text-6xl font-black text-white"
      />
    </div>
  );
}
