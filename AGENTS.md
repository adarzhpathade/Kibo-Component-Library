# Kibo — AI Agent Instructions

> Primary operating guide for AI coding agents working inside the Kibo repository.

## 1. Mission

Kibo is a modern, motion-focused React component library. Its core experience is:

```text
Discover → Preview → Understand → Install → Customize → Ship
```

The component is the center of the product.

Optimize for:
- Beautiful components
- Clean code
- Easy installation
- Developer ownership
- Accessibility
- Performance
- Maintainability

## 2. Read Context First

Before making meaningful changes, inspect the relevant files in:

```text
context/
```

Core context:

```text
PROJECT_OVERVIEW.md
DESIGN_SYSTEM.md
COMPONENT_STANDARDS.md
COMPONENT_ARCHITECTURE.md
REGISTRY_SPEC.md
```

Additional context may include:

```text
CLI_SPEC.md
PREMIUM_SYSTEM.md
WEBSITE_ARCHITECTURE.md
DEVELOPMENT_GUIDELINES.md
DEPENDENCY_POLICY.md
NAMING_CONVENTIONS.md
MOTION_GUIDELINES.md
ROADMAP.md
AI_RULES.md
```

Use the most specific context file for the task.

## 3. Instruction Priority

Use this priority:

1. Explicit user request
2. Existing project implementation
3. Relevant Kibo context files
4. Relevant Kibo skills
5. Specialized technical skills
6. General engineering best practices

Do not override an explicit user requirement without explaining a concrete technical problem.

## 4. Understand Before Changing

Before modifying code:

1. Inspect the existing structure.
2. Identify the relevant component.
3. Read surrounding implementation.
4. Check existing utilities and dependencies.
5. Read relevant context.
6. Make the smallest appropriate change.

Do not rewrite working code unnecessarily.

## 5. Minimal Change Principle

Do not:
- Rewrite unrelated components
- Rename unrelated files
- Reformat the entire project
- Upgrade dependencies unnecessarily
- Introduce architecture without need
- Remove working functionality
- Change established conventions without justification

## 6. Component Standards

Every Kibo component should be:

- Production-ready
- Reusable
- Customizable
- Responsive
- Accessible
- Performant
- Typed
- Documented
- CLI-installable
- Registry-compatible

Follow:

```text
context/COMPONENT_STANDARDS.md
context/COMPONENT_ARCHITECTURE.md
```

## 7. Source-Code Ownership

Kibo uses source-code distribution.

After:

```bash
npx kibo add component-name
```

the component becomes part of the user's project.

Do not introduce an unnecessary Kibo runtime dependency.

## 8. Architecture

A simple component normally resembles:

```text
component-name/
├── component.tsx
├── demo.tsx
├── metadata.json
├── README.md
└── preview.png
```

Additional files are allowed when genuinely required.

Do not create unnecessary files.

## 9. Naming

Component directories use kebab-case:

```text
magnetic-button
spotlight-card
liquid-navbar
```

React components use PascalCase:

```text
MagneticButton
SpotlightCard
LiquidNavbar
```

Follow the project's naming context when available.

## 10. React and TypeScript

Use functional React components and TypeScript.

Prefer named exports.

Avoid `any` unless unavoidable.

Use `"use client"` only when client-side behavior is required.

Public props must be typed, predictable, minimal, and documented.

## 11. Styling

Follow:

```text
context/DESIGN_SYSTEM.md
context/COMPONENT_STANDARDS.md
```

Do not invent arbitrary colors, spacing, radius, typography, or visual conventions when established tokens exist.

If the official Kibo design has not yet established a value, do not permanently hard-code guessed design tokens without a reason.

## 12. Accessibility

Accessibility is mandatory.

Consider:
- Semantic HTML
- Keyboard navigation
- Focus visibility
- Screen readers
- Appropriate ARIA
- Color contrast
- Touch targets
- Reduced motion

Prefer semantic HTML over unnecessary ARIA.

## 13. Responsive Design

Components must work across mobile, tablet, and desktop.

Check:
- Narrow layouts
- Long content
- Touch interaction
- Overflow
- Different content lengths

## 14. Animation

Motion is important to Kibo.

Animation should be:
- Intentional
- Smooth
- Responsive
- Performant
- Accessible

Respect `prefers-reduced-motion`.

Do not add animation merely for decoration.

## 15. GSAP Skills

Existing specialized GSAP skills should be reused rather than duplicated:

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

Use the relevant specialized skill for GSAP-heavy work.

## 16. Dependencies

Before adding a dependency, determine:

1. Is it actually required?
2. Can it reasonably be avoided?
3. Does Kibo already have a suitable solution?
4. Does it add significant bundle cost?
5. Is it appropriate for source-distributed components?

Do not add packages for convenience alone.

## 17. Component Isolation

Do not secretly depend on:

```text
Kibo website state
Kibo routes
Kibo-only providers
Undocumented global CSS
Undocumented environment variables
Hidden website utilities
```

