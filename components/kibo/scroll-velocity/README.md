# Scroll Velocity

Infinite bi-directional marquee text banners accelerating and decelerating dynamically based on page scroll velocity.

## Installation

```bash
npx kibo add scroll-velocity
```

### Dependencies

```bash
npm install motion
```

## Usage

```tsx
import { ScrollVelocity } from "@/components/kibo/scroll-velocity/component";

export default function Example() {
  return (
    <ScrollVelocity />
  );
}
```

## Component Standards

- **TypeScript**: Fully typed props and return types
- **Tailwind CSS v4**: Utility-first styling with dark mode support
- **SSR Compatible**: Safe execution in Next.js App Router
- **Accessibility**: Keyboard & screen reader friendly
- **Reduced Motion**: Respects `prefers-reduced-motion`
