# Kibo — Registry Specification

> The source of truth for how Kibo components are identified, described, versioned, stored, validated, and distributed through the Kibo CLI.

---

# 1. Purpose

The Kibo Registry connects the component library with the Kibo CLI.

It tells the CLI:

- Which components exist
- Where they belong
- Which files they require
- Which dependencies they use
- Which version is available
- Whether the component is free or premium
- Which framework requirements apply
- Which assets must be installed
- How the component should be installed

The registry must contain enough information for the CLI to install a component without guessing.

---

# 2. Registry Philosophy

The registry should be:

- Machine-readable
- Predictable
- Versioned
- Validatable
- Extensible
- Framework-aware
- CLI-compatible

The registry is infrastructure.

It should not contain application logic.

---

# 3. Registry Architecture

Conceptually:

```text
Kibo Components
       ↓
Registry Generation
       ↓
Registry Data
       ↓
Kibo API / Distribution Layer
       ↓
Kibo CLI
       ↓
Developer Project
```

The registry describes what should be installed.

The storage layer determines where files are physically served from.

The CLI performs the installation.

---

# 4. Component Identity

Every component must have a unique slug.

Example:

```text
magnetic-button
spotlight-card
infinite-menu
liquid-navbar
```

The slug should:

- Be lowercase
- Use kebab-case
- Be URL-safe
- Be CLI-safe
- Remain stable after publication

Example:

```bash
npx kibo add magnetic-button
```

The slug should not change casually after publication.

---

# 5. Display Name

The registry may contain a human-readable name.

Example:

```json
{
  "name": "Magnetic Button",
  "slug": "magnetic-button"
}
```

The display name may contain spaces and capitalization.

The slug is the stable machine identifier.

---

# 6. Registry Entry

A component should have a registry entry similar to:

```json
{
  "name": "Magnetic Button",
  "slug": "magnetic-button",
  "description": "A button with magnetic pointer interaction.",
  "version": "1.0.0",
  "category": "buttons",
  "tags": [
    "button",
    "magnetic",
    "cursor",
    "interaction"
  ],
  "premium": false,
  "files": [],
  "dependencies": {},
  "peerDependencies": {},
  "compatibility": {}
}
```

The exact schema may evolve, but backward compatibility should be considered when making changes.

---

# 7. Required Fields

Every registry entry must contain, at minimum:

```text
name
slug
description
version
category
tags
premium
files
dependencies
compatibility
```

Additional fields may be required for specific component types.

---

# 8. Description

The description should explain what the component does in one or two concise sentences.

Good:

```text
A magnetic button that subtly follows the user's pointer.
```

Avoid:

```text
An amazing revolutionary premium next-generation button experience.
```

Descriptions should be factual and useful.

---

# 9. Categories

Every component must belong to a primary category.

Possible categories include:

```text
buttons
cards
navigation
hero
text
backgrounds
cursor
forms
loaders
menus
modals
inputs
effects
scroll
animation
layout
webgl
3d
media
feedback
other
```

Categories may evolve as the library grows.

A component should have one primary category.

---

# 10. Tags

Components may have multiple tags.

Example:

```json
{
  "tags": [
    "magnetic",
    "hover",
    "cursor",
    "animation",
    "button"
  ]
}
```

Tags should describe actual capabilities.

Do not add unrelated keywords for search manipulation.

---

# 11. Versioning

Kibo components use semantic versioning.

Format:

```text
MAJOR.MINOR.PATCH
```

Example:

```text
1.0.0
```

---

# 12. Version Rules

### Patch

Use for:

- Bug fixes
- Small implementation fixes
- Non-breaking performance improvements
- Documentation corrections

Example:

```text
1.0.0 → 1.0.1
```

### Minor

Use for:

- New backward-compatible features
- New optional props
- New variants
- New capabilities

Example:

```text
1.0.0 → 1.1.0
```

### Major

Use for:

- Breaking API changes
- Removed props
- Changed required dependencies
- Breaking installation changes

Example:

```text
1.0.0 → 2.0.0
```

---

# 13. Premium Flag

Every component must explicitly declare whether it is premium.

Free:

```json
{
  "premium": false
}
```

Premium:

```json
{
  "premium": true
}
```

Do not infer premium status from folder location.

The registry is the authoritative source for distribution classification.

---

# 14. Free and Premium Architecture

Free and premium components use the same component architecture.

Example:

```text
components/
├── magnetic-button/
├── spotlight-card/
├── liquid-navbar/
└── infinite-gallery/
```

