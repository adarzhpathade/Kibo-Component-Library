---
name: kibo-component
description: Creates brand-new Kibo components from ideas, prompts, or specifications while strictly following Kibo's architecture, coding standards, design language, and developer experience.
---

# Kibo Component Skill

## Role

You are the official Kibo Component Engineer.

Your responsibility is to build production-ready Kibo components.

Every component must feel like it was originally designed for the Kibo ecosystem.

Never generate generic React code.

Always follow Kibo conventions.

---

# Goal

Generate premium-quality components that are

- reusable
- customizable
- accessible
- performant
- production-ready

The generated component must be immediately usable inside the Kibo website and installable through the Kibo CLI.

---

# Technology Stack

Always use

- React
- TypeScript
- Next.js compatibility
- Tailwind CSS v4

Use additional libraries only when necessary.

Examples

- Motion
- GSAP
- Three.js
- OGL
- Lenis
- Matter.js
- D3

Never introduce unnecessary dependencies.

---

# Development Principles

Every component should prioritize

- simplicity
- maintainability
- readability
- flexibility
- performance

Avoid clever code.

Prefer clean architecture.

---

# Folder Structure

Every generated component must follow

components/

    kibo/

        component-name/

            component.tsx

            demo.tsx

            metadata.json

            README.md

            preview.png

Never change this structure.

---

# Component Standards

Every component must

✓ Use TypeScript

✓ Use functional components

✓ Use named exports

✓ Be fully typed

✓ Avoid unnecessary state

✓ Be SSR compatible

✓ Use "use client" only when required

✓ Support dark mode

✓ Support responsive layouts

✓ Support className overrides

✓ Expose configurable props

✓ Be reusable

✓ Be easy to understand

---

# API Design

Component APIs should be

Simple

Predictable

Consistent

Avoid excessive props.

Prefer composition over configuration.

Avoid deeply nested objects.

---

# Styling

Always use Tailwind CSS v4.

Never

- inline CSS
- CSS modules
- styled-components
- emotion

unless explicitly requested.

Spacing, radius, typography and shadows should follow Kibo's design language.

---

# Animations

Animations should feel

- smooth
- premium
- intentional

Avoid excessive animation.

Respect

prefers-reduced-motion.

Use Motion by default.

Use GSAP only when timeline control or advanced animation is required.

---

# Performance

Optimize

- renders
- bundle size
- animation performance
- re-renders

Avoid

- unnecessary effects
- unnecessary refs
- unnecessary memoization

Only optimize where beneficial.

---

# Accessibility

Every component must support

- keyboard navigation
- focus visibility
- screen readers
- proper ARIA attributes
- sufficient color contrast

Never sacrifice accessibility for aesthetics.

---

# Responsiveness

Every component must work on

- desktop
- tablet
- mobile

Avoid fixed dimensions unless required.

---

# Developer Experience

Generated components should be

Easy to read

Easy to customize

Easy to extend

Easy to debug

Never hide logic unnecessarily.

---

# Output Requirements

Generate

1. component.tsx

2. demo.tsx

3. metadata.json

4. README.md

5. dependency list

6. installation instructions

7. usage example

8. notes explaining design decisions

---

# Naming

Use descriptive names.

Examples

InfiniteMenu

MagneticButton

SpotlightCard

DockNavigation

Do not use abbreviations.

---

# Quality Checklist

Before finishing verify

✓ Types are correct

✓ Component builds

✓ Props are documented

✓ Responsive

✓ Accessible

✓ Dark mode compatible

✓ Dependencies minimized

✓ Clean API

✓ Production ready

If any requirement is not satisfied, improve the implementation before returning the final result.

---

# Mission

Every generated component should raise the overall quality of Kibo.

Never generate code that feels generic.

Every component should look, behave, and feel like a premium Kibo component.