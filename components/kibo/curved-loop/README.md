# Curved Loop

Seamlessly repeats and animates text along a customizable SVG bezier curve with interactive drag and speed control.

## Installation

```bash
npx kibo add curved-loop
```


## Usage

```tsx
import { CurvedLoop } from "@/components/kibo/curved-loop/component";

export default function Example() {
  return (
    <CurvedLoop />
  );
}
```

## Component Standards

- **TypeScript**: Fully typed props and return types
- **Tailwind CSS v4**: Utility-first styling with dark mode support
- **SSR Compatible**: Safe execution in Next.js App Router
- **Accessibility**: Keyboard & screen reader friendly
- **Reduced Motion**: Respects `prefers-reduced-motion`
