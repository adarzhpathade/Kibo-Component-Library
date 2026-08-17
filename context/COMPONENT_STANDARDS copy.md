# Kibo — Component Standards

> The engineering standard for every component that is created, imported, reviewed, documented, and distributed as part of Kibo.

---

# 1. Purpose

This document defines the minimum engineering and product standards that every Kibo component must follow.

It applies to:

- New components
- Imported components
- Free components
- Premium components
- Animated components
- WebGL components
- Interactive components
- Components distributed through the Kibo CLI

The goal is to ensure that every Kibo component is:

- Production-ready
- Consistent
- Accessible
- Responsive
- Performant
- Customizable
- Maintainable
- Type-safe
- Easy to install

---

# 2. Core Standard

A Kibo component must satisfy both:

```text
Visual Quality
+
Engineering Quality
=
Kibo Quality
```

A component should not be accepted only because it looks impressive.

It must also have a clean implementation, predictable behavior, proper accessibility, responsive behavior, and a useful developer API.

---

# 3. Technology Requirements

## Required

Kibo components should use:

- React
- TypeScript
- Tailwind CSS

Components should remain compatible with modern Next.js projects where practical.

---

# 4. React Standards

Components must use functional React components.

Preferred:

```tsx
export function MagneticButton() {
  return <button>...</button>;
}
```

Avoid unnecessary class components.

---

# 5. TypeScript Standards

All component source code must be TypeScript.

Do not use JavaScript for component implementation.

Avoid:

```ts
any
```

unless there is a genuinely unavoidable external typing limitation.

Prefer explicit and meaningful types.

Example:

```ts
interface MagneticButtonProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}
```

---

# 6. Props

Public props must be:

- Meaningful
- Typed
- Predictable
- Minimal
- Documented

Do not expose internal implementation details as public props unless there is a clear use case.

---

# 7. Props Naming

Use clear names.

Good:

```text
duration
strength
direction
intensity
disabled
className
children
```

Avoid:

```text
x1
val
cfg
thing
data2
```

Boolean props should generally communicate a state or capability.

Examples:

```text
disabled
loop
reverse
enabled
autoplay
```

---

# 8. Children

Use `children` when the component naturally contains user-provided content.

Example:

```tsx
<MagneticButton>
  Explore
</MagneticButton>
```

Do not require a string prop when arbitrary React content is appropriate.

Prefer:

```tsx
children: React.ReactNode
```

over:

```tsx
label: string
```

when the component can reasonably support rich content.

---

# 9. className

Reusable visual components should generally provide a `className` escape hatch.

Example:

```tsx
interface CardProps {
  className?: string;
}
```

The component should merge classes safely.

Do not make `className` override internal behavior in an unsafe way.

---

# 10. Component API Philosophy

Prefer:

```text
Simple API
+
Composition
+
Sensible defaults
```

Avoid:

```text
Huge configuration objects
+
Dozens of props
+
Hidden magic
```

A component should work well with its defaults.

---

# 11. Default Behavior

Every component should have useful defaults.

Example:

```tsx
<MagneticButton>
  Hover me
</MagneticButton>
```

should work without requiring extensive configuration.

Defaults should represent the intended Kibo experience.

---

# 12. Composition

Prefer composable components.

For example:

```tsx
<Card>
  <CardHeader />
  <CardContent />
  <CardFooter />
</Card>
```

when the structure genuinely benefits from composition.

Do not create multiple subcomponents merely for the sake of abstraction.

---

# 13. Server and Client Components

Kibo components should remain server-compatible where possible.

Only add:

```tsx
"use client";
```

when client-side behavior is actually required.

Client behavior commonly includes:

- Browser APIs
- State
- Effects
- Event listeners
- Animation libraries
- Canvas
- WebGL
- Pointer tracking

Do not use `"use client"` unnecessarily.

---

# 14. Browser APIs

Browser-only APIs must not execute during server rendering.

Examples:

```text
window
document
navigator
localStorage
matchMedia
requestAnimationFrame
ResizeObserver
IntersectionObserver
```

Guard browser-specific logic appropriately.

---

# 15. Hydration Safety

Components must avoid hydration mismatches.

Do not generate different initial markup on server and client unless the difference is intentionally managed.

Be particularly careful with:

- Random values
- Current timestamps
- Window dimensions
- Device detection
- Browser-only APIs
- Animation initialization

---

# 16. State Management

Use the smallest state required.

Prefer local state when state belongs only to the component.

