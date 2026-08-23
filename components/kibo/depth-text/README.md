# Depth Text

Creates multi-layered 3D extruded typography that dynamically angles and shifts depth relative to cursor position.

## Installation

```bash
npx kibo add depth-text
```


## Usage

```tsx
import { DepthText } from "@/components/kibo/depth-text/component";

export default function Example() {
  return (
    <DepthText />
  );
}
```

## Component Standards

- **TypeScript**: Fully typed props and return types
- **Tailwind CSS v4**: Utility-first styling with dark mode support
- **SSR Compatible**: Safe execution in Next.js App Router
- **Accessibility**: Keyboard & screen reader friendly
- **Reduced Motion**: Respects `prefers-reduced-motion`
