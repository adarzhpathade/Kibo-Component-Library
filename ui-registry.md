# UI Consistency Registry

This registry tracks visual patterns extracted from components. Use these classes and conventions to ensure UI consistency across the entire project.

### Sidebar

File: `components/layout/sidebar.tsx`
Last updated: 2026-08-17

| Property         | Class / Value                                |
| ---------------- | -------------------------------------------- |
| Background (Main)| `bg-[#151314]`                               |
| Background (Sub) | `bg-[#2b2527]` (pre-layers, deep contrast)   |
| Border radius    | `sm:rounded-[5px]` (panels), `rounded-full`  |
| Text — primary   | `text-[var(--foreground)] opacity-80`        |
| Text — active    | `text-accent` (or `bg-[var(--accent)]`)      |
| Text — muted     | `opacity-60`                                 |
| Spacing          | `pl-[24px] pr-[35px]`, `gap-[12px]`          |
| Hover state      | `hover:opacity-100` or `hover:opacity-80`    |
| Shadow           | `sm:shadow-2xl` (for floating panels)        |
| Dividers         | `h-px bg-[var(--foreground)] opacity-[0.2]`  |
| Heading Text     | `text-[24px]`                                |
| Sub/Menu Text    | `text-[20px]`                                |
| Footer/Brand Text| `text-[18px] font-black tracking-wide`       |
| Caption/Small    | `text-[12px]`                                |

**Pattern notes:**
- **Animations:** Slide-ins use GSAP `power4.out` easing with `0.5s` durations. Staggered elements usually use a `0.05` to `0.08` gap.
- **Interactions:** We rely heavily on opacity transitions (`opacity-60` -> `opacity-100`) rather than color swapping for hover states, keeping the palette restrained to the foreground color and one accent color.
- **Toggle Dots:** Interactive system toggles (like theme or logout) are represented as abstract minimalist `12x12` or `16x16` circles rather than standard text buttons or icons, enhancing the premium feel.
