# Shiny Text

Metallic sheen sweeps across text producing a reflective highlight.

## Installation

```bash
npx kibo add shiny-text
```

## Usage

```tsx
import { ShinyText } from "@/components/kibo/shiny-text/component";

export default function MyComponent() {
  return (
    <ShinyText
      text="Next-generation interactivity"
      className="text-4xl font-bold"
      color="#737373"
      shineColor="#ffffff"
      speed={3}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | | The text content to display. |
| `disabled` | `boolean` | `false` | Whether the animation is disabled. |
| `speed` | `number` | `2` | Speed of the animation in seconds. |
| `className` | `string` | `""` | Additional CSS classes to apply. |
| `color` | `string` | `"#b5b5b5"` | The base color of the text. |
| `shineColor` | `string` | `"#ffffff"` | The color of the shiny highlight. |
| `spread` | `number` | `120` | The spread angle of the linear gradient. |
| `yoyo` | `boolean` | `false` | Whether the animation should reverse direction at the end of each cycle. |
| `pauseOnHover` | `boolean` | `false` | Whether the animation should pause when hovered. |
| `direction` | `"left" \| "right"` | `"left"` | The direction of the shine sweep. |
| `delay` | `number` | `0` | Delay in seconds before starting the animation (or between cycles). |

## Dependencies

- [Motion](https://motion.dev/) (`motion` package)
