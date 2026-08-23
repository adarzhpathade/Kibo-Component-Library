# Warp Text

High-performance WebGL liquid ripple and sine wave distortion shader warping text rendered via OGL.

## Installation

```bash
npx kibo add warp-text
```

### Dependencies

```bash
npm install ogl
```

## Usage

```tsx
import { WarpText } from "@/components/kibo/warp-text/component";

export default function Example() {
  return (
    <WarpText />
  );
}
```

## Component Standards

- **TypeScript**: Fully typed props and return types
- **Tailwind CSS v4**: Utility-first styling with dark mode support
- **SSR Compatible**: Safe execution in Next.js App Router
- **Accessibility**: Keyboard & screen reader friendly
- **Reduced Motion**: Respects `prefers-reduced-motion`
