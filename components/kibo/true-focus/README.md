# True Focus

Camera viewfinder crosshair brackets locking onto active words with smooth spring transitions and blur depth.

## Installation

```bash
npx kibo add true-focus
```

### Dependencies

```bash
npm install motion
```

## Usage

```tsx
import { TrueFocus } from "@/components/kibo/true-focus/component";

export default function Example() {
  return (
    <TrueFocus />
  );
}
```

## Component Standards

- **TypeScript**: Fully typed props and return types
- **Tailwind CSS v4**: Utility-first styling with dark mode support
- **SSR Compatible**: Safe execution in Next.js App Router
- **Accessibility**: Keyboard & screen reader friendly
- **Reduced Motion**: Respects `prefers-reduced-motion`
