import { ScrollFloat } from "./component";

export default function ScrollFloatDemo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-transparent px-4 text-center cursor-pointer">
      <ScrollFloat
        animationDuration={0.8}
        ease="back.out(2)"
        scrollStart="top bottom+=40%"
        scrollEnd="bottom bottom-=40%"
        triggerOnHover={true}
        containerClassName="text-xl sm:text-2xl md:text-3xl font-bold text-white max-w-lg"
      >
        Weightless floating typography engineered for high-impact landing pages.
      </ScrollFloat>
    </div>
  );
}
