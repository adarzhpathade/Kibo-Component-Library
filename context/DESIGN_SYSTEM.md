# Kibo — Design System

> The visual source of truth for Kibo's website, component previews, documentation, and component design language.

---

# 1. Purpose

This document defines the visual language of Kibo.

It establishes the rules for:

- Color
- Typography
- Spacing
- Layout
- Borders
- Radius
- Shadows
- Surfaces
- Icons
- Interaction states
- Motion principles
- Responsive behavior
- Accessibility
- Component presentation

The purpose is to make every Kibo component feel like part of one coherent product.

The design system should be used by:

- Kibo website
- Component previews
- Documentation
- Component demos
- Kibo-specific UI
- CLI-related web interfaces
- Marketing surfaces when applicable

The design system should not force every component to look identical. Components may have their own visual identity while still following Kibo's foundational rules.

---

# 2. Design Philosophy

Kibo's design language is:

- Modern
- Premium
- Minimal
- Technical
- Refined
- Motion-focused
- Developer-oriented
- Functional

The system should avoid unnecessary decoration.

Every visual decision should have a purpose.

Prioritize:

1. Hierarchy
2. Clarity
3. Contrast
4. Spacing
5. Interaction
6. Motion
7. Detail

Do not sacrifice usability for visual effects.

---

# 3. Brand Character

Kibo should feel:

### Precise

Interfaces should feel intentional and controlled.

### Experimental

Components can explore unusual interactions, motion, depth, WebGL, and creative effects.

### Clean

The surrounding documentation and product UI should remain visually calm so the component can remain the focus.

### Premium

Small details matter:

- Alignment
- Timing
- Typography
- Hover states
- Borders
- Shadows
- Transitions
- Spacing

### Developer-focused

The design should communicate that Kibo is a tool for developers rather than a generic consumer application.

---

# 4. Color System

## 4.1 Core Brand Colors

Kibo's primary visual direction uses a warm off-white and deep near-black foundation.

### Light Foundation

```text
Background: #F2EFEA
```

### Dark Foundation

```text
Background: #201D1D
```

These colors establish Kibo's core visual character.

Do not introduce arbitrary primary colors throughout the platform.

---

# 5. Semantic Color Tokens

Components and website UI should use semantic tokens rather than hard-coded colors wherever practical.

Recommended semantic roles:

```text
background
foreground
surface
surface-muted
surface-elevated
border
border-muted
primary
primary-foreground
secondary
secondary-foreground
muted
muted-foreground
accent
accent-foreground
success
warning
destructive
destructive-foreground
focus
```

The exact values may evolve, but semantic roles should remain stable.

---

# 6. Color Usage Rules

## Background

Use the primary background for large page surfaces.

## Surface

Use surfaces to separate content from the main background.

## Elevated Surface

Use elevated surfaces for:

- Cards
- Menus
- Dialogs
- Popovers
- Floating controls

## Border

Borders should generally be subtle.

Avoid heavy borders unless the component's design specifically requires them.

## Accent

Accent colors should guide attention.

Do not use accent colors everywhere.

Accent should communicate:

- Interaction
- Selection
- Focus
- Important actions
- Brand emphasis

---

# 7. Contrast

Text must remain readable against its background.

Use stronger contrast for:

- Primary text
- Headings
- Important controls

Use reduced contrast for:

- Supporting text
- Metadata
- Secondary descriptions

Do not reduce contrast to the point where information becomes difficult to read.

---

# 8. Typography

Kibo uses a clear typographic hierarchy.

Typography should communicate:

```text
Display
↓
Heading
↓
Subheading
↓
Body
↓
Caption
↓
Metadata
```

---

# 9. Font Families

Use a modern sans-serif as the primary UI font.

Use a monospace font for:

- Code
- CLI commands
- Technical values
- File paths
- Registry metadata

Do not mix many font families.

A maximum of two primary families should normally be used:

```text
Sans
Mono
```

---

# 10. Typography Scale

Use a predictable scale.

Suggested hierarchy:

```text
Display XL
Display LG
Display MD

Heading XL
Heading LG
Heading MD
Heading SM

Body LG
Body MD
Body SM

Caption
Micro
```

Typography should scale responsively where appropriate.