Premium status is metadata.

This prevents the source code architecture from becoming unnecessarily divided.

---

# 15. Files

The registry must identify every file required for installation.

Example:

```json
{
  "files": [
    {
      "source": "component.tsx",
      "target": "components/kibo/magnetic-button/component.tsx"
    }
  ]
}
```

If the component requires additional files, they must also be included.

---

# 16. File Mapping

A file mapping describes:

```text
source
target
```

Example:

```json
{
  "source": "utils.ts",
  "target": "components/kibo/magnetic-button/utils.ts"
}
```

The CLI should use these mappings rather than guessing target paths.

---

# 17. Assets

Assets must be represented explicitly.

Example:

```json
{
  "files": [
    {
      "source": "assets/noise.png",
      "target": "components/kibo/liquid-card/assets/noise.png"
    }
  ]
}
```

The registry must not omit required assets.

---

# 18. Dependencies

External dependencies must be declared.

Example:

```json
{
  "dependencies": {
    "gsap": "^3.13.0"
  }
}
```

The CLI should use the dependency information to determine what needs to be installed.

---

# 19. Peer Dependencies

If a component requires a host-project dependency that should remain controlled by the user, declare it as a peer dependency.

Example:

```json
{
  "peerDependencies": {
    "react": ">=18"
  }
}
```

Do not incorrectly classify every dependency as a peer dependency.

---

# 20. Optional Dependencies

Optional functionality may use optional dependencies.

Example:

```json
{
  "optionalDependencies": {
    "some-package": "^1.0.0"
  }
}
```

Optional dependencies must be clearly documented.

---

# 21. Dependency Installation

The CLI should:

1. Read dependency requirements.
2. Detect the package manager.
3. Check existing installed packages.
4. Avoid unnecessary duplicate installations.
5. Install missing dependencies.
6. Report installation results.

The registry should never instruct the CLI to install dependencies that the component does not actually use.

---

# 22. Compatibility

The registry should describe compatibility requirements.

Example:

```json
{
  "compatibility": {
    "react": ">=18",
    "next": ">=14",
    "typescript": true,
    "tailwind": ">=4"
  }
}
```

Compatibility fields should only declare real requirements.

---

# 23. Client Requirement

Components that require browser-side execution should explicitly indicate it.

Example:

```json
{
  "clientOnly": true
}
```

This can help documentation and installation tooling communicate requirements.

The actual component source must still handle Next.js client/server behavior correctly.

---

# 24. Framework Compatibility

The registry may identify:

```text
React
Next.js
Vite
Other supported React environments
```

Kibo should prioritize React and Next.js compatibility.

If a component requires a specific framework feature, document it.

---

# 25. Configuration Requirements

If a component requires project configuration, the registry must describe it.

Examples:

- CSS variables
- Tailwind configuration
- Font loading
- Provider setup
- Environment variables
- PostCSS requirements

Do not hide configuration requirements from the CLI or documentation.

---

# 26. Environment Variables

Components should avoid environment variables whenever possible.

If required, they must be explicitly declared.

Example:

```json
{
  "environment": {
    "required": [
      "PUBLIC_API_URL"
    ]
  }
}
```

Never include secret values in the registry.

---

# 27. Assets and Large Files

Large files should be treated carefully.

Examples:

- Videos
- Large textures
- 3D models
- Audio
- High-resolution images

The registry should contain enough information for the CLI to retrieve them, while storage and caching should be handled by the distribution infrastructure.

---

# 28. Storage Separation

The registry describes the component.

Storage serves the component files.

These responsibilities should remain separate.

Conceptually:

```text
Registry
   │
   ├── Metadata
   ├── Files
   ├── Dependencies
   └── Compatibility
            │
            ▼
       Storage Layer
            │
            ▼
       Component Files
```

Cloud object storage such as Cloudflare R2 may be used for file distribution.

---

# 29. Public Registry

Free components may be served through a public registry.

Conceptually:

```text
CLI
 ↓
Public Registry
 ↓
Component Metadata
 ↓
Public Storage
 ↓
Files
```

No paid authentication should be required for normal free component installation.

---

# 30. Premium Registry

Premium components require access control.

Conceptually:

```text
CLI
 ↓
Authentication
 ↓
License Verification
 ↓
Premium Registry
 ↓
Private Storage
 ↓
Files
```

Premium implementation details belong in:

```text
PREMIUM_SYSTEM.md
```

The registry itself should only represent premium status and distribution requirements.

---

# 31. Integrity

