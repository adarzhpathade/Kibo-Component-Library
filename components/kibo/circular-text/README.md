# Circular Text

Renders text along an animated circular path with smooth spin, customizable radius, and reactive hover velocity.

## Installation

```bash
npx kibo add circular-text
```

### Dependencies

```bash
npm install motion
```

## Usage

```tsx
import { CircularText } from "@/components/kibo/circular-text/component";

export default function Example() {
  return (
    <CircularText />
  );
}
```

## Component Standards

- **TypeScript**: Fully typed props and return types
- **Tailwind CSS v4**: Utility-first styling with dark mode support
- **SSR Compatible**: Safe execution in Next.js App Router
- **Accessibility**: Keyboard & screen reader friendly
- **Reduced Motion**: Respects `prefers-reduced-motion`
