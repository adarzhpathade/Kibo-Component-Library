import { TextPressure } from "./component";

export default function TextPressureDemo() {
  return (
    <div className="relative flex h-full w-full items-center justify-center bg-transparent p-4 overflow-hidden">
      <div className="relative h-[160px] sm:h-[180px] w-full overflow-hidden">
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
