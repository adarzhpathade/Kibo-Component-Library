# Scrambled Text

Proximity-based character scrambler that dynamically distorts and decrypts glyphs as the cursor sweeps past.

## Installation

```bash
npx kibo add scrambled-text
```


## Usage

```tsx
import { ScrambledText } from "@/components/kibo/scrambled-text/component";

export default function Example() {
  return (
    <ScrambledText />
  );
}
```

## Component Standards

- **TypeScript**: Fully typed props and return types
- **Tailwind CSS v4**: Utility-first styling with dark mode support
- **SSR Compatible**: Safe execution in Next.js App Router
- **Accessibility**: Keyboard & screen reader friendly
- **Reduced Motion**: Respects `prefers-reduced-motion`
