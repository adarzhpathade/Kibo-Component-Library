# ASCII Text

Transforms 3D scene text into real-time dynamic ASCII art characters with interactive camera and mouse lighting controls.

## Installation

```bash
npx kibo add ascii-text
```

### Dependencies

```bash
npm install three
```

## Usage

```tsx
import { ASCIIText } from "@/components/kibo/ascii-text/component";

export default function Example() {
  return (
    <ASCIIText />
  );
}
```

## Component Standards

- **TypeScript**: Fully typed props and return types
- **Tailwind CSS v4**: Utility-first styling with dark mode support
- **SSR Compatible**: Safe execution in Next.js App Router
- **Accessibility**: Keyboard & screen reader friendly
- **Reduced Motion**: Respects `prefers-reduced-motion`
