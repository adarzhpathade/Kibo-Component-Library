# Gradient Text

Silky multi-color gradient background sweep traveling continuously across typography with custom speeds and angles.

## Installation

```bash
npx kibo add gradient-text
```

### Dependencies

```bash
npm install motion
```

## Usage

```tsx
import { GradientText } from "@/components/kibo/gradient-text/component";

export default function Example() {
  return (
    <GradientText />
  );
}
```

## Component Standards

- **TypeScript**: Fully typed props and return types
- **Tailwind CSS v4**: Utility-first styling with dark mode support
- **SSR Compatible**: Safe execution in Next.js App Router
- **Accessibility**: Keyboard & screen reader friendly
- **Reduced Motion**: Respects `prefers-reduced-motion`
