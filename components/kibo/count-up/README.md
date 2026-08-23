# Count Up

Smooth spring-physics numerical counter that animates from a start value to target value when entering viewport.

## Installation

```bash
npx kibo add count-up
```

### Dependencies

```bash
npm install motion
```

## Usage

```tsx
import { CountUp } from "@/components/kibo/count-up/component";

export default function Example() {
  return (
    <CountUp />
  );
}
```

## Component Standards

- **TypeScript**: Fully typed props and return types
- **Tailwind CSS v4**: Utility-first styling with dark mode support
- **SSR Compatible**: Safe execution in Next.js App Router
- **Accessibility**: Keyboard & screen reader friendly
- **Reduced Motion**: Respects `prefers-reduced-motion`
