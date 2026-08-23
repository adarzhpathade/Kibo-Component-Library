# Falling Text

Interactive 2D physics simulation where words fall into a container with gravity, collisions, and drag interaction.

## Installation

```bash
npx kibo add falling-text
```

### Dependencies

```bash
npm install matter-js
```

## Usage

```tsx
import { FallingText } from "@/components/kibo/falling-text/component";

export default function Example() {
  return (
    <FallingText />
  );
}
```

## Component Standards

- **TypeScript**: Fully typed props and return types
- **Tailwind CSS v4**: Utility-first styling with dark mode support
- **SSR Compatible**: Safe execution in Next.js App Router
- **Accessibility**: Keyboard & screen reader friendly
- **Reduced Motion**: Respects `prefers-reduced-motion`
