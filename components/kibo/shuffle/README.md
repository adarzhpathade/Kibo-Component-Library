# Shuffle

Slot-machine reel flip animation rolling through randomized glyph strips on scroll trigger or hover.

## Installation

```bash
npx kibo add shuffle
```

### Dependencies

```bash
npm install gsap @gsap/react
```

## Usage

```tsx
import { Shuffle } from "@/components/kibo/shuffle/component";

export default function Example() {
  return (
    <Shuffle />
  );
}
```

## Component Standards

- **TypeScript**: Fully typed props and return types
- **Tailwind CSS v4**: Utility-first styling with dark mode support
- **SSR Compatible**: Safe execution in Next.js App Router
- **Accessibility**: Keyboard & screen reader friendly
- **Reduced Motion**: Respects `prefers-reduced-motion`
