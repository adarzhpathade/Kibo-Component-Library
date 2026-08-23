# Text Cursor

Custom magnetic floating indicator and tooltip badge tracking pointer movement over text blocks.

## Installation

```bash
npx kibo add text-cursor
```

### Dependencies

```bash
npm install motion
```

## Usage

```tsx
import { TextCursor } from "@/components/kibo/text-cursor/component";

export default function Example() {
  return (
    <TextCursor />
  );
}
```

## Component Standards

- **TypeScript**: Fully typed props and return types
- **Tailwind CSS v4**: Utility-first styling with dark mode support
- **SSR Compatible**: Safe execution in Next.js App Router
- **Accessibility**: Keyboard & screen reader friendly
- **Reduced Motion**: Respects `prefers-reduced-motion`
