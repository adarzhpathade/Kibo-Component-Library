# Fold Text

3D origami accordion fold animation that bends and unrolls text slices dynamically on scroll or hover.

## Installation

```bash
npx kibo add fold-text
```

### Dependencies

```bash
npm install gsap
```

## Usage

```tsx
import { FoldText } from "@/components/kibo/fold-text/component";

export default function Example() {
  return (
    <FoldText />
  );
}
```

## Component Standards

- **TypeScript**: Fully typed props and return types
- **Tailwind CSS v4**: Utility-first styling with dark mode support
- **SSR Compatible**: Safe execution in Next.js App Router
- **Accessibility**: Keyboard & screen reader friendly
- **Reduced Motion**: Respects `prefers-reduced-motion`
