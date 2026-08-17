# Kibo — Project Overview

## 1. Project Identity

**Name:** Kibo

**Type:** Modern React Component Library

**Primary ecosystem:**
- React
- Next.js
- TypeScript
- Tailwind CSS

Kibo is a modern, motion-focused component library that provides polished, production-ready UI components for React developers.

Kibo focuses on **components**, not complete website templates or page builders.

The primary goal is to let developers discover a component, preview it, install it with a simple command, and receive the component's source code directly inside their own project.

---

## 2. Vision

Kibo aims to become a high-quality component ecosystem for developers who care about both **visual quality and engineering quality**.

The core experience should be:

```text
Discover
   ↓
Preview
   ↓
Understand
   ↓
Install
   ↓
Customize
   ↓
Ship
```

Kibo should remove the need for developers to repeatedly build sophisticated UI interactions from scratch while still giving them complete control over the resulting code.

---

## 3. Mission

Kibo exists to provide developers with:

- High-quality React components
- Beautiful interactions
- Production-ready implementations
- Strong accessibility
- Responsive behavior
- Clean TypeScript
- Simple installation
- Source-code ownership
- Clear documentation
- Component-specific dependencies

The goal is not simply to provide attractive UI snippets.

The goal is to provide components that developers can confidently use in real products.

---

# 4. Core Product Philosophy

Kibo is built around the following principles.

## 4.1 Component First

The component is always the center of the product.

The website, registry, CLI, documentation, and distribution system all exist to make components easier to discover, understand, install, and use.

---

## 4.2 Source Code Ownership

Kibo follows a source-code distribution model.

When a developer installs:

```bash
npx kibo add magnetic-button
```

the component source code is placed inside the developer's project.

The developer should be able to:

- Modify it
- Restyle it
- Extend it
- Remove it
- Change its animation
- Integrate it with their own architecture

Kibo should not unnecessarily hide the component behind a runtime package.

---

## 4.3 Beautiful by Default

Components should look polished without requiring extensive customization.

Visual quality includes:

- Layout
- Typography
- Spacing
- Color
- Interaction
- Animation
- Responsive behavior
- Micro-interactions

---

## 4.4 Customizable by Design

Kibo components should be easy to modify.

Developers should be able to customize:

- Colors
- Typography
- Spacing
- Content
- Animation
- Timing
- Sizes
- Variants
- Layout

Avoid APIs containing excessive configuration options.

Prefer simple props and composition.

---

## 4.5 Motion With Purpose

Animation is an important part of Kibo's identity.

Motion should improve:

- Interaction
- Feedback
- Hierarchy
- State communication
- Spatial understanding

Animation should not exist only for decoration.

---

## 4.6 Performance Matters

Visual quality should not require unnecessary performance costs.

Every component should consider:

- Bundle size
- Runtime JavaScript
- DOM complexity
- Rendering behavior
- Animation performance
- Memory usage
- Asset size
- Dependency size

Heavy technologies should only be used when their functionality justifies them.

---

## 4.7 Accessibility Matters

Accessibility is a required part of Kibo component quality.

Components should consider:

- Keyboard navigation
- Focus management
- Semantic HTML
- ARIA attributes
- Screen readers
- Color contrast
- Reduced motion
- Touch targets

Visual effects should never completely prevent access to functionality.

---

# 5. Target Audience

## Primary Audience

### React Developers

Developers using React or Next.js who want polished components without sacrificing source-code control.

### Creative Developers

Developers building:

- Portfolio websites
- Agency websites
- Product websites
- SaaS interfaces
- Interactive landing pages
- Experimental websites

### Frontend Engineers

Developers who care about:

- TypeScript
- Component architecture
- Accessibility
- Performance
- Maintainability
- Developer experience

## Secondary Audience

### Students and Beginners

Developers who want to:

- Study modern React implementations
- Learn animation techniques
- Understand component architecture
- Experiment with UI

---

# 6. What Kibo Provides

Kibo primarily provides:

1. React components
2. Component documentation
3. Component demonstrations
4. Component registry
5. Kibo CLI
6. Free components
7. Premium components

