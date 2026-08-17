<div align="center">
  <img src="./public/logo/kibo-logo-light.png" alt="Kibo UI Logo" width="80" height="80" />
  <br />
  <h1>Kibo UI</h1>
  <p>
    <strong>A modern, motion-focused React component library built for developer ownership and premium aesthetics.</strong>
  </p>
</div>

<br />

Kibo UI is not just another component library. It is a collection of meticulously crafted, animation-heavy, premium React components designed to elevate your application's user experience. 

Instead of hiding behind opaque npm packages, Kibo distributes its components via source code. When you add a Kibo component, the actual source code is injected directly into your project. You own the code, you customize the styles, and you control the behavior.

> **Note:** Kibo UI is currently in active development.

## ✨ Features

- **Developer Ownership:** Components are installed directly into your source code via the CLI. No hidden abstraction layers. No untyped props. You own the code.
- **Motion-First:** Built-in, high-performance, frame-perfect animations powered by GSAP and Framer Motion. 
- **Premium Aesthetics:** Every component is designed with painstaking attention to detail, utilizing a strict, sophisticated design system.
- **Accessible:** Built with semantic HTML, keyboard navigation, and ARIA attributes in mind. Respects `prefers-reduced-motion`.
- **Fully Typed:** Written entirely in TypeScript for an excellent developer experience.
- **Tailwind CSS:** Styled purely with Tailwind utility classes for effortless customization.

## 🚀 Quick Start

To use Kibo UI components in your project, you'll need a React framework like Next.js, initialized with Tailwind CSS.

### 1. Initialize Kibo
Run the Kibo initialization command in your project root to set up the registry and base utilities:

```bash
npx kibo init
```

### 2. Add Components
Browse our component registry and install exactly what you need. 

```bash
npx kibo add sidebar
npx kibo add text-3d-flip
```

This will download the `sidebar.tsx` and its dependencies directly into your `components/ui` directory. You can instantly import it:

```tsx
import { Sidebar } from "@/components/ui/sidebar"

export default function Layout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <main>{children}</main>
    </div>
  )
}
```

## 🛠️ Architecture & Tech Stack

Kibo UI components rely on the following modern stack:

- **Framework:** React 18+ (Next.js recommended)
- **Styling:** Tailwind CSS
- **Animation (Complex):** GSAP (`@gsap/react`)
- **Animation (Simple):** Framer Motion
- **Icons:** Lucide React

## 📖 Component Guidelines

If you are contributing or customizing Kibo components, keep these core principles in mind:

1. **The Minimal Change Principle:** Do not introduce unnecessary dependencies or structural changes unless strictly required for the component's functionality.
2. **Design Tokens:** Always utilize standard Tailwind variables (e.g. `var(--foreground)`, `var(--accent)`) to ensure components automatically adapt to different themes.
3. **Clean Cleanup:** Always ensure animation observers, GSAP contexts, and event listeners are properly cleaned up on component unmount to prevent memory leaks.

## 📄 License

MIT © Kibo UI
