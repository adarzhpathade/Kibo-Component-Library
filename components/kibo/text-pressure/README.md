# Text Pressure

Characters scale / warp interactively based on pointer proximity, utilizing Variable Fonts for smooth interpolations.

## Installation

```bash
npx kibo add text-pressure
```

## Usage

```tsx
import { TextPressure } from "@/components/kibo/text-pressure/component";

export default function MyComponent() {
  return (
    <div className="relative h-[200px] w-full">
      <TextPressure
        text="INTERACT"
        flex={true}
        width={true}
        weight={true}
        textColor="#ffffff"
      />
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | `"Compressa"` | The text to display. |
| `fontFamily` | `string` | `"Roboto Flex"` | The Google Font family to use. Must be a Variable Font. |
| `fontUrl` | `string` | | The URL to the Google Font. |
| `width` | `boolean` | `true` | Whether to adjust font width based on cursor. |
| `weight` | `boolean` | `true` | Whether to adjust font weight based on cursor. |
| `italic` | `boolean` | `true` | Whether to adjust italic slant based on cursor. |
| `alpha` | `boolean` | `false` | Whether to adjust opacity based on cursor. |
| `flex` | `boolean` | `true` | Whether to use flexbox spacing. |
| `stroke` | `boolean` | `false` | Whether to render a stroke effect instead of solid text. |
| `scale` | `boolean` | `false` | Whether to scale text to fill container height. |
| `textColor` | `string` | `"#FFFFFF"` | Base text color. |
| `strokeColor` | `string` | `"#FF0000"` | Stroke color if stroke is true. |
| `strokeWidth` | `number` | `2` | Stroke width in pixels if stroke is true. |
| `className` | `string` | `""` | Additional CSS classes. |
| `minFontSize` | `number` | `24` | Minimum font size in pixels. |

## Dependencies

- None (Uses standard React and native DOM APIs)