Required dependencies must be explicit.

## 18. Browser APIs and Cleanup

Handle browser-only APIs safely:

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

Clean up:
- Event listeners
- Timers
- Observers
- Animation loops
- GSAP contexts
- Subscriptions
- WebGL resources

## 19. Performance

Avoid unnecessary:
- Re-renders
- Effects
- DOM nodes
- Event listeners
- Layout calculations
- Dependencies
- Large assets

Do not prematurely optimize without a reason.

## 20. Imported Components

For external references:

1. Inspect the source.
2. Understand the behavior.
3. Check licensing and redistribution rights.
4. Identify dependencies and assets.
5. Adapt to Kibo architecture.
6. Normalize naming and styling.
7. Normalize the API.
8. Add metadata and documentation.
9. Review the result.

Do not blindly copy an external project's architecture.

Do not remove legally required attribution or license information.

If redistribution is not permitted, independently implement the behavior instead.

## 21. Free and Premium

Free and premium components use the same engineering standards.

Premium status is primarily a distribution/access concern.

Example:

```json
{
  "premium": false
}
```

or:

```json
{
  "premium": true
}
```

Do not create separate source architectures solely because a component is premium.

## 22. Registry

When creating or modifying a publishable component, follow:

```text
context/REGISTRY_SPEC.md
```

Registry data must match the actual implementation.

Never claim dependencies or files that do not exist.

## 23. Documentation

Publishable components require accurate documentation covering:

- Description
- Installation
- Usage
- Props
- Dependencies
- Customization
- Accessibility
- Important limitations

Documentation must match implementation.

## 24. CLI Compatibility

Components should eventually support:

```bash
npx kibo add component-name
```

Registry information must identify:
- Files
- Target paths
- Dependencies
- Assets
- Compatibility
- Premium status
- Installation requirements

## 25. Security

Never commit:
- API keys
- Passwords
- Private tokens
- Authentication secrets
- Payment secrets
- Cloud credentials
- License secrets

Be careful with:

```text
dangerouslySetInnerHTML
eval
new Function
remote script injection
```

## 26. Testing and Verification

Before declaring a task complete:

- Check TypeScript errors
- Run relevant tests when available
- Run lint when available
- Verify component behavior
- Verify responsive behavior
- Check accessibility when relevant
- Verify imports
- Verify dependencies
- Verify metadata when applicable

Never claim a command or test was run if it was not.

## 27. Existing Code Takes Precedence

Before creating a new utility, hook, component, dependency, pattern, or configuration:

1. Search the repository.
2. Check existing context.
3. Reuse existing architecture where appropriate.

Avoid duplicate systems.

## 28. User Scope

Follow the requested scope.

If the user asks for one component, do not redesign the entire library.

If the user asks for a visual change, do not rewrite architecture unless necessary.

If the user asks for a bug fix, fix the bug before unrelated improvements.

## 29. Design Changes

For visual work, follow:

```text
context/DESIGN_SYSTEM.md
```

If the user supplies a new official Kibo design, treat that design as the visual source of truth and update the design context accordingly.

## 30. Skill Delegation

Use specialized skills for specialized work:

```text
Reference adaptation → kibo-import
Component creation   → kibo-component
Visual consistency   → kibo-design
Registry             → kibo-registry
Documentation        → kibo-docs
CLI                  → kibo-cli
Quality review       → kibo-review
GSAP                 → relevant GSAP skill
```

Do not duplicate specialized knowledge unnecessarily.

## 31. Final Quality Gate

Before publishing a component, verify:

```text
[ ] TypeScript is valid
[ ] API is clear
[ ] Naming is correct
[ ] Styling follows Kibo
[ ] Responsive behavior works
[ ] Accessibility is addressed
[ ] Reduced motion is addressed where relevant
[ ] Dependencies are justified
[ ] No hidden dependencies exist
[ ] No secrets exist
[ ] Demo works
[ ] Documentation matches implementation
[ ] Metadata is accurate
[ ] Registry requirements are satisfied
[ ] CLI requirements are satisfied
[ ] Performance is acceptable
```

## 32. Absolute Rules

Always:
- Follow explicit user requirements.
- Read relevant context.
- Preserve project conventions.
- Keep components portable.
- Keep APIs simple.
- Respect accessibility.
- Respect performance.
- Keep dependencies justified.
- Preserve required licenses and attribution.
- Keep registry data accurate.
- Keep documentation accurate.
- Reuse existing skills and utilities.
- Verify changes before declaring completion.

Never:
- Invent hidden dependencies.
- Add unnecessary packages.
- Expose secrets.
- Remove required attribution.
- Overwrite unrelated user code.
- Introduce unnecessary architecture.
- Claim unverified results.
- Treat a component as complete solely because it looks good.

## 33. Final Principle

> **Build Kibo components as if they will be installed into a stranger's production application tomorrow.**

Every component should be understandable, portable, customizable, accessible, performant, and safe to distribute.
