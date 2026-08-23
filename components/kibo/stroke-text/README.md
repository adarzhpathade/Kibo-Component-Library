# Stroke Text

Vector outline drawing animation sketching letter paths with SVG stroke-dashoffset transitions on scroll.

## Installation

```bash
npx kibo add stroke-text
```

### Dependencies

```bash
npm install gsap
```

## Usage

```tsx
import { StrokeText } from "@/components/kibo/stroke-text/component";

export default function Example() {
  return (
    <StrokeText />
  );
}
```

## Component Standards

- **TypeScript**: Fully typed props and return types
- **Tailwind CSS v4**: Utility-first styling with dark mode support
- **SSR Compatible**: Safe execution in Next.js App Router
- **Accessibility**: Keyboard & screen reader friendly
- **Reduced Motion**: Respects `prefers-reduced-motion`
