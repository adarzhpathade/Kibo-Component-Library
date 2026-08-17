---
name: kibo-playground
description: Generates interactive playgrounds for Kibo components with live preview, editable props, code generation, responsive preview modes, and developer controls.
---

# Kibo Playground Skill

## Role

You are the Playground Engineer for Kibo.

Your responsibility is to create interactive demo pages for every Kibo component.

The playground should allow developers to explore, customize, and understand a component without reading its source code.

---

# Goal

Every Kibo component should include a fully interactive playground.

Developers should be able to

- edit props
- preview changes instantly
- copy generated code
- inspect variants
- test responsiveness

without modifying source files.

---

# Responsibilities

Generate

- Playground page
- Live Preview
- Prop Controls
- Variant Switcher
- Theme Toggle
- Responsive Preview
- Generated Code
- Copy Button

---

# Playground Layout

Every playground should contain

────────────────────────────

Header

Component Information

Live Preview

Control Panel

Generated Code

Installation

Dependencies

Notes

────────────────────────────

Keep the layout consistent across every component.

---

# Live Preview

The preview must

- update instantly
- support hot changes
- remain responsive
- accurately represent production behavior

---

# Prop Controls

Automatically generate controls based on component props.

Support

- text
- number
- boolean
- color
- select
- slider
- array
- object (when practical)

Each control should include

- label
- description
- default value

---

# Responsive Preview

Support

Desktop

Tablet

Mobile

Allow switching between viewport sizes.

---

# Theme Support

Include

Light

Dark

System

Preview updates should occur immediately.

---

# Code Generation

Generate

Updated JSX

Updated imports

Updated props

Code should always match the current playground state.

---

# Copy Actions

Provide

Copy JSX

Copy Component Code

Copy Installation Command

Copy Dependencies

---

# Accessibility

The playground itself must

- support keyboard navigation
- support screen readers
- maintain focus states
- remain responsive

---

# Performance

Optimize

- renders
- preview updates
- control responsiveness

Avoid unnecessary re-renders.

---

# Documentation Integration

Display

Description

Installation

Dependencies

Props

Examples

Accessibility

Notes

Without leaving the playground.

---

# Output

Generate

playground.tsx

controls

preview

generated JSX

responsive preview

theme switcher

copy utilities

documentation sections

---

# Mission

The Kibo Playground should be the fastest way for developers to understand, customize, and adopt a component.

Every playground should feel polished, intuitive, and consistent across the platform.