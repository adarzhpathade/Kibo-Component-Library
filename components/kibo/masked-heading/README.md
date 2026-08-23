# Masked Heading

Kinetic reveal effect slicing text through angled geometric masks with smooth staggered easing.

## Installation

```bash
npx kibo add masked-heading
```

### Dependencies

```bash
npm install gsap
```

## Usage

```tsx
import { MaskedHeading } from "@/components/kibo/masked-heading/component";

export default function Example() {
  return (
    <MaskedHeading />
  );
}
```

## Component Standards

- **TypeScript**: Fully typed props and return types
- **Tailwind CSS v4**: Utility-first styling with dark mode support
- **SSR Compatible**: Safe execution in Next.js App Router
- **Accessibility**: Keyboard & screen reader friendly
- **Reduced Motion**: Respects `prefers-reduced-motion`
