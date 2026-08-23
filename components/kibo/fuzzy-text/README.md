# Fuzzy Text

Canvas-driven CRT static fuzz and particulate distortion that scatters and reconstitutes text on interaction.

## Installation

```bash
npx kibo add fuzzy-text
```


## Usage

```tsx
import { FuzzyText } from "@/components/kibo/fuzzy-text/component";

export default function Example() {
  return (
    <FuzzyText />
  );
}
```

## Component Standards

- **TypeScript**: Fully typed props and return types
- **Tailwind CSS v4**: Utility-first styling with dark mode support
- **SSR Compatible**: Safe execution in Next.js App Router
- **Accessibility**: Keyboard & screen reader friendly
- **Reduced Motion**: Respects `prefers-reduced-motion`