Do not introduce global state for isolated component behavior.

Avoid state when derived values can be calculated directly.

---

# 17. Effects

Use `useEffect` only when synchronization with an external system is required.

Avoid effects for simple calculations that can happen during rendering.

Every effect should have:

- Clear purpose
- Correct dependencies
- Proper cleanup when necessary

---

# 18. Event Listeners

When adding global or DOM event listeners:

- Add them only when required.
- Remove them during cleanup.
- Avoid duplicate listeners.
- Avoid unnecessary global listeners.

Examples:

```text
mousemove
pointermove
scroll
resize
keydown
```

---

# 19. Animation Standards

Animation is allowed and encouraged when it improves the component.

Animation must be:

- Intentional
- Smooth
- Performant
- Responsive
- Accessible

Existing specialized GSAP skills should be used for GSAP-heavy components.

Do not duplicate GSAP implementation guidance unnecessarily inside component code.

---

# 20. Animation Libraries

Choose the smallest appropriate tool.

Possible choices:

```text
CSS
Motion
GSAP
Three.js
OGL
Lenis
Matter.js
```

Use CSS when CSS is sufficient.

Use Motion for common React motion patterns.

Use GSAP when advanced timelines, ScrollTrigger, complex sequencing, or GSAP-specific functionality is required.

Use WebGL libraries only when the component genuinely requires them.

---

# 21. Reduced Motion

Motion-heavy components must respect:

```text
prefers-reduced-motion
```

When reduced motion is requested:

- Reduce movement
- Disable unnecessary looping
- Reduce transition intensity
- Preserve functionality
- Avoid disorienting effects

---

# 22. Performance Standards

Avoid unnecessary:

- Re-renders
- DOM nodes
- Effects
- Event listeners
- Dependencies
- Layout calculations
- Animations
- Large assets

Do not optimize blindly.

Optimize meaningful bottlenecks.

---

# 23. Animation Performance

Prefer transform and opacity for frequently animated elements.

Avoid repeatedly animating expensive layout properties when possible.

Be careful with:

```text
width
height
top
left
margin
padding
```

for high-frequency animation.

Use appropriate animation techniques for the library being used.

---

# 24. React Rendering

Avoid premature use of:

```text
useMemo
useCallback
memo
```

Use them when they solve a real rendering or reference-stability problem.

Do not add memoization simply because a component is reusable.

---

# 25. Dependencies

Every dependency must have a reason.

Before adding a package ask:

1. Is it actually required?
2. Can the functionality reasonably be implemented without it?
3. Is the dependency appropriate for a component library?
4. Does it significantly increase bundle size?
5. Does Kibo already use a suitable dependency?

Never add duplicate libraries for the same responsibility without a strong reason.

---

# 26. Tailwind Standards

Kibo uses Tailwind CSS.

Prefer utility classes and the project's established styling conventions.

Avoid introducing:

- CSS modules
- styled-components
- emotion
- unnecessary global CSS

unless a component genuinely requires them.

---

# 27. Arbitrary Values

Arbitrary Tailwind values are allowed when the component genuinely needs a custom value.

However, do not use arbitrary values simply because a design token already exists.

Prefer existing Kibo tokens where possible.

---

# 28. Inline Styles

Avoid inline styles for normal styling.

Inline styles may be used when values are:

- Dynamic
- Calculated at runtime
- Required by a rendering API
- Necessary for canvas/WebGL
- Required by an animation system

Example:

```tsx
style={{
  transform: `translate3d(${x}px, ${y}px, 0)`
}}
```

is acceptable when the value is dynamically calculated.

---

# 29. Accessibility Standards

Every interactive component must consider:

- Keyboard interaction
- Focus visibility
- Semantic HTML
- Screen readers
- ARIA attributes
- Touch interaction
- Reduced motion
- Color contrast

Use semantic elements whenever possible.

Prefer:

```html
<button>
```

over:

```html
<div onClick={...}>
```

---

# 30. Keyboard Support

If an interaction can be performed with a pointer, determine whether keyboard access is required.

Interactive controls must be reachable and usable with the keyboard.

Do not create pointer-only critical interactions.

---

# 31. Focus

Interactive elements must have a visible focus state.

Do not remove browser focus indicators without providing an accessible replacement.

---

# 32. ARIA

Use ARIA only when necessary.

Prefer correct semantic HTML before adding ARIA.

Do not add arbitrary ARIA attributes simply to make a component appear more accessible.

---

# 33. Responsive Design

