# Split Text

Splits text into characters or words for staggered entrance animation using GSAP.

> **Note**: This component utilizes the GSAP `SplitText` plugin, which is a premium plugin available to Club GSAP members. Ensure you have the proper licensing and installation setup in your project to use it.

## Installation

```bash
npx kibo add split-text
```

## Usage

```tsx
import { SplitText } from "@/components/kibo/split-text/component";

export default function MyComponent() {
  return (
    <SplitText
      text="A new era of motion design"
      className="text-4xl font-semibold text-white"
      delay={30}
      splitType="chars"
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | | The text content to split and animate. |
| `className` | `string` | `""` | Additional CSS classes. |
| `delay` | `number` | `50` | Delay in milliseconds between each animated element. |
| `duration` | `number` | `1.25` | Duration of the animation in seconds. |
| `ease` | `string \| Function` | `"power3.out"` | GSAP easing function or string. |
| `splitType` | `"chars" \| "words" \| "lines" \| "words, chars"` | `"chars"` | How the text should be split. |
| `from` | `gsap.TweenVars` | `{ opacity: 0, y: 40 }` | Starting GSAP animation properties. |
| `to` | `gsap.TweenVars` | `{ opacity: 1, y: 0 }` | Target GSAP animation properties. |
| `threshold` | `number` | `0.1` | Intersection Observer threshold (0-1). |
| `rootMargin` | `string` | `"-100px"` | Intersection Observer root margin. |
| `tag` | `string` | `"p"` | The HTML tag to render (e.g., `h1`, `p`). |
| `textAlign` | `CSSProperties['textAlign']` | `"center"` | Text alignment. |

## Dependencies

- [GSAP](https://gsap.com/) (`gsap` package)
- [GSAP React](https://gsap.com/resources/React) (`@gsap/react` package)