Avoid excessive heading sizes that dominate component documentation.

---

# 11. Font Weight

Use weight to establish hierarchy.

Suggested semantic weights:

```text
Regular
Medium
Semibold
Bold
```

Avoid using many different weights on the same page.

A typical hierarchy:

```text
Display: Bold / Semibold
Heading: Semibold
Body: Regular
Labels: Medium
Metadata: Regular / Medium
```

---

# 12. Line Height

Readable line height is required.

Use tighter line heights for:

- Large headings
- Display text
- Short labels

Use more generous line heights for:

- Paragraphs
- Documentation
- Long descriptions

Do not use extremely tight body text.

---

# 13. Letter Spacing

Large display text may use slightly tighter tracking.

Small labels and uppercase metadata may use slightly wider tracking.

Avoid excessive letter spacing.

---

# 14. Spacing System

Use a consistent spacing scale.

Base unit:

```text
4px
```

Recommended values:

```text
4
8
12
16
20
24
32
40
48
64
80
96
128
160
192
```

Not every value must be used everywhere.

Prefer existing spacing tokens over arbitrary values.

---

# 15. Spacing Hierarchy

Use spacing to communicate relationships.

### Tight

For:

- Icon + text
- Form label + input
- Small controls

### Normal

For:

- Card content
- Component groups
- Navigation items

### Large

For:

- Sections
- Major content blocks
- Documentation groups

### Extra Large

For:

- Hero sections
- Page transitions
- Major visual separation

---

# 16. Layout System

Kibo should use predictable layouts.

Common structures:

```text
Full Width
Centered Container
Two Column
Three Column
Stack
Grid
Flex
Overlay
```

Prefer CSS Grid for complex layouts.

Prefer Flexbox for linear layouts.

---

# 17. Container

Documentation pages should use a centered content container.

The container should:

- Have a maximum width
- Remain fluid
- Maintain responsive side padding
- Prevent excessive line lengths

Avoid extremely wide text columns.

---

# 18. Grid

Grid systems should be responsive.

Example:

```text
Mobile
1 column

Tablet
2 columns

Desktop
2–4 columns depending on content
```

Do not force a fixed number of columns when the content requires another layout.

---

# 19. Border Radius

Kibo uses rounded surfaces, but radius should remain controlled.

Semantic radius levels:

```text
radius-sm
radius-md
radius-lg
radius-xl
radius-2xl
radius-full
```

Use:

- Small radius for compact controls
- Medium radius for inputs and buttons
- Large radius for cards
- Extra-large radius for major surfaces
- Full radius for pills and circular elements

Avoid using extremely rounded shapes everywhere.

---

# 20. Borders

Borders should establish structure without becoming visually heavy.

Use borders for:

- Inputs
- Cards
- Navigation separators
- Code blocks
- Panels
- Interactive controls

Prefer subtle borders.

Interactive states may strengthen the border.

---

# 21. Shadows

Shadows should communicate depth.

Semantic levels:

```text
shadow-none
shadow-sm
shadow-md
shadow-lg
shadow-xl
```

Use shadows sparingly.

Avoid applying large shadows to every card.

Prefer subtle elevation.

---

# 22. Layering

Use a clear visual hierarchy:

```text
Page
 ↓
Surface
 ↓
Elevated Surface
 ↓
Floating Surface
 ↓
Modal / Overlay
```

Layering should remain predictable.

---

# 23. Iconography

Icons should have a consistent visual language.

Prefer:

- Simple geometry
- Consistent stroke width
- Consistent sizing
- Clear meaning

Avoid mixing multiple unrelated icon styles.

Standard sizes may include:

```text
12px
14px
16px
18px
20px
24px
32px
```

---

# 24. Buttons

Buttons should have:

- Clear hierarchy
- Strong interactive states
- Visible focus
- Comfortable touch targets
- Consistent padding
- Consistent radius

Common variants:

```text
Primary
Secondary
Ghost
Outline
Destructive
Link
Icon
```

Do not create unnecessary variants.

---

# 25. Inputs

Inputs should clearly communicate:

- Default
- Hover
- Focus
- Filled
- Disabled
- Error
- Success

Focus state must remain visible.

Placeholder text should not replace labels.

---

