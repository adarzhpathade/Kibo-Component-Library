# Scroll Reveal

Progressive word-by-word opacity and blur reveal anchored to scroll position with customizable thresholds.

## Installation

```bash
npx kibo add scroll-reveal
```

### Dependencies

```bash
npm install gsap
```

## Usage

```tsx
import { ScrollReveal } from "@/components/kibo/scroll-reveal/component";

export default function Example() {
  return (
    <ScrollReveal />
  );
}
```

## Component Standards

- **TypeScript**: Fully typed props and return types
- **Tailwind CSS v4**: Utility-first styling with dark mode support
- **SSR Compatible**: Safe execution in Next.js App Router
- **Accessibility**: Keyboard & screen reader friendly
- **Reduced Motion**: Respects `prefers-reduced-motion`