Components must work across:

- Mobile
- Tablet
- Desktop

Do not design exclusively for desktop.

Test:

- Narrow viewport
- Wide viewport
- Touch input
- Different content lengths

---

# 34. Content Flexibility

Components should not break when text changes.

Avoid unnecessary fixed heights.

Allow content to grow where practical.

Consider:

- Long labels
- Multiple lines
- Different languages
- Missing optional content

---

# 35. Dark Mode

Components should work in Kibo's supported visual modes where applicable.

Avoid hard-coded colors that only work on one background.

Use semantic styling conventions.

---

# 36. Ref Forwarding

Use ref forwarding when the component is expected to behave like a native interactive or DOM element and consumers reasonably need access to its underlying node.

Do not expose refs merely because it is possible.

---

# 37. HTML Attributes

Where appropriate, reusable components should allow relevant HTML attributes to pass through.

For example, a button component may support:

```tsx
type MagneticButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    strength?: number;
  };
```

Do not blindly expose incompatible attributes.

---

# 38. Data Attributes

Data attributes may be used when they improve:

- Styling
- State representation
- Testing
- Integration

Keep them predictable.

Avoid leaking unnecessary internal implementation details.

---

# 39. IDs

Do not generate unstable IDs during server rendering.

When unique IDs are required in React, prefer stable mechanisms such as:

```tsx
useId()
```

when appropriate.

---

# 40. File Naming

Component directories should use kebab-case.

Example:

```text
magnetic-button/
liquid-navbar/
spotlight-card/
```

Implementation files should follow the established Kibo component architecture.

Do not invent a new file naming pattern for individual components.

---

# 41. Export Naming

Use descriptive PascalCase component names.

Examples:

```text
MagneticButton
LiquidNavbar
SpotlightCard
InfiniteMenu
```

Avoid unclear abbreviations.

---

# 42. Import Rules

Prefer direct imports.

Avoid unnecessary barrel files when they negatively affect tree shaking or create circular dependencies.

Keep imports explicit and understandable.

---

# 43. Utilities

If multiple components genuinely require the same helper, consider moving it into a shared Kibo utility.

Do not create shared utilities prematurely.

A utility should have multiple real consumers or a clear architectural reason to exist.

---

# 44. Component-Specific Helpers

Keep helpers close to the component when they are only used by that component.

Example:

```text
magnetic-button/
├── component.tsx
├── magnetic-math.ts
└── demo.tsx
```

Avoid putting component-specific logic into global utilities.

---

# 45. Assets

Assets should be included only when required.

Examples:

- Images
- SVG
- Textures
- Shaders
- Fonts
- Videos

Assets should be optimized where practical.

Large assets should be justified.

---

# 46. WebGL Components

WebGL components require additional care.

They must consider:

- GPU cost
- Device capability
- Canvas sizing
- Resize handling
- Cleanup
- Context lifecycle
- Mobile performance
- Reduced motion
- Fallback behavior

Do not use WebGL for an effect that can be achieved efficiently with normal DOM/CSS techniques.

---

# 47. Canvas Components

Canvas components must properly handle:

- Resize
- Device pixel ratio
- Animation loop
- Cleanup
- Visibility
- Pointer interaction

Avoid uncontrolled animation loops.

---

# 48. Scroll Components

Scroll-driven components should consider:

- Scroll performance
- Cleanup
- Mobile behavior
- Reduced motion
- Layout shifts
- Smooth scrolling assumptions

Do not assume a specific smooth-scroll library exists in the user's project unless the component declares it as a dependency.

---

# 49. Pointer and Cursor Components

Pointer-based components must consider:

- Mouse
- Touch
- Pen
- Keyboard alternatives where appropriate
- Reduced motion

Do not make essential functionality inaccessible on touch devices.

---

# 50. Error Handling

Components should fail gracefully.

Avoid silent failures for important functionality.

Avoid throwing errors for normal user-controlled states.

When a dependency or browser capability is genuinely required, communicate the requirement clearly.

---

# 51. No Hidden Project Dependencies

A component must not depend on undocumented files from the Kibo website.

Do not reference:

```text
@/app/...
@/components/internal/...
@/lib/internal/...
```

unless those files are explicitly included in the component's registry manifest.

Installed components must have everything they need.

---

# 52. No Kibo Runtime Dependency

A normal Kibo component should not require the Kibo website to remain online after installation.

The installed source should work independently.

A remote service should only be required when the component's actual functionality requires one.

---

# 53. Component Isolation

