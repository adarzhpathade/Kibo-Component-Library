# Scroll Float

Weightless typography effect where characters float smoothly upwards with spring physics as user scrolls.

## Installation

```bash
npx kibo add scroll-float
```

### Dependencies

```bash
npm install gsap
```

## Usage

```tsx
import { ScrollFloat } from "@/components/kibo/scroll-float/component";

export default function Example() {
  return (
    <ScrollFloat />
  );
}
```

## Component Standards

- **TypeScript**: Fully typed props and return types
- **Tailwind CSS v4**: Utility-first styling with dark mode support
- **SSR Compatible**: Safe execution in Next.js App Router
- **Accessibility**: Keyboard & screen reader friendly
- **Reduced Motion**: Respects `prefers-reduced-motion`
