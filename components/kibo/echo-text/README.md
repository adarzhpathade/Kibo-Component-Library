# Echo Text

Generates cascading reverberation text layers with customizable depth, color ramps, and trailing kinetic motion.

## Installation

```bash
npx kibo add echo-text
```


## Usage

```tsx
import { EchoText } from "@/components/kibo/echo-text/component";

export default function Example() {
  return (
    <EchoText />
  );
}
```

## Component Standards

- **TypeScript**: Fully typed props and return types
- **Tailwind CSS v4**: Utility-first styling with dark mode support
- **SSR Compatible**: Safe execution in Next.js App Router
- **Accessibility**: Keyboard & screen reader friendly
- **Reduced Motion**: Respects `prefers-reduced-motion`