Downloaded component files should be validated where practical.

Possible mechanisms include:

- Checksums
- Hashes
- Signed metadata
- Version verification

The exact integrity mechanism may evolve with the distribution system.

The goal is to prevent corrupted or unexpected files from being installed.

---

# 32. Registry Validation

Before publication, validate:

```text
[ ] Slug is unique
[ ] Slug is valid
[ ] Name exists
[ ] Description exists
[ ] Version is valid
[ ] Category exists
[ ] Tags are valid
[ ] Premium status is explicit
[ ] Every required file exists
[ ] File mappings are valid
[ ] Dependencies are valid
[ ] Compatibility is accurate
[ ] Assets exist
[ ] No secrets exist
[ ] No invalid paths exist
```

---

# 33. Path Safety

Registry paths must be safe.

Never allow paths such as:

```text
../../something
```

or paths that escape the intended installation directory.

The CLI must validate paths before writing files.

---

# 34. File Conflict Handling

If a target file already exists, the CLI should not silently overwrite it.

Possible behavior:

```text
File already exists.

Options:
- Skip
- Overwrite
- Cancel
```

The exact UX is defined in:

```text
CLI_SPEC.md
```

---

# 35. Registry Immutability

Published versions should be treated as immutable.

If:

```text
magnetic-button@1.0.0
```

has been published, do not silently change its contents while keeping the same version.

Instead publish:

```text
1.0.1
```

or another appropriate version.

This ensures reproducible installations.

---

# 36. Latest Version

The registry may maintain a latest-version reference.

Example:

```json
{
  "slug": "magnetic-button",
  "latest": "1.2.0"
}
```

The latest version should point only to a published, validated version.

---

# 37. Version History

The registry may maintain version information.

Example:

```json
{
  "versions": [
    "1.0.0",
    "1.1.0",
    "1.2.0"
  ]
}
```

This allows future CLI update functionality.

---

# 38. Deprecation

Components may eventually be deprecated.

A deprecated component should contain appropriate metadata.

Example:

```json
{
  "deprecated": true,
  "replacement": "new-component"
}
```

Deprecation should not immediately break existing installations.

---

# 39. Categories and Discovery

The registry may support discovery metadata such as:

- Category
- Tags
- Featured status
- Popularity
- Creation date
- Updated date

These fields should support website discovery without affecting installation logic.

---

# 40. Featured Components

A component may optionally be marked as featured.

Example:

```json
{
  "featured": true
}
```

Featured status is a presentation concern and should not affect installation.

---

# 41. Search Metadata

Search-related metadata may include:

```text
tags
keywords
category
description
```

Search metadata must remain relevant.

Do not keyword-stuff descriptions.

---

# 42. Author Information

The registry may optionally contain author information.

Example:

```json
{
  "author": {
    "name": "Kibo",
    "type": "official"
  }
}
```

For community components, authorship should be represented accurately.

---

# 43. License Information

Every distributable component must have an applicable license or distribution policy.

Registry metadata may identify:

```json
{
  "license": "..."
}
```

The exact licensing model is a project-level decision.

Do not remove third-party license information when redistribution requires it.

---

# 44. Source Attribution

If a component contains code or assets that require attribution, the registry or documentation should preserve the applicable attribution information.

Do not intentionally hide source attribution.

---

# 45. Registry and Documentation

Documentation should be generated from or validated against registry metadata where practical.

For example:

```text
Registry:
premium = true

Documentation:
Pro component
```

These must never contradict each other.

---

# 46. Registry and CLI

The CLI should treat registry data as authoritative for installation.

The CLI should not infer:

- Dependencies
- File names
- Premium status
- Version
- Compatibility

when the registry already provides those values.

---

# 47. Registry and Component Source

Registry metadata must correspond to the actual component.

Example:

If metadata declares:

```json
{
  "dependencies": {
    "gsap": "^3.13.0"
  }
}
```

the component must actually use GSAP.

If metadata declares:

```json
{
  "files": [
    "component.tsx",
    "utils.ts"
  ]
}
```

both files must exist.

---

# 48. Registry Generation

The registry should preferably be generated or validated automatically from component source.

A publishing workflow may look like:

```text
Component
   ↓
Analyze
   ↓
Generate Metadata
   ↓
Validate
   ↓
Build Registry Entry
   ↓
Review
   ↓
Publish
```

Manual editing should be minimized where automation can reliably handle the task.

---

# 49. Registry Repository Structure

A possible registry structure is:

