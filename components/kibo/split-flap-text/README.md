# Split Flap Text

Tactile mechanical departure board text animation simulating retro split-flap display transitions.

## Installation

```bash
npx kibo add split-flap-text
```


## Usage

```tsx
import { SplitFlapText } from "@/components/kibo/split-flap-text/component";

export default function Example() {
  return (
    <SplitFlapText />
  );
}
```

## Component Standards

- **TypeScript**: Fully typed props and return types
- **Tailwind CSS v4**: Utility-first styling with dark mode support
- **SSR Compatible**: Safe execution in Next.js App Router
- **Accessibility**: Keyboard & screen reader friendly
- **Reduced Motion**: Respects `prefers-reduced-motion`