# 26. Cards

Cards should establish visual grouping.

Use:

- Surface
- Border
- Controlled radius
- Appropriate padding

Do not use shadows and borders simultaneously unless the design benefits from both.

Cards should not become visually heavy.

---

# 27. Component Preview Surfaces

Component previews are extremely important because Kibo is a component library.

A preview should:

- Give the component enough space
- Avoid unnecessary decoration
- Clearly show interaction
- Support light/dark preview where appropriate
- Preserve the component's intended visual behavior
- Avoid cropping important content

The component itself should remain the visual focus.

---

# 28. Code Blocks

Code should use a monospace font.

Code blocks should provide:

- Clear contrast
- Comfortable padding
- Readable line height
- Horizontal scrolling where required
- Copy action
- Syntax highlighting where appropriate

Do not make code blocks excessively decorative.

---

# 29. Documentation UI

Documentation should feel quieter than the components.

The component is the hero.

Documentation should use:

- Clear headings
- Consistent spacing
- Strong hierarchy
- Readable content width
- Minimal decoration

Avoid turning every documentation section into a visual showcase.

---

# 30. Navigation

Navigation should be:

- Simple
- Predictable
- Responsive
- Accessible

Component navigation should make categories and component names easy to find.

Avoid excessive navigation depth.

---

# 31. Interaction States

Interactive elements should support:

```text
Default
Hover
Active
Focus
Disabled
Loading
Selected
Error
Success
```

Not every component requires every state.

States should be visually distinct but consistent.

---

# 32. Hover

Hover effects should be subtle unless the component specifically demonstrates an expressive interaction.

Good hover effects include:

- Small translation
- Opacity change
- Border change
- Shadow change
- Scale
- Color transition

Avoid excessive scaling.

---

# 33. Active State

Active interactions should provide immediate feedback.

Examples:

- Press
- Click
- Drag
- Toggle

Animation should remain responsive.

---

# 34. Focus State

Every keyboard-accessible interactive element must have a visible focus state.

Focus should never rely exclusively on subtle color changes.

Focus indicators should have sufficient contrast.

---

# 35. Disabled State

Disabled components should:

- Communicate unavailable interaction
- Prevent unintended interaction
- Maintain readable content
- Avoid excessive opacity reduction

Do not make disabled elements completely disappear visually.

---

# 36. Reduced Motion

All motion-heavy Kibo components should respect:

```text
prefers-reduced-motion
```

When reduced motion is enabled:

- Reduce movement
- Remove unnecessary transitions
- Avoid continuous animations
- Preserve functionality
- Preserve important state changes

Reduced motion should not break the component.

---

# 37. Motion Language

Kibo motion should generally feel:

- Smooth
- Responsive
- Controlled
- Intentional

Avoid random motion.

Motion should have a reason.

Detailed motion rules are defined separately in:

```text
MOTION_GUIDELINES.md
```

---

# 38. Animation Timing

Use consistent timing concepts.

Semantic categories:

```text
Instant
Fast
Normal
Slow
Emphasis
```

Small UI interactions should generally be faster than large transitions.

Large visual transitions may use longer timing when appropriate.

Avoid unnecessarily slow interfaces.

---

# 39. Easing

Prefer natural easing.

Use:

- Ease-out for entrances
- Ease-in for exits
- Ease-in-out for state transitions
- Spring-based motion when physical behavior improves the interaction

Specific animation libraries may define their own implementation.

The visual result should remain consistent even when different animation technologies are used.

---

# 40. Responsive Design

Kibo components should adapt to:

```text
Mobile
Tablet
Desktop
Large Desktop
```

Use fluid sizing where possible.

Avoid unnecessary breakpoint-specific duplication.

Prefer CSS behavior that naturally adapts before introducing many media queries.

---

# 41. Touch Interaction

Interactive components must consider touch.

Avoid interactions that only work with:

- Hover
- Mouse movement
- Precise pointer positioning

If an interaction is inherently pointer-based, provide an appropriate fallback for touch devices.

---

# 42. Dark Mode

Kibo should support light and dark visual environments where applicable.

Components should not depend on hard-coded light-only colors.

Use semantic tokens.

Ensure:

