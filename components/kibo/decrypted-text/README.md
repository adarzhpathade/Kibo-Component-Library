# Decrypted Text

Cyberpunk-inspired text decryption effect that scrambles through random glyphs before resolving into final characters.

## Installation

```bash
npx kibo add decrypted-text
```

### Dependencies

```bash
npm install motion
```

## Usage

```tsx
import { DecryptedText } from "@/components/kibo/decrypted-text/component";

export default function Example() {
  return (
    <DecryptedText />
  );
}
```

## Component Standards

- **TypeScript**: Fully typed props and return types
- **Tailwind CSS v4**: Utility-first styling with dark mode support
- **SSR Compatible**: Safe execution in Next.js App Router
- **Accessibility**: Keyboard & screen reader friendly
- **Reduced Motion**: Respects `prefers-reduced-motion`