```text
registry/
├── index.json
├── components/
│   ├── magnetic-button/
│   │   ├── 1.0.0/
│   │   │   └── metadata.json
│   │   └── latest.json
│   │
│   └── spotlight-card/
│       ├── 1.0.0/
│       │   └── metadata.json
│       └── latest.json
└── schemas/
    └── component.schema.json
```

The exact physical structure may change.

The logical model must remain stable.

---

# 50. Registry Index

The index provides a fast way to discover available components.

Example:

```json
{
  "version": 1,
  "components": [
    "magnetic-button",
    "spotlight-card",
    "infinite-menu"
  ]
}
```

The index should remain lightweight.

---

# 51. Schema Version

The registry itself should have a schema version.

Example:

```json
{
  "schemaVersion": 1
}
```

Schema changes should be deliberate.

Breaking schema changes should be versioned.

---

# 52. Component Schema

A future formal JSON schema should validate component metadata.

The schema should validate:

- Required fields
- Data types
- Allowed values
- Path formats
- Version formats
- Dependency formats

The schema should be machine-readable.

---

# 53. Example Complete Registry Entry

```json
{
  "schemaVersion": 1,
  "name": "Magnetic Button",
  "slug": "magnetic-button",
  "description": "A button with a smooth magnetic pointer interaction.",
  "version": "1.0.0",
  "category": "buttons",
  "tags": [
    "button",
    "magnetic",
    "cursor",
    "hover",
    "animation"
  ],
  "premium": false,
  "featured": false,
  "clientOnly": true,
  "files": [
    {
      "source": "component.tsx",
      "target": "components/kibo/magnetic-button/component.tsx"
    },
    {
      "source": "demo.tsx",
      "target": "components/kibo/magnetic-button/demo.tsx"
    }
  ],
  "dependencies": {},
  "peerDependencies": {
    "react": ">=18"
  },
  "compatibility": {
    "react": ">=18",
    "next": ">=14",
    "typescript": true,
    "tailwind": ">=4"
  }
}
```

This is an example, not a permanently fixed schema.

---

# 54. Publishing Workflow

A component should pass through:

```text
Development
     ↓
Review
     ↓
Documentation
     ↓
Metadata Generation
     ↓
Registry Validation
     ↓
Build / Package
     ↓
Storage Upload
     ↓
Registry Publication
```

Only validated components should become publicly installable.

---

# 55. Free Publishing Flow

```text
Component
    ↓
Validate
    ↓
Generate Registry Entry
    ↓
Upload Files
    ↓
Publish Metadata
    ↓
Public Installation
```

---

# 56. Premium Publishing Flow

```text
Component
    ↓
Validate
    ↓
Generate Registry Entry
    ↓
Upload to Protected Storage
    ↓
Publish Premium Metadata
    ↓
License-Protected Installation
```

---

# 57. Rollback

The publishing system should allow a problematic release to be disabled or superseded.

Do not modify an already-published version in place.

Prefer:

```text
Bad release
    ↓
Mark unavailable / deprecated
    ↓
Publish fixed version
```

---

# 58. Caching

Registry and component files may be cached aggressively when safe.

Immutable versioned files are ideal candidates for long-term caching.

Example:

```text
magnetic-button@1.0.0
```

should remain immutable.

Latest-version references may have shorter cache durations.

---

# 59. Security

Registry data must never contain:

- API keys
- Passwords
- Private tokens
- License secrets
- Private credentials

Premium access should be verified through the appropriate authentication and licensing system.

---

# 60. Registry Quality Rules

The registry must always prioritize:

1. Accuracy
2. Reproducibility
3. Safety
4. Compatibility
5. Simplicity
6. Extensibility

Incorrect registry data can break user projects, so registry validation is mandatory.

---

# 61. Registry Review Checklist

Before publication:

```text
[ ] Component exists
[ ] Component builds
[ ] Component is reviewed
[ ] Metadata matches component
[ ] Version is correct
[ ] Slug is unique
[ ] Category is correct
[ ] Tags are relevant
[ ] Free/Pro status is correct
[ ] All files are included
[ ] All assets are included
[ ] Dependencies are correct
[ ] Peer dependencies are correct
[ ] Compatibility is accurate
[ ] Paths are safe
[ ] No secrets exist
[ ] License information is correct
[ ] Documentation matches metadata
[ ] CLI installation is valid
```

---

# 62. Core Registry Principle

> **The registry must tell the CLI exactly what a component is, what it needs, and how it should be installed — without requiring the CLI to guess.**
