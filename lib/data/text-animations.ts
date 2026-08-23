export type TagKind = "Hover" | "Click" | "Scroll";

export interface TextComponent {
  name: string;
  slug: string;
  tags: TagKind[];
  description?: string;
  previewVideo?: string;
}

export const textComponents: TextComponent[] = [
  {
    name: "Blur Text",
    slug: "blur-text",
    tags: ["Hover", "Click"],
    description: "Text starts blurred then crisply resolves for a soft-focus reveal effect.",
    previewVideo: "/preview/blur-text.webm",
  },
  {
    name: "Shiny Text",
    slug: "shiny-text",
    tags: ["Hover"],
    description: "A shiny light streak sweeps across the text with customizable gradient reflections.",
    previewVideo: "/preview/shiny-text.webm",
  },
  {
    name: "Split Text",
    slug: "split-text",
    tags: ["Scroll"],
    description: "Splits text into words or characters with spring-loaded entrance animations.",
    previewVideo: "/preview/split-text.webm",
  },
  {
    name: "Text Pressure",
    slug: "text-pressure",
    tags: ["Hover"],
    description: "Variable font weight and optical sizing that react dynamically to cursor proximity.",
    previewVideo: "/preview/text-pressure.webm",
  },
  {
    name: "Text Loop",
    slug: "text-loop",
    tags: ["Scroll"],
    description: "Smooth horizontal ticker loop that scrolls text infinitely across the viewport.",
    previewVideo: "/preview/text-loop.webm",
  },
  {
    name: "ASCII Text",
    slug: "ascii-text",
    tags: ["Hover", "Click"],
    description: "Transforms 3D scene text into real-time dynamic ASCII art characters with lighting controls.",
    previewVideo: "/preview/ascii-text.webm",
  },
  {
    name: "Circular Text",
    slug: "circular-text",
    tags: ["Hover", "Scroll"],
    description: "Renders text along an animated circular path with smooth spin and reactive hover velocity.",
    previewVideo: "/preview/circular-text.webm",
  },
  {
    name: "Count Up",
    slug: "count-up",
    tags: ["Scroll"],
    description: "Smooth spring-physics numerical counter that animates from a start value to target value.",
    previewVideo: "/preview/count-up.webm",
  },
  {
    name: "Curved Loop",
    slug: "curved-loop",
    tags: ["Hover", "Scroll"],
    description: "Seamlessly repeats and animates text along a customizable SVG bezier curve.",
    previewVideo: "/preview/curved-loop.webm",
  },
  {
    name: "Decrypted Text",
    slug: "decrypted-text",
    tags: ["Hover", "Click"],
    description: "Cyberpunk-inspired text decryption effect scrambling through random glyphs before resolving.",
    previewVideo: "/preview/decrypted-text.webm",
  },
  {
    name: "Depth Text",
    slug: "depth-text",
    tags: ["Hover"],
    description: "Creates multi-layered 3D extruded typography shifting depth relative to cursor position.",
    previewVideo: "/preview/depth-text.webm",
  },
  {
    name: "Echo Text",
    slug: "echo-text",
    tags: ["Hover"],
    description: "Generates cascading reverberation text layers with customizable depth and kinetic motion.",
    previewVideo: "/preview/echo-text.webm",
  },
  {
    name: "Falling Text",
    slug: "falling-text",
    tags: ["Click", "Hover"],
    description: "Interactive 2D physics simulation where words fall with gravity, collisions, and drag.",
    previewVideo: "/preview/falling-text.webm",
  },
  {
    name: "Fold Text",
    slug: "fold-text",
    tags: ["Scroll"],
    description: "3D origami accordion fold animation that bends and unrolls text slices dynamically.",
    previewVideo: "/preview/fold-text.webm",
  },
  {
    name: "Fuzzy Text",
    slug: "fuzzy-text",
    tags: ["Hover"],
    description: "Canvas-driven CRT static fuzz and particulate distortion that scatters on interaction.",
    previewVideo: "/preview/fuzzy-text.webm",
  },
  {
    name: "Glitch Text",
    slug: "glitch-text",
    tags: ["Hover"],
    description: "High-energy cybernetic RGB chromatic aberration glitch animation with slice displacement.",
    previewVideo: "/preview/glitch-text.webm",
  },
  {
    name: "Gradient Text",
    slug: "gradient-text",
    tags: ["Hover"],
    description: "Silky multi-color gradient background sweep traveling continuously across typography.",
    previewVideo: "/preview/gradient-text.webm",
  },
  {
    name: "Masked Heading",
    slug: "masked-heading",
    tags: ["Scroll"],
    description: "Kinetic reveal effect slicing text through angled geometric masks with smooth easing.",
    previewVideo: "/preview/masked-heading.webm",
  },
  {
    name: "Particle Text",
    slug: "particle-text",
    tags: ["Hover", "Click"],
    description: "Interactive canvas particle physics rendering text as thousands of interactive points.",
    previewVideo: "/preview/particle-text.webm",
  },
  {
    name: "Rotating Text",
    slug: "rotating-text",
    tags: ["Scroll", "Hover"],
    description: "Choreographed flipper cycling through multiple phrases with character-level staggering.",
    previewVideo: "/preview/rotating-text.webm",
  },
  {
    name: "Scrambled Text",
    slug: "scrambled-text",
    tags: ["Hover"],
    description: "Proximity-based character scrambler dynamically distorting glyphs near the cursor.",
    previewVideo: "/preview/scrambled-text.webm",
  },
  {
    name: "Scroll Float",
    slug: "scroll-float",
    tags: ["Scroll"],
    description: "Weightless typography effect where characters float smoothly upwards on scroll.",
    previewVideo: "/preview/scroll-float.webm",
  },
  {
    name: "Scroll Reveal",
    slug: "scroll-reveal",
    tags: ["Scroll"],
    description: "Progressive word-by-word opacity and blur reveal anchored to scroll position.",
    previewVideo: "/preview/scroll-reveal.webm",
  },
  {
    name: "Scroll Velocity",
    slug: "scroll-velocity",
    tags: ["Scroll"],
    description: "Infinite marquee text banners accelerating dynamically based on page scroll velocity.",
    previewVideo: "/preview/scroll-velocity.webm",
  },
  {
    name: "Shuffle",
    slug: "shuffle",
    tags: ["Hover", "Scroll"],
    description: "Slot-machine reel flip animation rolling through randomized glyph strips on scroll or hover.",
    previewVideo: "/preview/shuffle.webm",
  },
  {
    name: "Split Flap Text",
    slug: "split-flap-text",
    tags: ["Click", "Hover"],
    description: "Tactile mechanical departure board text animation simulating retro split-flap displays.",
    previewVideo: "/preview/split-flap-text.webm",
  },
  {
    name: "Stroke Text",
    slug: "stroke-text",
    tags: ["Scroll"],
    description: "Vector outline drawing animation sketching letter paths with SVG stroke transitions.",
    previewVideo: "/preview/stroke-text.webm",
  },
  {
    name: "Text Cursor",
    slug: "text-cursor",
    tags: ["Hover"],
    description: "Custom magnetic floating indicator tracking pointer movement over typography blocks.",
    previewVideo: "/preview/text-cursor.webm",
  },
  {
    name: "Text Type",
    slug: "text-type",
    tags: ["Scroll"],
    description: "Realistic mechanical typing and backspacing animation with blinking cursor.",
    previewVideo: "/preview/text-type.webm",
  },
  {
    name: "True Focus",
    slug: "true-focus",
    tags: ["Hover", "Scroll"],
    description: "Camera viewfinder crosshair brackets locking onto active words with spring transitions.",
    previewVideo: "/preview/true-focus.webm",
  },
  {
    name: "Variable Proximity",
    slug: "variable-proximity",
    tags: ["Hover"],
    description: "Variable font weight and optical size fluidly responding to cursor distance.",
    previewVideo: "/preview/variable-proximity.webm",
  },
  {
    name: "Warp Text",
    slug: "warp-text",
    tags: ["Hover"],
    description: "High-performance WebGL liquid ripple and sine wave distortion shader warping text.",
    previewVideo: "/preview/warp-text.webm",
  },
];

export type Filter = "All" | TagKind;
export const filters: Filter[] = ["All", "Hover", "Click", "Scroll"];