The component remains the central product.

---

# 7. What Kibo Is Not

Kibo is intentionally component-focused.

Kibo is not primarily:

- A website builder
- A no-code editor
- A page builder
- A complete SaaS boilerplate
- A template marketplace
- A design tool
- A Figma replacement
- A full application generator

Templates or larger resources may be considered later, but they are not part of the core Kibo identity.

---

# 8. Technology Direction

The primary ecosystem is:

- React
- Next.js
- TypeScript
- Tailwind CSS

Additional libraries may be used when they provide meaningful functionality.

Possible technologies include:

- GSAP
- Motion
- Three.js
- React Three Fiber
- OGL
- Lenis
- Matter.js
- D3

Dependencies should remain **component-specific**.

A component should not require a large collection of libraries when only one small dependency is necessary.

---

# 9. Animation Ecosystem

Kibo is a motion-focused component library.

Possible animation technologies include:

- GSAP
- Motion
- GSAP ScrollTrigger
- Three.js
- React Three Fiber
- OGL
- Lenis
- Matter.js
- WebGL

Existing specialized GSAP skills should be reused instead of duplicating GSAP-specific knowledge inside Kibo skills.

Relevant existing skills may include:

```text
gsap-core
gsap-frameworks
gsap-performance
gsap-plugins
gsap-react
gsap-scrolltrigger
gsap-timeline
gsap-utils
```

Kibo-specific skills should focus on Kibo architecture and delegate specialized animation knowledge where appropriate.

---

# 10. Component Development Model

Every component should follow the same overall lifecycle:

```text
Idea / Reference
      ↓
Implementation
      ↓
Design Review
      ↓
Code Review
      ↓
Documentation
      ↓
Registry
      ↓
Validation
      ↓
Publication
```

For an external reference:

```text
Reference URL
      ↓
Analyze
      ↓
Check licensing / redistribution rights
      ↓
Adapt or independently implement
      ↓
Apply Kibo standards
      ↓
Review
      ↓
Document
      ↓
Registry
      ↓
Publish
```

---

# 11. Reference Component Workflow

Kibo may use publicly available components as references during development.

A reference component should first be analyzed for:

- Visual behavior
- Interaction
- Animation
- Dependencies
- Accessibility
- Responsive behavior
- Browser requirements
- License and redistribution permissions

If source redistribution is permitted, it may be incorporated according to the applicable license.

If redistribution is not permitted, the implementation should be independently recreated based on functionality and behavior.

Do not intentionally remove legally required attribution or license information from redistributed source code.

The final component should be adapted to Kibo's architecture and standards.

---

# 12. Component Distribution Model

Kibo uses source-code distribution.

The simplified architecture is:

```text
Kibo Website
     ↓
Kibo Registry
     ↓
Kibo CLI
     ↓
Developer Project
```

The CLI determines what needs to be installed based on registry information.

A component may require:

- Component source files
- Utility files
- Hooks
- Assets
- npm dependencies
- Configuration

The CLI should handle these requirements automatically where possible.

---

# 13. Free Components

Free components are publicly installable.

Example:

```bash
npx kibo add magnetic-button
```

A free component may have metadata such as:

```json
{
  "name": "magnetic-button",
  "premium": false
}
```

Free components should not require payment for normal installation.

---

# 14. Premium Components

Kibo may offer premium components.

Example:

```json
{
  "name": "liquid-navbar",
  "premium": true
}
```

The component architecture should remain consistent between free and premium components.

The major difference occurs during distribution.

Conceptually:

```text
FREE

CLI
 ↓
Public Registry
 ↓
Component Files
 ↓
Developer Project
```

```text
PRO

CLI
 ↓
Authentication
 ↓
License Verification
 ↓
Private Registry / Storage
 ↓
Component Files
 ↓
Developer Project
```

Premium architecture is defined separately in:

```text
PREMIUM_SYSTEM.md
```

---

# 15. Free vs Premium During Development

There should be minimal difference between creating free and premium components.

Both should follow:

