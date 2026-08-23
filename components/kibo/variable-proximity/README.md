# Variable Proximity

Variable font weight and optical size interpolation fluidly responding to cursor distance across individual letters.

## Installation

```bash
npx kibo add variable-proximity
```

### Dependencies

```bash
npm install motion
```

## Usage

```tsx
import { VariableProximity } from "@/components/kibo/variable-proximity/component";

export default function Example() {
  return (
    <VariableProximity />
  );
}
```

## Component Standards

- **TypeScript**: Fully typed props and return types
- **Tailwind CSS v4**: Utility-first styling with dark mode support
- **SSR Compatible**: Safe execution in Next.js App Router
- **Accessibility**: Keyboard & screen reader friendly
- **Reduced Motion**: Respects `prefers-reduced-motion`
