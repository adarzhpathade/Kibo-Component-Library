# Rotating Text

Choreographed flipper cycling through multiple phrases with character or word level staggering and layout animations.

## Installation

```bash
npx kibo add rotating-text
```

### Dependencies

```bash
npm install motion
```

## Usage

```tsx
import { RotatingText } from "@/components/kibo/rotating-text/component";

export default function Example() {
  return (
    <RotatingText />
  );
}
```

## Component Standards

- **TypeScript**: Fully typed props and return types
- **Tailwind CSS v4**: Utility-first styling with dark mode support
- **SSR Compatible**: Safe execution in Next.js App Router
- **Accessibility**: Keyboard & screen reader friendly
- **Reduced Motion**: Respects `prefers-reduced-motion`