- The same component standards
- The same architecture
- The same design system
- The same documentation standards
- The same review process
- The same registry structure

The primary distinction is metadata and distribution.

Example:

```json
{
  "name": "magnetic-button",
  "premium": false
}
```

```json
{
  "name": "liquid-navbar",
  "premium": true
}
```

This keeps development simple and prevents the codebase from becoming unnecessarily divided.

---

# 16. Kibo CLI

The Kibo CLI is the primary component installation mechanism.

Core command:

```bash
npx kibo add <component>
```

Potential commands include:

```bash
npx kibo init

npx kibo add <component>

npx kibo remove <component>

npx kibo update

npx kibo list

npx kibo search <query>

npx kibo doctor

npx kibo login

npx kibo logout
```

The CLI should:

1. Detect the project.
2. Detect package manager.
3. Read registry information.
4. Resolve the component.
5. Resolve dependencies.
6. Create required folders.
7. Copy required source files.
8. Install dependencies.
9. Handle conflicts safely.
10. Report the result clearly.

---

# 17. Component Installation Philosophy

Installation should be as simple as possible.

Example:

```bash
npx kibo add magnetic-button
```

The developer should not have to manually:

- Create component folders
- Copy source files
- Find helper files
- Search for dependencies
- Configure basic installation requirements

The CLI should handle these tasks.

---

# 18. Component Ownership After Installation

Once installed, the component becomes part of the developer's project.

Kibo should not require the developer to maintain a runtime connection to Kibo for normal component functionality.

The component should continue functioning independently after installation.

---

# 19. Registry

The Kibo Registry is the source of truth for component distribution.

Registry information may include:

- Name
- Slug
- Description
- Category
- Tags
- Version
- Files
- Dependencies
- Peer dependencies
- Assets
- Compatibility
- Premium status

The registry should contain enough information for the CLI to install a component automatically.

The registry specification is defined separately in:

```text
REGISTRY_SPEC.md
```

---

# 20. Storage Direction

Kibo may use object storage such as Cloudflare R2 for component distribution.

Storage should be separated from the public documentation website.

The architecture should allow Kibo to:

- Store component files
- Store metadata
- Serve files efficiently
- Protect premium components
- Scale independently
- Deliver files globally

The exact storage architecture is defined by the registry and premium system specifications.

---

# 21. Website Philosophy

The Kibo website exists primarily to showcase and document components.

The component should remain the visual focus.

A typical component page should contain:

```text
Component Name

Description

Live Component Preview

Installation

Usage

Props

Customization

Dependencies

Accessibility
```

Avoid excessive marketing content that distracts from the component.

---

# 22. Component Page Experience

A developer should be able to visit a component page and immediately understand:

- What the component does
- What it looks like
- How to install it
- What dependencies it uses
- How to use it
- How to customize it
- Whether it is free or premium

The component preview should be the most important visual element.

---

# 23. Documentation Philosophy

Documentation should be:

- Clear
- Concise
- Practical
- Consistent
- Developer-focused

Every component should document:

- Description
- Installation
- Usage
- Props
- Dependencies
- Customization
- Accessibility
- Important implementation notes

Documentation rules are defined in the Kibo documentation skill and related context files.

---

# 24. Design Philosophy

Kibo should have a recognizable visual identity.

The visual language should be:

- Modern
- Premium
- Minimal
- Refined
- Motion-focused
- Developer-oriented

The exact visual tokens and rules belong in:

```text
DESIGN_SYSTEM.md
```

---

# 25. Accessibility Philosophy

Every component should be evaluated for:

- Keyboard interaction
- Focus visibility
- Semantic structure
- Screen reader behavior
- ARIA usage
- Contrast
- Reduced motion
- Touch interaction

Accessibility should be considered during implementation, not added after completion.

---

# 26. Responsive Philosophy

Every component should support:

- Mobile
- Tablet
- Desktop

Components should not depend on a single viewport size.

Responsive behavior should be part of the implementation.

---

# 27. Developer Experience

Kibo should prioritize a simple workflow:

