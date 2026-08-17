# Blur Text

Text starts blurred then crisply resolves for a soft-focus reveal effect.

## Installation

```bash
npx kibo add blur-text
```

## Usage

```tsx
import { BlurText } from "@/components/kibo/blur-text/component";

export default function MyComponent() {
  return (
    <BlurText
      text="Experience motion like never before."
      className="text-4xl font-semibold text-white"
      delay={150}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | `""` | The text content to display and animate. |
| `delay` | `number` | `200` | Delay in milliseconds between each animated segment. |
| `className` | `string` | `""` | Additional CSS classes to apply to the container. |
| `animateBy` | `"words" \| "letters"` | `"words"` | Whether to animate word by word or letter by letter. |
| `direction` | `"top" \| "bottom"` | `"top"` | The direction the text should animate from. |
| `threshold` | `number` | `0.1` | Intersection Observer threshold (0-1). |
| `rootMargin` | `string` | `"0px"` | Intersection Observer root margin. |
| `stepDuration` | `number` | `0.35` | Duration in seconds for each keyframe step. |

## Dependencies

- [Motion](https://motion.dev/) (`motion` package)
