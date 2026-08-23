import { FuzzyText } from "./component";

export default function FuzzyTextDemo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-transparent px-4">
      <FuzzyText
        fontSize="clamp(3rem, 6vw, 5rem)"
        fontWeight={900}
        color="#ffffff"
        baseIntensity={0.18}
        hoverIntensity={0.65}
        enableHover={true}
      >
        FUZZY
      </FuzzyText>
    </div>
  );
}
