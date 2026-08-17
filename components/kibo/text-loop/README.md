# Text Loop

A seamless text marquee that flows along curved SVG paths (e.g. wave, infinity, circle). Uses `gsap` for robust SVG path animations.

## Installation

```bash
npx kibo add text-loop
```

## Usage

```tsx
import { TextLoop } from "@/components/kibo/text-loop/component";

export default function MyComponent() {
  return (
    <div className="relative w-full">
      <TextLoop
        text="Limitless Design"
        shape="infinity"
        separator="✦"
        ribbonColor="#3b82f6"
        ribbonWidth={100}
      />
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | `"React ✦ Bits"` | The text to loop. |
| `shape` | `"wave" \| "circle" \| "infinity" \| "arch" \| "line"` | `"wave"` | Pre-defined SVG path shapes. |
| `path` | `string` | | Custom SVG path string. Overrides `shape` if provided. |
| `speed` | `number` | `90` | Animation speed. |
| `direction` | `"forward" \| "reverse"` | `"forward"` | Animation direction. |
| `separator` | `string` | `"✦"` | Separator character between text repetitions. |
| `curviness` | `number` | `90` | Intensity of the curve (applicable to certain shapes). |
| `fontSize` | `number` | `46` | Font size of the text. |
| `fontWeight` | `number \| string` | `800` | Font weight of the text. |
| `letterSpacing` | `number` | `2` | Letter spacing of the text. |
| `uppercase` | `boolean` | `true` | Whether to transform text to uppercase. |
| `color` | `string` | `"#ffffff"` | Text color. |
| `ribbon` | `boolean` | `true` | Whether to render a background ribbon path. |
| `ribbonColor` | `string` | `"#5227FF"` | Color of the ribbon stroke. |
| `ribbonWidth` | `number` | `86` | Width of the ribbon stroke. |
| `pauseOnHover` | `boolean` | `true` | Pause animation on hover. |
| `className` | `string` | `""` | Additional CSS classes. |

## Dependencies

- [GSAP](https://gsap.com/) (`gsap` package)