- Text contrast
- Border visibility
- Focus visibility
- Surface hierarchy
- Shadows
- Interactive states

remain appropriate in both modes.

---

# 43. Visual Hierarchy

Every interface should clearly communicate:

```text
What is most important?
What is interactive?
What belongs together?
What can be ignored?
What changed?
```

Hierarchy should be established through:

- Size
- Weight
- Contrast
- Spacing
- Position
- Motion

Do not rely on color alone.

---

# 44. Density

Kibo should support both:

### Comfortable

Useful for:

- Documentation
- Forms
- Primary product UI

### Compact

Useful for:

- Toolbars
- Code tools
- Dense controls
- Developer utilities

Avoid extremely dense interfaces unless required.

---

# 45. Decorative Effects

Kibo components may use:

- Gradients
- Noise
- Glow
- Blur
- Grain
- Grid patterns
- Particles
- WebGL
- Shadows
- Glass effects

However, decorative effects should not reduce:

- Readability
- Performance
- Accessibility
- Usability

---

# 46. WebGL and Heavy Visual Effects

WebGL, Three.js, OGL, shaders, and similar technologies should be used intentionally.

Heavy visual effects should consider:

- Device capability
- Mobile performance
- Reduced motion
- GPU usage
- Memory
- Loading time

Provide reasonable fallbacks where practical.

---

# 47. Images and Assets

Images should:

- Have appropriate dimensions
- Avoid unnecessary file size
- Preserve quality
- Have meaningful alt text when informative

Decorative images should use empty alt text where appropriate.

---

# 48. Empty States

When an interface requires an empty state, it should:

- Explain what is missing
- Provide a useful next action
- Remain visually quiet

Avoid decorative empty states that provide no information.

---

# 49. Error States

Error states should:

- Clearly communicate the issue
- Explain what happened when useful
- Provide a recovery action when possible
- Preserve layout stability

Avoid technical error messages when a user-facing explanation is possible.

---

# 50. Loading States

Loading states should:

- Communicate that work is occurring
- Avoid unnecessary movement
- Preserve layout where possible
- Respect reduced motion

Use skeletons when they meaningfully improve perceived performance.

---

# 51. Accessibility Requirements

The design system requires:

- Adequate contrast
- Visible focus
- Keyboard accessibility
- Sufficient touch targets
- Semantic hierarchy
- Reduced-motion support
- Accessible labels
- Non-color-only communication

Accessibility is part of visual quality.

---

# 52. Design Consistency Rules

When designing a new Kibo component:

1. Reuse existing tokens.
2. Reuse existing interaction patterns.
3. Reuse existing spacing conventions.
4. Reuse existing typography.
5. Reuse existing semantic colors.
6. Avoid introducing a new visual language without a strong reason.
7. Prefer consistency over novelty.

---

# 53. When a Component Can Break the System

A component may intentionally break normal design-system rules when its purpose requires it.

Examples:

- Experimental WebGL components
- Physics-based components
- Creative cursor effects
- Artistic text effects
- Highly expressive hero components

However, the surrounding Kibo UI should remain consistent.

The exception should belong to the component, not spread to the entire platform.

---

# 54. Design Review Checklist

Before approving a component, verify:

- [ ] Visual hierarchy is clear
- [ ] Typography is readable
- [ ] Spacing is consistent
- [ ] Colors follow semantic tokens
- [ ] Contrast is sufficient
- [ ] Interactive states are visible
- [ ] Focus state exists
- [ ] Mobile layout works
- [ ] Dark mode works where applicable
- [ ] Motion feels intentional
- [ ] Reduced motion is supported
- [ ] Decorative effects do not harm usability
- [ ] Component preview clearly showcases the component

---

# 55. Design Decision Priority

When visual requirements conflict, use this priority:

```text
Accessibility
     ↓
Usability
     ↓
Clarity
     ↓
Performance
     ↓
Consistency
     ↓
Visual Polish
     ↓
Decoration
```

Visual polish should never override accessibility or usability.

---

# 56. Core Design Principle

Kibo should follow this principle:

> **The interface should feel simple even when the technology behind the component is complex.**

A component may use GSAP, WebGL, shaders, physics, or advanced rendering internally.

The user experience should still feel intuitive, controlled, and polished.
