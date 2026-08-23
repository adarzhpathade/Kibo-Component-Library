# Text Type

Realistic mechanical typing and backspacing animation with blinking cursor, variable typing speeds, and pauses.

## Installation

```bash
npx kibo add text-type
```

### Dependencies

```bash
npm install gsap
```

## Usage

```tsx
import { TextType } from "@/components/kibo/text-type/component";

export default function Example() {
  return (
    <TextType />
  );
}
```

## Component Standards

- **TypeScript**: Fully typed props and return types
- **Tailwind CSS v4**: Utility-first styling with dark mode support
- **SSR Compatible**: Safe execution in Next.js App Router
- **Accessibility**: Keyboard & screen reader friendly
- **Reduced Motion**: Respects `prefers-reduced-motion`
