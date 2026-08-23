import { TextType } from "./component";

export default function TextTypeDemo() {
  return (
    <div className="flex h-full w-full w-full items-center justify-center bg-transparent px-4 text-center">
      <TextType
        text={['Build faster with Kibo.', 'Craft motion with confidence.', 'Ship beautiful React apps.']}
        typingSpeed={80}
        deletingSpeed={50}
        pauseDuration={1500}
        className="text-xl sm:text-2xl font-mono font-semibold text-white text-center"
      />
    </div>
  );
}
