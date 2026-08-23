# Particle Text

Interactive canvas particle physics system rendering text as thousands of points that scatter and reform around pointer.

## Installation

```bash
npx kibo add particle-text
```


## Usage

```tsx
import { ParticleText } from "@/components/kibo/particle-text/component";

export default function Example() {
  return (
    <ParticleText />
  );
}
```

## Component Standards

- **TypeScript**: Fully typed props and return types
- **Tailwind CSS v4**: Utility-first styling with dark mode support
- **SSR Compatible**: Safe execution in Next.js App Router
- **Accessibility**: Keyboard & screen reader friendly
- **Reduced Motion**: Respects `prefers-reduced-motion`