A component should not unexpectedly modify:

- Global styles
- Global state
- Root layout
- Application routing
- User configuration

unless installation explicitly requires it and the behavior is documented.

---

# 54. Installation Safety

Components must be installable without destructive behavior.

The CLI should know:

- Which files belong to the component
- Which dependencies are required
- Which utilities are required
- Which assets are required

A component should never silently overwrite unrelated user code.

---

# 55. Documentation Requirements

Every publishable component must document:

- Name
- Description
- Installation
- Usage
- Props
- Dependencies
- Customization
- Accessibility
- Important limitations

Documentation must match the actual implementation.

Never document props or behavior that the component does not support.

---

# 56. Demo Requirements

Every component should have a representative demo.

The demo should:

- Show the intended behavior
- Use realistic content
- Demonstrate important interactions
- Remain simple enough to understand
- Not modify the production component unnecessarily

The demo is not the component itself.

---

# 57. Metadata Requirements

Every component prepared for the registry must have accurate metadata.

At minimum, metadata should identify:

- Name
- Slug
- Description
- Category
- Tags
- Version
- Dependencies
- Premium status
- Compatibility

Registry-specific requirements are defined in:

```text
REGISTRY_SPEC.md
```

---

# 58. Free and Premium Standards

Free and premium components follow the same engineering standards.

A premium component must not receive lower quality requirements.

The following remain mandatory for both:

- Type safety
- Accessibility
- Responsive behavior
- Performance
- Documentation
- Registry compatibility
- Code quality

The difference between free and premium primarily concerns distribution and access.

---

# 59. Imported Components

Imported or reference-based components must be normalized to Kibo standards.

Review:

- Naming
- Folder structure
- Dependencies
- Styling
- Accessibility
- Responsiveness
- API
- Documentation
- Registry metadata

Do not blindly preserve project-specific architecture from the reference implementation.

---

# 60. Code Quality

Prefer:

```text
Readable
Simple
Explicit
Composable
Maintainable
```

Avoid:

```text
Over-engineered
Duplicated
Unclear
Over-abstracted
Dependency-heavy
```

---

# 61. Comments

Comments should explain intent when the implementation is not obvious.

Good:

```tsx
// Keep the transform on the GPU to avoid layout recalculation during pointer movement.
```

Avoid comments that simply restate the code.

Bad:

```tsx
// Set x to 10
const x = 10;
```

---

# 62. Security

Components must not:

- Execute arbitrary user-provided code
- Inject unsafe HTML unnecessarily
- Include secrets
- Include API keys
- Include private credentials
- Download unknown scripts at runtime

Be particularly careful with:

```text
dangerouslySetInnerHTML
eval
new Function
remote script injection
```

---

# 63. Testing Expectations

Testing depth should depend on component complexity.

Simple components should at least be manually verified.

Complex components should be tested for:

- Interaction
- State
- Responsive behavior
- Accessibility
- Cleanup
- Browser behavior

The review process determines whether additional automated testing is required.

---

# 64. Browser Compatibility

Components should target modern browsers supported by the Kibo project.

Avoid unnecessary browser-specific hacks.

If a component requires a specific browser capability, document it.

---

# 65. Quality Gate

Before a component is published, verify:

```text
[ ] TypeScript is valid
[ ] React implementation is valid
[ ] Props are typed
[ ] Naming follows Kibo conventions
[ ] Styling follows Kibo conventions
[ ] Responsive behavior works
[ ] Accessibility requirements are met
[ ] Focus states exist
[ ] Reduced motion is supported where applicable
[ ] Dependencies are justified
[ ] No hidden project dependencies exist
[ ] No secrets exist
[ ] Demo works
[ ] Documentation matches implementation
[ ] Metadata is complete
[ ] Registry requirements are satisfied
[ ] CLI installation requirements are satisfied
[ ] Performance is acceptable
```

---

# 66. Definition of Done

A component is considered complete only when:

1. Implementation is finished.
2. API is stable.
3. Styling is consistent.
4. Accessibility has been considered.
5. Responsive behavior works.
6. Animation is performant.
7. Dependencies are justified.
8. Demo is ready.
9. Documentation is ready.
10. Metadata is ready.
11. Registry information is valid.
12. The component can be distributed through the Kibo workflow.

---

# 67. Core Rule

> **A Kibo component should be easy to install, easy to understand, easy to customize, and safe to ship.**

Visual complexity is allowed.

Engineering complexity should only exist when it provides real value.