```text
Discover
   ↓
Preview
   ↓
Install
   ↓
Use
   ↓
Customize
```

The developer should not need to understand Kibo's internal infrastructure to use a component.

Errors should be:

- Clear
- Actionable
- Human-readable

---

# 28. Quality Standard

A Kibo component should be:

- Production-ready
- Typed
- Responsive
- Accessible
- Performant
- Customizable
- Documented
- Registry-compatible
- CLI-installable
- Consistent with Kibo's design language

A component that only looks good but fails the engineering requirements is not considered production-ready.

---

# 29. AI-Assisted Development

Kibo is designed to work with AI-assisted development workflows.

AI agents and skills should use Kibo context files as the project's source of truth.

AI should:

- Follow established architecture
- Follow naming conventions
- Follow component standards
- Reuse existing utilities
- Respect dependency policy
- Preserve accessibility
- Preserve performance
- Avoid unnecessary changes
- Avoid inventing new conventions
- Reuse existing specialized skills

The AI should inspect the existing project before creating new architecture.

---

# 30. Existing Kibo Skills

Kibo-specific skills include:

```text
kibo-import
kibo-component
kibo-design
kibo-registry
kibo-docs
kibo-cli
kibo-review
```

Existing specialized skills may also be available for GSAP and other technical domains.

Kibo-specific skills should not duplicate specialized knowledge unnecessarily.

---

# 31. Project Context Files

The project uses specialized context files.

```text
context/
├── PROJECT_OVERVIEW.md
├── DESIGN_SYSTEM.md
├── COMPONENT_STANDARDS.md
├── COMPONENT_ARCHITECTURE.md
├── REGISTRY_SPEC.md
├── CLI_SPEC.md
├── PREMIUM_SYSTEM.md
├── WEBSITE_ARCHITECTURE.md
├── DEVELOPMENT_GUIDELINES.md
├── DEPENDENCY_POLICY.md
├── NAMING_CONVENTIONS.md
├── MOTION_GUIDELINES.md
├── ROADMAP.md
└── AI_RULES.md
```

`PROJECT_OVERVIEW.md` defines the high-level product direction.

More specialized files define detailed rules for their respective domains.

---

# 32. Scope Boundaries

## Core Scope

Kibo focuses on:

- React components
- Next.js-compatible components
- Animated components
- Interactive components
- WebGL components
- UI effects
- Component documentation
- Component registry
- CLI installation
- Free components
- Premium components

## Outside Core Scope

Unless explicitly added later:

- Complete templates
- Page builders
- No-code tools
- Full application generators
- SaaS boilerplates
- Design editors
- Figma replacement tools

---

# 33. Long-Term Direction

Kibo should grow without losing its component-first identity.

Potential future capabilities may include:

- More component categories
- Advanced animation components
- WebGL components
- Premium collections
- Better CLI tooling
- Component versioning
- Component updates
- Community contributions
- Better component discovery
- Improved documentation

Future features must strengthen the core product instead of distracting from it.

---

# 34. Core Principles

The following principles should guide Kibo decisions:

1. **Components First**
2. **Source Code Ownership**
3. **Beautiful by Default**
4. **Customizable by Design**
5. **Motion With Purpose**
6. **Performance Matters**
7. **Accessibility Matters**
8. **Simple Installation**
9. **Consistent Architecture**
10. **Quality Over Quantity**

---

# 35. Definition of a Kibo Component

A component is considered ready for Kibo when it is:

```text
Technically Sound
       +
Visually Polished
       +
Responsive
       +
Accessible
       +
Customizable
       +
Documented
       +
Registry Compatible
       +
CLI Installable
       +
Kibo Consistent
```

Only components meeting the project's quality requirements should be published.

---

# 36. Final Product Principle

Kibo should make this workflow possible:

```text
Find a beautiful component.
        ↓
Understand it quickly.
        ↓
Install it with one command.
        ↓
Receive the source code.
        ↓
Own the implementation.
        ↓
Customize it freely.
        ↓
Ship it confidently.
```

Every part of Kibo should optimize for this experience.
