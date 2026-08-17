import { TextPressure } from "./component";

export default function TextPressureDemo() {
  return (
    <div className="flex h-[400px] w-full items-center justify-center bg-neutral-950 p-8">
      <div className="relative h-[200px] w-full rounded-2xl bg-neutral-900 p-8 shadow-inner overflow-hidden border border-neutral-800">
        <TextPressure
          text="PRESSURE"
          flex={true}
          alpha={false}
          stroke={false}
          width={true}
          weight={true}
          italic={true}
          textColor="#ffffff"
        />
      </div>
    </div>
  );
}
