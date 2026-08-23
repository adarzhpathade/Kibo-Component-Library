export interface PropItem {
  name: string;
  type: string;
  default: string;
  description: string;
}

export interface ComponentDoc {
  slug: string;
  name: string;
  description: string;
  dependencies: Record<string, string>;
  installation: {
    cliTs: string;
    cliJs: string;
    npm: string;
    pnpm: string;
    yarn: string;
    bun: string;
  };
  usageTs: string;
  usageJs: string;
  componentSourceTs: string;
  componentSourceJs: string;
  props: PropItem[];
}

export const componentDocs: Record<string, ComponentDoc> = {
  "ascii-text": {
    "slug": "ascii-text",
    "name": "ASCII Text",
    "description": "Transforms 3D scene text into real-time dynamic ASCII art characters with interactive camera and mouse lighting controls.",
    "dependencies": {
      "three": "^0.183.0"
    },
    "installation": {
      "cliTs": "npx kibo add ascii-text",
      "cliJs": "npx kibo add ascii-text --js",
      "npm": "npm i three",
      "pnpm": "pnpm add three",
      "yarn": "yarn add three",
      "bun": "bun add three"
    },
    "usageTs": "import { ASCIIText } from \"@/components/kibo/ascii-text/component\";\n\nexport default function Example() {\n  return (\n    <ASCIIText />\n  );\n}",
    "usageJs": "import { ASCIIText } from \"@/components/kibo/ascii-text/component\";\nexport default function Example() {\n    return (<ASCIIText />);\n}",
    "componentSourceTs": "\"use client\";\n\n// Component ported and enhanced from https://codepen.io/JuanFuentes/pen/eYEeoyE\n\nimport { useEffect, useRef } from 'react';\nimport * as THREE from 'three';\n\nconst vertexShader = `\nvarying vec2 vUv;\nuniform float uTime;\nuniform float mouse;\nuniform float uEnableWaves;\n\nvoid main() {\n    vUv = uv;\n    float time = uTime * 5.;\n\n    float waveFactor = uEnableWaves;\n\n    vec3 transformed = position;\n\n    transformed.x += sin(time + position.y) * 0.5 * waveFactor;\n    transformed.y += cos(time + position.z) * 0.15 * waveFactor;\n    transformed.z += sin(time + position.x) * waveFactor;\n\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);\n}\n`;\n\nconst fragmentShader = `\nvarying vec2 vUv;\nuniform float mouse;\nuniform float uTime;\nuniform sampler2D uTexture;\n\nvoid main() {\n    float time = uTime;\n    vec2 pos = vUv;\n    \n    float move = sin(time + mouse) * 0.01;\n    float r = texture2D(uTexture, pos + cos(time * 2. - time + pos.x) * .01).r;\n    float g = texture2D(uTexture, pos + tan(time * .5 + pos.x - time) * .01).g;\n    float b = texture2D(uTexture, pos - cos(time * 2. + time + pos.y) * .01).b;\n    float a = texture2D(uTexture, pos).a;\n    gl_FragColor = vec4(r, g, b, a);\n}\n`;\n\nfunction map(n: number, start: number, stop: number, start2: number, stop2: number) {\n  return ((n - start) / (stop - start)) * (stop2 - start2) + start2;\n}\n\nconst PX_RATIO = typeof window !== 'undefined' ? window.devicePixelRatio : 1;\n\ninterface AsciiFilterOptions {\n  fontSize?: number;\n  fontFamily?: string;\n  charset?: string;\n  invert?: boolean;\n}\n\nclass AsciiFilter {\n  renderer: THREE.WebGLRenderer;\n  domElement: HTMLDivElement;\n  pre: HTMLPreElement;\n  canvas: HTMLCanvasElement;\n  context: CanvasRenderingContext2D | null;\n  deg: number;\n  invert: boolean;\n  fontSize: number;\n  fontFamily: string;\n  charset: string;\n  width: number = 0;\n  height: number = 0;\n  center: { x: number; y: number } = { x: 0, y: 0 };\n  mouse: { x: number; y: number } = { x: 0, y: 0 };\n  cols: number = 0;\n  rows: number = 0;\n\n  constructor(renderer: THREE.WebGLRenderer, { fontSize, fontFamily, charset, invert }: AsciiFilterOptions = {}) {\n    this.renderer = renderer;\n    this.domElement = document.createElement('div');\n    this.domElement.style.position = 'absolute';\n    this.domElement.style.top = '0';\n    this.domElement.style.left = '0';\n    this.domElement.style.width = '100%';\n    this.domElement.style.height = '100%';\n\n    this.pre = document.createElement('pre');\n    this.domElement.appendChild(this.pre);\n\n    this.canvas = document.createElement('canvas');\n    this.context = this.canvas.getContext('2d');\n    this.domElement.appendChild(this.canvas);\n\n    this.deg = 0;\n    this.invert = invert ?? true;\n    this.fontSize = fontSize ?? 12;\n    this.fontFamily = fontFamily ?? \"'Courier New', monospace\";\n    this.charset = charset ?? ' .\\'`^\",:;Il!i~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$';\n\n    if (this.context) {\n      this.context.imageSmoothingEnabled = false;\n      this.context.imageSmoothingEnabled = false;\n    }\n\n    this.onMouseMove = this.onMouseMove.bind(this);\n    document.addEventListener('mousemove', this.onMouseMove);\n  }\n\n  setSize(width: number, height: number) {\n    this.width = width;\n    this.height = height;\n    this.renderer.setSize(width, height);\n    this.reset();\n\n    this.center = { x: width / 2, y: height / 2 };\n    this.mouse = { x: this.center.x, y: this.center.y };\n  }\n\n  reset() {\n    if (this.context) {\n      this.context.font = `${this.fontSize}px ${this.fontFamily}`;\n      const charWidth = this.context.measureText('A').width;\n\n      this.cols = Math.floor(this.width / (this.fontSize * (charWidth / this.fontSize)));\n      this.rows = Math.floor(this.height / this.fontSize);\n\n      this.canvas.width = this.cols;\n      this.canvas.height = this.rows;\n      this.pre.style.fontFamily = this.fontFamily;\n      this.pre.style.fontSize = `${this.fontSize}px`;\n      this.pre.style.margin = '0';\n      this.pre.style.padding = '0';\n      this.pre.style.lineHeight = '1em';\n      this.pre.style.position = 'absolute';\n      this.pre.style.left = '50%';\n      this.pre.style.top = '50%';\n      this.pre.style.transform = 'translate(-50%, -50%)';\n      this.pre.style.zIndex = '9';\n      this.pre.style.backgroundAttachment = 'fixed';\n      this.pre.style.mixBlendMode = 'difference';\n    }\n  }\n\n  render(scene: THREE.Scene, camera: THREE.Camera) {\n    this.renderer.render(scene, camera);\n\n    const w = this.canvas.width;\n    const h = this.canvas.height;\n    if (this.context) {\n      this.context.clearRect(0, 0, w, h);\n      if (this.context && w && h) {\n        this.context.drawImage(this.renderer.domElement, 0, 0, w, h);\n      }\n\n      this.asciify(this.context, w, h);\n      this.hue();\n    }\n  }\n\n  onMouseMove(e: MouseEvent) {\n    this.mouse = { x: e.clientX * PX_RATIO, y: e.clientY * PX_RATIO };\n  }\n\n  get dx() {\n    return this.mouse.x - this.center.x;\n  }\n\n  get dy() {\n    return this.mouse.y - this.center.y;\n  }\n\n  hue() {\n    const deg = (Math.atan2(this.dy, this.dx) * 180) / Math.PI;\n    this.deg += (deg - this.deg) * 0.075;\n    this.domElement.style.filter = `hue-rotate(${this.deg.toFixed(1)}deg)`;\n  }\n\n  asciify(ctx: CanvasRenderingContext2D, w: number, h: number) {\n    if (w && h) {\n      const imgData = ctx.getImageData(0, 0, w, h).data;\n      let str = '';\n      for (let y = 0; y < h; y++) {\n        for (let x = 0; x < w; x++) {\n          const i = x * 4 + y * 4 * w;\n          const [r, g, b, a] = [imgData[i], imgData[i + 1], imgData[i + 2], imgData[i + 3]];\n\n          if (a === 0) {\n            str += ' ';\n            continue;\n          }\n\n          let gray = (0.3 * r + 0.6 * g + 0.1 * b) / 255;\n          let idx = Math.floor((1 - gray) * (this.charset.length - 1));\n          if (this.invert) idx = this.charset.length - idx - 1;\n          str += this.charset[idx];\n        }\n        str += '\\n';\n      }\n      this.pre.innerHTML = str;\n    }\n  }\n\n  dispose() {\n    document.removeEventListener('mousemove', this.onMouseMove);\n  }\n}\n\ninterface CanvasTxtOptions {\n  fontSize?: number;\n  fontFamily?: string;\n  color?: string;\n}\n\nclass CanvasTxt {\n  canvas: HTMLCanvasElement;\n  context: CanvasRenderingContext2D | null;\n  txt: string;\n  fontSize: number;\n  fontFamily: string;\n  color: string;\n  font: string;\n\n  constructor(txt: string, { fontSize = 200, fontFamily = 'Arial', color = '#fdf9f3' }: CanvasTxtOptions = {}) {\n    this.canvas = document.createElement('canvas');\n    this.context = this.canvas.getContext('2d');\n    this.txt = txt;\n    this.fontSize = fontSize;\n    this.fontFamily = fontFamily;\n    this.color = color;\n\n    this.font = `600 ${this.fontSize}px ${this.fontFamily}`;\n  }\n\n  resize() {\n    if (this.context) {\n      this.context.font = this.font;\n      const metrics = this.context.measureText(this.txt);\n\n      const textWidth = Math.ceil(metrics.width) + 20;\n      const textHeight = Math.ceil(metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent) + 20;\n\n      this.canvas.width = textWidth;\n      this.canvas.height = textHeight;\n    }\n  }\n\n  render() {\n    if (this.context) {\n      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);\n      this.context.fillStyle = this.color;\n      this.context.font = this.font;\n\n      const metrics = this.context.measureText(this.txt);\n      const yPos = 10 + metrics.actualBoundingBoxAscent;\n\n      this.context.fillText(this.txt, 10, yPos);\n    }\n  }\n\n  get width() {\n    return this.canvas.width;\n  }\n\n  get height() {\n    return this.canvas.height;\n  }\n\n  get texture() {\n    return this.canvas;\n  }\n}\n\ninterface CanvAsciiOptions {\n  text: string;\n  asciiFontSize: number;\n  textFontSize: number;\n  textColor: string;\n  planeBaseHeight: number;\n  enableWaves: boolean;\n}\n\nclass CanvAscii {\n  textString: string;\n  asciiFontSize: number;\n  textFontSize: number;\n  textColor: string;\n  planeBaseHeight: number;\n  container: HTMLElement;\n  width: number;\n  height: number;\n  enableWaves: boolean;\n  camera: THREE.PerspectiveCamera;\n  scene: THREE.Scene;\n  mouse: { x: number; y: number };\n  textCanvas!: CanvasTxt;\n  texture!: THREE.CanvasTexture;\n  geometry!: THREE.PlaneGeometry;\n  material!: THREE.ShaderMaterial;\n  mesh!: THREE.Mesh;\n  renderer!: THREE.WebGLRenderer;\n  filter!: AsciiFilter;\n  center!: { x: number; y: number };\n  animationFrameId: number = 0;\n\n  constructor(\n    { text, asciiFontSize, textFontSize, textColor, planeBaseHeight, enableWaves }: CanvAsciiOptions,\n    containerElem: HTMLElement,\n    width: number,\n    height: number\n  ) {\n    this.textString = text;\n    this.asciiFontSize = asciiFontSize;\n    this.textFontSize = textFontSize;\n    this.textColor = textColor;\n    this.planeBaseHeight = planeBaseHeight;\n    this.container = containerElem;\n    this.width = width;\n    this.height = height;\n    this.enableWaves = enableWaves;\n\n    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 1000);\n    this.camera.position.z = 30;\n\n    this.scene = new THREE.Scene();\n    this.mouse = { x: this.width / 2, y: this.height / 2 };\n\n    this.onMouseMove = this.onMouseMove.bind(this);\n  }\n\n  async init() {\n    try {\n      await document.fonts.load('600 200px \"IBM Plex Mono\"');\n      await document.fonts.load('500 12px \"IBM Plex Mono\"');\n    } catch (e) {}\n    await document.fonts.ready;\n    this.setMesh();\n    this.setRenderer();\n  }\n\n  setMesh() {\n    this.textCanvas = new CanvasTxt(this.textString, {\n      fontSize: this.textFontSize,\n      fontFamily: 'IBM Plex Mono',\n      color: this.textColor\n    });\n    this.textCanvas.resize();\n    this.textCanvas.render();\n\n    this.texture = new THREE.CanvasTexture(this.textCanvas.texture);\n    this.texture.minFilter = THREE.NearestFilter;\n\n    const textAspect = this.textCanvas.width / this.textCanvas.height;\n    const baseH = this.planeBaseHeight;\n    const planeW = baseH * textAspect;\n    const planeH = baseH;\n\n    this.geometry = new THREE.PlaneGeometry(planeW, planeH, 36, 36);\n    this.material = new THREE.ShaderMaterial({\n      vertexShader,\n      fragmentShader,\n      transparent: true,\n      uniforms: {\n        uTime: { value: 0 },\n        mouse: { value: 1.0 },\n        uTexture: { value: this.texture },\n        uEnableWaves: { value: this.enableWaves ? 1.0 : 0.0 }\n      }\n    });\n\n    this.mesh = new THREE.Mesh(this.geometry, this.material);\n    this.scene.add(this.mesh);\n  }\n\n  setRenderer() {\n    this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });\n    this.renderer.setPixelRatio(1);\n    this.renderer.setClearColor(0x000000, 0);\n\n    this.filter = new AsciiFilter(this.renderer, {\n      fontFamily: 'IBM Plex Mono',\n      fontSize: this.asciiFontSize,\n      invert: true\n    });\n\n    this.container.appendChild(this.filter.domElement);\n    this.setSize(this.width, this.height);\n\n    this.container.addEventListener('mousemove', this.onMouseMove);\n    this.container.addEventListener('touchmove', this.onMouseMove);\n  }\n\n  setSize(w: number, h: number) {\n    this.width = w;\n    this.height = h;\n\n    this.camera.aspect = w / h;\n    this.camera.updateProjectionMatrix();\n\n    this.filter.setSize(w, h);\n\n    this.center = { x: w / 2, y: h / 2 };\n  }\n\n  load() {\n    this.animate();\n  }\n\n  onMouseMove(evt: MouseEvent | TouchEvent) {\n    const e = (evt as TouchEvent).touches ? (evt as TouchEvent).touches[0] : (evt as MouseEvent);\n    const bounds = this.container.getBoundingClientRect();\n    const x = e.clientX - bounds.left;\n    const y = e.clientY - bounds.top;\n    this.mouse = { x, y };\n  }\n\n  animate() {\n    const animateFrame = () => {\n      this.animationFrameId = requestAnimationFrame(animateFrame);\n      this.render();\n    };\n    animateFrame();\n  }\n\n  render() {\n    const time = new Date().getTime() * 0.001;\n\n    this.textCanvas.render();\n    this.texture.needsUpdate = true;\n\n    (this.mesh.material as THREE.ShaderMaterial).uniforms.uTime.value = Math.sin(time);\n\n    this.updateRotation();\n    this.filter.render(this.scene, this.camera);\n  }\n\n  updateRotation() {\n    const x = map(this.mouse.y, 0, this.height, 0.5, -0.5);\n    const y = map(this.mouse.x, 0, this.width, -0.5, 0.5);\n\n    this.mesh.rotation.x += (x - this.mesh.rotation.x) * 0.05;\n    this.mesh.rotation.y += (y - this.mesh.rotation.y) * 0.05;\n  }\n\n  clear() {\n    this.scene.traverse(object => {\n      const obj = object as unknown as THREE.Mesh;\n      if (!obj.isMesh) return;\n      [obj.material].flat().forEach(material => {\n        material.dispose();\n        Object.keys(material).forEach(key => {\n          const matProp = material[key as keyof typeof material];\n          if (matProp && typeof matProp === 'object' && 'dispose' in matProp && typeof matProp.dispose === 'function') {\n            matProp.dispose();\n          }\n        });\n      });\n      obj.geometry.dispose();\n    });\n    this.scene.clear();\n  }\n\n  dispose() {\n    cancelAnimationFrame(this.animationFrameId);\n    if (this.filter) {\n      this.filter.dispose();\n      if (this.filter.domElement.parentNode) {\n        this.container.removeChild(this.filter.domElement);\n      }\n    }\n    this.container.removeEventListener('mousemove', this.onMouseMove);\n    this.container.removeEventListener('touchmove', this.onMouseMove);\n    this.clear();\n    if (this.renderer) {\n      this.renderer.dispose();\n      this.renderer.forceContextLoss();\n    }\n  }\n}\n\ninterface ASCIITextProps {\n  text?: string;\n  asciiFontSize?: number;\n  textFontSize?: number;\n  textColor?: string;\n  planeBaseHeight?: number;\n  enableWaves?: boolean;\n}\n\nexport function ASCIIText({\n  text = 'David!',\n  asciiFontSize = 8,\n  textFontSize = 200,\n  textColor = '#fdf9f3',\n  planeBaseHeight = 8,\n  enableWaves = true\n}: ASCIITextProps) {\n  const containerRef = useRef<HTMLDivElement>(null);\n  const asciiRef = useRef<CanvAscii | null>(null);\n\n  useEffect(() => {\n    if (!containerRef.current) return;\n\n    let cancelled = false;\n    let observer: IntersectionObserver | null = null;\n    let ro: ResizeObserver | null = null;\n\n    const createAndInit = async (container: HTMLDivElement, w: number, h: number) => {\n      const instance = new CanvAscii(\n        { text, asciiFontSize, textFontSize, textColor, planeBaseHeight, enableWaves },\n        container,\n        w,\n        h\n      );\n      await instance.init();\n      return instance;\n    };\n\n    const setup = async () => {\n      const { width, height } = containerRef.current!.getBoundingClientRect();\n\n      if (width === 0 || height === 0) {\n        observer = new IntersectionObserver(\n          async ([entry]) => {\n            if (cancelled) return;\n            if (entry.isIntersecting && entry.boundingClientRect.width > 0 && entry.boundingClientRect.height > 0) {\n              const { width: w, height: h } = entry.boundingClientRect;\n              observer?.disconnect();\n              observer = null;\n\n              if (!cancelled) {\n                asciiRef.current = await createAndInit(containerRef.current!, w, h);\n                if (!cancelled && asciiRef.current) {\n                  asciiRef.current.load();\n                }\n              }\n            }\n          },\n          { threshold: 0.1 }\n        );\n        observer.observe(containerRef.current!);\n        return;\n      }\n\n      asciiRef.current = await createAndInit(containerRef.current!, width, height);\n      if (!cancelled && asciiRef.current) {\n        asciiRef.current.load();\n\n        ro = new ResizeObserver(entries => {\n          if (!entries[0] || !asciiRef.current) return;\n          const { width: w, height: h } = entries[0].contentRect;\n          if (w > 0 && h > 0) {\n            asciiRef.current.setSize(w, h);\n          }\n        });\n        ro.observe(containerRef.current!);\n      }\n    };\n\n    setup();\n\n    return () => {\n      cancelled = true;\n      if (observer) observer.disconnect();\n      if (ro) ro.disconnect();\n      if (asciiRef.current) {\n        asciiRef.current.dispose();\n        asciiRef.current = null;\n      }\n    };\n  }, [text, asciiFontSize, textFontSize, textColor, planeBaseHeight, enableWaves]);\n\n  return (\n    <div\n      ref={containerRef}\n      className=\"ascii-text-container\"\n      style={{\n        position: 'absolute',\n        width: '100%',\n        height: '100%'\n      }}\n    >\n      <style>{`\n        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600&display=swap');\n\n        .ascii-text-container canvas {\n          position: absolute;\n          left: 0;\n          top: 0;\n          width: 100%;\n          height: 100%;\n          image-rendering: optimizeSpeed;\n          image-rendering: -moz-crisp-edges;\n          image-rendering: -o-crisp-edges;\n          image-rendering: -webkit-optimize-contrast;\n          image-rendering: optimize-contrast;\n          image-rendering: crisp-edges;\n          image-rendering: pixelated;\n        }\n\n        .ascii-text-container pre {\n          margin: 0;\n          user-select: none;\n          padding: 0;\n          line-height: 1em;\n          text-align: left;\n          position: absolute;\n          left: 0;\n          top: 0;\n          background-image: radial-gradient(circle, #ff6188 0%, #fc9867 50%, #ffd866 100%);\n          background-attachment: fixed;\n          -webkit-text-fill-color: transparent;\n          -webkit-background-clip: text;\n          z-index: 9;\n          mix-blend-mode: difference;\n        }\n      `}</style>\n    </div>\n  );\n}\nexport default ASCIIText;\n",
    "componentSourceJs": "\"use client\";\n// Component ported and enhanced from https://codepen.io/JuanFuentes/pen/eYEeoyE\nimport { useEffect, useRef } from 'react';\nimport * as THREE from 'three';\nconst vertexShader = `\nvarying vec2 vUv;\nuniform float uTime;\nuniform float mouse;\nuniform float uEnableWaves;\n\nvoid main() {\n    vUv = uv;\n    float time = uTime * 5.;\n\n    float waveFactor = uEnableWaves;\n\n    vec3 transformed = position;\n\n    transformed.x += sin(time + position.y) * 0.5 * waveFactor;\n    transformed.y += cos(time + position.z) * 0.15 * waveFactor;\n    transformed.z += sin(time + position.x) * waveFactor;\n\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);\n}\n`;\nconst fragmentShader = `\nvarying vec2 vUv;\nuniform float mouse;\nuniform float uTime;\nuniform sampler2D uTexture;\n\nvoid main() {\n    float time = uTime;\n    vec2 pos = vUv;\n    \n    float move = sin(time + mouse) * 0.01;\n    float r = texture2D(uTexture, pos + cos(time * 2. - time + pos.x) * .01).r;\n    float g = texture2D(uTexture, pos + tan(time * .5 + pos.x - time) * .01).g;\n    float b = texture2D(uTexture, pos - cos(time * 2. + time + pos.y) * .01).b;\n    float a = texture2D(uTexture, pos).a;\n    gl_FragColor = vec4(r, g, b, a);\n}\n`;\nfunction map(n, start, stop, start2, stop2) {\n    return ((n - start) / (stop - start)) * (stop2 - start2) + start2;\n}\nconst PX_RATIO = typeof window !== 'undefined' ? window.devicePixelRatio : 1;\nclass AsciiFilter {\n    renderer;\n    domElement;\n    pre;\n    canvas;\n    context;\n    deg;\n    invert;\n    fontSize;\n    fontFamily;\n    charset;\n    width = 0;\n    height = 0;\n    center = { x: 0, y: 0 };\n    mouse = { x: 0, y: 0 };\n    cols = 0;\n    rows = 0;\n    constructor(renderer, { fontSize, fontFamily, charset, invert } = {}) {\n        this.renderer = renderer;\n        this.domElement = document.createElement('div');\n        this.domElement.style.position = 'absolute';\n        this.domElement.style.top = '0';\n        this.domElement.style.left = '0';\n        this.domElement.style.width = '100%';\n        this.domElement.style.height = '100%';\n        this.pre = document.createElement('pre');\n        this.domElement.appendChild(this.pre);\n        this.canvas = document.createElement('canvas');\n        this.context = this.canvas.getContext('2d');\n        this.domElement.appendChild(this.canvas);\n        this.deg = 0;\n        this.invert = invert ?? true;\n        this.fontSize = fontSize ?? 12;\n        this.fontFamily = fontFamily ?? \"'Courier New', monospace\";\n        this.charset = charset ?? ' .\\'`^\",:;Il!i~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$';\n        if (this.context) {\n            this.context.imageSmoothingEnabled = false;\n            this.context.imageSmoothingEnabled = false;\n        }\n        this.onMouseMove = this.onMouseMove.bind(this);\n        document.addEventListener('mousemove', this.onMouseMove);\n    }\n    setSize(width, height) {\n        this.width = width;\n        this.height = height;\n        this.renderer.setSize(width, height);\n        this.reset();\n        this.center = { x: width / 2, y: height / 2 };\n        this.mouse = { x: this.center.x, y: this.center.y };\n    }\n    reset() {\n        if (this.context) {\n            this.context.font = `${this.fontSize}px ${this.fontFamily}`;\n            const charWidth = this.context.measureText('A').width;\n            this.cols = Math.floor(this.width / (this.fontSize * (charWidth / this.fontSize)));\n            this.rows = Math.floor(this.height / this.fontSize);\n            this.canvas.width = this.cols;\n            this.canvas.height = this.rows;\n            this.pre.style.fontFamily = this.fontFamily;\n            this.pre.style.fontSize = `${this.fontSize}px`;\n            this.pre.style.margin = '0';\n            this.pre.style.padding = '0';\n            this.pre.style.lineHeight = '1em';\n            this.pre.style.position = 'absolute';\n            this.pre.style.left = '50%';\n            this.pre.style.top = '50%';\n            this.pre.style.transform = 'translate(-50%, -50%)';\n            this.pre.style.zIndex = '9';\n            this.pre.style.backgroundAttachment = 'fixed';\n            this.pre.style.mixBlendMode = 'difference';\n        }\n    }\n    render(scene, camera) {\n        this.renderer.render(scene, camera);\n        const w = this.canvas.width;\n        const h = this.canvas.height;\n        if (this.context) {\n            this.context.clearRect(0, 0, w, h);\n            if (this.context && w && h) {\n                this.context.drawImage(this.renderer.domElement, 0, 0, w, h);\n            }\n            this.asciify(this.context, w, h);\n            this.hue();\n        }\n    }\n    onMouseMove(e) {\n        this.mouse = { x: e.clientX * PX_RATIO, y: e.clientY * PX_RATIO };\n    }\n    get dx() {\n        return this.mouse.x - this.center.x;\n    }\n    get dy() {\n        return this.mouse.y - this.center.y;\n    }\n    hue() {\n        const deg = (Math.atan2(this.dy, this.dx) * 180) / Math.PI;\n        this.deg += (deg - this.deg) * 0.075;\n        this.domElement.style.filter = `hue-rotate(${this.deg.toFixed(1)}deg)`;\n    }\n    asciify(ctx, w, h) {\n        if (w && h) {\n            const imgData = ctx.getImageData(0, 0, w, h).data;\n            let str = '';\n            for (let y = 0; y < h; y++) {\n                for (let x = 0; x < w; x++) {\n                    const i = x * 4 + y * 4 * w;\n                    const [r, g, b, a] = [imgData[i], imgData[i + 1], imgData[i + 2], imgData[i + 3]];\n                    if (a === 0) {\n                        str += ' ';\n                        continue;\n                    }\n                    let gray = (0.3 * r + 0.6 * g + 0.1 * b) / 255;\n                    let idx = Math.floor((1 - gray) * (this.charset.length - 1));\n                    if (this.invert)\n                        idx = this.charset.length - idx - 1;\n                    str += this.charset[idx];\n                }\n                str += '\\n';\n            }\n            this.pre.innerHTML = str;\n        }\n    }\n    dispose() {\n        document.removeEventListener('mousemove', this.onMouseMove);\n    }\n}\nclass CanvasTxt {\n    canvas;\n    context;\n    txt;\n    fontSize;\n    fontFamily;\n    color;\n    font;\n    constructor(txt, { fontSize = 200, fontFamily = 'Arial', color = '#fdf9f3' } = {}) {\n        this.canvas = document.createElement('canvas');\n        this.context = this.canvas.getContext('2d');\n        this.txt = txt;\n        this.fontSize = fontSize;\n        this.fontFamily = fontFamily;\n        this.color = color;\n        this.font = `600 ${this.fontSize}px ${this.fontFamily}`;\n    }\n    resize() {\n        if (this.context) {\n            this.context.font = this.font;\n            const metrics = this.context.measureText(this.txt);\n            const textWidth = Math.ceil(metrics.width) + 20;\n            const textHeight = Math.ceil(metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent) + 20;\n            this.canvas.width = textWidth;\n            this.canvas.height = textHeight;\n        }\n    }\n    render() {\n        if (this.context) {\n            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);\n            this.context.fillStyle = this.color;\n            this.context.font = this.font;\n            const metrics = this.context.measureText(this.txt);\n            const yPos = 10 + metrics.actualBoundingBoxAscent;\n            this.context.fillText(this.txt, 10, yPos);\n        }\n    }\n    get width() {\n        return this.canvas.width;\n    }\n    get height() {\n        return this.canvas.height;\n    }\n    get texture() {\n        return this.canvas;\n    }\n}\nclass CanvAscii {\n    textString;\n    asciiFontSize;\n    textFontSize;\n    textColor;\n    planeBaseHeight;\n    container;\n    width;\n    height;\n    enableWaves;\n    camera;\n    scene;\n    mouse;\n    textCanvas;\n    texture;\n    geometry;\n    material;\n    mesh;\n    renderer;\n    filter;\n    center;\n    animationFrameId = 0;\n    constructor({ text, asciiFontSize, textFontSize, textColor, planeBaseHeight, enableWaves }, containerElem, width, height) {\n        this.textString = text;\n        this.asciiFontSize = asciiFontSize;\n        this.textFontSize = textFontSize;\n        this.textColor = textColor;\n        this.planeBaseHeight = planeBaseHeight;\n        this.container = containerElem;\n        this.width = width;\n        this.height = height;\n        this.enableWaves = enableWaves;\n        this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 1000);\n        this.camera.position.z = 30;\n        this.scene = new THREE.Scene();\n        this.mouse = { x: this.width / 2, y: this.height / 2 };\n        this.onMouseMove = this.onMouseMove.bind(this);\n    }\n    async init() {\n        try {\n            await document.fonts.load('600 200px \"IBM Plex Mono\"');\n            await document.fonts.load('500 12px \"IBM Plex Mono\"');\n        }\n        catch (e) { }\n        await document.fonts.ready;\n        this.setMesh();\n        this.setRenderer();\n    }\n    setMesh() {\n        this.textCanvas = new CanvasTxt(this.textString, {\n            fontSize: this.textFontSize,\n            fontFamily: 'IBM Plex Mono',\n            color: this.textColor\n        });\n        this.textCanvas.resize();\n        this.textCanvas.render();\n        this.texture = new THREE.CanvasTexture(this.textCanvas.texture);\n        this.texture.minFilter = THREE.NearestFilter;\n        const textAspect = this.textCanvas.width / this.textCanvas.height;\n        const baseH = this.planeBaseHeight;\n        const planeW = baseH * textAspect;\n        const planeH = baseH;\n        this.geometry = new THREE.PlaneGeometry(planeW, planeH, 36, 36);\n        this.material = new THREE.ShaderMaterial({\n            vertexShader,\n            fragmentShader,\n            transparent: true,\n            uniforms: {\n                uTime: { value: 0 },\n                mouse: { value: 1.0 },\n                uTexture: { value: this.texture },\n                uEnableWaves: { value: this.enableWaves ? 1.0 : 0.0 }\n            }\n        });\n        this.mesh = new THREE.Mesh(this.geometry, this.material);\n        this.scene.add(this.mesh);\n    }\n    setRenderer() {\n        this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });\n        this.renderer.setPixelRatio(1);\n        this.renderer.setClearColor(0x000000, 0);\n        this.filter = new AsciiFilter(this.renderer, {\n            fontFamily: 'IBM Plex Mono',\n            fontSize: this.asciiFontSize,\n            invert: true\n        });\n        this.container.appendChild(this.filter.domElement);\n        this.setSize(this.width, this.height);\n        this.container.addEventListener('mousemove', this.onMouseMove);\n        this.container.addEventListener('touchmove', this.onMouseMove);\n    }\n    setSize(w, h) {\n        this.width = w;\n        this.height = h;\n        this.camera.aspect = w / h;\n        this.camera.updateProjectionMatrix();\n        this.filter.setSize(w, h);\n        this.center = { x: w / 2, y: h / 2 };\n    }\n    load() {\n        this.animate();\n    }\n    onMouseMove(evt) {\n        const e = evt.touches ? evt.touches[0] : evt;\n        const bounds = this.container.getBoundingClientRect();\n        const x = e.clientX - bounds.left;\n        const y = e.clientY - bounds.top;\n        this.mouse = { x, y };\n    }\n    animate() {\n        const animateFrame = () => {\n            this.animationFrameId = requestAnimationFrame(animateFrame);\n            this.render();\n        };\n        animateFrame();\n    }\n    render() {\n        const time = new Date().getTime() * 0.001;\n        this.textCanvas.render();\n        this.texture.needsUpdate = true;\n        this.mesh.material.uniforms.uTime.value = Math.sin(time);\n        this.updateRotation();\n        this.filter.render(this.scene, this.camera);\n    }\n    updateRotation() {\n        const x = map(this.mouse.y, 0, this.height, 0.5, -0.5);\n        const y = map(this.mouse.x, 0, this.width, -0.5, 0.5);\n        this.mesh.rotation.x += (x - this.mesh.rotation.x) * 0.05;\n        this.mesh.rotation.y += (y - this.mesh.rotation.y) * 0.05;\n    }\n    clear() {\n        this.scene.traverse(object => {\n            const obj = object;\n            if (!obj.isMesh)\n                return;\n            [obj.material].flat().forEach(material => {\n                material.dispose();\n                Object.keys(material).forEach(key => {\n                    const matProp = material[key];\n                    if (matProp && typeof matProp === 'object' && 'dispose' in matProp && typeof matProp.dispose === 'function') {\n                        matProp.dispose();\n                    }\n                });\n            });\n            obj.geometry.dispose();\n        });\n        this.scene.clear();\n    }\n    dispose() {\n        cancelAnimationFrame(this.animationFrameId);\n        if (this.filter) {\n            this.filter.dispose();\n            if (this.filter.domElement.parentNode) {\n                this.container.removeChild(this.filter.domElement);\n            }\n        }\n        this.container.removeEventListener('mousemove', this.onMouseMove);\n        this.container.removeEventListener('touchmove', this.onMouseMove);\n        this.clear();\n        if (this.renderer) {\n            this.renderer.dispose();\n            this.renderer.forceContextLoss();\n        }\n    }\n}\nexport function ASCIIText({ text = 'David!', asciiFontSize = 8, textFontSize = 200, textColor = '#fdf9f3', planeBaseHeight = 8, enableWaves = true }) {\n    const containerRef = useRef(null);\n    const asciiRef = useRef(null);\n    useEffect(() => {\n        if (!containerRef.current)\n            return;\n        let cancelled = false;\n        let observer = null;\n        let ro = null;\n        const createAndInit = async (container, w, h) => {\n            const instance = new CanvAscii({ text, asciiFontSize, textFontSize, textColor, planeBaseHeight, enableWaves }, container, w, h);\n            await instance.init();\n            return instance;\n        };\n        const setup = async () => {\n            const { width, height } = containerRef.current.getBoundingClientRect();\n            if (width === 0 || height === 0) {\n                observer = new IntersectionObserver(async ([entry]) => {\n                    if (cancelled)\n                        return;\n                    if (entry.isIntersecting && entry.boundingClientRect.width > 0 && entry.boundingClientRect.height > 0) {\n                        const { width: w, height: h } = entry.boundingClientRect;\n                        observer?.disconnect();\n                        observer = null;\n                        if (!cancelled) {\n                            asciiRef.current = await createAndInit(containerRef.current, w, h);\n                            if (!cancelled && asciiRef.current) {\n                                asciiRef.current.load();\n                            }\n                        }\n                    }\n                }, { threshold: 0.1 });\n                observer.observe(containerRef.current);\n                return;\n            }\n            asciiRef.current = await createAndInit(containerRef.current, width, height);\n            if (!cancelled && asciiRef.current) {\n                asciiRef.current.load();\n                ro = new ResizeObserver(entries => {\n                    if (!entries[0] || !asciiRef.current)\n                        return;\n                    const { width: w, height: h } = entries[0].contentRect;\n                    if (w > 0 && h > 0) {\n                        asciiRef.current.setSize(w, h);\n                    }\n                });\n                ro.observe(containerRef.current);\n            }\n        };\n        setup();\n        return () => {\n            cancelled = true;\n            if (observer)\n                observer.disconnect();\n            if (ro)\n                ro.disconnect();\n            if (asciiRef.current) {\n                asciiRef.current.dispose();\n                asciiRef.current = null;\n            }\n        };\n    }, [text, asciiFontSize, textFontSize, textColor, planeBaseHeight, enableWaves]);\n    return (<div ref={containerRef} className=\"ascii-text-container\" style={{\n            position: 'absolute',\n            width: '100%',\n            height: '100%'\n        }}>\n      <style>{`\n        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600&display=swap');\n\n        .ascii-text-container canvas {\n          position: absolute;\n          left: 0;\n          top: 0;\n          width: 100%;\n          height: 100%;\n          image-rendering: optimizeSpeed;\n          image-rendering: -moz-crisp-edges;\n          image-rendering: -o-crisp-edges;\n          image-rendering: -webkit-optimize-contrast;\n          image-rendering: optimize-contrast;\n          image-rendering: crisp-edges;\n          image-rendering: pixelated;\n        }\n\n        .ascii-text-container pre {\n          margin: 0;\n          user-select: none;\n          padding: 0;\n          line-height: 1em;\n          text-align: left;\n          position: absolute;\n          left: 0;\n          top: 0;\n          background-image: radial-gradient(circle, #ff6188 0%, #fc9867 50%, #ffd866 100%);\n          background-attachment: fixed;\n          -webkit-text-fill-color: transparent;\n          -webkit-background-clip: text;\n          z-index: 9;\n          mix-blend-mode: difference;\n        }\n      `}</style>\n    </div>);\n}\nexport default ASCIIText;",
    "props": [
      {
        "name": "text",
        "type": "string",
        "default": "'David!'",
        "description": "The text content to display and animate."
      },
      {
        "name": "asciiFontSize",
        "type": "number",
        "default": "8",
        "description": "Controls the ascii font size for the component animation."
      },
      {
        "name": "textFontSize",
        "type": "number",
        "default": "200",
        "description": "Controls the text font size for the component animation."
      },
      {
        "name": "textColor",
        "type": "string",
        "default": "'#fdf9f3'",
        "description": "Controls the text color for the component animation."
      },
      {
        "name": "planeBaseHeight",
        "type": "number",
        "default": "8",
        "description": "Controls the plane base height for the component animation."
      },
      {
        "name": "enableWaves",
        "type": "boolean",
        "default": "true",
        "description": "Controls the enable waves for the component animation."
      }
    ]
  },
  "blur-text": {
    "slug": "blur-text",
    "name": "Blur Text",
    "description": "Text starts blurred then crisply resolves for a soft-focus reveal effect.",
    "dependencies": {
      "motion": "^12.23.12"
    },
    "installation": {
      "cliTs": "npx kibo add blur-text",
      "cliJs": "npx kibo add blur-text --js",
      "npm": "npm i motion",
      "pnpm": "pnpm add motion",
      "yarn": "yarn add motion",
      "bun": "bun add motion"
    },
    "usageTs": "import { BlurText } from \"@/components/kibo/blur-text/component\";\n\nexport default function MyComponent() {\n  return (\n    <BlurText\n      text=\"Experience motion like never before.\"\n      className=\"text-4xl font-semibold text-white\"\n      delay={150}\n    />\n  );\n}",
    "usageJs": "import { BlurText } from \"@/components/kibo/blur-text/component\";\nexport default function MyComponent() {\n    return (<BlurText text=\"Experience motion like never before.\" className=\"text-4xl font-semibold text-white\" delay={150}/>);\n}",
    "componentSourceTs": "\"use client\";\n\nimport { motion, type Transition, type Easing } from \"motion/react\";\nimport { useEffect, useRef, useState, useMemo } from \"react\";\n\nexport interface BlurTextProps {\n  /** The text content to display and animate. */\n  text?: string;\n  /** Delay in milliseconds between each animated segment. */\n  delay?: number;\n  /** Additional CSS classes to apply to the container. */\n  className?: string;\n  /** Whether to animate word by word or letter by letter. */\n  animateBy?: \"words\" | \"letters\";\n  /** The direction the text should animate from. */\n  direction?: \"top\" | \"bottom\";\n  /** Intersection Observer threshold (0-1). */\n  threshold?: number;\n  /** Intersection Observer root margin. */\n  rootMargin?: string;\n  /** Custom starting animation keyframe. */\n  animationFrom?: Record<string, string | number>;\n  /** Custom target animation keyframes. */\n  animationTo?: Array<Record<string, string | number>>;\n  /** Animation easing function or array of functions. */\n  easing?: Easing | Easing[];\n  /** Callback fired when the entire animation completes. */\n  onAnimationComplete?: () => void;\n  /** Duration in seconds for each keyframe step. */\n  stepDuration?: number;\n}\n\nconst buildKeyframes = (\n  from: Record<string, string | number>,\n  steps: Array<Record<string, string | number>>\n): Record<string, Array<string | number>> => {\n  const keys = new Set<string>([\n    ...Object.keys(from),\n    ...steps.flatMap((s) => Object.keys(s)),\n  ]);\n\n  const keyframes: Record<string, Array<string | number>> = {};\n  keys.forEach((k) => {\n    keyframes[k] = [from[k], ...steps.map((s) => s[k])];\n  });\n  return keyframes;\n};\n\nexport function BlurText({\n  text = \"\",\n  delay = 200,\n  className = \"\",\n  animateBy = \"words\",\n  direction = \"top\",\n  threshold = 0.1,\n  rootMargin = \"0px\",\n  animationFrom,\n  animationTo,\n  easing = (t: number) => t,\n  onAnimationComplete,\n  stepDuration = 0.35,\n}: BlurTextProps) {\n  const elements = animateBy === \"words\" ? text.split(\" \") : text.split(\"\");\n  const [inView, setInView] = useState(false);\n  const ref = useRef<HTMLParagraphElement>(null);\n\n  useEffect(() => {\n    if (!ref.current) return;\n    const observer = new IntersectionObserver(\n      ([entry]) => {\n        if (entry.isIntersecting) {\n          setInView(true);\n          observer.unobserve(ref.current as Element);\n        }\n      },\n      { threshold, rootMargin }\n    );\n    observer.observe(ref.current);\n    return () => observer.disconnect();\n  }, [threshold, rootMargin]);\n\n  const defaultFrom = useMemo(\n    () =>\n      direction === \"top\"\n        ? { filter: \"blur(10px)\", opacity: 0, y: -50 }\n        : { filter: \"blur(10px)\", opacity: 0, y: 50 },\n    [direction]\n  );\n\n  const defaultTo = useMemo(\n    () => [\n      {\n        filter: \"blur(5px)\",\n        opacity: 0.5,\n        y: direction === \"top\" ? 5 : -5,\n      },\n      { filter: \"blur(0px)\", opacity: 1, y: 0 },\n    ],\n    [direction]\n  );\n\n  const fromSnapshot = animationFrom ?? defaultFrom;\n  const toSnapshots = animationTo ?? defaultTo;\n\n  const stepCount = toSnapshots.length + 1;\n  const totalDuration = stepDuration * (stepCount - 1);\n  const times = Array.from({ length: stepCount }, (_, i) =>\n    stepCount === 1 ? 0 : i / (stepCount - 1)\n  );\n\n  return (\n    <p ref={ref} className={`flex flex-wrap ${className}`}>\n      {elements.map((segment, index) => {\n        const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots);\n\n        const spanTransition: Transition = {\n          duration: totalDuration,\n          times,\n          delay: (index * delay) / 1000,\n          ease: easing,\n        };\n\n        return (\n          <motion.span\n            key={index}\n            initial={fromSnapshot}\n            animate={inView ? animateKeyframes : fromSnapshot}\n            transition={spanTransition}\n            onAnimationComplete={\n              index === elements.length - 1 ? onAnimationComplete : undefined\n            }\n            style={{\n              display: \"inline-block\",\n              willChange: \"transform, filter, opacity\",\n            }}\n          >\n            {segment === \" \" ? \"\\u00A0\" : segment}\n            {animateBy === \"words\" && index < elements.length - 1 && \"\\u00A0\"}\n          </motion.span>\n        );\n      })}\n    </p>\n  );\n}\n",
    "componentSourceJs": "\"use client\";\nimport { motion } from \"motion/react\";\nimport { useEffect, useRef, useState, useMemo } from \"react\";\nconst buildKeyframes = (from, steps) => {\n    const keys = new Set([\n        ...Object.keys(from),\n        ...steps.flatMap((s) => Object.keys(s)),\n    ]);\n    const keyframes = {};\n    keys.forEach((k) => {\n        keyframes[k] = [from[k], ...steps.map((s) => s[k])];\n    });\n    return keyframes;\n};\nexport function BlurText({ text = \"\", delay = 200, className = \"\", animateBy = \"words\", direction = \"top\", threshold = 0.1, rootMargin = \"0px\", animationFrom, animationTo, easing = (t) => t, onAnimationComplete, stepDuration = 0.35, }) {\n    const elements = animateBy === \"words\" ? text.split(\" \") : text.split(\"\");\n    const [inView, setInView] = useState(false);\n    const ref = useRef(null);\n    useEffect(() => {\n        if (!ref.current)\n            return;\n        const observer = new IntersectionObserver(([entry]) => {\n            if (entry.isIntersecting) {\n                setInView(true);\n                observer.unobserve(ref.current);\n            }\n        }, { threshold, rootMargin });\n        observer.observe(ref.current);\n        return () => observer.disconnect();\n    }, [threshold, rootMargin]);\n    const defaultFrom = useMemo(() => direction === \"top\"\n        ? { filter: \"blur(10px)\", opacity: 0, y: -50 }\n        : { filter: \"blur(10px)\", opacity: 0, y: 50 }, [direction]);\n    const defaultTo = useMemo(() => [\n        {\n            filter: \"blur(5px)\",\n            opacity: 0.5,\n            y: direction === \"top\" ? 5 : -5,\n        },\n        { filter: \"blur(0px)\", opacity: 1, y: 0 },\n    ], [direction]);\n    const fromSnapshot = animationFrom ?? defaultFrom;\n    const toSnapshots = animationTo ?? defaultTo;\n    const stepCount = toSnapshots.length + 1;\n    const totalDuration = stepDuration * (stepCount - 1);\n    const times = Array.from({ length: stepCount }, (_, i) => stepCount === 1 ? 0 : i / (stepCount - 1));\n    return (<p ref={ref} className={`flex flex-wrap ${className}`}>\n      {elements.map((segment, index) => {\n            const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots);\n            const spanTransition = {\n                duration: totalDuration,\n                times,\n                delay: (index * delay) / 1000,\n                ease: easing,\n            };\n            return (<motion.span key={index} initial={fromSnapshot} animate={inView ? animateKeyframes : fromSnapshot} transition={spanTransition} onAnimationComplete={index === elements.length - 1 ? onAnimationComplete : undefined} style={{\n                    display: \"inline-block\",\n                    willChange: \"transform, filter, opacity\",\n                }}>\n            {segment === \" \" ? \"\\u00A0\" : segment}\n            {animateBy === \"words\" && index < elements.length - 1 && \"\\u00A0\"}\n          </motion.span>);\n        })}\n    </p>);\n}",
    "props": [
      {
        "name": "text",
        "type": "string",
        "default": "\"\"",
        "description": "The text content to display and animate."
      },
      {
        "name": "delay",
        "type": "number",
        "default": "200",
        "description": "Delay in milliseconds between each animated segment."
      },
      {
        "name": "className",
        "type": "string",
        "default": "\"\"",
        "description": "Additional CSS classes to apply to the container."
      },
      {
        "name": "animateBy",
        "type": "\"words\" | \"letters\"",
        "default": "\"words\"",
        "description": "Whether to animate word by word or letter by letter."
      },
      {
        "name": "direction",
        "type": "\"top\" | \"bottom\"",
        "default": "\"top\"",
        "description": "The direction the text should animate from."
      },
      {
        "name": "threshold",
        "type": "number",
        "default": "0.1",
        "description": "Intersection Observer threshold (0-1)."
      },
      {
        "name": "rootMargin",
        "type": "string",
        "default": "\"0px\"",
        "description": "Intersection Observer root margin."
      },
      {
        "name": "animationFrom",
        "type": "Record<string, string | number>",
        "default": "-",
        "description": "Custom starting animation keyframe."
      },
      {
        "name": "animationTo",
        "type": "Array<Record<string, string | number>>",
        "default": "-",
        "description": "Custom target animation keyframes."
      },
      {
        "name": "easing",
        "type": "Easing | Easing[]",
        "default": "(t: number) => t",
        "description": "Animation easing function or array of functions."
      },
      {
        "name": "onAnimationComplete",
        "type": "() => void",
        "default": "-",
        "description": "Callback fired when the entire animation completes."
      },
      {
        "name": "stepDuration",
        "type": "number",
        "default": "0.35",
        "description": "Duration in seconds for each keyframe step."
      }
    ]
  },
  "circular-text": {
    "slug": "circular-text",
    "name": "Circular Text",
    "description": "Renders text along an animated circular path with smooth spin, customizable radius, and reactive hover velocity.",
    "dependencies": {
      "motion": "^12.23.12"
    },
    "installation": {
      "cliTs": "npx kibo add circular-text",
      "cliJs": "npx kibo add circular-text --js",
      "npm": "npm i motion",
      "pnpm": "pnpm add motion",
      "yarn": "yarn add motion",
      "bun": "bun add motion"
    },
    "usageTs": "import { CircularText } from \"@/components/kibo/circular-text/component\";\n\nexport default function Example() {\n  return (\n    <CircularText />\n  );\n}",
    "usageJs": "import { CircularText } from \"@/components/kibo/circular-text/component\";\nexport default function Example() {\n    return (<CircularText />);\n}",
    "componentSourceTs": "\"use client\";\n\nimport React, { useEffect } from 'react';\nimport { motion, useAnimation, useMotionValue, MotionValue, type Transition } from 'motion/react';\ninterface CircularTextProps {\n  text: string;\n  spinDuration?: number;\n  onHover?: 'slowDown' | 'speedUp' | 'pause' | 'goBonkers';\n  className?: string;\n}\n\nconst getRotationTransition = (duration: number, from: number, loop: boolean = true) => ({\n  from,\n  to: from + 360,\n  ease: 'linear' as const,\n  duration,\n  type: 'tween' as const,\n  repeat: loop ? Infinity : 0\n});\n\nconst getTransition = (duration: number, from: number) => ({\n  rotate: getRotationTransition(duration, from),\n  scale: {\n    type: 'spring' as const,\n    damping: 20,\n    stiffness: 300\n  }\n});\n\nexport const CircularText: React.FC<CircularTextProps> = ({\n  text,\n  spinDuration = 20,\n  onHover = 'speedUp',\n  className = ''\n}) => {\n  const letters = Array.from(text);\n  const controls = useAnimation();\n  const rotation: MotionValue<number> = useMotionValue(0);\n\n  useEffect(() => {\n    const start = rotation.get();\n    controls.start({\n      rotate: start + 360,\n      scale: 1,\n      transition: getTransition(spinDuration, start)\n    });\n  }, [spinDuration, text, onHover, controls]);\n\n  const handleHoverStart = () => {\n    const start = rotation.get();\n\n    if (!onHover) return;\n\n    let transitionConfig: ReturnType<typeof getTransition> | Transition;\n    let scaleVal = 1;\n\n    switch (onHover) {\n      case 'slowDown':\n        transitionConfig = getTransition(spinDuration * 2, start);\n        break;\n      case 'speedUp':\n        transitionConfig = getTransition(spinDuration / 4, start);\n        break;\n      case 'pause':\n        transitionConfig = {\n          rotate: { type: 'spring', damping: 20, stiffness: 300 },\n          scale: { type: 'spring', damping: 20, stiffness: 300 }\n        };\n        break;\n      case 'goBonkers':\n        transitionConfig = getTransition(spinDuration / 20, start);\n        scaleVal = 0.8;\n        break;\n      default:\n        transitionConfig = getTransition(spinDuration, start);\n    }\n\n    controls.start({\n      rotate: start + 360,\n      scale: scaleVal,\n      transition: transitionConfig\n    });\n  };\n\n  const handleHoverEnd = () => {\n    const start = rotation.get();\n    controls.start({\n      rotate: start + 360,\n      scale: 1,\n      transition: getTransition(spinDuration, start)\n    });\n  };\n\n  return (\n    <motion.div\n      className={`m-0 mx-auto rounded-full w-[200px] h-[200px] relative font-black text-white text-center cursor-pointer origin-center ${className}`}\n      style={{ rotate: rotation }}\n      initial={{ rotate: 0 }}\n      animate={controls}\n      onMouseEnter={handleHoverStart}\n      onMouseLeave={handleHoverEnd}\n    >\n      {letters.map((letter, i) => {\n        const rotationDeg = (360 / letters.length) * i;\n        const factor = Math.PI / letters.length;\n        const x = factor * i;\n        const y = factor * i;\n        const transform = `rotateZ(${rotationDeg}deg) translate3d(${x}px, ${y}px, 0)`;\n\n        return (\n          <span\n            key={i}\n            className=\"absolute inline-block inset-0 text-2xl transition-all duration-500 ease-[cubic-bezier(0,0,0,1)]\"\n            style={{ transform, WebkitTransform: transform }}\n          >\n            {letter}\n          </span>\n        );\n      })}\n    </motion.div>\n  );\n};\n\nexport default CircularText;",
    "componentSourceJs": "\"use client\";\nimport React, { useEffect } from 'react';\nimport { motion, useAnimation, useMotionValue } from 'motion/react';\nconst getRotationTransition = (duration, from, loop = true) => ({\n    from,\n    to: from + 360,\n    ease: 'linear',\n    duration,\n    type: 'tween',\n    repeat: loop ? Infinity : 0\n});\nconst getTransition = (duration, from) => ({\n    rotate: getRotationTransition(duration, from),\n    scale: {\n        type: 'spring',\n        damping: 20,\n        stiffness: 300\n    }\n});\nexport const CircularText = ({ text, spinDuration = 20, onHover = 'speedUp', className = '' }) => {\n    const letters = Array.from(text);\n    const controls = useAnimation();\n    const rotation = useMotionValue(0);\n    useEffect(() => {\n        const start = rotation.get();\n        controls.start({\n            rotate: start + 360,\n            scale: 1,\n            transition: getTransition(spinDuration, start)\n        });\n    }, [spinDuration, text, onHover, controls]);\n    const handleHoverStart = () => {\n        const start = rotation.get();\n        if (!onHover)\n            return;\n        let transitionConfig;\n        let scaleVal = 1;\n        switch (onHover) {\n            case 'slowDown':\n                transitionConfig = getTransition(spinDuration * 2, start);\n                break;\n            case 'speedUp':\n                transitionConfig = getTransition(spinDuration / 4, start);\n                break;\n            case 'pause':\n                transitionConfig = {\n                    rotate: { type: 'spring', damping: 20, stiffness: 300 },\n                    scale: { type: 'spring', damping: 20, stiffness: 300 }\n                };\n                break;\n            case 'goBonkers':\n                transitionConfig = getTransition(spinDuration / 20, start);\n                scaleVal = 0.8;\n                break;\n            default:\n                transitionConfig = getTransition(spinDuration, start);\n        }\n        controls.start({\n            rotate: start + 360,\n            scale: scaleVal,\n            transition: transitionConfig\n        });\n    };\n    const handleHoverEnd = () => {\n        const start = rotation.get();\n        controls.start({\n            rotate: start + 360,\n            scale: 1,\n            transition: getTransition(spinDuration, start)\n        });\n    };\n    return (<motion.div className={`m-0 mx-auto rounded-full w-[200px] h-[200px] relative font-black text-white text-center cursor-pointer origin-center ${className}`} style={{ rotate: rotation }} initial={{ rotate: 0 }} animate={controls} onMouseEnter={handleHoverStart} onMouseLeave={handleHoverEnd}>\n      {letters.map((letter, i) => {\n            const rotationDeg = (360 / letters.length) * i;\n            const factor = Math.PI / letters.length;\n            const x = factor * i;\n            const y = factor * i;\n            const transform = `rotateZ(${rotationDeg}deg) translate3d(${x}px, ${y}px, 0)`;\n            return (<span key={i} className=\"absolute inline-block inset-0 text-2xl transition-all duration-500 ease-[cubic-bezier(0,0,0,1)]\" style={{ transform, WebkitTransform: transform }}>\n            {letter}\n          </span>);\n        })}\n    </motion.div>);\n};\nexport default CircularText;",
    "props": [
      {
        "name": "text",
        "type": "string",
        "default": "-",
        "description": "The text content to display and animate."
      },
      {
        "name": "spinDuration",
        "type": "number",
        "default": "20",
        "description": "Controls the spin duration for the component animation."
      },
      {
        "name": "onHover",
        "type": "'slowDown' | 'speedUp' | 'pause' | 'goBonkers'",
        "default": "'speedUp'",
        "description": "Controls the on hover for the component animation."
      },
      {
        "name": "className",
        "type": "string",
        "default": "''",
        "description": "Additional CSS classes for styling and layout."
      }
    ]
  },
  "count-up": {
    "slug": "count-up",
    "name": "Count Up",
    "description": "Smooth spring-physics numerical counter that animates from a start value to target value when entering viewport.",
    "dependencies": {
      "motion": "^12.23.12"
    },
    "installation": {
      "cliTs": "npx kibo add count-up",
      "cliJs": "npx kibo add count-up --js",
      "npm": "npm i motion",
      "pnpm": "pnpm add motion",
      "yarn": "yarn add motion",
      "bun": "bun add motion"
    },
    "usageTs": "import { CountUp } from \"@/components/kibo/count-up/component\";\n\nexport default function Example() {\n  return (\n    <CountUp />\n  );\n}",
    "usageJs": "import { CountUp } from \"@/components/kibo/count-up/component\";\nexport default function Example() {\n    return (<CountUp />);\n}",
    "componentSourceTs": "\"use client\";\n\nimport { useInView, useMotionValue, useSpring } from 'motion/react';\nimport { useCallback, useEffect, useRef } from 'react';\n\ninterface CountUpProps {\n  to: number;\n  from?: number;\n  direction?: 'up' | 'down';\n  delay?: number;\n  duration?: number;\n  className?: string;\n  startWhen?: boolean;\n  separator?: string;\n  onStart?: () => void;\n  onEnd?: () => void;\n}\n\nexport function CountUp({\n  to,\n  from = 0,\n  direction = 'up',\n  delay = 0,\n  duration = 2,\n  className = '',\n  startWhen = true,\n  separator = '',\n  onStart,\n  onEnd\n}: CountUpProps) {\n  const ref = useRef<HTMLSpanElement>(null);\n  const motionValue = useMotionValue(direction === 'down' ? to : from);\n\n  const damping = 20 + 40 * (1 / duration);\n  const stiffness = 100 * (1 / duration);\n\n  const springValue = useSpring(motionValue, {\n    damping,\n    stiffness\n  });\n\n  const isInView = useInView(ref, { once: true, margin: '0px' });\n\n  const getDecimalPlaces = (num: number): number => {\n    const str = num.toString();\n    if (str.includes('.')) {\n      const decimals = str.split('.')[1];\n      if (parseInt(decimals) !== 0) {\n        return decimals.length;\n      }\n    }\n    return 0;\n  };\n\n  const maxDecimals = Math.max(getDecimalPlaces(from), getDecimalPlaces(to));\n\n  const formatValue = useCallback(\n    (latest: number) => {\n      const hasDecimals = maxDecimals > 0;\n\n      const options: Intl.NumberFormatOptions = {\n        useGrouping: !!separator,\n        minimumFractionDigits: hasDecimals ? maxDecimals : 0,\n        maximumFractionDigits: hasDecimals ? maxDecimals : 0\n      };\n\n      const formattedNumber = Intl.NumberFormat('en-US', options).format(latest);\n\n      return separator ? formattedNumber.replace(/,/g, separator) : formattedNumber;\n    },\n    [maxDecimals, separator]\n  );\n\n  useEffect(() => {\n    if (ref.current) {\n      ref.current.textContent = formatValue(direction === 'down' ? to : from);\n    }\n  }, [from, to, direction, formatValue]);\n\n  useEffect(() => {\n    if (isInView && startWhen) {\n      if (typeof onStart === 'function') {\n        onStart();\n      }\n\n      const timeoutId = setTimeout(() => {\n        motionValue.set(direction === 'down' ? from : to);\n      }, delay * 1000);\n\n      const durationTimeoutId = setTimeout(\n        () => {\n          if (typeof onEnd === 'function') {\n            onEnd();\n          }\n        },\n        delay * 1000 + duration * 1000\n      );\n\n      return () => {\n        clearTimeout(timeoutId);\n        clearTimeout(durationTimeoutId);\n      };\n    }\n  }, [isInView, startWhen, motionValue, direction, from, to, delay, onStart, onEnd, duration]);\n\n  useEffect(() => {\n    const unsubscribe = springValue.on('change', (latest: number) => {\n      if (ref.current) {\n        ref.current.textContent = formatValue(latest);\n      }\n    });\n\n    return () => unsubscribe();\n  }, [springValue, formatValue]);\n\n  return <span className={className} ref={ref} />;\n}\nexport default CountUp;\n",
    "componentSourceJs": "\"use client\";\nimport { useInView, useMotionValue, useSpring } from 'motion/react';\nimport { useCallback, useEffect, useRef } from 'react';\nexport function CountUp({ to, from = 0, direction = 'up', delay = 0, duration = 2, className = '', startWhen = true, separator = '', onStart, onEnd }) {\n    const ref = useRef(null);\n    const motionValue = useMotionValue(direction === 'down' ? to : from);\n    const damping = 20 + 40 * (1 / duration);\n    const stiffness = 100 * (1 / duration);\n    const springValue = useSpring(motionValue, {\n        damping,\n        stiffness\n    });\n    const isInView = useInView(ref, { once: true, margin: '0px' });\n    const getDecimalPlaces = (num) => {\n        const str = num.toString();\n        if (str.includes('.')) {\n            const decimals = str.split('.')[1];\n            if (parseInt(decimals) !== 0) {\n                return decimals.length;\n            }\n        }\n        return 0;\n    };\n    const maxDecimals = Math.max(getDecimalPlaces(from), getDecimalPlaces(to));\n    const formatValue = useCallback((latest) => {\n        const hasDecimals = maxDecimals > 0;\n        const options = {\n            useGrouping: !!separator,\n            minimumFractionDigits: hasDecimals ? maxDecimals : 0,\n            maximumFractionDigits: hasDecimals ? maxDecimals : 0\n        };\n        const formattedNumber = Intl.NumberFormat('en-US', options).format(latest);\n        return separator ? formattedNumber.replace(/,/g, separator) : formattedNumber;\n    }, [maxDecimals, separator]);\n    useEffect(() => {\n        if (ref.current) {\n            ref.current.textContent = formatValue(direction === 'down' ? to : from);\n        }\n    }, [from, to, direction, formatValue]);\n    useEffect(() => {\n        if (isInView && startWhen) {\n            if (typeof onStart === 'function') {\n                onStart();\n            }\n            const timeoutId = setTimeout(() => {\n                motionValue.set(direction === 'down' ? from : to);\n            }, delay * 1000);\n            const durationTimeoutId = setTimeout(() => {\n                if (typeof onEnd === 'function') {\n                    onEnd();\n                }\n            }, delay * 1000 + duration * 1000);\n            return () => {\n                clearTimeout(timeoutId);\n                clearTimeout(durationTimeoutId);\n            };\n        }\n    }, [isInView, startWhen, motionValue, direction, from, to, delay, onStart, onEnd, duration]);\n    useEffect(() => {\n        const unsubscribe = springValue.on('change', (latest) => {\n            if (ref.current) {\n                ref.current.textContent = formatValue(latest);\n            }\n        });\n        return () => unsubscribe();\n    }, [springValue, formatValue]);\n    return <span className={className} ref={ref}/>;\n}\nexport default CountUp;",
    "props": [
      {
        "name": "to",
        "type": "number",
        "default": "-",
        "description": "Controls the to for the component animation."
      },
      {
        "name": "from",
        "type": "number",
        "default": "0",
        "description": "Controls the from for the component animation."
      },
      {
        "name": "direction",
        "type": "'up' | 'down'",
        "default": "'up'",
        "description": "Direction of movement (e.g., 'top', 'bottom', 'left', 'right')."
      },
      {
        "name": "delay",
        "type": "number",
        "default": "0",
        "description": "Delay in milliseconds before the animation begins or between steps."
      },
      {
        "name": "duration",
        "type": "number",
        "default": "2",
        "description": "Duration of the animation in seconds or milliseconds."
      },
      {
        "name": "className",
        "type": "string",
        "default": "''",
        "description": "Additional CSS classes for styling and layout."
      },
      {
        "name": "startWhen",
        "type": "boolean",
        "default": "true",
        "description": "Controls the start when for the component animation."
      },
      {
        "name": "separator",
        "type": "string",
        "default": "''",
        "description": "Controls the separator for the component animation."
      },
      {
        "name": "onStart",
        "type": "() => void",
        "default": "-",
        "description": "Controls the on start for the component animation."
      },
      {
        "name": "onEnd",
        "type": "() => void",
        "default": "-",
        "description": "Controls the on end for the component animation."
      }
    ]
  },
  "curved-loop": {
    "slug": "curved-loop",
    "name": "Curved Loop",
    "description": "Seamlessly repeats and animates text along a customizable SVG bezier curve with interactive drag and speed control.",
    "dependencies": {},
    "installation": {
      "cliTs": "npx kibo add curved-loop",
      "cliJs": "npx kibo add curved-loop --js",
      "npm": "npx kibo add curved-loop",
      "pnpm": "pnpm dlx kibo add curved-loop",
      "yarn": "yarn add curved-loop",
      "bun": "bunx kibo add curved-loop"
    },
    "usageTs": "import { CurvedLoop } from \"@/components/kibo/curved-loop/component\";\n\nexport default function Example() {\n  return (\n    <CurvedLoop />\n  );\n}",
    "usageJs": "import { CurvedLoop } from \"@/components/kibo/curved-loop/component\";\nexport default function Example() {\n    return (<CurvedLoop />);\n}",
    "componentSourceTs": "\"use client\";\n\nimport { useRef, useEffect, useState, useMemo, useId, type FC, type PointerEvent } from 'react';\n\ninterface CurvedLoopProps {\n  marqueeText?: string;\n  speed?: number;\n  className?: string;\n  curveAmount?: number;\n  direction?: 'left' | 'right';\n  interactive?: boolean;\n}\n\nexport const CurvedLoop: FC<CurvedLoopProps> = ({\n  marqueeText = '',\n  speed = 2,\n  className,\n  curveAmount = 400,\n  direction = 'left',\n  interactive = true\n}) => {\n  const text = useMemo(() => {\n    const hasTrailing = /\\s|\\u00A0$/.test(marqueeText);\n    return (hasTrailing ? marqueeText.replace(/\\s+$/, '') : marqueeText) + '\\u00A0';\n  }, [marqueeText]);\n\n  const measureRef = useRef<SVGTextElement | null>(null);\n  const textPathRef = useRef<SVGTextPathElement | null>(null);\n  const pathRef = useRef<SVGPathElement | null>(null);\n  const [spacing, setSpacing] = useState(0);\n  const [offset, setOffset] = useState(0);\n  const uid = useId();\n  const pathId = `curve-${uid}`;\n  const pathD = `M-100,40 Q500,${40 + curveAmount} 1540,40`;\n\n  const dragRef = useRef(false);\n  const lastXRef = useRef(0);\n  const dirRef = useRef<'left' | 'right'>(direction);\n  const velRef = useRef(0);\n\n  const textLength = spacing;\n  const totalText = textLength\n    ? Array(Math.ceil(1800 / textLength) + 2)\n        .fill(text)\n        .join('')\n    : text;\n  const ready = spacing > 0;\n\n  useEffect(() => {\n    if (measureRef.current) setSpacing(measureRef.current.getComputedTextLength());\n  }, [text, className]);\n\n  useEffect(() => {\n    if (!spacing) return;\n    if (textPathRef.current) {\n      const initial = -spacing;\n      textPathRef.current.setAttribute('startOffset', initial + 'px');\n      setOffset(initial);\n    }\n  }, [spacing]);\n\n  useEffect(() => {\n    if (!spacing || !ready) return;\n    let frame = 0;\n    const step = () => {\n      if (!dragRef.current && textPathRef.current) {\n        const delta = dirRef.current === 'right' ? speed : -speed;\n        const currentOffset = parseFloat(textPathRef.current.getAttribute('startOffset') || '0');\n        let newOffset = currentOffset + delta;\n        const wrapPoint = spacing;\n        if (newOffset <= -wrapPoint) newOffset += wrapPoint;\n        if (newOffset > 0) newOffset -= wrapPoint;\n        textPathRef.current.setAttribute('startOffset', newOffset + 'px');\n        setOffset(newOffset);\n      }\n      frame = requestAnimationFrame(step);\n    };\n    frame = requestAnimationFrame(step);\n    return () => cancelAnimationFrame(frame);\n  }, [spacing, speed, ready]);\n\n  const onPointerDown = (e: PointerEvent) => {\n    if (!interactive) return;\n    dragRef.current = true;\n    lastXRef.current = e.clientX;\n    velRef.current = 0;\n    (e.target as HTMLElement).setPointerCapture(e.pointerId);\n  };\n\n  const onPointerMove = (e: PointerEvent) => {\n    if (!interactive || !dragRef.current || !textPathRef.current) return;\n    const dx = e.clientX - lastXRef.current;\n    lastXRef.current = e.clientX;\n    velRef.current = dx;\n    const currentOffset = parseFloat(textPathRef.current.getAttribute('startOffset') || '0');\n    let newOffset = currentOffset + dx;\n    const wrapPoint = spacing;\n    if (newOffset <= -wrapPoint) newOffset += wrapPoint;\n    if (newOffset > 0) newOffset -= wrapPoint;\n    textPathRef.current.setAttribute('startOffset', newOffset + 'px');\n    setOffset(newOffset);\n  };\n\n  const endDrag = () => {\n    if (!interactive) return;\n    dragRef.current = false;\n    dirRef.current = velRef.current > 0 ? 'right' : 'left';\n  };\n\n  const cursorStyle = interactive ? (dragRef.current ? 'grabbing' : 'grab') : 'auto';\n\n  return (\n    <div\n      className=\"min-h-screen flex items-center justify-center w-full\"\n      style={{ visibility: ready ? 'visible' : 'hidden', cursor: cursorStyle }}\n      onPointerDown={onPointerDown}\n      onPointerMove={onPointerMove}\n      onPointerUp={endDrag}\n      onPointerLeave={endDrag}\n    >\n      <svg\n        className=\"select-none w-full overflow-visible block aspect-[100/12] text-[6rem] font-bold uppercase leading-none\"\n        viewBox=\"0 0 1440 120\"\n      >\n        <text ref={measureRef} xmlSpace=\"preserve\" style={{ visibility: 'hidden', opacity: 0, pointerEvents: 'none' }}>\n          {text}\n        </text>\n        <defs>\n          <path ref={pathRef} id={pathId} d={pathD} fill=\"none\" stroke=\"transparent\" />\n        </defs>\n        {ready && (\n          <text xmlSpace=\"preserve\" className={`fill-white ${className ?? ''}`}>\n            <textPath ref={textPathRef} href={`#${pathId}`} startOffset={offset + 'px'} xmlSpace=\"preserve\">\n              {totalText}\n            </textPath>\n          </text>\n        )}\n      </svg>\n    </div>\n  );\n};\n\nexport default CurvedLoop;",
    "componentSourceJs": "\"use client\";\nimport { useRef, useEffect, useState, useMemo, useId } from 'react';\nexport const CurvedLoop = ({ marqueeText = '', speed = 2, className, curveAmount = 400, direction = 'left', interactive = true }) => {\n    const text = useMemo(() => {\n        const hasTrailing = /\\s|\\u00A0$/.test(marqueeText);\n        return (hasTrailing ? marqueeText.replace(/\\s+$/, '') : marqueeText) + '\\u00A0';\n    }, [marqueeText]);\n    const measureRef = useRef(null);\n    const textPathRef = useRef(null);\n    const pathRef = useRef(null);\n    const [spacing, setSpacing] = useState(0);\n    const [offset, setOffset] = useState(0);\n    const uid = useId();\n    const pathId = `curve-${uid}`;\n    const pathD = `M-100,40 Q500,${40 + curveAmount} 1540,40`;\n    const dragRef = useRef(false);\n    const lastXRef = useRef(0);\n    const dirRef = useRef(direction);\n    const velRef = useRef(0);\n    const textLength = spacing;\n    const totalText = textLength\n        ? Array(Math.ceil(1800 / textLength) + 2)\n            .fill(text)\n            .join('')\n        : text;\n    const ready = spacing > 0;\n    useEffect(() => {\n        if (measureRef.current)\n            setSpacing(measureRef.current.getComputedTextLength());\n    }, [text, className]);\n    useEffect(() => {\n        if (!spacing)\n            return;\n        if (textPathRef.current) {\n            const initial = -spacing;\n            textPathRef.current.setAttribute('startOffset', initial + 'px');\n            setOffset(initial);\n        }\n    }, [spacing]);\n    useEffect(() => {\n        if (!spacing || !ready)\n            return;\n        let frame = 0;\n        const step = () => {\n            if (!dragRef.current && textPathRef.current) {\n                const delta = dirRef.current === 'right' ? speed : -speed;\n                const currentOffset = parseFloat(textPathRef.current.getAttribute('startOffset') || '0');\n                let newOffset = currentOffset + delta;\n                const wrapPoint = spacing;\n                if (newOffset <= -wrapPoint)\n                    newOffset += wrapPoint;\n                if (newOffset > 0)\n                    newOffset -= wrapPoint;\n                textPathRef.current.setAttribute('startOffset', newOffset + 'px');\n                setOffset(newOffset);\n            }\n            frame = requestAnimationFrame(step);\n        };\n        frame = requestAnimationFrame(step);\n        return () => cancelAnimationFrame(frame);\n    }, [spacing, speed, ready]);\n    const onPointerDown = (e) => {\n        if (!interactive)\n            return;\n        dragRef.current = true;\n        lastXRef.current = e.clientX;\n        velRef.current = 0;\n        e.target.setPointerCapture(e.pointerId);\n    };\n    const onPointerMove = (e) => {\n        if (!interactive || !dragRef.current || !textPathRef.current)\n            return;\n        const dx = e.clientX - lastXRef.current;\n        lastXRef.current = e.clientX;\n        velRef.current = dx;\n        const currentOffset = parseFloat(textPathRef.current.getAttribute('startOffset') || '0');\n        let newOffset = currentOffset + dx;\n        const wrapPoint = spacing;\n        if (newOffset <= -wrapPoint)\n            newOffset += wrapPoint;\n        if (newOffset > 0)\n            newOffset -= wrapPoint;\n        textPathRef.current.setAttribute('startOffset', newOffset + 'px');\n        setOffset(newOffset);\n    };\n    const endDrag = () => {\n        if (!interactive)\n            return;\n        dragRef.current = false;\n        dirRef.current = velRef.current > 0 ? 'right' : 'left';\n    };\n    const cursorStyle = interactive ? (dragRef.current ? 'grabbing' : 'grab') : 'auto';\n    return (<div className=\"min-h-screen flex items-center justify-center w-full\" style={{ visibility: ready ? 'visible' : 'hidden', cursor: cursorStyle }} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={endDrag} onPointerLeave={endDrag}>\n      <svg className=\"select-none w-full overflow-visible block aspect-[100/12] text-[6rem] font-bold uppercase leading-none\" viewBox=\"0 0 1440 120\">\n        <text ref={measureRef} xmlSpace=\"preserve\" style={{ visibility: 'hidden', opacity: 0, pointerEvents: 'none' }}>\n          {text}\n        </text>\n        <defs>\n          <path ref={pathRef} id={pathId} d={pathD} fill=\"none\" stroke=\"transparent\"/>\n        </defs>\n        {ready && (<text xmlSpace=\"preserve\" className={`fill-white ${className ?? ''}`}>\n            <textPath ref={textPathRef} href={`#${pathId}`} startOffset={offset + 'px'} xmlSpace=\"preserve\">\n              {totalText}\n            </textPath>\n          </text>)}\n      </svg>\n    </div>);\n};\nexport default CurvedLoop;",
    "props": [
      {
        "name": "marqueeText",
        "type": "string",
        "default": "''",
        "description": "Controls the marquee text for the component animation."
      },
      {
        "name": "speed",
        "type": "number",
        "default": "2",
        "description": "Speed multiplier for the motion playback."
      },
      {
        "name": "className",
        "type": "string",
        "default": "-",
        "description": "Additional CSS classes for styling and layout."
      },
      {
        "name": "curveAmount",
        "type": "number",
        "default": "400",
        "description": "Controls the curve amount for the component animation."
      },
      {
        "name": "direction",
        "type": "'left' | 'right'",
        "default": "'left'",
        "description": "Direction of movement (e.g., 'top', 'bottom', 'left', 'right')."
      },
      {
        "name": "interactive",
        "type": "boolean",
        "default": "true",
        "description": "Controls the interactive for the component animation."
      }
    ]
  },
  "decrypted-text": {
    "slug": "decrypted-text",
    "name": "Decrypted Text",
    "description": "Cyberpunk-inspired text decryption effect that scrambles through random glyphs before resolving into final characters.",
    "dependencies": {
      "motion": "^12.23.12"
    },
    "installation": {
      "cliTs": "npx kibo add decrypted-text",
      "cliJs": "npx kibo add decrypted-text --js",
      "npm": "npm i motion",
      "pnpm": "pnpm add motion",
      "yarn": "yarn add motion",
      "bun": "bun add motion"
    },
    "usageTs": "import { DecryptedText } from \"@/components/kibo/decrypted-text/component\";\n\nexport default function Example() {\n  return (\n    <DecryptedText />\n  );\n}",
    "usageJs": "import { DecryptedText } from \"@/components/kibo/decrypted-text/component\";\nexport default function Example() {\n    return (<DecryptedText />);\n}",
    "componentSourceTs": "\"use client\";\n\nimport { useEffect, useState, useRef, useMemo, useCallback } from 'react';\nimport { motion } from 'motion/react';\nimport type { HTMLMotionProps } from 'motion/react';\n\ninterface DecryptedTextProps extends HTMLMotionProps<'span'> {\n  text: string;\n  speed?: number;\n  maxIterations?: number;\n  sequential?: boolean;\n  revealDirection?: 'start' | 'end' | 'center';\n  useOriginalCharsOnly?: boolean;\n  characters?: string;\n  className?: string;\n  encryptedClassName?: string;\n  parentClassName?: string;\n  animateOn?: 'view' | 'hover' | 'inViewHover' | 'click';\n  clickMode?: 'once' | 'toggle';\n}\n\ntype Direction = 'forward' | 'reverse';\n\nexport function DecryptedText({\n  text,\n  speed = 50,\n  maxIterations = 10,\n  sequential = false,\n  revealDirection = 'start',\n  useOriginalCharsOnly = false,\n  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',\n  className = '',\n  parentClassName = '',\n  encryptedClassName = '',\n  animateOn = 'hover',\n  clickMode = 'once',\n  ...props\n}: DecryptedTextProps) {\n  const [displayText, setDisplayText] = useState<string>(text);\n  const [isAnimating, setIsAnimating] = useState<boolean>(false);\n  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());\n  const [hasAnimated, setHasAnimated] = useState<boolean>(false);\n  const [isDecrypted, setIsDecrypted] = useState<boolean>(animateOn !== 'click');\n  const [direction, setDirection] = useState<Direction>('forward');\n\n  const containerRef = useRef<HTMLSpanElement>(null);\n  const orderRef = useRef<number[]>([]);\n  const pointerRef = useRef<number>(0);\n  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);\n\n  const availableChars = useMemo<string[]>(() => {\n    return useOriginalCharsOnly\n      ? Array.from(new Set(text.split(''))).filter(char => char !== ' ')\n      : characters.split('');\n  }, [useOriginalCharsOnly, text, characters]);\n\n  const shuffleText = useCallback(\n    (originalText: string, currentRevealed: Set<number>) => {\n      return originalText\n        .split('')\n        .map((char, i) => {\n          if (char === ' ') return ' ';\n          if (currentRevealed.has(i)) return originalText[i];\n          return availableChars[Math.floor(Math.random() * availableChars.length)];\n        })\n        .join('');\n    },\n    [availableChars]\n  );\n\n  const computeOrder = useCallback(\n    (len: number): number[] => {\n      const order: number[] = [];\n      if (len <= 0) return order;\n      if (revealDirection === 'start') {\n        for (let i = 0; i < len; i++) order.push(i);\n        return order;\n      }\n      if (revealDirection === 'end') {\n        for (let i = len - 1; i >= 0; i--) order.push(i);\n        return order;\n      }\n      // center\n      const middle = Math.floor(len / 2);\n      let offset = 0;\n      while (order.length < len) {\n        if (offset % 2 === 0) {\n          const idx = middle + offset / 2;\n          if (idx >= 0 && idx < len) order.push(idx);\n        } else {\n          const idx = middle - Math.ceil(offset / 2);\n          if (idx >= 0 && idx < len) order.push(idx);\n        }\n        offset++;\n      }\n      return order.slice(0, len);\n    },\n    [revealDirection]\n  );\n\n  const fillAllIndices = useCallback((): Set<number> => {\n    const s = new Set<number>();\n    for (let i = 0; i < text.length; i++) s.add(i);\n    return s;\n  }, [text]);\n\n  const removeRandomIndices = useCallback((set: Set<number>, count: number): Set<number> => {\n    const arr = Array.from(set);\n    for (let i = 0; i < count && arr.length > 0; i++) {\n      const idx = Math.floor(Math.random() * arr.length);\n      arr.splice(idx, 1);\n    }\n    return new Set(arr);\n  }, []);\n\n  const encryptInstantly = useCallback(() => {\n    const emptySet = new Set<number>();\n    setRevealedIndices(emptySet);\n    setDisplayText(shuffleText(text, emptySet));\n    setIsDecrypted(false);\n  }, [text, shuffleText]);\n\n  const triggerDecrypt = useCallback(() => {\n    if (sequential) {\n      orderRef.current = computeOrder(text.length);\n      pointerRef.current = 0;\n      setRevealedIndices(new Set());\n    } else {\n      setRevealedIndices(new Set());\n    }\n    setDirection('forward');\n    setIsAnimating(true);\n  }, [sequential, computeOrder, text.length]);\n\n  const triggerReverse = useCallback(() => {\n    if (sequential) {\n      // compute forward order then reverse it: we'll remove indices in that order\n      orderRef.current = computeOrder(text.length).slice().reverse();\n      pointerRef.current = 0;\n      setRevealedIndices(fillAllIndices()); // start fully revealed\n      setDisplayText(shuffleText(text, fillAllIndices()));\n    } else {\n      // non-seq: start from fully revealed as well\n      setRevealedIndices(fillAllIndices());\n      setDisplayText(shuffleText(text, fillAllIndices()));\n    }\n    setDirection('reverse');\n    setIsAnimating(true);\n  }, [sequential, computeOrder, fillAllIndices, shuffleText, text]);\n\n  useEffect(() => {\n    if (!isAnimating) return;\n\n    let currentIteration = 0;\n\n    const getNextIndex = (revealedSet: Set<number>): number => {\n      const textLength = text.length;\n      switch (revealDirection) {\n        case 'start':\n          return revealedSet.size;\n        case 'end':\n          return textLength - 1 - revealedSet.size;\n        case 'center': {\n          const middle = Math.floor(textLength / 2);\n          const offset = Math.floor(revealedSet.size / 2);\n          const nextIndex = revealedSet.size % 2 === 0 ? middle + offset : middle - offset - 1;\n\n          if (nextIndex >= 0 && nextIndex < textLength && !revealedSet.has(nextIndex)) {\n            return nextIndex;\n          }\n          for (let i = 0; i < textLength; i++) {\n            if (!revealedSet.has(i)) return i;\n          }\n          return 0;\n        }\n        default:\n          return revealedSet.size;\n      }\n    };\n\n    intervalRef.current = setInterval(() => {\n      setRevealedIndices(prevRevealed => {\n        if (sequential) {\n          // Forward\n          if (direction === 'forward') {\n            if (prevRevealed.size < text.length) {\n              const nextIndex = getNextIndex(prevRevealed);\n              const newRevealed = new Set(prevRevealed);\n              newRevealed.add(nextIndex);\n              setDisplayText(shuffleText(text, newRevealed));\n              return newRevealed;\n            } else {\n              clearInterval(intervalRef.current ?? undefined);\n              setIsAnimating(false);\n              setIsDecrypted(true);\n              return prevRevealed;\n            }\n          }\n          // Reverse\n          if (direction === 'reverse') {\n            if (pointerRef.current < orderRef.current.length) {\n              const idxToRemove = orderRef.current[pointerRef.current++];\n              const newRevealed = new Set(prevRevealed);\n              newRevealed.delete(idxToRemove);\n              setDisplayText(shuffleText(text, newRevealed));\n              if (newRevealed.size === 0) {\n                clearInterval(intervalRef.current ?? undefined);\n                setIsAnimating(false);\n                setIsDecrypted(false);\n              }\n              return newRevealed;\n            } else {\n              clearInterval(intervalRef.current ?? undefined);\n              setIsAnimating(false);\n              setIsDecrypted(false);\n              return prevRevealed;\n            }\n          }\n        } else {\n          // Non-Sequential\n          if (direction === 'forward') {\n            setDisplayText(shuffleText(text, prevRevealed));\n            currentIteration++;\n            if (currentIteration >= maxIterations) {\n              clearInterval(intervalRef.current ?? undefined);\n              setIsAnimating(false);\n              setDisplayText(text);\n              setIsDecrypted(true);\n            }\n            return prevRevealed;\n          }\n\n          // Non-Sequential Reverse\n          if (direction === 'reverse') {\n            let currentSet = prevRevealed;\n            if (currentSet.size === 0) {\n              currentSet = fillAllIndices();\n            }\n            const removeCount = Math.max(1, Math.ceil(text.length / Math.max(1, maxIterations)));\n            const nextSet = removeRandomIndices(currentSet, removeCount);\n            setDisplayText(shuffleText(text, nextSet));\n            currentIteration++;\n            if (nextSet.size === 0 || currentIteration >= maxIterations) {\n              clearInterval(intervalRef.current ?? undefined);\n              setIsAnimating(false);\n              setIsDecrypted(false);\n              // ensure final scrambled state\n              setDisplayText(shuffleText(text, new Set()));\n              return new Set();\n            }\n            return nextSet;\n          }\n        }\n        return prevRevealed;\n      });\n    }, speed);\n    return () => clearInterval(intervalRef.current ?? undefined);\n  }, [\n    isAnimating,\n    text,\n    speed,\n    maxIterations,\n    sequential,\n    revealDirection,\n    shuffleText,\n    direction,\n    fillAllIndices,\n    removeRandomIndices,\n    characters,\n    useOriginalCharsOnly\n  ]);\n\n  /* Click Behaviour */\n  const handleClick = () => {\n    if (animateOn !== 'click') return;\n\n    if (clickMode === 'once') {\n      if (isDecrypted) return;\n      setDirection('forward');\n      triggerDecrypt();\n    }\n\n    if (clickMode === 'toggle') {\n      if (isDecrypted) {\n        triggerReverse();\n      } else {\n        setDirection('forward');\n        triggerDecrypt();\n      }\n    }\n  };\n\n  /* Hover Behaviour */\n  const triggerHoverDecrypt = useCallback(() => {\n    if (isAnimating) return;\n\n    setRevealedIndices(new Set());\n    setIsDecrypted(false);\n    setDisplayText(text);\n    setDirection('forward');\n    setIsAnimating(true);\n  }, [isAnimating, text]);\n\n  const resetToPlainText = useCallback(() => {\n    clearInterval(intervalRef.current ?? undefined);\n    setIsAnimating(false);\n    setRevealedIndices(new Set());\n    setDisplayText(text);\n    setIsDecrypted(true);\n    setDirection('forward');\n  }, [text]);\n\n  /* View Observer */\n  useEffect(() => {\n    if (animateOn !== 'view' && animateOn !== 'inViewHover') return;\n\n    const observerCallback = (entries: IntersectionObserverEntry[]) => {\n      entries.forEach(entry => {\n        if (entry.isIntersecting && !hasAnimated) {\n          triggerDecrypt();\n          setHasAnimated(true);\n        }\n      });\n    };\n\n    const observerOptions = {\n      root: null,\n      rootMargin: '0px',\n      threshold: 0.1\n    };\n\n    const observer = new IntersectionObserver(observerCallback, observerOptions);\n    const currentRef = containerRef.current;\n    if (currentRef) {\n      observer.observe(currentRef);\n    }\n\n    return () => {\n      if (currentRef) observer.unobserve(currentRef);\n    };\n  }, [animateOn, hasAnimated, triggerDecrypt]);\n\n  useEffect(() => {\n    if (animateOn === 'click') {\n      encryptInstantly();\n    } else {\n      setDisplayText(text);\n      setIsDecrypted(true);\n    }\n    setRevealedIndices(new Set());\n    setDirection('forward');\n  }, [animateOn, text, encryptInstantly]);\n\n  const animateProps =\n    animateOn === 'hover' || animateOn === 'inViewHover'\n      ? {\n          onMouseEnter: triggerHoverDecrypt,\n          onMouseLeave: resetToPlainText\n        }\n      : animateOn === 'click'\n        ? {\n            onClick: handleClick\n          }\n        : {};\n\n  return (\n    <motion.span\n      ref={containerRef}\n      className={`inline-block whitespace-pre-wrap ${parentClassName}`}\n      {...animateProps}\n      {...props}\n    >\n      <span className=\"sr-only\">{displayText}</span>\n\n      <span aria-hidden=\"true\">\n        {displayText.split('').map((char, index) => {\n          const isRevealedOrDone = revealedIndices.has(index) || (!isAnimating && isDecrypted);\n\n          return (\n            <span key={index} className={isRevealedOrDone ? className : encryptedClassName}>\n              {char}\n            </span>\n          );\n        })}\n      </span>\n    </motion.span>\n  );\n}\nexport default DecryptedText;\n",
    "componentSourceJs": "\"use client\";\nimport { useEffect, useState, useRef, useMemo, useCallback } from 'react';\nimport { motion } from 'motion/react';\nexport function DecryptedText({ text, speed = 50, maxIterations = 10, sequential = false, revealDirection = 'start', useOriginalCharsOnly = false, characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+', className = '', parentClassName = '', encryptedClassName = '', animateOn = 'hover', clickMode = 'once', ...props }) {\n    const [displayText, setDisplayText] = useState(text);\n    const [isAnimating, setIsAnimating] = useState(false);\n    const [revealedIndices, setRevealedIndices] = useState(new Set());\n    const [hasAnimated, setHasAnimated] = useState(false);\n    const [isDecrypted, setIsDecrypted] = useState(animateOn !== 'click');\n    const [direction, setDirection] = useState('forward');\n    const containerRef = useRef(null);\n    const orderRef = useRef([]);\n    const pointerRef = useRef(0);\n    const intervalRef = useRef(null);\n    const availableChars = useMemo(() => {\n        return useOriginalCharsOnly\n            ? Array.from(new Set(text.split(''))).filter(char => char !== ' ')\n            : characters.split('');\n    }, [useOriginalCharsOnly, text, characters]);\n    const shuffleText = useCallback((originalText, currentRevealed) => {\n        return originalText\n            .split('')\n            .map((char, i) => {\n            if (char === ' ')\n                return ' ';\n            if (currentRevealed.has(i))\n                return originalText[i];\n            return availableChars[Math.floor(Math.random() * availableChars.length)];\n        })\n            .join('');\n    }, [availableChars]);\n    const computeOrder = useCallback((len) => {\n        const order = [];\n        if (len <= 0)\n            return order;\n        if (revealDirection === 'start') {\n            for (let i = 0; i < len; i++)\n                order.push(i);\n            return order;\n        }\n        if (revealDirection === 'end') {\n            for (let i = len - 1; i >= 0; i--)\n                order.push(i);\n            return order;\n        }\n        // center\n        const middle = Math.floor(len / 2);\n        let offset = 0;\n        while (order.length < len) {\n            if (offset % 2 === 0) {\n                const idx = middle + offset / 2;\n                if (idx >= 0 && idx < len)\n                    order.push(idx);\n            }\n            else {\n                const idx = middle - Math.ceil(offset / 2);\n                if (idx >= 0 && idx < len)\n                    order.push(idx);\n            }\n            offset++;\n        }\n        return order.slice(0, len);\n    }, [revealDirection]);\n    const fillAllIndices = useCallback(() => {\n        const s = new Set();\n        for (let i = 0; i < text.length; i++)\n            s.add(i);\n        return s;\n    }, [text]);\n    const removeRandomIndices = useCallback((set, count) => {\n        const arr = Array.from(set);\n        for (let i = 0; i < count && arr.length > 0; i++) {\n            const idx = Math.floor(Math.random() * arr.length);\n            arr.splice(idx, 1);\n        }\n        return new Set(arr);\n    }, []);\n    const encryptInstantly = useCallback(() => {\n        const emptySet = new Set();\n        setRevealedIndices(emptySet);\n        setDisplayText(shuffleText(text, emptySet));\n        setIsDecrypted(false);\n    }, [text, shuffleText]);\n    const triggerDecrypt = useCallback(() => {\n        if (sequential) {\n            orderRef.current = computeOrder(text.length);\n            pointerRef.current = 0;\n            setRevealedIndices(new Set());\n        }\n        else {\n            setRevealedIndices(new Set());\n        }\n        setDirection('forward');\n        setIsAnimating(true);\n    }, [sequential, computeOrder, text.length]);\n    const triggerReverse = useCallback(() => {\n        if (sequential) {\n            // compute forward order then reverse it: we'll remove indices in that order\n            orderRef.current = computeOrder(text.length).slice().reverse();\n            pointerRef.current = 0;\n            setRevealedIndices(fillAllIndices()); // start fully revealed\n            setDisplayText(shuffleText(text, fillAllIndices()));\n        }\n        else {\n            // non-seq: start from fully revealed as well\n            setRevealedIndices(fillAllIndices());\n            setDisplayText(shuffleText(text, fillAllIndices()));\n        }\n        setDirection('reverse');\n        setIsAnimating(true);\n    }, [sequential, computeOrder, fillAllIndices, shuffleText, text]);\n    useEffect(() => {\n        if (!isAnimating)\n            return;\n        let currentIteration = 0;\n        const getNextIndex = (revealedSet) => {\n            const textLength = text.length;\n            switch (revealDirection) {\n                case 'start':\n                    return revealedSet.size;\n                case 'end':\n                    return textLength - 1 - revealedSet.size;\n                case 'center': {\n                    const middle = Math.floor(textLength / 2);\n                    const offset = Math.floor(revealedSet.size / 2);\n                    const nextIndex = revealedSet.size % 2 === 0 ? middle + offset : middle - offset - 1;\n                    if (nextIndex >= 0 && nextIndex < textLength && !revealedSet.has(nextIndex)) {\n                        return nextIndex;\n                    }\n                    for (let i = 0; i < textLength; i++) {\n                        if (!revealedSet.has(i))\n                            return i;\n                    }\n                    return 0;\n                }\n                default:\n                    return revealedSet.size;\n            }\n        };\n        intervalRef.current = setInterval(() => {\n            setRevealedIndices(prevRevealed => {\n                if (sequential) {\n                    // Forward\n                    if (direction === 'forward') {\n                        if (prevRevealed.size < text.length) {\n                            const nextIndex = getNextIndex(prevRevealed);\n                            const newRevealed = new Set(prevRevealed);\n                            newRevealed.add(nextIndex);\n                            setDisplayText(shuffleText(text, newRevealed));\n                            return newRevealed;\n                        }\n                        else {\n                            clearInterval(intervalRef.current ?? undefined);\n                            setIsAnimating(false);\n                            setIsDecrypted(true);\n                            return prevRevealed;\n                        }\n                    }\n                    // Reverse\n                    if (direction === 'reverse') {\n                        if (pointerRef.current < orderRef.current.length) {\n                            const idxToRemove = orderRef.current[pointerRef.current++];\n                            const newRevealed = new Set(prevRevealed);\n                            newRevealed.delete(idxToRemove);\n                            setDisplayText(shuffleText(text, newRevealed));\n                            if (newRevealed.size === 0) {\n                                clearInterval(intervalRef.current ?? undefined);\n                                setIsAnimating(false);\n                                setIsDecrypted(false);\n                            }\n                            return newRevealed;\n                        }\n                        else {\n                            clearInterval(intervalRef.current ?? undefined);\n                            setIsAnimating(false);\n                            setIsDecrypted(false);\n                            return prevRevealed;\n                        }\n                    }\n                }\n                else {\n                    // Non-Sequential\n                    if (direction === 'forward') {\n                        setDisplayText(shuffleText(text, prevRevealed));\n                        currentIteration++;\n                        if (currentIteration >= maxIterations) {\n                            clearInterval(intervalRef.current ?? undefined);\n                            setIsAnimating(false);\n                            setDisplayText(text);\n                            setIsDecrypted(true);\n                        }\n                        return prevRevealed;\n                    }\n                    // Non-Sequential Reverse\n                    if (direction === 'reverse') {\n                        let currentSet = prevRevealed;\n                        if (currentSet.size === 0) {\n                            currentSet = fillAllIndices();\n                        }\n                        const removeCount = Math.max(1, Math.ceil(text.length / Math.max(1, maxIterations)));\n                        const nextSet = removeRandomIndices(currentSet, removeCount);\n                        setDisplayText(shuffleText(text, nextSet));\n                        currentIteration++;\n                        if (nextSet.size === 0 || currentIteration >= maxIterations) {\n                            clearInterval(intervalRef.current ?? undefined);\n                            setIsAnimating(false);\n                            setIsDecrypted(false);\n                            // ensure final scrambled state\n                            setDisplayText(shuffleText(text, new Set()));\n                            return new Set();\n                        }\n                        return nextSet;\n                    }\n                }\n                return prevRevealed;\n            });\n        }, speed);\n        return () => clearInterval(intervalRef.current ?? undefined);\n    }, [\n        isAnimating,\n        text,\n        speed,\n        maxIterations,\n        sequential,\n        revealDirection,\n        shuffleText,\n        direction,\n        fillAllIndices,\n        removeRandomIndices,\n        characters,\n        useOriginalCharsOnly\n    ]);\n    /* Click Behaviour */\n    const handleClick = () => {\n        if (animateOn !== 'click')\n            return;\n        if (clickMode === 'once') {\n            if (isDecrypted)\n                return;\n            setDirection('forward');\n            triggerDecrypt();\n        }\n        if (clickMode === 'toggle') {\n            if (isDecrypted) {\n                triggerReverse();\n            }\n            else {\n                setDirection('forward');\n                triggerDecrypt();\n            }\n        }\n    };\n    /* Hover Behaviour */\n    const triggerHoverDecrypt = useCallback(() => {\n        if (isAnimating)\n            return;\n        setRevealedIndices(new Set());\n        setIsDecrypted(false);\n        setDisplayText(text);\n        setDirection('forward');\n        setIsAnimating(true);\n    }, [isAnimating, text]);\n    const resetToPlainText = useCallback(() => {\n        clearInterval(intervalRef.current ?? undefined);\n        setIsAnimating(false);\n        setRevealedIndices(new Set());\n        setDisplayText(text);\n        setIsDecrypted(true);\n        setDirection('forward');\n    }, [text]);\n    /* View Observer */\n    useEffect(() => {\n        if (animateOn !== 'view' && animateOn !== 'inViewHover')\n            return;\n        const observerCallback = (entries) => {\n            entries.forEach(entry => {\n                if (entry.isIntersecting && !hasAnimated) {\n                    triggerDecrypt();\n                    setHasAnimated(true);\n                }\n            });\n        };\n        const observerOptions = {\n            root: null,\n            rootMargin: '0px',\n            threshold: 0.1\n        };\n        const observer = new IntersectionObserver(observerCallback, observerOptions);\n        const currentRef = containerRef.current;\n        if (currentRef) {\n            observer.observe(currentRef);\n        }\n        return () => {\n            if (currentRef)\n                observer.unobserve(currentRef);\n        };\n    }, [animateOn, hasAnimated, triggerDecrypt]);\n    useEffect(() => {\n        if (animateOn === 'click') {\n            encryptInstantly();\n        }\n        else {\n            setDisplayText(text);\n            setIsDecrypted(true);\n        }\n        setRevealedIndices(new Set());\n        setDirection('forward');\n    }, [animateOn, text, encryptInstantly]);\n    const animateProps = animateOn === 'hover' || animateOn === 'inViewHover'\n        ? {\n            onMouseEnter: triggerHoverDecrypt,\n            onMouseLeave: resetToPlainText\n        }\n        : animateOn === 'click'\n            ? {\n                onClick: handleClick\n            }\n            : {};\n    return (<motion.span ref={containerRef} className={`inline-block whitespace-pre-wrap ${parentClassName}`} {...animateProps} {...props}>\n      <span className=\"sr-only\">{displayText}</span>\n\n      <span aria-hidden=\"true\">\n        {displayText.split('').map((char, index) => {\n            const isRevealedOrDone = revealedIndices.has(index) || (!isAnimating && isDecrypted);\n            return (<span key={index} className={isRevealedOrDone ? className : encryptedClassName}>\n              {char}\n            </span>);\n        })}\n      </span>\n    </motion.span>);\n}\nexport default DecryptedText;",
    "props": [
      {
        "name": "text",
        "type": "string",
        "default": "-",
        "description": "The text content to display and animate."
      },
      {
        "name": "speed",
        "type": "number",
        "default": "50",
        "description": "Speed multiplier for the motion playback."
      },
      {
        "name": "maxIterations",
        "type": "number",
        "default": "10",
        "description": "Controls the max iterations for the component animation."
      },
      {
        "name": "sequential",
        "type": "boolean",
        "default": "false",
        "description": "Controls the sequential for the component animation."
      },
      {
        "name": "revealDirection",
        "type": "'start' | 'end' | 'center'",
        "default": "'start'",
        "description": "Controls the reveal direction for the component animation."
      },
      {
        "name": "useOriginalCharsOnly",
        "type": "boolean",
        "default": "false",
        "description": "Controls the use original chars only for the component animation."
      },
      {
        "name": "characters",
        "type": "string",
        "default": "'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+'",
        "description": "Controls the characters for the component animation."
      },
      {
        "name": "className",
        "type": "string",
        "default": "''",
        "description": "Additional CSS classes for styling and layout."
      },
      {
        "name": "encryptedClassName",
        "type": "string",
        "default": "''",
        "description": "Controls the encrypted class name for the component animation."
      },
      {
        "name": "parentClassName",
        "type": "string",
        "default": "''",
        "description": "Controls the parent class name for the component animation."
      },
      {
        "name": "animateOn",
        "type": "'view' | 'hover' | 'inViewHover' | 'click'",
        "default": "'hover'",
        "description": "Controls the animate on for the component animation."
      },
      {
        "name": "clickMode",
        "type": "'once' | 'toggle'",
        "default": "'once'",
        "description": "Controls the click mode for the component animation."
      }
    ]
  },
  "depth-text": {
    "slug": "depth-text",
    "name": "Depth Text",
    "description": "Creates multi-layered 3D extruded typography that dynamically angles and shifts depth relative to cursor position.",
    "dependencies": {},
    "installation": {
      "cliTs": "npx kibo add depth-text",
      "cliJs": "npx kibo add depth-text --js",
      "npm": "npx kibo add depth-text",
      "pnpm": "pnpm dlx kibo add depth-text",
      "yarn": "yarn add depth-text",
      "bun": "bunx kibo add depth-text"
    },
    "usageTs": "import { DepthText } from \"@/components/kibo/depth-text/component\";\n\nexport default function Example() {\n  return (\n    <DepthText />\n  );\n}",
    "usageJs": "import { DepthText } from \"@/components/kibo/depth-text/component\";\nexport default function Example() {\n    return (<DepthText />);\n}",
    "componentSourceTs": "\"use client\";\n\nimport { useEffect, useMemo, useRef, type CSSProperties } from 'react';\n\nexport interface DepthTextProps {\n  text?: string;\n  layers?: number;\n  depth?: number;\n  faceColor?: string;\n  depthColor?: string;\n  tilt?: number;\n  pointerTracking?: boolean;\n  smoothing?: number;\n  perspective?: number;\n  autoOrbit?: boolean;\n  orbitSpeed?: number;\n  fontSize?: string;\n  fontWeight?: number | string;\n  shadow?: boolean;\n  className?: string;\n  style?: CSSProperties;\n}\n\ninterface DepthLayer {\n  index: number;\n  color: string;\n  transform: string;\n}\n\nconst MAX_LAYERS = 64;\n\nconst clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);\n\nconst getLayerColor = (faceColor: string, depthColor: string, index: number, total: number): string => {\n  const progress = total <= 1 ? 1 : index / total;\n  const eased = progress * progress;\n  const faceMix = Math.round((1 - eased) * 72 + 4);\n  return `color-mix(in srgb, ${faceColor} ${faceMix}%, ${depthColor})`;\n};\n\nconst getTransform = (rotateX: number, rotateY: number): string =>\n  `rotateX(${rotateX.toFixed(3)}deg) rotateY(${rotateY.toFixed(3)}deg)`;\n\nexport const DepthText = ({\n  text = 'Elevate',\n  layers = 34,\n  depth = 2.4,\n  faceColor = '#f8fafc',\n  depthColor = '#7c3aed',\n  tilt = 7.5,\n  pointerTracking = true,\n  smoothing = 0.14,\n  perspective = 900,\n  autoOrbit = true,\n  orbitSpeed = 0.35,\n  fontSize = 'clamp(3rem, 12vw, 7rem)',\n  fontWeight = 900,\n  shadow = true,\n  className = '',\n  style = {}\n}: DepthTextProps) => {\n  const rootRef = useRef<HTMLSpanElement | null>(null);\n  const stageRef = useRef<HTMLSpanElement | null>(null);\n\n  const safeLayers = clamp(Math.round(Number(layers) || 1), 2, MAX_LAYERS);\n  const safeDepth = clamp(Number(depth) || 0, 0, 12);\n  const safeTilt = clamp(Number(tilt) || 0, 0, 12);\n  const safeSmoothing = clamp(Number(smoothing) || 0.14, 0.02, 0.35);\n  const safePerspective = clamp(Number(perspective) || 900, 300, 2000);\n  const safeOrbitSpeed = clamp(Number(orbitSpeed) || 0, 0, 2);\n\n  const baseRotation = useMemo(() => ({ x: -safeTilt * 0.32, y: safeTilt * 0.42 }), [safeTilt]);\n\n  const depthLayers = useMemo<DepthLayer[]>(\n    () =>\n      Array.from({ length: safeLayers }, (_, layerIndex) => {\n        const index = safeLayers - layerIndex;\n        return {\n          index,\n          color: getLayerColor(faceColor, depthColor, index, safeLayers),\n          transform: `translateZ(${-index * safeDepth}px)`\n        };\n      }),\n    [safeLayers, safeDepth, faceColor, depthColor]\n  );\n\n  useEffect(() => {\n    const root = rootRef.current;\n    const stage = stageRef.current;\n    if (!root || !stage || typeof window === 'undefined') return undefined;\n\n    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;\n    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;\n    const canTrackPointer = pointerTracking && finePointer && !reducedMotion;\n\n    let frameId = 0;\n    let activePointer = false;\n    let startTime = performance.now();\n    const current = { ...baseRotation };\n    const target = { ...baseRotation };\n\n    const applyTransform = () => {\n      stage.style.transform = getTransform(current.x, current.y);\n    };\n\n    if (reducedMotion) {\n      stage.style.transform = getTransform(baseRotation.x, baseRotation.y);\n      return undefined;\n    }\n\n    const handlePointerMove = (event: PointerEvent) => {\n      const rect = root.getBoundingClientRect();\n      if (!rect.width || !rect.height) return;\n\n      activePointer = true;\n      const x = clamp((event.clientX - (rect.left + rect.width / 2)) / (rect.width * 0.8), -1, 1);\n      const y = clamp((event.clientY - (rect.top + rect.height / 2)) / (rect.height * 0.8), -1, 1);\n\n      target.x = baseRotation.x - y * safeTilt;\n      target.y = baseRotation.y + x * safeTilt;\n    };\n\n    const handlePointerLeave = () => {\n      activePointer = false;\n      target.x = baseRotation.x;\n      target.y = baseRotation.y;\n    };\n\n    if (canTrackPointer) {\n      window.addEventListener('pointermove', handlePointerMove);\n      window.addEventListener('pointerleave', handlePointerLeave);\n      window.addEventListener('blur', handlePointerLeave);\n    }\n\n    const tick = (now: number) => {\n      if ((!canTrackPointer || !activePointer) && autoOrbit) {\n        const elapsed = (now - startTime) / 1000;\n        const orbit = elapsed * safeOrbitSpeed * Math.PI * 2;\n        const fallbackAmount = canTrackPointer ? 0.18 : 0.55;\n        target.x = baseRotation.x + Math.sin(orbit) * safeTilt * fallbackAmount;\n        target.y = baseRotation.y + Math.cos(orbit * 0.85) * safeTilt * fallbackAmount;\n      }\n\n      current.x += (target.x - current.x) * safeSmoothing;\n      current.y += (target.y - current.y) * safeSmoothing;\n      applyTransform();\n      frameId = requestAnimationFrame(tick);\n    };\n\n    applyTransform();\n    frameId = requestAnimationFrame(tick);\n\n    return () => {\n      if (canTrackPointer) {\n        window.removeEventListener('pointermove', handlePointerMove);\n        window.removeEventListener('pointerleave', handlePointerLeave);\n        window.removeEventListener('blur', handlePointerLeave);\n      }\n      cancelAnimationFrame(frameId);\n      startTime = 0;\n    };\n  }, [autoOrbit, baseRotation, pointerTracking, safeOrbitSpeed, safeSmoothing, safeTilt]);\n\n  const rootStyle: CSSProperties = {\n    ...style,\n    perspective: `${safePerspective}px`,\n    perspectiveOrigin: '50% 48%',\n    contain: 'layout paint',\n    isolation: 'isolate'\n  };\n\n  const stageStyle: CSSProperties = {\n    transformStyle: 'preserve-3d',\n    transform: getTransform(baseRotation.x, baseRotation.y),\n    transformOrigin: '50% 50%',\n    willChange: 'transform'\n  };\n\n  const textStyle: CSSProperties = {\n    fontSize,\n    fontWeight,\n    lineHeight: 0.86,\n    letterSpacing: '-0.065em',\n    whiteSpace: 'nowrap',\n    userSelect: 'none',\n    transformStyle: 'preserve-3d',\n    backfaceVisibility: 'hidden',\n    fontKerning: 'normal',\n    textRendering: 'geometricPrecision'\n  };\n\n  return (\n    <span ref={rootRef} className={`inline-block ${className}`.trim()} style={rootStyle}>\n      <span ref={stageRef} className=\"relative inline-grid place-items-center\" style={stageStyle}>\n        {depthLayers.map(layer => (\n          <span\n            aria-hidden=\"true\"\n            className=\"pointer-events-none absolute inset-0 z-0 inline-block brightness-95 saturate-95\"\n            key={layer.index}\n            style={{ ...textStyle, color: layer.color, transform: layer.transform }}\n          >\n            {text}\n          </span>\n        ))}\n        <span\n          className=\"relative z-10 inline-block\"\n          style={{\n            ...textStyle,\n            color: faceColor,\n            textShadow: shadow\n              ? `0 22px 34px color-mix(in srgb, ${depthColor} 36%, transparent), 0 4px 8px rgba(0, 0, 0, 0.28)`\n              : 'none',\n            transform: 'translateZ(0.6px)'\n          }}\n        >\n          {text}\n        </span>\n      </span>\n    </span>\n  );\n};\n\nexport default DepthText;",
    "componentSourceJs": "\"use client\";\nimport { useEffect, useMemo, useRef } from 'react';\nconst MAX_LAYERS = 64;\nconst clamp = (value, min, max) => Math.min(Math.max(value, min), max);\nconst getLayerColor = (faceColor, depthColor, index, total) => {\n    const progress = total <= 1 ? 1 : index / total;\n    const eased = progress * progress;\n    const faceMix = Math.round((1 - eased) * 72 + 4);\n    return `color-mix(in srgb, ${faceColor} ${faceMix}%, ${depthColor})`;\n};\nconst getTransform = (rotateX, rotateY) => `rotateX(${rotateX.toFixed(3)}deg) rotateY(${rotateY.toFixed(3)}deg)`;\nexport const DepthText = ({ text = 'Elevate', layers = 34, depth = 2.4, faceColor = '#f8fafc', depthColor = '#7c3aed', tilt = 7.5, pointerTracking = true, smoothing = 0.14, perspective = 900, autoOrbit = true, orbitSpeed = 0.35, fontSize = 'clamp(3rem, 12vw, 7rem)', fontWeight = 900, shadow = true, className = '', style = {} }) => {\n    const rootRef = useRef(null);\n    const stageRef = useRef(null);\n    const safeLayers = clamp(Math.round(Number(layers) || 1), 2, MAX_LAYERS);\n    const safeDepth = clamp(Number(depth) || 0, 0, 12);\n    const safeTilt = clamp(Number(tilt) || 0, 0, 12);\n    const safeSmoothing = clamp(Number(smoothing) || 0.14, 0.02, 0.35);\n    const safePerspective = clamp(Number(perspective) || 900, 300, 2000);\n    const safeOrbitSpeed = clamp(Number(orbitSpeed) || 0, 0, 2);\n    const baseRotation = useMemo(() => ({ x: -safeTilt * 0.32, y: safeTilt * 0.42 }), [safeTilt]);\n    const depthLayers = useMemo(() => Array.from({ length: safeLayers }, (_, layerIndex) => {\n        const index = safeLayers - layerIndex;\n        return {\n            index,\n            color: getLayerColor(faceColor, depthColor, index, safeLayers),\n            transform: `translateZ(${-index * safeDepth}px)`\n        };\n    }), [safeLayers, safeDepth, faceColor, depthColor]);\n    useEffect(() => {\n        const root = rootRef.current;\n        const stage = stageRef.current;\n        if (!root || !stage || typeof window === 'undefined')\n            return undefined;\n        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;\n        const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;\n        const canTrackPointer = pointerTracking && finePointer && !reducedMotion;\n        let frameId = 0;\n        let activePointer = false;\n        let startTime = performance.now();\n        const current = { ...baseRotation };\n        const target = { ...baseRotation };\n        const applyTransform = () => {\n            stage.style.transform = getTransform(current.x, current.y);\n        };\n        if (reducedMotion) {\n            stage.style.transform = getTransform(baseRotation.x, baseRotation.y);\n            return undefined;\n        }\n        const handlePointerMove = (event) => {\n            const rect = root.getBoundingClientRect();\n            if (!rect.width || !rect.height)\n                return;\n            activePointer = true;\n            const x = clamp((event.clientX - (rect.left + rect.width / 2)) / (rect.width * 0.8), -1, 1);\n            const y = clamp((event.clientY - (rect.top + rect.height / 2)) / (rect.height * 0.8), -1, 1);\n            target.x = baseRotation.x - y * safeTilt;\n            target.y = baseRotation.y + x * safeTilt;\n        };\n        const handlePointerLeave = () => {\n            activePointer = false;\n            target.x = baseRotation.x;\n            target.y = baseRotation.y;\n        };\n        if (canTrackPointer) {\n            window.addEventListener('pointermove', handlePointerMove);\n            window.addEventListener('pointerleave', handlePointerLeave);\n            window.addEventListener('blur', handlePointerLeave);\n        }\n        const tick = (now) => {\n            if ((!canTrackPointer || !activePointer) && autoOrbit) {\n                const elapsed = (now - startTime) / 1000;\n                const orbit = elapsed * safeOrbitSpeed * Math.PI * 2;\n                const fallbackAmount = canTrackPointer ? 0.18 : 0.55;\n                target.x = baseRotation.x + Math.sin(orbit) * safeTilt * fallbackAmount;\n                target.y = baseRotation.y + Math.cos(orbit * 0.85) * safeTilt * fallbackAmount;\n            }\n            current.x += (target.x - current.x) * safeSmoothing;\n            current.y += (target.y - current.y) * safeSmoothing;\n            applyTransform();\n            frameId = requestAnimationFrame(tick);\n        };\n        applyTransform();\n        frameId = requestAnimationFrame(tick);\n        return () => {\n            if (canTrackPointer) {\n                window.removeEventListener('pointermove', handlePointerMove);\n                window.removeEventListener('pointerleave', handlePointerLeave);\n                window.removeEventListener('blur', handlePointerLeave);\n            }\n            cancelAnimationFrame(frameId);\n            startTime = 0;\n        };\n    }, [autoOrbit, baseRotation, pointerTracking, safeOrbitSpeed, safeSmoothing, safeTilt]);\n    const rootStyle = {\n        ...style,\n        perspective: `${safePerspective}px`,\n        perspectiveOrigin: '50% 48%',\n        contain: 'layout paint',\n        isolation: 'isolate'\n    };\n    const stageStyle = {\n        transformStyle: 'preserve-3d',\n        transform: getTransform(baseRotation.x, baseRotation.y),\n        transformOrigin: '50% 50%',\n        willChange: 'transform'\n    };\n    const textStyle = {\n        fontSize,\n        fontWeight,\n        lineHeight: 0.86,\n        letterSpacing: '-0.065em',\n        whiteSpace: 'nowrap',\n        userSelect: 'none',\n        transformStyle: 'preserve-3d',\n        backfaceVisibility: 'hidden',\n        fontKerning: 'normal',\n        textRendering: 'geometricPrecision'\n    };\n    return (<span ref={rootRef} className={`inline-block ${className}`.trim()} style={rootStyle}>\n      <span ref={stageRef} className=\"relative inline-grid place-items-center\" style={stageStyle}>\n        {depthLayers.map(layer => (<span aria-hidden=\"true\" className=\"pointer-events-none absolute inset-0 z-0 inline-block brightness-95 saturate-95\" key={layer.index} style={{ ...textStyle, color: layer.color, transform: layer.transform }}>\n            {text}\n          </span>))}\n        <span className=\"relative z-10 inline-block\" style={{\n            ...textStyle,\n            color: faceColor,\n            textShadow: shadow\n                ? `0 22px 34px color-mix(in srgb, ${depthColor} 36%, transparent), 0 4px 8px rgba(0, 0, 0, 0.28)`\n                : 'none',\n            transform: 'translateZ(0.6px)'\n        }}>\n          {text}\n        </span>\n      </span>\n    </span>);\n};\nexport default DepthText;",
    "props": [
      {
        "name": "text",
        "type": "string",
        "default": "'Elevate'",
        "description": "The text content to display and animate."
      },
      {
        "name": "layers",
        "type": "number",
        "default": "34",
        "description": "Controls the layers for the component animation."
      },
      {
        "name": "depth",
        "type": "number",
        "default": "2.4",
        "description": "Controls the depth for the component animation."
      },
      {
        "name": "faceColor",
        "type": "string",
        "default": "'#f8fafc'",
        "description": "Controls the face color for the component animation."
      },
      {
        "name": "depthColor",
        "type": "string",
        "default": "'#7c3aed'",
        "description": "Controls the depth color for the component animation."
      },
      {
        "name": "tilt",
        "type": "number",
        "default": "7.5",
        "description": "Controls the tilt for the component animation."
      },
      {
        "name": "pointerTracking",
        "type": "boolean",
        "default": "true",
        "description": "Controls the pointer tracking for the component animation."
      },
      {
        "name": "smoothing",
        "type": "number",
        "default": "0.14",
        "description": "Controls the smoothing for the component animation."
      },
      {
        "name": "perspective",
        "type": "number",
        "default": "900",
        "description": "Controls the perspective for the component animation."
      },
      {
        "name": "autoOrbit",
        "type": "boolean",
        "default": "true",
        "description": "Controls the auto orbit for the component animation."
      },
      {
        "name": "orbitSpeed",
        "type": "number",
        "default": "0.35",
        "description": "Controls the orbit speed for the component animation."
      },
      {
        "name": "fontSize",
        "type": "string",
        "default": "'clamp(3rem, 12vw, 7rem)'",
        "description": "Font size in pixels, rems, or fluid clamp notation."
      },
      {
        "name": "fontWeight",
        "type": "number | string",
        "default": "900",
        "description": "Font weight (e.g., 400, 700, 900, 'bold')."
      },
      {
        "name": "shadow",
        "type": "boolean",
        "default": "true",
        "description": "Controls the shadow for the component animation."
      },
      {
        "name": "className",
        "type": "string",
        "default": "''",
        "description": "Additional CSS classes for styling and layout."
      },
      {
        "name": "style",
        "type": "CSSProperties",
        "default": "{}",
        "description": "Controls the style for the component animation."
      }
    ]
  },
  "echo-text": {
    "slug": "echo-text",
    "name": "Echo Text",
    "description": "Generates cascading reverberation text layers with customizable depth, color ramps, and trailing kinetic motion.",
    "dependencies": {},
    "installation": {
      "cliTs": "npx kibo add echo-text",
      "cliJs": "npx kibo add echo-text --js",
      "npm": "npx kibo add echo-text",
      "pnpm": "pnpm dlx kibo add echo-text",
      "yarn": "yarn add echo-text",
      "bun": "bunx kibo add echo-text"
    },
    "usageTs": "import { EchoText } from \"@/components/kibo/echo-text/component\";\n\nexport default function Example() {\n  return (\n    <EchoText />\n  );\n}",
    "usageJs": "import { EchoText } from \"@/components/kibo/echo-text/component\";\nexport default function Example() {\n    return (<EchoText />);\n}",
    "componentSourceTs": "\"use client\";\n\nimport React, { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';\n\ntype Direction = 'right' | 'left' | 'up' | 'down' | 'diagonal';\ntype Mode = 'entrance' | 'pointer' | 'both';\ntype Ease = 'linear' | 'ease-out' | 'ease-in-out' | 'snappy';\n\ntype Vector = { x: number; y: number };\ntype Position = { x: number; y: number };\n\ntype AnimationState = {\n  targetX: number;\n  targetY: number;\n  lastTargetX: number;\n  lastTargetY: number;\n  activity: number;\n  positions: Position[];\n  startTime: number;\n};\n\nexport interface EchoTextProps {\n  text?: string;\n  echoes?: number;\n  lag?: number;\n  offset?: number;\n  direction?: Direction;\n  fade?: number;\n  blur?: number;\n  tint?: string | false;\n  mode?: Mode;\n  cursorRadius?: number;\n  duration?: number;\n  ease?: Ease;\n  fontSize?: string | number;\n  fontWeight?: string | number;\n  color?: string;\n  className?: string;\n  style?: CSSProperties;\n}\n\nconst clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);\n\nconst directionVectors: Record<Direction, Vector> = {\n  right: { x: 1, y: 0 },\n  left: { x: -1, y: 0 },\n  up: { x: 0, y: -1 },\n  down: { x: 0, y: 1 },\n  diagonal: { x: 0.72, y: 0.72 }\n};\n\nconst easing: Record<Ease, (t: number) => number> = {\n  linear: t => t,\n  'ease-out': t => 1 - Math.pow(1 - t, 3),\n  'ease-in-out': t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),\n  snappy: t => 1 - Math.pow(1 - t, 5)\n};\n\nexport const EchoText: React.FC<EchoTextProps> = ({\n  text = 'Motion Echo',\n  echoes = 12,\n  lag = 0.24,\n  offset = 36,\n  direction = 'right',\n  fade = 0.72,\n  blur = 3,\n  tint = '#7dd3fc',\n  mode = 'both',\n  cursorRadius = 320,\n  duration = 900,\n  ease = 'ease-out',\n  fontSize = 'clamp(3rem, 9vw, 7rem)',\n  fontWeight = 800,\n  color = '#f8fafc',\n  className = '',\n  style\n}) => {\n  const rootRef = useRef<HTMLSpanElement | null>(null);\n  const copyRefs = useRef<Array<HTMLSpanElement | null>>([]);\n  const frameRef = useRef<number | null>(null);\n  const stateRef = useRef<AnimationState | null>(null);\n  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);\n\n  const echoCount = prefersReducedMotion ? 0 : clamp(Math.round(echoes), 0, 24);\n  const copyIndexes = useMemo(() => Array.from({ length: echoCount + 1 }, (_, index) => index), [echoCount]);\n\n  useEffect(() => {\n    if (typeof window === 'undefined' || !window.matchMedia) return;\n\n    const media = window.matchMedia('(prefers-reduced-motion: reduce)');\n    const updateMotionPreference = () => setPrefersReducedMotion(media.matches);\n    updateMotionPreference();\n\n    media.addEventListener?.('change', updateMotionPreference);\n    return () => media.removeEventListener?.('change', updateMotionPreference);\n  }, []);\n\n  useEffect(() => {\n    const root = rootRef.current;\n    if (!root || prefersReducedMotion) return;\n\n    const vector = directionVectors[direction] || directionVectors.right;\n    const safeOffset = clamp(Number(offset) || 0, 0, 120);\n    const safeCursorRadius = clamp(Number(cursorRadius) || 320, 40, 1200);\n    const safeLag = clamp(Number(lag) || 0.16, 0.02, 0.5);\n    const safeFade = clamp(Number(fade) || 0.64, 0.1, 0.95);\n    const safeBlur = clamp(Number(blur) || 0, 0, 16);\n    const safeDuration = Math.max(0, Number(duration) || 0);\n    const easeFn = easing[ease] || easing['ease-out'];\n    const entranceEnabled = mode === 'entrance' || mode === 'both';\n    const pointerEnabled = mode === 'pointer' || mode === 'both';\n    const positions = Array.from({ length: echoCount + 1 }, (_, index) => {\n      const entranceAmount = entranceEnabled ? safeOffset * (index + 0.35) : 0;\n      return { x: vector.x * entranceAmount, y: vector.y * entranceAmount };\n    });\n\n    stateRef.current = {\n      targetX: 0,\n      targetY: 0,\n      lastTargetX: 0,\n      lastTargetY: 0,\n      activity: entranceEnabled ? 1 : 0,\n      positions,\n      startTime: performance.now()\n    };\n\n    let canHover = false;\n    let cleanupPointer = () => {};\n\n    if (pointerEnabled && window.matchMedia) {\n      const hoverMedia = window.matchMedia('(hover: hover) and (pointer: fine)');\n      canHover = hoverMedia.matches;\n    }\n\n    const handlePointerMove = (event: PointerEvent) => {\n      const state = stateRef.current;\n      if (!state) return;\n\n      const rect = root.getBoundingClientRect();\n      if (!rect.width || !rect.height) return;\n\n      const centerX = rect.left + rect.width / 2;\n      const centerY = rect.top + rect.height / 2;\n      const deltaX = event.clientX - centerX;\n      const deltaY = event.clientY - centerY;\n      const distance = Math.hypot(deltaX, deltaY);\n      const reach = distance > 0 ? clamp(distance / safeCursorRadius, 0, 1) : 0;\n      const dirX = distance > 0 ? deltaX / distance : 0;\n      const dirY = distance > 0 ? deltaY / distance : 0;\n\n      state.targetX = dirX * reach * safeOffset;\n      state.targetY = dirY * reach * safeOffset * 0.72;\n    };\n\n    const handlePointerLeave = () => {\n      const state = stateRef.current;\n      if (!state) return;\n      state.targetX = 0;\n      state.targetY = 0;\n    };\n\n    if (canHover) {\n      window.addEventListener('pointermove', handlePointerMove, { passive: true });\n      document.addEventListener('pointerleave', handlePointerLeave);\n      cleanupPointer = () => {\n        window.removeEventListener('pointermove', handlePointerMove);\n        document.removeEventListener('pointerleave', handlePointerLeave);\n      };\n    }\n\n    const renderFrame = (now: number) => {\n      const state = stateRef.current;\n      if (!state) return;\n\n      const elapsed = now - state.startTime;\n      const entranceProgress = entranceEnabled && safeDuration > 0 ? clamp(elapsed / safeDuration, 0, 1) : 1;\n      const easedEntrance = easeFn(entranceProgress);\n      const entranceRest = entranceEnabled ? 1 - easedEntrance : 0;\n      const targetVelocity = Math.hypot(state.targetX - state.lastTargetX, state.targetY - state.lastTargetY);\n\n      state.lastTargetX = state.targetX;\n      state.lastTargetY = state.targetY;\n\n      let maxSeparation = 0;\n\n      for (let index = 0; index <= echoCount; index += 1) {\n        const copy = copyRefs.current[index];\n        const current = state.positions[index];\n        if (!copy || !current) continue;\n\n        const entranceAmount = entranceRest * safeOffset * (index + 0.35);\n        const desiredX = state.targetX + vector.x * entranceAmount;\n        const desiredY = state.targetY + vector.y * entranceAmount;\n        const lerp = clamp(0.34 / (1 + index * safeLag * 4.2), 0.018, 0.36);\n\n        current.x += (desiredX - current.x) * lerp;\n        current.y += (desiredY - current.y) * lerp;\n\n        copy.style.transform = `translate3d(${current.x.toFixed(3)}px, ${current.y.toFixed(3)}px, 0)`;\n\n        if (index > 0) {\n          const front = state.positions[0];\n          const separation = front ? Math.hypot(current.x - front.x, current.y - front.y) : 0;\n          maxSeparation = Math.max(maxSeparation, separation);\n          const depth = echoCount ? index / echoCount : 0;\n          copy.style.filter = safeBlur > 0 ? `blur(${(safeBlur * depth).toFixed(2)}px)` : 'none';\n        }\n      }\n\n      const separationActivity = safeOffset > 0 ? clamp(maxSeparation / (safeOffset * 2.25), 0, 1) : 0;\n      const targetActivity = safeOffset > 0 ? clamp(targetVelocity / (safeOffset * 0.35), 0, 1) : 0;\n      const nextActivity = Math.max(entranceRest, separationActivity, targetActivity);\n      state.activity += (nextActivity - state.activity) * 0.18;\n\n      for (let index = 1; index <= echoCount; index += 1) {\n        const copy = copyRefs.current[index];\n        if (!copy) continue;\n        copy.style.opacity = String(Math.pow(safeFade, index) * state.activity);\n      }\n\n      const stillMoving =\n        state.activity > 0.002 ||\n        Math.abs(state.targetX) > 0.01 ||\n        Math.abs(state.targetY) > 0.01 ||\n        entranceProgress < 1 ||\n        canHover;\n\n      if (stillMoving) {\n        frameRef.current = requestAnimationFrame(renderFrame);\n      } else {\n        frameRef.current = null;\n      }\n    };\n\n    frameRef.current = requestAnimationFrame(renderFrame);\n\n    return () => {\n      cleanupPointer();\n      if (frameRef.current) cancelAnimationFrame(frameRef.current);\n      frameRef.current = null;\n      stateRef.current = null;\n    };\n  }, [blur, cursorRadius, direction, duration, ease, echoCount, fade, lag, mode, offset, prefersReducedMotion]);\n\n  const rootStyle: CSSProperties = {\n    fontSize,\n    fontWeight,\n    color,\n    ...style\n  };\n\n  return (\n    <span\n      ref={rootRef}\n      className={`relative inline-block whitespace-nowrap select-none leading-[0.9] tracking-[-0.04em] [contain:layout_style] [font-kerning:normal] [text-rendering:geometricPrecision] ${className}`.trim()}\n      style={rootStyle}\n    >\n      {copyIndexes\n        .slice(1)\n        .reverse()\n        .map(index => (\n          <span\n            aria-hidden=\"true\"\n            className=\"pointer-events-none absolute inset-0 block origin-center transform-gpu backface-hidden will-change-[transform,opacity]\"\n            data-echo-index={index}\n            key={`echo-${index}`}\n            ref={element => {\n              copyRefs.current[index] = element;\n            }}\n            style={{\n              color: tint ? `color-mix(in srgb, ${tint} ${Math.min(72, 18 + index * 5)}%, ${color})` : color,\n              opacity: 0\n            }}\n          >\n            {text}\n          </span>\n        ))}\n      <span\n        className=\"pointer-events-none relative z-[2] block transform-gpu text-shadow-[0_0.035em_0_rgba(255,255,255,0.04)] will-change-transform\"\n        data-echo-index=\"0\"\n        ref={element => {\n          copyRefs.current[0] = element;\n        }}\n      >\n        {text}\n      </span>\n    </span>\n  );\n};\n\nexport default EchoText;",
    "componentSourceJs": "\"use client\";\nimport React, { useEffect, useMemo, useRef, useState } from 'react';\nconst clamp = (value, min, max) => Math.min(Math.max(value, min), max);\nconst directionVectors = {\n    right: { x: 1, y: 0 },\n    left: { x: -1, y: 0 },\n    up: { x: 0, y: -1 },\n    down: { x: 0, y: 1 },\n    diagonal: { x: 0.72, y: 0.72 }\n};\nconst easing = {\n    linear: t => t,\n    'ease-out': t => 1 - Math.pow(1 - t, 3),\n    'ease-in-out': t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),\n    snappy: t => 1 - Math.pow(1 - t, 5)\n};\nexport const EchoText = ({ text = 'Motion Echo', echoes = 12, lag = 0.24, offset = 36, direction = 'right', fade = 0.72, blur = 3, tint = '#7dd3fc', mode = 'both', cursorRadius = 320, duration = 900, ease = 'ease-out', fontSize = 'clamp(3rem, 9vw, 7rem)', fontWeight = 800, color = '#f8fafc', className = '', style }) => {\n    const rootRef = useRef(null);\n    const copyRefs = useRef([]);\n    const frameRef = useRef(null);\n    const stateRef = useRef(null);\n    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);\n    const echoCount = prefersReducedMotion ? 0 : clamp(Math.round(echoes), 0, 24);\n    const copyIndexes = useMemo(() => Array.from({ length: echoCount + 1 }, (_, index) => index), [echoCount]);\n    useEffect(() => {\n        if (typeof window === 'undefined' || !window.matchMedia)\n            return;\n        const media = window.matchMedia('(prefers-reduced-motion: reduce)');\n        const updateMotionPreference = () => setPrefersReducedMotion(media.matches);\n        updateMotionPreference();\n        media.addEventListener?.('change', updateMotionPreference);\n        return () => media.removeEventListener?.('change', updateMotionPreference);\n    }, []);\n    useEffect(() => {\n        const root = rootRef.current;\n        if (!root || prefersReducedMotion)\n            return;\n        const vector = directionVectors[direction] || directionVectors.right;\n        const safeOffset = clamp(Number(offset) || 0, 0, 120);\n        const safeCursorRadius = clamp(Number(cursorRadius) || 320, 40, 1200);\n        const safeLag = clamp(Number(lag) || 0.16, 0.02, 0.5);\n        const safeFade = clamp(Number(fade) || 0.64, 0.1, 0.95);\n        const safeBlur = clamp(Number(blur) || 0, 0, 16);\n        const safeDuration = Math.max(0, Number(duration) || 0);\n        const easeFn = easing[ease] || easing['ease-out'];\n        const entranceEnabled = mode === 'entrance' || mode === 'both';\n        const pointerEnabled = mode === 'pointer' || mode === 'both';\n        const positions = Array.from({ length: echoCount + 1 }, (_, index) => {\n            const entranceAmount = entranceEnabled ? safeOffset * (index + 0.35) : 0;\n            return { x: vector.x * entranceAmount, y: vector.y * entranceAmount };\n        });\n        stateRef.current = {\n            targetX: 0,\n            targetY: 0,\n            lastTargetX: 0,\n            lastTargetY: 0,\n            activity: entranceEnabled ? 1 : 0,\n            positions,\n            startTime: performance.now()\n        };\n        let canHover = false;\n        let cleanupPointer = () => { };\n        if (pointerEnabled && window.matchMedia) {\n            const hoverMedia = window.matchMedia('(hover: hover) and (pointer: fine)');\n            canHover = hoverMedia.matches;\n        }\n        const handlePointerMove = (event) => {\n            const state = stateRef.current;\n            if (!state)\n                return;\n            const rect = root.getBoundingClientRect();\n            if (!rect.width || !rect.height)\n                return;\n            const centerX = rect.left + rect.width / 2;\n            const centerY = rect.top + rect.height / 2;\n            const deltaX = event.clientX - centerX;\n            const deltaY = event.clientY - centerY;\n            const distance = Math.hypot(deltaX, deltaY);\n            const reach = distance > 0 ? clamp(distance / safeCursorRadius, 0, 1) : 0;\n            const dirX = distance > 0 ? deltaX / distance : 0;\n            const dirY = distance > 0 ? deltaY / distance : 0;\n            state.targetX = dirX * reach * safeOffset;\n            state.targetY = dirY * reach * safeOffset * 0.72;\n        };\n        const handlePointerLeave = () => {\n            const state = stateRef.current;\n            if (!state)\n                return;\n            state.targetX = 0;\n            state.targetY = 0;\n        };\n        if (canHover) {\n            window.addEventListener('pointermove', handlePointerMove, { passive: true });\n            document.addEventListener('pointerleave', handlePointerLeave);\n            cleanupPointer = () => {\n                window.removeEventListener('pointermove', handlePointerMove);\n                document.removeEventListener('pointerleave', handlePointerLeave);\n            };\n        }\n        const renderFrame = (now) => {\n            const state = stateRef.current;\n            if (!state)\n                return;\n            const elapsed = now - state.startTime;\n            const entranceProgress = entranceEnabled && safeDuration > 0 ? clamp(elapsed / safeDuration, 0, 1) : 1;\n            const easedEntrance = easeFn(entranceProgress);\n            const entranceRest = entranceEnabled ? 1 - easedEntrance : 0;\n            const targetVelocity = Math.hypot(state.targetX - state.lastTargetX, state.targetY - state.lastTargetY);\n            state.lastTargetX = state.targetX;\n            state.lastTargetY = state.targetY;\n            let maxSeparation = 0;\n            for (let index = 0; index <= echoCount; index += 1) {\n                const copy = copyRefs.current[index];\n                const current = state.positions[index];\n                if (!copy || !current)\n                    continue;\n                const entranceAmount = entranceRest * safeOffset * (index + 0.35);\n                const desiredX = state.targetX + vector.x * entranceAmount;\n                const desiredY = state.targetY + vector.y * entranceAmount;\n                const lerp = clamp(0.34 / (1 + index * safeLag * 4.2), 0.018, 0.36);\n                current.x += (desiredX - current.x) * lerp;\n                current.y += (desiredY - current.y) * lerp;\n                copy.style.transform = `translate3d(${current.x.toFixed(3)}px, ${current.y.toFixed(3)}px, 0)`;\n                if (index > 0) {\n                    const front = state.positions[0];\n                    const separation = front ? Math.hypot(current.x - front.x, current.y - front.y) : 0;\n                    maxSeparation = Math.max(maxSeparation, separation);\n                    const depth = echoCount ? index / echoCount : 0;\n                    copy.style.filter = safeBlur > 0 ? `blur(${(safeBlur * depth).toFixed(2)}px)` : 'none';\n                }\n            }\n            const separationActivity = safeOffset > 0 ? clamp(maxSeparation / (safeOffset * 2.25), 0, 1) : 0;\n            const targetActivity = safeOffset > 0 ? clamp(targetVelocity / (safeOffset * 0.35), 0, 1) : 0;\n            const nextActivity = Math.max(entranceRest, separationActivity, targetActivity);\n            state.activity += (nextActivity - state.activity) * 0.18;\n            for (let index = 1; index <= echoCount; index += 1) {\n                const copy = copyRefs.current[index];\n                if (!copy)\n                    continue;\n                copy.style.opacity = String(Math.pow(safeFade, index) * state.activity);\n            }\n            const stillMoving = state.activity > 0.002 ||\n                Math.abs(state.targetX) > 0.01 ||\n                Math.abs(state.targetY) > 0.01 ||\n                entranceProgress < 1 ||\n                canHover;\n            if (stillMoving) {\n                frameRef.current = requestAnimationFrame(renderFrame);\n            }\n            else {\n                frameRef.current = null;\n            }\n        };\n        frameRef.current = requestAnimationFrame(renderFrame);\n        return () => {\n            cleanupPointer();\n            if (frameRef.current)\n                cancelAnimationFrame(frameRef.current);\n            frameRef.current = null;\n            stateRef.current = null;\n        };\n    }, [blur, cursorRadius, direction, duration, ease, echoCount, fade, lag, mode, offset, prefersReducedMotion]);\n    const rootStyle = {\n        fontSize,\n        fontWeight,\n        color,\n        ...style\n    };\n    return (<span ref={rootRef} className={`relative inline-block whitespace-nowrap select-none leading-[0.9] tracking-[-0.04em] [contain:layout_style] [font-kerning:normal] [text-rendering:geometricPrecision] ${className}`.trim()} style={rootStyle}>\n      {copyIndexes\n            .slice(1)\n            .reverse()\n            .map(index => (<span aria-hidden=\"true\" className=\"pointer-events-none absolute inset-0 block origin-center transform-gpu backface-hidden will-change-[transform,opacity]\" data-echo-index={index} key={`echo-${index}`} ref={element => {\n                copyRefs.current[index] = element;\n            }} style={{\n                color: tint ? `color-mix(in srgb, ${tint} ${Math.min(72, 18 + index * 5)}%, ${color})` : color,\n                opacity: 0\n            }}>\n            {text}\n          </span>))}\n      <span className=\"pointer-events-none relative z-[2] block transform-gpu text-shadow-[0_0.035em_0_rgba(255,255,255,0.04)] will-change-transform\" data-echo-index=\"0\" ref={element => {\n            copyRefs.current[0] = element;\n        }}>\n        {text}\n      </span>\n    </span>);\n};\nexport default EchoText;",
    "props": [
      {
        "name": "text",
        "type": "string",
        "default": "'Motion Echo'",
        "description": "The text content to display and animate."
      },
      {
        "name": "echoes",
        "type": "number",
        "default": "12",
        "description": "Controls the echoes for the component animation."
      },
      {
        "name": "lag",
        "type": "number",
        "default": "0.24",
        "description": "Controls the lag for the component animation."
      },
      {
        "name": "offset",
        "type": "number",
        "default": "36",
        "description": "Controls the offset for the component animation."
      },
      {
        "name": "direction",
        "type": "Direction",
        "default": "'right'",
        "description": "Direction of movement (e.g., 'top', 'bottom', 'left', 'right')."
      },
      {
        "name": "fade",
        "type": "number",
        "default": "0.72",
        "description": "Controls the fade for the component animation."
      },
      {
        "name": "blur",
        "type": "number",
        "default": "3",
        "description": "Controls the blur for the component animation."
      },
      {
        "name": "tint",
        "type": "string | false",
        "default": "'#7dd3fc'",
        "description": "Controls the tint for the component animation."
      },
      {
        "name": "mode",
        "type": "Mode",
        "default": "'both'",
        "description": "Controls the mode for the component animation."
      },
      {
        "name": "cursorRadius",
        "type": "number",
        "default": "320",
        "description": "Controls the cursor radius for the component animation."
      },
      {
        "name": "duration",
        "type": "number",
        "default": "900",
        "description": "Duration of the animation in seconds or milliseconds."
      },
      {
        "name": "ease",
        "type": "Ease",
        "default": "'ease-out'",
        "description": "GSAP or cubic-bezier easing curve for animation smoothing."
      },
      {
        "name": "fontSize",
        "type": "string | number",
        "default": "'clamp(3rem, 9vw, 7rem)'",
        "description": "Font size in pixels, rems, or fluid clamp notation."
      },
      {
        "name": "fontWeight",
        "type": "string | number",
        "default": "800",
        "description": "Font weight (e.g., 400, 700, 900, 'bold')."
      },
      {
        "name": "color",
        "type": "string",
        "default": "'#f8fafc'",
        "description": "Text or primary fill color."
      },
      {
        "name": "className",
        "type": "string",
        "default": "''",
        "description": "Additional CSS classes for styling and layout."
      },
      {
        "name": "style",
        "type": "CSSProperties",
        "default": "-",
        "description": "Controls the style for the component animation."
      }
    ]
  },
  "falling-text": {
    "slug": "falling-text",
    "name": "Falling Text",
    "description": "Interactive 2D physics simulation where words fall into a container with gravity, collisions, and drag interaction.",
    "dependencies": {
      "matter-js": "^0.20.0"
    },
    "installation": {
      "cliTs": "npx kibo add falling-text",
      "cliJs": "npx kibo add falling-text --js",
      "npm": "npm i matter-js",
      "pnpm": "pnpm add matter-js",
      "yarn": "yarn add matter-js",
      "bun": "bun add matter-js"
    },
    "usageTs": "import { FallingText } from \"@/components/kibo/falling-text/component\";\n\nexport default function Example() {\n  return (\n    <FallingText />\n  );\n}",
    "usageJs": "import { FallingText } from \"@/components/kibo/falling-text/component\";\nexport default function Example() {\n    return (<FallingText />);\n}",
    "componentSourceTs": "\"use client\";\n\nimport { useRef, useState, useEffect } from 'react';\nimport Matter from 'matter-js';\n\ninterface FallingTextProps {\n  text?: string;\n  highlightWords?: string[];\n  trigger?: 'auto' | 'scroll' | 'click' | 'hover';\n  backgroundColor?: string;\n  wireframes?: boolean;\n  gravity?: number;\n  mouseConstraintStiffness?: number;\n  fontSize?: string;\n}\n\nexport const FallingText: React.FC<FallingTextProps> = ({\n  text = '',\n  highlightWords = [],\n  trigger = 'auto',\n  backgroundColor = 'transparent',\n  wireframes = false,\n  gravity = 1,\n  mouseConstraintStiffness = 0.2,\n  fontSize = '1rem'\n}) => {\n  const containerRef = useRef<HTMLDivElement | null>(null);\n  const textRef = useRef<HTMLDivElement | null>(null);\n  const canvasContainerRef = useRef<HTMLDivElement | null>(null);\n\n  const [effectStarted, setEffectStarted] = useState(false);\n\n  useEffect(() => {\n    if (!textRef.current) return;\n    const words = text.split(' ');\n\n    const newHTML = words\n      .map(word => {\n        const isHighlighted = highlightWords.some(hw => word.startsWith(hw));\n        return `<span\n          class=\"inline-block mx-[2px] select-none ${isHighlighted ? 'text-cyan-500 font-bold' : ''}\"\n        >\n          ${word}\n        </span>`;\n      })\n      .join(' ');\n\n    textRef.current.innerHTML = newHTML;\n  }, [text, highlightWords]);\n\n  useEffect(() => {\n    if (trigger === 'auto') {\n      setEffectStarted(true);\n      return;\n    }\n    if (trigger === 'scroll' && containerRef.current) {\n      const observer = new IntersectionObserver(\n        ([entry]) => {\n          if (entry.isIntersecting) {\n            setEffectStarted(true);\n            observer.disconnect();\n          }\n        },\n        { threshold: 0.1 }\n      );\n      observer.observe(containerRef.current);\n      return () => observer.disconnect();\n    }\n  }, [trigger]);\n\n  useEffect(() => {\n    if (!effectStarted) return;\n\n    const { Engine, Render, World, Bodies, Runner, Mouse, MouseConstraint } = Matter;\n\n    if (!containerRef.current || !canvasContainerRef.current) return;\n\n    const containerRect = containerRef.current.getBoundingClientRect();\n    const width = containerRect.width;\n    const height = containerRect.height;\n\n    if (width <= 0 || height <= 0) return;\n\n    const engine = Engine.create();\n    engine.world.gravity.y = gravity;\n\n    const render = Render.create({\n      element: canvasContainerRef.current,\n      engine,\n      options: {\n        width,\n        height,\n        background: backgroundColor,\n        wireframes\n      }\n    });\n\n    const boundaryOptions = {\n      isStatic: true,\n      render: { fillStyle: 'transparent' }\n    };\n    const floor = Bodies.rectangle(width / 2, height + 25, width, 50, boundaryOptions);\n    const leftWall = Bodies.rectangle(-25, height / 2, 50, height, boundaryOptions);\n    const rightWall = Bodies.rectangle(width + 25, height / 2, 50, height, boundaryOptions);\n    const ceiling = Bodies.rectangle(width / 2, -25, width, 50, boundaryOptions);\n\n    if (!textRef.current) return;\n    const wordSpans = textRef.current.querySelectorAll('span');\n    const wordBodies = [...wordSpans].map(elem => {\n      const rect = elem.getBoundingClientRect();\n\n      const x = rect.left - containerRect.left + rect.width / 2;\n      const y = rect.top - containerRect.top + rect.height / 2;\n\n      const body = Bodies.rectangle(x, y, rect.width, rect.height, {\n        render: { fillStyle: 'transparent' },\n        restitution: 0.8,\n        frictionAir: 0.01,\n        friction: 0.2\n      });\n      Matter.Body.setVelocity(body, {\n        x: (Math.random() - 0.5) * 5,\n        y: 0\n      });\n      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.05);\n\n      return { elem, body };\n    });\n\n    wordBodies.forEach(({ elem, body }) => {\n      elem.style.position = 'absolute';\n      elem.style.left = `${body.position.x - body.bounds.max.x + body.bounds.min.x / 2}px`;\n      elem.style.top = `${body.position.y - body.bounds.max.y + body.bounds.min.y / 2}px`;\n      elem.style.transform = 'none';\n    });\n\n    const mouse = Mouse.create(containerRef.current);\n    const mouseConstraint = MouseConstraint.create(engine, {\n      mouse,\n      constraint: {\n        stiffness: mouseConstraintStiffness,\n        render: { visible: false }\n      }\n    });\n    render.mouse = mouse;\n\n    World.add(engine.world, [floor, leftWall, rightWall, ceiling, mouseConstraint, ...wordBodies.map(wb => wb.body)]);\n\n    const runner = Runner.create();\n    Runner.run(runner, engine);\n    Render.run(render);\n\n    const updateLoop = () => {\n      wordBodies.forEach(({ body, elem }) => {\n        const { x, y } = body.position;\n        elem.style.left = `${x}px`;\n        elem.style.top = `${y}px`;\n        elem.style.transform = `translate(-50%, -50%) rotate(${body.angle}rad)`;\n      });\n      Matter.Engine.update(engine);\n      requestAnimationFrame(updateLoop);\n    };\n    updateLoop();\n\n    return () => {\n      Render.stop(render);\n      Runner.stop(runner);\n      if (render.canvas && canvasContainerRef.current) {\n        canvasContainerRef.current.removeChild(render.canvas);\n      }\n      World.clear(engine.world, false);\n      Engine.clear(engine);\n    };\n  }, [effectStarted, gravity, wireframes, backgroundColor, mouseConstraintStiffness]);\n\n  const handleTrigger = () => {\n    if (!effectStarted && (trigger === 'click' || trigger === 'hover')) {\n      setEffectStarted(true);\n    }\n  };\n\n  return (\n    <div\n      ref={containerRef}\n      className=\"relative z-[1] w-full h-full cursor-pointer text-center pt-8 overflow-hidden\"\n      onClick={trigger === 'click' ? handleTrigger : undefined}\n      onMouseEnter={trigger === 'hover' ? handleTrigger : undefined}\n    >\n      <div\n        ref={textRef}\n        className=\"inline-block\"\n        style={{\n          fontSize,\n          lineHeight: 1.4\n        }}\n      />\n\n      <div className=\"absolute top-0 left-0 z-0\" ref={canvasContainerRef} />\n    </div>\n  );\n};\n\nexport default FallingText;",
    "componentSourceJs": "\"use client\";\nimport { useRef, useState, useEffect } from 'react';\nimport Matter from 'matter-js';\nexport const FallingText = ({ text = '', highlightWords = [], trigger = 'auto', backgroundColor = 'transparent', wireframes = false, gravity = 1, mouseConstraintStiffness = 0.2, fontSize = '1rem' }) => {\n    const containerRef = useRef(null);\n    const textRef = useRef(null);\n    const canvasContainerRef = useRef(null);\n    const [effectStarted, setEffectStarted] = useState(false);\n    useEffect(() => {\n        if (!textRef.current)\n            return;\n        const words = text.split(' ');\n        const newHTML = words\n            .map(word => {\n            const isHighlighted = highlightWords.some(hw => word.startsWith(hw));\n            return `<span\n          class=\"inline-block mx-[2px] select-none ${isHighlighted ? 'text-cyan-500 font-bold' : ''}\"\n        >\n          ${word}\n        </span>`;\n        })\n            .join(' ');\n        textRef.current.innerHTML = newHTML;\n    }, [text, highlightWords]);\n    useEffect(() => {\n        if (trigger === 'auto') {\n            setEffectStarted(true);\n            return;\n        }\n        if (trigger === 'scroll' && containerRef.current) {\n            const observer = new IntersectionObserver(([entry]) => {\n                if (entry.isIntersecting) {\n                    setEffectStarted(true);\n                    observer.disconnect();\n                }\n            }, { threshold: 0.1 });\n            observer.observe(containerRef.current);\n            return () => observer.disconnect();\n        }\n    }, [trigger]);\n    useEffect(() => {\n        if (!effectStarted)\n            return;\n        const { Engine, Render, World, Bodies, Runner, Mouse, MouseConstraint } = Matter;\n        if (!containerRef.current || !canvasContainerRef.current)\n            return;\n        const containerRect = containerRef.current.getBoundingClientRect();\n        const width = containerRect.width;\n        const height = containerRect.height;\n        if (width <= 0 || height <= 0)\n            return;\n        const engine = Engine.create();\n        engine.world.gravity.y = gravity;\n        const render = Render.create({\n            element: canvasContainerRef.current,\n            engine,\n            options: {\n                width,\n                height,\n                background: backgroundColor,\n                wireframes\n            }\n        });\n        const boundaryOptions = {\n            isStatic: true,\n            render: { fillStyle: 'transparent' }\n        };\n        const floor = Bodies.rectangle(width / 2, height + 25, width, 50, boundaryOptions);\n        const leftWall = Bodies.rectangle(-25, height / 2, 50, height, boundaryOptions);\n        const rightWall = Bodies.rectangle(width + 25, height / 2, 50, height, boundaryOptions);\n        const ceiling = Bodies.rectangle(width / 2, -25, width, 50, boundaryOptions);\n        if (!textRef.current)\n            return;\n        const wordSpans = textRef.current.querySelectorAll('span');\n        const wordBodies = [...wordSpans].map(elem => {\n            const rect = elem.getBoundingClientRect();\n            const x = rect.left - containerRect.left + rect.width / 2;\n            const y = rect.top - containerRect.top + rect.height / 2;\n            const body = Bodies.rectangle(x, y, rect.width, rect.height, {\n                render: { fillStyle: 'transparent' },\n                restitution: 0.8,\n                frictionAir: 0.01,\n                friction: 0.2\n            });\n            Matter.Body.setVelocity(body, {\n                x: (Math.random() - 0.5) * 5,\n                y: 0\n            });\n            Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.05);\n            return { elem, body };\n        });\n        wordBodies.forEach(({ elem, body }) => {\n            elem.style.position = 'absolute';\n            elem.style.left = `${body.position.x - body.bounds.max.x + body.bounds.min.x / 2}px`;\n            elem.style.top = `${body.position.y - body.bounds.max.y + body.bounds.min.y / 2}px`;\n            elem.style.transform = 'none';\n        });\n        const mouse = Mouse.create(containerRef.current);\n        const mouseConstraint = MouseConstraint.create(engine, {\n            mouse,\n            constraint: {\n                stiffness: mouseConstraintStiffness,\n                render: { visible: false }\n            }\n        });\n        render.mouse = mouse;\n        World.add(engine.world, [floor, leftWall, rightWall, ceiling, mouseConstraint, ...wordBodies.map(wb => wb.body)]);\n        const runner = Runner.create();\n        Runner.run(runner, engine);\n        Render.run(render);\n        const updateLoop = () => {\n            wordBodies.forEach(({ body, elem }) => {\n                const { x, y } = body.position;\n                elem.style.left = `${x}px`;\n                elem.style.top = `${y}px`;\n                elem.style.transform = `translate(-50%, -50%) rotate(${body.angle}rad)`;\n            });\n            Matter.Engine.update(engine);\n            requestAnimationFrame(updateLoop);\n        };\n        updateLoop();\n        return () => {\n            Render.stop(render);\n            Runner.stop(runner);\n            if (render.canvas && canvasContainerRef.current) {\n                canvasContainerRef.current.removeChild(render.canvas);\n            }\n            World.clear(engine.world, false);\n            Engine.clear(engine);\n        };\n    }, [effectStarted, gravity, wireframes, backgroundColor, mouseConstraintStiffness]);\n    const handleTrigger = () => {\n        if (!effectStarted && (trigger === 'click' || trigger === 'hover')) {\n            setEffectStarted(true);\n        }\n    };\n    return (<div ref={containerRef} className=\"relative z-[1] w-full h-full cursor-pointer text-center pt-8 overflow-hidden\" onClick={trigger === 'click' ? handleTrigger : undefined} onMouseEnter={trigger === 'hover' ? handleTrigger : undefined}>\n      <div ref={textRef} className=\"inline-block\" style={{\n            fontSize,\n            lineHeight: 1.4\n        }}/>\n\n      <div className=\"absolute top-0 left-0 z-0\" ref={canvasContainerRef}/>\n    </div>);\n};\nexport default FallingText;",
    "props": [
      {
        "name": "text",
        "type": "string",
        "default": "''",
        "description": "The text content to display and animate."
      },
      {
        "name": "highlightWords",
        "type": "string[]",
        "default": "[]",
        "description": "Controls the highlight words for the component animation."
      },
      {
        "name": "trigger",
        "type": "'auto' | 'scroll' | 'click' | 'hover'",
        "default": "'auto'",
        "description": "Controls the trigger for the component animation."
      },
      {
        "name": "backgroundColor",
        "type": "string",
        "default": "'transparent'",
        "description": "Controls the background color for the component animation."
      },
      {
        "name": "wireframes",
        "type": "boolean",
        "default": "false",
        "description": "Controls the wireframes for the component animation."
      },
      {
        "name": "gravity",
        "type": "number",
        "default": "1",
        "description": "Controls the gravity for the component animation."
      },
      {
        "name": "mouseConstraintStiffness",
        "type": "number",
        "default": "0.2",
        "description": "Controls the mouse constraint stiffness for the component animation."
      },
      {
        "name": "fontSize",
        "type": "string",
        "default": "'1rem'",
        "description": "Font size in pixels, rems, or fluid clamp notation."
      }
    ]
  },
  "fold-text": {
    "slug": "fold-text",
    "name": "Fold Text",
    "description": "3D origami accordion fold animation that bends and unrolls text slices dynamically on scroll or hover.",
    "dependencies": {
      "gsap": "^3.13.0"
    },
    "installation": {
      "cliTs": "npx kibo add fold-text",
      "cliJs": "npx kibo add fold-text --js",
      "npm": "npm i gsap",
      "pnpm": "pnpm add gsap",
      "yarn": "yarn add gsap",
      "bun": "bun add gsap"
    },
    "usageTs": "import { FoldText } from \"@/components/kibo/fold-text/component\";\n\nexport default function Example() {\n  return (\n    <FoldText />\n  );\n}",
    "usageJs": "import { FoldText } from \"@/components/kibo/fold-text/component\";\nexport default function Example() {\n    return (<FoldText />);\n}",
    "componentSourceTs": "\"use client\";\n\nimport { useEffect, useMemo, useRef, type CSSProperties, type ReactNode } from 'react';\nimport { gsap } from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';\n\ngsap.registerPlugin(ScrollTrigger);\n\ntype SplitBy = 'char' | 'word' | 'line';\ntype Hinge = 'top' | 'bottom' | 'left' | 'right';\ntype Trigger = 'mount' | 'hover' | 'scroll' | 'loop';\n\nexport interface FoldTextProps {\n  text?: string;\n  splitBy?: SplitBy;\n  hinge?: Hinge;\n  duration?: number;\n  stagger?: number;\n  ease?: string;\n  perspective?: number;\n  creaseShading?: number;\n  trigger?: Trigger;\n  fontSize?: string | number;\n  fontWeight?: string | number;\n  color?: string;\n  className?: string;\n  style?: CSSProperties;\n}\n\ntype HingeConfig = {\n  origin: string;\n  rotateX: number;\n  rotateY: number;\n};\n\nconst HINGE_CONFIG: Record<Hinge, HingeConfig> = {\n  top: { origin: '50% 0%', rotateX: -92, rotateY: 0 },\n  bottom: { origin: '50% 100%', rotateX: 92, rotateY: 0 },\n  left: { origin: '0% 50%', rotateX: 0, rotateY: 92 },\n  right: { origin: '100% 50%', rotateX: 0, rotateY: -92 }\n};\n\nconst clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));\n\nconst renderWhitespace = (value: string, key: string): ReactNode[] =>\n  value.split(/(\\n)/).map((part, index) => {\n    if (part === '\\n') return <br key={`${key}-br-${index}`} />;\n    if (!part) return null;\n\n    return (\n      <span className=\"fold-text-whitespace\" key={`${key}-space-${index}`}>\n        {part.replace(/ /g, '\\u00A0')}\n      </span>\n    );\n  });\n\nconst FOLD_TEXT_STYLES = `.fold-text {\n  display: inline-block;\n  color: var(--fold-text-color, currentColor);\n  font-size: var(--fold-text-font-size, inherit);\n  font-weight: var(--fold-text-font-weight, inherit);\n  line-height: 0.95;\n  letter-spacing: -0.04em;\n  white-space: pre-wrap;\n  user-select: text;\n}\n\n.fold-text-sr-only {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border: 0;\n}\n\n.fold-text-visual {\n  display: inline;\n}\n\n.fold-text-line {\n  display: block;\n}\n\n.fold-text-whitespace {\n  display: inline;\n}\n\n.fold-text-segment {\n  display: inline-block;\n  line-height: inherit;\n  perspective: var(--fold-perspective, 700px);\n  transform-style: preserve-3d;\n  vertical-align: baseline;\n}\n\n.fold-text-segment[data-fold-split='line'] {\n  display: block;\n}\n\n.fold-text-piece {\n  position: relative;\n  display: inline-block;\n  color: inherit;\n  line-height: inherit;\n  transform-style: preserve-3d;\n  backface-visibility: hidden;\n  will-change: transform, opacity;\n}\n\n.fold-text-piece::after {\n  content: '';\n  position: absolute;\n  inset: -0.08em -0.02em;\n  pointer-events: none;\n  opacity: var(--fold-crease, 0);\n  mix-blend-mode: multiply;\n  border-radius: 0.08em;\n}\n\n.fold-text-piece[data-fold-hinge='top']::after {\n  background: linear-gradient(180deg, rgba(0, 0, 0, 0.58) 0%, rgba(0, 0, 0, 0.22) 42%, rgba(255, 255, 255, 0.26) 100%);\n}\n\n.fold-text-piece[data-fold-hinge='bottom']::after {\n  background: linear-gradient(0deg, rgba(0, 0, 0, 0.58) 0%, rgba(0, 0, 0, 0.22) 42%, rgba(255, 255, 255, 0.26) 100%);\n}\n\n.fold-text-piece[data-fold-hinge='left']::after {\n  background: linear-gradient(90deg, rgba(0, 0, 0, 0.58) 0%, rgba(0, 0, 0, 0.22) 42%, rgba(255, 255, 255, 0.26) 100%);\n}\n\n.fold-text-piece[data-fold-hinge='right']::after {\n  background: linear-gradient(270deg, rgba(0, 0, 0, 0.58) 0%, rgba(0, 0, 0, 0.22) 42%, rgba(255, 255, 255, 0.26) 100%);\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .fold-text-piece {\n    transform: none !important;\n  }\n\n  .fold-text-piece::after {\n    opacity: 0 !important;\n  }\n}\n`;\n\nexport const FoldText = ({\n  text = 'Design unfolds',\n  splitBy = 'char',\n  hinge = 'top',\n  duration = 0.65,\n  stagger = 0.045,\n  ease = 'power3.out',\n  perspective = 700,\n  creaseShading = 0.55,\n  trigger = 'mount',\n  fontSize = 80,\n  fontWeight = 800,\n  color = '#f7f2e8',\n  className = '',\n  style = {}\n}: FoldTextProps) => {\n  const rootRef = useRef<HTMLSpanElement | null>(null);\n  const timelineRef = useRef<gsap.core.Timeline | null>(null);\n  const hingeConfig = HINGE_CONFIG[hinge] || HINGE_CONFIG.top;\n  const safeCrease = clamp(creaseShading, 0, 1);\n  const safePerspective = Math.max(120, perspective);\n\n  const segments = useMemo(() => {\n    let segmentIndex = 0;\n\n    const renderSegment = (content: string, key: string, split: SplitBy = splitBy): ReactNode => {\n      segmentIndex += 1;\n      return (\n        <span\n          className=\"fold-text-segment\"\n          data-fold-split={split}\n          key={key}\n          style={{ '--fold-perspective': `${safePerspective}px` } as CSSProperties}\n        >\n          <span\n            className=\"fold-text-piece\"\n            data-fold-hinge={hinge}\n            style={{ transformOrigin: hingeConfig.origin, '--fold-crease': 0 } as CSSProperties}\n          >\n            {content || '\\u00A0'}\n          </span>\n        </span>\n      );\n    };\n\n    if (splitBy === 'line') {\n      return text.split('\\n').map((line, index) => (\n        <span className=\"fold-text-line\" key={`line-${index}`}>\n          {renderSegment(line || '\\u00A0', `segment-line-${index}`, 'line')}\n        </span>\n      ));\n    }\n\n    if (splitBy === 'word') {\n      return text.split(/(\\s+)/).flatMap((part, index) => {\n        if (!part) return [];\n        if (/^\\s+$/.test(part)) return renderWhitespace(part, `ws-${index}`);\n        return renderSegment(part, `segment-word-${segmentIndex}`);\n      });\n    }\n\n    return Array.from(text).map((char, index) => {\n      if (char === '\\n') return <br key={`br-${index}`} />;\n      return renderSegment(char === ' ' ? '\\u00A0' : char, `segment-char-${index}`);\n    });\n  }, [text, splitBy, hinge, hingeConfig.origin, safePerspective]);\n\n  useEffect(() => {\n    if (typeof window === 'undefined') return undefined;\n\n    const root = rootRef.current;\n    if (!root) return undefined;\n\n    const pieces = Array.from(root.querySelectorAll<HTMLElement>('.fold-text-piece'));\n    if (!pieces.length) return undefined;\n\n    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;\n    const activeDuration = reduceMotion ? Math.min(duration, 0.22) : duration;\n    const activeStagger = reduceMotion ? Math.min(stagger, 0.02) : stagger;\n    const fromVars = {\n      opacity: 0,\n      rotateX: reduceMotion ? 0 : hingeConfig.rotateX,\n      rotateY: reduceMotion ? 0 : hingeConfig.rotateY,\n      '--fold-crease': reduceMotion ? 0 : safeCrease,\n      transformOrigin: hingeConfig.origin,\n      force3D: true\n    };\n    const toVars = {\n      opacity: 1,\n      rotateX: 0,\n      rotateY: 0,\n      '--fold-crease': 0,\n      duration: activeDuration,\n      ease: reduceMotion ? 'power1.out' : ease,\n      stagger: activeStagger,\n      clearProps: 'willChange'\n    };\n\n    const killTimeline = () => {\n      timelineRef.current?.kill();\n      timelineRef.current = null;\n      gsap.killTweensOf(pieces);\n    };\n\n    const play = (repeat: boolean): gsap.core.Timeline => {\n      killTimeline();\n      timelineRef.current = gsap.timeline({ repeat: repeat ? -1 : 0, repeatDelay: repeat ? 0.75 : 0 });\n      timelineRef.current.fromTo(pieces, fromVars, toVars);\n      return timelineRef.current;\n    };\n\n    let scrollTrigger: ReturnType<typeof ScrollTrigger.create> | undefined;\n    let hoverHandler: (() => void) | undefined;\n\n    if (trigger === 'hover') {\n      gsap.set(pieces, { opacity: 1, rotateX: 0, rotateY: 0, '--fold-crease': 0, transformOrigin: hingeConfig.origin });\n      hoverHandler = () => play(false);\n      root.addEventListener('mouseenter', hoverHandler);\n    } else if (trigger === 'scroll') {\n      gsap.set(pieces, fromVars);\n      scrollTrigger = ScrollTrigger.create({\n        trigger: root,\n        start: 'top 82%',\n        once: true,\n        onEnter: () => play(false)\n      });\n    } else if (trigger === 'loop') {\n      play(true);\n    } else {\n      play(false);\n    }\n\n    return () => {\n      if (hoverHandler) root.removeEventListener('mouseenter', hoverHandler);\n      scrollTrigger?.kill();\n      killTimeline();\n    };\n  }, [\n    text,\n    splitBy,\n    hinge,\n    duration,\n    stagger,\n    ease,\n    perspective,\n    safeCrease,\n    trigger,\n    hingeConfig.origin,\n    hingeConfig.rotateX,\n    hingeConfig.rotateY\n  ]);\n\n  const rootStyle: CSSProperties = {\n    '--fold-text-font-size': typeof fontSize === 'number' ? `${fontSize}px` : fontSize,\n    '--fold-text-font-weight': fontWeight,\n    '--fold-text-color': color,\n    ...style\n  } as CSSProperties;\n\n  return (\n    <>\n      <style>{FOLD_TEXT_STYLES}</style>\n      <span ref={rootRef} className={`fold-text ${className}`.trim()} style={rootStyle}>\n        <span className=\"fold-text-sr-only\">{text}</span>\n        <span className=\"fold-text-visual\" aria-hidden=\"true\">\n          {segments}\n        </span>\n      </span>\n    </>\n  );\n};\n\nexport default FoldText;",
    "componentSourceJs": "\"use client\";\nimport { useEffect, useMemo, useRef } from 'react';\nimport { gsap } from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';\ngsap.registerPlugin(ScrollTrigger);\nconst HINGE_CONFIG = {\n    top: { origin: '50% 0%', rotateX: -92, rotateY: 0 },\n    bottom: { origin: '50% 100%', rotateX: 92, rotateY: 0 },\n    left: { origin: '0% 50%', rotateX: 0, rotateY: 92 },\n    right: { origin: '100% 50%', rotateX: 0, rotateY: -92 }\n};\nconst clamp = (value, min, max) => Math.min(max, Math.max(min, value));\nconst renderWhitespace = (value, key) => value.split(/(\\n)/).map((part, index) => {\n    if (part === '\\n')\n        return <br key={`${key}-br-${index}`}/>;\n    if (!part)\n        return null;\n    return (<span className=\"fold-text-whitespace\" key={`${key}-space-${index}`}>\n        {part.replace(/ /g, '\\u00A0')}\n      </span>);\n});\nconst FOLD_TEXT_STYLES = `.fold-text {\n  display: inline-block;\n  color: var(--fold-text-color, currentColor);\n  font-size: var(--fold-text-font-size, inherit);\n  font-weight: var(--fold-text-font-weight, inherit);\n  line-height: 0.95;\n  letter-spacing: -0.04em;\n  white-space: pre-wrap;\n  user-select: text;\n}\n\n.fold-text-sr-only {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border: 0;\n}\n\n.fold-text-visual {\n  display: inline;\n}\n\n.fold-text-line {\n  display: block;\n}\n\n.fold-text-whitespace {\n  display: inline;\n}\n\n.fold-text-segment {\n  display: inline-block;\n  line-height: inherit;\n  perspective: var(--fold-perspective, 700px);\n  transform-style: preserve-3d;\n  vertical-align: baseline;\n}\n\n.fold-text-segment[data-fold-split='line'] {\n  display: block;\n}\n\n.fold-text-piece {\n  position: relative;\n  display: inline-block;\n  color: inherit;\n  line-height: inherit;\n  transform-style: preserve-3d;\n  backface-visibility: hidden;\n  will-change: transform, opacity;\n}\n\n.fold-text-piece::after {\n  content: '';\n  position: absolute;\n  inset: -0.08em -0.02em;\n  pointer-events: none;\n  opacity: var(--fold-crease, 0);\n  mix-blend-mode: multiply;\n  border-radius: 0.08em;\n}\n\n.fold-text-piece[data-fold-hinge='top']::after {\n  background: linear-gradient(180deg, rgba(0, 0, 0, 0.58) 0%, rgba(0, 0, 0, 0.22) 42%, rgba(255, 255, 255, 0.26) 100%);\n}\n\n.fold-text-piece[data-fold-hinge='bottom']::after {\n  background: linear-gradient(0deg, rgba(0, 0, 0, 0.58) 0%, rgba(0, 0, 0, 0.22) 42%, rgba(255, 255, 255, 0.26) 100%);\n}\n\n.fold-text-piece[data-fold-hinge='left']::after {\n  background: linear-gradient(90deg, rgba(0, 0, 0, 0.58) 0%, rgba(0, 0, 0, 0.22) 42%, rgba(255, 255, 255, 0.26) 100%);\n}\n\n.fold-text-piece[data-fold-hinge='right']::after {\n  background: linear-gradient(270deg, rgba(0, 0, 0, 0.58) 0%, rgba(0, 0, 0, 0.22) 42%, rgba(255, 255, 255, 0.26) 100%);\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .fold-text-piece {\n    transform: none !important;\n  }\n\n  .fold-text-piece::after {\n    opacity: 0 !important;\n  }\n}\n`;\nexport const FoldText = ({ text = 'Design unfolds', splitBy = 'char', hinge = 'top', duration = 0.65, stagger = 0.045, ease = 'power3.out', perspective = 700, creaseShading = 0.55, trigger = 'mount', fontSize = 80, fontWeight = 800, color = '#f7f2e8', className = '', style = {} }) => {\n    const rootRef = useRef(null);\n    const timelineRef = useRef(null);\n    const hingeConfig = HINGE_CONFIG[hinge] || HINGE_CONFIG.top;\n    const safeCrease = clamp(creaseShading, 0, 1);\n    const safePerspective = Math.max(120, perspective);\n    const segments = useMemo(() => {\n        let segmentIndex = 0;\n        const renderSegment = (content, key, split = splitBy) => {\n            segmentIndex += 1;\n            return (<span className=\"fold-text-segment\" data-fold-split={split} key={key} style={{ '--fold-perspective': `${safePerspective}px` }}>\n          <span className=\"fold-text-piece\" data-fold-hinge={hinge} style={{ transformOrigin: hingeConfig.origin, '--fold-crease': 0 }}>\n            {content || '\\u00A0'}\n          </span>\n        </span>);\n        };\n        if (splitBy === 'line') {\n            return text.split('\\n').map((line, index) => (<span className=\"fold-text-line\" key={`line-${index}`}>\n          {renderSegment(line || '\\u00A0', `segment-line-${index}`, 'line')}\n        </span>));\n        }\n        if (splitBy === 'word') {\n            return text.split(/(\\s+)/).flatMap((part, index) => {\n                if (!part)\n                    return [];\n                if (/^\\s+$/.test(part))\n                    return renderWhitespace(part, `ws-${index}`);\n                return renderSegment(part, `segment-word-${segmentIndex}`);\n            });\n        }\n        return Array.from(text).map((char, index) => {\n            if (char === '\\n')\n                return <br key={`br-${index}`}/>;\n            return renderSegment(char === ' ' ? '\\u00A0' : char, `segment-char-${index}`);\n        });\n    }, [text, splitBy, hinge, hingeConfig.origin, safePerspective]);\n    useEffect(() => {\n        if (typeof window === 'undefined')\n            return undefined;\n        const root = rootRef.current;\n        if (!root)\n            return undefined;\n        const pieces = Array.from(root.querySelectorAll('.fold-text-piece'));\n        if (!pieces.length)\n            return undefined;\n        const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;\n        const activeDuration = reduceMotion ? Math.min(duration, 0.22) : duration;\n        const activeStagger = reduceMotion ? Math.min(stagger, 0.02) : stagger;\n        const fromVars = {\n            opacity: 0,\n            rotateX: reduceMotion ? 0 : hingeConfig.rotateX,\n            rotateY: reduceMotion ? 0 : hingeConfig.rotateY,\n            '--fold-crease': reduceMotion ? 0 : safeCrease,\n            transformOrigin: hingeConfig.origin,\n            force3D: true\n        };\n        const toVars = {\n            opacity: 1,\n            rotateX: 0,\n            rotateY: 0,\n            '--fold-crease': 0,\n            duration: activeDuration,\n            ease: reduceMotion ? 'power1.out' : ease,\n            stagger: activeStagger,\n            clearProps: 'willChange'\n        };\n        const killTimeline = () => {\n            timelineRef.current?.kill();\n            timelineRef.current = null;\n            gsap.killTweensOf(pieces);\n        };\n        const play = (repeat) => {\n            killTimeline();\n            timelineRef.current = gsap.timeline({ repeat: repeat ? -1 : 0, repeatDelay: repeat ? 0.75 : 0 });\n            timelineRef.current.fromTo(pieces, fromVars, toVars);\n            return timelineRef.current;\n        };\n        let scrollTrigger;\n        let hoverHandler;\n        if (trigger === 'hover') {\n            gsap.set(pieces, { opacity: 1, rotateX: 0, rotateY: 0, '--fold-crease': 0, transformOrigin: hingeConfig.origin });\n            hoverHandler = () => play(false);\n            root.addEventListener('mouseenter', hoverHandler);\n        }\n        else if (trigger === 'scroll') {\n            gsap.set(pieces, fromVars);\n            scrollTrigger = ScrollTrigger.create({\n                trigger: root,\n                start: 'top 82%',\n                once: true,\n                onEnter: () => play(false)\n            });\n        }\n        else if (trigger === 'loop') {\n            play(true);\n        }\n        else {\n            play(false);\n        }\n        return () => {\n            if (hoverHandler)\n                root.removeEventListener('mouseenter', hoverHandler);\n            scrollTrigger?.kill();\n            killTimeline();\n        };\n    }, [\n        text,\n        splitBy,\n        hinge,\n        duration,\n        stagger,\n        ease,\n        perspective,\n        safeCrease,\n        trigger,\n        hingeConfig.origin,\n        hingeConfig.rotateX,\n        hingeConfig.rotateY\n    ]);\n    const rootStyle = {\n        '--fold-text-font-size': typeof fontSize === 'number' ? `${fontSize}px` : fontSize,\n        '--fold-text-font-weight': fontWeight,\n        '--fold-text-color': color,\n        ...style\n    };\n    return (<>\n      <style>{FOLD_TEXT_STYLES}</style>\n      <span ref={rootRef} className={`fold-text ${className}`.trim()} style={rootStyle}>\n        <span className=\"fold-text-sr-only\">{text}</span>\n        <span className=\"fold-text-visual\" aria-hidden=\"true\">\n          {segments}\n        </span>\n      </span>\n    </>);\n};\nexport default FoldText;",
    "props": [
      {
        "name": "text",
        "type": "string",
        "default": "'Design unfolds'",
        "description": "The text content to display and animate."
      },
      {
        "name": "splitBy",
        "type": "SplitBy",
        "default": "'char'",
        "description": "Controls the split by for the component animation."
      },
      {
        "name": "hinge",
        "type": "Hinge",
        "default": "'top'",
        "description": "Controls the hinge for the component animation."
      },
      {
        "name": "duration",
        "type": "number",
        "default": "0.65",
        "description": "Duration of the animation in seconds or milliseconds."
      },
      {
        "name": "stagger",
        "type": "number",
        "default": "0.045",
        "description": "Stagger delay in seconds between individual characters/elements."
      },
      {
        "name": "ease",
        "type": "string",
        "default": "'power3.out'",
        "description": "GSAP or cubic-bezier easing curve for animation smoothing."
      },
      {
        "name": "perspective",
        "type": "number",
        "default": "700",
        "description": "Controls the perspective for the component animation."
      },
      {
        "name": "creaseShading",
        "type": "number",
        "default": "0.55",
        "description": "Controls the crease shading for the component animation."
      },
      {
        "name": "trigger",
        "type": "Trigger",
        "default": "'mount'",
        "description": "Controls the trigger for the component animation."
      },
      {
        "name": "fontSize",
        "type": "string | number",
        "default": "80",
        "description": "Font size in pixels, rems, or fluid clamp notation."
      },
      {
        "name": "fontWeight",
        "type": "string | number",
        "default": "800",
        "description": "Font weight (e.g., 400, 700, 900, 'bold')."
      },
      {
        "name": "color",
        "type": "string",
        "default": "'#f7f2e8'",
        "description": "Text or primary fill color."
      },
      {
        "name": "className",
        "type": "string",
        "default": "''",
        "description": "Additional CSS classes for styling and layout."
      },
      {
        "name": "style",
        "type": "CSSProperties",
        "default": "{}",
        "description": "Controls the style for the component animation."
      }
    ]
  },
  "fuzzy-text": {
    "slug": "fuzzy-text",
    "name": "Fuzzy Text",
    "description": "Canvas-driven CRT static fuzz and particulate distortion that scatters and reconstitutes text on interaction.",
    "dependencies": {},
    "installation": {
      "cliTs": "npx kibo add fuzzy-text",
      "cliJs": "npx kibo add fuzzy-text --js",
      "npm": "npx kibo add fuzzy-text",
      "pnpm": "pnpm dlx kibo add fuzzy-text",
      "yarn": "yarn add fuzzy-text",
      "bun": "bunx kibo add fuzzy-text"
    },
    "usageTs": "import { FuzzyText } from \"@/components/kibo/fuzzy-text/component\";\n\nexport default function Example() {\n  return (\n    <FuzzyText />\n  );\n}",
    "usageJs": "import { FuzzyText } from \"@/components/kibo/fuzzy-text/component\";\nexport default function Example() {\n    return (<FuzzyText />);\n}",
    "componentSourceTs": "\"use client\";\n\nimport React, { useEffect, useRef } from 'react';\n\ninterface FuzzyTextProps {\n  children: React.ReactNode;\n  fontSize?: number | string;\n  fontWeight?: string | number;\n  fontFamily?: string;\n  color?: string;\n  enableHover?: boolean;\n  baseIntensity?: number;\n  hoverIntensity?: number;\n  fuzzRange?: number;\n  fps?: number;\n  direction?: 'horizontal' | 'vertical' | 'both';\n  transitionDuration?: number;\n  clickEffect?: boolean;\n  glitchMode?: boolean;\n  glitchInterval?: number;\n  glitchDuration?: number;\n  gradient?: string[] | null;\n  letterSpacing?: number;\n  className?: string;\n}\n\nexport const FuzzyText: React.FC<FuzzyTextProps> = ({\n  children,\n  fontSize = 'clamp(2rem, 8vw, 8rem)',\n  fontWeight = 900,\n  fontFamily = 'inherit',\n  color = '#fff',\n  enableHover = true,\n  baseIntensity = 0.18,\n  hoverIntensity = 0.5,\n  fuzzRange = 30,\n  fps = 60,\n  direction = 'horizontal',\n  transitionDuration = 0,\n  clickEffect = false,\n  glitchMode = false,\n  glitchInterval = 2000,\n  glitchDuration = 200,\n  gradient = null,\n  letterSpacing = 0,\n  className = ''\n}) => {\n  const canvasRef = useRef<HTMLCanvasElement & { cleanupFuzzyText?: () => void }>(null);\n\n  useEffect(() => {\n    let animationFrameId: number;\n    let isCancelled = false;\n    let glitchTimeoutId: ReturnType<typeof setTimeout>;\n    let glitchEndTimeoutId: ReturnType<typeof setTimeout>;\n    let clickTimeoutId: ReturnType<typeof setTimeout>;\n    const canvas = canvasRef.current;\n    if (!canvas) return;\n\n    const init = async () => {\n      const ctx = canvas.getContext('2d');\n      if (!ctx) return;\n\n      const computedFontFamily =\n        fontFamily === 'inherit' ? window.getComputedStyle(canvas).fontFamily || 'sans-serif' : fontFamily;\n\n      const fontSizeStr = typeof fontSize === 'number' ? `${fontSize}px` : fontSize;\n      const fontString = `${fontWeight} ${fontSizeStr} ${computedFontFamily}`;\n\n      try {\n        await document.fonts.load(fontString);\n      } catch {\n        await document.fonts.ready;\n      }\n      if (isCancelled) return;\n\n      let numericFontSize: number;\n      if (typeof fontSize === 'number') {\n        numericFontSize = fontSize;\n      } else {\n        const temp = document.createElement('span');\n        temp.style.fontSize = fontSize;\n        document.body.appendChild(temp);\n        const computedSize = window.getComputedStyle(temp).fontSize;\n        numericFontSize = parseFloat(computedSize);\n        document.body.removeChild(temp);\n      }\n\n      const text = React.Children.toArray(children).join('');\n\n      const offscreen = document.createElement('canvas');\n      const offCtx = offscreen.getContext('2d');\n      if (!offCtx) return;\n\n      offCtx.font = `${fontWeight} ${fontSizeStr} ${computedFontFamily}`;\n      offCtx.textBaseline = 'alphabetic';\n\n      let totalWidth = 0;\n      if (letterSpacing !== 0) {\n        for (const char of text) {\n          totalWidth += offCtx.measureText(char).width + letterSpacing;\n        }\n        totalWidth -= letterSpacing;\n      } else {\n        totalWidth = offCtx.measureText(text).width;\n      }\n\n      const metrics = offCtx.measureText(text);\n      const actualLeft = metrics.actualBoundingBoxLeft ?? 0;\n      const actualRight = letterSpacing !== 0 ? totalWidth : (metrics.actualBoundingBoxRight ?? metrics.width);\n      const actualAscent = metrics.actualBoundingBoxAscent ?? numericFontSize;\n      const actualDescent = metrics.actualBoundingBoxDescent ?? numericFontSize * 0.2;\n\n      const textBoundingWidth = Math.ceil(letterSpacing !== 0 ? totalWidth : actualLeft + actualRight);\n      const tightHeight = Math.ceil(actualAscent + actualDescent);\n\n      const extraWidthBuffer = 10;\n      const offscreenWidth = textBoundingWidth + extraWidthBuffer;\n\n      offscreen.width = offscreenWidth;\n      offscreen.height = tightHeight;\n\n      const xOffset = extraWidthBuffer / 2;\n      offCtx.font = `${fontWeight} ${fontSizeStr} ${computedFontFamily}`;\n      offCtx.textBaseline = 'alphabetic';\n\n      if (gradient && Array.isArray(gradient) && gradient.length >= 2) {\n        const grad = offCtx.createLinearGradient(0, 0, offscreenWidth, 0);\n        gradient.forEach((c, i) => grad.addColorStop(i / (gradient.length - 1), c));\n        offCtx.fillStyle = grad;\n      } else {\n        offCtx.fillStyle = color;\n      }\n\n      if (letterSpacing !== 0) {\n        let xPos = xOffset;\n        for (const char of text) {\n          offCtx.fillText(char, xPos, actualAscent);\n          xPos += offCtx.measureText(char).width + letterSpacing;\n        }\n      } else {\n        offCtx.fillText(text, xOffset - actualLeft, actualAscent);\n      }\n\n      const horizontalMargin = fuzzRange + 20;\n      const verticalMargin = direction === 'vertical' || direction === 'both' ? fuzzRange + 10 : 0;\n      canvas.width = offscreenWidth + horizontalMargin * 2;\n      canvas.height = tightHeight + verticalMargin * 2;\n      ctx.translate(horizontalMargin, verticalMargin);\n\n      const interactiveLeft = horizontalMargin + xOffset;\n      const interactiveTop = verticalMargin;\n      const interactiveRight = interactiveLeft + textBoundingWidth;\n      const interactiveBottom = interactiveTop + tightHeight;\n\n      let isHovering = false;\n      let isClicking = false;\n      let isGlitching = false;\n      let currentIntensity = baseIntensity;\n      let targetIntensity = baseIntensity;\n      let lastFrameTime = 0;\n      const frameDuration = 1000 / fps;\n\n      const startGlitchLoop = () => {\n        if (!glitchMode || isCancelled) return;\n        glitchTimeoutId = setTimeout(() => {\n          if (isCancelled) return;\n          isGlitching = true;\n          glitchEndTimeoutId = setTimeout(() => {\n            isGlitching = false;\n            startGlitchLoop();\n          }, glitchDuration);\n        }, glitchInterval);\n      };\n\n      if (glitchMode) startGlitchLoop();\n\n      const run = (timestamp: number) => {\n        if (isCancelled) return;\n\n        if (timestamp - lastFrameTime < frameDuration) {\n          animationFrameId = window.requestAnimationFrame(run);\n          return;\n        }\n        lastFrameTime = timestamp;\n\n        ctx.clearRect(\n          -fuzzRange - 20,\n          -fuzzRange - 10,\n          offscreenWidth + 2 * (fuzzRange + 20),\n          tightHeight + 2 * (fuzzRange + 10)\n        );\n\n        if (isClicking) {\n          targetIntensity = 1;\n        } else if (isGlitching) {\n          targetIntensity = 1;\n        } else if (isHovering) {\n          targetIntensity = hoverIntensity;\n        } else {\n          targetIntensity = baseIntensity;\n        }\n\n        if (transitionDuration > 0) {\n          const step = 1 / (transitionDuration / frameDuration);\n          if (currentIntensity < targetIntensity) {\n            currentIntensity = Math.min(currentIntensity + step, targetIntensity);\n          } else if (currentIntensity > targetIntensity) {\n            currentIntensity = Math.max(currentIntensity - step, targetIntensity);\n          }\n        } else {\n          currentIntensity = targetIntensity;\n        }\n\n        for (let j = 0; j < tightHeight; j++) {\n          let dx = 0,\n            dy = 0;\n          if (direction === 'horizontal' || direction === 'both') {\n            dx = Math.floor(currentIntensity * (Math.random() - 0.5) * fuzzRange);\n          }\n          if (direction === 'vertical' || direction === 'both') {\n            dy = Math.floor(currentIntensity * (Math.random() - 0.5) * fuzzRange * 0.5);\n          }\n          ctx.drawImage(offscreen, 0, j, offscreenWidth, 1, dx, j + dy, offscreenWidth, 1);\n        }\n        animationFrameId = window.requestAnimationFrame(run);\n      };\n\n      animationFrameId = window.requestAnimationFrame(run);\n\n      const isInsideTextArea = (x: number, y: number) =>\n        x >= interactiveLeft && x <= interactiveRight && y >= interactiveTop && y <= interactiveBottom;\n\n      const handleMouseMove = (e: MouseEvent) => {\n        if (!enableHover) return;\n        const rect = canvas.getBoundingClientRect();\n        const scaleX = canvas.width / (rect.width || 1);\n        const scaleY = canvas.height / (rect.height || 1);\n        const x = (e.clientX - rect.left) * scaleX;\n        const y = (e.clientY - rect.top) * scaleY;\n        isHovering = isInsideTextArea(x, y);\n      };\n\n      const handleMouseLeave = () => {\n        isHovering = false;\n      };\n\n      const handleClick = () => {\n        if (!clickEffect) return;\n        isClicking = true;\n        clearTimeout(clickTimeoutId);\n        clickTimeoutId = setTimeout(() => {\n          isClicking = false;\n        }, 150);\n      };\n\n      const handleTouchMove = (e: TouchEvent) => {\n        if (!enableHover) return;\n        e.preventDefault();\n        const rect = canvas.getBoundingClientRect();\n        const touch = e.touches[0];\n        const scaleX = canvas.width / (rect.width || 1);\n        const scaleY = canvas.height / (rect.height || 1);\n        const x = (touch.clientX - rect.left) * scaleX;\n        const y = (touch.clientY - rect.top) * scaleY;\n        isHovering = isInsideTextArea(x, y);\n      };\n\n      const handleTouchEnd = () => {\n        isHovering = false;\n      };\n\n      if (enableHover) {\n        canvas.addEventListener('mousemove', handleMouseMove);\n        canvas.addEventListener('mouseleave', handleMouseLeave);\n        canvas.addEventListener('touchmove', handleTouchMove, { passive: false });\n        canvas.addEventListener('touchend', handleTouchEnd);\n      }\n\n      if (clickEffect) {\n        canvas.addEventListener('click', handleClick);\n      }\n\n      const cleanup = () => {\n        window.cancelAnimationFrame(animationFrameId);\n        clearTimeout(glitchTimeoutId);\n        clearTimeout(glitchEndTimeoutId);\n        clearTimeout(clickTimeoutId);\n        if (enableHover) {\n          canvas.removeEventListener('mousemove', handleMouseMove);\n          canvas.removeEventListener('mouseleave', handleMouseLeave);\n          canvas.removeEventListener('touchmove', handleTouchMove);\n          canvas.removeEventListener('touchend', handleTouchEnd);\n        }\n        if (clickEffect) {\n          canvas.removeEventListener('click', handleClick);\n        }\n      };\n\n      canvas.cleanupFuzzyText = cleanup;\n    };\n\n    init();\n\n    return () => {\n      isCancelled = true;\n      window.cancelAnimationFrame(animationFrameId);\n      clearTimeout(glitchTimeoutId);\n      clearTimeout(glitchEndTimeoutId);\n      clearTimeout(clickTimeoutId);\n      if (canvas && canvas.cleanupFuzzyText) {\n        canvas.cleanupFuzzyText();\n      }\n    };\n  }, [\n    children,\n    fontSize,\n    fontWeight,\n    fontFamily,\n    color,\n    enableHover,\n    baseIntensity,\n    hoverIntensity,\n    fuzzRange,\n    fps,\n    direction,\n    transitionDuration,\n    clickEffect,\n    glitchMode,\n    glitchInterval,\n    glitchDuration,\n    gradient,\n    letterSpacing\n  ]);\n\n  return <canvas ref={canvasRef} className={`max-w-full h-auto cursor-pointer ${className}`} />;\n};\n\nexport default FuzzyText;",
    "componentSourceJs": "\"use client\";\nimport React, { useEffect, useRef } from 'react';\nexport const FuzzyText = ({ children, fontSize = 'clamp(2rem, 8vw, 8rem)', fontWeight = 900, fontFamily = 'inherit', color = '#fff', enableHover = true, baseIntensity = 0.18, hoverIntensity = 0.5, fuzzRange = 30, fps = 60, direction = 'horizontal', transitionDuration = 0, clickEffect = false, glitchMode = false, glitchInterval = 2000, glitchDuration = 200, gradient = null, letterSpacing = 0, className = '' }) => {\n    const canvasRef = useRef(null);\n    useEffect(() => {\n        let animationFrameId;\n        let isCancelled = false;\n        let glitchTimeoutId;\n        let glitchEndTimeoutId;\n        let clickTimeoutId;\n        const canvas = canvasRef.current;\n        if (!canvas)\n            return;\n        const init = async () => {\n            const ctx = canvas.getContext('2d');\n            if (!ctx)\n                return;\n            const computedFontFamily = fontFamily === 'inherit' ? window.getComputedStyle(canvas).fontFamily || 'sans-serif' : fontFamily;\n            const fontSizeStr = typeof fontSize === 'number' ? `${fontSize}px` : fontSize;\n            const fontString = `${fontWeight} ${fontSizeStr} ${computedFontFamily}`;\n            try {\n                await document.fonts.load(fontString);\n            }\n            catch {\n                await document.fonts.ready;\n            }\n            if (isCancelled)\n                return;\n            let numericFontSize;\n            if (typeof fontSize === 'number') {\n                numericFontSize = fontSize;\n            }\n            else {\n                const temp = document.createElement('span');\n                temp.style.fontSize = fontSize;\n                document.body.appendChild(temp);\n                const computedSize = window.getComputedStyle(temp).fontSize;\n                numericFontSize = parseFloat(computedSize);\n                document.body.removeChild(temp);\n            }\n            const text = React.Children.toArray(children).join('');\n            const offscreen = document.createElement('canvas');\n            const offCtx = offscreen.getContext('2d');\n            if (!offCtx)\n                return;\n            offCtx.font = `${fontWeight} ${fontSizeStr} ${computedFontFamily}`;\n            offCtx.textBaseline = 'alphabetic';\n            let totalWidth = 0;\n            if (letterSpacing !== 0) {\n                for (const char of text) {\n                    totalWidth += offCtx.measureText(char).width + letterSpacing;\n                }\n                totalWidth -= letterSpacing;\n            }\n            else {\n                totalWidth = offCtx.measureText(text).width;\n            }\n            const metrics = offCtx.measureText(text);\n            const actualLeft = metrics.actualBoundingBoxLeft ?? 0;\n            const actualRight = letterSpacing !== 0 ? totalWidth : (metrics.actualBoundingBoxRight ?? metrics.width);\n            const actualAscent = metrics.actualBoundingBoxAscent ?? numericFontSize;\n            const actualDescent = metrics.actualBoundingBoxDescent ?? numericFontSize * 0.2;\n            const textBoundingWidth = Math.ceil(letterSpacing !== 0 ? totalWidth : actualLeft + actualRight);\n            const tightHeight = Math.ceil(actualAscent + actualDescent);\n            const extraWidthBuffer = 10;\n            const offscreenWidth = textBoundingWidth + extraWidthBuffer;\n            offscreen.width = offscreenWidth;\n            offscreen.height = tightHeight;\n            const xOffset = extraWidthBuffer / 2;\n            offCtx.font = `${fontWeight} ${fontSizeStr} ${computedFontFamily}`;\n            offCtx.textBaseline = 'alphabetic';\n            if (gradient && Array.isArray(gradient) && gradient.length >= 2) {\n                const grad = offCtx.createLinearGradient(0, 0, offscreenWidth, 0);\n                gradient.forEach((c, i) => grad.addColorStop(i / (gradient.length - 1), c));\n                offCtx.fillStyle = grad;\n            }\n            else {\n                offCtx.fillStyle = color;\n            }\n            if (letterSpacing !== 0) {\n                let xPos = xOffset;\n                for (const char of text) {\n                    offCtx.fillText(char, xPos, actualAscent);\n                    xPos += offCtx.measureText(char).width + letterSpacing;\n                }\n            }\n            else {\n                offCtx.fillText(text, xOffset - actualLeft, actualAscent);\n            }\n            const horizontalMargin = fuzzRange + 20;\n            const verticalMargin = direction === 'vertical' || direction === 'both' ? fuzzRange + 10 : 0;\n            canvas.width = offscreenWidth + horizontalMargin * 2;\n            canvas.height = tightHeight + verticalMargin * 2;\n            ctx.translate(horizontalMargin, verticalMargin);\n            const interactiveLeft = horizontalMargin + xOffset;\n            const interactiveTop = verticalMargin;\n            const interactiveRight = interactiveLeft + textBoundingWidth;\n            const interactiveBottom = interactiveTop + tightHeight;\n            let isHovering = false;\n            let isClicking = false;\n            let isGlitching = false;\n            let currentIntensity = baseIntensity;\n            let targetIntensity = baseIntensity;\n            let lastFrameTime = 0;\n            const frameDuration = 1000 / fps;\n            const startGlitchLoop = () => {\n                if (!glitchMode || isCancelled)\n                    return;\n                glitchTimeoutId = setTimeout(() => {\n                    if (isCancelled)\n                        return;\n                    isGlitching = true;\n                    glitchEndTimeoutId = setTimeout(() => {\n                        isGlitching = false;\n                        startGlitchLoop();\n                    }, glitchDuration);\n                }, glitchInterval);\n            };\n            if (glitchMode)\n                startGlitchLoop();\n            const run = (timestamp) => {\n                if (isCancelled)\n                    return;\n                if (timestamp - lastFrameTime < frameDuration) {\n                    animationFrameId = window.requestAnimationFrame(run);\n                    return;\n                }\n                lastFrameTime = timestamp;\n                ctx.clearRect(-fuzzRange - 20, -fuzzRange - 10, offscreenWidth + 2 * (fuzzRange + 20), tightHeight + 2 * (fuzzRange + 10));\n                if (isClicking) {\n                    targetIntensity = 1;\n                }\n                else if (isGlitching) {\n                    targetIntensity = 1;\n                }\n                else if (isHovering) {\n                    targetIntensity = hoverIntensity;\n                }\n                else {\n                    targetIntensity = baseIntensity;\n                }\n                if (transitionDuration > 0) {\n                    const step = 1 / (transitionDuration / frameDuration);\n                    if (currentIntensity < targetIntensity) {\n                        currentIntensity = Math.min(currentIntensity + step, targetIntensity);\n                    }\n                    else if (currentIntensity > targetIntensity) {\n                        currentIntensity = Math.max(currentIntensity - step, targetIntensity);\n                    }\n                }\n                else {\n                    currentIntensity = targetIntensity;\n                }\n                for (let j = 0; j < tightHeight; j++) {\n                    let dx = 0, dy = 0;\n                    if (direction === 'horizontal' || direction === 'both') {\n                        dx = Math.floor(currentIntensity * (Math.random() - 0.5) * fuzzRange);\n                    }\n                    if (direction === 'vertical' || direction === 'both') {\n                        dy = Math.floor(currentIntensity * (Math.random() - 0.5) * fuzzRange * 0.5);\n                    }\n                    ctx.drawImage(offscreen, 0, j, offscreenWidth, 1, dx, j + dy, offscreenWidth, 1);\n                }\n                animationFrameId = window.requestAnimationFrame(run);\n            };\n            animationFrameId = window.requestAnimationFrame(run);\n            const isInsideTextArea = (x, y) => x >= interactiveLeft && x <= interactiveRight && y >= interactiveTop && y <= interactiveBottom;\n            const handleMouseMove = (e) => {\n                if (!enableHover)\n                    return;\n                const rect = canvas.getBoundingClientRect();\n                const scaleX = canvas.width / (rect.width || 1);\n                const scaleY = canvas.height / (rect.height || 1);\n                const x = (e.clientX - rect.left) * scaleX;\n                const y = (e.clientY - rect.top) * scaleY;\n                isHovering = isInsideTextArea(x, y);\n            };\n            const handleMouseLeave = () => {\n                isHovering = false;\n            };\n            const handleClick = () => {\n                if (!clickEffect)\n                    return;\n                isClicking = true;\n                clearTimeout(clickTimeoutId);\n                clickTimeoutId = setTimeout(() => {\n                    isClicking = false;\n                }, 150);\n            };\n            const handleTouchMove = (e) => {\n                if (!enableHover)\n                    return;\n                e.preventDefault();\n                const rect = canvas.getBoundingClientRect();\n                const touch = e.touches[0];\n                const scaleX = canvas.width / (rect.width || 1);\n                const scaleY = canvas.height / (rect.height || 1);\n                const x = (touch.clientX - rect.left) * scaleX;\n                const y = (touch.clientY - rect.top) * scaleY;\n                isHovering = isInsideTextArea(x, y);\n            };\n            const handleTouchEnd = () => {\n                isHovering = false;\n            };\n            if (enableHover) {\n                canvas.addEventListener('mousemove', handleMouseMove);\n                canvas.addEventListener('mouseleave', handleMouseLeave);\n                canvas.addEventListener('touchmove', handleTouchMove, { passive: false });\n                canvas.addEventListener('touchend', handleTouchEnd);\n            }\n            if (clickEffect) {\n                canvas.addEventListener('click', handleClick);\n            }\n            const cleanup = () => {\n                window.cancelAnimationFrame(animationFrameId);\n                clearTimeout(glitchTimeoutId);\n                clearTimeout(glitchEndTimeoutId);\n                clearTimeout(clickTimeoutId);\n                if (enableHover) {\n                    canvas.removeEventListener('mousemove', handleMouseMove);\n                    canvas.removeEventListener('mouseleave', handleMouseLeave);\n                    canvas.removeEventListener('touchmove', handleTouchMove);\n                    canvas.removeEventListener('touchend', handleTouchEnd);\n                }\n                if (clickEffect) {\n                    canvas.removeEventListener('click', handleClick);\n                }\n            };\n            canvas.cleanupFuzzyText = cleanup;\n        };\n        init();\n        return () => {\n            isCancelled = true;\n            window.cancelAnimationFrame(animationFrameId);\n            clearTimeout(glitchTimeoutId);\n            clearTimeout(glitchEndTimeoutId);\n            clearTimeout(clickTimeoutId);\n            if (canvas && canvas.cleanupFuzzyText) {\n                canvas.cleanupFuzzyText();\n            }\n        };\n    }, [\n        children,\n        fontSize,\n        fontWeight,\n        fontFamily,\n        color,\n        enableHover,\n        baseIntensity,\n        hoverIntensity,\n        fuzzRange,\n        fps,\n        direction,\n        transitionDuration,\n        clickEffect,\n        glitchMode,\n        glitchInterval,\n        glitchDuration,\n        gradient,\n        letterSpacing\n    ]);\n    return <canvas ref={canvasRef} className={`max-w-full h-auto cursor-pointer ${className}`}/>;\n};\nexport default FuzzyText;",
    "props": [
      {
        "name": "children",
        "type": "React.ReactNode",
        "default": "-",
        "description": "Child elements or content to render inside the component."
      },
      {
        "name": "fontSize",
        "type": "number | string",
        "default": "'clamp(2rem, 8vw, 8rem)'",
        "description": "Font size in pixels, rems, or fluid clamp notation."
      },
      {
        "name": "fontWeight",
        "type": "string | number",
        "default": "900",
        "description": "Font weight (e.g., 400, 700, 900, 'bold')."
      },
      {
        "name": "fontFamily",
        "type": "string",
        "default": "'inherit'",
        "description": "Custom font family to apply to the rendered typography."
      },
      {
        "name": "color",
        "type": "string",
        "default": "'#fff'",
        "description": "Text or primary fill color."
      },
      {
        "name": "enableHover",
        "type": "boolean",
        "default": "true",
        "description": "Whether hovering over the element triggers or alters the animation."
      },
      {
        "name": "baseIntensity",
        "type": "number",
        "default": "0.18",
        "description": "Resting distortion or animation intensity (0 to 1)."
      },
      {
        "name": "hoverIntensity",
        "type": "number",
        "default": "0.5",
        "description": "Peak animation intensity when hovered (0 to 1)."
      },
      {
        "name": "fuzzRange",
        "type": "number",
        "default": "30",
        "description": "Controls the fuzz range for the component animation."
      },
      {
        "name": "fps",
        "type": "number",
        "default": "60",
        "description": "Controls the fps for the component animation."
      },
      {
        "name": "direction",
        "type": "'horizontal' | 'vertical' | 'both'",
        "default": "'horizontal'",
        "description": "Direction of movement (e.g., 'top', 'bottom', 'left', 'right')."
      },
      {
        "name": "transitionDuration",
        "type": "number",
        "default": "0",
        "description": "Controls the transition duration for the component animation."
      },
      {
        "name": "clickEffect",
        "type": "boolean",
        "default": "false",
        "description": "Controls the click effect for the component animation."
      },
      {
        "name": "glitchMode",
        "type": "boolean",
        "default": "false",
        "description": "Controls the glitch mode for the component animation."
      },
      {
        "name": "glitchInterval",
        "type": "number",
        "default": "2000",
        "description": "Controls the glitch interval for the component animation."
      },
      {
        "name": "glitchDuration",
        "type": "number",
        "default": "200",
        "description": "Controls the glitch duration for the component animation."
      },
      {
        "name": "gradient",
        "type": "string[] | null",
        "default": "null",
        "description": "Controls the gradient for the component animation."
      },
      {
        "name": "letterSpacing",
        "type": "number",
        "default": "0",
        "description": "Controls the letter spacing for the component animation."
      },
      {
        "name": "className",
        "type": "string",
        "default": "''",
        "description": "Additional CSS classes for styling and layout."
      }
    ]
  },
  "glitch-text": {
    "slug": "glitch-text",
    "name": "Glitch Text",
    "description": "High-energy cybernetic RGB chromatic aberration glitch animation with slice displacement and scanline effects.",
    "dependencies": {},
    "installation": {
      "cliTs": "npx kibo add glitch-text",
      "cliJs": "npx kibo add glitch-text --js",
      "npm": "npx kibo add glitch-text",
      "pnpm": "pnpm dlx kibo add glitch-text",
      "yarn": "yarn add glitch-text",
      "bun": "bunx kibo add glitch-text"
    },
    "usageTs": "import { GlitchText } from \"@/components/kibo/glitch-text/component\";\n\nexport default function Example() {\n  return (\n    <GlitchText />\n  );\n}",
    "usageJs": "import { GlitchText } from \"@/components/kibo/glitch-text/component\";\nexport default function Example() {\n    return (<GlitchText />);\n}",
    "componentSourceTs": "\"use client\";\n\nimport { type FC, type CSSProperties } from 'react';\n\ninterface GlitchTextProps {\n  children: string;\n  speed?: number;\n  enableShadows?: boolean;\n  enableOnHover?: boolean;\n  className?: string;\n}\n\ninterface CustomCSSProperties extends CSSProperties {\n  '--after-duration': string;\n  '--before-duration': string;\n  '--after-shadow': string;\n  '--before-shadow': string;\n}\n\nexport const GlitchText: FC<GlitchTextProps> = ({\n  children,\n  speed = 0.5,\n  enableShadows = true,\n  enableOnHover = false,\n  className = ''\n}) => {\n  const inlineStyles: CustomCSSProperties = {\n    '--after-duration': `${speed * 3}s`,\n    '--before-duration': `${speed * 2}s`,\n    '--after-shadow': enableShadows ? '-5px 0 red' : 'none',\n    '--before-shadow': enableShadows ? '5px 0 cyan' : 'none'\n  };\n\n  const baseClasses = 'text-white text-[clamp(2rem,10vw,8rem)] font-black relative mx-auto select-none cursor-pointer';\n\n  const pseudoClasses = !enableOnHover\n    ? 'after:content-[attr(data-text)] after:absolute after:top-0 after:left-[10px] after:text-white after:bg-[#120F17] after:overflow-hidden after:[clip-path:inset(0_0_0_0)] after:[text-shadow:var(--after-shadow)] after:animate-glitch-after ' +\n      'before:content-[attr(data-text)] before:absolute before:top-0 before:left-[-10px] before:text-white before:bg-[#120F17] before:overflow-hidden before:[clip-path:inset(0_0_0_0)] before:[text-shadow:var(--before-shadow)] before:animate-glitch-before'\n    : \"after:content-[''] after:absolute after:top-0 after:left-[10px] after:text-white after:bg-[#120F17] after:overflow-hidden after:[clip-path:inset(0_0_0_0)] after:opacity-0 \" +\n      \"before:content-[''] before:absolute before:top-0 before:left-[-10px] before:text-white before:bg-[#120F17] before:overflow-hidden before:[clip-path:inset(0_0_0_0)] before:opacity-0 \" +\n      'hover:after:content-[attr(data-text)] hover:after:opacity-100 hover:after:[text-shadow:var(--after-shadow)] hover:after:animate-glitch-after ' +\n      'hover:before:content-[attr(data-text)] hover:before:opacity-100 hover:before:[text-shadow:var(--before-shadow)] hover:before:animate-glitch-before';\n\n  const combinedClasses = `${baseClasses} ${pseudoClasses} ${className}`;\n\n  return (\n    <div style={inlineStyles} data-text={children} className={combinedClasses}>\n      {children}\n    </div>\n  );\n};\n\nexport default GlitchText;\n\n// tailwind.config.js\n// module.exports = {\n//   theme: {\n//     extend: {\n//       keyframes: {\n//         glitch: {\n//           \"0%\": { \"clip-path\": \"inset(20% 0 50% 0)\" },\n//           \"5%\": { \"clip-path\": \"inset(10% 0 60% 0)\" },\n//           \"10%\": { \"clip-path\": \"inset(15% 0 55% 0)\" },\n//           \"15%\": { \"clip-path\": \"inset(25% 0 35% 0)\" },\n//           \"20%\": { \"clip-path\": \"inset(30% 0 40% 0)\" },\n//           \"25%\": { \"clip-path\": \"inset(40% 0 20% 0)\" },\n//           \"30%\": { \"clip-path\": \"inset(10% 0 60% 0)\" },\n//           \"35%\": { \"clip-path\": \"inset(15% 0 55% 0)\" },\n//           \"40%\": { \"clip-path\": \"inset(25% 0 35% 0)\" },\n//           \"45%\": { \"clip-path\": \"inset(30% 0 40% 0)\" },\n//           \"50%\": { \"clip-path\": \"inset(20% 0 50% 0)\" },\n//           \"55%\": { \"clip-path\": \"inset(10% 0 60% 0)\" },\n//           \"60%\": { \"clip-path\": \"inset(15% 0 55% 0)\" },\n//           \"65%\": { \"clip-path\": \"inset(25% 0 35% 0)\" },\n//           \"70%\": { \"clip-path\": \"inset(30% 0 40% 0)\" },\n//           \"75%\": { \"clip-path\": \"inset(40% 0 20% 0)\" },\n//           \"80%\": { \"clip-path\": \"inset(20% 0 50% 0)\" },\n//           \"85%\": { \"clip-path\": \"inset(10% 0 60% 0)\" },\n//           \"90%\": { \"clip-path\": \"inset(15% 0 55% 0)\" },\n//           \"95%\": { \"clip-path\": \"inset(25% 0 35% 0)\" },\n//           \"100%\": { \"clip-path\": \"inset(30% 0 40% 0)\" },\n//         },\n//       },\n//       animation: {\n//         \"glitch-after\": \"glitch var(--after-duration) infinite linear alternate-reverse\",\n//         \"glitch-before\": \"glitch var(--before-duration) infinite linear alternate-reverse\",\n//       },\n//     },\n//   },\n//   plugins: [],\n// };",
    "componentSourceJs": "\"use client\";\nexport const GlitchText = ({ children, speed = 0.5, enableShadows = true, enableOnHover = false, className = '' }) => {\n    const inlineStyles = {\n        '--after-duration': `${speed * 3}s`,\n        '--before-duration': `${speed * 2}s`,\n        '--after-shadow': enableShadows ? '-5px 0 red' : 'none',\n        '--before-shadow': enableShadows ? '5px 0 cyan' : 'none'\n    };\n    const baseClasses = 'text-white text-[clamp(2rem,10vw,8rem)] font-black relative mx-auto select-none cursor-pointer';\n    const pseudoClasses = !enableOnHover\n        ? 'after:content-[attr(data-text)] after:absolute after:top-0 after:left-[10px] after:text-white after:bg-[#120F17] after:overflow-hidden after:[clip-path:inset(0_0_0_0)] after:[text-shadow:var(--after-shadow)] after:animate-glitch-after ' +\n            'before:content-[attr(data-text)] before:absolute before:top-0 before:left-[-10px] before:text-white before:bg-[#120F17] before:overflow-hidden before:[clip-path:inset(0_0_0_0)] before:[text-shadow:var(--before-shadow)] before:animate-glitch-before'\n        : \"after:content-[''] after:absolute after:top-0 after:left-[10px] after:text-white after:bg-[#120F17] after:overflow-hidden after:[clip-path:inset(0_0_0_0)] after:opacity-0 \" +\n            \"before:content-[''] before:absolute before:top-0 before:left-[-10px] before:text-white before:bg-[#120F17] before:overflow-hidden before:[clip-path:inset(0_0_0_0)] before:opacity-0 \" +\n            'hover:after:content-[attr(data-text)] hover:after:opacity-100 hover:after:[text-shadow:var(--after-shadow)] hover:after:animate-glitch-after ' +\n            'hover:before:content-[attr(data-text)] hover:before:opacity-100 hover:before:[text-shadow:var(--before-shadow)] hover:before:animate-glitch-before';\n    const combinedClasses = `${baseClasses} ${pseudoClasses} ${className}`;\n    return (<div style={inlineStyles} data-text={children} className={combinedClasses}>\n      {children}\n    </div>);\n};\nexport default GlitchText;",
    "props": [
      {
        "name": "children",
        "type": "string",
        "default": "-",
        "description": "Child elements or content to render inside the component."
      },
      {
        "name": "speed",
        "type": "number",
        "default": "0.5",
        "description": "Speed multiplier for the motion playback."
      },
      {
        "name": "enableShadows",
        "type": "boolean",
        "default": "true",
        "description": "Controls the enable shadows for the component animation."
      },
      {
        "name": "enableOnHover",
        "type": "boolean",
        "default": "false",
        "description": "Controls the enable on hover for the component animation."
      },
      {
        "name": "className",
        "type": "string",
        "default": "''",
        "description": "Additional CSS classes for styling and layout."
      }
    ]
  },
  "gradient-text": {
    "slug": "gradient-text",
    "name": "Gradient Text",
    "description": "Silky multi-color gradient background sweep traveling continuously across typography with custom speeds and angles.",
    "dependencies": {
      "motion": "^12.23.12"
    },
    "installation": {
      "cliTs": "npx kibo add gradient-text",
      "cliJs": "npx kibo add gradient-text --js",
      "npm": "npm i motion",
      "pnpm": "pnpm add motion",
      "yarn": "yarn add motion",
      "bun": "bun add motion"
    },
    "usageTs": "import { GradientText } from \"@/components/kibo/gradient-text/component\";\n\nexport default function Example() {\n  return (\n    <GradientText />\n  );\n}",
    "usageJs": "import { GradientText } from \"@/components/kibo/gradient-text/component\";\nexport default function Example() {\n    return (<GradientText />);\n}",
    "componentSourceTs": "\"use client\";\n\nimport { useState, useCallback, useEffect, useRef, type ReactNode } from 'react';\nimport { motion, useMotionValue, useAnimationFrame, useTransform } from 'motion/react';\n\ninterface GradientTextProps {\n  children: ReactNode;\n  className?: string;\n  colors?: string[];\n  animationSpeed?: number;\n  showBorder?: boolean;\n  direction?: 'horizontal' | 'vertical' | 'diagonal';\n  pauseOnHover?: boolean;\n  yoyo?: boolean;\n}\n\nexport function GradientText({\n  children,\n  className = '',\n  colors = ['#5227FF', '#FF9FFC', '#B497CF'],\n  animationSpeed = 8,\n  showBorder = false,\n  direction = 'horizontal',\n  pauseOnHover = false,\n  yoyo = true\n}: GradientTextProps) {\n  const [isPaused, setIsPaused] = useState(false);\n  const progress = useMotionValue(0);\n  const elapsedRef = useRef(0);\n  const lastTimeRef = useRef<number | null>(null);\n\n  const animationDuration = animationSpeed * 1000;\n\n  useAnimationFrame(time => {\n    if (isPaused) {\n      lastTimeRef.current = null;\n      return;\n    }\n\n    if (lastTimeRef.current === null) {\n      lastTimeRef.current = time;\n      return;\n    }\n\n    const deltaTime = time - lastTimeRef.current;\n    lastTimeRef.current = time;\n    elapsedRef.current += deltaTime;\n\n    if (yoyo) {\n      const fullCycle = animationDuration * 2;\n      const cycleTime = elapsedRef.current % fullCycle;\n\n      if (cycleTime < animationDuration) {\n        progress.set((cycleTime / animationDuration) * 100);\n      } else {\n        progress.set(100 - ((cycleTime - animationDuration) / animationDuration) * 100);\n      }\n    } else {\n      // Continuously increase position for seamless looping\n      progress.set((elapsedRef.current / animationDuration) * 100);\n    }\n  });\n\n  useEffect(() => {\n    elapsedRef.current = 0;\n    progress.set(0);\n  }, [animationSpeed, yoyo]);\n\n  const backgroundPosition = useTransform(progress, p => {\n    if (direction === 'horizontal') {\n      return `${p}% 50%`;\n    } else if (direction === 'vertical') {\n      return `50% ${p}%`;\n    } else {\n      // For diagonal, move only horizontally to avoid interference patterns\n      return `${p}% 50%`;\n    }\n  });\n\n  const handleMouseEnter = useCallback(() => {\n    if (pauseOnHover) setIsPaused(true);\n  }, [pauseOnHover]);\n\n  const handleMouseLeave = useCallback(() => {\n    if (pauseOnHover) setIsPaused(false);\n  }, [pauseOnHover]);\n\n  const gradientAngle =\n    direction === 'horizontal' ? 'to right' : direction === 'vertical' ? 'to bottom' : 'to bottom right';\n  // Duplicate first color at the end for seamless looping\n  const gradientColors = [...colors, colors[0]].join(', ');\n\n  const gradientStyle = {\n    backgroundImage: `linear-gradient(${gradientAngle}, ${gradientColors})`,\n    backgroundSize: direction === 'horizontal' ? '300% 100%' : direction === 'vertical' ? '100% 300%' : '300% 300%',\n    backgroundRepeat: 'repeat'\n  };\n\n  return (\n    <motion.div\n      className={`relative mx-auto flex max-w-fit flex-row items-center justify-center rounded-[1.25rem] font-medium backdrop-blur transition-shadow duration-500 overflow-hidden cursor-pointer ${showBorder ? 'py-1 px-2' : ''} ${className}`}\n      onMouseEnter={handleMouseEnter}\n      onMouseLeave={handleMouseLeave}\n    >\n      {showBorder && (\n        <motion.div\n          className=\"absolute inset-0 z-0 pointer-events-none rounded-[1.25rem]\"\n          style={{ ...gradientStyle, backgroundPosition }}\n        >\n          <div\n            className=\"absolute bg-black rounded-[1.25rem] z-[-1]\"\n            style={{\n              width: 'calc(100% - 2px)',\n              height: 'calc(100% - 2px)',\n              left: '50%',\n              top: '50%',\n              transform: 'translate(-50%, -50%)'\n            }}\n          />\n        </motion.div>\n      )}\n      <motion.div\n        className=\"inline-block relative z-2 text-transparent bg-clip-text\"\n        style={{ ...gradientStyle, backgroundPosition, WebkitBackgroundClip: 'text' }}\n      >\n        {children}\n      </motion.div>\n    </motion.div>\n  );\n}\nexport default GradientText;\n",
    "componentSourceJs": "\"use client\";\nimport { useState, useCallback, useEffect, useRef } from 'react';\nimport { motion, useMotionValue, useAnimationFrame, useTransform } from 'motion/react';\nexport function GradientText({ children, className = '', colors = ['#5227FF', '#FF9FFC', '#B497CF'], animationSpeed = 8, showBorder = false, direction = 'horizontal', pauseOnHover = false, yoyo = true }) {\n    const [isPaused, setIsPaused] = useState(false);\n    const progress = useMotionValue(0);\n    const elapsedRef = useRef(0);\n    const lastTimeRef = useRef(null);\n    const animationDuration = animationSpeed * 1000;\n    useAnimationFrame(time => {\n        if (isPaused) {\n            lastTimeRef.current = null;\n            return;\n        }\n        if (lastTimeRef.current === null) {\n            lastTimeRef.current = time;\n            return;\n        }\n        const deltaTime = time - lastTimeRef.current;\n        lastTimeRef.current = time;\n        elapsedRef.current += deltaTime;\n        if (yoyo) {\n            const fullCycle = animationDuration * 2;\n            const cycleTime = elapsedRef.current % fullCycle;\n            if (cycleTime < animationDuration) {\n                progress.set((cycleTime / animationDuration) * 100);\n            }\n            else {\n                progress.set(100 - ((cycleTime - animationDuration) / animationDuration) * 100);\n            }\n        }\n        else {\n            // Continuously increase position for seamless looping\n            progress.set((elapsedRef.current / animationDuration) * 100);\n        }\n    });\n    useEffect(() => {\n        elapsedRef.current = 0;\n        progress.set(0);\n    }, [animationSpeed, yoyo]);\n    const backgroundPosition = useTransform(progress, p => {\n        if (direction === 'horizontal') {\n            return `${p}% 50%`;\n        }\n        else if (direction === 'vertical') {\n            return `50% ${p}%`;\n        }\n        else {\n            // For diagonal, move only horizontally to avoid interference patterns\n            return `${p}% 50%`;\n        }\n    });\n    const handleMouseEnter = useCallback(() => {\n        if (pauseOnHover)\n            setIsPaused(true);\n    }, [pauseOnHover]);\n    const handleMouseLeave = useCallback(() => {\n        if (pauseOnHover)\n            setIsPaused(false);\n    }, [pauseOnHover]);\n    const gradientAngle = direction === 'horizontal' ? 'to right' : direction === 'vertical' ? 'to bottom' : 'to bottom right';\n    // Duplicate first color at the end for seamless looping\n    const gradientColors = [...colors, colors[0]].join(', ');\n    const gradientStyle = {\n        backgroundImage: `linear-gradient(${gradientAngle}, ${gradientColors})`,\n        backgroundSize: direction === 'horizontal' ? '300% 100%' : direction === 'vertical' ? '100% 300%' : '300% 300%',\n        backgroundRepeat: 'repeat'\n    };\n    return (<motion.div className={`relative mx-auto flex max-w-fit flex-row items-center justify-center rounded-[1.25rem] font-medium backdrop-blur transition-shadow duration-500 overflow-hidden cursor-pointer ${showBorder ? 'py-1 px-2' : ''} ${className}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>\n      {showBorder && (<motion.div className=\"absolute inset-0 z-0 pointer-events-none rounded-[1.25rem]\" style={{ ...gradientStyle, backgroundPosition }}>\n          <div className=\"absolute bg-black rounded-[1.25rem] z-[-1]\" style={{\n                width: 'calc(100% - 2px)',\n                height: 'calc(100% - 2px)',\n                left: '50%',\n                top: '50%',\n                transform: 'translate(-50%, -50%)'\n            }}/>\n        </motion.div>)}\n      <motion.div className=\"inline-block relative z-2 text-transparent bg-clip-text\" style={{ ...gradientStyle, backgroundPosition, WebkitBackgroundClip: 'text' }}>\n        {children}\n      </motion.div>\n    </motion.div>);\n}\nexport default GradientText;",
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "default": "-",
        "description": "Child elements or content to render inside the component."
      },
      {
        "name": "className",
        "type": "string",
        "default": "''",
        "description": "Additional CSS classes for styling and layout."
      },
      {
        "name": "colors",
        "type": "string[]",
        "default": "['#5227FF', '#FF9FFC', '#B497CF']",
        "description": "Controls the colors for the component animation."
      },
      {
        "name": "animationSpeed",
        "type": "number",
        "default": "8",
        "description": "Controls the animation speed for the component animation."
      },
      {
        "name": "showBorder",
        "type": "boolean",
        "default": "false",
        "description": "Controls the show border for the component animation."
      },
      {
        "name": "direction",
        "type": "'horizontal' | 'vertical' | 'diagonal'",
        "default": "'horizontal'",
        "description": "Direction of movement (e.g., 'top', 'bottom', 'left', 'right')."
      },
      {
        "name": "pauseOnHover",
        "type": "boolean",
        "default": "false",
        "description": "Controls the pause on hover for the component animation."
      },
      {
        "name": "yoyo",
        "type": "boolean",
        "default": "true",
        "description": "Controls the yoyo for the component animation."
      }
    ]
  },
  "masked-heading": {
    "slug": "masked-heading",
    "name": "Masked Heading",
    "description": "Kinetic reveal effect slicing text through angled geometric masks with smooth staggered easing.",
    "dependencies": {
      "gsap": "^3.13.0"
    },
    "installation": {
      "cliTs": "npx kibo add masked-heading",
      "cliJs": "npx kibo add masked-heading --js",
      "npm": "npm i gsap",
      "pnpm": "pnpm add gsap",
      "yarn": "yarn add gsap",
      "bun": "bun add gsap"
    },
    "usageTs": "import { MaskedHeading } from \"@/components/kibo/masked-heading/component\";\n\nexport default function Example() {\n  return (\n    <MaskedHeading />\n  );\n}",
    "usageJs": "import { MaskedHeading } from \"@/components/kibo/masked-heading/component\";\nexport default function Example() {\n    return (<MaskedHeading />);\n}",
    "componentSourceTs": "\"use client\";\n\nimport { useCallback, useEffect, useId, useMemo, useRef } from 'react';\nimport type { CSSProperties, ElementType } from 'react';\nimport { gsap } from 'gsap';\n\nconst clamp = (v: number, a: number, b: number): number => (v < a ? a : v > b ? b : v);\n\ntype Reveal = 'rise' | 'wipe' | 'fade' | 'none';\ntype Trigger = 'view' | 'mount' | 'hover';\n\nexport interface MaskedHeadingProps {\n  text?: string;\n  tag?: ElementType;\n  mediaType?: 'image' | 'video';\n  src?: string;\n  poster?: string;\n  fillScale?: number;\n  parallax?: number;\n  drift?: number;\n  brightness?: number;\n  saturation?: number;\n  grayscale?: boolean;\n  reveal?: Reveal;\n  duration?: number;\n  stagger?: number;\n  trigger?: Trigger;\n  align?: 'left' | 'center' | 'right';\n  weight?: number;\n  tracking?: number;\n  lineHeight?: number;\n  textScale?: number;\n  className?: string;\n  style?: CSSProperties;\n  [key: string]: unknown;\n}\n\nexport const MaskedHeading: React.FC<MaskedHeadingProps> = ({\n  text = 'Designed in the details',\n  tag = 'h2',\n  mediaType = 'image',\n  src = '',\n  poster = '',\n  fillScale = 1.25,\n  parallax = 26,\n  drift = 18,\n  brightness = 1,\n  saturation = 1,\n  grayscale = false,\n  reveal = 'rise',\n  duration = 1.1,\n  stagger = 0.09,\n  trigger = 'view',\n  align = 'center',\n  weight = 700,\n  tracking = -0.03,\n  lineHeight = 1.06,\n  textScale = 0.115,\n  className = '',\n  style,\n  ...rest\n}: MaskedHeadingProps) => {\n  const rootRef = useRef<HTMLElement | null>(null);\n  const measureRef = useRef<HTMLSpanElement | null>(null);\n  const revealRef = useRef<HTMLSpanElement | null>(null);\n  const mediaRef = useRef<HTMLSpanElement | null>(null);\n  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);\n  const baseRefs = useRef<(HTMLElement | null)[]>([]);\n  const glyphRefs = useRef<(SVGTextElement | null)[]>([]);\n  const tweenRef = useRef<gsap.core.Tween | null>(null);\n  const offsetRef = useRef<{ x: number; y: number; tx: number; ty: number }>({ x: 0, y: 0, tx: 0, ty: 0 });\n\n  const clipId = `mh-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;\n  const words = useMemo(() => String(text).split(/\\s+/).filter(Boolean), [text]);\n\n  const settingsRef = useRef<{\n    fillScale: number;\n    parallax: number;\n    drift: number;\n    brightness: number;\n    saturation: number;\n    grayscale: boolean;\n    textScale: number;\n  }>({ fillScale: 1, parallax: 0, drift: 0, brightness: 1, saturation: 1, grayscale: false, textScale: 0.115 });\n  settingsRef.current = { fillScale, parallax, drift, brightness, saturation, grayscale, textScale };\n\n  const place = useCallback(() => {\n    const root = rootRef.current;\n    const media = mediaRef.current;\n    if (!root || !media) return;\n    const s = settingsRef.current;\n    const W = root.clientWidth;\n    const H = root.clientHeight;\n    const off = offsetRef.current;\n\n    const maxX = Math.max(0, ((s.fillScale - 1) / 2) * W);\n    const maxY = Math.max(0, ((s.fillScale - 1) / 2) * H);\n\n    media.style.transform = `translate3d(${clamp(off.x, -maxX, maxX).toFixed(2)}px, ${clamp(off.y, -maxY, maxY).toFixed(2)}px, 0) scale(${s.fillScale})`;\n    media.style.filter = `brightness(${s.brightness}) saturate(${s.saturation})${s.grayscale ? ' grayscale(1)' : ''}`;\n  }, []);\n\n  const sync = useCallback(() => {\n    const root = rootRef.current;\n    const measure = measureRef.current;\n    if (!root || !measure) return;\n    const s = settingsRef.current;\n\n    root.style.fontSize = `${clamp(root.clientWidth * s.textScale, 20, 200).toFixed(1)}px`;\n\n    const cs = window.getComputedStyle(measure);\n    for (let i = 0; i < wordRefs.current.length; i += 1) {\n      const box = wordRefs.current[i];\n      const base = baseRefs.current[i];\n      const glyph = glyphRefs.current[i];\n      if (!box || !base || !glyph) continue;\n      glyph.setAttribute('x', `${box.offsetLeft}`);\n      glyph.setAttribute('y', `${base.offsetTop}`);\n      glyph.style.fontFamily = cs.fontFamily;\n      glyph.style.fontSize = cs.fontSize;\n      glyph.style.fontWeight = cs.fontWeight;\n      glyph.style.fontStyle = cs.fontStyle;\n      glyph.style.letterSpacing = cs.letterSpacing;\n    }\n    place();\n  }, [place]);\n\n  useEffect(() => {\n    const root = rootRef.current;\n    if (!root) return;\n\n    sync();\n    const ro = new ResizeObserver(sync);\n    ro.observe(root);\n    if (document.fonts?.ready) document.fonts.ready.then(sync).catch(() => {});\n\n    let raf = 0;\n    let last = performance.now();\n    let clock = 0;\n\n    const frame = (now: number) => {\n      const dt = Math.min(0.05, (now - last) / 1000);\n      last = now;\n      clock += dt;\n      const s = settingsRef.current;\n      const off = offsetRef.current;\n\n      const dx = Math.sin(clock * 0.21) * s.drift;\n      const dy = Math.cos(clock * 0.17) * s.drift * 0.6;\n\n      const ease = 1 - Math.exp(-dt / 0.18);\n      off.x += (off.tx + dx - off.x) * ease;\n      off.y += (off.ty + dy - off.y) * ease;\n\n      place();\n      raf = requestAnimationFrame(frame);\n    };\n\n    const onMove = (e: PointerEvent) => {\n      const s = settingsRef.current;\n      if (s.parallax <= 0) return;\n      const r = root.getBoundingClientRect();\n      const nx = ((e.clientX - r.left) / (r.width || 1)) * 2 - 1;\n      const ny = ((e.clientY - r.top) / (r.height || 1)) * 2 - 1;\n      offsetRef.current.tx = clamp(nx, -1, 1) * -s.parallax;\n      offsetRef.current.ty = clamp(ny, -1, 1) * -s.parallax;\n    };\n\n    const onLeave = () => {\n      offsetRef.current.tx = 0;\n      offsetRef.current.ty = 0;\n    };\n\n    root.addEventListener('pointermove', onMove);\n    root.addEventListener('pointerleave', onLeave);\n    raf = requestAnimationFrame(frame);\n\n    return () => {\n      cancelAnimationFrame(raf);\n      ro.disconnect();\n      root.removeEventListener('pointermove', onMove);\n      root.removeEventListener('pointerleave', onLeave);\n    };\n  }, [place, sync]);\n\n  useEffect(() => {\n    sync();\n  }, [sync, words, tag, align, weight, tracking, lineHeight, textScale]);\n\n  useEffect(() => {\n    const root = rootRef.current;\n    const layer = revealRef.current;\n    if (!root || !layer) return;\n    const glyphs = glyphRefs.current.filter(Boolean);\n    if (!glyphs.length) return;\n\n    const riseDistance = () => (parseFloat(window.getComputedStyle(root).fontSize) || 48) * 1.15;\n\n    const settle = () => {\n      gsap.set(glyphs, { y: 0 });\n      gsap.set(layer, { opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0%)' });\n    };\n\n    const rest = () => {\n      if (reveal === 'rise') {\n        gsap.set(glyphs, { y: riseDistance() });\n      } else if (reveal === 'wipe') {\n        gsap.set(layer, { clipPath: 'inset(0% 100% 0% 0%)' });\n      } else if (reveal === 'fade') {\n        gsap.set(layer, { opacity: 0, scale: 1.08 });\n      }\n    };\n\n    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;\n    if (reveal === 'none' || reduce) {\n      settle();\n      return;\n    }\n\n    const play = () => {\n      tweenRef.current?.kill();\n      if (reveal === 'rise') {\n        gsap.set(layer, { opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0%)' });\n        tweenRef.current = gsap.fromTo(\n          glyphs,\n          { y: riseDistance() },\n          { y: 0, duration, stagger, ease: 'power4.out', overwrite: 'auto' }\n        );\n      } else if (reveal === 'wipe') {\n        gsap.set(glyphs, { y: 0 });\n        const state = { p: 100 };\n        tweenRef.current = gsap.to(state, {\n          p: 0,\n          duration,\n          ease: 'power3.inOut',\n          overwrite: 'auto',\n          onUpdate: () => {\n            layer.style.clipPath = `inset(0% ${state.p}% 0% 0%)`;\n          }\n        });\n      } else {\n        gsap.set(glyphs, { y: 0 });\n        tweenRef.current = gsap.fromTo(\n          layer,\n          { opacity: 0, scale: 1.08 },\n          { opacity: 1, scale: 1, duration, ease: 'power3.out', overwrite: 'auto' }\n        );\n      }\n    };\n\n    if (trigger === 'hover') {\n      settle();\n      root.addEventListener('pointerenter', play);\n      return () => {\n        root.removeEventListener('pointerenter', play);\n        tweenRef.current?.kill();\n      };\n    }\n\n    if (trigger === 'view') {\n      settle();\n      rest();\n      const io = new IntersectionObserver(\n        entries => {\n          if (entries.some(e => e.isIntersecting)) {\n            play();\n            io.disconnect();\n          }\n        },\n        { threshold: 0.25 }\n      );\n      io.observe(root);\n      return () => {\n        io.disconnect();\n        tweenRef.current?.kill();\n      };\n    }\n\n    play();\n    return () => tweenRef.current?.kill();\n  }, [reveal, trigger, duration, stagger, words]);\n\n  // eslint-disable-next-line @typescript-eslint/no-explicit-any\n  const TagAny = tag as any;\n\n  return (\n    <TagAny\n      ref={rootRef}\n      className={`relative w-full m-0 p-0 antialiased [text-wrap:balance] ${className}`.trim()}\n      style={{\n        textAlign: align,\n        fontWeight: weight,\n        letterSpacing: `${tracking}em`,\n        lineHeight,\n        ...style\n      }}\n      {...rest}\n    >\n      <span ref={measureRef} className=\"text-transparent\">\n        {words.map((word, i) => (\n          <span\n            key={`${word}-${i}`}\n            ref={(el: HTMLSpanElement | null) => {\n              wordRefs.current[i] = el;\n            }}\n            className=\"inline-block whitespace-pre [&:not(:last-child)]:after:content-['\\\\00a0']\"\n          >\n            {word}\n            <i\n              ref={(el: HTMLElement | null) => {\n                baseRefs.current[i] = el;\n              }}\n              className=\"inline-block w-0 h-0\"\n            />\n          </span>\n        ))}\n      </span>\n\n      <svg className=\"absolute w-0 h-0 overflow-hidden\" aria-hidden=\"true\" focusable=\"false\">\n        <defs>\n          <clipPath id={clipId} clipPathUnits=\"userSpaceOnUse\">\n            {words.map((word, i) => (\n              <text\n                key={`${word}-${i}`}\n                ref={(el: SVGTextElement | null) => {\n                  glyphRefs.current[i] = el;\n                }}\n              >\n                {word}\n              </text>\n            ))}\n          </clipPath>\n        </defs>\n      </svg>\n\n      <span ref={revealRef} className=\"absolute inset-0 block pointer-events-none\">\n        <span className=\"absolute inset-0 block\" style={{ clipPath: `url(#${clipId})` }}>\n          <span ref={mediaRef} className=\"absolute inset-0 block [will-change:transform,filter]\">\n            {mediaType === 'video' ? (\n              <video\n                className=\"block w-full h-full object-cover select-none\"\n                src={src}\n                poster={poster}\n                autoPlay\n                muted\n                loop\n                playsInline\n              />\n            ) : (\n              <img className=\"block w-full h-full object-cover select-none\" src={src} alt=\"\" draggable={false} />\n            )}\n          </span>\n        </span>\n      </span>\n    </TagAny>\n  );\n};\n\nexport default MaskedHeading;",
    "componentSourceJs": "\"use client\";\nimport { useCallback, useEffect, useId, useMemo, useRef } from 'react';\nimport { gsap } from 'gsap';\nconst clamp = (v, a, b) => (v < a ? a : v > b ? b : v);\nexport const MaskedHeading = ({ text = 'Designed in the details', tag = 'h2', mediaType = 'image', src = '', poster = '', fillScale = 1.25, parallax = 26, drift = 18, brightness = 1, saturation = 1, grayscale = false, reveal = 'rise', duration = 1.1, stagger = 0.09, trigger = 'view', align = 'center', weight = 700, tracking = -0.03, lineHeight = 1.06, textScale = 0.115, className = '', style, ...rest }) => {\n    const rootRef = useRef(null);\n    const measureRef = useRef(null);\n    const revealRef = useRef(null);\n    const mediaRef = useRef(null);\n    const wordRefs = useRef([]);\n    const baseRefs = useRef([]);\n    const glyphRefs = useRef([]);\n    const tweenRef = useRef(null);\n    const offsetRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });\n    const clipId = `mh-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;\n    const words = useMemo(() => String(text).split(/\\s+/).filter(Boolean), [text]);\n    const settingsRef = useRef({ fillScale: 1, parallax: 0, drift: 0, brightness: 1, saturation: 1, grayscale: false, textScale: 0.115 });\n    settingsRef.current = { fillScale, parallax, drift, brightness, saturation, grayscale, textScale };\n    const place = useCallback(() => {\n        const root = rootRef.current;\n        const media = mediaRef.current;\n        if (!root || !media)\n            return;\n        const s = settingsRef.current;\n        const W = root.clientWidth;\n        const H = root.clientHeight;\n        const off = offsetRef.current;\n        const maxX = Math.max(0, ((s.fillScale - 1) / 2) * W);\n        const maxY = Math.max(0, ((s.fillScale - 1) / 2) * H);\n        media.style.transform = `translate3d(${clamp(off.x, -maxX, maxX).toFixed(2)}px, ${clamp(off.y, -maxY, maxY).toFixed(2)}px, 0) scale(${s.fillScale})`;\n        media.style.filter = `brightness(${s.brightness}) saturate(${s.saturation})${s.grayscale ? ' grayscale(1)' : ''}`;\n    }, []);\n    const sync = useCallback(() => {\n        const root = rootRef.current;\n        const measure = measureRef.current;\n        if (!root || !measure)\n            return;\n        const s = settingsRef.current;\n        root.style.fontSize = `${clamp(root.clientWidth * s.textScale, 20, 200).toFixed(1)}px`;\n        const cs = window.getComputedStyle(measure);\n        for (let i = 0; i < wordRefs.current.length; i += 1) {\n            const box = wordRefs.current[i];\n            const base = baseRefs.current[i];\n            const glyph = glyphRefs.current[i];\n            if (!box || !base || !glyph)\n                continue;\n            glyph.setAttribute('x', `${box.offsetLeft}`);\n            glyph.setAttribute('y', `${base.offsetTop}`);\n            glyph.style.fontFamily = cs.fontFamily;\n            glyph.style.fontSize = cs.fontSize;\n            glyph.style.fontWeight = cs.fontWeight;\n            glyph.style.fontStyle = cs.fontStyle;\n            glyph.style.letterSpacing = cs.letterSpacing;\n        }\n        place();\n    }, [place]);\n    useEffect(() => {\n        const root = rootRef.current;\n        if (!root)\n            return;\n        sync();\n        const ro = new ResizeObserver(sync);\n        ro.observe(root);\n        if (document.fonts?.ready)\n            document.fonts.ready.then(sync).catch(() => { });\n        let raf = 0;\n        let last = performance.now();\n        let clock = 0;\n        const frame = (now) => {\n            const dt = Math.min(0.05, (now - last) / 1000);\n            last = now;\n            clock += dt;\n            const s = settingsRef.current;\n            const off = offsetRef.current;\n            const dx = Math.sin(clock * 0.21) * s.drift;\n            const dy = Math.cos(clock * 0.17) * s.drift * 0.6;\n            const ease = 1 - Math.exp(-dt / 0.18);\n            off.x += (off.tx + dx - off.x) * ease;\n            off.y += (off.ty + dy - off.y) * ease;\n            place();\n            raf = requestAnimationFrame(frame);\n        };\n        const onMove = (e) => {\n            const s = settingsRef.current;\n            if (s.parallax <= 0)\n                return;\n            const r = root.getBoundingClientRect();\n            const nx = ((e.clientX - r.left) / (r.width || 1)) * 2 - 1;\n            const ny = ((e.clientY - r.top) / (r.height || 1)) * 2 - 1;\n            offsetRef.current.tx = clamp(nx, -1, 1) * -s.parallax;\n            offsetRef.current.ty = clamp(ny, -1, 1) * -s.parallax;\n        };\n        const onLeave = () => {\n            offsetRef.current.tx = 0;\n            offsetRef.current.ty = 0;\n        };\n        root.addEventListener('pointermove', onMove);\n        root.addEventListener('pointerleave', onLeave);\n        raf = requestAnimationFrame(frame);\n        return () => {\n            cancelAnimationFrame(raf);\n            ro.disconnect();\n            root.removeEventListener('pointermove', onMove);\n            root.removeEventListener('pointerleave', onLeave);\n        };\n    }, [place, sync]);\n    useEffect(() => {\n        sync();\n    }, [sync, words, tag, align, weight, tracking, lineHeight, textScale]);\n    useEffect(() => {\n        const root = rootRef.current;\n        const layer = revealRef.current;\n        if (!root || !layer)\n            return;\n        const glyphs = glyphRefs.current.filter(Boolean);\n        if (!glyphs.length)\n            return;\n        const riseDistance = () => (parseFloat(window.getComputedStyle(root).fontSize) || 48) * 1.15;\n        const settle = () => {\n            gsap.set(glyphs, { y: 0 });\n            gsap.set(layer, { opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0%)' });\n        };\n        const rest = () => {\n            if (reveal === 'rise') {\n                gsap.set(glyphs, { y: riseDistance() });\n            }\n            else if (reveal === 'wipe') {\n                gsap.set(layer, { clipPath: 'inset(0% 100% 0% 0%)' });\n            }\n            else if (reveal === 'fade') {\n                gsap.set(layer, { opacity: 0, scale: 1.08 });\n            }\n        };\n        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;\n        if (reveal === 'none' || reduce) {\n            settle();\n            return;\n        }\n        const play = () => {\n            tweenRef.current?.kill();\n            if (reveal === 'rise') {\n                gsap.set(layer, { opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0%)' });\n                tweenRef.current = gsap.fromTo(glyphs, { y: riseDistance() }, { y: 0, duration, stagger, ease: 'power4.out', overwrite: 'auto' });\n            }\n            else if (reveal === 'wipe') {\n                gsap.set(glyphs, { y: 0 });\n                const state = { p: 100 };\n                tweenRef.current = gsap.to(state, {\n                    p: 0,\n                    duration,\n                    ease: 'power3.inOut',\n                    overwrite: 'auto',\n                    onUpdate: () => {\n                        layer.style.clipPath = `inset(0% ${state.p}% 0% 0%)`;\n                    }\n                });\n            }\n            else {\n                gsap.set(glyphs, { y: 0 });\n                tweenRef.current = gsap.fromTo(layer, { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration, ease: 'power3.out', overwrite: 'auto' });\n            }\n        };\n        if (trigger === 'hover') {\n            settle();\n            root.addEventListener('pointerenter', play);\n            return () => {\n                root.removeEventListener('pointerenter', play);\n                tweenRef.current?.kill();\n            };\n        }\n        if (trigger === 'view') {\n            settle();\n            rest();\n            const io = new IntersectionObserver(entries => {\n                if (entries.some(e => e.isIntersecting)) {\n                    play();\n                    io.disconnect();\n                }\n            }, { threshold: 0.25 });\n            io.observe(root);\n            return () => {\n                io.disconnect();\n                tweenRef.current?.kill();\n            };\n        }\n        play();\n        return () => tweenRef.current?.kill();\n    }, [reveal, trigger, duration, stagger, words]);\n    // eslint-disable-next-line @typescript-eslint/no-explicit-any\n    const TagAny = tag;\n    return (<TagAny ref={rootRef} className={`relative w-full m-0 p-0 antialiased [text-wrap:balance] ${className}`.trim()} style={{\n            textAlign: align,\n            fontWeight: weight,\n            letterSpacing: `${tracking}em`,\n            lineHeight,\n            ...style\n        }} {...rest}>\n      <span ref={measureRef} className=\"text-transparent\">\n        {words.map((word, i) => (<span key={`${word}-${i}`} ref={(el) => {\n                wordRefs.current[i] = el;\n            }} className=\"inline-block whitespace-pre [&:not(:last-child)]:after:content-['\\\\00a0']\">\n            {word}\n            <i ref={(el) => {\n                baseRefs.current[i] = el;\n            }} className=\"inline-block w-0 h-0\"/>\n          </span>))}\n      </span>\n\n      <svg className=\"absolute w-0 h-0 overflow-hidden\" aria-hidden=\"true\" focusable=\"false\">\n        <defs>\n          <clipPath id={clipId} clipPathUnits=\"userSpaceOnUse\">\n            {words.map((word, i) => (<text key={`${word}-${i}`} ref={(el) => {\n                glyphRefs.current[i] = el;\n            }}>\n                {word}\n              </text>))}\n          </clipPath>\n        </defs>\n      </svg>\n\n      <span ref={revealRef} className=\"absolute inset-0 block pointer-events-none\">\n        <span className=\"absolute inset-0 block\" style={{ clipPath: `url(#${clipId})` }}>\n          <span ref={mediaRef} className=\"absolute inset-0 block [will-change:transform,filter]\">\n            {mediaType === 'video' ? (<video className=\"block w-full h-full object-cover select-none\" src={src} poster={poster} autoPlay muted loop playsInline/>) : (<img className=\"block w-full h-full object-cover select-none\" src={src} alt=\"\" draggable={false}/>)}\n          </span>\n        </span>\n      </span>\n    </TagAny>);\n};\nexport default MaskedHeading;",
    "props": [
      {
        "name": "text",
        "type": "string",
        "default": "'Designed in the details'",
        "description": "The text content to display and animate."
      },
      {
        "name": "tag",
        "type": "ElementType",
        "default": "'h2'",
        "description": "Controls the tag for the component animation."
      },
      {
        "name": "mediaType",
        "type": "'image' | 'video'",
        "default": "'image'",
        "description": "Controls the media type for the component animation."
      },
      {
        "name": "src",
        "type": "string",
        "default": "''",
        "description": "Controls the src for the component animation."
      },
      {
        "name": "poster",
        "type": "string",
        "default": "''",
        "description": "Controls the poster for the component animation."
      },
      {
        "name": "fillScale",
        "type": "number",
        "default": "1.25",
        "description": "Controls the fill scale for the component animation."
      },
      {
        "name": "parallax",
        "type": "number",
        "default": "26",
        "description": "Controls the parallax for the component animation."
      },
      {
        "name": "drift",
        "type": "number",
        "default": "18",
        "description": "Controls the drift for the component animation."
      },
      {
        "name": "brightness",
        "type": "number",
        "default": "1",
        "description": "Controls the brightness for the component animation."
      },
      {
        "name": "saturation",
        "type": "number",
        "default": "1",
        "description": "Controls the saturation for the component animation."
      },
      {
        "name": "grayscale",
        "type": "boolean",
        "default": "false",
        "description": "Controls the grayscale for the component animation."
      },
      {
        "name": "reveal",
        "type": "Reveal",
        "default": "'rise'",
        "description": "Controls the reveal for the component animation."
      },
      {
        "name": "duration",
        "type": "number",
        "default": "1.1",
        "description": "Duration of the animation in seconds or milliseconds."
      },
      {
        "name": "stagger",
        "type": "number",
        "default": "0.09",
        "description": "Stagger delay in seconds between individual characters/elements."
      },
      {
        "name": "trigger",
        "type": "Trigger",
        "default": "'view'",
        "description": "Controls the trigger for the component animation."
      },
      {
        "name": "align",
        "type": "'left' | 'center' | 'right'",
        "default": "'center'",
        "description": "Controls the align for the component animation."
      },
      {
        "name": "weight",
        "type": "number",
        "default": "700",
        "description": "Controls the weight for the component animation."
      },
      {
        "name": "tracking",
        "type": "number",
        "default": "-0.03",
        "description": "Controls the tracking for the component animation."
      },
      {
        "name": "lineHeight",
        "type": "number",
        "default": "1.06",
        "description": "Controls the line height for the component animation."
      },
      {
        "name": "textScale",
        "type": "number",
        "default": "0.115",
        "description": "Controls the text scale for the component animation."
      },
      {
        "name": "className",
        "type": "string",
        "default": "''",
        "description": "Additional CSS classes for styling and layout."
      },
      {
        "name": "style",
        "type": "CSSProperties",
        "default": "-",
        "description": "Controls the style for the component animation."
      }
    ]
  },
  "particle-text": {
    "slug": "particle-text",
    "name": "Particle Text",
    "description": "Interactive canvas particle physics system rendering text as thousands of points that scatter and reform around pointer.",
    "dependencies": {},
    "installation": {
      "cliTs": "npx kibo add particle-text",
      "cliJs": "npx kibo add particle-text --js",
      "npm": "npx kibo add particle-text",
      "pnpm": "pnpm dlx kibo add particle-text",
      "yarn": "yarn add particle-text",
      "bun": "bunx kibo add particle-text"
    },
    "usageTs": "import { ParticleText } from \"@/components/kibo/particle-text/component\";\n\nexport default function Example() {\n  return (\n    <ParticleText />\n  );\n}",
    "usageJs": "import { ParticleText } from \"@/components/kibo/particle-text/component\";\nexport default function Example() {\n    return (<ParticleText />);\n}",
    "componentSourceTs": "\"use client\";\n\nimport { useEffect, useRef, type CSSProperties } from 'react';\nexport interface ParticleTextProps {\n  text?: string;\n  particleSize?: number;\n  density?: number;\n  color?: string;\n  highlightColor?: string;\n  scatter?: number;\n  gatherDuration?: number;\n  stagger?: number;\n  pointerRepel?: number;\n  repelRadius?: number;\n  idleDrift?: number;\n  trigger?: 'mount' | 'hover' | 'click';\n  fontSize?: number | string;\n  fontWeight?: number | string;\n  fontFamily?: string;\n  glow?: boolean;\n  className?: string;\n  style?: CSSProperties;\n}\n\ntype Rgb = { r: number; g: number; b: number };\ntype Target = { x: number; y: number; alpha: number };\ntype Particle = {\n  x: number;\n  y: number;\n  startX: number;\n  startY: number;\n  targetX: number;\n  targetY: number;\n  size: number;\n  color: string;\n  seed: number;\n  depth: number;\n  delay: number;\n};\n\nconst hexToRgb = (hex: string): Rgb | null => {\n  const clean = hex.replace('#', '').trim();\n  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null;\n  return {\n    r: parseInt(clean.slice(0, 2), 16),\n    g: parseInt(clean.slice(2, 4), 16),\n    b: parseInt(clean.slice(4, 6), 16)\n  };\n};\n\nconst mixRgb = (from: Rgb, to: Rgb, amount: number): Rgb => ({\n  r: Math.round(from.r + (to.r - from.r) * amount),\n  g: Math.round(from.g + (to.g - from.g) * amount),\n  b: Math.round(from.b + (to.b - from.b) * amount)\n});\n\nconst rgbToCss = (rgb: Rgb): string => `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;\n\nconst clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);\nconst easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);\n\nconst resolveFontSize = (\n  value: number | string,\n  container: HTMLDivElement,\n  fontWeight: number | string,\n  fontFamily: string\n): number => {\n  if (typeof value === 'number') return value;\n\n  const probe = document.createElement('span');\n  probe.textContent = 'M';\n  probe.style.position = 'absolute';\n  probe.style.visibility = 'hidden';\n  probe.style.pointerEvents = 'none';\n  probe.style.fontSize = value;\n  probe.style.fontWeight = String(fontWeight);\n  probe.style.fontFamily = fontFamily;\n  container.appendChild(probe);\n  const size = parseFloat(window.getComputedStyle(probe).fontSize) || 96;\n  probe.remove();\n  return size;\n};\n\nconst waitForFonts = async (font: string): Promise<void> => {\n  if (!('fonts' in document)) return;\n\n  try {\n    await document.fonts.load(font);\n  } catch {}\n\n  await document.fonts.ready;\n};\n\nexport const ParticleText = ({\n  text = 'React Bits',\n  particleSize = 2,\n  density = 4,\n  color = '#ffffff',\n  highlightColor = '#8b5cf6',\n  scatter = 180,\n  gatherDuration = 1600,\n  stagger = 420,\n  pointerRepel = 40,\n  repelRadius = 120,\n  idleDrift = 0.7,\n  trigger = 'mount',\n  fontSize = 'clamp(3rem, 12vw, 8rem)',\n  fontWeight = 800,\n  fontFamily = 'inherit',\n  glow = true,\n  className = '',\n  style\n}: ParticleTextProps) => {\n  const containerRef = useRef<HTMLDivElement | null>(null);\n  const canvasRef = useRef<HTMLCanvasElement | null>(null);\n\n  useEffect(() => {\n    if (typeof window === 'undefined') return undefined;\n\n    const container = containerRef.current;\n    const canvas = canvasRef.current;\n    if (!container || !canvas) return undefined;\n\n    const ctx = canvas.getContext('2d');\n    if (!ctx) return undefined;\n\n    let particles: Particle[] = [];\n    let animationFrame: number | null = null;\n    let resizeFrame: number | null = null;\n    let buildId = 0;\n    let gathering = false;\n    let gatherStart = 0;\n    let reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;\n    let width = 0;\n    let height = 0;\n    let dpr = 1;\n\n    const pointer = {\n      active: false,\n      x: 0,\n      y: 0,\n      smoothX: 0,\n      smoothY: 0\n    };\n\n    const startGather = (fromScatter = true): void => {\n      if (!particles.length) return;\n\n      const now = performance.now();\n      const spread = reducedMotion ? 0 : scatter;\n\n      particles.forEach(particle => {\n        if (fromScatter) {\n          const angle = particle.seed * Math.PI * 2;\n          const distance = spread * (0.35 + particle.depth * 0.75);\n          particle.x = particle.targetX + Math.cos(angle) * distance + (particle.depth - 0.5) * spread * 0.55;\n          particle.y = particle.targetY + Math.sin(angle) * distance + (particle.seed - 0.5) * spread * 0.55;\n        }\n\n        particle.startX = particle.x;\n        particle.startY = particle.y;\n        particle.delay = reducedMotion ? 0 : particle.seed * stagger;\n      });\n\n      gatherStart = now;\n      gathering = true;\n    };\n\n    const drawParticle = (particle: Particle): void => {\n      const size = particle.size;\n      ctx.fillStyle = particle.color;\n\n      if (size <= 2.1) {\n        ctx.fillRect(particle.x - size / 2, particle.y - size / 2, size, size);\n        return;\n      }\n\n      ctx.beginPath();\n      ctx.arc(particle.x, particle.y, size / 2, 0, Math.PI * 2);\n      ctx.fill();\n    };\n\n    const render = (now: number): void => {\n      ctx.clearRect(0, 0, width, height);\n\n      if (glow && !reducedMotion) {\n        ctx.shadowBlur = particleSize * 3;\n        ctx.shadowColor = highlightColor;\n      } else {\n        ctx.shadowBlur = 0;\n      }\n\n      pointer.smoothX += (pointer.x - pointer.smoothX) * 0.18;\n      pointer.smoothY += (pointer.y - pointer.smoothY) * 0.18;\n\n      let complete = true;\n\n      particles.forEach(particle => {\n        let baseX = particle.targetX;\n        let baseY = particle.targetY;\n        let progress = 1;\n\n        if (gathering) {\n          const local = (now - gatherStart - particle.delay) / Math.max(1, reducedMotion ? 1 : gatherDuration);\n          progress = clamp(local, 0, 1);\n          const eased = easeOutCubic(progress);\n          baseX = particle.startX + (particle.targetX - particle.startX) * eased;\n          baseY = particle.startY + (particle.targetY - particle.startY) * eased;\n          if (progress < 1) complete = false;\n        } else if (!reducedMotion && idleDrift > 0) {\n          const driftTime = now * 0.001;\n          baseX += Math.sin(driftTime * 0.9 + particle.seed * 10) * idleDrift * particle.depth;\n          baseY += Math.cos(driftTime * 0.75 + particle.depth * 10) * idleDrift * particle.depth;\n        }\n\n        if (pointer.active && !reducedMotion && pointerRepel > 0 && repelRadius > 0) {\n          const dx = baseX - pointer.smoothX;\n          const dy = baseY - pointer.smoothY;\n          const distance = Math.hypot(dx, dy);\n          if (distance > 0 && distance < repelRadius) {\n            const force = Math.pow(1 - distance / repelRadius, 2) * pointerRepel;\n            baseX += (dx / distance) * force;\n            baseY += (dy / distance) * force;\n          }\n        }\n\n        const follow = reducedMotion ? 1 : 0.22;\n        particle.x += (baseX - particle.x) * follow;\n        particle.y += (baseY - particle.y) * follow;\n\n        ctx.globalAlpha = clamp(0.35 + progress * 0.65, 0, 1);\n        drawParticle(particle);\n      });\n\n      ctx.globalAlpha = 1;\n      ctx.shadowBlur = 0;\n\n      if (gathering && complete) {\n        gathering = false;\n      }\n\n      animationFrame = window.requestAnimationFrame(render);\n    };\n\n    const ensureRenderLoop = (): void => {\n      if (animationFrame === null) {\n        animationFrame = window.requestAnimationFrame(render);\n      }\n    };\n\n    const sampleText = async (): Promise<void> => {\n      const currentBuild = ++buildId;\n      const rect = container.getBoundingClientRect();\n      width = Math.floor(rect.width);\n      height = Math.floor(rect.height);\n\n      if (width <= 0 || height <= 0) return;\n\n      dpr = Math.min(window.devicePixelRatio || 1, 2);\n      canvas.width = Math.max(1, Math.floor(width * dpr));\n      canvas.height = Math.max(1, Math.floor(height * dpr));\n      canvas.style.width = '100%';\n      canvas.style.height = '100%';\n      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);\n\n      const computed = window.getComputedStyle(container);\n      const resolvedFamily = fontFamily === 'inherit' ? computed.fontFamily || 'sans-serif' : fontFamily;\n      let resolvedSize = resolveFontSize(fontSize, container, fontWeight, resolvedFamily);\n      let font = `${fontWeight} ${resolvedSize}px ${resolvedFamily}`;\n\n      await waitForFonts(font);\n      if (currentBuild !== buildId) return;\n\n      const offscreen = document.createElement('canvas');\n      const offCtx = offscreen.getContext('2d', { willReadFrequently: true });\n      if (!offCtx) return;\n\n      const content = String(text || ' ');\n      const maxTextWidth = width * 0.92;\n      offCtx.font = font;\n      let metrics = offCtx.measureText(content);\n      const measuredWidth = Math.max(1, metrics.width);\n      if (measuredWidth > maxTextWidth) {\n        resolvedSize = Math.max(18, resolvedSize * (maxTextWidth / measuredWidth));\n        font = `${fontWeight} ${resolvedSize}px ${resolvedFamily}`;\n        await waitForFonts(font);\n        if (currentBuild !== buildId) return;\n        offCtx.font = font;\n        metrics = offCtx.measureText(content);\n      }\n\n      const left = Math.ceil(metrics.actualBoundingBoxLeft || 0);\n      const right = Math.ceil(metrics.actualBoundingBoxRight || metrics.width);\n      const ascent = Math.ceil(metrics.actualBoundingBoxAscent || resolvedSize * 0.78);\n      const descent = Math.ceil(metrics.actualBoundingBoxDescent || resolvedSize * 0.22);\n      const padding = Math.max(12, Math.ceil(resolvedSize * 0.08));\n      const textWidth = Math.max(1, left + right);\n      const textHeight = Math.max(1, ascent + descent);\n\n      offscreen.width = textWidth + padding * 2;\n      offscreen.height = textHeight + padding * 2;\n      offCtx.clearRect(0, 0, offscreen.width, offscreen.height);\n      offCtx.font = font;\n      offCtx.textAlign = 'left';\n      offCtx.textBaseline = 'alphabetic';\n      offCtx.fillStyle = '#ffffff';\n      offCtx.fillText(content, padding - left, padding + ascent);\n\n      const imageData = offCtx.getImageData(0, 0, offscreen.width, offscreen.height);\n      const targets: Target[] = [];\n      const step = Math.max(2, Math.floor(density));\n\n      for (let y = 0; y < offscreen.height; y += step) {\n        for (let x = 0; x < offscreen.width; x += step) {\n          const alpha = imageData.data[(y * offscreen.width + x) * 4 + 3];\n          if (alpha > 40) {\n            targets.push({\n              x: width / 2 - offscreen.width / 2 + x,\n              y: height / 2 - offscreen.height / 2 + y,\n              alpha: alpha / 255\n            });\n          }\n        }\n      }\n\n      const maxParticles = Math.max(900, Math.min(5200, Math.floor((width * height) / 90)));\n      const stride = Math.max(1, Math.ceil(targets.length / maxParticles));\n      const baseRgb = hexToRgb(color);\n      const highlightRgb = hexToRgb(highlightColor);\n      const selected = targets.filter((_, index) => index % stride === 0);\n\n      particles = selected.map((target, index) => {\n        const seed = ((index * 9301 + 49297) % 233280) / 233280;\n        const depth = 0.45 + (((index * 233 + 97) % 1000) / 1000) * 0.9;\n        const blend = baseRgb && highlightRgb ? clamp(target.x / Math.max(1, width) + (seed - 0.5) * 0.35, 0, 1) : 0;\n        const particleColor = baseRgb && highlightRgb ? rgbToCss(mixRgb(baseRgb, highlightRgb, blend)) : color;\n        const angle = seed * Math.PI * 2;\n        const distance = (reducedMotion ? 0 : scatter) * (0.35 + depth * 0.75);\n        const startX = target.x + Math.cos(angle) * distance + (seed - 0.5) * scatter * 0.45;\n        const startY = target.y + Math.sin(angle) * distance + (depth - 0.9) * scatter * 0.45;\n\n        return {\n          x: reducedMotion ? target.x : startX,\n          y: reducedMotion ? target.y : startY,\n          startX,\n          startY,\n          targetX: target.x,\n          targetY: target.y,\n          size: Math.max(0.6, particleSize * (0.75 + target.alpha * 0.45)),\n          color: particleColor,\n          seed,\n          depth,\n          delay: seed * stagger\n        };\n      });\n\n      pointer.x = width / 2;\n      pointer.y = height / 2;\n      pointer.smoothX = pointer.x;\n      pointer.smoothY = pointer.y;\n\n      if (reducedMotion) {\n        particles.forEach(particle => {\n          particle.x = particle.targetX;\n          particle.y = particle.targetY;\n          particle.startX = particle.targetX;\n          particle.startY = particle.targetY;\n          particle.delay = 0;\n        });\n        gathering = false;\n      } else {\n        startGather(false);\n      }\n\n      ensureRenderLoop();\n    };\n\n    const queueSample = (): void => {\n      if (resizeFrame) window.cancelAnimationFrame(resizeFrame);\n      resizeFrame = window.requestAnimationFrame(sampleText);\n    };\n\n    const handlePointerMove = (event: PointerEvent): void => {\n      const rect = canvas.getBoundingClientRect();\n      pointer.x = event.clientX - rect.left;\n      pointer.y = event.clientY - rect.top;\n      pointer.active = true;\n    };\n\n    const handlePointerLeave = (): void => {\n      pointer.active = false;\n    };\n\n    const handlePointerEnter = (event: PointerEvent): void => {\n      handlePointerMove(event);\n      if (trigger === 'hover') startGather(true);\n    };\n\n    const handleClick = (): void => {\n      if (trigger === 'click') startGather(true);\n    };\n\n    const reduceMotionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');\n    const handleReduceMotionChange = (event: MediaQueryListEvent): void => {\n      reducedMotion = event.matches;\n      void sampleText();\n    };\n\n    reduceMotionQuery?.addEventListener('change', handleReduceMotionChange);\n    canvas.addEventListener('pointerenter', handlePointerEnter);\n    canvas.addEventListener('pointermove', handlePointerMove);\n    canvas.addEventListener('pointerleave', handlePointerLeave);\n    canvas.addEventListener('click', handleClick);\n\n    const resizeObserver = new ResizeObserver(queueSample);\n    resizeObserver.observe(container);\n    void sampleText();\n\n    return () => {\n      buildId += 1;\n      resizeObserver.disconnect();\n      reduceMotionQuery?.removeEventListener('change', handleReduceMotionChange);\n      canvas.removeEventListener('pointerenter', handlePointerEnter);\n      canvas.removeEventListener('pointermove', handlePointerMove);\n      canvas.removeEventListener('pointerleave', handlePointerLeave);\n      canvas.removeEventListener('click', handleClick);\n\n      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);\n      if (resizeFrame !== null) window.cancelAnimationFrame(resizeFrame);\n    };\n  }, [\n    text,\n    particleSize,\n    density,\n    color,\n    highlightColor,\n    scatter,\n    gatherDuration,\n    stagger,\n    pointerRepel,\n    repelRadius,\n    idleDrift,\n    trigger,\n    fontSize,\n    fontWeight,\n    fontFamily,\n    glow\n  ]);\n\n  return (\n    <div\n      ref={containerRef}\n      className={`relative block h-full min-h-[240px] w-full overflow-hidden touch-none ${className}`}\n      style={style}\n      aria-label={text}\n    >\n      <canvas ref={canvasRef} className=\"absolute inset-0 block h-full w-full\" aria-hidden=\"true\" />\n      <span className=\"sr-only\">{text}</span>\n    </div>\n  );\n};\n\nexport default ParticleText;",
    "componentSourceJs": "\"use client\";\nimport { useEffect, useRef } from 'react';\nconst hexToRgb = (hex) => {\n    const clean = hex.replace('#', '').trim();\n    if (!/^[0-9a-fA-F]{6}$/.test(clean))\n        return null;\n    return {\n        r: parseInt(clean.slice(0, 2), 16),\n        g: parseInt(clean.slice(2, 4), 16),\n        b: parseInt(clean.slice(4, 6), 16)\n    };\n};\nconst mixRgb = (from, to, amount) => ({\n    r: Math.round(from.r + (to.r - from.r) * amount),\n    g: Math.round(from.g + (to.g - from.g) * amount),\n    b: Math.round(from.b + (to.b - from.b) * amount)\n});\nconst rgbToCss = (rgb) => `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;\nconst clamp = (value, min, max) => Math.min(Math.max(value, min), max);\nconst easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);\nconst resolveFontSize = (value, container, fontWeight, fontFamily) => {\n    if (typeof value === 'number')\n        return value;\n    const probe = document.createElement('span');\n    probe.textContent = 'M';\n    probe.style.position = 'absolute';\n    probe.style.visibility = 'hidden';\n    probe.style.pointerEvents = 'none';\n    probe.style.fontSize = value;\n    probe.style.fontWeight = String(fontWeight);\n    probe.style.fontFamily = fontFamily;\n    container.appendChild(probe);\n    const size = parseFloat(window.getComputedStyle(probe).fontSize) || 96;\n    probe.remove();\n    return size;\n};\nconst waitForFonts = async (font) => {\n    if (!('fonts' in document))\n        return;\n    try {\n        await document.fonts.load(font);\n    }\n    catch { }\n    await document.fonts.ready;\n};\nexport const ParticleText = ({ text = 'React Bits', particleSize = 2, density = 4, color = '#ffffff', highlightColor = '#8b5cf6', scatter = 180, gatherDuration = 1600, stagger = 420, pointerRepel = 40, repelRadius = 120, idleDrift = 0.7, trigger = 'mount', fontSize = 'clamp(3rem, 12vw, 8rem)', fontWeight = 800, fontFamily = 'inherit', glow = true, className = '', style }) => {\n    const containerRef = useRef(null);\n    const canvasRef = useRef(null);\n    useEffect(() => {\n        if (typeof window === 'undefined')\n            return undefined;\n        const container = containerRef.current;\n        const canvas = canvasRef.current;\n        if (!container || !canvas)\n            return undefined;\n        const ctx = canvas.getContext('2d');\n        if (!ctx)\n            return undefined;\n        let particles = [];\n        let animationFrame = null;\n        let resizeFrame = null;\n        let buildId = 0;\n        let gathering = false;\n        let gatherStart = 0;\n        let reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;\n        let width = 0;\n        let height = 0;\n        let dpr = 1;\n        const pointer = {\n            active: false,\n            x: 0,\n            y: 0,\n            smoothX: 0,\n            smoothY: 0\n        };\n        const startGather = (fromScatter = true) => {\n            if (!particles.length)\n                return;\n            const now = performance.now();\n            const spread = reducedMotion ? 0 : scatter;\n            particles.forEach(particle => {\n                if (fromScatter) {\n                    const angle = particle.seed * Math.PI * 2;\n                    const distance = spread * (0.35 + particle.depth * 0.75);\n                    particle.x = particle.targetX + Math.cos(angle) * distance + (particle.depth - 0.5) * spread * 0.55;\n                    particle.y = particle.targetY + Math.sin(angle) * distance + (particle.seed - 0.5) * spread * 0.55;\n                }\n                particle.startX = particle.x;\n                particle.startY = particle.y;\n                particle.delay = reducedMotion ? 0 : particle.seed * stagger;\n            });\n            gatherStart = now;\n            gathering = true;\n        };\n        const drawParticle = (particle) => {\n            const size = particle.size;\n            ctx.fillStyle = particle.color;\n            if (size <= 2.1) {\n                ctx.fillRect(particle.x - size / 2, particle.y - size / 2, size, size);\n                return;\n            }\n            ctx.beginPath();\n            ctx.arc(particle.x, particle.y, size / 2, 0, Math.PI * 2);\n            ctx.fill();\n        };\n        const render = (now) => {\n            ctx.clearRect(0, 0, width, height);\n            if (glow && !reducedMotion) {\n                ctx.shadowBlur = particleSize * 3;\n                ctx.shadowColor = highlightColor;\n            }\n            else {\n                ctx.shadowBlur = 0;\n            }\n            pointer.smoothX += (pointer.x - pointer.smoothX) * 0.18;\n            pointer.smoothY += (pointer.y - pointer.smoothY) * 0.18;\n            let complete = true;\n            particles.forEach(particle => {\n                let baseX = particle.targetX;\n                let baseY = particle.targetY;\n                let progress = 1;\n                if (gathering) {\n                    const local = (now - gatherStart - particle.delay) / Math.max(1, reducedMotion ? 1 : gatherDuration);\n                    progress = clamp(local, 0, 1);\n                    const eased = easeOutCubic(progress);\n                    baseX = particle.startX + (particle.targetX - particle.startX) * eased;\n                    baseY = particle.startY + (particle.targetY - particle.startY) * eased;\n                    if (progress < 1)\n                        complete = false;\n                }\n                else if (!reducedMotion && idleDrift > 0) {\n                    const driftTime = now * 0.001;\n                    baseX += Math.sin(driftTime * 0.9 + particle.seed * 10) * idleDrift * particle.depth;\n                    baseY += Math.cos(driftTime * 0.75 + particle.depth * 10) * idleDrift * particle.depth;\n                }\n                if (pointer.active && !reducedMotion && pointerRepel > 0 && repelRadius > 0) {\n                    const dx = baseX - pointer.smoothX;\n                    const dy = baseY - pointer.smoothY;\n                    const distance = Math.hypot(dx, dy);\n                    if (distance > 0 && distance < repelRadius) {\n                        const force = Math.pow(1 - distance / repelRadius, 2) * pointerRepel;\n                        baseX += (dx / distance) * force;\n                        baseY += (dy / distance) * force;\n                    }\n                }\n                const follow = reducedMotion ? 1 : 0.22;\n                particle.x += (baseX - particle.x) * follow;\n                particle.y += (baseY - particle.y) * follow;\n                ctx.globalAlpha = clamp(0.35 + progress * 0.65, 0, 1);\n                drawParticle(particle);\n            });\n            ctx.globalAlpha = 1;\n            ctx.shadowBlur = 0;\n            if (gathering && complete) {\n                gathering = false;\n            }\n            animationFrame = window.requestAnimationFrame(render);\n        };\n        const ensureRenderLoop = () => {\n            if (animationFrame === null) {\n                animationFrame = window.requestAnimationFrame(render);\n            }\n        };\n        const sampleText = async () => {\n            const currentBuild = ++buildId;\n            const rect = container.getBoundingClientRect();\n            width = Math.floor(rect.width);\n            height = Math.floor(rect.height);\n            if (width <= 0 || height <= 0)\n                return;\n            dpr = Math.min(window.devicePixelRatio || 1, 2);\n            canvas.width = Math.max(1, Math.floor(width * dpr));\n            canvas.height = Math.max(1, Math.floor(height * dpr));\n            canvas.style.width = '100%';\n            canvas.style.height = '100%';\n            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);\n            const computed = window.getComputedStyle(container);\n            const resolvedFamily = fontFamily === 'inherit' ? computed.fontFamily || 'sans-serif' : fontFamily;\n            let resolvedSize = resolveFontSize(fontSize, container, fontWeight, resolvedFamily);\n            let font = `${fontWeight} ${resolvedSize}px ${resolvedFamily}`;\n            await waitForFonts(font);\n            if (currentBuild !== buildId)\n                return;\n            const offscreen = document.createElement('canvas');\n            const offCtx = offscreen.getContext('2d', { willReadFrequently: true });\n            if (!offCtx)\n                return;\n            const content = String(text || ' ');\n            const maxTextWidth = width * 0.92;\n            offCtx.font = font;\n            let metrics = offCtx.measureText(content);\n            const measuredWidth = Math.max(1, metrics.width);\n            if (measuredWidth > maxTextWidth) {\n                resolvedSize = Math.max(18, resolvedSize * (maxTextWidth / measuredWidth));\n                font = `${fontWeight} ${resolvedSize}px ${resolvedFamily}`;\n                await waitForFonts(font);\n                if (currentBuild !== buildId)\n                    return;\n                offCtx.font = font;\n                metrics = offCtx.measureText(content);\n            }\n            const left = Math.ceil(metrics.actualBoundingBoxLeft || 0);\n            const right = Math.ceil(metrics.actualBoundingBoxRight || metrics.width);\n            const ascent = Math.ceil(metrics.actualBoundingBoxAscent || resolvedSize * 0.78);\n            const descent = Math.ceil(metrics.actualBoundingBoxDescent || resolvedSize * 0.22);\n            const padding = Math.max(12, Math.ceil(resolvedSize * 0.08));\n            const textWidth = Math.max(1, left + right);\n            const textHeight = Math.max(1, ascent + descent);\n            offscreen.width = textWidth + padding * 2;\n            offscreen.height = textHeight + padding * 2;\n            offCtx.clearRect(0, 0, offscreen.width, offscreen.height);\n            offCtx.font = font;\n            offCtx.textAlign = 'left';\n            offCtx.textBaseline = 'alphabetic';\n            offCtx.fillStyle = '#ffffff';\n            offCtx.fillText(content, padding - left, padding + ascent);\n            const imageData = offCtx.getImageData(0, 0, offscreen.width, offscreen.height);\n            const targets = [];\n            const step = Math.max(2, Math.floor(density));\n            for (let y = 0; y < offscreen.height; y += step) {\n                for (let x = 0; x < offscreen.width; x += step) {\n                    const alpha = imageData.data[(y * offscreen.width + x) * 4 + 3];\n                    if (alpha > 40) {\n                        targets.push({\n                            x: width / 2 - offscreen.width / 2 + x,\n                            y: height / 2 - offscreen.height / 2 + y,\n                            alpha: alpha / 255\n                        });\n                    }\n                }\n            }\n            const maxParticles = Math.max(900, Math.min(5200, Math.floor((width * height) / 90)));\n            const stride = Math.max(1, Math.ceil(targets.length / maxParticles));\n            const baseRgb = hexToRgb(color);\n            const highlightRgb = hexToRgb(highlightColor);\n            const selected = targets.filter((_, index) => index % stride === 0);\n            particles = selected.map((target, index) => {\n                const seed = ((index * 9301 + 49297) % 233280) / 233280;\n                const depth = 0.45 + (((index * 233 + 97) % 1000) / 1000) * 0.9;\n                const blend = baseRgb && highlightRgb ? clamp(target.x / Math.max(1, width) + (seed - 0.5) * 0.35, 0, 1) : 0;\n                const particleColor = baseRgb && highlightRgb ? rgbToCss(mixRgb(baseRgb, highlightRgb, blend)) : color;\n                const angle = seed * Math.PI * 2;\n                const distance = (reducedMotion ? 0 : scatter) * (0.35 + depth * 0.75);\n                const startX = target.x + Math.cos(angle) * distance + (seed - 0.5) * scatter * 0.45;\n                const startY = target.y + Math.sin(angle) * distance + (depth - 0.9) * scatter * 0.45;\n                return {\n                    x: reducedMotion ? target.x : startX,\n                    y: reducedMotion ? target.y : startY,\n                    startX,\n                    startY,\n                    targetX: target.x,\n                    targetY: target.y,\n                    size: Math.max(0.6, particleSize * (0.75 + target.alpha * 0.45)),\n                    color: particleColor,\n                    seed,\n                    depth,\n                    delay: seed * stagger\n                };\n            });\n            pointer.x = width / 2;\n            pointer.y = height / 2;\n            pointer.smoothX = pointer.x;\n            pointer.smoothY = pointer.y;\n            if (reducedMotion) {\n                particles.forEach(particle => {\n                    particle.x = particle.targetX;\n                    particle.y = particle.targetY;\n                    particle.startX = particle.targetX;\n                    particle.startY = particle.targetY;\n                    particle.delay = 0;\n                });\n                gathering = false;\n            }\n            else {\n                startGather(false);\n            }\n            ensureRenderLoop();\n        };\n        const queueSample = () => {\n            if (resizeFrame)\n                window.cancelAnimationFrame(resizeFrame);\n            resizeFrame = window.requestAnimationFrame(sampleText);\n        };\n        const handlePointerMove = (event) => {\n            const rect = canvas.getBoundingClientRect();\n            pointer.x = event.clientX - rect.left;\n            pointer.y = event.clientY - rect.top;\n            pointer.active = true;\n        };\n        const handlePointerLeave = () => {\n            pointer.active = false;\n        };\n        const handlePointerEnter = (event) => {\n            handlePointerMove(event);\n            if (trigger === 'hover')\n                startGather(true);\n        };\n        const handleClick = () => {\n            if (trigger === 'click')\n                startGather(true);\n        };\n        const reduceMotionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');\n        const handleReduceMotionChange = (event) => {\n            reducedMotion = event.matches;\n            void sampleText();\n        };\n        reduceMotionQuery?.addEventListener('change', handleReduceMotionChange);\n        canvas.addEventListener('pointerenter', handlePointerEnter);\n        canvas.addEventListener('pointermove', handlePointerMove);\n        canvas.addEventListener('pointerleave', handlePointerLeave);\n        canvas.addEventListener('click', handleClick);\n        const resizeObserver = new ResizeObserver(queueSample);\n        resizeObserver.observe(container);\n        void sampleText();\n        return () => {\n            buildId += 1;\n            resizeObserver.disconnect();\n            reduceMotionQuery?.removeEventListener('change', handleReduceMotionChange);\n            canvas.removeEventListener('pointerenter', handlePointerEnter);\n            canvas.removeEventListener('pointermove', handlePointerMove);\n            canvas.removeEventListener('pointerleave', handlePointerLeave);\n            canvas.removeEventListener('click', handleClick);\n            if (animationFrame !== null)\n                window.cancelAnimationFrame(animationFrame);\n            if (resizeFrame !== null)\n                window.cancelAnimationFrame(resizeFrame);\n        };\n    }, [\n        text,\n        particleSize,\n        density,\n        color,\n        highlightColor,\n        scatter,\n        gatherDuration,\n        stagger,\n        pointerRepel,\n        repelRadius,\n        idleDrift,\n        trigger,\n        fontSize,\n        fontWeight,\n        fontFamily,\n        glow\n    ]);\n    return (<div ref={containerRef} className={`relative block h-full min-h-[240px] w-full overflow-hidden touch-none ${className}`} style={style} aria-label={text}>\n      <canvas ref={canvasRef} className=\"absolute inset-0 block h-full w-full\" aria-hidden=\"true\"/>\n      <span className=\"sr-only\">{text}</span>\n    </div>);\n};\nexport default ParticleText;",
    "props": [
      {
        "name": "text",
        "type": "string",
        "default": "'React Bits'",
        "description": "The text content to display and animate."
      },
      {
        "name": "particleSize",
        "type": "number",
        "default": "2",
        "description": "Controls the particle size for the component animation."
      },
      {
        "name": "density",
        "type": "number",
        "default": "4",
        "description": "Controls the density for the component animation."
      },
      {
        "name": "color",
        "type": "string",
        "default": "'#ffffff'",
        "description": "Text or primary fill color."
      },
      {
        "name": "highlightColor",
        "type": "string",
        "default": "'#8b5cf6'",
        "description": "Controls the highlight color for the component animation."
      },
      {
        "name": "scatter",
        "type": "number",
        "default": "180",
        "description": "Controls the scatter for the component animation."
      },
      {
        "name": "gatherDuration",
        "type": "number",
        "default": "1600",
        "description": "Controls the gather duration for the component animation."
      },
      {
        "name": "stagger",
        "type": "number",
        "default": "420",
        "description": "Stagger delay in seconds between individual characters/elements."
      },
      {
        "name": "pointerRepel",
        "type": "number",
        "default": "40",
        "description": "Controls the pointer repel for the component animation."
      },
      {
        "name": "repelRadius",
        "type": "number",
        "default": "120",
        "description": "Controls the repel radius for the component animation."
      },
      {
        "name": "idleDrift",
        "type": "number",
        "default": "0.7",
        "description": "Controls the idle drift for the component animation."
      },
      {
        "name": "trigger",
        "type": "'mount' | 'hover' | 'click'",
        "default": "'mount'",
        "description": "Controls the trigger for the component animation."
      },
      {
        "name": "fontSize",
        "type": "number | string",
        "default": "'clamp(3rem, 12vw, 8rem)'",
        "description": "Font size in pixels, rems, or fluid clamp notation."
      },
      {
        "name": "fontWeight",
        "type": "number | string",
        "default": "800",
        "description": "Font weight (e.g., 400, 700, 900, 'bold')."
      },
      {
        "name": "fontFamily",
        "type": "string",
        "default": "'inherit'",
        "description": "Custom font family to apply to the rendered typography."
      },
      {
        "name": "glow",
        "type": "boolean",
        "default": "true",
        "description": "Controls the glow for the component animation."
      },
      {
        "name": "className",
        "type": "string",
        "default": "''",
        "description": "Additional CSS classes for styling and layout."
      },
      {
        "name": "style",
        "type": "CSSProperties",
        "default": "-",
        "description": "Controls the style for the component animation."
      }
    ]
  },
  "rotating-text": {
    "slug": "rotating-text",
    "name": "Rotating Text",
    "description": "Choreographed flipper cycling through multiple phrases with character or word level staggering and layout animations.",
    "dependencies": {
      "motion": "^12.23.12"
    },
    "installation": {
      "cliTs": "npx kibo add rotating-text",
      "cliJs": "npx kibo add rotating-text --js",
      "npm": "npm i motion",
      "pnpm": "pnpm add motion",
      "yarn": "yarn add motion",
      "bun": "bun add motion"
    },
    "usageTs": "import { RotatingText } from \"@/components/kibo/rotating-text/component\";\n\nexport default function Example() {\n  return (\n    <RotatingText />\n  );\n}",
    "usageJs": "import { RotatingText } from \"@/components/kibo/rotating-text/component\";\nexport default function Example() {\n    return (<RotatingText />);\n}",
    "componentSourceTs": "\"use client\";\n\nimport React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';\nimport {\n  motion,\n  AnimatePresence,\n  type Transition,\n  type VariantLabels,\n  type Target,\n  type TargetAndTransition\n} from 'motion/react';\n\nfunction cn(...classes: (string | undefined | null | boolean)[]): string {\n  return classes.filter(Boolean).join(' ');\n}\n\nexport interface RotatingTextRef {\n  next: () => void;\n  previous: () => void;\n  jumpTo: (index: number) => void;\n  reset: () => void;\n}\n\nexport interface RotatingTextProps\n  extends Omit<\n    React.ComponentPropsWithoutRef<typeof motion.span>,\n    'children' | 'transition' | 'initial' | 'animate' | 'exit'\n  > {\n  texts: string[];\n  transition?: Transition;\n  initial?: boolean | Target | VariantLabels;\n  animate?: boolean | VariantLabels | TargetAndTransition;\n  exit?: Target | VariantLabels;\n  animatePresenceMode?: 'sync' | 'wait';\n  animatePresenceInitial?: boolean;\n  rotationInterval?: number;\n  staggerDuration?: number;\n  staggerFrom?: 'first' | 'last' | 'center' | 'random' | number;\n  loop?: boolean;\n  auto?: boolean;\n  splitBy?: string;\n  onNext?: (index: number) => void;\n  mainClassName?: string;\n  splitLevelClassName?: string;\n  elementLevelClassName?: string;\n}\n\nexport const RotatingText = forwardRef<RotatingTextRef, RotatingTextProps>(\n  (\n    {\n      texts,\n      transition = { type: 'spring', damping: 25, stiffness: 300 },\n      initial = { y: '100%', opacity: 0 },\n      animate = { y: 0, opacity: 1 },\n      exit = { y: '-120%', opacity: 0 },\n      animatePresenceMode = 'wait',\n      animatePresenceInitial = false,\n      rotationInterval = 2000,\n      staggerDuration = 0,\n      staggerFrom = 'first',\n      loop = true,\n      auto = true,\n      splitBy = 'characters',\n      onNext,\n      mainClassName,\n      splitLevelClassName,\n      elementLevelClassName,\n      ...rest\n    },\n    ref\n  ) => {\n    const [currentTextIndex, setCurrentTextIndex] = useState<number>(0);\n\n    const splitIntoCharacters = (text: string): string[] => {\n      if (typeof Intl !== 'undefined' && Intl.Segmenter) {\n        const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });\n        return Array.from(segmenter.segment(text), segment => segment.segment);\n      }\n      return Array.from(text);\n    };\n\n    const elements = useMemo(() => {\n      const currentText: string = texts[currentTextIndex];\n      if (splitBy === 'characters') {\n        const words = currentText.split(' ');\n        return words.map((word, i) => ({\n          characters: splitIntoCharacters(word),\n          needsSpace: i !== words.length - 1\n        }));\n      }\n      if (splitBy === 'words') {\n        return currentText.split(' ').map((word, i, arr) => ({\n          characters: [word],\n          needsSpace: i !== arr.length - 1\n        }));\n      }\n      if (splitBy === 'lines') {\n        return currentText.split('\\n').map((line, i, arr) => ({\n          characters: [line],\n          needsSpace: i !== arr.length - 1\n        }));\n      }\n\n      return currentText.split(splitBy).map((part, i, arr) => ({\n        characters: [part],\n        needsSpace: i !== arr.length - 1\n      }));\n    }, [texts, currentTextIndex, splitBy]);\n\n    const getStaggerDelay = useCallback(\n      (index: number, totalChars: number): number => {\n        const total = totalChars;\n        if (staggerFrom === 'first') return index * staggerDuration;\n        if (staggerFrom === 'last') return (total - 1 - index) * staggerDuration;\n        if (staggerFrom === 'center') {\n          const center = Math.floor(total / 2);\n          return Math.abs(center - index) * staggerDuration;\n        }\n        if (staggerFrom === 'random') {\n          const randomIndex = Math.floor(Math.random() * total);\n          return Math.abs(randomIndex - index) * staggerDuration;\n        }\n        return Math.abs((staggerFrom as number) - index) * staggerDuration;\n      },\n      [staggerFrom, staggerDuration]\n    );\n\n    const handleIndexChange = useCallback(\n      (newIndex: number) => {\n        setCurrentTextIndex(newIndex);\n        if (onNext) onNext(newIndex);\n      },\n      [onNext]\n    );\n\n    const next = useCallback(() => {\n      const nextIndex = currentTextIndex === texts.length - 1 ? (loop ? 0 : currentTextIndex) : currentTextIndex + 1;\n      if (nextIndex !== currentTextIndex) {\n        handleIndexChange(nextIndex);\n      }\n    }, [currentTextIndex, texts.length, loop, handleIndexChange]);\n\n    const previous = useCallback(() => {\n      const prevIndex = currentTextIndex === 0 ? (loop ? texts.length - 1 : currentTextIndex) : currentTextIndex - 1;\n      if (prevIndex !== currentTextIndex) {\n        handleIndexChange(prevIndex);\n      }\n    }, [currentTextIndex, texts.length, loop, handleIndexChange]);\n\n    const jumpTo = useCallback(\n      (index: number) => {\n        const validIndex = Math.max(0, Math.min(index, texts.length - 1));\n        if (validIndex !== currentTextIndex) {\n          handleIndexChange(validIndex);\n        }\n      },\n      [texts.length, currentTextIndex, handleIndexChange]\n    );\n\n    const reset = useCallback(() => {\n      if (currentTextIndex !== 0) {\n        handleIndexChange(0);\n      }\n    }, [currentTextIndex, handleIndexChange]);\n\n    useImperativeHandle(\n      ref,\n      () => ({\n        next,\n        previous,\n        jumpTo,\n        reset\n      }),\n      [next, previous, jumpTo, reset]\n    );\n\n    useEffect(() => {\n      if (!auto) return;\n      const intervalId = setInterval(next, rotationInterval);\n      return () => clearInterval(intervalId);\n    }, [next, rotationInterval, auto]);\n\n    return (\n      <motion.span\n        className={cn('flex flex-wrap whitespace-pre-wrap relative', mainClassName)}\n        {...rest}\n        layout\n        transition={transition}\n      >\n        <span className=\"sr-only\">{texts[currentTextIndex]}</span>\n        <AnimatePresence mode={animatePresenceMode} initial={animatePresenceInitial}>\n          <motion.span\n            key={currentTextIndex}\n            className={cn(splitBy === 'lines' ? 'flex flex-col w-full' : 'flex flex-wrap whitespace-pre-wrap relative')}\n            layout\n            aria-hidden=\"true\"\n          >\n            {elements.map((wordObj, wordIndex, array) => {\n              const previousCharsCount = array\n                .slice(0, wordIndex)\n                .reduce((sum, word) => sum + word.characters.length, 0);\n              return (\n                <span key={wordIndex} className={cn('inline-flex', splitLevelClassName)}>\n                  {wordObj.characters.map((char, charIndex) => (\n                    <motion.span\n                      key={charIndex}\n                      initial={initial}\n                      animate={animate}\n                      exit={exit}\n                      transition={{\n                        ...transition,\n                        delay: getStaggerDelay(\n                          previousCharsCount + charIndex,\n                          array.reduce((sum, word) => sum + word.characters.length, 0)\n                        )\n                      }}\n                      className={cn('inline-block', elementLevelClassName)}\n                    >\n                      {char}\n                    </motion.span>\n                  ))}\n                  {wordObj.needsSpace && <span className=\"whitespace-pre\"> </span>}\n                </span>\n              );\n            })}\n          </motion.span>\n        </AnimatePresence>\n      </motion.span>\n    );\n  }\n);\n\nRotatingText.displayName = 'RotatingText';\nexport default RotatingText;",
    "componentSourceJs": "\"use client\";\nimport React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';\nimport { motion, AnimatePresence } from 'motion/react';\nfunction cn(...classes) {\n    return classes.filter(Boolean).join(' ');\n}\nexport const RotatingText = forwardRef(({ texts, transition = { type: 'spring', damping: 25, stiffness: 300 }, initial = { y: '100%', opacity: 0 }, animate = { y: 0, opacity: 1 }, exit = { y: '-120%', opacity: 0 }, animatePresenceMode = 'wait', animatePresenceInitial = false, rotationInterval = 2000, staggerDuration = 0, staggerFrom = 'first', loop = true, auto = true, splitBy = 'characters', onNext, mainClassName, splitLevelClassName, elementLevelClassName, ...rest }, ref) => {\n    const [currentTextIndex, setCurrentTextIndex] = useState(0);\n    const splitIntoCharacters = (text) => {\n        if (typeof Intl !== 'undefined' && Intl.Segmenter) {\n            const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });\n            return Array.from(segmenter.segment(text), segment => segment.segment);\n        }\n        return Array.from(text);\n    };\n    const elements = useMemo(() => {\n        const currentText = texts[currentTextIndex];\n        if (splitBy === 'characters') {\n            const words = currentText.split(' ');\n            return words.map((word, i) => ({\n                characters: splitIntoCharacters(word),\n                needsSpace: i !== words.length - 1\n            }));\n        }\n        if (splitBy === 'words') {\n            return currentText.split(' ').map((word, i, arr) => ({\n                characters: [word],\n                needsSpace: i !== arr.length - 1\n            }));\n        }\n        if (splitBy === 'lines') {\n            return currentText.split('\\n').map((line, i, arr) => ({\n                characters: [line],\n                needsSpace: i !== arr.length - 1\n            }));\n        }\n        return currentText.split(splitBy).map((part, i, arr) => ({\n            characters: [part],\n            needsSpace: i !== arr.length - 1\n        }));\n    }, [texts, currentTextIndex, splitBy]);\n    const getStaggerDelay = useCallback((index, totalChars) => {\n        const total = totalChars;\n        if (staggerFrom === 'first')\n            return index * staggerDuration;\n        if (staggerFrom === 'last')\n            return (total - 1 - index) * staggerDuration;\n        if (staggerFrom === 'center') {\n            const center = Math.floor(total / 2);\n            return Math.abs(center - index) * staggerDuration;\n        }\n        if (staggerFrom === 'random') {\n            const randomIndex = Math.floor(Math.random() * total);\n            return Math.abs(randomIndex - index) * staggerDuration;\n        }\n        return Math.abs(staggerFrom - index) * staggerDuration;\n    }, [staggerFrom, staggerDuration]);\n    const handleIndexChange = useCallback((newIndex) => {\n        setCurrentTextIndex(newIndex);\n        if (onNext)\n            onNext(newIndex);\n    }, [onNext]);\n    const next = useCallback(() => {\n        const nextIndex = currentTextIndex === texts.length - 1 ? (loop ? 0 : currentTextIndex) : currentTextIndex + 1;\n        if (nextIndex !== currentTextIndex) {\n            handleIndexChange(nextIndex);\n        }\n    }, [currentTextIndex, texts.length, loop, handleIndexChange]);\n    const previous = useCallback(() => {\n        const prevIndex = currentTextIndex === 0 ? (loop ? texts.length - 1 : currentTextIndex) : currentTextIndex - 1;\n        if (prevIndex !== currentTextIndex) {\n            handleIndexChange(prevIndex);\n        }\n    }, [currentTextIndex, texts.length, loop, handleIndexChange]);\n    const jumpTo = useCallback((index) => {\n        const validIndex = Math.max(0, Math.min(index, texts.length - 1));\n        if (validIndex !== currentTextIndex) {\n            handleIndexChange(validIndex);\n        }\n    }, [texts.length, currentTextIndex, handleIndexChange]);\n    const reset = useCallback(() => {\n        if (currentTextIndex !== 0) {\n            handleIndexChange(0);\n        }\n    }, [currentTextIndex, handleIndexChange]);\n    useImperativeHandle(ref, () => ({\n        next,\n        previous,\n        jumpTo,\n        reset\n    }), [next, previous, jumpTo, reset]);\n    useEffect(() => {\n        if (!auto)\n            return;\n        const intervalId = setInterval(next, rotationInterval);\n        return () => clearInterval(intervalId);\n    }, [next, rotationInterval, auto]);\n    return (<motion.span className={cn('flex flex-wrap whitespace-pre-wrap relative', mainClassName)} {...rest} layout transition={transition}>\n        <span className=\"sr-only\">{texts[currentTextIndex]}</span>\n        <AnimatePresence mode={animatePresenceMode} initial={animatePresenceInitial}>\n          <motion.span key={currentTextIndex} className={cn(splitBy === 'lines' ? 'flex flex-col w-full' : 'flex flex-wrap whitespace-pre-wrap relative')} layout aria-hidden=\"true\">\n            {elements.map((wordObj, wordIndex, array) => {\n            const previousCharsCount = array\n                .slice(0, wordIndex)\n                .reduce((sum, word) => sum + word.characters.length, 0);\n            return (<span key={wordIndex} className={cn('inline-flex', splitLevelClassName)}>\n                  {wordObj.characters.map((char, charIndex) => (<motion.span key={charIndex} initial={initial} animate={animate} exit={exit} transition={{\n                        ...transition,\n                        delay: getStaggerDelay(previousCharsCount + charIndex, array.reduce((sum, word) => sum + word.characters.length, 0))\n                    }} className={cn('inline-block', elementLevelClassName)}>\n                      {char}\n                    </motion.span>))}\n                  {wordObj.needsSpace && <span className=\"whitespace-pre\"> </span>}\n                </span>);\n        })}\n          </motion.span>\n        </AnimatePresence>\n      </motion.span>);\n});\nRotatingText.displayName = 'RotatingText';\nexport default RotatingText;",
    "props": [
      {
        "name": "texts",
        "type": "string[]",
        "default": "-",
        "description": "Controls the texts for the component animation."
      },
      {
        "name": "transition",
        "type": "Transition",
        "default": "{ type: 'spring', damping: 25, stiffness: 300 }",
        "description": "Controls the transition for the component animation."
      },
      {
        "name": "initial",
        "type": "boolean | Target | VariantLabels",
        "default": "{ y: '100%', opacity: 0 }",
        "description": "Controls the initial for the component animation."
      },
      {
        "name": "animate",
        "type": "boolean | VariantLabels | TargetAndTransition",
        "default": "{ y: 0, opacity: 1 }",
        "description": "Controls the animate for the component animation."
      },
      {
        "name": "exit",
        "type": "Target | VariantLabels",
        "default": "{ y: '-120%', opacity: 0 }",
        "description": "Controls the exit for the component animation."
      },
      {
        "name": "animatePresenceMode",
        "type": "'sync' | 'wait'",
        "default": "'wait'",
        "description": "Controls the animate presence mode for the component animation."
      },
      {
        "name": "animatePresenceInitial",
        "type": "boolean",
        "default": "false",
        "description": "Controls the animate presence initial for the component animation."
      },
      {
        "name": "rotationInterval",
        "type": "number",
        "default": "2000",
        "description": "Controls the rotation interval for the component animation."
      },
      {
        "name": "staggerDuration",
        "type": "number",
        "default": "0",
        "description": "Controls the stagger duration for the component animation."
      },
      {
        "name": "staggerFrom",
        "type": "'first' | 'last' | 'center' | 'random' | number",
        "default": "'first'",
        "description": "Controls the stagger from for the component animation."
      },
      {
        "name": "loop",
        "type": "boolean",
        "default": "true",
        "description": "Controls the loop for the component animation."
      },
      {
        "name": "auto",
        "type": "boolean",
        "default": "true",
        "description": "Controls the auto for the component animation."
      },
      {
        "name": "splitBy",
        "type": "string",
        "default": "'characters'",
        "description": "Controls the split by for the component animation."
      },
      {
        "name": "onNext",
        "type": "(index: number) => void",
        "default": "-",
        "description": "Controls the on next for the component animation."
      },
      {
        "name": "mainClassName",
        "type": "string",
        "default": "-",
        "description": "Controls the main class name for the component animation."
      },
      {
        "name": "splitLevelClassName",
        "type": "string",
        "default": "-",
        "description": "Controls the split level class name for the component animation."
      },
      {
        "name": "elementLevelClassName",
        "type": "string",
        "default": "-",
        "description": "Controls the element level class name for the component animation."
      }
    ]
  },
  "scrambled-text": {
    "slug": "scrambled-text",
    "name": "Scrambled Text",
    "description": "Proximity-based character scrambler that dynamically distorts and decrypts glyphs as the cursor sweeps past.",
    "dependencies": {},
    "installation": {
      "cliTs": "npx kibo add scrambled-text",
      "cliJs": "npx kibo add scrambled-text --js",
      "npm": "npx kibo add scrambled-text",
      "pnpm": "pnpm dlx kibo add scrambled-text",
      "yarn": "yarn add scrambled-text",
      "bun": "bunx kibo add scrambled-text"
    },
    "usageTs": "import { ScrambledText } from \"@/components/kibo/scrambled-text/component\";\n\nexport default function Example() {\n  return (\n    <ScrambledText />\n  );\n}",
    "usageJs": "import { ScrambledText } from \"@/components/kibo/scrambled-text/component\";\nexport default function Example() {\n    return (<ScrambledText />);\n}",
    "componentSourceTs": "\"use client\";\n\nimport React, { useEffect, useRef, useMemo } from 'react';\n\nexport interface ScrambledTextProps {\n  radius?: number;\n  duration?: number;\n  speed?: number;\n  scrambleChars?: string;\n  className?: string;\n  style?: React.CSSProperties;\n  children: string;\n}\n\nexport function ScrambledText({\n  radius = 100,\n  duration = 1.2,\n  speed = 0.5,\n  scrambleChars = '.:!#@$%^&*()_+~|}{[]',\n  className = '',\n  style = {},\n  children\n}: ScrambledTextProps) {\n  const rootRef = useRef<HTMLDivElement | null>(null);\n  const charsRef = useRef<(HTMLSpanElement | null)[]>([]);\n  const originalChars = useMemo(() => children.split(''), [children]);\n\n  useEffect(() => {\n    const el = rootRef.current;\n    if (!el) return;\n\n    const intervals = new Map<number, NodeJS.Timeout>();\n    const timeouts = new Map<number, NodeJS.Timeout>();\n\n    const handlePointerMove = (e: PointerEvent) => {\n      charsRef.current.forEach((span, idx) => {\n        if (!span) return;\n        const rect = span.getBoundingClientRect();\n        const centerX = rect.left + rect.width / 2;\n        const centerY = rect.top + rect.height / 2;\n        const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);\n\n        if (dist < radius && !intervals.has(idx)) {\n          const origChar = originalChars[idx];\n          if (origChar === ' ' || origChar === '\\n') return;\n\n          const intervalTime = Math.max(30, Math.floor(100 * speed));\n          const intervalId = setInterval(() => {\n            const randomChar = scrambleChars[Math.floor(Math.random() * scrambleChars.length)];\n            span.textContent = randomChar;\n          }, intervalTime);\n\n          intervals.set(idx, intervalId);\n\n          const restoreDelay = (duration * 1000) * (1 - dist / radius);\n          const timeoutId = setTimeout(() => {\n            clearInterval(intervals.get(idx));\n            intervals.delete(idx);\n            span.textContent = origChar;\n            timeouts.delete(idx);\n          }, restoreDelay);\n\n          timeouts.set(idx, timeoutId);\n        }\n      });\n    };\n\n    el.addEventListener('pointermove', handlePointerMove);\n\n    return () => {\n      el.removeEventListener('pointermove', handlePointerMove);\n      intervals.forEach(id => clearInterval(id));\n      timeouts.forEach(id => clearTimeout(id));\n    };\n  }, [radius, duration, speed, scrambleChars, originalChars]);\n\n  return (\n    <div\n      ref={rootRef}\n      className={`font-mono text-white select-none inline-block ${className}`}\n      style={style}\n    >\n      <p className=\"flex flex-wrap\">\n        {originalChars.map((char, index) => (\n          <span\n            key={index}\n            ref={el => { charsRef.current[index] = el; }}\n            className=\"inline-block transition-colors will-change-transform\"\n          >\n            {char === ' ' ? '\\u00A0' : char}\n          </span>\n        ))}\n      </p>\n    </div>\n  );\n}\n\nexport default ScrambledText;\n",
    "componentSourceJs": "\"use client\";\nimport React, { useEffect, useRef, useMemo } from 'react';\nexport function ScrambledText({ radius = 100, duration = 1.2, speed = 0.5, scrambleChars = '.:!#@$%^&*()_+~|}{[]', className = '', style = {}, children }) {\n    const rootRef = useRef(null);\n    const charsRef = useRef([]);\n    const originalChars = useMemo(() => children.split(''), [children]);\n    useEffect(() => {\n        const el = rootRef.current;\n        if (!el)\n            return;\n        const intervals = new Map();\n        const timeouts = new Map();\n        const handlePointerMove = (e) => {\n            charsRef.current.forEach((span, idx) => {\n                if (!span)\n                    return;\n                const rect = span.getBoundingClientRect();\n                const centerX = rect.left + rect.width / 2;\n                const centerY = rect.top + rect.height / 2;\n                const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);\n                if (dist < radius && !intervals.has(idx)) {\n                    const origChar = originalChars[idx];\n                    if (origChar === ' ' || origChar === '\\n')\n                        return;\n                    const intervalTime = Math.max(30, Math.floor(100 * speed));\n                    const intervalId = setInterval(() => {\n                        const randomChar = scrambleChars[Math.floor(Math.random() * scrambleChars.length)];\n                        span.textContent = randomChar;\n                    }, intervalTime);\n                    intervals.set(idx, intervalId);\n                    const restoreDelay = (duration * 1000) * (1 - dist / radius);\n                    const timeoutId = setTimeout(() => {\n                        clearInterval(intervals.get(idx));\n                        intervals.delete(idx);\n                        span.textContent = origChar;\n                        timeouts.delete(idx);\n                    }, restoreDelay);\n                    timeouts.set(idx, timeoutId);\n                }\n            });\n        };\n        el.addEventListener('pointermove', handlePointerMove);\n        return () => {\n            el.removeEventListener('pointermove', handlePointerMove);\n            intervals.forEach(id => clearInterval(id));\n            timeouts.forEach(id => clearTimeout(id));\n        };\n    }, [radius, duration, speed, scrambleChars, originalChars]);\n    return (<div ref={rootRef} className={`font-mono text-white select-none inline-block ${className}`} style={style}>\n      <p className=\"flex flex-wrap\">\n        {originalChars.map((char, index) => (<span key={index} ref={el => { charsRef.current[index] = el; }} className=\"inline-block transition-colors will-change-transform\">\n            {char === ' ' ? '\\u00A0' : char}\n          </span>))}\n      </p>\n    </div>);\n}\nexport default ScrambledText;",
    "props": [
      {
        "name": "radius",
        "type": "number",
        "default": "100",
        "description": "Effect calculation radius in pixels from cursor position."
      },
      {
        "name": "duration",
        "type": "number",
        "default": "1.2",
        "description": "Duration of the animation in seconds or milliseconds."
      },
      {
        "name": "speed",
        "type": "number",
        "default": "0.5",
        "description": "Speed multiplier for the motion playback."
      },
      {
        "name": "scrambleChars",
        "type": "string",
        "default": "'.:!#@$%^&*()_+~|}{[]'",
        "description": "Controls the scramble chars for the component animation."
      },
      {
        "name": "className",
        "type": "string",
        "default": "''",
        "description": "Additional CSS classes for styling and layout."
      },
      {
        "name": "style",
        "type": "React.CSSProperties",
        "default": "{}",
        "description": "Controls the style for the component animation."
      },
      {
        "name": "children",
        "type": "string",
        "default": "-",
        "description": "Child elements or content to render inside the component."
      }
    ]
  },
  "scroll-float": {
    "slug": "scroll-float",
    "name": "Scroll Float",
    "description": "Weightless typography effect where characters float smoothly upwards with spring physics as user scrolls.",
    "dependencies": {
      "gsap": "^3.13.0"
    },
    "installation": {
      "cliTs": "npx kibo add scroll-float",
      "cliJs": "npx kibo add scroll-float --js",
      "npm": "npm i gsap",
      "pnpm": "pnpm add gsap",
      "yarn": "yarn add gsap",
      "bun": "bun add gsap"
    },
    "usageTs": "import { ScrollFloat } from \"@/components/kibo/scroll-float/component\";\n\nexport default function Example() {\n  return (\n    <ScrollFloat />\n  );\n}",
    "usageJs": "import { ScrollFloat } from \"@/components/kibo/scroll-float/component\";\nexport default function Example() {\n    return (<ScrollFloat />);\n}",
    "componentSourceTs": "\"use client\";\n\nimport React, { useEffect, useMemo, useRef, type ReactNode, type RefObject } from 'react';\nimport { gsap } from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';\n\ngsap.registerPlugin(ScrollTrigger);\n\ninterface ScrollFloatProps {\n  children: ReactNode;\n  scrollContainerRef?: RefObject<HTMLElement | null>;\n  containerClassName?: string;\n  textClassName?: string;\n  animationDuration?: number;\n  ease?: string;\n  scrollStart?: string;\n  scrollEnd?: string;\n  stagger?: number;\n  triggerOnHover?: boolean;\n}\n\nexport const ScrollFloat: React.FC<ScrollFloatProps> = ({\n  children,\n  scrollContainerRef,\n  containerClassName = '',\n  textClassName = '',\n  animationDuration = 0.8,\n  ease = 'back.out(2)',\n  scrollStart = 'top bottom+=40%',\n  scrollEnd = 'bottom bottom-=40%',\n  stagger = 0.025,\n  triggerOnHover = true\n}) => {\n  const containerRef = useRef<HTMLHeadingElement>(null);\n\n  const splitText = useMemo(() => {\n    const text = typeof children === 'string' ? children : '';\n    return text.split('').map((char, index) => (\n      <span className=\"inline-block char-item will-change-transform\" key={index}>\n        {char === ' ' ? '\\u00A0' : char}\n      </span>\n    ));\n  }, [children]);\n\n  useEffect(() => {\n    const el = containerRef.current;\n    if (!el) return;\n\n    const charElements = el.querySelectorAll<HTMLElement>('.char-item');\n    if (!charElements.length) return;\n\n    const playFloat = () => {\n      gsap.fromTo(\n        charElements,\n        {\n          opacity: 0,\n          yPercent: 120,\n          scaleY: 2.2,\n          scaleX: 0.75,\n          transformOrigin: '50% 0%'\n        },\n        {\n          duration: animationDuration,\n          ease: ease,\n          opacity: 1,\n          yPercent: 0,\n          scaleY: 1,\n          scaleX: 1,\n          stagger: stagger,\n          force3D: true\n        }\n      );\n    };\n\n    const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;\n\n    const st = ScrollTrigger.create({\n      trigger: el,\n      scroller,\n      start: scrollStart,\n      end: scrollEnd,\n      scrub: true,\n      animation: gsap.fromTo(\n        charElements,\n        {\n          opacity: 0,\n          yPercent: 120,\n          scaleY: 2.2,\n          scaleX: 0.75,\n          transformOrigin: '50% 0%'\n        },\n        {\n          duration: animationDuration,\n          ease: ease,\n          opacity: 1,\n          yPercent: 0,\n          scaleY: 1,\n          scaleX: 1,\n          stagger: stagger\n        }\n      )\n    });\n\n    playFloat();\n\n    const handleMouseEnter = () => {\n      if (triggerOnHover) {\n        playFloat();\n      }\n    };\n\n    el.addEventListener('mouseenter', handleMouseEnter);\n\n    return () => {\n      st.kill();\n      el.removeEventListener('mouseenter', handleMouseEnter);\n    };\n  }, [scrollContainerRef, animationDuration, ease, scrollStart, scrollEnd, stagger, triggerOnHover]);\n\n  return (\n    <h2 ref={containerRef} className={`overflow-hidden cursor-pointer ${containerClassName}`}>\n      <span className={`inline-block leading-[1.4] ${textClassName}`}>{splitText}</span>\n    </h2>\n  );\n};\n\nexport default ScrollFloat;",
    "componentSourceJs": "\"use client\";\nimport React, { useEffect, useMemo, useRef } from 'react';\nimport { gsap } from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';\ngsap.registerPlugin(ScrollTrigger);\nexport const ScrollFloat = ({ children, scrollContainerRef, containerClassName = '', textClassName = '', animationDuration = 0.8, ease = 'back.out(2)', scrollStart = 'top bottom+=40%', scrollEnd = 'bottom bottom-=40%', stagger = 0.025, triggerOnHover = true }) => {\n    const containerRef = useRef(null);\n    const splitText = useMemo(() => {\n        const text = typeof children === 'string' ? children : '';\n        return text.split('').map((char, index) => (<span className=\"inline-block char-item will-change-transform\" key={index}>\n        {char === ' ' ? '\\u00A0' : char}\n      </span>));\n    }, [children]);\n    useEffect(() => {\n        const el = containerRef.current;\n        if (!el)\n            return;\n        const charElements = el.querySelectorAll('.char-item');\n        if (!charElements.length)\n            return;\n        const playFloat = () => {\n            gsap.fromTo(charElements, {\n                opacity: 0,\n                yPercent: 120,\n                scaleY: 2.2,\n                scaleX: 0.75,\n                transformOrigin: '50% 0%'\n            }, {\n                duration: animationDuration,\n                ease: ease,\n                opacity: 1,\n                yPercent: 0,\n                scaleY: 1,\n                scaleX: 1,\n                stagger: stagger,\n                force3D: true\n            });\n        };\n        const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;\n        const st = ScrollTrigger.create({\n            trigger: el,\n            scroller,\n            start: scrollStart,\n            end: scrollEnd,\n            scrub: true,\n            animation: gsap.fromTo(charElements, {\n                opacity: 0,\n                yPercent: 120,\n                scaleY: 2.2,\n                scaleX: 0.75,\n                transformOrigin: '50% 0%'\n            }, {\n                duration: animationDuration,\n                ease: ease,\n                opacity: 1,\n                yPercent: 0,\n                scaleY: 1,\n                scaleX: 1,\n                stagger: stagger\n            })\n        });\n        playFloat();\n        const handleMouseEnter = () => {\n            if (triggerOnHover) {\n                playFloat();\n            }\n        };\n        el.addEventListener('mouseenter', handleMouseEnter);\n        return () => {\n            st.kill();\n            el.removeEventListener('mouseenter', handleMouseEnter);\n        };\n    }, [scrollContainerRef, animationDuration, ease, scrollStart, scrollEnd, stagger, triggerOnHover]);\n    return (<h2 ref={containerRef} className={`overflow-hidden cursor-pointer ${containerClassName}`}>\n      <span className={`inline-block leading-[1.4] ${textClassName}`}>{splitText}</span>\n    </h2>);\n};\nexport default ScrollFloat;",
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "default": "-",
        "description": "Child elements or content to render inside the component."
      },
      {
        "name": "scrollContainerRef",
        "type": "RefObject<HTMLElement | null>",
        "default": "-",
        "description": "Optional RefObject to a scrollable container element."
      },
      {
        "name": "containerClassName",
        "type": "string",
        "default": "''",
        "description": "Additional CSS classes for the outer wrapper container."
      },
      {
        "name": "textClassName",
        "type": "string",
        "default": "''",
        "description": "Additional CSS classes applied directly to the text elements."
      },
      {
        "name": "animationDuration",
        "type": "number",
        "default": "0.8",
        "description": "Controls the animation duration for the component animation."
      },
      {
        "name": "ease",
        "type": "string",
        "default": "'back.out(2)'",
        "description": "GSAP or cubic-bezier easing curve for animation smoothing."
      },
      {
        "name": "scrollStart",
        "type": "string",
        "default": "'top bottom+=40%'",
        "description": "ScrollTrigger starting threshold string (e.g., 'top 85%')."
      },
      {
        "name": "scrollEnd",
        "type": "string",
        "default": "'bottom bottom-=40%'",
        "description": "ScrollTrigger ending threshold string (e.g., 'bottom 40%')."
      },
      {
        "name": "stagger",
        "type": "number",
        "default": "0.025",
        "description": "Stagger delay in seconds between individual characters/elements."
      },
      {
        "name": "triggerOnHover",
        "type": "boolean",
        "default": "true",
        "description": "Controls the trigger on hover for the component animation."
      }
    ]
  },
  "scroll-reveal": {
    "slug": "scroll-reveal",
    "name": "Scroll Reveal",
    "description": "Progressive word-by-word opacity and blur reveal anchored to scroll position with customizable thresholds.",
    "dependencies": {
      "gsap": "^3.13.0"
    },
    "installation": {
      "cliTs": "npx kibo add scroll-reveal",
      "cliJs": "npx kibo add scroll-reveal --js",
      "npm": "npm i gsap",
      "pnpm": "pnpm add gsap",
      "yarn": "yarn add gsap",
      "bun": "bun add gsap"
    },
    "usageTs": "import { ScrollReveal } from \"@/components/kibo/scroll-reveal/component\";\n\nexport default function Example() {\n  return (\n    <ScrollReveal />\n  );\n}",
    "usageJs": "import { ScrollReveal } from \"@/components/kibo/scroll-reveal/component\";\nexport default function Example() {\n    return (<ScrollReveal />);\n}",
    "componentSourceTs": "\"use client\";\n\nimport React, { useEffect, useRef, useMemo, type ReactNode, type RefObject } from 'react';\nimport { gsap } from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';\n\ngsap.registerPlugin(ScrollTrigger);\n\ninterface ScrollRevealProps {\n  children: ReactNode;\n  scrollContainerRef?: RefObject<HTMLElement | null>;\n  enableBlur?: boolean;\n  baseOpacity?: number;\n  baseRotation?: number;\n  blurStrength?: number;\n  containerClassName?: string;\n  textClassName?: string;\n  scrollStart?: string;\n  rotationEnd?: string;\n  wordAnimationEnd?: string;\n}\n\nexport const ScrollReveal: React.FC<ScrollRevealProps> = ({\n  children,\n  scrollContainerRef,\n  enableBlur = true,\n  baseOpacity = 0.1,\n  baseRotation = 3,\n  blurStrength = 4,\n  containerClassName = '',\n  textClassName = '',\n  scrollStart = 'top 90%',\n  rotationEnd = 'top 40%',\n  wordAnimationEnd = 'top 40%'\n}) => {\n  const containerRef = useRef<HTMLHeadingElement>(null);\n\n  const splitText = useMemo(() => {\n    const text = typeof children === 'string' ? children : '';\n    return text.split(/(\\s+)/).map((word, index) => {\n      if (word.match(/^\\s+$/)) return word;\n      return (\n        <span className=\"inline-block word\" key={index}>\n          {word}\n        </span>\n      );\n    });\n  }, [children]);\n\n  useEffect(() => {\n    const el = containerRef.current;\n    if (!el) return;\n\n    const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;\n\n    const ctx = gsap.context(() => {\n      gsap.fromTo(\n        el,\n        { transformOrigin: '0% 50%', rotate: baseRotation },\n        {\n          ease: 'none',\n          rotate: 0,\n          scrollTrigger: {\n            trigger: el,\n            scroller,\n            start: scrollStart,\n            end: rotationEnd,\n            scrub: true\n          }\n        }\n      );\n\n      const wordElements = el.querySelectorAll<HTMLElement>('.word');\n\n      gsap.fromTo(\n        wordElements,\n        { opacity: baseOpacity, willChange: 'opacity' },\n        {\n          ease: 'none',\n          opacity: 1,\n          stagger: 0.05,\n          scrollTrigger: {\n            trigger: el,\n            scroller,\n            start: scrollStart,\n            end: wordAnimationEnd,\n            scrub: true\n          }\n        }\n      );\n\n      if (enableBlur) {\n        gsap.fromTo(\n          wordElements,\n          { filter: `blur(${blurStrength}px)` },\n          {\n            ease: 'none',\n            filter: 'blur(0px)',\n            stagger: 0.05,\n            scrollTrigger: {\n              trigger: el,\n              scroller,\n              start: scrollStart,\n              end: wordAnimationEnd,\n              scrub: true\n            }\n          }\n        );\n      }\n    }, containerRef);\n\n    return () => {\n      ctx.revert();\n    };\n  }, [scrollContainerRef, enableBlur, baseRotation, baseOpacity, scrollStart, rotationEnd, wordAnimationEnd, blurStrength]);\n\n  return (\n    <h2 ref={containerRef} className={`cursor-pointer ${containerClassName}`}>\n      <span className={`inline-block leading-[1.5] font-semibold ${textClassName}`}>{splitText}</span>\n    </h2>\n  );\n};\n\nexport default ScrollReveal;",
    "componentSourceJs": "\"use client\";\nimport React, { useEffect, useRef, useMemo } from 'react';\nimport { gsap } from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';\ngsap.registerPlugin(ScrollTrigger);\nexport const ScrollReveal = ({ children, scrollContainerRef, enableBlur = true, baseOpacity = 0.1, baseRotation = 3, blurStrength = 4, containerClassName = '', textClassName = '', scrollStart = 'top 90%', rotationEnd = 'top 40%', wordAnimationEnd = 'top 40%' }) => {\n    const containerRef = useRef(null);\n    const splitText = useMemo(() => {\n        const text = typeof children === 'string' ? children : '';\n        return text.split(/(\\s+)/).map((word, index) => {\n            if (word.match(/^\\s+$/))\n                return word;\n            return (<span className=\"inline-block word\" key={index}>\n          {word}\n        </span>);\n        });\n    }, [children]);\n    useEffect(() => {\n        const el = containerRef.current;\n        if (!el)\n            return;\n        const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;\n        const ctx = gsap.context(() => {\n            gsap.fromTo(el, { transformOrigin: '0% 50%', rotate: baseRotation }, {\n                ease: 'none',\n                rotate: 0,\n                scrollTrigger: {\n                    trigger: el,\n                    scroller,\n                    start: scrollStart,\n                    end: rotationEnd,\n                    scrub: true\n                }\n            });\n            const wordElements = el.querySelectorAll('.word');\n            gsap.fromTo(wordElements, { opacity: baseOpacity, willChange: 'opacity' }, {\n                ease: 'none',\n                opacity: 1,\n                stagger: 0.05,\n                scrollTrigger: {\n                    trigger: el,\n                    scroller,\n                    start: scrollStart,\n                    end: wordAnimationEnd,\n                    scrub: true\n                }\n            });\n            if (enableBlur) {\n                gsap.fromTo(wordElements, { filter: `blur(${blurStrength}px)` }, {\n                    ease: 'none',\n                    filter: 'blur(0px)',\n                    stagger: 0.05,\n                    scrollTrigger: {\n                        trigger: el,\n                        scroller,\n                        start: scrollStart,\n                        end: wordAnimationEnd,\n                        scrub: true\n                    }\n                });\n            }\n        }, containerRef);\n        return () => {\n            ctx.revert();\n        };\n    }, [scrollContainerRef, enableBlur, baseRotation, baseOpacity, scrollStart, rotationEnd, wordAnimationEnd, blurStrength]);\n    return (<h2 ref={containerRef} className={`cursor-pointer ${containerClassName}`}>\n      <span className={`inline-block leading-[1.5] font-semibold ${textClassName}`}>{splitText}</span>\n    </h2>);\n};\nexport default ScrollReveal;",
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "default": "-",
        "description": "Child elements or content to render inside the component."
      },
      {
        "name": "scrollContainerRef",
        "type": "RefObject<HTMLElement | null>",
        "default": "-",
        "description": "Optional RefObject to a scrollable container element."
      },
      {
        "name": "enableBlur",
        "type": "boolean",
        "default": "true",
        "description": "Whether to enable progressive blur-to-sharp animation."
      },
      {
        "name": "baseOpacity",
        "type": "number",
        "default": "0.1",
        "description": "Controls the base opacity for the component animation."
      },
      {
        "name": "baseRotation",
        "type": "number",
        "default": "3",
        "description": "Controls the base rotation for the component animation."
      },
      {
        "name": "blurStrength",
        "type": "number",
        "default": "4",
        "description": "Peak blur amount in pixels."
      },
      {
        "name": "containerClassName",
        "type": "string",
        "default": "''",
        "description": "Additional CSS classes for the outer wrapper container."
      },
      {
        "name": "textClassName",
        "type": "string",
        "default": "''",
        "description": "Additional CSS classes applied directly to the text elements."
      },
      {
        "name": "scrollStart",
        "type": "string",
        "default": "'top 90%'",
        "description": "ScrollTrigger starting threshold string (e.g., 'top 85%')."
      },
      {
        "name": "rotationEnd",
        "type": "string",
        "default": "'top 40%'",
        "description": "Controls the rotation end for the component animation."
      },
      {
        "name": "wordAnimationEnd",
        "type": "string",
        "default": "'top 40%'",
        "description": "Controls the word animation end for the component animation."
      }
    ]
  },
  "scroll-velocity": {
    "slug": "scroll-velocity",
    "name": "Scroll Velocity",
    "description": "Infinite bi-directional marquee text banners accelerating and decelerating dynamically based on page scroll velocity.",
    "dependencies": {
      "motion": "^12.23.12"
    },
    "installation": {
      "cliTs": "npx kibo add scroll-velocity",
      "cliJs": "npx kibo add scroll-velocity --js",
      "npm": "npm i motion",
      "pnpm": "pnpm add motion",
      "yarn": "yarn add motion",
      "bun": "bun add motion"
    },
    "usageTs": "import { ScrollVelocity } from \"@/components/kibo/scroll-velocity/component\";\n\nexport default function Example() {\n  return (\n    <ScrollVelocity />\n  );\n}",
    "usageJs": "import { ScrollVelocity } from \"@/components/kibo/scroll-velocity/component\";\nexport default function Example() {\n    return (<ScrollVelocity />);\n}",
    "componentSourceTs": "\"use client\";\n\nimport React, { useRef, useLayoutEffect, useState } from 'react';\nimport {\n  motion,\n  useScroll,\n  useSpring,\n  useTransform,\n  useMotionValue,\n  useVelocity,\n  useAnimationFrame\n} from 'motion/react';\n\ninterface VelocityMapping {\n  input: [number, number];\n  output: [number, number];\n}\n\ninterface VelocityTextProps {\n  children: React.ReactNode;\n  baseVelocity: number;\n  scrollContainerRef?: React.RefObject<HTMLElement>;\n  className?: string;\n  damping?: number;\n  stiffness?: number;\n  numCopies?: number;\n  velocityMapping?: VelocityMapping;\n  parallaxClassName?: string;\n  scrollerClassName?: string;\n  parallaxStyle?: React.CSSProperties;\n  scrollerStyle?: React.CSSProperties;\n}\n\ninterface ScrollVelocityProps {\n  scrollContainerRef?: React.RefObject<HTMLElement>;\n  texts: React.ReactNode[];\n  velocity?: number;\n  className?: string;\n  damping?: number;\n  stiffness?: number;\n  numCopies?: number;\n  velocityMapping?: VelocityMapping;\n  parallaxClassName?: string;\n  scrollerClassName?: string;\n  parallaxStyle?: React.CSSProperties;\n  scrollerStyle?: React.CSSProperties;\n}\n\nfunction useElementWidth<T extends HTMLElement>(ref: React.RefObject<T | null>): number {\n  const [width, setWidth] = useState(0);\n\n  useLayoutEffect(() => {\n    function updateWidth() {\n      if (ref.current) {\n        setWidth(ref.current.offsetWidth);\n      }\n    }\n    updateWidth();\n    window.addEventListener('resize', updateWidth);\n    return () => window.removeEventListener('resize', updateWidth);\n  }, [ref]);\n\n  return width;\n}\n\nexport const ScrollVelocity: React.FC<ScrollVelocityProps> = ({\n  scrollContainerRef,\n  texts = [],\n  velocity = 100,\n  className = '',\n  damping = 50,\n  stiffness = 400,\n  numCopies = 6,\n  velocityMapping = { input: [0, 1000], output: [0, 5] },\n  parallaxClassName,\n  scrollerClassName,\n  parallaxStyle,\n  scrollerStyle\n}) => {\n  function VelocityText({\n    children,\n    baseVelocity = velocity,\n    scrollContainerRef,\n    className = '',\n    damping,\n    stiffness,\n    numCopies,\n    velocityMapping,\n    parallaxClassName,\n    scrollerClassName,\n    parallaxStyle,\n    scrollerStyle\n  }: VelocityTextProps) {\n    const baseX = useMotionValue(0);\n    const scrollOptions = scrollContainerRef ? { container: scrollContainerRef } : {};\n    const { scrollY } = useScroll(scrollOptions);\n    const scrollVelocity = useVelocity(scrollY);\n    const smoothVelocity = useSpring(scrollVelocity, {\n      damping: damping ?? 50,\n      stiffness: stiffness ?? 400\n    });\n    const velocityFactor = useTransform(\n      smoothVelocity,\n      velocityMapping?.input || [0, 1000],\n      velocityMapping?.output || [0, 5],\n      { clamp: false }\n    );\n\n    const copyRef = useRef<HTMLSpanElement>(null);\n    const copyWidth = useElementWidth(copyRef);\n\n    function wrap(min: number, max: number, v: number): number {\n      const range = max - min;\n      const mod = (((v - min) % range) + range) % range;\n      return mod + min;\n    }\n\n    const x = useTransform(baseX, v => {\n      if (copyWidth === 0) return '0px';\n      return `${wrap(-copyWidth, 0, v)}px`;\n    });\n\n    const directionFactor = useRef<number>(1);\n    useAnimationFrame((t, delta) => {\n      let moveBy = directionFactor.current * baseVelocity * (delta / 1000);\n\n      if (velocityFactor.get() < 0) {\n        directionFactor.current = -1;\n      } else if (velocityFactor.get() > 0) {\n        directionFactor.current = 1;\n      }\n\n      moveBy += directionFactor.current * moveBy * velocityFactor.get();\n      baseX.set(baseX.get() + moveBy);\n    });\n\n    const spans = [];\n    for (let i = 0; i < (numCopies ?? 6); i++) {\n      spans.push(\n        <span className={`flex-shrink-0 ${className}`} key={i} ref={i === 0 ? copyRef : null}>\n          {children}&nbsp;\n        </span>\n      );\n    }\n\n    return (\n      <div className={`${parallaxClassName} relative overflow-hidden`} style={parallaxStyle}>\n        <motion.div\n          className={`${scrollerClassName} flex whitespace-nowrap text-center font-sans text-4xl font-bold tracking-[-0.02em] drop-shadow md:text-[5rem] md:leading-[5rem]`}\n          style={{ x, ...scrollerStyle }}\n        >\n          {spans}\n        </motion.div>\n      </div>\n    );\n  }\n\n  return (\n    <section>\n      {texts.map((text, index) => (\n        <VelocityText\n          key={index}\n          className={className}\n          baseVelocity={index % 2 !== 0 ? -velocity : velocity}\n          scrollContainerRef={scrollContainerRef}\n          damping={damping}\n          stiffness={stiffness}\n          numCopies={numCopies}\n          velocityMapping={velocityMapping}\n          parallaxClassName={parallaxClassName}\n          scrollerClassName={scrollerClassName}\n          parallaxStyle={parallaxStyle}\n          scrollerStyle={scrollerStyle}\n        >\n          {text}\n        </VelocityText>\n      ))}\n    </section>\n  );\n};\n\nexport default ScrollVelocity;",
    "componentSourceJs": "\"use client\";\nimport React, { useRef, useLayoutEffect, useState } from 'react';\nimport { motion, useScroll, useSpring, useTransform, useMotionValue, useVelocity, useAnimationFrame } from 'motion/react';\nfunction useElementWidth(ref) {\n    const [width, setWidth] = useState(0);\n    useLayoutEffect(() => {\n        function updateWidth() {\n            if (ref.current) {\n                setWidth(ref.current.offsetWidth);\n            }\n        }\n        updateWidth();\n        window.addEventListener('resize', updateWidth);\n        return () => window.removeEventListener('resize', updateWidth);\n    }, [ref]);\n    return width;\n}\nexport const ScrollVelocity = ({ scrollContainerRef, texts = [], velocity = 100, className = '', damping = 50, stiffness = 400, numCopies = 6, velocityMapping = { input: [0, 1000], output: [0, 5] }, parallaxClassName, scrollerClassName, parallaxStyle, scrollerStyle }) => {\n    function VelocityText({ children, baseVelocity = velocity, scrollContainerRef, className = '', damping, stiffness, numCopies, velocityMapping, parallaxClassName, scrollerClassName, parallaxStyle, scrollerStyle }) {\n        const baseX = useMotionValue(0);\n        const scrollOptions = scrollContainerRef ? { container: scrollContainerRef } : {};\n        const { scrollY } = useScroll(scrollOptions);\n        const scrollVelocity = useVelocity(scrollY);\n        const smoothVelocity = useSpring(scrollVelocity, {\n            damping: damping ?? 50,\n            stiffness: stiffness ?? 400\n        });\n        const velocityFactor = useTransform(smoothVelocity, velocityMapping?.input || [0, 1000], velocityMapping?.output || [0, 5], { clamp: false });\n        const copyRef = useRef(null);\n        const copyWidth = useElementWidth(copyRef);\n        function wrap(min, max, v) {\n            const range = max - min;\n            const mod = (((v - min) % range) + range) % range;\n            return mod + min;\n        }\n        const x = useTransform(baseX, v => {\n            if (copyWidth === 0)\n                return '0px';\n            return `${wrap(-copyWidth, 0, v)}px`;\n        });\n        const directionFactor = useRef(1);\n        useAnimationFrame((t, delta) => {\n            let moveBy = directionFactor.current * baseVelocity * (delta / 1000);\n            if (velocityFactor.get() < 0) {\n                directionFactor.current = -1;\n            }\n            else if (velocityFactor.get() > 0) {\n                directionFactor.current = 1;\n            }\n            moveBy += directionFactor.current * moveBy * velocityFactor.get();\n            baseX.set(baseX.get() + moveBy);\n        });\n        const spans = [];\n        for (let i = 0; i < (numCopies ?? 6); i++) {\n            spans.push(<span className={`flex-shrink-0 ${className}`} key={i} ref={i === 0 ? copyRef : null}>\n          {children}&nbsp;\n        </span>);\n        }\n        return (<div className={`${parallaxClassName} relative overflow-hidden`} style={parallaxStyle}>\n        <motion.div className={`${scrollerClassName} flex whitespace-nowrap text-center font-sans text-4xl font-bold tracking-[-0.02em] drop-shadow md:text-[5rem] md:leading-[5rem]`} style={{ x, ...scrollerStyle }}>\n          {spans}\n        </motion.div>\n      </div>);\n    }\n    return (<section>\n      {texts.map((text, index) => (<VelocityText key={index} className={className} baseVelocity={index % 2 !== 0 ? -velocity : velocity} scrollContainerRef={scrollContainerRef} damping={damping} stiffness={stiffness} numCopies={numCopies} velocityMapping={velocityMapping} parallaxClassName={parallaxClassName} scrollerClassName={scrollerClassName} parallaxStyle={parallaxStyle} scrollerStyle={scrollerStyle}>\n          {text}\n        </VelocityText>))}\n    </section>);\n};\nexport default ScrollVelocity;",
    "props": [
      {
        "name": "children",
        "type": "React.ReactNode",
        "default": "-",
        "description": "Child elements or content to render inside the component."
      },
      {
        "name": "baseVelocity",
        "type": "number",
        "default": "velocity",
        "description": "Controls the base velocity for the component animation."
      },
      {
        "name": "scrollContainerRef",
        "type": "React.RefObject<HTMLElement>",
        "default": "-",
        "description": "Optional RefObject to a scrollable container element."
      },
      {
        "name": "className",
        "type": "string",
        "default": "''",
        "description": "Additional CSS classes for styling and layout."
      },
      {
        "name": "damping",
        "type": "number",
        "default": "50",
        "description": "Controls the damping for the component animation."
      },
      {
        "name": "stiffness",
        "type": "number",
        "default": "400",
        "description": "Controls the stiffness for the component animation."
      },
      {
        "name": "numCopies",
        "type": "number",
        "default": "6",
        "description": "Controls the num copies for the component animation."
      },
      {
        "name": "velocityMapping",
        "type": "VelocityMapping",
        "default": "{ input: [0, 1000], output: [0, 5] }",
        "description": "Controls the velocity mapping for the component animation."
      },
      {
        "name": "parallaxClassName",
        "type": "string",
        "default": "-",
        "description": "Controls the parallax class name for the component animation."
      },
      {
        "name": "scrollerClassName",
        "type": "string",
        "default": "-",
        "description": "Controls the scroller class name for the component animation."
      },
      {
        "name": "parallaxStyle",
        "type": "React.CSSProperties",
        "default": "-",
        "description": "Controls the parallax style for the component animation."
      },
      {
        "name": "scrollerStyle",
        "type": "React.CSSProperties",
        "default": "-",
        "description": "Controls the scroller style for the component animation."
      },
      {
        "name": "scrollContainerRef",
        "type": "React.RefObject<HTMLElement>",
        "default": "-",
        "description": "Optional RefObject to a scrollable container element."
      },
      {
        "name": "texts",
        "type": "React.ReactNode[]",
        "default": "[]",
        "description": "Controls the texts for the component animation."
      },
      {
        "name": "velocity",
        "type": "number",
        "default": "100",
        "description": "Controls the velocity for the component animation."
      },
      {
        "name": "className",
        "type": "string",
        "default": "''",
        "description": "Additional CSS classes for styling and layout."
      },
      {
        "name": "damping",
        "type": "number",
        "default": "50",
        "description": "Controls the damping for the component animation."
      },
      {
        "name": "stiffness",
        "type": "number",
        "default": "400",
        "description": "Controls the stiffness for the component animation."
      },
      {
        "name": "numCopies",
        "type": "number",
        "default": "6",
        "description": "Controls the num copies for the component animation."
      },
      {
        "name": "velocityMapping",
        "type": "VelocityMapping",
        "default": "{ input: [0, 1000], output: [0, 5] }",
        "description": "Controls the velocity mapping for the component animation."
      },
      {
        "name": "parallaxClassName",
        "type": "string",
        "default": "-",
        "description": "Controls the parallax class name for the component animation."
      },
      {
        "name": "scrollerClassName",
        "type": "string",
        "default": "-",
        "description": "Controls the scroller class name for the component animation."
      },
      {
        "name": "parallaxStyle",
        "type": "React.CSSProperties",
        "default": "-",
        "description": "Controls the parallax style for the component animation."
      },
      {
        "name": "scrollerStyle",
        "type": "React.CSSProperties",
        "default": "-",
        "description": "Controls the scroller style for the component animation."
      }
    ]
  },
  "shiny-text": {
    "slug": "shiny-text",
    "name": "Shiny Text",
    "description": "Metallic sheen sweeps across text producing a reflective highlight.",
    "dependencies": {
      "motion": "^12.23.12"
    },
    "installation": {
      "cliTs": "npx kibo add shiny-text",
      "cliJs": "npx kibo add shiny-text --js",
      "npm": "npm i motion",
      "pnpm": "pnpm add motion",
      "yarn": "yarn add motion",
      "bun": "bun add motion"
    },
    "usageTs": "import { ShinyText } from \"@/components/kibo/shiny-text/component\";\n\nexport default function MyComponent() {\n  return (\n    <ShinyText\n      text=\"Next-generation interactivity\"\n      className=\"text-4xl font-bold\"\n      color=\"#737373\"\n      shineColor=\"#ffffff\"\n      speed={3}\n    />\n  );\n}",
    "usageJs": "import { ShinyText } from \"@/components/kibo/shiny-text/component\";\nexport default function MyComponent() {\n    return (<ShinyText text=\"Next-generation interactivity\" className=\"text-4xl font-bold\" color=\"#737373\" shineColor=\"#ffffff\" speed={3}/>);\n}",
    "componentSourceTs": "\"use client\";\n\nimport React, { useState, useCallback, useEffect, useRef } from \"react\";\nimport {\n  motion,\n  useMotionValue,\n  useAnimationFrame,\n  useTransform,\n} from \"motion/react\";\n\nexport interface ShinyTextProps {\n  /** The text content to display. */\n  text: string;\n  /** Whether the animation is disabled. */\n  disabled?: boolean;\n  /** Speed of the animation in seconds. */\n  speed?: number;\n  /** Additional CSS classes to apply. */\n  className?: string;\n  /** The base color of the text. */\n  color?: string;\n  /** The color of the shiny highlight. */\n  shineColor?: string;\n  /** The spread angle of the linear gradient. */\n  spread?: number;\n  /** Whether the animation should reverse direction at the end of each cycle. */\n  yoyo?: boolean;\n  /** Whether the animation should pause when hovered. */\n  pauseOnHover?: boolean;\n  /** The direction of the shine sweep. */\n  direction?: \"left\" | \"right\";\n  /** Delay in seconds before starting the animation (or between cycles). */\n  delay?: number;\n}\n\nexport function ShinyText({\n  text,\n  disabled = false,\n  speed = 2,\n  className = \"\",\n  color = \"#b5b5b5\",\n  shineColor = \"#ffffff\",\n  spread = 120,\n  yoyo = false,\n  pauseOnHover = false,\n  direction = \"left\",\n  delay = 0,\n}: ShinyTextProps) {\n  const [isPaused, setIsPaused] = useState(false);\n  const progress = useMotionValue(0);\n  const elapsedRef = useRef(0);\n  const lastTimeRef = useRef<number | null>(null);\n  const directionRef = useRef(direction === \"left\" ? 1 : -1);\n\n  const animationDuration = speed * 1000;\n  const delayDuration = delay * 1000;\n\n  useAnimationFrame((time: number) => {\n    if (disabled || isPaused) {\n      lastTimeRef.current = null;\n      return;\n    }\n\n    if (lastTimeRef.current === null) {\n      lastTimeRef.current = time;\n      return;\n    }\n\n    const deltaTime = time - lastTimeRef.current;\n    lastTimeRef.current = time;\n\n    elapsedRef.current += deltaTime;\n\n    if (yoyo) {\n      const cycleDuration = animationDuration + delayDuration;\n      const fullCycle = cycleDuration * 2;\n      const cycleTime = elapsedRef.current % fullCycle;\n\n      if (cycleTime < animationDuration) {\n        // Forward animation: 0 -> 100\n        const p = (cycleTime / animationDuration) * 100;\n        progress.set(directionRef.current === 1 ? p : 100 - p);\n      } else if (cycleTime < cycleDuration) {\n        // Delay at end\n        progress.set(directionRef.current === 1 ? 100 : 0);\n      } else if (cycleTime < cycleDuration + animationDuration) {\n        // Reverse animation: 100 -> 0\n        const reverseTime = cycleTime - cycleDuration;\n        const p = 100 - (reverseTime / animationDuration) * 100;\n        progress.set(directionRef.current === 1 ? p : 100 - p);\n      } else {\n        // Delay at start\n        progress.set(directionRef.current === 1 ? 0 : 100);\n      }\n    } else {\n      const cycleDuration = animationDuration + delayDuration;\n      const cycleTime = elapsedRef.current % cycleDuration;\n\n      if (cycleTime < animationDuration) {\n        // Animation phase: 0 -> 100\n        const p = (cycleTime / animationDuration) * 100;\n        progress.set(directionRef.current === 1 ? p : 100 - p);\n      } else {\n        // Delay phase - hold at end (shine off-screen)\n        progress.set(directionRef.current === 1 ? 100 : 0);\n      }\n    }\n  });\n\n  useEffect(() => {\n    directionRef.current = direction === \"left\" ? 1 : -1;\n    elapsedRef.current = 0;\n    progress.set(0);\n    // eslint-disable-next-line react-hooks/exhaustive-deps\n  }, [direction]);\n\n  const backgroundPosition = useTransform(\n    progress,\n    (p: number) => `${150 - p * 2}% center`\n  );\n\n  const handleMouseEnter = useCallback(() => {\n    if (pauseOnHover) setIsPaused(true);\n  }, [pauseOnHover]);\n\n  const handleMouseLeave = useCallback(() => {\n    if (pauseOnHover) setIsPaused(false);\n  }, [pauseOnHover]);\n\n  const gradientStyle: React.CSSProperties = {\n    backgroundImage: `linear-gradient(${spread}deg, ${color} 0%, ${color} 35%, ${shineColor} 50%, ${color} 65%, ${color} 100%)`,\n    backgroundSize: \"200% auto\",\n    WebkitBackgroundClip: \"text\",\n    backgroundClip: \"text\",\n    WebkitTextFillColor: \"transparent\",\n  };\n\n  return (\n    <motion.span\n      className={`inline-block ${className}`}\n      style={{ ...gradientStyle, backgroundPosition }}\n      onMouseEnter={handleMouseEnter}\n      onMouseLeave={handleMouseLeave}\n    >\n      {text}\n    </motion.span>\n  );\n}\n",
    "componentSourceJs": "\"use client\";\nimport React, { useState, useCallback, useEffect, useRef } from \"react\";\nimport { motion, useMotionValue, useAnimationFrame, useTransform, } from \"motion/react\";\nexport function ShinyText({ text, disabled = false, speed = 2, className = \"\", color = \"#b5b5b5\", shineColor = \"#ffffff\", spread = 120, yoyo = false, pauseOnHover = false, direction = \"left\", delay = 0, }) {\n    const [isPaused, setIsPaused] = useState(false);\n    const progress = useMotionValue(0);\n    const elapsedRef = useRef(0);\n    const lastTimeRef = useRef(null);\n    const directionRef = useRef(direction === \"left\" ? 1 : -1);\n    const animationDuration = speed * 1000;\n    const delayDuration = delay * 1000;\n    useAnimationFrame((time) => {\n        if (disabled || isPaused) {\n            lastTimeRef.current = null;\n            return;\n        }\n        if (lastTimeRef.current === null) {\n            lastTimeRef.current = time;\n            return;\n        }\n        const deltaTime = time - lastTimeRef.current;\n        lastTimeRef.current = time;\n        elapsedRef.current += deltaTime;\n        if (yoyo) {\n            const cycleDuration = animationDuration + delayDuration;\n            const fullCycle = cycleDuration * 2;\n            const cycleTime = elapsedRef.current % fullCycle;\n            if (cycleTime < animationDuration) {\n                // Forward animation: 0 -> 100\n                const p = (cycleTime / animationDuration) * 100;\n                progress.set(directionRef.current === 1 ? p : 100 - p);\n            }\n            else if (cycleTime < cycleDuration) {\n                // Delay at end\n                progress.set(directionRef.current === 1 ? 100 : 0);\n            }\n            else if (cycleTime < cycleDuration + animationDuration) {\n                // Reverse animation: 100 -> 0\n                const reverseTime = cycleTime - cycleDuration;\n                const p = 100 - (reverseTime / animationDuration) * 100;\n                progress.set(directionRef.current === 1 ? p : 100 - p);\n            }\n            else {\n                // Delay at start\n                progress.set(directionRef.current === 1 ? 0 : 100);\n            }\n        }\n        else {\n            const cycleDuration = animationDuration + delayDuration;\n            const cycleTime = elapsedRef.current % cycleDuration;\n            if (cycleTime < animationDuration) {\n                // Animation phase: 0 -> 100\n                const p = (cycleTime / animationDuration) * 100;\n                progress.set(directionRef.current === 1 ? p : 100 - p);\n            }\n            else {\n                // Delay phase - hold at end (shine off-screen)\n                progress.set(directionRef.current === 1 ? 100 : 0);\n            }\n        }\n    });\n    useEffect(() => {\n        directionRef.current = direction === \"left\" ? 1 : -1;\n        elapsedRef.current = 0;\n        progress.set(0);\n        // eslint-disable-next-line react-hooks/exhaustive-deps\n    }, [direction]);\n    const backgroundPosition = useTransform(progress, (p) => `${150 - p * 2}% center`);\n    const handleMouseEnter = useCallback(() => {\n        if (pauseOnHover)\n            setIsPaused(true);\n    }, [pauseOnHover]);\n    const handleMouseLeave = useCallback(() => {\n        if (pauseOnHover)\n            setIsPaused(false);\n    }, [pauseOnHover]);\n    const gradientStyle = {\n        backgroundImage: `linear-gradient(${spread}deg, ${color} 0%, ${color} 35%, ${shineColor} 50%, ${color} 65%, ${color} 100%)`,\n        backgroundSize: \"200% auto\",\n        WebkitBackgroundClip: \"text\",\n        backgroundClip: \"text\",\n        WebkitTextFillColor: \"transparent\",\n    };\n    return (<motion.span className={`inline-block ${className}`} style={{ ...gradientStyle, backgroundPosition }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>\n      {text}\n    </motion.span>);\n}",
    "props": [
      {
        "name": "text",
        "type": "string",
        "default": "-",
        "description": "The text content to display."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "default": "false",
        "description": "Whether the animation is disabled."
      },
      {
        "name": "speed",
        "type": "number",
        "default": "2",
        "description": "Speed of the animation in seconds."
      },
      {
        "name": "className",
        "type": "string",
        "default": "\"\"",
        "description": "Additional CSS classes to apply."
      },
      {
        "name": "color",
        "type": "string",
        "default": "\"#b5b5b5\"",
        "description": "The base color of the text."
      },
      {
        "name": "shineColor",
        "type": "string",
        "default": "\"#ffffff\"",
        "description": "The color of the shiny highlight."
      },
      {
        "name": "spread",
        "type": "number",
        "default": "120",
        "description": "The spread angle of the linear gradient."
      },
      {
        "name": "yoyo",
        "type": "boolean",
        "default": "false",
        "description": "Whether the animation should reverse direction at the end of each cycle."
      },
      {
        "name": "pauseOnHover",
        "type": "boolean",
        "default": "false",
        "description": "Whether the animation should pause when hovered."
      },
      {
        "name": "direction",
        "type": "\"left\" | \"right\"",
        "default": "\"left\"",
        "description": "The direction of the shine sweep."
      },
      {
        "name": "delay",
        "type": "number",
        "default": "0",
        "description": "Delay in seconds before starting the animation (or between cycles)."
      }
    ]
  },
  "shuffle": {
    "slug": "shuffle",
    "name": "Shuffle",
    "description": "Slot-machine reel flip animation rolling through randomized glyph strips on scroll trigger or hover.",
    "dependencies": {
      "gsap": "^3.13.0",
      "@gsap/react": "^2.1.2"
    },
    "installation": {
      "cliTs": "npx kibo add shuffle",
      "cliJs": "npx kibo add shuffle --js",
      "npm": "npm i gsap @gsap/react",
      "pnpm": "pnpm add gsap @gsap/react",
      "yarn": "yarn add gsap @gsap/react",
      "bun": "bun add gsap @gsap/react"
    },
    "usageTs": "import { Shuffle } from \"@/components/kibo/shuffle/component\";\n\nexport default function Example() {\n  return (\n    <Shuffle />\n  );\n}",
    "usageJs": "import { Shuffle } from \"@/components/kibo/shuffle/component\";\nexport default function Example() {\n    return (<Shuffle />);\n}",
    "componentSourceTs": "\"use client\";\n\nimport React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';\nimport { gsap } from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';\n\nif (typeof window !== 'undefined') {\n  gsap.registerPlugin(ScrollTrigger);\n}\n\nexport interface ShuffleProps {\n  text: string;\n  className?: string;\n  style?: React.CSSProperties;\n  shuffleDirection?: 'left' | 'right' | 'up' | 'down';\n  duration?: number;\n  maxDelay?: number;\n  ease?: string;\n  threshold?: number;\n  rootMargin?: string;\n  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';\n  textAlign?: React.CSSProperties['textAlign'];\n  onShuffleComplete?: () => void;\n  shuffleTimes?: number;\n  animationMode?: 'random' | 'evenodd';\n  loop?: boolean;\n  loopDelay?: number;\n  stagger?: number;\n  scrambleCharset?: string;\n  colorFrom?: string;\n  colorTo?: string;\n  triggerOnce?: boolean;\n  respectReducedMotion?: boolean;\n  triggerOnHover?: boolean;\n}\n\nexport function Shuffle({\n  text,\n  className = '',\n  style = {},\n  shuffleDirection = 'up',\n  duration = 0.45,\n  maxDelay = 0,\n  ease = 'power3.out',\n  threshold = 0.1,\n  rootMargin = '-100px',\n  tag = 'p',\n  textAlign = 'center',\n  onShuffleComplete,\n  shuffleTimes = 4,\n  animationMode = 'evenodd',\n  loop = false,\n  loopDelay = 0,\n  stagger = 0.03,\n  scrambleCharset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*',\n  colorFrom,\n  colorTo,\n  triggerOnce = false,\n  respectReducedMotion = true,\n  triggerOnHover = true\n}: ShuffleProps) {\n  const containerRef = useRef<HTMLDivElement>(null);\n  const [ready, setReady] = useState(false);\n  const isPlayingRef = useRef(false);\n  const timelineRef = useRef<gsap.core.Timeline | null>(null);\n\n  const characters = useMemo(() => text.split(''), [text]);\n\n  const isVertical = shuffleDirection === 'up' || shuffleDirection === 'down';\n\n  const runAnimation = useCallback(() => {\n    if (!containerRef.current) return;\n\n    if (timelineRef.current) {\n      timelineRef.current.kill();\n    }\n\n    isPlayingRef.current = true;\n    const strips = containerRef.current.querySelectorAll<HTMLElement>('.shuffle-strip');\n\n    const tl = gsap.timeline({\n      repeat: loop ? -1 : 0,\n      repeatDelay: loop ? loopDelay : 0,\n      onComplete: () => {\n        isPlayingRef.current = false;\n        onShuffleComplete?.();\n      }\n    });\n\n    timelineRef.current = tl;\n\n    strips.forEach((strip, index) => {\n      const delay = animationMode === 'evenodd' \n        ? (index % 2) * stagger * 3 \n        : maxDelay > 0 \n          ? Math.random() * maxDelay \n          : index * stagger;\n\n      let startPos = '0em';\n      let targetPos = '0em';\n\n      if (shuffleDirection === 'up') {\n        startPos = '0em';\n        targetPos = `${-shuffleTimes * 1.2}em`;\n      } else if (shuffleDirection === 'down') {\n        startPos = `${-shuffleTimes * 1.2}em`;\n        targetPos = '0em';\n      } else if (shuffleDirection === 'left') {\n        startPos = '0ch';\n        targetPos = `${-shuffleTimes * 1}ch`;\n      } else if (shuffleDirection === 'right') {\n        startPos = `${-shuffleTimes * 1}ch`;\n        targetPos = '0ch';\n      }\n\n      tl.fromTo(\n        strip,\n        isVertical ? { y: startPos } : { x: startPos },\n        {\n          [isVertical ? 'y' : 'x']: targetPos,\n          duration,\n          ease,\n          force3D: true\n        },\n        delay\n      );\n\n      if (colorFrom && colorTo) {\n        tl.fromTo(\n          strip,\n          { color: colorFrom },\n          { color: colorTo, duration, ease },\n          delay\n        );\n      }\n    });\n  }, [shuffleDirection, isVertical, duration, maxDelay, ease, shuffleTimes, animationMode, loop, loopDelay, stagger, colorFrom, colorTo, onShuffleComplete]);\n\n  useEffect(() => {\n    const el = containerRef.current;\n    if (!el) return;\n\n    if (respectReducedMotion && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {\n      setReady(true);\n      return;\n    }\n\n    setReady(true);\n    runAnimation();\n\n    const handleMouseEnter = () => {\n      if (triggerOnHover) {\n        runAnimation();\n      }\n    };\n\n    el.addEventListener('mouseenter', handleMouseEnter);\n    return () => {\n      el.removeEventListener('mouseenter', handleMouseEnter);\n      if (timelineRef.current) {\n        timelineRef.current.kill();\n      }\n    };\n  }, [runAnimation, respectReducedMotion, triggerOnHover]);\n\n  const Tag = tag as any;\n\n  return (\n    <Tag\n      ref={containerRef}\n      className={`inline-flex flex-wrap items-center justify-center overflow-hidden font-mono uppercase select-none cursor-pointer ${className}`}\n      style={{ textAlign, ...style }}\n    >\n      {characters.map((char, i) => {\n        if (char === ' ') {\n          return <span key={i} className=\"inline-block w-[0.5ch]\">&nbsp;</span>;\n        }\n\n        const rolls = Array.from({ length: shuffleTimes }, () =>\n          scrambleCharset[Math.floor(Math.random() * scrambleCharset.length)]\n        );\n\n        const stripItems = (shuffleDirection === 'down' || shuffleDirection === 'right')\n          ? [char, ...rolls]\n          : [...rolls, char];\n\n        return (\n          <span\n            key={i}\n            className={`relative inline-block overflow-hidden h-[1.2em] leading-[1.2em] align-middle ${\n              !isVertical ? 'w-[1ch]' : ''\n            }`}\n          >\n            <span\n              className={`shuffle-strip inline-flex ${\n                isVertical ? 'flex-col' : 'flex-row'\n              } will-change-transform`}\n              style={{\n                transform: isVertical\n                  ? `translate3d(0, ${shuffleDirection === 'down' ? `${-shuffleTimes * 1.2}em` : '0em'}, 0)`\n                  : `translate3d(${shuffleDirection === 'right' ? `${-shuffleTimes}ch` : '0ch'}, 0, 0)`\n              }}\n            >\n              {stripItems.map((item, idx) => (\n                <span\n                  key={idx}\n                  className={`h-[1.2em] leading-[1.2em] text-center inline-block ${\n                    !isVertical ? 'w-[1ch]' : ''\n                  }`}\n                >\n                  {item}\n                </span>\n              ))}\n            </span>\n          </span>\n        );\n      })}\n    </Tag>\n  );\n}\n\nexport default Shuffle;\n",
    "componentSourceJs": "\"use client\";\nimport React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';\nimport { gsap } from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';\nif (typeof window !== 'undefined') {\n    gsap.registerPlugin(ScrollTrigger);\n}\nexport function Shuffle({ text, className = '', style = {}, shuffleDirection = 'up', duration = 0.45, maxDelay = 0, ease = 'power3.out', threshold = 0.1, rootMargin = '-100px', tag = 'p', textAlign = 'center', onShuffleComplete, shuffleTimes = 4, animationMode = 'evenodd', loop = false, loopDelay = 0, stagger = 0.03, scrambleCharset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*', colorFrom, colorTo, triggerOnce = false, respectReducedMotion = true, triggerOnHover = true }) {\n    const containerRef = useRef(null);\n    const [ready, setReady] = useState(false);\n    const isPlayingRef = useRef(false);\n    const timelineRef = useRef(null);\n    const characters = useMemo(() => text.split(''), [text]);\n    const isVertical = shuffleDirection === 'up' || shuffleDirection === 'down';\n    const runAnimation = useCallback(() => {\n        if (!containerRef.current)\n            return;\n        if (timelineRef.current) {\n            timelineRef.current.kill();\n        }\n        isPlayingRef.current = true;\n        const strips = containerRef.current.querySelectorAll('.shuffle-strip');\n        const tl = gsap.timeline({\n            repeat: loop ? -1 : 0,\n            repeatDelay: loop ? loopDelay : 0,\n            onComplete: () => {\n                isPlayingRef.current = false;\n                onShuffleComplete?.();\n            }\n        });\n        timelineRef.current = tl;\n        strips.forEach((strip, index) => {\n            const delay = animationMode === 'evenodd'\n                ? (index % 2) * stagger * 3\n                : maxDelay > 0\n                    ? Math.random() * maxDelay\n                    : index * stagger;\n            let startPos = '0em';\n            let targetPos = '0em';\n            if (shuffleDirection === 'up') {\n                startPos = '0em';\n                targetPos = `${-shuffleTimes * 1.2}em`;\n            }\n            else if (shuffleDirection === 'down') {\n                startPos = `${-shuffleTimes * 1.2}em`;\n                targetPos = '0em';\n            }\n            else if (shuffleDirection === 'left') {\n                startPos = '0ch';\n                targetPos = `${-shuffleTimes * 1}ch`;\n            }\n            else if (shuffleDirection === 'right') {\n                startPos = `${-shuffleTimes * 1}ch`;\n                targetPos = '0ch';\n            }\n            tl.fromTo(strip, isVertical ? { y: startPos } : { x: startPos }, {\n                [isVertical ? 'y' : 'x']: targetPos,\n                duration,\n                ease,\n                force3D: true\n            }, delay);\n            if (colorFrom && colorTo) {\n                tl.fromTo(strip, { color: colorFrom }, { color: colorTo, duration, ease }, delay);\n            }\n        });\n    }, [shuffleDirection, isVertical, duration, maxDelay, ease, shuffleTimes, animationMode, loop, loopDelay, stagger, colorFrom, colorTo, onShuffleComplete]);\n    useEffect(() => {\n        const el = containerRef.current;\n        if (!el)\n            return;\n        if (respectReducedMotion && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {\n            setReady(true);\n            return;\n        }\n        setReady(true);\n        runAnimation();\n        const handleMouseEnter = () => {\n            if (triggerOnHover) {\n                runAnimation();\n            }\n        };\n        el.addEventListener('mouseenter', handleMouseEnter);\n        return () => {\n            el.removeEventListener('mouseenter', handleMouseEnter);\n            if (timelineRef.current) {\n                timelineRef.current.kill();\n            }\n        };\n    }, [runAnimation, respectReducedMotion, triggerOnHover]);\n    const Tag = tag;\n    return (<Tag ref={containerRef} className={`inline-flex flex-wrap items-center justify-center overflow-hidden font-mono uppercase select-none cursor-pointer ${className}`} style={{ textAlign, ...style }}>\n      {characters.map((char, i) => {\n            if (char === ' ') {\n                return <span key={i} className=\"inline-block w-[0.5ch]\">&nbsp;</span>;\n            }\n            const rolls = Array.from({ length: shuffleTimes }, () => scrambleCharset[Math.floor(Math.random() * scrambleCharset.length)]);\n            const stripItems = (shuffleDirection === 'down' || shuffleDirection === 'right')\n                ? [char, ...rolls]\n                : [...rolls, char];\n            return (<span key={i} className={`relative inline-block overflow-hidden h-[1.2em] leading-[1.2em] align-middle ${!isVertical ? 'w-[1ch]' : ''}`}>\n            <span className={`shuffle-strip inline-flex ${isVertical ? 'flex-col' : 'flex-row'} will-change-transform`} style={{\n                    transform: isVertical\n                        ? `translate3d(0, ${shuffleDirection === 'down' ? `${-shuffleTimes * 1.2}em` : '0em'}, 0)`\n                        : `translate3d(${shuffleDirection === 'right' ? `${-shuffleTimes}ch` : '0ch'}, 0, 0)`\n                }}>\n              {stripItems.map((item, idx) => (<span key={idx} className={`h-[1.2em] leading-[1.2em] text-center inline-block ${!isVertical ? 'w-[1ch]' : ''}`}>\n                  {item}\n                </span>))}\n            </span>\n          </span>);\n        })}\n    </Tag>);\n}\nexport default Shuffle;",
    "props": [
      {
        "name": "text",
        "type": "string",
        "default": "-",
        "description": "The text content to display and animate."
      },
      {
        "name": "className",
        "type": "string",
        "default": "''",
        "description": "Additional CSS classes for styling and layout."
      },
      {
        "name": "style",
        "type": "React.CSSProperties",
        "default": "{}",
        "description": "Controls the style for the component animation."
      },
      {
        "name": "shuffleDirection",
        "type": "'left' | 'right' | 'up' | 'down'",
        "default": "'up'",
        "description": "Controls the shuffle direction for the component animation."
      },
      {
        "name": "duration",
        "type": "number",
        "default": "0.45",
        "description": "Duration of the animation in seconds or milliseconds."
      },
      {
        "name": "maxDelay",
        "type": "number",
        "default": "0",
        "description": "Controls the max delay for the component animation."
      },
      {
        "name": "ease",
        "type": "string",
        "default": "'power3.out'",
        "description": "GSAP or cubic-bezier easing curve for animation smoothing."
      },
      {
        "name": "threshold",
        "type": "number",
        "default": "0.1",
        "description": "Controls the threshold for the component animation."
      },
      {
        "name": "rootMargin",
        "type": "string",
        "default": "'-100px'",
        "description": "Controls the root margin for the component animation."
      },
      {
        "name": "tag",
        "type": "'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'",
        "default": "'p'",
        "description": "Controls the tag for the component animation."
      },
      {
        "name": "textAlign",
        "type": "React.CSSProperties['textAlign']",
        "default": "'center'",
        "description": "Controls the text align for the component animation."
      },
      {
        "name": "onShuffleComplete",
        "type": "() => void",
        "default": "-",
        "description": "Controls the on shuffle complete for the component animation."
      },
      {
        "name": "shuffleTimes",
        "type": "number",
        "default": "4",
        "description": "Controls the shuffle times for the component animation."
      },
      {
        "name": "animationMode",
        "type": "'random' | 'evenodd'",
        "default": "'evenodd'",
        "description": "Controls the animation mode for the component animation."
      },
      {
        "name": "loop",
        "type": "boolean",
        "default": "false",
        "description": "Controls the loop for the component animation."
      },
      {
        "name": "loopDelay",
        "type": "number",
        "default": "0",
        "description": "Controls the loop delay for the component animation."
      },
      {
        "name": "stagger",
        "type": "number",
        "default": "0.03",
        "description": "Stagger delay in seconds between individual characters/elements."
      },
      {
        "name": "scrambleCharset",
        "type": "string",
        "default": "'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'",
        "description": "Controls the scramble charset for the component animation."
      },
      {
        "name": "colorFrom",
        "type": "string",
        "default": "-",
        "description": "Controls the color from for the component animation."
      },
      {
        "name": "colorTo",
        "type": "string",
        "default": "-",
        "description": "Controls the color to for the component animation."
      },
      {
        "name": "triggerOnce",
        "type": "boolean",
        "default": "false",
        "description": "Controls the trigger once for the component animation."
      },
      {
        "name": "respectReducedMotion",
        "type": "boolean",
        "default": "true",
        "description": "Controls the respect reduced motion for the component animation."
      },
      {
        "name": "triggerOnHover",
        "type": "boolean",
        "default": "true",
        "description": "Controls the trigger on hover for the component animation."
      }
    ]
  },
  "split-flap-text": {
    "slug": "split-flap-text",
    "name": "Split Flap Text",
    "description": "Tactile mechanical departure board text animation simulating retro split-flap display transitions.",
    "dependencies": {},
    "installation": {
      "cliTs": "npx kibo add split-flap-text",
      "cliJs": "npx kibo add split-flap-text --js",
      "npm": "npx kibo add split-flap-text",
      "pnpm": "pnpm dlx kibo add split-flap-text",
      "yarn": "yarn add split-flap-text",
      "bun": "bunx kibo add split-flap-text"
    },
    "usageTs": "import { SplitFlapText } from \"@/components/kibo/split-flap-text/component\";\n\nexport default function Example() {\n  return (\n    <SplitFlapText />\n  );\n}",
    "usageJs": "import { SplitFlapText } from \"@/components/kibo/split-flap-text/component\";\nexport default function Example() {\n    return (<SplitFlapText />);\n}",
    "componentSourceTs": "\"use client\";\n\nimport { CSSProperties, HTMLAttributes, useEffect, useMemo, useRef, useState } from 'react';\n\ntype TileState = {\n  current: string;\n  next: string;\n  flipping: boolean;\n  tick: number;\n};\n\ntype AnimationPlan = {\n  index: number;\n  from: string;\n  target: string;\n  sequence: string[];\n  start: number;\n  step: number;\n  done: boolean;\n};\n\ntype TileUpdate = {\n  index: number;\n  current: string;\n  next: string;\n  done: boolean;\n};\n\nexport interface SplitFlapTextProps extends HTMLAttributes<HTMLDivElement> {\n  words?: string[];\n  text?: string;\n  flipDuration?: number;\n  stagger?: number;\n  cycleDelay?: number;\n  charset?: 'alpha' | 'alphanumeric' | 'numeric' | (string & {});\n  flipsPerChar?: number;\n  tileColor?: string;\n  textColor?: string;\n  tileRadius?: number | string;\n  gap?: number | string;\n  fontSize?: number | string;\n  loop?: boolean;\n  padTo?: number;\n}\n\nconst DEFAULT_WORDS = ['LAUNCH READY', 'SYNC ONLINE', 'SIGNAL LIVE'];\n\nconst CHARSETS: Record<string, string> = {\n  alpha: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',\n  alphanumeric: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',\n  numeric: '0123456789'\n};\n\nconst styles = `\n.split-flap-text{font-family:'SFMono-Regular','Roboto Mono','Cascadia Code','Liberation Mono',Menlo,monospace;font-size:var(--split-flap-font-size,52px);font-weight:760;line-height:1;letter-spacing:.035em;font-variant-numeric:tabular-nums}\n.split-flap-text__tile{position:relative;width:.78em;height:1.08em;overflow:hidden;border-radius:var(--split-flap-radius,8px);background:radial-gradient(circle at 50% 0%,rgba(255,255,255,.16),transparent 44%),linear-gradient(180deg,color-mix(in srgb,var(--split-flap-tile-color,#111827) 82%,white),var(--split-flap-tile-color,#111827));box-shadow:0 .035em .08em rgba(255,255,255,.08) inset,0 -.05em .1em rgba(0,0,0,.38) inset,0 .16em .38em rgba(0,0,0,.28);perspective:520px;transform-style:preserve-3d;isolation:isolate}\n.split-flap-text__tile:before{content:'';position:absolute;z-index:8;top:calc(50% - .5px);left:0;width:100%;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.18) 18%,rgba(0,0,0,.64) 50%,rgba(255,255,255,.14) 82%,transparent);box-shadow:0 -1px 0 rgba(255,255,255,.08),0 1px 0 rgba(0,0,0,.5);pointer-events:none}\n.split-flap-text__tile:after{content:'';position:absolute;inset:0;z-index:9;border:1px solid rgba(255,255,255,.08);border-radius:inherit;box-shadow:0 0 0 1px rgba(0,0,0,.2) inset;pointer-events:none}\n.split-flap-text__half,.split-flap-text__flap{position:absolute;left:0;width:100%;height:50%;overflow:hidden;background:linear-gradient(180deg,rgba(255,255,255,.07),transparent 34%),var(--split-flap-tile-color,#111827);backface-visibility:hidden}\n.split-flap-text__half--top,.split-flap-text__flap--front{top:0}\n.split-flap-text__half--bottom,.split-flap-text__flap--back{bottom:0;background:linear-gradient(0deg,rgba(255,255,255,.06),transparent 38%),color-mix(in srgb,var(--split-flap-tile-color,#111827) 92%,black)}\n.split-flap-text__char{position:absolute;left:0;width:100%;height:200%;display:flex;align-items:center;justify-content:center;color:var(--split-flap-text-color,#f8fafc);text-shadow:0 .025em 0 rgba(255,255,255,.16),0 .09em .16em rgba(0,0,0,.42)}\n.split-flap-text__half--top .split-flap-text__char,.split-flap-text__flap--front .split-flap-text__char{top:0}\n.split-flap-text__half--bottom .split-flap-text__char,.split-flap-text__flap--back .split-flap-text__char{bottom:0}\n.split-flap-text__flap{z-index:6;will-change:transform,filter;transform-style:preserve-3d}\n.split-flap-text__flap--front{transform-origin:center bottom;animation:split-flap-front var(--split-flap-flip-duration,.12s) cubic-bezier(.23,1,.32,1) both}\n.split-flap-text__flap--back{transform-origin:center top;transform:rotateX(90deg);animation:split-flap-back var(--split-flap-flip-duration,.12s) cubic-bezier(.23,1,.32,1) both}\n@keyframes split-flap-front{0%{transform:rotateX(0deg);filter:brightness(1.08)}100%{transform:rotateX(-90deg);filter:brightness(.52)}}\n@keyframes split-flap-back{0%,45%{transform:rotateX(90deg);filter:brightness(.58)}100%{transform:rotateX(0deg);filter:brightness(1)}}\n@media (prefers-reduced-motion:reduce){.split-flap-text__flap{animation:none!important}}\n`;\n\nconst toCssUnit = (value: number | string) => (typeof value === 'number' ? `${value}px` : value);\n\nconst resolveCharset = (charset: SplitFlapTextProps['charset']) => {\n  if (charset && CHARSETS[charset]) return CHARSETS[charset];\n  return typeof charset === 'string' && charset.length > 0 ? charset : CHARSETS.alphanumeric;\n};\n\nconst normalizePhrase = (phrase: string, width: number) => {\n  const safe = String(phrase ?? '');\n  return safe.padEnd(width, ' ').slice(0, width);\n};\n\nconst createTiles = (phrase: string): TileState[] =>\n  phrase.split('').map(char => ({\n    current: char,\n    next: char,\n    flipping: false,\n    tick: 0\n  }));\n\nconst sampleChar = (charset: string) => charset.charAt(Math.floor(Math.random() * charset.length)) || ' ';\n\nconst buildSequence = (target: string, flips: number, charset: string) => {\n  const steps: string[] = [];\n  for (let i = 0; i < flips; i += 1) {\n    steps.push(sampleChar(charset));\n  }\n  steps.push(target);\n  return steps;\n};\n\nconst usePrefersReducedMotion = () => {\n  const [prefersReduced, setPrefersReduced] = useState(false);\n\n  useEffect(() => {\n    if (typeof window === 'undefined' || !window.matchMedia) return;\n\n    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');\n    const handleChange = () => setPrefersReduced(mediaQuery.matches);\n\n    handleChange();\n    mediaQuery.addEventListener('change', handleChange);\n\n    return () => mediaQuery.removeEventListener('change', handleChange);\n  }, []);\n\n  return prefersReduced;\n};\n\nexport const SplitFlapText = ({\n  words = ['LAUNCH READY', 'SYNC ONLINE', 'SIGNAL LIVE'],\n  text,\n  flipDuration = 0.12,\n  stagger = 0.06,\n  cycleDelay = 2400,\n  charset = 'alphanumeric',\n  flipsPerChar = 8,\n  tileColor = '#111827',\n  textColor = '#f8fafc',\n  tileRadius = 8,\n  gap = 6,\n  fontSize = 52,\n  loop = true,\n  padTo = 12,\n  className = '',\n  style = {},\n  ...props\n}: SplitFlapTextProps) => {\n  const prefersReducedMotion = usePrefersReducedMotion();\n  const rafRef = useRef<number | null>(null);\n  const cycleTimerRef = useRef<number | NodeJS.Timeout | null>(null);\n  const currentTextRef = useRef('');\n\n  const sourceWords = Array.isArray(words) && words.length > 0 ? words : DEFAULT_WORDS;\n  const phrasesKey = typeof text === 'string' ? text : sourceWords.map(word => String(word ?? '')).join('\\u001f');\n  const phrases = useMemo(() => phrasesKey.split('\\u001f'), [phrasesKey]);\n\n  const width = useMemo(() => {\n    const longest = phrases.reduce((max, phrase) => Math.max(max, phrase.length), 1);\n    return Math.max(1, Math.ceil(Number(padTo) || 0), longest);\n  }, [padTo, phrases]);\n\n  const normalizedPhrases = useMemo(() => phrases.map(phrase => normalizePhrase(phrase, width)), [phrases, width]);\n\n  const [tiles, setTiles] = useState<TileState[]>(() => createTiles(normalizedPhrases[0] || ''));\n\n  useEffect(() => {\n    const clearAnimation = () => {\n      if (rafRef.current) {\n        cancelAnimationFrame(rafRef.current);\n        rafRef.current = null;\n      }\n\n      if (cycleTimerRef.current) {\n        clearTimeout(cycleTimerRef.current);\n        cycleTimerRef.current = null;\n      }\n    };\n\n    clearAnimation();\n\n    const firstPhrase = normalizedPhrases[0] || '';\n    currentTextRef.current = firstPhrase;\n    setTiles(createTiles(firstPhrase));\n\n    if (normalizedPhrases.length <= 1 || typeof window === 'undefined') {\n      return clearAnimation;\n    }\n\n    let phraseIndex = 0;\n    let cancelled = false;\n\n    const safeFlipMs = Math.max(40, (Number(flipDuration) || 0.12) * 1000);\n    const safeStaggerMs = Math.max(0, (Number(stagger) || 0) * 1000);\n    const safeCycleDelay = Math.max(400, Number(cycleDelay) || 2400);\n    const safeFlips = Math.max(0, Math.floor(Number(flipsPerChar) || 0));\n    const activeCharset = resolveCharset(charset);\n\n    const animateTo = (targetPhrase: string) => {\n      if (prefersReducedMotion) {\n        currentTextRef.current = targetPhrase;\n        setTiles(createTiles(targetPhrase));\n        return 0;\n      }\n\n      const fromPhrase = normalizePhrase(currentTextRef.current, width);\n      const targetChars = targetPhrase.split('');\n\n      const plans = targetChars\n        .map<AnimationPlan | null>((targetChar, index) => {\n          const fromChar = fromPhrase[index] || ' ';\n          if (fromChar === targetChar) return null;\n\n          return {\n            index,\n            from: fromChar,\n            target: targetChar,\n            sequence: buildSequence(targetChar, safeFlips, activeCharset),\n            start: index * safeStaggerMs,\n            step: -1,\n            done: false\n          };\n        })\n        .filter((plan): plan is AnimationPlan => plan !== null);\n\n      if (!plans.length) {\n        currentTextRef.current = targetPhrase;\n        setTiles(createTiles(targetPhrase));\n        return 0;\n      }\n\n      const totalDuration = plans.reduce(\n        (max, plan) => Math.max(max, plan.start + plan.sequence.length * safeFlipMs),\n        0\n      );\n      const startedAt = performance.now();\n\n      const updateTiles = (updates: TileUpdate[]) => {\n        setTiles(previous => {\n          const nextTiles = [...previous];\n          updates.forEach(update => {\n            const tile = nextTiles[update.index];\n            if (!tile) return;\n\n            nextTiles[update.index] = {\n              current: update.current,\n              next: update.next,\n              flipping: !update.done,\n              tick: tile.tick + 1\n            };\n          });\n          return nextTiles;\n        });\n      };\n\n      const tick = (now: number) => {\n        if (cancelled) return;\n\n        const elapsed = now - startedAt;\n        const updates: TileUpdate[] = [];\n        let shouldContinue = false;\n\n        plans.forEach(plan => {\n          const localElapsed = elapsed - plan.start;\n\n          if (localElapsed < 0) {\n            shouldContinue = true;\n            return;\n          }\n\n          const step = Math.floor(localElapsed / safeFlipMs);\n\n          if (step < plan.sequence.length) {\n            shouldContinue = true;\n\n            if (step !== plan.step) {\n              plan.step = step;\n              updates.push({\n                index: plan.index,\n                current: step === 0 ? plan.from : plan.sequence[step - 1],\n                next: plan.sequence[step],\n                done: false\n              });\n            }\n          } else if (!plan.done) {\n            plan.done = true;\n            updates.push({\n              index: plan.index,\n              current: plan.target,\n              next: plan.target,\n              done: true\n            });\n          }\n        });\n\n        if (updates.length > 0) updateTiles(updates);\n\n        if (shouldContinue) {\n          rafRef.current = requestAnimationFrame(tick);\n        } else {\n          currentTextRef.current = targetPhrase;\n          rafRef.current = null;\n        }\n      };\n\n      rafRef.current = requestAnimationFrame(tick);\n      return totalDuration;\n    };\n\n    const scheduleNext = (delay: number) => {\n      cycleTimerRef.current = window.setTimeout(() => {\n        if (cancelled) return;\n\n        const nextIndex = phraseIndex + 1;\n\n        if (nextIndex >= normalizedPhrases.length && !loop) return;\n\n        phraseIndex = nextIndex % normalizedPhrases.length;\n        const animationDuration = animateTo(normalizedPhrases[phraseIndex]);\n        scheduleNext(safeCycleDelay + animationDuration);\n      }, delay);\n    };\n\n    scheduleNext(safeCycleDelay);\n\n    return () => {\n      cancelled = true;\n      clearAnimation();\n    };\n  }, [normalizedPhrases, width, loop, cycleDelay, flipDuration, stagger, flipsPerChar, charset, prefersReducedMotion]);\n\n  const settledText = tiles\n    .map(tile => tile.current)\n    .join('')\n    .trimEnd();\n  const componentStyle: CSSProperties & Record<string, string | number | undefined> = {\n    '--split-flap-tile-color': tileColor,\n    '--split-flap-text-color': textColor,\n    '--split-flap-radius': toCssUnit(tileRadius),\n    '--split-flap-gap': toCssUnit(gap),\n    '--split-flap-font-size': toCssUnit(fontSize),\n    '--split-flap-flip-duration': `${Math.max(0.04, Number(flipDuration) || 0.12)}s`,\n    ...style\n  };\n\n  return (\n    <>\n      <style>{styles}</style>\n      <div\n        className={`split-flap-text inline-flex items-center whitespace-pre select-none ${className}`.trim()}\n        style={componentStyle}\n        role=\"text\"\n        aria-label={settledText || undefined}\n        {...props}\n      >\n        {tiles.map((tile, index) => (\n          <span className=\"split-flap-text__tile\" aria-hidden=\"true\" key={`${index}-${tiles.length}`}>\n            <span className=\"split-flap-text__half split-flap-text__half--top\">\n              <span className=\"split-flap-text__char\">{tile.current === ' ' ? '\\u00A0' : tile.current}</span>\n            </span>\n            <span className=\"split-flap-text__half split-flap-text__half--bottom\">\n              <span className=\"split-flap-text__char\">{tile.flipping ? tile.next : tile.current}</span>\n            </span>\n\n            {tile.flipping && (\n              <>\n                <span\n                  className=\"split-flap-text__flap split-flap-text__flap--front\"\n                  key={`front-${index}-${tile.tick}`}\n                >\n                  <span className=\"split-flap-text__char\">{tile.current === ' ' ? '\\u00A0' : tile.current}</span>\n                </span>\n                <span className=\"split-flap-text__flap split-flap-text__flap--back\" key={`back-${index}-${tile.tick}`}>\n                  <span className=\"split-flap-text__char\">{tile.next === ' ' ? '\\u00A0' : tile.next}</span>\n                </span>\n              </>\n            )}\n          </span>\n        ))}\n      </div>\n    </>\n  );\n};\n\nexport default SplitFlapText;",
    "componentSourceJs": "\"use client\";\nimport { useEffect, useMemo, useRef, useState } from 'react';\nconst DEFAULT_WORDS = ['LAUNCH READY', 'SYNC ONLINE', 'SIGNAL LIVE'];\nconst CHARSETS = {\n    alpha: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',\n    alphanumeric: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',\n    numeric: '0123456789'\n};\nconst styles = `\n.split-flap-text{font-family:'SFMono-Regular','Roboto Mono','Cascadia Code','Liberation Mono',Menlo,monospace;font-size:var(--split-flap-font-size,52px);font-weight:760;line-height:1;letter-spacing:.035em;font-variant-numeric:tabular-nums}\n.split-flap-text__tile{position:relative;width:.78em;height:1.08em;overflow:hidden;border-radius:var(--split-flap-radius,8px);background:radial-gradient(circle at 50% 0%,rgba(255,255,255,.16),transparent 44%),linear-gradient(180deg,color-mix(in srgb,var(--split-flap-tile-color,#111827) 82%,white),var(--split-flap-tile-color,#111827));box-shadow:0 .035em .08em rgba(255,255,255,.08) inset,0 -.05em .1em rgba(0,0,0,.38) inset,0 .16em .38em rgba(0,0,0,.28);perspective:520px;transform-style:preserve-3d;isolation:isolate}\n.split-flap-text__tile:before{content:'';position:absolute;z-index:8;top:calc(50% - .5px);left:0;width:100%;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.18) 18%,rgba(0,0,0,.64) 50%,rgba(255,255,255,.14) 82%,transparent);box-shadow:0 -1px 0 rgba(255,255,255,.08),0 1px 0 rgba(0,0,0,.5);pointer-events:none}\n.split-flap-text__tile:after{content:'';position:absolute;inset:0;z-index:9;border:1px solid rgba(255,255,255,.08);border-radius:inherit;box-shadow:0 0 0 1px rgba(0,0,0,.2) inset;pointer-events:none}\n.split-flap-text__half,.split-flap-text__flap{position:absolute;left:0;width:100%;height:50%;overflow:hidden;background:linear-gradient(180deg,rgba(255,255,255,.07),transparent 34%),var(--split-flap-tile-color,#111827);backface-visibility:hidden}\n.split-flap-text__half--top,.split-flap-text__flap--front{top:0}\n.split-flap-text__half--bottom,.split-flap-text__flap--back{bottom:0;background:linear-gradient(0deg,rgba(255,255,255,.06),transparent 38%),color-mix(in srgb,var(--split-flap-tile-color,#111827) 92%,black)}\n.split-flap-text__char{position:absolute;left:0;width:100%;height:200%;display:flex;align-items:center;justify-content:center;color:var(--split-flap-text-color,#f8fafc);text-shadow:0 .025em 0 rgba(255,255,255,.16),0 .09em .16em rgba(0,0,0,.42)}\n.split-flap-text__half--top .split-flap-text__char,.split-flap-text__flap--front .split-flap-text__char{top:0}\n.split-flap-text__half--bottom .split-flap-text__char,.split-flap-text__flap--back .split-flap-text__char{bottom:0}\n.split-flap-text__flap{z-index:6;will-change:transform,filter;transform-style:preserve-3d}\n.split-flap-text__flap--front{transform-origin:center bottom;animation:split-flap-front var(--split-flap-flip-duration,.12s) cubic-bezier(.23,1,.32,1) both}\n.split-flap-text__flap--back{transform-origin:center top;transform:rotateX(90deg);animation:split-flap-back var(--split-flap-flip-duration,.12s) cubic-bezier(.23,1,.32,1) both}\n@keyframes split-flap-front{0%{transform:rotateX(0deg);filter:brightness(1.08)}100%{transform:rotateX(-90deg);filter:brightness(.52)}}\n@keyframes split-flap-back{0%,45%{transform:rotateX(90deg);filter:brightness(.58)}100%{transform:rotateX(0deg);filter:brightness(1)}}\n@media (prefers-reduced-motion:reduce){.split-flap-text__flap{animation:none!important}}\n`;\nconst toCssUnit = (value) => (typeof value === 'number' ? `${value}px` : value);\nconst resolveCharset = (charset) => {\n    if (charset && CHARSETS[charset])\n        return CHARSETS[charset];\n    return typeof charset === 'string' && charset.length > 0 ? charset : CHARSETS.alphanumeric;\n};\nconst normalizePhrase = (phrase, width) => {\n    const safe = String(phrase ?? '');\n    return safe.padEnd(width, ' ').slice(0, width);\n};\nconst createTiles = (phrase) => phrase.split('').map(char => ({\n    current: char,\n    next: char,\n    flipping: false,\n    tick: 0\n}));\nconst sampleChar = (charset) => charset.charAt(Math.floor(Math.random() * charset.length)) || ' ';\nconst buildSequence = (target, flips, charset) => {\n    const steps = [];\n    for (let i = 0; i < flips; i += 1) {\n        steps.push(sampleChar(charset));\n    }\n    steps.push(target);\n    return steps;\n};\nconst usePrefersReducedMotion = () => {\n    const [prefersReduced, setPrefersReduced] = useState(false);\n    useEffect(() => {\n        if (typeof window === 'undefined' || !window.matchMedia)\n            return;\n        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');\n        const handleChange = () => setPrefersReduced(mediaQuery.matches);\n        handleChange();\n        mediaQuery.addEventListener('change', handleChange);\n        return () => mediaQuery.removeEventListener('change', handleChange);\n    }, []);\n    return prefersReduced;\n};\nexport const SplitFlapText = ({ words = ['LAUNCH READY', 'SYNC ONLINE', 'SIGNAL LIVE'], text, flipDuration = 0.12, stagger = 0.06, cycleDelay = 2400, charset = 'alphanumeric', flipsPerChar = 8, tileColor = '#111827', textColor = '#f8fafc', tileRadius = 8, gap = 6, fontSize = 52, loop = true, padTo = 12, className = '', style = {}, ...props }) => {\n    const prefersReducedMotion = usePrefersReducedMotion();\n    const rafRef = useRef(null);\n    const cycleTimerRef = useRef(null);\n    const currentTextRef = useRef('');\n    const sourceWords = Array.isArray(words) && words.length > 0 ? words : DEFAULT_WORDS;\n    const phrasesKey = typeof text === 'string' ? text : sourceWords.map(word => String(word ?? '')).join('\\u001f');\n    const phrases = useMemo(() => phrasesKey.split('\\u001f'), [phrasesKey]);\n    const width = useMemo(() => {\n        const longest = phrases.reduce((max, phrase) => Math.max(max, phrase.length), 1);\n        return Math.max(1, Math.ceil(Number(padTo) || 0), longest);\n    }, [padTo, phrases]);\n    const normalizedPhrases = useMemo(() => phrases.map(phrase => normalizePhrase(phrase, width)), [phrases, width]);\n    const [tiles, setTiles] = useState(() => createTiles(normalizedPhrases[0] || ''));\n    useEffect(() => {\n        const clearAnimation = () => {\n            if (rafRef.current) {\n                cancelAnimationFrame(rafRef.current);\n                rafRef.current = null;\n            }\n            if (cycleTimerRef.current) {\n                clearTimeout(cycleTimerRef.current);\n                cycleTimerRef.current = null;\n            }\n        };\n        clearAnimation();\n        const firstPhrase = normalizedPhrases[0] || '';\n        currentTextRef.current = firstPhrase;\n        setTiles(createTiles(firstPhrase));\n        if (normalizedPhrases.length <= 1 || typeof window === 'undefined') {\n            return clearAnimation;\n        }\n        let phraseIndex = 0;\n        let cancelled = false;\n        const safeFlipMs = Math.max(40, (Number(flipDuration) || 0.12) * 1000);\n        const safeStaggerMs = Math.max(0, (Number(stagger) || 0) * 1000);\n        const safeCycleDelay = Math.max(400, Number(cycleDelay) || 2400);\n        const safeFlips = Math.max(0, Math.floor(Number(flipsPerChar) || 0));\n        const activeCharset = resolveCharset(charset);\n        const animateTo = (targetPhrase) => {\n            if (prefersReducedMotion) {\n                currentTextRef.current = targetPhrase;\n                setTiles(createTiles(targetPhrase));\n                return 0;\n            }\n            const fromPhrase = normalizePhrase(currentTextRef.current, width);\n            const targetChars = targetPhrase.split('');\n            const plans = targetChars\n                .map((targetChar, index) => {\n                const fromChar = fromPhrase[index] || ' ';\n                if (fromChar === targetChar)\n                    return null;\n                return {\n                    index,\n                    from: fromChar,\n                    target: targetChar,\n                    sequence: buildSequence(targetChar, safeFlips, activeCharset),\n                    start: index * safeStaggerMs,\n                    step: -1,\n                    done: false\n                };\n            })\n                .filter((plan) => plan !== null);\n            if (!plans.length) {\n                currentTextRef.current = targetPhrase;\n                setTiles(createTiles(targetPhrase));\n                return 0;\n            }\n            const totalDuration = plans.reduce((max, plan) => Math.max(max, plan.start + plan.sequence.length * safeFlipMs), 0);\n            const startedAt = performance.now();\n            const updateTiles = (updates) => {\n                setTiles(previous => {\n                    const nextTiles = [...previous];\n                    updates.forEach(update => {\n                        const tile = nextTiles[update.index];\n                        if (!tile)\n                            return;\n                        nextTiles[update.index] = {\n                            current: update.current,\n                            next: update.next,\n                            flipping: !update.done,\n                            tick: tile.tick + 1\n                        };\n                    });\n                    return nextTiles;\n                });\n            };\n            const tick = (now) => {\n                if (cancelled)\n                    return;\n                const elapsed = now - startedAt;\n                const updates = [];\n                let shouldContinue = false;\n                plans.forEach(plan => {\n                    const localElapsed = elapsed - plan.start;\n                    if (localElapsed < 0) {\n                        shouldContinue = true;\n                        return;\n                    }\n                    const step = Math.floor(localElapsed / safeFlipMs);\n                    if (step < plan.sequence.length) {\n                        shouldContinue = true;\n                        if (step !== plan.step) {\n                            plan.step = step;\n                            updates.push({\n                                index: plan.index,\n                                current: step === 0 ? plan.from : plan.sequence[step - 1],\n                                next: plan.sequence[step],\n                                done: false\n                            });\n                        }\n                    }\n                    else if (!plan.done) {\n                        plan.done = true;\n                        updates.push({\n                            index: plan.index,\n                            current: plan.target,\n                            next: plan.target,\n                            done: true\n                        });\n                    }\n                });\n                if (updates.length > 0)\n                    updateTiles(updates);\n                if (shouldContinue) {\n                    rafRef.current = requestAnimationFrame(tick);\n                }\n                else {\n                    currentTextRef.current = targetPhrase;\n                    rafRef.current = null;\n                }\n            };\n            rafRef.current = requestAnimationFrame(tick);\n            return totalDuration;\n        };\n        const scheduleNext = (delay) => {\n            cycleTimerRef.current = window.setTimeout(() => {\n                if (cancelled)\n                    return;\n                const nextIndex = phraseIndex + 1;\n                if (nextIndex >= normalizedPhrases.length && !loop)\n                    return;\n                phraseIndex = nextIndex % normalizedPhrases.length;\n                const animationDuration = animateTo(normalizedPhrases[phraseIndex]);\n                scheduleNext(safeCycleDelay + animationDuration);\n            }, delay);\n        };\n        scheduleNext(safeCycleDelay);\n        return () => {\n            cancelled = true;\n            clearAnimation();\n        };\n    }, [normalizedPhrases, width, loop, cycleDelay, flipDuration, stagger, flipsPerChar, charset, prefersReducedMotion]);\n    const settledText = tiles\n        .map(tile => tile.current)\n        .join('')\n        .trimEnd();\n    const componentStyle = {\n        '--split-flap-tile-color': tileColor,\n        '--split-flap-text-color': textColor,\n        '--split-flap-radius': toCssUnit(tileRadius),\n        '--split-flap-gap': toCssUnit(gap),\n        '--split-flap-font-size': toCssUnit(fontSize),\n        '--split-flap-flip-duration': `${Math.max(0.04, Number(flipDuration) || 0.12)}s`,\n        ...style\n    };\n    return (<>\n      <style>{styles}</style>\n      <div className={`split-flap-text inline-flex items-center whitespace-pre select-none ${className}`.trim()} style={componentStyle} role=\"text\" aria-label={settledText || undefined} {...props}>\n        {tiles.map((tile, index) => (<span className=\"split-flap-text__tile\" aria-hidden=\"true\" key={`${index}-${tiles.length}`}>\n            <span className=\"split-flap-text__half split-flap-text__half--top\">\n              <span className=\"split-flap-text__char\">{tile.current === ' ' ? '\\u00A0' : tile.current}</span>\n            </span>\n            <span className=\"split-flap-text__half split-flap-text__half--bottom\">\n              <span className=\"split-flap-text__char\">{tile.flipping ? tile.next : tile.current}</span>\n            </span>\n\n            {tile.flipping && (<>\n                <span className=\"split-flap-text__flap split-flap-text__flap--front\" key={`front-${index}-${tile.tick}`}>\n                  <span className=\"split-flap-text__char\">{tile.current === ' ' ? '\\u00A0' : tile.current}</span>\n                </span>\n                <span className=\"split-flap-text__flap split-flap-text__flap--back\" key={`back-${index}-${tile.tick}`}>\n                  <span className=\"split-flap-text__char\">{tile.next === ' ' ? '\\u00A0' : tile.next}</span>\n                </span>\n              </>)}\n          </span>))}\n      </div>\n    </>);\n};\nexport default SplitFlapText;",
    "props": [
      {
        "name": "words",
        "type": "string[]",
        "default": "['LAUNCH READY', 'SYNC ONLINE', 'SIGNAL LIVE']",
        "description": "Controls the words for the component animation."
      },
      {
        "name": "text",
        "type": "string",
        "default": "-",
        "description": "The text content to display and animate."
      },
      {
        "name": "flipDuration",
        "type": "number",
        "default": "0.12",
        "description": "Controls the flip duration for the component animation."
      },
      {
        "name": "stagger",
        "type": "number",
        "default": "0.06",
        "description": "Stagger delay in seconds between individual characters/elements."
      },
      {
        "name": "cycleDelay",
        "type": "number",
        "default": "2400",
        "description": "Controls the cycle delay for the component animation."
      },
      {
        "name": "charset",
        "type": "'alpha' | 'alphanumeric' | 'numeric' | (string & {})",
        "default": "'alphanumeric'",
        "description": "Controls the charset for the component animation."
      },
      {
        "name": "flipsPerChar",
        "type": "number",
        "default": "8",
        "description": "Controls the flips per char for the component animation."
      },
      {
        "name": "tileColor",
        "type": "string",
        "default": "'#111827'",
        "description": "Controls the tile color for the component animation."
      },
      {
        "name": "textColor",
        "type": "string",
        "default": "'#f8fafc'",
        "description": "Controls the text color for the component animation."
      },
      {
        "name": "tileRadius",
        "type": "number | string",
        "default": "8",
        "description": "Controls the tile radius for the component animation."
      },
      {
        "name": "gap",
        "type": "number | string",
        "default": "6",
        "description": "Controls the gap for the component animation."
      },
      {
        "name": "fontSize",
        "type": "number | string",
        "default": "52",
        "description": "Font size in pixels, rems, or fluid clamp notation."
      },
      {
        "name": "loop",
        "type": "boolean",
        "default": "true",
        "description": "Controls the loop for the component animation."
      },
      {
        "name": "padTo",
        "type": "number",
        "default": "12",
        "description": "Controls the pad to for the component animation."
      }
    ]
  },
  "split-text": {
    "slug": "split-text",
    "name": "Split Text",
    "description": "Splits text into characters / words for staggered entrance animation.",
    "dependencies": {
      "gsap": "^3.13.0",
      "@gsap/react": "^2.1.2"
    },
    "installation": {
      "cliTs": "npx kibo add split-text",
      "cliJs": "npx kibo add split-text --js",
      "npm": "npm i gsap @gsap/react",
      "pnpm": "pnpm add gsap @gsap/react",
      "yarn": "yarn add gsap @gsap/react",
      "bun": "bun add gsap @gsap/react"
    },
    "usageTs": "import { SplitText } from \"@/components/kibo/split-text/component\";\n\nexport default function MyComponent() {\n  return (\n    <SplitText\n      text=\"A new era of motion design\"\n      className=\"text-4xl font-semibold text-white\"\n      delay={30}\n      splitType=\"chars\"\n    />\n  );\n}",
    "usageJs": "import { SplitText } from \"@/components/kibo/split-text/component\";\nexport default function MyComponent() {\n    return (<SplitText text=\"A new era of motion design\" className=\"text-4xl font-semibold text-white\" delay={30} splitType=\"chars\"/>);\n}",
    "componentSourceTs": "\"use client\";\n\nimport React, { useRef, useEffect, useState } from \"react\";\nimport { gsap } from \"gsap\";\nimport { ScrollTrigger } from \"gsap/ScrollTrigger\";\nimport { SplitText as GSAPSplitText } from \"gsap/SplitText\";\nimport { useGSAP } from \"@gsap/react\";\n\ngsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP);\n\nexport interface SplitTextProps {\n  /** The text content to split and animate. */\n  text: string;\n  /** Additional CSS classes. */\n  className?: string;\n  /** Delay in milliseconds between each animated element. */\n  delay?: number;\n  /** Duration of the animation in seconds. */\n  duration?: number;\n  /** GSAP easing function or string. */\n  ease?: string | ((t: number) => number);\n  /** How the text should be split. */\n  splitType?: \"chars\" | \"words\" | \"lines\" | \"words, chars\";\n  /** Starting GSAP animation properties. */\n  from?: gsap.TweenVars;\n  /** Target GSAP animation properties. */\n  to?: gsap.TweenVars;\n  /** Intersection Observer threshold (0-1). */\n  threshold?: number;\n  /** Intersection Observer root margin. */\n  rootMargin?: string;\n  /** The HTML tag to render. */\n  tag?: \"h1\" | \"h2\" | \"h3\" | \"h4\" | \"h5\" | \"h6\" | \"p\" | \"span\";\n  /** Text alignment. */\n  textAlign?: React.CSSProperties[\"textAlign\"];\n  /** Callback fired when the entire animation completes. */\n  onLetterAnimationComplete?: () => void;\n}\n\nexport function SplitText({\n  text,\n  className = \"\",\n  delay = 50,\n  duration = 1.25,\n  ease = \"power3.out\",\n  splitType = \"chars\",\n  from = { opacity: 0, y: 40 },\n  to = { opacity: 1, y: 0 },\n  threshold = 0.1,\n  rootMargin = \"-100px\",\n  tag = \"p\",\n  textAlign = \"center\",\n  onLetterAnimationComplete,\n}: SplitTextProps) {\n  const ref = useRef<HTMLParagraphElement>(null);\n  const animationCompletedRef = useRef(false);\n  const onCompleteRef = useRef(onLetterAnimationComplete);\n  const [fontsLoaded, setFontsLoaded] = useState<boolean>(\n    typeof document !== \"undefined\" && document.fonts.status === \"loaded\"\n  );\n\n  useEffect(() => {\n    onCompleteRef.current = onLetterAnimationComplete;\n  }, [onLetterAnimationComplete]);\n\n  useEffect(() => {\n    if (!fontsLoaded && typeof document !== \"undefined\") {\n      document.fonts.ready.then(() => {\n        setFontsLoaded(true);\n      });\n    }\n  }, [fontsLoaded]);\n\n  useGSAP(\n    () => {\n      if (!ref.current || !text || !fontsLoaded) return;\n      if (animationCompletedRef.current) return;\n      const el = ref.current as HTMLElement & {\n        _rbsplitInstance?: GSAPSplitText;\n      };\n\n      if (el._rbsplitInstance) {\n        try {\n          el._rbsplitInstance.revert();\n        } catch {\n        }\n        el._rbsplitInstance = undefined;\n      }\n\n      const startPct = (1 - threshold) * 100;\n      const marginMatch = /^(-?\\d+(?:\\.\\d+)?)(px|em|rem|%)?$/.exec(rootMargin);\n      const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;\n      const marginUnit = marginMatch ? marginMatch[2] || \"px\" : \"px\";\n      const sign =\n        marginValue === 0\n          ? \"\"\n          : marginValue < 0\n            ? `-=${Math.abs(marginValue)}${marginUnit}`\n            : `+=${marginValue}${marginUnit}`;\n      const start = `top ${startPct}%${sign}`;\n      let targets: Element[] = [];\n      const assignTargets = (self: GSAPSplitText) => {\n        if (splitType.includes(\"chars\") && (self as GSAPSplitText).chars?.length)\n          targets = (self as GSAPSplitText).chars;\n        if (!targets.length && splitType.includes(\"words\") && self.words.length)\n          targets = self.words;\n        if (!targets.length && splitType.includes(\"lines\") && self.lines.length)\n          targets = self.lines;\n        if (!targets.length) targets = self.chars || self.words || self.lines;\n      };\n\n      const splitInstance = new GSAPSplitText(el, {\n        type: splitType,\n        smartWrap: true,\n        autoSplit: splitType === \"lines\",\n        linesClass: \"split-line\",\n        wordsClass: \"split-word\",\n        charsClass: \"split-char\",\n        reduceWhiteSpace: false,\n        onSplit: (self: GSAPSplitText) => {\n          assignTargets(self);\n          return gsap.fromTo(\n            targets,\n            { ...from },\n            {\n              ...to,\n              duration,\n              ease,\n              stagger: delay / 1000,\n              scrollTrigger: {\n                trigger: el,\n                start,\n                once: true,\n                fastScrollEnd: true,\n                anticipatePin: 0.4,\n              },\n              onComplete: () => {\n                animationCompletedRef.current = true;\n                onCompleteRef.current?.();\n              },\n              willChange: \"transform, opacity\",\n              force3D: true,\n            }\n          );\n        },\n      });\n      el._rbsplitInstance = splitInstance;\n      return () => {\n        ScrollTrigger.getAll().forEach((st: ScrollTrigger) => {\n          if (st.trigger === el) st.kill();\n        });\n        try {\n          splitInstance.revert();\n        } catch {\n        }\n        el._rbsplitInstance = undefined;\n      };\n    },\n    {\n      dependencies: [\n        text,\n        delay,\n        duration,\n        ease,\n        splitType,\n        JSON.stringify(from),\n        JSON.stringify(to),\n        threshold,\n        rootMargin,\n        fontsLoaded,\n      ],\n      scope: ref,\n    }\n  );\n\n  const renderTag = () => {\n    const style: React.CSSProperties = {\n      textAlign,\n      wordWrap: \"break-word\",\n      willChange: \"transform, opacity\",\n    };\n    const classes = `split-parent overflow-hidden inline-block whitespace-normal ${className}`;\n    const Tag = (tag || \"p\") as React.ElementType;\n\n    return (\n      <Tag ref={ref} style={style} className={classes}>\n        {text}\n      </Tag>\n    );\n  };\n\n  return renderTag();\n}\n",
    "componentSourceJs": "\"use client\";\nimport React, { useRef, useEffect, useState } from \"react\";\nimport { gsap } from \"gsap\";\nimport { ScrollTrigger } from \"gsap/ScrollTrigger\";\nimport { SplitText as GSAPSplitText } from \"gsap/SplitText\";\nimport { useGSAP } from \"@gsap/react\";\ngsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP);\nexport function SplitText({ text, className = \"\", delay = 50, duration = 1.25, ease = \"power3.out\", splitType = \"chars\", from = { opacity: 0, y: 40 }, to = { opacity: 1, y: 0 }, threshold = 0.1, rootMargin = \"-100px\", tag = \"p\", textAlign = \"center\", onLetterAnimationComplete, }) {\n    const ref = useRef(null);\n    const animationCompletedRef = useRef(false);\n    const onCompleteRef = useRef(onLetterAnimationComplete);\n    const [fontsLoaded, setFontsLoaded] = useState(typeof document !== \"undefined\" && document.fonts.status === \"loaded\");\n    useEffect(() => {\n        onCompleteRef.current = onLetterAnimationComplete;\n    }, [onLetterAnimationComplete]);\n    useEffect(() => {\n        if (!fontsLoaded && typeof document !== \"undefined\") {\n            document.fonts.ready.then(() => {\n                setFontsLoaded(true);\n            });\n        }\n    }, [fontsLoaded]);\n    useGSAP(() => {\n        if (!ref.current || !text || !fontsLoaded)\n            return;\n        if (animationCompletedRef.current)\n            return;\n        const el = ref.current;\n        if (el._rbsplitInstance) {\n            try {\n                el._rbsplitInstance.revert();\n            }\n            catch {\n            }\n            el._rbsplitInstance = undefined;\n        }\n        const startPct = (1 - threshold) * 100;\n        const marginMatch = /^(-?\\d+(?:\\.\\d+)?)(px|em|rem|%)?$/.exec(rootMargin);\n        const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;\n        const marginUnit = marginMatch ? marginMatch[2] || \"px\" : \"px\";\n        const sign = marginValue === 0\n            ? \"\"\n            : marginValue < 0\n                ? `-=${Math.abs(marginValue)}${marginUnit}`\n                : `+=${marginValue}${marginUnit}`;\n        const start = `top ${startPct}%${sign}`;\n        let targets = [];\n        const assignTargets = (self) => {\n            if (splitType.includes(\"chars\") && self.chars?.length)\n                targets = self.chars;\n            if (!targets.length && splitType.includes(\"words\") && self.words.length)\n                targets = self.words;\n            if (!targets.length && splitType.includes(\"lines\") && self.lines.length)\n                targets = self.lines;\n            if (!targets.length)\n                targets = self.chars || self.words || self.lines;\n        };\n        const splitInstance = new GSAPSplitText(el, {\n            type: splitType,\n            smartWrap: true,\n            autoSplit: splitType === \"lines\",\n            linesClass: \"split-line\",\n            wordsClass: \"split-word\",\n            charsClass: \"split-char\",\n            reduceWhiteSpace: false,\n            onSplit: (self) => {\n                assignTargets(self);\n                return gsap.fromTo(targets, { ...from }, {\n                    ...to,\n                    duration,\n                    ease,\n                    stagger: delay / 1000,\n                    scrollTrigger: {\n                        trigger: el,\n                        start,\n                        once: true,\n                        fastScrollEnd: true,\n                        anticipatePin: 0.4,\n                    },\n                    onComplete: () => {\n                        animationCompletedRef.current = true;\n                        onCompleteRef.current?.();\n                    },\n                    willChange: \"transform, opacity\",\n                    force3D: true,\n                });\n            },\n        });\n        el._rbsplitInstance = splitInstance;\n        return () => {\n            ScrollTrigger.getAll().forEach((st) => {\n                if (st.trigger === el)\n                    st.kill();\n            });\n            try {\n                splitInstance.revert();\n            }\n            catch {\n            }\n            el._rbsplitInstance = undefined;\n        };\n    }, {\n        dependencies: [\n            text,\n            delay,\n            duration,\n            ease,\n            splitType,\n            JSON.stringify(from),\n            JSON.stringify(to),\n            threshold,\n            rootMargin,\n            fontsLoaded,\n        ],\n        scope: ref,\n    });\n    const renderTag = () => {\n        const style = {\n            textAlign,\n            wordWrap: \"break-word\",\n            willChange: \"transform, opacity\",\n        };\n        const classes = `split-parent overflow-hidden inline-block whitespace-normal ${className}`;\n        const Tag = (tag || \"p\");\n        return (<Tag ref={ref} style={style} className={classes}>\n        {text}\n      </Tag>);\n    };\n    return renderTag();\n}",
    "props": [
      {
        "name": "text",
        "type": "string",
        "default": "-",
        "description": "The text content to split and animate."
      },
      {
        "name": "className",
        "type": "string",
        "default": "\"\"",
        "description": "Additional CSS classes."
      },
      {
        "name": "delay",
        "type": "number",
        "default": "50",
        "description": "Delay in milliseconds between each animated element."
      },
      {
        "name": "duration",
        "type": "number",
        "default": "1.25",
        "description": "Duration of the animation in seconds."
      },
      {
        "name": "ease",
        "type": "string | ((t: number) => number)",
        "default": "\"power3.out\"",
        "description": "GSAP easing function or string."
      },
      {
        "name": "splitType",
        "type": "\"chars\" | \"words\" | \"lines\" | \"words, chars\"",
        "default": "\"chars\"",
        "description": "How the text should be split."
      },
      {
        "name": "from",
        "type": "gsap.TweenVars",
        "default": "{ opacity: 0, y: 40 }",
        "description": "Starting GSAP animation properties."
      },
      {
        "name": "to",
        "type": "gsap.TweenVars",
        "default": "{ opacity: 1, y: 0 }",
        "description": "Target GSAP animation properties."
      },
      {
        "name": "threshold",
        "type": "number",
        "default": "0.1",
        "description": "Intersection Observer threshold (0-1)."
      },
      {
        "name": "rootMargin",
        "type": "string",
        "default": "\"-100px\"",
        "description": "Intersection Observer root margin."
      },
      {
        "name": "tag",
        "type": "\"h1\" | \"h2\" | \"h3\" | \"h4\" | \"h5\" | \"h6\" | \"p\" | \"span\"",
        "default": "\"p\"",
        "description": "The HTML tag to render."
      },
      {
        "name": "textAlign",
        "type": "React.CSSProperties[\"textAlign\"]",
        "default": "\"center\"",
        "description": "Text alignment."
      },
      {
        "name": "onLetterAnimationComplete",
        "type": "() => void",
        "default": "-",
        "description": "Callback fired when the entire animation completes."
      }
    ]
  },
  "stroke-text": {
    "slug": "stroke-text",
    "name": "Stroke Text",
    "description": "Vector outline drawing animation sketching letter paths with SVG stroke-dashoffset transitions on scroll.",
    "dependencies": {
      "gsap": "^3.13.0"
    },
    "installation": {
      "cliTs": "npx kibo add stroke-text",
      "cliJs": "npx kibo add stroke-text --js",
      "npm": "npm i gsap",
      "pnpm": "pnpm add gsap",
      "yarn": "yarn add gsap",
      "bun": "bun add gsap"
    },
    "usageTs": "import { StrokeText } from \"@/components/kibo/stroke-text/component\";\n\nexport default function Example() {\n  return (\n    <StrokeText />\n  );\n}",
    "usageJs": "import { StrokeText } from \"@/components/kibo/stroke-text/component\";\nexport default function Example() {\n    return (<StrokeText />);\n}",
    "componentSourceTs": "\"use client\";\n\nimport { CSSProperties, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';\nimport { gsap } from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';\n\nif (typeof window !== 'undefined') {\n  gsap.registerPlugin(ScrollTrigger);\n}\n\nexport type StrokeTextTrigger = 'mount' | 'hover' | 'scroll' | 'loop';\nexport type StrokeTextFillMode = 'wipe' | 'fade' | 'none';\n\nexport interface StrokeTextProps {\n  text?: string;\n  strokeColor?: string;\n  fillColor?: string;\n  strokeWidth?: number;\n  drawDuration?: number;\n  fillDelay?: number;\n  stagger?: number;\n  ease?: string;\n  trigger?: StrokeTextTrigger;\n  fillMode?: StrokeTextFillMode;\n  fontSize?: number;\n  fontWeight?: number | string;\n  letterSpacing?: number;\n  reverse?: boolean;\n  className?: string;\n  style?: CSSProperties;\n}\n\ninterface StrokeTextBox {\n  x: number;\n  y: number;\n  width: number;\n  height: number;\n}\n\nconst DEFAULT_TEXT = 'Draw Attention';\n\nexport const StrokeText = ({\n  text = DEFAULT_TEXT,\n  strokeColor = '#A78BFA',\n  fillColor = '#F8FAFC',\n  strokeWidth = 1.4,\n  drawDuration = 1.6,\n  fillDelay = 0.2,\n  stagger = 0.05,\n  ease = 'power2.out',\n  trigger = 'mount',\n  fillMode = 'wipe',\n  fontSize = 128,\n  fontWeight = 800,\n  letterSpacing = -4,\n  reverse = false,\n  className = '',\n  style = {}\n}: StrokeTextProps) => {\n  const rootRef = useRef<HTMLSpanElement | null>(null);\n  const strokeTextRef = useRef<SVGTextElement | null>(null);\n  const wipeRectRef = useRef<SVGRectElement | null>(null);\n\n  const [box, setBox] = useState<StrokeTextBox | null>(null);\n\n  const rawId = useId();\n  const wipeId = `stroke-text-wipe-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;\n\n  const characters = useMemo(() => Array.from(String(text ?? '')), [text]);\n\n  const dash = Math.max(fontSize * 7, 200);\n\n  const fontStyle = useMemo<CSSProperties>(\n    () => ({\n      fontSize: `${fontSize}px`,\n      fontWeight,\n      letterSpacing: `${letterSpacing}px`\n    }),\n    [fontSize, fontWeight, letterSpacing]\n  );\n\n  useLayoutEffect(() => {\n    const node = strokeTextRef.current;\n    if (!node) return undefined;\n\n    let cancelled = false;\n\n    const measure = () => {\n      if (cancelled || !strokeTextRef.current) return;\n      let bbox: DOMRect | undefined;\n      try {\n        bbox = strokeTextRef.current.getBBox();\n      } catch {\n        return;\n      }\n      if (!bbox || !bbox.width) return;\n\n      const pad = Math.max(Number(strokeWidth) || 1, fontSize * 0.1);\n      const next = {\n        x: bbox.x - pad,\n        y: bbox.y - pad,\n        width: bbox.width + pad * 2,\n        height: bbox.height + pad * 2\n      };\n\n      setBox(prev =>\n        prev &&\n        Math.abs(prev.x - next.x) < 0.5 &&\n        Math.abs(prev.width - next.width) < 0.5 &&\n        Math.abs(prev.y - next.y) < 0.5\n          ? prev\n          : next\n      );\n    };\n\n    measure();\n    if (typeof document !== 'undefined' && document.fonts?.ready) {\n      document.fonts.ready.then(measure).catch(() => {});\n    }\n\n    return () => {\n      cancelled = true;\n    };\n  }, [characters, fontSize, fontWeight, letterSpacing, strokeWidth]);\n\n  useEffect(() => {\n    const root = rootRef.current;\n    if (typeof window === 'undefined' || !root || !box) return undefined;\n\n    const strokes = gsap.utils.toArray(root.querySelectorAll('[data-stroke-char]'));\n    const fills = gsap.utils.toArray(root.querySelectorAll('[data-fill-char]'));\n    const wipe = wipeRectRef.current;\n    if (!strokes.length) return undefined;\n\n    const fillEnabled = fillMode !== 'none';\n    const useWipe = fillEnabled && fillMode === 'wipe';\n    const fillDuration = Math.max(0.4, drawDuration * 0.5);\n    const staggerConfig: number | gsap.StaggerVars = reverse ? { each: stagger, from: 'end' as const } : stagger;\n    const targets = [...strokes, ...fills, wipe].filter(Boolean);\n\n    const setStart = () => {\n      gsap.killTweensOf(targets);\n      gsap.set(strokes, { strokeDasharray: dash, strokeDashoffset: dash });\n      gsap.set(fills, { opacity: useWipe ? 1 : 0 });\n      if (wipe) gsap.set(wipe, { attr: { width: 0 } });\n    };\n\n    const setEnd = () => {\n      gsap.killTweensOf(targets);\n      gsap.set(strokes, { strokeDasharray: dash, strokeDashoffset: 0 });\n      gsap.set(fills, { opacity: fillEnabled ? 1 : 0 });\n      if (wipe) gsap.set(wipe, { attr: { width: fillEnabled ? box.width : 0 } });\n    };\n\n    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;\n    if (prefersReducedMotion) {\n      setEnd();\n      return () => gsap.killTweensOf(targets);\n    }\n\n    const build = () => {\n      setStart();\n      const tl = gsap.timeline({\n        paused: true,\n        repeat: trigger === 'loop' ? -1 : 0,\n        repeatDelay: trigger === 'loop' ? 0.9 : 0,\n        defaults: { overwrite: 'auto' }\n      });\n\n      tl.to(strokes, { strokeDashoffset: 0, duration: drawDuration, ease, stagger: staggerConfig }, 0);\n\n      if (useWipe && wipe) {\n        tl.to(\n          wipe,\n          { attr: { width: box.width }, duration: fillDuration, ease: 'power2.inOut' },\n          drawDuration + fillDelay\n        );\n      } else if (fillEnabled) {\n        tl.to(\n          fills,\n          { opacity: 1, duration: fillDuration, ease: 'power2.out', stagger: staggerConfig },\n          drawDuration + fillDelay\n        );\n      }\n\n      return tl;\n    };\n\n    let timeline: gsap.core.Timeline | null = null;\n    let scrollTrigger: ReturnType<typeof ScrollTrigger.create> | null = null;\n    let removeHover: (() => void) | null = null;\n\n    if (trigger === 'hover') {\n      setEnd();\n      const play = () => {\n        timeline?.kill();\n        timeline = build();\n        timeline.play(0);\n      };\n      root.addEventListener('pointerenter', play);\n      removeHover = () => root.removeEventListener('pointerenter', play);\n    } else {\n      timeline = build();\n      if (trigger === 'scroll') {\n        scrollTrigger = ScrollTrigger.create({\n          trigger: root,\n          start: 'top 82%',\n          once: true,\n          onEnter: () => timeline?.play(0)\n        });\n      } else {\n        timeline.play(0);\n      }\n    }\n\n    return () => {\n      removeHover?.();\n      scrollTrigger?.kill();\n      timeline?.kill();\n      gsap.killTweensOf(targets);\n    };\n  }, [box, dash, drawDuration, fillDelay, stagger, ease, trigger, fillMode, reverse]);\n\n  const viewBox = box ? `${box.x} ${box.y} ${box.width} ${box.height}` : `0 ${-fontSize} 600 ${fontSize * 1.3}`;\n\n  return (\n    <span\n      ref={rootRef}\n      className={`block w-full leading-[0] ${trigger === 'hover' ? 'cursor-pointer' : ''} ${className}`.trim()}\n      style={style}\n      role=\"img\"\n      aria-label={String(text ?? '')}\n    >\n      <svg\n        className=\"block w-full\"\n        style={{ height: `${Math.round(fontSize * 1.3)}px` }}\n        viewBox={viewBox}\n        preserveAspectRatio=\"xMidYMid meet\"\n        aria-hidden=\"true\"\n      >\n        {fillMode === 'wipe' && box && (\n          <defs>\n            <clipPath id={wipeId} clipPathUnits=\"userSpaceOnUse\">\n              <rect ref={wipeRectRef} x={box.x} y={box.y} width=\"0\" height={box.height} />\n            </clipPath>\n          </defs>\n        )}\n\n        <text\n          ref={strokeTextRef}\n          className=\"select-none\"\n          x=\"0\"\n          y=\"0\"\n          fill=\"none\"\n          stroke={strokeColor}\n          strokeWidth={strokeWidth}\n          strokeLinejoin=\"round\"\n          strokeLinecap=\"round\"\n          style={fontStyle}\n        >\n          {characters.map((char, index) => (\n            <tspan data-stroke-char key={`s-${index}`}>\n              {char}\n            </tspan>\n          ))}\n        </text>\n\n        <text\n          className=\"select-none\"\n          x=\"0\"\n          y=\"0\"\n          fill={fillColor}\n          stroke=\"none\"\n          style={fontStyle}\n          clipPath={fillMode === 'wipe' && box ? `url(#${wipeId})` : undefined}\n        >\n          {characters.map((char, index) => (\n            <tspan data-fill-char key={`f-${index}`}>\n              {char}\n            </tspan>\n          ))}\n        </text>\n      </svg>\n    </span>\n  );\n};\n\nexport default StrokeText;",
    "componentSourceJs": "\"use client\";\nimport { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';\nimport { gsap } from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';\nif (typeof window !== 'undefined') {\n    gsap.registerPlugin(ScrollTrigger);\n}\nconst DEFAULT_TEXT = 'Draw Attention';\nexport const StrokeText = ({ text = DEFAULT_TEXT, strokeColor = '#A78BFA', fillColor = '#F8FAFC', strokeWidth = 1.4, drawDuration = 1.6, fillDelay = 0.2, stagger = 0.05, ease = 'power2.out', trigger = 'mount', fillMode = 'wipe', fontSize = 128, fontWeight = 800, letterSpacing = -4, reverse = false, className = '', style = {} }) => {\n    const rootRef = useRef(null);\n    const strokeTextRef = useRef(null);\n    const wipeRectRef = useRef(null);\n    const [box, setBox] = useState(null);\n    const rawId = useId();\n    const wipeId = `stroke-text-wipe-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;\n    const characters = useMemo(() => Array.from(String(text ?? '')), [text]);\n    const dash = Math.max(fontSize * 7, 200);\n    const fontStyle = useMemo(() => ({\n        fontSize: `${fontSize}px`,\n        fontWeight,\n        letterSpacing: `${letterSpacing}px`\n    }), [fontSize, fontWeight, letterSpacing]);\n    useLayoutEffect(() => {\n        const node = strokeTextRef.current;\n        if (!node)\n            return undefined;\n        let cancelled = false;\n        const measure = () => {\n            if (cancelled || !strokeTextRef.current)\n                return;\n            let bbox;\n            try {\n                bbox = strokeTextRef.current.getBBox();\n            }\n            catch {\n                return;\n            }\n            if (!bbox || !bbox.width)\n                return;\n            const pad = Math.max(Number(strokeWidth) || 1, fontSize * 0.1);\n            const next = {\n                x: bbox.x - pad,\n                y: bbox.y - pad,\n                width: bbox.width + pad * 2,\n                height: bbox.height + pad * 2\n            };\n            setBox(prev => prev &&\n                Math.abs(prev.x - next.x) < 0.5 &&\n                Math.abs(prev.width - next.width) < 0.5 &&\n                Math.abs(prev.y - next.y) < 0.5\n                ? prev\n                : next);\n        };\n        measure();\n        if (typeof document !== 'undefined' && document.fonts?.ready) {\n            document.fonts.ready.then(measure).catch(() => { });\n        }\n        return () => {\n            cancelled = true;\n        };\n    }, [characters, fontSize, fontWeight, letterSpacing, strokeWidth]);\n    useEffect(() => {\n        const root = rootRef.current;\n        if (typeof window === 'undefined' || !root || !box)\n            return undefined;\n        const strokes = gsap.utils.toArray(root.querySelectorAll('[data-stroke-char]'));\n        const fills = gsap.utils.toArray(root.querySelectorAll('[data-fill-char]'));\n        const wipe = wipeRectRef.current;\n        if (!strokes.length)\n            return undefined;\n        const fillEnabled = fillMode !== 'none';\n        const useWipe = fillEnabled && fillMode === 'wipe';\n        const fillDuration = Math.max(0.4, drawDuration * 0.5);\n        const staggerConfig = reverse ? { each: stagger, from: 'end' } : stagger;\n        const targets = [...strokes, ...fills, wipe].filter(Boolean);\n        const setStart = () => {\n            gsap.killTweensOf(targets);\n            gsap.set(strokes, { strokeDasharray: dash, strokeDashoffset: dash });\n            gsap.set(fills, { opacity: useWipe ? 1 : 0 });\n            if (wipe)\n                gsap.set(wipe, { attr: { width: 0 } });\n        };\n        const setEnd = () => {\n            gsap.killTweensOf(targets);\n            gsap.set(strokes, { strokeDasharray: dash, strokeDashoffset: 0 });\n            gsap.set(fills, { opacity: fillEnabled ? 1 : 0 });\n            if (wipe)\n                gsap.set(wipe, { attr: { width: fillEnabled ? box.width : 0 } });\n        };\n        const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;\n        if (prefersReducedMotion) {\n            setEnd();\n            return () => gsap.killTweensOf(targets);\n        }\n        const build = () => {\n            setStart();\n            const tl = gsap.timeline({\n                paused: true,\n                repeat: trigger === 'loop' ? -1 : 0,\n                repeatDelay: trigger === 'loop' ? 0.9 : 0,\n                defaults: { overwrite: 'auto' }\n            });\n            tl.to(strokes, { strokeDashoffset: 0, duration: drawDuration, ease, stagger: staggerConfig }, 0);\n            if (useWipe && wipe) {\n                tl.to(wipe, { attr: { width: box.width }, duration: fillDuration, ease: 'power2.inOut' }, drawDuration + fillDelay);\n            }\n            else if (fillEnabled) {\n                tl.to(fills, { opacity: 1, duration: fillDuration, ease: 'power2.out', stagger: staggerConfig }, drawDuration + fillDelay);\n            }\n            return tl;\n        };\n        let timeline = null;\n        let scrollTrigger = null;\n        let removeHover = null;\n        if (trigger === 'hover') {\n            setEnd();\n            const play = () => {\n                timeline?.kill();\n                timeline = build();\n                timeline.play(0);\n            };\n            root.addEventListener('pointerenter', play);\n            removeHover = () => root.removeEventListener('pointerenter', play);\n        }\n        else {\n            timeline = build();\n            if (trigger === 'scroll') {\n                scrollTrigger = ScrollTrigger.create({\n                    trigger: root,\n                    start: 'top 82%',\n                    once: true,\n                    onEnter: () => timeline?.play(0)\n                });\n            }\n            else {\n                timeline.play(0);\n            }\n        }\n        return () => {\n            removeHover?.();\n            scrollTrigger?.kill();\n            timeline?.kill();\n            gsap.killTweensOf(targets);\n        };\n    }, [box, dash, drawDuration, fillDelay, stagger, ease, trigger, fillMode, reverse]);\n    const viewBox = box ? `${box.x} ${box.y} ${box.width} ${box.height}` : `0 ${-fontSize} 600 ${fontSize * 1.3}`;\n    return (<span ref={rootRef} className={`block w-full leading-[0] ${trigger === 'hover' ? 'cursor-pointer' : ''} ${className}`.trim()} style={style} role=\"img\" aria-label={String(text ?? '')}>\n      <svg className=\"block w-full\" style={{ height: `${Math.round(fontSize * 1.3)}px` }} viewBox={viewBox} preserveAspectRatio=\"xMidYMid meet\" aria-hidden=\"true\">\n        {fillMode === 'wipe' && box && (<defs>\n            <clipPath id={wipeId} clipPathUnits=\"userSpaceOnUse\">\n              <rect ref={wipeRectRef} x={box.x} y={box.y} width=\"0\" height={box.height}/>\n            </clipPath>\n          </defs>)}\n\n        <text ref={strokeTextRef} className=\"select-none\" x=\"0\" y=\"0\" fill=\"none\" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin=\"round\" strokeLinecap=\"round\" style={fontStyle}>\n          {characters.map((char, index) => (<tspan data-stroke-char key={`s-${index}`}>\n              {char}\n            </tspan>))}\n        </text>\n\n        <text className=\"select-none\" x=\"0\" y=\"0\" fill={fillColor} stroke=\"none\" style={fontStyle} clipPath={fillMode === 'wipe' && box ? `url(#${wipeId})` : undefined}>\n          {characters.map((char, index) => (<tspan data-fill-char key={`f-${index}`}>\n              {char}\n            </tspan>))}\n        </text>\n      </svg>\n    </span>);\n};\nexport default StrokeText;",
    "props": [
      {
        "name": "text",
        "type": "string",
        "default": "DEFAULT_TEXT",
        "description": "The text content to display and animate."
      },
      {
        "name": "strokeColor",
        "type": "string",
        "default": "'#A78BFA'",
        "description": "Controls the stroke color for the component animation."
      },
      {
        "name": "fillColor",
        "type": "string",
        "default": "'#F8FAFC'",
        "description": "Controls the fill color for the component animation."
      },
      {
        "name": "strokeWidth",
        "type": "number",
        "default": "1.4",
        "description": "Controls the stroke width for the component animation."
      },
      {
        "name": "drawDuration",
        "type": "number",
        "default": "1.6",
        "description": "Controls the draw duration for the component animation."
      },
      {
        "name": "fillDelay",
        "type": "number",
        "default": "0.2",
        "description": "Controls the fill delay for the component animation."
      },
      {
        "name": "stagger",
        "type": "number",
        "default": "0.05",
        "description": "Stagger delay in seconds between individual characters/elements."
      },
      {
        "name": "ease",
        "type": "string",
        "default": "'power2.out'",
        "description": "GSAP or cubic-bezier easing curve for animation smoothing."
      },
      {
        "name": "trigger",
        "type": "StrokeTextTrigger",
        "default": "'mount'",
        "description": "Controls the trigger for the component animation."
      },
      {
        "name": "fillMode",
        "type": "StrokeTextFillMode",
        "default": "'wipe'",
        "description": "Controls the fill mode for the component animation."
      },
      {
        "name": "fontSize",
        "type": "number",
        "default": "128",
        "description": "Font size in pixels, rems, or fluid clamp notation."
      },
      {
        "name": "fontWeight",
        "type": "number | string",
        "default": "800",
        "description": "Font weight (e.g., 400, 700, 900, 'bold')."
      },
      {
        "name": "letterSpacing",
        "type": "number",
        "default": "-4",
        "description": "Controls the letter spacing for the component animation."
      },
      {
        "name": "reverse",
        "type": "boolean",
        "default": "false",
        "description": "Controls the reverse for the component animation."
      },
      {
        "name": "className",
        "type": "string",
        "default": "''",
        "description": "Additional CSS classes for styling and layout."
      },
      {
        "name": "style",
        "type": "CSSProperties",
        "default": "{}",
        "description": "Controls the style for the component animation."
      }
    ]
  },
  "text-cursor": {
    "slug": "text-cursor",
    "name": "Text Cursor",
    "description": "Custom magnetic floating indicator and tooltip badge tracking pointer movement over text blocks.",
    "dependencies": {
      "motion": "^12.23.12"
    },
    "installation": {
      "cliTs": "npx kibo add text-cursor",
      "cliJs": "npx kibo add text-cursor --js",
      "npm": "npm i motion",
      "pnpm": "pnpm add motion",
      "yarn": "yarn add motion",
      "bun": "bun add motion"
    },
    "usageTs": "import { TextCursor } from \"@/components/kibo/text-cursor/component\";\n\nexport default function Example() {\n  return (\n    <TextCursor />\n  );\n}",
    "usageJs": "import { TextCursor } from \"@/components/kibo/text-cursor/component\";\nexport default function Example() {\n    return (<TextCursor />);\n}",
    "componentSourceTs": "\"use client\";\n\nimport React, { useState, useEffect, useRef } from 'react';\nimport { motion, AnimatePresence } from 'motion/react';\n\ninterface TextCursorProps {\n  text: string;\n  spacing?: number;\n  followMouseDirection?: boolean;\n  randomFloat?: boolean;\n  exitDuration?: number;\n  removalInterval?: number;\n  maxPoints?: number;\n}\n\ninterface TrailItem {\n  id: number;\n  x: number;\n  y: number;\n  angle: number;\n  randomX?: number;\n  randomY?: number;\n  randomRotate?: number;\n}\n\nexport const TextCursor: React.FC<TextCursorProps> = ({\n  text = '⚛️',\n  spacing = 100,\n  followMouseDirection = true,\n  randomFloat = true,\n  exitDuration = 0.5,\n  removalInterval = 30,\n  maxPoints = 5\n}) => {\n  const [trail, setTrail] = useState<TrailItem[]>([]);\n  const containerRef = useRef<HTMLDivElement>(null);\n  const lastMoveTimeRef = useRef<number>(Date.now());\n  const idCounter = useRef<number>(0);\n\n  const handleMouseMove = (e: MouseEvent) => {\n    if (!containerRef.current) return;\n    const rect = containerRef.current.getBoundingClientRect();\n    const mouseX = e.clientX - rect.left;\n    const mouseY = e.clientY - rect.top;\n\n    setTrail(prev => {\n      let newTrail = [...prev];\n      if (newTrail.length === 0) {\n        newTrail.push({\n          id: idCounter.current++,\n          x: mouseX,\n          y: mouseY,\n          angle: 0,\n          ...(randomFloat && {\n            randomX: Math.random() * 10 - 5,\n            randomY: Math.random() * 10 - 5,\n            randomRotate: Math.random() * 10 - 5\n          })\n        });\n      } else {\n        const last = newTrail[newTrail.length - 1];\n        const dx = mouseX - last.x;\n        const dy = mouseY - last.y;\n        const distance = Math.sqrt(dx * dx + dy * dy);\n        if (distance >= spacing) {\n          let rawAngle = (Math.atan2(dy, dx) * 180) / Math.PI;\n\n          rawAngle = ((rawAngle + 180) % 360) - 180;\n\n          const computedAngle = followMouseDirection ? rawAngle : 0;\n          const steps = Math.floor(distance / spacing);\n          for (let i = 1; i <= steps; i++) {\n            const t = (spacing * i) / distance;\n            const newX = last.x + dx * t;\n            const newY = last.y + dy * t;\n            newTrail.push({\n              id: idCounter.current++,\n              x: newX,\n              y: newY,\n              angle: computedAngle,\n              ...(randomFloat && {\n                randomX: Math.random() * 10 - 5,\n                randomY: Math.random() * 10 - 5,\n                randomRotate: Math.random() * 10 - 5\n              })\n            });\n          }\n        }\n      }\n      if (newTrail.length > maxPoints) {\n        newTrail = newTrail.slice(newTrail.length - maxPoints);\n      }\n      return newTrail;\n    });\n    lastMoveTimeRef.current = Date.now();\n  };\n\n  useEffect(() => {\n    const container = containerRef.current;\n    if (!container) return;\n\n    container.addEventListener('mousemove', handleMouseMove);\n    return () => {\n      container.removeEventListener('mousemove', handleMouseMove);\n    };\n  }, [containerRef.current]);\n\n  useEffect(() => {\n    const interval = setInterval(() => {\n      if (Date.now() - lastMoveTimeRef.current > 100) {\n        setTrail(prev => (prev.length > 0 ? prev.slice(1) : prev));\n      }\n    }, removalInterval);\n    return () => clearInterval(interval);\n  }, [removalInterval]);\n\n  return (\n    <div ref={containerRef} className=\"w-full h-full relative\">\n      <div className=\"absolute inset-0 pointer-events-none\">\n        <AnimatePresence>\n          {trail.map(item => (\n            <motion.div\n              key={item.id}\n              initial={{ opacity: 0, scale: 1, rotate: item.angle }}\n              animate={{\n                opacity: 1,\n                scale: 1,\n                x: randomFloat ? [0, item.randomX || 0, 0] : 0,\n                y: randomFloat ? [0, item.randomY || 0, 0] : 0,\n                rotate: randomFloat ? [item.angle, item.angle + (item.randomRotate || 0), item.angle] : item.angle\n              }}\n              exit={{ opacity: 0, scale: 0 }}\n              transition={{\n                opacity: { duration: exitDuration, ease: 'easeOut' },\n\n                ...(randomFloat && {\n                  x: {\n                    duration: 2,\n                    ease: 'easeInOut',\n                    repeat: Infinity,\n                    repeatType: 'mirror'\n                  },\n                  y: {\n                    duration: 2,\n                    ease: 'easeInOut',\n                    repeat: Infinity,\n                    repeatType: 'mirror'\n                  },\n                  rotate: {\n                    duration: 2,\n                    ease: 'easeInOut',\n                    repeat: Infinity,\n                    repeatType: 'mirror'\n                  }\n                })\n              }}\n              className=\"absolute select-none whitespace-nowrap text-3xl\"\n              style={{ left: item.x, top: item.y }}\n            >\n              {text}\n            </motion.div>\n          ))}\n        </AnimatePresence>\n      </div>\n    </div>\n  );\n};\n\nexport default TextCursor;",
    "componentSourceJs": "\"use client\";\nimport React, { useState, useEffect, useRef } from 'react';\nimport { motion, AnimatePresence } from 'motion/react';\nexport const TextCursor = ({ text = '⚛️', spacing = 100, followMouseDirection = true, randomFloat = true, exitDuration = 0.5, removalInterval = 30, maxPoints = 5 }) => {\n    const [trail, setTrail] = useState([]);\n    const containerRef = useRef(null);\n    const lastMoveTimeRef = useRef(Date.now());\n    const idCounter = useRef(0);\n    const handleMouseMove = (e) => {\n        if (!containerRef.current)\n            return;\n        const rect = containerRef.current.getBoundingClientRect();\n        const mouseX = e.clientX - rect.left;\n        const mouseY = e.clientY - rect.top;\n        setTrail(prev => {\n            let newTrail = [...prev];\n            if (newTrail.length === 0) {\n                newTrail.push({\n                    id: idCounter.current++,\n                    x: mouseX,\n                    y: mouseY,\n                    angle: 0,\n                    ...(randomFloat && {\n                        randomX: Math.random() * 10 - 5,\n                        randomY: Math.random() * 10 - 5,\n                        randomRotate: Math.random() * 10 - 5\n                    })\n                });\n            }\n            else {\n                const last = newTrail[newTrail.length - 1];\n                const dx = mouseX - last.x;\n                const dy = mouseY - last.y;\n                const distance = Math.sqrt(dx * dx + dy * dy);\n                if (distance >= spacing) {\n                    let rawAngle = (Math.atan2(dy, dx) * 180) / Math.PI;\n                    rawAngle = ((rawAngle + 180) % 360) - 180;\n                    const computedAngle = followMouseDirection ? rawAngle : 0;\n                    const steps = Math.floor(distance / spacing);\n                    for (let i = 1; i <= steps; i++) {\n                        const t = (spacing * i) / distance;\n                        const newX = last.x + dx * t;\n                        const newY = last.y + dy * t;\n                        newTrail.push({\n                            id: idCounter.current++,\n                            x: newX,\n                            y: newY,\n                            angle: computedAngle,\n                            ...(randomFloat && {\n                                randomX: Math.random() * 10 - 5,\n                                randomY: Math.random() * 10 - 5,\n                                randomRotate: Math.random() * 10 - 5\n                            })\n                        });\n                    }\n                }\n            }\n            if (newTrail.length > maxPoints) {\n                newTrail = newTrail.slice(newTrail.length - maxPoints);\n            }\n            return newTrail;\n        });\n        lastMoveTimeRef.current = Date.now();\n    };\n    useEffect(() => {\n        const container = containerRef.current;\n        if (!container)\n            return;\n        container.addEventListener('mousemove', handleMouseMove);\n        return () => {\n            container.removeEventListener('mousemove', handleMouseMove);\n        };\n    }, [containerRef.current]);\n    useEffect(() => {\n        const interval = setInterval(() => {\n            if (Date.now() - lastMoveTimeRef.current > 100) {\n                setTrail(prev => (prev.length > 0 ? prev.slice(1) : prev));\n            }\n        }, removalInterval);\n        return () => clearInterval(interval);\n    }, [removalInterval]);\n    return (<div ref={containerRef} className=\"w-full h-full relative\">\n      <div className=\"absolute inset-0 pointer-events-none\">\n        <AnimatePresence>\n          {trail.map(item => (<motion.div key={item.id} initial={{ opacity: 0, scale: 1, rotate: item.angle }} animate={{\n                opacity: 1,\n                scale: 1,\n                x: randomFloat ? [0, item.randomX || 0, 0] : 0,\n                y: randomFloat ? [0, item.randomY || 0, 0] : 0,\n                rotate: randomFloat ? [item.angle, item.angle + (item.randomRotate || 0), item.angle] : item.angle\n            }} exit={{ opacity: 0, scale: 0 }} transition={{\n                opacity: { duration: exitDuration, ease: 'easeOut' },\n                ...(randomFloat && {\n                    x: {\n                        duration: 2,\n                        ease: 'easeInOut',\n                        repeat: Infinity,\n                        repeatType: 'mirror'\n                    },\n                    y: {\n                        duration: 2,\n                        ease: 'easeInOut',\n                        repeat: Infinity,\n                        repeatType: 'mirror'\n                    },\n                    rotate: {\n                        duration: 2,\n                        ease: 'easeInOut',\n                        repeat: Infinity,\n                        repeatType: 'mirror'\n                    }\n                })\n            }} className=\"absolute select-none whitespace-nowrap text-3xl\" style={{ left: item.x, top: item.y }}>\n              {text}\n            </motion.div>))}\n        </AnimatePresence>\n      </div>\n    </div>);\n};\nexport default TextCursor;",
    "props": [
      {
        "name": "text",
        "type": "string",
        "default": "'⚛️'",
        "description": "The text content to display and animate."
      },
      {
        "name": "spacing",
        "type": "number",
        "default": "100",
        "description": "Controls the spacing for the component animation."
      },
      {
        "name": "followMouseDirection",
        "type": "boolean",
        "default": "true",
        "description": "Controls the follow mouse direction for the component animation."
      },
      {
        "name": "randomFloat",
        "type": "boolean",
        "default": "true",
        "description": "Controls the random float for the component animation."
      },
      {
        "name": "exitDuration",
        "type": "number",
        "default": "0.5",
        "description": "Controls the exit duration for the component animation."
      },
      {
        "name": "removalInterval",
        "type": "number",
        "default": "30",
        "description": "Controls the removal interval for the component animation."
      },
      {
        "name": "maxPoints",
        "type": "number",
        "default": "5",
        "description": "Controls the max points for the component animation."
      }
    ]
  },
  "text-loop": {
    "slug": "text-loop",
    "name": "Text Loop",
    "description": "A seamless text marquee that flows along curved SVG paths.",
    "dependencies": {
      "gsap": "^3.13.0"
    },
    "installation": {
      "cliTs": "npx kibo add text-loop",
      "cliJs": "npx kibo add text-loop --js",
      "npm": "npm i gsap",
      "pnpm": "pnpm add gsap",
      "yarn": "yarn add gsap",
      "bun": "bun add gsap"
    },
    "usageTs": "import { TextLoop } from \"@/components/kibo/text-loop/component\";\n\nexport default function MyComponent() {\n  return (\n    <div className=\"relative w-full\">\n      <TextLoop\n        text=\"Limitless Design\"\n        shape=\"infinity\"\n        separator=\"✦\"\n        ribbonColor=\"#3b82f6\"\n        ribbonWidth={100}\n      />\n    </div>\n  );\n}",
    "usageJs": "import { TextLoop } from \"@/components/kibo/text-loop/component\";\nexport default function MyComponent() {\n    return (<div className=\"relative w-full\">\n      <TextLoop text=\"Limitless Design\" shape=\"infinity\" separator=\"✦\" ribbonColor=\"#3b82f6\" ribbonWidth={100}/>\n    </div>);\n}",
    "componentSourceTs": "\"use client\";\n\nimport {\n  CSSProperties,\n  useEffect,\n  useId,\n  useLayoutEffect,\n  useMemo,\n  useRef,\n  useState,\n} from \"react\";\nimport { gsap } from \"gsap\";\n\nexport type TextLoopShape = \"wave\" | \"circle\" | \"infinity\" | \"arch\" | \"line\";\nexport type TextLoopDirection = \"forward\" | \"reverse\";\n\nexport interface TextLoopProps {\n  /** The text to loop. */\n  text?: string;\n  /** Pre-defined SVG path shapes. */\n  shape?: TextLoopShape;\n  /** Custom SVG path string. Overrides `shape` if provided. */\n  path?: string;\n  /** Animation speed. */\n  speed?: number;\n  /** Animation direction. */\n  direction?: TextLoopDirection;\n  /** Separator character between text repetitions. */\n  separator?: string;\n  /** Intensity of the curve (applicable to certain shapes). */\n  curviness?: number;\n  /** Font size of the text. */\n  fontSize?: number;\n  /** Font weight of the text. */\n  fontWeight?: number | string;\n  /** Letter spacing of the text. */\n  letterSpacing?: number;\n  /** Whether to transform text to uppercase. */\n  uppercase?: boolean;\n  /** Text color. */\n  color?: string;\n  /** Whether to render a background ribbon path. */\n  ribbon?: boolean;\n  /** Color of the ribbon stroke. */\n  ribbonColor?: string;\n  /** Width of the ribbon stroke. */\n  ribbonWidth?: number;\n  /** Pause animation on hover. */\n  pauseOnHover?: boolean;\n  /** Additional CSS classes. */\n  className?: string;\n  /** Additional inline styles. */\n  style?: CSSProperties;\n}\n\ninterface Metrics {\n  length: number;\n  reps: number;\n}\n\nconst VIEW_W = 1200;\nconst VIEW_H = 520;\nconst CX = VIEW_W / 2;\nconst CY = VIEW_H / 2;\nconst EDGE_PAD = 6;\n\nconst buildPath = (\n  shape: TextLoopShape,\n  curviness: number,\n  ribbonWidth: number\n): string => {\n  const c = Math.max(0, curviness);\n  const room = Math.max(20, CY - Math.max(0, ribbonWidth) / 2 - EDGE_PAD);\n\n  switch (shape) {\n    case \"circle\": {\n      const r = Math.min(90 + c * 0.95, room);\n      return `M ${CX - r} ${CY} A ${r} ${r} 0 1 1 ${CX + r} ${CY} A ${r} ${r} 0 1 1 ${CX - r} ${CY} Z`;\n    }\n    case \"infinity\": {\n      const r = 150 + c * 1.4;\n      const h = Math.min(60 + c * 0.95, room);\n      return [\n        `M ${CX} ${CY}`,\n        `C ${CX + r * 0.55} ${CY - h} ${CX + r} ${CY - h} ${CX + r} ${CY}`,\n        `C ${CX + r} ${CY + h} ${CX + r * 0.55} ${CY + h} ${CX} ${CY}`,\n        `C ${CX - r * 0.55} ${CY - h} ${CX - r} ${CY - h} ${CX - r} ${CY}`,\n        `C ${CX - r} ${CY + h} ${CX - r * 0.55} ${CY + h} ${CX} ${CY}`,\n        \"Z\",\n      ].join(\" \");\n    }\n    case \"arch\": {\n      const rise = Math.min(120 + c * 1.1, room * 2);\n      return `M 120 ${CY + rise / 2} Q ${CX} ${CY - rise * 1.5} ${VIEW_W - 120} ${CY + rise / 2}`;\n    }\n    case \"line\":\n      return `M -320 ${CY} L ${VIEW_W + 320} ${CY}`;\n    case \"wave\":\n    default: {\n      const a = Math.min(c * 2.2, room * 2);\n      return `M -320 ${CY} Q -160 ${CY - a} 0 ${CY} T 320 ${CY} T 640 ${CY} T 960 ${CY} T 1280 ${CY} T ${VIEW_W + 320} ${CY}`;\n    }\n  }\n};\n\nexport function TextLoop({\n  text = \"React ✦ Bits\",\n  shape = \"wave\",\n  path,\n  speed = 90,\n  direction = \"forward\",\n  separator = \"✦\",\n  curviness = 90,\n  fontSize = 46,\n  fontWeight = 800,\n  letterSpacing = 2,\n  uppercase = true,\n  color = \"#ffffff\",\n  ribbon = true,\n  ribbonColor = \"#5227FF\",\n  ribbonWidth = 86,\n  pauseOnHover = true,\n  className = \"\",\n  style = {},\n}: TextLoopProps) {\n  const rootRef = useRef<HTMLDivElement | null>(null);\n  const pathRef = useRef<SVGPathElement | null>(null);\n  const measureRef = useRef<SVGTextElement | null>(null);\n  const headRef = useRef<SVGTextPathElement | null>(null);\n  const tailRef = useRef<SVGTextPathElement | null>(null);\n\n  const [metrics, setMetrics] = useState<Metrics>({ length: 0, reps: 1 });\n\n  const rawId = useId();\n  const pathId = `text-loop-${rawId.replace(/:/g, \"\")}`;\n\n  const d = useMemo(\n    () => path || buildPath(shape, curviness, ribbonWidth),\n    [path, shape, curviness, ribbonWidth]\n  );\n\n  const unit = useMemo(() => {\n    const base = uppercase ? String(text).toUpperCase() : String(text);\n    const gap = separator\n      ? `\\u00A0${separator}\\u00A0`\n      : \"\\u00A0\\u00A0\\u00A0\";\n    return `${base}${gap}`;\n  }, [text, separator, uppercase]);\n\n  const textStyle = useMemo<CSSProperties>(\n    () => ({\n      fontSize: `${fontSize}px`,\n      fontWeight,\n      letterSpacing: `${letterSpacing}px`,\n    }),\n    [fontSize, fontWeight, letterSpacing]\n  );\n\n  useLayoutEffect(() => {\n    const pathEl = pathRef.current;\n    const measureEl = measureRef.current;\n    if (!pathEl || !measureEl) return undefined;\n\n    let cancelled = false;\n\n    const measure = () => {\n      if (cancelled) return;\n      let length = 0;\n      let unitWidth = 0;\n      try {\n        length = pathEl.getTotalLength();\n        unitWidth = measureEl.getComputedTextLength();\n      } catch {\n        return;\n      }\n      if (!length) return;\n\n      const reps =\n        unitWidth > 0 ? Math.max(1, Math.round(length / unitWidth)) : 1;\n      setMetrics((prev) =>\n        prev.length === length && prev.reps === reps\n          ? prev\n          : { length, reps }\n      );\n    };\n\n    measure();\n    if (typeof document !== \"undefined\" && document.fonts?.ready) {\n      document.fonts.ready.then(measure).catch(() => {});\n    }\n\n    return () => {\n      cancelled = true;\n    };\n  }, [d, unit, fontSize, fontWeight, letterSpacing]);\n\n  useEffect(() => {\n    const { length } = metrics;\n    const head = headRef.current;\n    const tail = tailRef.current;\n    if (!head || !tail || !length) return undefined;\n\n    const apply = (offset: number) => {\n      const partner = offset >= 0 ? offset - length : offset + length;\n      head.setAttribute(\"startOffset\", String(offset));\n      tail.setAttribute(\"startOffset\", String(partner));\n    };\n\n    apply(0);\n\n    const prefersReduced =\n      typeof window !== \"undefined\" &&\n      window.matchMedia(\"(prefers-reduced-motion: reduce)\").matches;\n    if (prefersReduced || speed <= 0) return undefined;\n\n    const state = { offset: 0 };\n    const tween = gsap.to(state, {\n      offset: direction === \"reverse\" ? -length : length,\n      duration: length / speed,\n      ease: \"none\",\n      repeat: -1,\n      onUpdate: () => apply(state.offset),\n    });\n\n    const root = rootRef.current;\n    const pause = () => tween.pause();\n    const resume = () => tween.resume();\n\n    if (pauseOnHover && root) {\n      root.addEventListener(\"pointerenter\", pause);\n      root.addEventListener(\"pointerleave\", resume);\n    }\n\n    return () => {\n      tween.kill();\n      if (pauseOnHover && root) {\n        root.removeEventListener(\"pointerenter\", pause);\n        root.removeEventListener(\"pointerleave\", resume);\n      }\n    };\n  }, [metrics, speed, direction, pauseOnHover]);\n\n  const loopText = unit.repeat(metrics.reps);\n  const fitLength = metrics.length || undefined;\n\n  return (\n    <div\n      ref={rootRef}\n      className={`relative w-full overflow-hidden ${className}`.trim()}\n      style={style}\n    >\n      <svg\n        className=\"block h-auto w-full\"\n        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}\n        preserveAspectRatio=\"xMidYMid meet\"\n        role=\"img\"\n        aria-label={text}\n      >\n        <path\n          ref={pathRef}\n          id={pathId}\n          d={d}\n          fill=\"none\"\n          stroke={ribbon ? ribbonColor : \"none\"}\n          strokeWidth={ribbon ? ribbonWidth : 0}\n          strokeLinecap=\"round\"\n          strokeLinejoin=\"round\"\n        />\n\n        <text\n          ref={measureRef}\n          className=\"pointer-events-none invisible\"\n          style={textStyle}\n          aria-hidden=\"true\"\n        >\n          {unit}\n        </text>\n\n        <text\n          className=\"select-none\"\n          style={textStyle}\n          fill={color}\n          dominantBaseline=\"central\"\n          aria-hidden=\"true\"\n        >\n          <textPath\n            ref={headRef}\n            href={`#${pathId}`}\n            startOffset={0}\n            textLength={fitLength}\n            lengthAdjust=\"spacing\"\n          >\n            {loopText}\n          </textPath>\n        </text>\n\n        <text\n          className=\"select-none\"\n          style={textStyle}\n          fill={color}\n          dominantBaseline=\"central\"\n          aria-hidden=\"true\"\n        >\n          <textPath\n            ref={tailRef}\n            href={`#${pathId}`}\n            startOffset={0}\n            textLength={fitLength}\n            lengthAdjust=\"spacing\"\n          >\n            {loopText}\n          </textPath>\n        </text>\n      </svg>\n    </div>\n  );\n}\n",
    "componentSourceJs": "\"use client\";\nimport { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, } from \"react\";\nimport { gsap } from \"gsap\";\nconst VIEW_W = 1200;\nconst VIEW_H = 520;\nconst CX = VIEW_W / 2;\nconst CY = VIEW_H / 2;\nconst EDGE_PAD = 6;\nconst buildPath = (shape, curviness, ribbonWidth) => {\n    const c = Math.max(0, curviness);\n    const room = Math.max(20, CY - Math.max(0, ribbonWidth) / 2 - EDGE_PAD);\n    switch (shape) {\n        case \"circle\": {\n            const r = Math.min(90 + c * 0.95, room);\n            return `M ${CX - r} ${CY} A ${r} ${r} 0 1 1 ${CX + r} ${CY} A ${r} ${r} 0 1 1 ${CX - r} ${CY} Z`;\n        }\n        case \"infinity\": {\n            const r = 150 + c * 1.4;\n            const h = Math.min(60 + c * 0.95, room);\n            return [\n                `M ${CX} ${CY}`,\n                `C ${CX + r * 0.55} ${CY - h} ${CX + r} ${CY - h} ${CX + r} ${CY}`,\n                `C ${CX + r} ${CY + h} ${CX + r * 0.55} ${CY + h} ${CX} ${CY}`,\n                `C ${CX - r * 0.55} ${CY - h} ${CX - r} ${CY - h} ${CX - r} ${CY}`,\n                `C ${CX - r} ${CY + h} ${CX - r * 0.55} ${CY + h} ${CX} ${CY}`,\n                \"Z\",\n            ].join(\" \");\n        }\n        case \"arch\": {\n            const rise = Math.min(120 + c * 1.1, room * 2);\n            return `M 120 ${CY + rise / 2} Q ${CX} ${CY - rise * 1.5} ${VIEW_W - 120} ${CY + rise / 2}`;\n        }\n        case \"line\":\n            return `M -320 ${CY} L ${VIEW_W + 320} ${CY}`;\n        case \"wave\":\n        default: {\n            const a = Math.min(c * 2.2, room * 2);\n            return `M -320 ${CY} Q -160 ${CY - a} 0 ${CY} T 320 ${CY} T 640 ${CY} T 960 ${CY} T 1280 ${CY} T ${VIEW_W + 320} ${CY}`;\n        }\n    }\n};\nexport function TextLoop({ text = \"React ✦ Bits\", shape = \"wave\", path, speed = 90, direction = \"forward\", separator = \"✦\", curviness = 90, fontSize = 46, fontWeight = 800, letterSpacing = 2, uppercase = true, color = \"#ffffff\", ribbon = true, ribbonColor = \"#5227FF\", ribbonWidth = 86, pauseOnHover = true, className = \"\", style = {}, }) {\n    const rootRef = useRef(null);\n    const pathRef = useRef(null);\n    const measureRef = useRef(null);\n    const headRef = useRef(null);\n    const tailRef = useRef(null);\n    const [metrics, setMetrics] = useState({ length: 0, reps: 1 });\n    const rawId = useId();\n    const pathId = `text-loop-${rawId.replace(/:/g, \"\")}`;\n    const d = useMemo(() => path || buildPath(shape, curviness, ribbonWidth), [path, shape, curviness, ribbonWidth]);\n    const unit = useMemo(() => {\n        const base = uppercase ? String(text).toUpperCase() : String(text);\n        const gap = separator\n            ? `\\u00A0${separator}\\u00A0`\n            : \"\\u00A0\\u00A0\\u00A0\";\n        return `${base}${gap}`;\n    }, [text, separator, uppercase]);\n    const textStyle = useMemo(() => ({\n        fontSize: `${fontSize}px`,\n        fontWeight,\n        letterSpacing: `${letterSpacing}px`,\n    }), [fontSize, fontWeight, letterSpacing]);\n    useLayoutEffect(() => {\n        const pathEl = pathRef.current;\n        const measureEl = measureRef.current;\n        if (!pathEl || !measureEl)\n            return undefined;\n        let cancelled = false;\n        const measure = () => {\n            if (cancelled)\n                return;\n            let length = 0;\n            let unitWidth = 0;\n            try {\n                length = pathEl.getTotalLength();\n                unitWidth = measureEl.getComputedTextLength();\n            }\n            catch {\n                return;\n            }\n            if (!length)\n                return;\n            const reps = unitWidth > 0 ? Math.max(1, Math.round(length / unitWidth)) : 1;\n            setMetrics((prev) => prev.length === length && prev.reps === reps\n                ? prev\n                : { length, reps });\n        };\n        measure();\n        if (typeof document !== \"undefined\" && document.fonts?.ready) {\n            document.fonts.ready.then(measure).catch(() => { });\n        }\n        return () => {\n            cancelled = true;\n        };\n    }, [d, unit, fontSize, fontWeight, letterSpacing]);\n    useEffect(() => {\n        const { length } = metrics;\n        const head = headRef.current;\n        const tail = tailRef.current;\n        if (!head || !tail || !length)\n            return undefined;\n        const apply = (offset) => {\n            const partner = offset >= 0 ? offset - length : offset + length;\n            head.setAttribute(\"startOffset\", String(offset));\n            tail.setAttribute(\"startOffset\", String(partner));\n        };\n        apply(0);\n        const prefersReduced = typeof window !== \"undefined\" &&\n            window.matchMedia(\"(prefers-reduced-motion: reduce)\").matches;\n        if (prefersReduced || speed <= 0)\n            return undefined;\n        const state = { offset: 0 };\n        const tween = gsap.to(state, {\n            offset: direction === \"reverse\" ? -length : length,\n            duration: length / speed,\n            ease: \"none\",\n            repeat: -1,\n            onUpdate: () => apply(state.offset),\n        });\n        const root = rootRef.current;\n        const pause = () => tween.pause();\n        const resume = () => tween.resume();\n        if (pauseOnHover && root) {\n            root.addEventListener(\"pointerenter\", pause);\n            root.addEventListener(\"pointerleave\", resume);\n        }\n        return () => {\n            tween.kill();\n            if (pauseOnHover && root) {\n                root.removeEventListener(\"pointerenter\", pause);\n                root.removeEventListener(\"pointerleave\", resume);\n            }\n        };\n    }, [metrics, speed, direction, pauseOnHover]);\n    const loopText = unit.repeat(metrics.reps);\n    const fitLength = metrics.length || undefined;\n    return (<div ref={rootRef} className={`relative w-full overflow-hidden ${className}`.trim()} style={style}>\n      <svg className=\"block h-auto w-full\" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio=\"xMidYMid meet\" role=\"img\" aria-label={text}>\n        <path ref={pathRef} id={pathId} d={d} fill=\"none\" stroke={ribbon ? ribbonColor : \"none\"} strokeWidth={ribbon ? ribbonWidth : 0} strokeLinecap=\"round\" strokeLinejoin=\"round\"/>\n\n        <text ref={measureRef} className=\"pointer-events-none invisible\" style={textStyle} aria-hidden=\"true\">\n          {unit}\n        </text>\n\n        <text className=\"select-none\" style={textStyle} fill={color} dominantBaseline=\"central\" aria-hidden=\"true\">\n          <textPath ref={headRef} href={`#${pathId}`} startOffset={0} textLength={fitLength} lengthAdjust=\"spacing\">\n            {loopText}\n          </textPath>\n        </text>\n\n        <text className=\"select-none\" style={textStyle} fill={color} dominantBaseline=\"central\" aria-hidden=\"true\">\n          <textPath ref={tailRef} href={`#${pathId}`} startOffset={0} textLength={fitLength} lengthAdjust=\"spacing\">\n            {loopText}\n          </textPath>\n        </text>\n      </svg>\n    </div>);\n}",
    "props": [
      {
        "name": "text",
        "type": "string",
        "default": "\"React ✦ Bits\"",
        "description": "The text to loop."
      },
      {
        "name": "shape",
        "type": "TextLoopShape",
        "default": "\"wave\"",
        "description": "Pre-defined SVG path shapes."
      },
      {
        "name": "path",
        "type": "string",
        "default": "-",
        "description": "Custom SVG path string. Overrides `shape` if provided."
      },
      {
        "name": "speed",
        "type": "number",
        "default": "90",
        "description": "Animation speed."
      },
      {
        "name": "direction",
        "type": "TextLoopDirection",
        "default": "\"forward\"",
        "description": "Animation direction."
      },
      {
        "name": "separator",
        "type": "string",
        "default": "\"✦\"",
        "description": "Separator character between text repetitions."
      },
      {
        "name": "curviness",
        "type": "number",
        "default": "90",
        "description": "Intensity of the curve (applicable to certain shapes)."
      },
      {
        "name": "fontSize",
        "type": "number",
        "default": "46",
        "description": "Font size of the text."
      },
      {
        "name": "fontWeight",
        "type": "number | string",
        "default": "800",
        "description": "Font weight of the text."
      },
      {
        "name": "letterSpacing",
        "type": "number",
        "default": "2",
        "description": "Letter spacing of the text."
      },
      {
        "name": "uppercase",
        "type": "boolean",
        "default": "true",
        "description": "Whether to transform text to uppercase."
      },
      {
        "name": "color",
        "type": "string",
        "default": "\"#ffffff\"",
        "description": "Text color."
      },
      {
        "name": "ribbon",
        "type": "boolean",
        "default": "true",
        "description": "Whether to render a background ribbon path."
      },
      {
        "name": "ribbonColor",
        "type": "string",
        "default": "\"#5227FF\"",
        "description": "Color of the ribbon stroke."
      },
      {
        "name": "ribbonWidth",
        "type": "number",
        "default": "86",
        "description": "Width of the ribbon stroke."
      },
      {
        "name": "pauseOnHover",
        "type": "boolean",
        "default": "true",
        "description": "Pause animation on hover."
      },
      {
        "name": "className",
        "type": "string",
        "default": "\"\"",
        "description": "Additional CSS classes."
      },
      {
        "name": "style",
        "type": "CSSProperties",
        "default": "{}",
        "description": "Additional inline styles."
      }
    ]
  },
  "text-pressure": {
    "slug": "text-pressure",
    "name": "Text Pressure",
    "description": "Characters scale / warp interactively based on pointer pressure zone.",
    "dependencies": {},
    "installation": {
      "cliTs": "npx kibo add text-pressure",
      "cliJs": "npx kibo add text-pressure --js",
      "npm": "npx kibo add text-pressure",
      "pnpm": "pnpm dlx kibo add text-pressure",
      "yarn": "yarn add text-pressure",
      "bun": "bunx kibo add text-pressure"
    },
    "usageTs": "import { TextPressure } from \"@/components/kibo/text-pressure/component\";\n\nexport default function MyComponent() {\n  return (\n    <div className=\"relative h-[200px] w-full\">\n      <TextPressure\n        text=\"INTERACT\"\n        flex={true}\n        width={true}\n        weight={true}\n        textColor=\"#ffffff\"\n      />\n    </div>\n  );\n}",
    "usageJs": "import { TextPressure } from \"@/components/kibo/text-pressure/component\";\nexport default function MyComponent() {\n    return (<div className=\"relative h-[200px] w-full\">\n      <TextPressure text=\"INTERACT\" flex={true} width={true} weight={true} textColor=\"#ffffff\"/>\n    </div>);\n}",
    "componentSourceTs": "\"use client\";\n\nimport React, { useEffect, useRef, useState, useMemo, useCallback } from \"react\";\n\nexport interface TextPressureProps {\n  /** The text to display. */\n  text?: string;\n  /** The Google Font family to use. */\n  fontFamily?: string;\n  /** The URL to the Google Font. */\n  fontUrl?: string;\n  /** Whether to adjust font width based on cursor. */\n  width?: boolean;\n  /** Whether to adjust font weight based on cursor. */\n  weight?: boolean;\n  /** Whether to adjust italic slant based on cursor. */\n  italic?: boolean;\n  /** Whether to adjust opacity based on cursor. */\n  alpha?: boolean;\n  /** Whether to use flexbox spacing. */\n  flex?: boolean;\n  /** Whether to render a stroke effect instead of solid text. */\n  stroke?: boolean;\n  /** Whether to scale text to fill container height. */\n  scale?: boolean;\n  /** Base text color. */\n  textColor?: string;\n  /** Stroke color if stroke is true. */\n  strokeColor?: string;\n  /** Stroke width in pixels if stroke is true. */\n  strokeWidth?: number;\n  /** Additional CSS classes. */\n  className?: string;\n  /** Minimum font size in pixels. */\n  minFontSize?: number;\n}\n\nconst dist = (a: { x: number; y: number }, b: { x: number; y: number }) => {\n  const dx = b.x - a.x;\n  const dy = b.y - a.y;\n  return Math.sqrt(dx * dx + dy * dy);\n};\n\nconst getAttr = (\n  distance: number,\n  maxDist: number,\n  minVal: number,\n  maxVal: number\n) => {\n  const val = maxVal - Math.abs((maxVal * distance) / maxDist);\n  return Math.max(minVal, val + minVal);\n};\n\nconst debounce = <T extends (...args: unknown[]) => void>(\n  func: T,\n  delay: number\n) => {\n  let timeoutId: ReturnType<typeof setTimeout>;\n  return function (this: unknown, ...args: Parameters<T>) {\n    clearTimeout(timeoutId);\n    timeoutId = setTimeout(() => {\n      func.apply(this, args);\n    }, delay);\n  };\n};\n\nexport function TextPressure({\n  text = \"Compressa\",\n  fontFamily = \"Roboto Flex\",\n  fontUrl = \"https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wdth,wght@8..144,25..151,100..1000&display=swap\",\n  width = true,\n  weight = true,\n  italic = true,\n  alpha = false,\n  flex = true,\n  stroke = false,\n  scale = false,\n  textColor = \"#FFFFFF\",\n  strokeColor = \"#FF0000\",\n  strokeWidth = 2,\n  className = \"\",\n  minFontSize = 24,\n}: TextPressureProps) {\n  const containerRef = useRef<HTMLDivElement | null>(null);\n  const titleRef = useRef<HTMLHeadingElement | null>(null);\n  const spansRef = useRef<(HTMLSpanElement | null)[]>([]);\n\n  const mouseRef = useRef({ x: 0, y: 0 });\n  const cursorRef = useRef({ x: 0, y: 0 });\n\n  const [fontSize, setFontSize] = useState(minFontSize);\n  const [scaleY, setScaleY] = useState(1);\n  const [lineHeight, setLineHeight] = useState(1);\n\n  const chars = text.split(\"\");\n\n  useEffect(() => {\n    const handleMouseMove = (e: MouseEvent) => {\n      cursorRef.current.x = e.clientX;\n      cursorRef.current.y = e.clientY;\n    };\n    const handleTouchMove = (e: TouchEvent) => {\n      const t = e.touches[0];\n      cursorRef.current.x = t.clientX;\n      cursorRef.current.y = t.clientY;\n    };\n\n    window.addEventListener(\"mousemove\", handleMouseMove);\n    window.addEventListener(\"touchmove\", handleTouchMove, { passive: true });\n\n    if (containerRef.current) {\n      const { left, top, width, height } =\n        containerRef.current.getBoundingClientRect();\n      mouseRef.current.x = left + width / 2;\n      mouseRef.current.y = top + height / 2;\n      cursorRef.current.x = mouseRef.current.x;\n      cursorRef.current.y = mouseRef.current.y;\n    }\n\n    return () => {\n      window.removeEventListener(\"mousemove\", handleMouseMove);\n      window.removeEventListener(\"touchmove\", handleTouchMove);\n    };\n  }, []);\n\n  const setSize = useCallback(() => {\n    if (!containerRef.current || !titleRef.current) return;\n\n    const { width: containerW, height: containerH } =\n      containerRef.current.getBoundingClientRect();\n\n    let newFontSize = containerW / (chars.length / 2);\n    newFontSize = Math.max(newFontSize, minFontSize);\n\n    setFontSize(newFontSize);\n    setScaleY(1);\n    setLineHeight(1);\n\n    requestAnimationFrame(() => {\n      if (!titleRef.current) return;\n      const textRect = titleRef.current.getBoundingClientRect();\n\n      if (scale && textRect.height > 0) {\n        const yRatio = containerH / textRect.height;\n        setScaleY(yRatio);\n        setLineHeight(yRatio);\n      }\n    });\n  }, [chars.length, minFontSize, scale]);\n\n  useEffect(() => {\n    const debouncedSetSize = debounce(setSize, 100);\n    debouncedSetSize();\n    window.addEventListener(\"resize\", debouncedSetSize);\n    return () => window.removeEventListener(\"resize\", debouncedSetSize);\n  }, [setSize]);\n\n  useEffect(() => {\n    let rafId: number;\n    const animate = () => {\n      mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) / 15;\n      mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) / 15;\n\n      if (titleRef.current) {\n        const titleRect = titleRef.current.getBoundingClientRect();\n        const maxDist = titleRect.width / 2;\n\n        spansRef.current.forEach((span) => {\n          if (!span) return;\n\n          const rect = span.getBoundingClientRect();\n          const charCenter = {\n            x: rect.x + rect.width / 2,\n            y: rect.y + rect.height / 2,\n          };\n\n          const d = dist(mouseRef.current, charCenter);\n\n          const wdth = width ? Math.floor(getAttr(d, maxDist, 5, 200)) : 100;\n          const wght = weight ? Math.floor(getAttr(d, maxDist, 100, 900)) : 400;\n          const italVal = italic ? getAttr(d, maxDist, 0, 1).toFixed(2) : \"0\";\n          const alphaVal = alpha ? getAttr(d, maxDist, 0, 1).toFixed(2) : \"1\";\n\n          const newFontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}`;\n\n          if (span.style.fontVariationSettings !== newFontVariationSettings) {\n            span.style.fontVariationSettings = newFontVariationSettings;\n          }\n          if (alpha && span.style.opacity !== alphaVal) {\n            span.style.opacity = alphaVal;\n          }\n        });\n      }\n\n      rafId = requestAnimationFrame(animate);\n    };\n\n    animate();\n    return () => cancelAnimationFrame(rafId);\n  }, [width, weight, italic, alpha]);\n\n  const styleElement = useMemo(() => {\n    return (\n      <style>{`\n        @import url('${fontUrl}');\n        .stroke span {\n          position: relative;\n          color: ${textColor};\n        }\n        .stroke span::after {\n          content: attr(data-char);\n          position: absolute;\n          left: 0;\n          top: 0;\n          color: transparent;\n          z-index: -1;\n          -webkit-text-stroke-width: ${strokeWidth}px;\n          -webkit-text-stroke-color: ${strokeColor};\n        }\n      `}</style>\n    );\n  }, [fontUrl, textColor, strokeColor, strokeWidth]);\n\n  return (\n    <div\n      ref={containerRef}\n      className=\"relative h-full w-full overflow-hidden bg-transparent\"\n    >\n      {styleElement}\n      <h1\n        ref={titleRef}\n        className={`text-pressure-title ${className} ${\n          flex ? \"flex justify-between\" : \"\"\n        } ${stroke ? \"stroke\" : \"\"} text-center uppercase`}\n        style={{\n          fontFamily,\n          fontSize: fontSize,\n          lineHeight,\n          transform: `scale(1, ${scaleY})`,\n          transformOrigin: \"center top\",\n          margin: 0,\n          fontWeight: 100,\n          color: stroke ? undefined : textColor,\n        }}\n      >\n        {chars.map((char, i) => (\n          <span\n            key={i}\n            ref={(el) => {\n              spansRef.current[i] = el;\n            }}\n            data-char={char}\n            className=\"inline-block\"\n          >\n            {char}\n          </span>\n        ))}\n      </h1>\n    </div>\n  );\n}\n",
    "componentSourceJs": "\"use client\";\nimport React, { useEffect, useRef, useState, useMemo, useCallback } from \"react\";\nconst dist = (a, b) => {\n    const dx = b.x - a.x;\n    const dy = b.y - a.y;\n    return Math.sqrt(dx * dx + dy * dy);\n};\nconst getAttr = (distance, maxDist, minVal, maxVal) => {\n    const val = maxVal - Math.abs((maxVal * distance) / maxDist);\n    return Math.max(minVal, val + minVal);\n};\nconst debounce = (func, delay) => {\n    let timeoutId;\n    return function (...args) {\n        clearTimeout(timeoutId);\n        timeoutId = setTimeout(() => {\n            func.apply(this, args);\n        }, delay);\n    };\n};\nexport function TextPressure({ text = \"Compressa\", fontFamily = \"Roboto Flex\", fontUrl = \"https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wdth,wght@8..144,25..151,100..1000&display=swap\", width = true, weight = true, italic = true, alpha = false, flex = true, stroke = false, scale = false, textColor = \"#FFFFFF\", strokeColor = \"#FF0000\", strokeWidth = 2, className = \"\", minFontSize = 24, }) {\n    const containerRef = useRef(null);\n    const titleRef = useRef(null);\n    const spansRef = useRef([]);\n    const mouseRef = useRef({ x: 0, y: 0 });\n    const cursorRef = useRef({ x: 0, y: 0 });\n    const [fontSize, setFontSize] = useState(minFontSize);\n    const [scaleY, setScaleY] = useState(1);\n    const [lineHeight, setLineHeight] = useState(1);\n    const chars = text.split(\"\");\n    useEffect(() => {\n        const handleMouseMove = (e) => {\n            cursorRef.current.x = e.clientX;\n            cursorRef.current.y = e.clientY;\n        };\n        const handleTouchMove = (e) => {\n            const t = e.touches[0];\n            cursorRef.current.x = t.clientX;\n            cursorRef.current.y = t.clientY;\n        };\n        window.addEventListener(\"mousemove\", handleMouseMove);\n        window.addEventListener(\"touchmove\", handleTouchMove, { passive: true });\n        if (containerRef.current) {\n            const { left, top, width, height } = containerRef.current.getBoundingClientRect();\n            mouseRef.current.x = left + width / 2;\n            mouseRef.current.y = top + height / 2;\n            cursorRef.current.x = mouseRef.current.x;\n            cursorRef.current.y = mouseRef.current.y;\n        }\n        return () => {\n            window.removeEventListener(\"mousemove\", handleMouseMove);\n            window.removeEventListener(\"touchmove\", handleTouchMove);\n        };\n    }, []);\n    const setSize = useCallback(() => {\n        if (!containerRef.current || !titleRef.current)\n            return;\n        const { width: containerW, height: containerH } = containerRef.current.getBoundingClientRect();\n        let newFontSize = containerW / (chars.length / 2);\n        newFontSize = Math.max(newFontSize, minFontSize);\n        setFontSize(newFontSize);\n        setScaleY(1);\n        setLineHeight(1);\n        requestAnimationFrame(() => {\n            if (!titleRef.current)\n                return;\n            const textRect = titleRef.current.getBoundingClientRect();\n            if (scale && textRect.height > 0) {\n                const yRatio = containerH / textRect.height;\n                setScaleY(yRatio);\n                setLineHeight(yRatio);\n            }\n        });\n    }, [chars.length, minFontSize, scale]);\n    useEffect(() => {\n        const debouncedSetSize = debounce(setSize, 100);\n        debouncedSetSize();\n        window.addEventListener(\"resize\", debouncedSetSize);\n        return () => window.removeEventListener(\"resize\", debouncedSetSize);\n    }, [setSize]);\n    useEffect(() => {\n        let rafId;\n        const animate = () => {\n            mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) / 15;\n            mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) / 15;\n            if (titleRef.current) {\n                const titleRect = titleRef.current.getBoundingClientRect();\n                const maxDist = titleRect.width / 2;\n                spansRef.current.forEach((span) => {\n                    if (!span)\n                        return;\n                    const rect = span.getBoundingClientRect();\n                    const charCenter = {\n                        x: rect.x + rect.width / 2,\n                        y: rect.y + rect.height / 2,\n                    };\n                    const d = dist(mouseRef.current, charCenter);\n                    const wdth = width ? Math.floor(getAttr(d, maxDist, 5, 200)) : 100;\n                    const wght = weight ? Math.floor(getAttr(d, maxDist, 100, 900)) : 400;\n                    const italVal = italic ? getAttr(d, maxDist, 0, 1).toFixed(2) : \"0\";\n                    const alphaVal = alpha ? getAttr(d, maxDist, 0, 1).toFixed(2) : \"1\";\n                    const newFontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}`;\n                    if (span.style.fontVariationSettings !== newFontVariationSettings) {\n                        span.style.fontVariationSettings = newFontVariationSettings;\n                    }\n                    if (alpha && span.style.opacity !== alphaVal) {\n                        span.style.opacity = alphaVal;\n                    }\n                });\n            }\n            rafId = requestAnimationFrame(animate);\n        };\n        animate();\n        return () => cancelAnimationFrame(rafId);\n    }, [width, weight, italic, alpha]);\n    const styleElement = useMemo(() => {\n        return (<style>{`\n        @import url('${fontUrl}');\n        .stroke span {\n          position: relative;\n          color: ${textColor};\n        }\n        .stroke span::after {\n          content: attr(data-char);\n          position: absolute;\n          left: 0;\n          top: 0;\n          color: transparent;\n          z-index: -1;\n          -webkit-text-stroke-width: ${strokeWidth}px;\n          -webkit-text-stroke-color: ${strokeColor};\n        }\n      `}</style>);\n    }, [fontUrl, textColor, strokeColor, strokeWidth]);\n    return (<div ref={containerRef} className=\"relative h-full w-full overflow-hidden bg-transparent\">\n      {styleElement}\n      <h1 ref={titleRef} className={`text-pressure-title ${className} ${flex ? \"flex justify-between\" : \"\"} ${stroke ? \"stroke\" : \"\"} text-center uppercase`} style={{\n            fontFamily,\n            fontSize: fontSize,\n            lineHeight,\n            transform: `scale(1, ${scaleY})`,\n            transformOrigin: \"center top\",\n            margin: 0,\n            fontWeight: 100,\n            color: stroke ? undefined : textColor,\n        }}>\n        {chars.map((char, i) => (<span key={i} ref={(el) => {\n                spansRef.current[i] = el;\n            }} data-char={char} className=\"inline-block\">\n            {char}\n          </span>))}\n      </h1>\n    </div>);\n}",
    "props": [
      {
        "name": "text",
        "type": "string",
        "default": "\"Compressa\"",
        "description": "The text to display."
      },
      {
        "name": "fontFamily",
        "type": "string",
        "default": "\"Roboto Flex\"",
        "description": "The Google Font family to use."
      },
      {
        "name": "fontUrl",
        "type": "string",
        "default": "\"https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wdth,wght@8..144,25..151,100..1000&display=swap\"",
        "description": "The URL to the Google Font."
      },
      {
        "name": "width",
        "type": "boolean",
        "default": "true",
        "description": "Whether to adjust font width based on cursor."
      },
      {
        "name": "weight",
        "type": "boolean",
        "default": "true",
        "description": "Whether to adjust font weight based on cursor."
      },
      {
        "name": "italic",
        "type": "boolean",
        "default": "true",
        "description": "Whether to adjust italic slant based on cursor."
      },
      {
        "name": "alpha",
        "type": "boolean",
        "default": "false",
        "description": "Whether to adjust opacity based on cursor."
      },
      {
        "name": "flex",
        "type": "boolean",
        "default": "true",
        "description": "Whether to use flexbox spacing."
      },
      {
        "name": "stroke",
        "type": "boolean",
        "default": "false",
        "description": "Whether to render a stroke effect instead of solid text."
      },
      {
        "name": "scale",
        "type": "boolean",
        "default": "false",
        "description": "Whether to scale text to fill container height."
      },
      {
        "name": "textColor",
        "type": "string",
        "default": "\"#FFFFFF\"",
        "description": "Base text color."
      },
      {
        "name": "strokeColor",
        "type": "string",
        "default": "\"#FF0000\"",
        "description": "Stroke color if stroke is true."
      },
      {
        "name": "strokeWidth",
        "type": "number",
        "default": "2",
        "description": "Stroke width in pixels if stroke is true."
      },
      {
        "name": "className",
        "type": "string",
        "default": "\"\"",
        "description": "Additional CSS classes."
      },
      {
        "name": "minFontSize",
        "type": "number",
        "default": "24",
        "description": "Minimum font size in pixels."
      }
    ]
  },
  "text-type": {
    "slug": "text-type",
    "name": "Text Type",
    "description": "Realistic mechanical typing and backspacing animation with blinking cursor, variable typing speeds, and pauses.",
    "dependencies": {
      "gsap": "^3.13.0"
    },
    "installation": {
      "cliTs": "npx kibo add text-type",
      "cliJs": "npx kibo add text-type --js",
      "npm": "npm i gsap",
      "pnpm": "pnpm add gsap",
      "yarn": "yarn add gsap",
      "bun": "bun add gsap"
    },
    "usageTs": "import { TextType } from \"@/components/kibo/text-type/component\";\n\nexport default function Example() {\n  return (\n    <TextType />\n  );\n}",
    "usageJs": "import { TextType } from \"@/components/kibo/text-type/component\";\nexport default function Example() {\n    return (<TextType />);\n}",
    "componentSourceTs": "'use client';\n\nimport { type ElementType, useEffect, useRef, useState, createElement, useMemo, useCallback } from 'react';\nimport { gsap } from 'gsap';\n\ninterface TextTypeProps {\n  className?: string;\n  showCursor?: boolean;\n  hideCursorWhileTyping?: boolean;\n  cursorCharacter?: string | React.ReactNode;\n  cursorBlinkDuration?: number;\n  cursorClassName?: string;\n  text: string | string[];\n  as?: ElementType;\n  typingSpeed?: number;\n  initialDelay?: number;\n  pauseDuration?: number;\n  deletingSpeed?: number;\n  loop?: boolean;\n  textColors?: string[];\n  variableSpeed?: { min: number; max: number };\n  onSentenceComplete?: (sentence: string, index: number) => void;\n  startOnVisible?: boolean;\n  reverseMode?: boolean;\n}\n\nexport const TextType = ({\n  text,\n  as: Component = 'div',\n  typingSpeed = 50,\n  initialDelay = 0,\n  pauseDuration = 2000,\n  deletingSpeed = 30,\n  loop = true,\n  className = '',\n  showCursor = true,\n  hideCursorWhileTyping = false,\n  cursorCharacter = '|',\n  cursorClassName = '',\n  cursorBlinkDuration = 0.5,\n  textColors = [],\n  variableSpeed,\n  onSentenceComplete,\n  startOnVisible = false,\n  reverseMode = false,\n  ...props\n}: TextTypeProps & React.HTMLAttributes<HTMLElement>) => {\n  const [displayedText, setDisplayedText] = useState('');\n  const [currentCharIndex, setCurrentCharIndex] = useState(0);\n  const [isDeleting, setIsDeleting] = useState(false);\n  const [currentTextIndex, setCurrentTextIndex] = useState(0);\n  const [isVisible, setIsVisible] = useState(!startOnVisible);\n  const cursorRef = useRef<HTMLSpanElement>(null);\n  const containerRef = useRef<HTMLElement>(null);\n\n  const textArray = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);\n\n  const getRandomSpeed = useCallback(() => {\n    if (!variableSpeed) return typingSpeed;\n    const { min, max } = variableSpeed;\n    return Math.random() * (max - min) + min;\n  }, [variableSpeed, typingSpeed]);\n\n  const getCurrentTextColor = () => {\n    if (textColors.length === 0) return 'inherit';\n    return textColors[currentTextIndex % textColors.length];\n  };\n\n  useEffect(() => {\n    if (!startOnVisible || !containerRef.current) return;\n\n    const observer = new IntersectionObserver(\n      entries => {\n        entries.forEach(entry => {\n          if (entry.isIntersecting) {\n            setIsVisible(true);\n          }\n        });\n      },\n      { threshold: 0.1 }\n    );\n\n    observer.observe(containerRef.current);\n    return () => observer.disconnect();\n  }, [startOnVisible]);\n\n  useEffect(() => {\n    if (showCursor && cursorRef.current) {\n      gsap.set(cursorRef.current, { opacity: 1 });\n      gsap.to(cursorRef.current, {\n        opacity: 0,\n        duration: cursorBlinkDuration,\n        repeat: -1,\n        yoyo: true,\n        ease: 'power2.inOut'\n      });\n    }\n  }, [showCursor, cursorBlinkDuration]);\n\n  useEffect(() => {\n    if (!isVisible) return;\n\n    let timeout: ReturnType<typeof setTimeout>;\n\n    const currentText = textArray[currentTextIndex];\n    const processedText = reverseMode ? currentText.split('').reverse().join('') : currentText;\n\n    const executeTypingAnimation = () => {\n      if (isDeleting) {\n        if (displayedText === '') {\n          setIsDeleting(false);\n          if (currentTextIndex === textArray.length - 1 && !loop) {\n            return;\n          }\n\n          if (onSentenceComplete) {\n            onSentenceComplete(textArray[currentTextIndex], currentTextIndex);\n          }\n\n          setCurrentTextIndex(prev => (prev + 1) % textArray.length);\n          setCurrentCharIndex(0);\n          timeout = setTimeout(() => {}, pauseDuration);\n        } else {\n          timeout = setTimeout(() => {\n            setDisplayedText(prev => prev.slice(0, -1));\n          }, deletingSpeed);\n        }\n      } else {\n        if (currentCharIndex < processedText.length) {\n          timeout = setTimeout(\n            () => {\n              setDisplayedText(prev => prev + processedText[currentCharIndex]);\n              setCurrentCharIndex(prev => prev + 1);\n            },\n            variableSpeed ? getRandomSpeed() : typingSpeed\n          );\n        } else if (textArray.length >= 1) {\n          if (!loop && currentTextIndex === textArray.length - 1) return;\n          timeout = setTimeout(() => {\n            setIsDeleting(true);\n          }, pauseDuration);\n        }\n      }\n    };\n\n    if (currentCharIndex === 0 && !isDeleting && displayedText === '') {\n      timeout = setTimeout(executeTypingAnimation, initialDelay);\n    } else {\n      executeTypingAnimation();\n    }\n\n    return () => clearTimeout(timeout);\n  }, [\n    currentCharIndex,\n    displayedText,\n    isDeleting,\n    typingSpeed,\n    deletingSpeed,\n    pauseDuration,\n    textArray,\n    currentTextIndex,\n    loop,\n    initialDelay,\n    isVisible,\n    reverseMode,\n    variableSpeed,\n    onSentenceComplete\n  ]);\n\n  const shouldHideCursor =\n    hideCursorWhileTyping && (currentCharIndex < textArray[currentTextIndex].length || isDeleting);\n\n  return createElement(\n    Component,\n    {\n      ref: containerRef,\n      className: `inline-block whitespace-pre-wrap tracking-tight ${className}`,\n      ...props\n    },\n    <span className=\"inline\" style={{ color: getCurrentTextColor() || 'inherit' }}>\n      {displayedText}\n    </span>,\n    showCursor && (\n      <span\n        ref={cursorRef}\n        className={`ml-1 inline-block opacity-100 ${shouldHideCursor ? 'hidden' : ''} ${cursorClassName}`}\n      >\n        {cursorCharacter}\n      </span>\n    )\n  );\n};\n\nexport default TextType;",
    "componentSourceJs": "'use client';\nimport { useEffect, useRef, useState, createElement, useMemo, useCallback } from 'react';\nimport { gsap } from 'gsap';\nexport const TextType = ({ text, as: Component = 'div', typingSpeed = 50, initialDelay = 0, pauseDuration = 2000, deletingSpeed = 30, loop = true, className = '', showCursor = true, hideCursorWhileTyping = false, cursorCharacter = '|', cursorClassName = '', cursorBlinkDuration = 0.5, textColors = [], variableSpeed, onSentenceComplete, startOnVisible = false, reverseMode = false, ...props }) => {\n    const [displayedText, setDisplayedText] = useState('');\n    const [currentCharIndex, setCurrentCharIndex] = useState(0);\n    const [isDeleting, setIsDeleting] = useState(false);\n    const [currentTextIndex, setCurrentTextIndex] = useState(0);\n    const [isVisible, setIsVisible] = useState(!startOnVisible);\n    const cursorRef = useRef(null);\n    const containerRef = useRef(null);\n    const textArray = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);\n    const getRandomSpeed = useCallback(() => {\n        if (!variableSpeed)\n            return typingSpeed;\n        const { min, max } = variableSpeed;\n        return Math.random() * (max - min) + min;\n    }, [variableSpeed, typingSpeed]);\n    const getCurrentTextColor = () => {\n        if (textColors.length === 0)\n            return 'inherit';\n        return textColors[currentTextIndex % textColors.length];\n    };\n    useEffect(() => {\n        if (!startOnVisible || !containerRef.current)\n            return;\n        const observer = new IntersectionObserver(entries => {\n            entries.forEach(entry => {\n                if (entry.isIntersecting) {\n                    setIsVisible(true);\n                }\n            });\n        }, { threshold: 0.1 });\n        observer.observe(containerRef.current);\n        return () => observer.disconnect();\n    }, [startOnVisible]);\n    useEffect(() => {\n        if (showCursor && cursorRef.current) {\n            gsap.set(cursorRef.current, { opacity: 1 });\n            gsap.to(cursorRef.current, {\n                opacity: 0,\n                duration: cursorBlinkDuration,\n                repeat: -1,\n                yoyo: true,\n                ease: 'power2.inOut'\n            });\n        }\n    }, [showCursor, cursorBlinkDuration]);\n    useEffect(() => {\n        if (!isVisible)\n            return;\n        let timeout;\n        const currentText = textArray[currentTextIndex];\n        const processedText = reverseMode ? currentText.split('').reverse().join('') : currentText;\n        const executeTypingAnimation = () => {\n            if (isDeleting) {\n                if (displayedText === '') {\n                    setIsDeleting(false);\n                    if (currentTextIndex === textArray.length - 1 && !loop) {\n                        return;\n                    }\n                    if (onSentenceComplete) {\n                        onSentenceComplete(textArray[currentTextIndex], currentTextIndex);\n                    }\n                    setCurrentTextIndex(prev => (prev + 1) % textArray.length);\n                    setCurrentCharIndex(0);\n                    timeout = setTimeout(() => { }, pauseDuration);\n                }\n                else {\n                    timeout = setTimeout(() => {\n                        setDisplayedText(prev => prev.slice(0, -1));\n                    }, deletingSpeed);\n                }\n            }\n            else {\n                if (currentCharIndex < processedText.length) {\n                    timeout = setTimeout(() => {\n                        setDisplayedText(prev => prev + processedText[currentCharIndex]);\n                        setCurrentCharIndex(prev => prev + 1);\n                    }, variableSpeed ? getRandomSpeed() : typingSpeed);\n                }\n                else if (textArray.length >= 1) {\n                    if (!loop && currentTextIndex === textArray.length - 1)\n                        return;\n                    timeout = setTimeout(() => {\n                        setIsDeleting(true);\n                    }, pauseDuration);\n                }\n            }\n        };\n        if (currentCharIndex === 0 && !isDeleting && displayedText === '') {\n            timeout = setTimeout(executeTypingAnimation, initialDelay);\n        }\n        else {\n            executeTypingAnimation();\n        }\n        return () => clearTimeout(timeout);\n    }, [\n        currentCharIndex,\n        displayedText,\n        isDeleting,\n        typingSpeed,\n        deletingSpeed,\n        pauseDuration,\n        textArray,\n        currentTextIndex,\n        loop,\n        initialDelay,\n        isVisible,\n        reverseMode,\n        variableSpeed,\n        onSentenceComplete\n    ]);\n    const shouldHideCursor = hideCursorWhileTyping && (currentCharIndex < textArray[currentTextIndex].length || isDeleting);\n    return createElement(Component, {\n        ref: containerRef,\n        className: `inline-block whitespace-pre-wrap tracking-tight ${className}`,\n        ...props\n    }, <span className=\"inline\" style={{ color: getCurrentTextColor() || 'inherit' }}>\n      {displayedText}\n    </span>, showCursor && (<span ref={cursorRef} className={`ml-1 inline-block opacity-100 ${shouldHideCursor ? 'hidden' : ''} ${cursorClassName}`}>\n        {cursorCharacter}\n      </span>));\n};\nexport default TextType;",
    "props": [
      {
        "name": "className",
        "type": "string",
        "default": "''",
        "description": "Additional CSS classes for styling and layout."
      },
      {
        "name": "showCursor",
        "type": "boolean",
        "default": "true",
        "description": "Controls the show cursor for the component animation."
      },
      {
        "name": "hideCursorWhileTyping",
        "type": "boolean",
        "default": "false",
        "description": "Controls the hide cursor while typing for the component animation."
      },
      {
        "name": "cursorCharacter",
        "type": "string | React.ReactNode",
        "default": "'|'",
        "description": "Controls the cursor character for the component animation."
      },
      {
        "name": "cursorBlinkDuration",
        "type": "number",
        "default": "0.5",
        "description": "Controls the cursor blink duration for the component animation."
      },
      {
        "name": "cursorClassName",
        "type": "string",
        "default": "''",
        "description": "Controls the cursor class name for the component animation."
      },
      {
        "name": "text",
        "type": "string | string[]",
        "default": "-",
        "description": "The text content to display and animate."
      },
      {
        "name": "as",
        "type": "ElementType",
        "default": "-",
        "description": "Controls the as for the component animation."
      },
      {
        "name": "typingSpeed",
        "type": "number",
        "default": "50",
        "description": "Controls the typing speed for the component animation."
      },
      {
        "name": "initialDelay",
        "type": "number",
        "default": "0",
        "description": "Controls the initial delay for the component animation."
      },
      {
        "name": "pauseDuration",
        "type": "number",
        "default": "2000",
        "description": "Controls the pause duration for the component animation."
      },
      {
        "name": "deletingSpeed",
        "type": "number",
        "default": "30",
        "description": "Controls the deleting speed for the component animation."
      },
      {
        "name": "loop",
        "type": "boolean",
        "default": "true",
        "description": "Controls the loop for the component animation."
      },
      {
        "name": "textColors",
        "type": "string[]",
        "default": "[]",
        "description": "Controls the text colors for the component animation."
      },
      {
        "name": "variableSpeed",
        "type": "{ min: number; max: number }",
        "default": "-",
        "description": "Controls the variable speed for the component animation."
      },
      {
        "name": "onSentenceComplete",
        "type": "(sentence: string, index: number) => void",
        "default": "-",
        "description": "Controls the on sentence complete for the component animation."
      },
      {
        "name": "startOnVisible",
        "type": "boolean",
        "default": "false",
        "description": "Controls the start on visible for the component animation."
      },
      {
        "name": "reverseMode",
        "type": "boolean",
        "default": "false",
        "description": "Controls the reverse mode for the component animation."
      }
    ]
  },
  "true-focus": {
    "slug": "true-focus",
    "name": "True Focus",
    "description": "Camera viewfinder crosshair brackets locking onto active words with smooth spring transitions and blur depth.",
    "dependencies": {
      "motion": "^12.23.12"
    },
    "installation": {
      "cliTs": "npx kibo add true-focus",
      "cliJs": "npx kibo add true-focus --js",
      "npm": "npm i motion",
      "pnpm": "pnpm add motion",
      "yarn": "yarn add motion",
      "bun": "bun add motion"
    },
    "usageTs": "import { TrueFocus } from \"@/components/kibo/true-focus/component\";\n\nexport default function Example() {\n  return (\n    <TrueFocus />\n  );\n}",
    "usageJs": "import { TrueFocus } from \"@/components/kibo/true-focus/component\";\nexport default function Example() {\n    return (<TrueFocus />);\n}",
    "componentSourceTs": "\"use client\";\n\nimport { useEffect, useRef, useState } from 'react';\nimport { motion } from 'motion/react';\n\ninterface TrueFocusProps {\n  sentence?: string;\n  separator?: string;\n  manualMode?: boolean;\n  blurAmount?: number;\n  borderColor?: string;\n  glowColor?: string;\n  animationDuration?: number;\n  pauseBetweenAnimations?: number;\n  fontSize?: string;\n}\n\ninterface FocusRect {\n  x: number;\n  y: number;\n  width: number;\n  height: number;\n}\n\nexport const TrueFocus: React.FC<TrueFocusProps> = ({\n  sentence = 'True Focus',\n  separator = ' ',\n  manualMode = false,\n  blurAmount = 5,\n  borderColor = 'green',\n  glowColor = 'rgba(0, 255, 0, 0.6)',\n  animationDuration = 0.5,\n  pauseBetweenAnimations = 1,\n  fontSize = 'text-2xl sm:text-3xl md:text-4xl font-black text-white'\n}) => {\n  const words = sentence.split(separator);\n  const [currentIndex, setCurrentIndex] = useState<number>(0);\n  const [lastActiveIndex, setLastActiveIndex] = useState<number | null>(null);\n  const containerRef = useRef<HTMLDivElement | null>(null);\n  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);\n  const [focusRect, setFocusRect] = useState<FocusRect>({ x: 0, y: 0, width: 0, height: 0 });\n\n  useEffect(() => {\n    if (!manualMode) {\n      const interval = setInterval(\n        () => {\n          setCurrentIndex(prev => (prev + 1) % words.length);\n        },\n        (animationDuration + pauseBetweenAnimations) * 1000\n      );\n\n      return () => clearInterval(interval);\n    }\n  }, [manualMode, animationDuration, pauseBetweenAnimations, words.length]);\n\n  useEffect(() => {\n    if (currentIndex === null || currentIndex === -1) return;\n    if (!wordRefs.current[currentIndex] || !containerRef.current) return;\n\n    const parentRect = containerRef.current.getBoundingClientRect();\n    const activeRect = wordRefs.current[currentIndex]!.getBoundingClientRect();\n\n    setFocusRect({\n      x: activeRect.left - parentRect.left,\n      y: activeRect.top - parentRect.top,\n      width: activeRect.width,\n      height: activeRect.height\n    });\n  }, [currentIndex, words.length]);\n\n  const handleMouseEnter = (index: number) => {\n    if (manualMode) {\n      setLastActiveIndex(index);\n      setCurrentIndex(index);\n    }\n  };\n\n  const handleMouseLeave = () => {\n    if (manualMode) {\n      setCurrentIndex(lastActiveIndex!);\n    }\n  };\n\n  return (\n    <div\n      className=\"relative flex gap-4 justify-center items-center flex-wrap\"\n      ref={containerRef}\n      style={{ outline: 'none', userSelect: 'none' }}\n    >\n      {words.map((word, index) => {\n        const isActive = index === currentIndex;\n        return (\n          <span\n            key={index}\n            ref={el => {\n              wordRefs.current[index] = el;\n            }}\n            className={`relative cursor-pointer ${fontSize}`}\n            style={\n              {\n                filter: manualMode\n                  ? isActive\n                    ? `blur(0px)`\n                    : `blur(${blurAmount}px)`\n                  : isActive\n                    ? `blur(0px)`\n                    : `blur(${blurAmount}px)`,\n                transition: `filter ${animationDuration}s ease`,\n                outline: 'none',\n                userSelect: 'none'\n              } as React.CSSProperties\n            }\n            onMouseEnter={() => handleMouseEnter(index)}\n            onMouseLeave={handleMouseLeave}\n          >\n            {word}\n          </span>\n        );\n      })}\n\n      <motion.div\n        className=\"absolute top-0 left-0 pointer-events-none box-border border-0\"\n        animate={{\n          x: focusRect.x,\n          y: focusRect.y,\n          width: focusRect.width,\n          height: focusRect.height,\n          opacity: currentIndex >= 0 ? 1 : 0\n        }}\n        transition={{\n          duration: animationDuration\n        }}\n        style={\n          {\n            '--border-color': borderColor,\n            '--glow-color': glowColor\n          } as React.CSSProperties\n        }\n      >\n        <span\n          className=\"absolute w-4 h-4 border-[3px] rounded-[3px] top-[-10px] left-[-10px] border-r-0 border-b-0\"\n          style={{\n            borderColor: 'var(--border-color)',\n            filter: 'drop-shadow(0 0 4px var(--border-color))'\n          }}\n        ></span>\n        <span\n          className=\"absolute w-4 h-4 border-[3px] rounded-[3px] top-[-10px] right-[-10px] border-l-0 border-b-0\"\n          style={{\n            borderColor: 'var(--border-color)',\n            filter: 'drop-shadow(0 0 4px var(--border-color))'\n          }}\n        ></span>\n        <span\n          className=\"absolute w-4 h-4 border-[3px] rounded-[3px] bottom-[-10px] left-[-10px] border-r-0 border-t-0\"\n          style={{\n            borderColor: 'var(--border-color)',\n            filter: 'drop-shadow(0 0 4px var(--border-color))'\n          }}\n        ></span>\n        <span\n          className=\"absolute w-4 h-4 border-[3px] rounded-[3px] bottom-[-10px] right-[-10px] border-l-0 border-t-0\"\n          style={{\n            borderColor: 'var(--border-color)',\n            filter: 'drop-shadow(0 0 4px var(--border-color))'\n          }}\n        ></span>\n      </motion.div>\n    </div>\n  );\n};\n\nexport default TrueFocus;",
    "componentSourceJs": "\"use client\";\nimport { useEffect, useRef, useState } from 'react';\nimport { motion } from 'motion/react';\nexport const TrueFocus = ({ sentence = 'True Focus', separator = ' ', manualMode = false, blurAmount = 5, borderColor = 'green', glowColor = 'rgba(0, 255, 0, 0.6)', animationDuration = 0.5, pauseBetweenAnimations = 1, fontSize = 'text-2xl sm:text-3xl md:text-4xl font-black text-white' }) => {\n    const words = sentence.split(separator);\n    const [currentIndex, setCurrentIndex] = useState(0);\n    const [lastActiveIndex, setLastActiveIndex] = useState(null);\n    const containerRef = useRef(null);\n    const wordRefs = useRef([]);\n    const [focusRect, setFocusRect] = useState({ x: 0, y: 0, width: 0, height: 0 });\n    useEffect(() => {\n        if (!manualMode) {\n            const interval = setInterval(() => {\n                setCurrentIndex(prev => (prev + 1) % words.length);\n            }, (animationDuration + pauseBetweenAnimations) * 1000);\n            return () => clearInterval(interval);\n        }\n    }, [manualMode, animationDuration, pauseBetweenAnimations, words.length]);\n    useEffect(() => {\n        if (currentIndex === null || currentIndex === -1)\n            return;\n        if (!wordRefs.current[currentIndex] || !containerRef.current)\n            return;\n        const parentRect = containerRef.current.getBoundingClientRect();\n        const activeRect = wordRefs.current[currentIndex].getBoundingClientRect();\n        setFocusRect({\n            x: activeRect.left - parentRect.left,\n            y: activeRect.top - parentRect.top,\n            width: activeRect.width,\n            height: activeRect.height\n        });\n    }, [currentIndex, words.length]);\n    const handleMouseEnter = (index) => {\n        if (manualMode) {\n            setLastActiveIndex(index);\n            setCurrentIndex(index);\n        }\n    };\n    const handleMouseLeave = () => {\n        if (manualMode) {\n            setCurrentIndex(lastActiveIndex);\n        }\n    };\n    return (<div className=\"relative flex gap-4 justify-center items-center flex-wrap\" ref={containerRef} style={{ outline: 'none', userSelect: 'none' }}>\n      {words.map((word, index) => {\n            const isActive = index === currentIndex;\n            return (<span key={index} ref={el => {\n                    wordRefs.current[index] = el;\n                }} className={`relative cursor-pointer ${fontSize}`} style={{\n                    filter: manualMode\n                        ? isActive\n                            ? `blur(0px)`\n                            : `blur(${blurAmount}px)`\n                        : isActive\n                            ? `blur(0px)`\n                            : `blur(${blurAmount}px)`,\n                    transition: `filter ${animationDuration}s ease`,\n                    outline: 'none',\n                    userSelect: 'none'\n                }} onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={handleMouseLeave}>\n            {word}\n          </span>);\n        })}\n\n      <motion.div className=\"absolute top-0 left-0 pointer-events-none box-border border-0\" animate={{\n            x: focusRect.x,\n            y: focusRect.y,\n            width: focusRect.width,\n            height: focusRect.height,\n            opacity: currentIndex >= 0 ? 1 : 0\n        }} transition={{\n            duration: animationDuration\n        }} style={{\n            '--border-color': borderColor,\n            '--glow-color': glowColor\n        }}>\n        <span className=\"absolute w-4 h-4 border-[3px] rounded-[3px] top-[-10px] left-[-10px] border-r-0 border-b-0\" style={{\n            borderColor: 'var(--border-color)',\n            filter: 'drop-shadow(0 0 4px var(--border-color))'\n        }}></span>\n        <span className=\"absolute w-4 h-4 border-[3px] rounded-[3px] top-[-10px] right-[-10px] border-l-0 border-b-0\" style={{\n            borderColor: 'var(--border-color)',\n            filter: 'drop-shadow(0 0 4px var(--border-color))'\n        }}></span>\n        <span className=\"absolute w-4 h-4 border-[3px] rounded-[3px] bottom-[-10px] left-[-10px] border-r-0 border-t-0\" style={{\n            borderColor: 'var(--border-color)',\n            filter: 'drop-shadow(0 0 4px var(--border-color))'\n        }}></span>\n        <span className=\"absolute w-4 h-4 border-[3px] rounded-[3px] bottom-[-10px] right-[-10px] border-l-0 border-t-0\" style={{\n            borderColor: 'var(--border-color)',\n            filter: 'drop-shadow(0 0 4px var(--border-color))'\n        }}></span>\n      </motion.div>\n    </div>);\n};\nexport default TrueFocus;",
    "props": [
      {
        "name": "sentence",
        "type": "string",
        "default": "'True Focus'",
        "description": "Controls the sentence for the component animation."
      },
      {
        "name": "separator",
        "type": "string",
        "default": "' '",
        "description": "Controls the separator for the component animation."
      },
      {
        "name": "manualMode",
        "type": "boolean",
        "default": "false",
        "description": "Controls the manual mode for the component animation."
      },
      {
        "name": "blurAmount",
        "type": "number",
        "default": "5",
        "description": "Controls the blur amount for the component animation."
      },
      {
        "name": "borderColor",
        "type": "string",
        "default": "'green'",
        "description": "Controls the border color for the component animation."
      },
      {
        "name": "glowColor",
        "type": "string",
        "default": "'rgba(0, 255, 0, 0.6)'",
        "description": "Controls the glow color for the component animation."
      },
      {
        "name": "animationDuration",
        "type": "number",
        "default": "0.5",
        "description": "Controls the animation duration for the component animation."
      },
      {
        "name": "pauseBetweenAnimations",
        "type": "number",
        "default": "1",
        "description": "Controls the pause between animations for the component animation."
      },
      {
        "name": "fontSize",
        "type": "string",
        "default": "'text-2xl sm:text-3xl md:text-4xl font-black text-white'",
        "description": "Font size in pixels, rems, or fluid clamp notation."
      }
    ]
  },
  "variable-proximity": {
    "slug": "variable-proximity",
    "name": "Variable Proximity",
    "description": "Variable font weight and optical size interpolation fluidly responding to cursor distance across individual letters.",
    "dependencies": {
      "motion": "^12.23.12"
    },
    "installation": {
      "cliTs": "npx kibo add variable-proximity",
      "cliJs": "npx kibo add variable-proximity --js",
      "npm": "npm i motion",
      "pnpm": "pnpm add motion",
      "yarn": "yarn add motion",
      "bun": "bun add motion"
    },
    "usageTs": "import { VariableProximity } from \"@/components/kibo/variable-proximity/component\";\n\nexport default function Example() {\n  return (\n    <VariableProximity />\n  );\n}",
    "usageJs": "import { VariableProximity } from \"@/components/kibo/variable-proximity/component\";\nexport default function Example() {\n    return (<VariableProximity />);\n}",
    "componentSourceTs": "\"use client\";\n\nimport {\n  forwardRef,\n  useMemo,\n  useRef,\n  useEffect,\n  type MutableRefObject,\n  type CSSProperties,\n  type HTMLAttributes\n} from 'react';\nimport { motion } from 'motion/react';\n\nfunction useAnimationFrame(callback: () => void) {\n  useEffect(() => {\n    let frameId: number;\n    const loop = () => {\n      callback();\n      frameId = requestAnimationFrame(loop);\n    };\n    frameId = requestAnimationFrame(loop);\n    return () => cancelAnimationFrame(frameId);\n  }, [callback]);\n}\n\nfunction useMousePositionRef(containerRef?: MutableRefObject<HTMLElement | null>) {\n  const positionRef = useRef({ x: 0, y: 0 });\n\n  useEffect(() => {\n    const updatePosition = (x: number, y: number) => {\n      if (containerRef?.current) {\n        const rect = containerRef.current.getBoundingClientRect();\n        positionRef.current = { x: x - rect.left, y: y - rect.top };\n      } else {\n        positionRef.current = { x, y };\n      }\n    };\n\n    const handleMouseMove = (ev: MouseEvent) => updatePosition(ev.clientX, ev.clientY);\n    const handleTouchMove = (ev: TouchEvent) => {\n      const touch = ev.touches[0];\n      updatePosition(touch.clientX, touch.clientY);\n    };\n\n    window.addEventListener('mousemove', handleMouseMove);\n    window.addEventListener('touchmove', handleTouchMove);\n    return () => {\n      window.removeEventListener('mousemove', handleMouseMove);\n      window.removeEventListener('touchmove', handleTouchMove);\n    };\n  }, [containerRef]);\n\n  return positionRef;\n}\n\ninterface VariableProximityProps extends HTMLAttributes<HTMLSpanElement> {\n  label: string;\n  fromFontVariationSettings: string;\n  toFontVariationSettings: string;\n  containerRef?: MutableRefObject<HTMLElement | null>;\n  radius?: number;\n  falloff?: 'linear' | 'exponential' | 'gaussian';\n  className?: string;\n  onClick?: () => void;\n  style?: CSSProperties;\n}\n\nexport const VariableProximity = forwardRef<HTMLSpanElement, VariableProximityProps>((props, ref) => {\n  const {\n    label,\n    fromFontVariationSettings,\n    toFontVariationSettings,\n    containerRef,\n    radius = 50,\n    falloff = 'linear',\n    className = '',\n    onClick,\n    style,\n    ...restProps\n  } = props;\n\n  const localRef = useRef<HTMLSpanElement | null>(null);\n  const activeContainerRef = containerRef || localRef;\n  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);\n  const interpolatedSettingsRef = useRef<string[]>([]);\n  const mousePositionRef = useMousePositionRef(activeContainerRef);\n  const lastPositionRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });\n\n  const parsedSettings = useMemo(() => {\n    const parseSettings = (settingsStr: string) =>\n      new Map(\n        settingsStr\n          .split(',')\n          .map(s => s.trim())\n          .map(s => {\n            const [name, value] = s.split(' ');\n            return [name.replace(/['\"]/g, ''), parseFloat(value)];\n          })\n      );\n\n    const fromSettings = parseSettings(fromFontVariationSettings);\n    const toSettings = parseSettings(toFontVariationSettings);\n\n    return Array.from(fromSettings.entries()).map(([axis, fromValue]) => ({\n      axis,\n      fromValue,\n      toValue: toSettings.get(axis) ?? fromValue\n    }));\n  }, [fromFontVariationSettings, toFontVariationSettings]);\n\n  const calculateDistance = (x1: number, y1: number, x2: number, y2: number) =>\n    Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);\n\n  const calculateFalloff = (distance: number) => {\n    const norm = Math.min(Math.max(1 - distance / radius, 0), 1);\n    switch (falloff) {\n      case 'exponential':\n        return norm ** 2;\n      case 'gaussian':\n        return Math.exp(-((distance / (radius / 2)) ** 2) / 2);\n      case 'linear':\n      default:\n        return norm;\n    }\n  };\n\n  useAnimationFrame(() => {\n    const container = activeContainerRef.current;\n    if (!container) return;\n    const { x, y } = mousePositionRef.current;\n    if (lastPositionRef.current.x === x && lastPositionRef.current.y === y) {\n      return;\n    }\n    lastPositionRef.current = { x, y };\n    const containerRect = container.getBoundingClientRect();\n\n    letterRefs.current.forEach((letterRef, index) => {\n      if (!letterRef) return;\n\n      const rect = letterRef.getBoundingClientRect();\n      const letterCenterX = rect.left + rect.width / 2 - containerRect.left;\n      const letterCenterY = rect.top + rect.height / 2 - containerRect.top;\n\n      const distance = calculateDistance(\n        mousePositionRef.current.x,\n        mousePositionRef.current.y,\n        letterCenterX,\n        letterCenterY\n      );\n\n      if (distance >= radius) {\n        letterRef.style.fontVariationSettings = fromFontVariationSettings;\n        return;\n      }\n\n      const falloffValue = calculateFalloff(distance);\n      const newSettings = parsedSettings\n        .map(({ axis, fromValue, toValue }) => {\n          const interpolatedValue = fromValue + (toValue - fromValue) * falloffValue;\n          return `'${axis}' ${interpolatedValue}`;\n        })\n        .join(', ');\n\n      interpolatedSettingsRef.current[index] = newSettings;\n      letterRef.style.fontVariationSettings = newSettings;\n    });\n  });\n\n  const words = label.split(' ');\n  let letterIndex = 0;\n\n  return (\n    <span\n      ref={node => {\n        localRef.current = node;\n        if (typeof ref === 'function') ref(node);\n        else if (ref) (ref as MutableRefObject<HTMLSpanElement | null>).current = node;\n      }}\n        onClick={onClick}\n        style={{\n          display: 'inline',\n          fontFamily: '\"Roboto Flex\", sans-serif',\n          ...style\n        }}\n        className={className}\n        {...restProps}\n      >\n        {words.map((word, wordIndex) => (\n          <span key={wordIndex} className=\"inline-block whitespace-nowrap\">\n            {word.split('').map(letter => {\n              const currentLetterIndex = letterIndex++;\n              return (\n                <motion.span\n                  key={currentLetterIndex}\n                  ref={el => {\n                    letterRefs.current[currentLetterIndex] = el;\n                  }}\n                  style={{\n                    display: 'inline-block',\n                    fontVariationSettings: interpolatedSettingsRef.current[currentLetterIndex] || fromFontVariationSettings\n                  }}\n                  aria-hidden=\"true\"\n                >\n                  {letter}\n                </motion.span>\n              );\n            })}\n            {wordIndex < words.length - 1 && <span className=\"inline-block\">&nbsp;</span>}\n          </span>\n        ))}\n        <span className=\"sr-only\">{label}</span>\n      </span>\n  );\n});\n\nVariableProximity.displayName = 'VariableProximity';\nexport default VariableProximity;",
    "componentSourceJs": "\"use client\";\nimport { forwardRef, useMemo, useRef, useEffect } from 'react';\nimport { motion } from 'motion/react';\nfunction useAnimationFrame(callback) {\n    useEffect(() => {\n        let frameId;\n        const loop = () => {\n            callback();\n            frameId = requestAnimationFrame(loop);\n        };\n        frameId = requestAnimationFrame(loop);\n        return () => cancelAnimationFrame(frameId);\n    }, [callback]);\n}\nfunction useMousePositionRef(containerRef) {\n    const positionRef = useRef({ x: 0, y: 0 });\n    useEffect(() => {\n        const updatePosition = (x, y) => {\n            if (containerRef?.current) {\n                const rect = containerRef.current.getBoundingClientRect();\n                positionRef.current = { x: x - rect.left, y: y - rect.top };\n            }\n            else {\n                positionRef.current = { x, y };\n            }\n        };\n        const handleMouseMove = (ev) => updatePosition(ev.clientX, ev.clientY);\n        const handleTouchMove = (ev) => {\n            const touch = ev.touches[0];\n            updatePosition(touch.clientX, touch.clientY);\n        };\n        window.addEventListener('mousemove', handleMouseMove);\n        window.addEventListener('touchmove', handleTouchMove);\n        return () => {\n            window.removeEventListener('mousemove', handleMouseMove);\n            window.removeEventListener('touchmove', handleTouchMove);\n        };\n    }, [containerRef]);\n    return positionRef;\n}\nexport const VariableProximity = forwardRef((props, ref) => {\n    const { label, fromFontVariationSettings, toFontVariationSettings, containerRef, radius = 50, falloff = 'linear', className = '', onClick, style, ...restProps } = props;\n    const localRef = useRef(null);\n    const activeContainerRef = containerRef || localRef;\n    const letterRefs = useRef([]);\n    const interpolatedSettingsRef = useRef([]);\n    const mousePositionRef = useMousePositionRef(activeContainerRef);\n    const lastPositionRef = useRef({ x: null, y: null });\n    const parsedSettings = useMemo(() => {\n        const parseSettings = (settingsStr) => new Map(settingsStr\n            .split(',')\n            .map(s => s.trim())\n            .map(s => {\n            const [name, value] = s.split(' ');\n            return [name.replace(/['\"]/g, ''), parseFloat(value)];\n        }));\n        const fromSettings = parseSettings(fromFontVariationSettings);\n        const toSettings = parseSettings(toFontVariationSettings);\n        return Array.from(fromSettings.entries()).map(([axis, fromValue]) => ({\n            axis,\n            fromValue,\n            toValue: toSettings.get(axis) ?? fromValue\n        }));\n    }, [fromFontVariationSettings, toFontVariationSettings]);\n    const calculateDistance = (x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);\n    const calculateFalloff = (distance) => {\n        const norm = Math.min(Math.max(1 - distance / radius, 0), 1);\n        switch (falloff) {\n            case 'exponential':\n                return norm ** 2;\n            case 'gaussian':\n                return Math.exp(-((distance / (radius / 2)) ** 2) / 2);\n            case 'linear':\n            default:\n                return norm;\n        }\n    };\n    useAnimationFrame(() => {\n        const container = activeContainerRef.current;\n        if (!container)\n            return;\n        const { x, y } = mousePositionRef.current;\n        if (lastPositionRef.current.x === x && lastPositionRef.current.y === y) {\n            return;\n        }\n        lastPositionRef.current = { x, y };\n        const containerRect = container.getBoundingClientRect();\n        letterRefs.current.forEach((letterRef, index) => {\n            if (!letterRef)\n                return;\n            const rect = letterRef.getBoundingClientRect();\n            const letterCenterX = rect.left + rect.width / 2 - containerRect.left;\n            const letterCenterY = rect.top + rect.height / 2 - containerRect.top;\n            const distance = calculateDistance(mousePositionRef.current.x, mousePositionRef.current.y, letterCenterX, letterCenterY);\n            if (distance >= radius) {\n                letterRef.style.fontVariationSettings = fromFontVariationSettings;\n                return;\n            }\n            const falloffValue = calculateFalloff(distance);\n            const newSettings = parsedSettings\n                .map(({ axis, fromValue, toValue }) => {\n                const interpolatedValue = fromValue + (toValue - fromValue) * falloffValue;\n                return `'${axis}' ${interpolatedValue}`;\n            })\n                .join(', ');\n            interpolatedSettingsRef.current[index] = newSettings;\n            letterRef.style.fontVariationSettings = newSettings;\n        });\n    });\n    const words = label.split(' ');\n    let letterIndex = 0;\n    return (<span ref={node => {\n            localRef.current = node;\n            if (typeof ref === 'function')\n                ref(node);\n            else if (ref)\n                ref.current = node;\n        }} onClick={onClick} style={{\n            display: 'inline',\n            fontFamily: '\"Roboto Flex\", sans-serif',\n            ...style\n        }} className={className} {...restProps}>\n        {words.map((word, wordIndex) => (<span key={wordIndex} className=\"inline-block whitespace-nowrap\">\n            {word.split('').map(letter => {\n                const currentLetterIndex = letterIndex++;\n                return (<motion.span key={currentLetterIndex} ref={el => {\n                        letterRefs.current[currentLetterIndex] = el;\n                    }} style={{\n                        display: 'inline-block',\n                        fontVariationSettings: interpolatedSettingsRef.current[currentLetterIndex] || fromFontVariationSettings\n                    }} aria-hidden=\"true\">\n                  {letter}\n                </motion.span>);\n            })}\n            {wordIndex < words.length - 1 && <span className=\"inline-block\">&nbsp;</span>}\n          </span>))}\n        <span className=\"sr-only\">{label}</span>\n      </span>);\n});\nVariableProximity.displayName = 'VariableProximity';\nexport default VariableProximity;",
    "props": [
      {
        "name": "label",
        "type": "string",
        "default": "-",
        "description": "Controls the label for the component animation."
      },
      {
        "name": "fromFontVariationSettings",
        "type": "string",
        "default": "-",
        "description": "Controls the from font variation settings for the component animation."
      },
      {
        "name": "toFontVariationSettings",
        "type": "string",
        "default": "-",
        "description": "Controls the to font variation settings for the component animation."
      },
      {
        "name": "containerRef",
        "type": "MutableRefObject<HTMLElement | null>",
        "default": "-",
        "description": "Controls the container ref for the component animation."
      },
      {
        "name": "radius",
        "type": "number",
        "default": "-",
        "description": "Effect calculation radius in pixels from cursor position."
      },
      {
        "name": "falloff",
        "type": "'linear' | 'exponential' | 'gaussian'",
        "default": "-",
        "description": "Falloff curve calculation mode ('linear', 'exponential', 'gaussian')."
      },
      {
        "name": "className",
        "type": "string",
        "default": "-",
        "description": "Additional CSS classes for styling and layout."
      },
      {
        "name": "onClick",
        "type": "() => void",
        "default": "-",
        "description": "Controls the on click for the component animation."
      },
      {
        "name": "style",
        "type": "CSSProperties",
        "default": "-",
        "description": "Controls the style for the component animation."
      }
    ]
  },
  "warp-text": {
    "slug": "warp-text",
    "name": "Warp Text",
    "description": "High-performance WebGL liquid ripple and sine wave distortion shader warping text rendered via OGL.",
    "dependencies": {
      "ogl": "^1.0.11"
    },
    "installation": {
      "cliTs": "npx kibo add warp-text",
      "cliJs": "npx kibo add warp-text --js",
      "npm": "npm i ogl",
      "pnpm": "pnpm add ogl",
      "yarn": "yarn add ogl",
      "bun": "bun add ogl"
    },
    "usageTs": "import { WarpText } from \"@/components/kibo/warp-text/component\";\n\nexport default function Example() {\n  return (\n    <WarpText />\n  );\n}",
    "usageJs": "import { WarpText } from \"@/components/kibo/warp-text/component\";\nexport default function Example() {\n    return (<WarpText />);\n}",
    "componentSourceTs": "\"use client\";\n\nimport { useEffect, useRef, type CSSProperties } from 'react';\nimport { Renderer, Program, Mesh, Triangle, Texture, type OGLRenderingContext } from 'ogl';\n\nexport interface Props {\n  text?: string;\n  color?: string;\n  warpStrength?: number;\n  warpScale?: number;\n  speed?: number;\n  pointerInfluence?: number;\n  pointerStrength?: number;\n  refraction?: number;\n  ripple?: boolean;\n  fontSize?: string | number;\n  fontWeight?: string | number;\n  fontFamily?: string;\n  letterSpacing?: string | number;\n  lineHeight?: string | number;\n  className?: string;\n  style?: CSSProperties;\n}\n\ninterface RuntimeProps {\n  text: string;\n  color: string;\n  fontSize: string | number;\n  fontWeight: string | number;\n  fontFamily: string;\n  letterSpacing: string | number;\n  lineHeight: string | number;\n  warpStrength: number;\n  warpScale: number;\n  speed: number;\n  pointerInfluence: number;\n  pointerStrength: number;\n  refraction: number;\n  ripple: boolean;\n}\n\ninterface RuntimeContext {\n  program: Program;\n  rasterize: () => void;\n}\n\ninterface BuildTextCanvasArgs {\n  container: HTMLElement;\n  width: number;\n  height: number;\n  dpr: number;\n  props: RuntimeProps;\n}\n\nconst vertex = `#version 300 es\nin vec2 position;\nin vec2 uv;\nout vec2 vUv;\nvoid main() {\n  vUv = uv;\n  gl_Position = vec4(position, 0.0, 1.0);\n}\n`;\n\nconst fragment = `#version 300 es\nprecision highp float;\n\nuniform sampler2D uTextTexture;\nuniform vec2 uResolution;\nuniform vec2 uPointer;\nuniform float uPointerActive;\nuniform float uTime;\nuniform float uWarpStrength;\nuniform float uWarpScale;\nuniform float uSpeed;\nuniform float uPointerInfluence;\nuniform float uPointerStrength;\nuniform float uRefraction;\nuniform float uRipple;\nuniform float uMotion;\n\nin vec2 vUv;\nout vec4 fragColor;\n\nfloat hash(vec2 p) {\n  p = fract(p * vec2(123.34, 456.21));\n  p += dot(p, p + 45.32);\n  return fract(p.x * p.y);\n}\n\nfloat noise(vec2 p) {\n  vec2 i = floor(p);\n  vec2 f = fract(p);\n  vec2 u = f * f * (3.0 - 2.0 * f);\n\n  float a = hash(i);\n  float b = hash(i + vec2(1.0, 0.0));\n  float c = hash(i + vec2(0.0, 1.0));\n  float d = hash(i + vec2(1.0, 1.0));\n\n  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);\n}\n\nfloat fbm(vec2 p) {\n  float value = 0.0;\n  float amplitude = 0.5;\n  for (int i = 0; i < 4; i++) {\n    value += amplitude * noise(p);\n    p *= 2.02;\n    amplitude *= 0.5;\n  }\n  return value;\n}\n\nvec4 sampleText(vec2 uv) {\n  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {\n    return vec4(0.0);\n  }\n  return texture(uTextTexture, uv);\n}\n\nvoid main() {\n  vec2 uv = vUv;\n  float aspect = uResolution.x / max(uResolution.y, 1.0);\n  float time = uTime * uSpeed;\n  float scale = max(uWarpScale, 0.001);\n\n  vec2 drift = vec2(time * 0.055, -time * 0.045);\n  float n1 = fbm(uv * scale * 3.1 + drift);\n  float n2 = fbm((uv + 19.17) * scale * 3.4 - drift.yx);\n  vec2 ambient = (vec2(n1, n2) - 0.5) * uWarpStrength * 0.045 * uMotion;\n\n  vec2 pointerDelta = uv - uPointer;\n  vec2 aspectDelta = vec2(pointerDelta.x * aspect, pointerDelta.y);\n  float dist = length(aspectDelta);\n  float radius = max(uPointerInfluence, 0.001);\n  float t = clamp(dist / radius, 0.0, 1.0);\n  float lens = smoothstep(radius, 0.0, dist) * uPointerActive;\n  float bulge = t * (1.0 - t) * (1.0 - t) * 6.75 * uPointerActive;\n  vec2 dir = dist > 0.0001 ? vec2(aspectDelta.x / aspect, aspectDelta.y) / dist : vec2(0.0);\n\n  float rippleWave = sin(dist * 28.0 - time * 4.2) * 0.5 + 0.5;\n  float rippleRing = (rippleWave - 0.5) * uRipple;\n  vec2 pointerWarp = -dir * bulge * uPointerStrength * 0.045;\n  pointerWarp += dir * rippleRing * bulge * uPointerStrength * 0.016;\n\n  vec2 displaced = uv + ambient + pointerWarp;\n  vec2 splitDir = ambient + pointerWarp;\n  float splitLen = length(splitDir);\n  splitDir = splitLen > 0.00001 ? splitDir / splitLen : vec2(0.7071, 0.7071);\n  vec2 split = splitDir * uRefraction * 0.16 * (0.35 + lens * 1.65);\n\n  vec4 base = sampleText(displaced);\n  float r = sampleText(displaced + split).r;\n  float g = base.g;\n  float b = sampleText(displaced - split).b;\n  float a = max(max(sampleText(displaced + split).a, base.a), sampleText(displaced - split).a);\n\n  vec3 color = vec3(r, g, b) + lens * base.a * 0.055;\n  fragColor = vec4(color, a);\n}\n`;\n\nconst getFontValue = (value: string | number): string => (typeof value === 'number' ? `${value}px` : value);\n\nconst measureLine = (ctx: CanvasRenderingContext2D, line: string, letterSpacing: number): number => {\n  const chars = Array.from(line);\n  const textWidth = chars.reduce((width, char) => width + ctx.measureText(char).width, 0);\n  return textWidth + Math.max(0, chars.length - 1) * letterSpacing;\n};\n\nconst drawLine = (ctx: CanvasRenderingContext2D, line: string, x: number, y: number, letterSpacing: number): void => {\n  const chars = Array.from(line);\n  let cursor = x - measureLine(ctx, line, letterSpacing) / 2;\n\n  chars.forEach((char, index) => {\n    ctx.fillText(char, cursor, y);\n    cursor += ctx.measureText(char).width + (index === chars.length - 1 ? 0 : letterSpacing);\n  });\n};\n\nconst buildTextCanvas = ({ container, width, height, dpr, props }: BuildTextCanvasArgs): HTMLCanvasElement => {\n  const canvas = document.createElement('canvas');\n  canvas.width = Math.max(1, Math.floor(width * dpr));\n  canvas.height = Math.max(1, Math.floor(height * dpr));\n\n  const ctx = canvas.getContext('2d');\n  if (!ctx) return canvas;\n\n  const probe = document.createElement('span');\n  probe.textContent = props.text;\n  Object.assign(probe.style, {\n    position: 'absolute',\n    visibility: 'hidden',\n    pointerEvents: 'none',\n    whiteSpace: 'pre',\n    inset: '0 auto auto 0',\n    fontFamily: props.fontFamily,\n    fontSize: getFontValue(props.fontSize),\n    fontWeight: String(props.fontWeight),\n    letterSpacing: getFontValue(props.letterSpacing),\n    lineHeight: typeof props.lineHeight === 'number' ? String(props.lineHeight) : props.lineHeight\n  });\n  container.appendChild(probe);\n  const computed = window.getComputedStyle(probe);\n  let fontSizePx = parseFloat(computed.fontSize) || 96;\n  const fontFamily = computed.fontFamily || 'sans-serif';\n  const fontWeight = computed.fontWeight || String(props.fontWeight);\n  let letterSpacing = computed.letterSpacing === 'normal' ? 0 : parseFloat(computed.letterSpacing) || 0;\n  let lineHeight = parseFloat(computed.lineHeight);\n  if (!Number.isFinite(lineHeight)) {\n    lineHeight = fontSizePx * (typeof props.lineHeight === 'number' ? props.lineHeight : 0.92);\n  }\n  probe.remove();\n\n  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);\n  ctx.clearRect(0, 0, width, height);\n  ctx.textAlign = 'left';\n  ctx.textBaseline = 'middle';\n  ctx.fillStyle = props.color;\n  ctx.imageSmoothingEnabled = true;\n  ctx.imageSmoothingQuality = 'high';\n\n  const lines = String(props.text || '').split('\\n');\n  const applyFont = () => {\n    ctx.font = `${fontWeight} ${fontSizePx}px ${fontFamily}`;\n  };\n  applyFont();\n\n  const maxWidth = width * 0.86;\n  const maxHeight = height * 0.78;\n  const widest = Math.max(...lines.map(line => measureLine(ctx, line, letterSpacing)), 1);\n  const blockHeight = Math.max(lineHeight * lines.length, 1);\n  const fit = Math.min(1, maxWidth / widest, maxHeight / blockHeight);\n\n  if (fit < 1) {\n    fontSizePx *= fit;\n    letterSpacing *= fit;\n    lineHeight *= fit;\n    applyFont();\n  }\n\n  const startY = height / 2 - (lineHeight * (lines.length - 1)) / 2;\n  lines.forEach((line, index) => drawLine(ctx, line, width / 2, startY + index * lineHeight, letterSpacing));\n\n  return canvas;\n};\n\nconst syncUniforms = (program: Program, props: RuntimeProps): void => {\n  const uniforms = program.uniforms;\n  uniforms.uWarpStrength.value = props.warpStrength;\n  uniforms.uWarpScale.value = props.warpScale;\n  uniforms.uSpeed.value = props.speed;\n  uniforms.uPointerInfluence.value = props.pointerInfluence;\n  uniforms.uPointerStrength.value = props.pointerStrength;\n  uniforms.uRefraction.value = props.refraction;\n  uniforms.uRipple.value = props.ripple ? 1 : 0;\n};\n\nexport const WarpText = ({\n  text = 'Bend the moment',\n  color = '#f8f5ff',\n  warpStrength = 0.08,\n  warpScale = 1.7,\n  speed = 0.55,\n  pointerInfluence = 0.42,\n  pointerStrength = 0.38,\n  refraction = 0.018,\n  ripple = true,\n  fontSize = 'clamp(3rem, 10vw, 9rem)',\n  fontWeight = 800,\n  fontFamily = 'inherit',\n  letterSpacing = '-0.06em',\n  lineHeight = 0.9,\n  className = '',\n  style\n}: Props) => {\n  const containerRef = useRef<HTMLDivElement | null>(null);\n  const propsRef = useRef<RuntimeProps>({\n    text,\n    color,\n    fontSize,\n    fontWeight,\n    fontFamily,\n    letterSpacing,\n    lineHeight,\n    warpStrength,\n    warpScale,\n    speed,\n    pointerInfluence,\n    pointerStrength,\n    refraction,\n    ripple\n  });\n  const contextRef = useRef<RuntimeContext | null>(null);\n\n  useEffect(() => {\n    propsRef.current = {\n      text,\n      color,\n      fontSize,\n      fontWeight,\n      fontFamily,\n      letterSpacing,\n      lineHeight,\n      warpStrength,\n      warpScale,\n      speed,\n      pointerInfluence,\n      pointerStrength,\n      refraction,\n      ripple\n    };\n\n    if (contextRef.current) {\n      syncUniforms(contextRef.current.program, propsRef.current);\n      contextRef.current.rasterize();\n    }\n  }, [\n    text,\n    color,\n    fontSize,\n    fontWeight,\n    fontFamily,\n    letterSpacing,\n    lineHeight,\n    warpStrength,\n    warpScale,\n    speed,\n    pointerInfluence,\n    pointerStrength,\n    refraction,\n    ripple\n  ]);\n\n  useEffect(() => {\n    const container = containerRef.current;\n    if (!container || typeof window === 'undefined') return undefined;\n\n    let renderer: Renderer;\n    let gl: OGLRenderingContext;\n    let program: Program;\n    let geometry: Triangle;\n    let mesh: Mesh;\n    let texture: Texture;\n    let resizeObserver: ResizeObserver | null = null;\n    let intersectionObserver: IntersectionObserver | null = null;\n    let raf = 0;\n    let disposed = false;\n    let contextLost = false;\n    let visible = true;\n    let pageVisible = !document.hidden;\n    let reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;\n    let rasterVersion = 0;\n\n    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, active: 0, activeTarget: 0 };\n    const startTime = performance.now();\n\n    try {\n      renderer = new Renderer({\n        webgl: 2,\n        alpha: true,\n        premultipliedAlpha: false,\n        antialias: true,\n        dpr: Math.min(window.devicePixelRatio || 1, 2)\n      });\n      gl = renderer.gl;\n    } catch (error) {\n      console.warn('WarpText: WebGL could not be initialized.', error);\n      return undefined;\n    }\n\n    gl.clearColor(0, 0, 0, 0);\n    const canvas = gl.canvas;\n    canvas.style.position = 'absolute';\n    canvas.style.inset = '0';\n    canvas.style.width = '100%';\n    canvas.style.height = '100%';\n    canvas.style.display = 'block';\n    canvas.setAttribute('aria-hidden', 'true');\n    container.appendChild(canvas);\n\n    texture = new Texture(gl, {\n      generateMipmaps: false,\n      minFilter: gl.LINEAR,\n      magFilter: gl.LINEAR,\n      wrapS: gl.CLAMP_TO_EDGE,\n      wrapT: gl.CLAMP_TO_EDGE\n    });\n\n    geometry = new Triangle(gl);\n    program = new Program(gl, {\n      vertex,\n      fragment,\n      transparent: true,\n      depthTest: false,\n      depthWrite: false,\n      uniforms: {\n        uTextTexture: { value: texture },\n        uResolution: { value: new Float32Array([1, 1]) },\n        uPointer: { value: new Float32Array([0.5, 0.5]) },\n        uPointerActive: { value: 0 },\n        uTime: { value: 0 },\n        uWarpStrength: { value: propsRef.current.warpStrength },\n        uWarpScale: { value: propsRef.current.warpScale },\n        uSpeed: { value: propsRef.current.speed },\n        uPointerInfluence: { value: propsRef.current.pointerInfluence },\n        uPointerStrength: { value: propsRef.current.pointerStrength },\n        uRefraction: { value: propsRef.current.refraction },\n        uRipple: { value: propsRef.current.ripple ? 1 : 0 },\n        uMotion: { value: reduceMotion ? 0 : 1 }\n      }\n    });\n    mesh = new Mesh(gl, { geometry, program });\n\n    const renderOnce = () => {\n      if (disposed || contextLost) return;\n      renderer.render({ scene: mesh });\n    };\n\n    const rasterize = async () => {\n      const version = ++rasterVersion;\n      if (document.fonts?.ready) {\n        try {\n          await document.fonts.ready;\n        } catch {}\n      }\n      if (disposed || contextLost || version !== rasterVersion) return;\n\n      const rect = container.getBoundingClientRect();\n      if (rect.width <= 0 || rect.height <= 0) return;\n\n      const dpr = Math.min(window.devicePixelRatio || 1, 2);\n      const textCanvas = buildTextCanvas({\n        container,\n        width: rect.width,\n        height: rect.height,\n        dpr,\n        props: propsRef.current\n      });\n      texture.image = textCanvas;\n      texture.needsUpdate = true;\n      renderOnce();\n    };\n\n    const resize = () => {\n      if (disposed || contextLost) return;\n      const rect = container.getBoundingClientRect();\n      if (rect.width <= 0 || rect.height <= 0) return;\n\n      renderer.dpr = Math.min(window.devicePixelRatio || 1, 2);\n      renderer.setSize(rect.width, rect.height);\n      program.uniforms.uResolution.value[0] = gl.drawingBufferWidth;\n      program.uniforms.uResolution.value[1] = gl.drawingBufferHeight;\n      rasterize();\n    };\n\n    const onPointerMove = (event: PointerEvent): void => {\n      if (event.pointerType === 'touch') return;\n      const rect = canvas.getBoundingClientRect();\n      if (rect.width <= 0 || rect.height <= 0) return;\n      pointer.tx = (event.clientX - rect.left) / rect.width;\n      pointer.ty = 1 - (event.clientY - rect.top) / rect.height;\n      pointer.activeTarget = 1;\n    };\n\n    const onPointerLeave = (): void => {\n      pointer.activeTarget = 0;\n    };\n\n    const onContextLost = (event: Event): void => {\n      event.preventDefault();\n      contextLost = true;\n      if (raf) cancelAnimationFrame(raf);\n      raf = 0;\n    };\n\n    const onVisibility = (): void => {\n      pageVisible = !document.hidden;\n      if (pageVisible && visible && !raf) raf = requestAnimationFrame(loop);\n      if (!pageVisible && raf) {\n        cancelAnimationFrame(raf);\n        raf = 0;\n      }\n    };\n\n    const mediaQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');\n    const onReducedMotion = (event: MediaQueryListEvent): void => {\n      reduceMotion = event.matches;\n      program.uniforms.uMotion.value = reduceMotion ? 0 : 1;\n      renderOnce();\n    };\n\n    const loop = (now: number): void => {\n      if (disposed || contextLost) return;\n\n      const elapsed = (now - startTime) * 0.001;\n      const idleX = 0.5 + Math.sin(elapsed * 0.33) * 0.12;\n      const idleY = 0.5 + Math.cos(elapsed * 0.27) * 0.1;\n      const targetX = pointer.activeTarget > 0 ? pointer.tx : idleX;\n      const targetY = pointer.activeTarget > 0 ? pointer.ty : idleY;\n      const damping = pointer.activeTarget > 0 ? 0.12 : 0.035;\n\n      pointer.x += (targetX - pointer.x) * damping;\n      pointer.y += (targetY - pointer.y) * damping;\n      pointer.active += ((pointer.activeTarget > 0 ? 1 : 0.18) - pointer.active) * 0.06;\n\n      program.uniforms.uPointer.value[0] = pointer.x;\n      program.uniforms.uPointer.value[1] = pointer.y;\n      program.uniforms.uPointerActive.value = reduceMotion ? pointer.active * 0.35 : pointer.active;\n      program.uniforms.uTime.value = reduceMotion ? 0 : elapsed;\n\n      renderOnce();\n      raf = requestAnimationFrame(loop);\n    };\n\n    resizeObserver = new ResizeObserver(resize);\n    resizeObserver.observe(container);\n\n    intersectionObserver = new IntersectionObserver(\n      ([entry]: IntersectionObserverEntry[]) => {\n        visible = entry.isIntersecting;\n        if (visible && pageVisible && !raf) raf = requestAnimationFrame(loop);\n        if (!visible && raf) {\n          cancelAnimationFrame(raf);\n          raf = 0;\n        }\n      },\n      { threshold: 0 }\n    );\n    intersectionObserver.observe(container);\n\n    canvas.addEventListener('pointermove', onPointerMove);\n    canvas.addEventListener('pointerleave', onPointerLeave);\n    canvas.addEventListener('webglcontextlost', onContextLost, false);\n    document.addEventListener('visibilitychange', onVisibility);\n    mediaQuery?.addEventListener('change', onReducedMotion);\n\n    syncUniforms(program, propsRef.current);\n    contextRef.current = { program, rasterize };\n    resize();\n    raf = requestAnimationFrame(loop);\n\n    return () => {\n      disposed = true;\n      contextRef.current = null;\n      if (raf) cancelAnimationFrame(raf);\n      resizeObserver?.disconnect();\n      intersectionObserver?.disconnect();\n      canvas.removeEventListener('pointermove', onPointerMove);\n      canvas.removeEventListener('pointerleave', onPointerLeave);\n      canvas.removeEventListener('webglcontextlost', onContextLost);\n      document.removeEventListener('visibilitychange', onVisibility);\n      mediaQuery?.removeEventListener('change', onReducedMotion);\n\n      if (!contextLost) {\n        try {\n          if (texture?.texture) gl.deleteTexture(texture.texture);\n          geometry?.remove?.();\n          program?.remove?.();\n          gl.getExtension('WEBGL_lose_context')?.loseContext();\n        } catch {}\n      }\n\n      if (canvas.parentNode === container) container.removeChild(canvas);\n    };\n  }, []);\n\n  return (\n    <div\n      ref={containerRef}\n      className={`relative block min-h-[220px] w-full overflow-hidden isolate ${className}`.trim()}\n      style={style}\n      role=\"img\"\n      aria-label={text}\n    />\n  );\n};\n\nexport default WarpText;\nexport type WarpTextProps = Props;\n",
    "componentSourceJs": "\"use client\";\nimport { useEffect, useRef } from 'react';\nimport { Renderer, Program, Mesh, Triangle, Texture } from 'ogl';\nconst vertex = `#version 300 es\nin vec2 position;\nin vec2 uv;\nout vec2 vUv;\nvoid main() {\n  vUv = uv;\n  gl_Position = vec4(position, 0.0, 1.0);\n}\n`;\nconst fragment = `#version 300 es\nprecision highp float;\n\nuniform sampler2D uTextTexture;\nuniform vec2 uResolution;\nuniform vec2 uPointer;\nuniform float uPointerActive;\nuniform float uTime;\nuniform float uWarpStrength;\nuniform float uWarpScale;\nuniform float uSpeed;\nuniform float uPointerInfluence;\nuniform float uPointerStrength;\nuniform float uRefraction;\nuniform float uRipple;\nuniform float uMotion;\n\nin vec2 vUv;\nout vec4 fragColor;\n\nfloat hash(vec2 p) {\n  p = fract(p * vec2(123.34, 456.21));\n  p += dot(p, p + 45.32);\n  return fract(p.x * p.y);\n}\n\nfloat noise(vec2 p) {\n  vec2 i = floor(p);\n  vec2 f = fract(p);\n  vec2 u = f * f * (3.0 - 2.0 * f);\n\n  float a = hash(i);\n  float b = hash(i + vec2(1.0, 0.0));\n  float c = hash(i + vec2(0.0, 1.0));\n  float d = hash(i + vec2(1.0, 1.0));\n\n  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);\n}\n\nfloat fbm(vec2 p) {\n  float value = 0.0;\n  float amplitude = 0.5;\n  for (int i = 0; i < 4; i++) {\n    value += amplitude * noise(p);\n    p *= 2.02;\n    amplitude *= 0.5;\n  }\n  return value;\n}\n\nvec4 sampleText(vec2 uv) {\n  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {\n    return vec4(0.0);\n  }\n  return texture(uTextTexture, uv);\n}\n\nvoid main() {\n  vec2 uv = vUv;\n  float aspect = uResolution.x / max(uResolution.y, 1.0);\n  float time = uTime * uSpeed;\n  float scale = max(uWarpScale, 0.001);\n\n  vec2 drift = vec2(time * 0.055, -time * 0.045);\n  float n1 = fbm(uv * scale * 3.1 + drift);\n  float n2 = fbm((uv + 19.17) * scale * 3.4 - drift.yx);\n  vec2 ambient = (vec2(n1, n2) - 0.5) * uWarpStrength * 0.045 * uMotion;\n\n  vec2 pointerDelta = uv - uPointer;\n  vec2 aspectDelta = vec2(pointerDelta.x * aspect, pointerDelta.y);\n  float dist = length(aspectDelta);\n  float radius = max(uPointerInfluence, 0.001);\n  float t = clamp(dist / radius, 0.0, 1.0);\n  float lens = smoothstep(radius, 0.0, dist) * uPointerActive;\n  float bulge = t * (1.0 - t) * (1.0 - t) * 6.75 * uPointerActive;\n  vec2 dir = dist > 0.0001 ? vec2(aspectDelta.x / aspect, aspectDelta.y) / dist : vec2(0.0);\n\n  float rippleWave = sin(dist * 28.0 - time * 4.2) * 0.5 + 0.5;\n  float rippleRing = (rippleWave - 0.5) * uRipple;\n  vec2 pointerWarp = -dir * bulge * uPointerStrength * 0.045;\n  pointerWarp += dir * rippleRing * bulge * uPointerStrength * 0.016;\n\n  vec2 displaced = uv + ambient + pointerWarp;\n  vec2 splitDir = ambient + pointerWarp;\n  float splitLen = length(splitDir);\n  splitDir = splitLen > 0.00001 ? splitDir / splitLen : vec2(0.7071, 0.7071);\n  vec2 split = splitDir * uRefraction * 0.16 * (0.35 + lens * 1.65);\n\n  vec4 base = sampleText(displaced);\n  float r = sampleText(displaced + split).r;\n  float g = base.g;\n  float b = sampleText(displaced - split).b;\n  float a = max(max(sampleText(displaced + split).a, base.a), sampleText(displaced - split).a);\n\n  vec3 color = vec3(r, g, b) + lens * base.a * 0.055;\n  fragColor = vec4(color, a);\n}\n`;\nconst getFontValue = (value) => (typeof value === 'number' ? `${value}px` : value);\nconst measureLine = (ctx, line, letterSpacing) => {\n    const chars = Array.from(line);\n    const textWidth = chars.reduce((width, char) => width + ctx.measureText(char).width, 0);\n    return textWidth + Math.max(0, chars.length - 1) * letterSpacing;\n};\nconst drawLine = (ctx, line, x, y, letterSpacing) => {\n    const chars = Array.from(line);\n    let cursor = x - measureLine(ctx, line, letterSpacing) / 2;\n    chars.forEach((char, index) => {\n        ctx.fillText(char, cursor, y);\n        cursor += ctx.measureText(char).width + (index === chars.length - 1 ? 0 : letterSpacing);\n    });\n};\nconst buildTextCanvas = ({ container, width, height, dpr, props }) => {\n    const canvas = document.createElement('canvas');\n    canvas.width = Math.max(1, Math.floor(width * dpr));\n    canvas.height = Math.max(1, Math.floor(height * dpr));\n    const ctx = canvas.getContext('2d');\n    if (!ctx)\n        return canvas;\n    const probe = document.createElement('span');\n    probe.textContent = props.text;\n    Object.assign(probe.style, {\n        position: 'absolute',\n        visibility: 'hidden',\n        pointerEvents: 'none',\n        whiteSpace: 'pre',\n        inset: '0 auto auto 0',\n        fontFamily: props.fontFamily,\n        fontSize: getFontValue(props.fontSize),\n        fontWeight: String(props.fontWeight),\n        letterSpacing: getFontValue(props.letterSpacing),\n        lineHeight: typeof props.lineHeight === 'number' ? String(props.lineHeight) : props.lineHeight\n    });\n    container.appendChild(probe);\n    const computed = window.getComputedStyle(probe);\n    let fontSizePx = parseFloat(computed.fontSize) || 96;\n    const fontFamily = computed.fontFamily || 'sans-serif';\n    const fontWeight = computed.fontWeight || String(props.fontWeight);\n    let letterSpacing = computed.letterSpacing === 'normal' ? 0 : parseFloat(computed.letterSpacing) || 0;\n    let lineHeight = parseFloat(computed.lineHeight);\n    if (!Number.isFinite(lineHeight)) {\n        lineHeight = fontSizePx * (typeof props.lineHeight === 'number' ? props.lineHeight : 0.92);\n    }\n    probe.remove();\n    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);\n    ctx.clearRect(0, 0, width, height);\n    ctx.textAlign = 'left';\n    ctx.textBaseline = 'middle';\n    ctx.fillStyle = props.color;\n    ctx.imageSmoothingEnabled = true;\n    ctx.imageSmoothingQuality = 'high';\n    const lines = String(props.text || '').split('\\n');\n    const applyFont = () => {\n        ctx.font = `${fontWeight} ${fontSizePx}px ${fontFamily}`;\n    };\n    applyFont();\n    const maxWidth = width * 0.86;\n    const maxHeight = height * 0.78;\n    const widest = Math.max(...lines.map(line => measureLine(ctx, line, letterSpacing)), 1);\n    const blockHeight = Math.max(lineHeight * lines.length, 1);\n    const fit = Math.min(1, maxWidth / widest, maxHeight / blockHeight);\n    if (fit < 1) {\n        fontSizePx *= fit;\n        letterSpacing *= fit;\n        lineHeight *= fit;\n        applyFont();\n    }\n    const startY = height / 2 - (lineHeight * (lines.length - 1)) / 2;\n    lines.forEach((line, index) => drawLine(ctx, line, width / 2, startY + index * lineHeight, letterSpacing));\n    return canvas;\n};\nconst syncUniforms = (program, props) => {\n    const uniforms = program.uniforms;\n    uniforms.uWarpStrength.value = props.warpStrength;\n    uniforms.uWarpScale.value = props.warpScale;\n    uniforms.uSpeed.value = props.speed;\n    uniforms.uPointerInfluence.value = props.pointerInfluence;\n    uniforms.uPointerStrength.value = props.pointerStrength;\n    uniforms.uRefraction.value = props.refraction;\n    uniforms.uRipple.value = props.ripple ? 1 : 0;\n};\nexport const WarpText = ({ text = 'Bend the moment', color = '#f8f5ff', warpStrength = 0.08, warpScale = 1.7, speed = 0.55, pointerInfluence = 0.42, pointerStrength = 0.38, refraction = 0.018, ripple = true, fontSize = 'clamp(3rem, 10vw, 9rem)', fontWeight = 800, fontFamily = 'inherit', letterSpacing = '-0.06em', lineHeight = 0.9, className = '', style }) => {\n    const containerRef = useRef(null);\n    const propsRef = useRef({\n        text,\n        color,\n        fontSize,\n        fontWeight,\n        fontFamily,\n        letterSpacing,\n        lineHeight,\n        warpStrength,\n        warpScale,\n        speed,\n        pointerInfluence,\n        pointerStrength,\n        refraction,\n        ripple\n    });\n    const contextRef = useRef(null);\n    useEffect(() => {\n        propsRef.current = {\n            text,\n            color,\n            fontSize,\n            fontWeight,\n            fontFamily,\n            letterSpacing,\n            lineHeight,\n            warpStrength,\n            warpScale,\n            speed,\n            pointerInfluence,\n            pointerStrength,\n            refraction,\n            ripple\n        };\n        if (contextRef.current) {\n            syncUniforms(contextRef.current.program, propsRef.current);\n            contextRef.current.rasterize();\n        }\n    }, [\n        text,\n        color,\n        fontSize,\n        fontWeight,\n        fontFamily,\n        letterSpacing,\n        lineHeight,\n        warpStrength,\n        warpScale,\n        speed,\n        pointerInfluence,\n        pointerStrength,\n        refraction,\n        ripple\n    ]);\n    useEffect(() => {\n        const container = containerRef.current;\n        if (!container || typeof window === 'undefined')\n            return undefined;\n        let renderer;\n        let gl;\n        let program;\n        let geometry;\n        let mesh;\n        let texture;\n        let resizeObserver = null;\n        let intersectionObserver = null;\n        let raf = 0;\n        let disposed = false;\n        let contextLost = false;\n        let visible = true;\n        let pageVisible = !document.hidden;\n        let reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;\n        let rasterVersion = 0;\n        const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, active: 0, activeTarget: 0 };\n        const startTime = performance.now();\n        try {\n            renderer = new Renderer({\n                webgl: 2,\n                alpha: true,\n                premultipliedAlpha: false,\n                antialias: true,\n                dpr: Math.min(window.devicePixelRatio || 1, 2)\n            });\n            gl = renderer.gl;\n        }\n        catch (error) {\n            console.warn('WarpText: WebGL could not be initialized.', error);\n            return undefined;\n        }\n        gl.clearColor(0, 0, 0, 0);\n        const canvas = gl.canvas;\n        canvas.style.position = 'absolute';\n        canvas.style.inset = '0';\n        canvas.style.width = '100%';\n        canvas.style.height = '100%';\n        canvas.style.display = 'block';\n        canvas.setAttribute('aria-hidden', 'true');\n        container.appendChild(canvas);\n        texture = new Texture(gl, {\n            generateMipmaps: false,\n            minFilter: gl.LINEAR,\n            magFilter: gl.LINEAR,\n            wrapS: gl.CLAMP_TO_EDGE,\n            wrapT: gl.CLAMP_TO_EDGE\n        });\n        geometry = new Triangle(gl);\n        program = new Program(gl, {\n            vertex,\n            fragment,\n            transparent: true,\n            depthTest: false,\n            depthWrite: false,\n            uniforms: {\n                uTextTexture: { value: texture },\n                uResolution: { value: new Float32Array([1, 1]) },\n                uPointer: { value: new Float32Array([0.5, 0.5]) },\n                uPointerActive: { value: 0 },\n                uTime: { value: 0 },\n                uWarpStrength: { value: propsRef.current.warpStrength },\n                uWarpScale: { value: propsRef.current.warpScale },\n                uSpeed: { value: propsRef.current.speed },\n                uPointerInfluence: { value: propsRef.current.pointerInfluence },\n                uPointerStrength: { value: propsRef.current.pointerStrength },\n                uRefraction: { value: propsRef.current.refraction },\n                uRipple: { value: propsRef.current.ripple ? 1 : 0 },\n                uMotion: { value: reduceMotion ? 0 : 1 }\n            }\n        });\n        mesh = new Mesh(gl, { geometry, program });\n        const renderOnce = () => {\n            if (disposed || contextLost)\n                return;\n            renderer.render({ scene: mesh });\n        };\n        const rasterize = async () => {\n            const version = ++rasterVersion;\n            if (document.fonts?.ready) {\n                try {\n                    await document.fonts.ready;\n                }\n                catch { }\n            }\n            if (disposed || contextLost || version !== rasterVersion)\n                return;\n            const rect = container.getBoundingClientRect();\n            if (rect.width <= 0 || rect.height <= 0)\n                return;\n            const dpr = Math.min(window.devicePixelRatio || 1, 2);\n            const textCanvas = buildTextCanvas({\n                container,\n                width: rect.width,\n                height: rect.height,\n                dpr,\n                props: propsRef.current\n            });\n            texture.image = textCanvas;\n            texture.needsUpdate = true;\n            renderOnce();\n        };\n        const resize = () => {\n            if (disposed || contextLost)\n                return;\n            const rect = container.getBoundingClientRect();\n            if (rect.width <= 0 || rect.height <= 0)\n                return;\n            renderer.dpr = Math.min(window.devicePixelRatio || 1, 2);\n            renderer.setSize(rect.width, rect.height);\n            program.uniforms.uResolution.value[0] = gl.drawingBufferWidth;\n            program.uniforms.uResolution.value[1] = gl.drawingBufferHeight;\n            rasterize();\n        };\n        const onPointerMove = (event) => {\n            if (event.pointerType === 'touch')\n                return;\n            const rect = canvas.getBoundingClientRect();\n            if (rect.width <= 0 || rect.height <= 0)\n                return;\n            pointer.tx = (event.clientX - rect.left) / rect.width;\n            pointer.ty = 1 - (event.clientY - rect.top) / rect.height;\n            pointer.activeTarget = 1;\n        };\n        const onPointerLeave = () => {\n            pointer.activeTarget = 0;\n        };\n        const onContextLost = (event) => {\n            event.preventDefault();\n            contextLost = true;\n            if (raf)\n                cancelAnimationFrame(raf);\n            raf = 0;\n        };\n        const onVisibility = () => {\n            pageVisible = !document.hidden;\n            if (pageVisible && visible && !raf)\n                raf = requestAnimationFrame(loop);\n            if (!pageVisible && raf) {\n                cancelAnimationFrame(raf);\n                raf = 0;\n            }\n        };\n        const mediaQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');\n        const onReducedMotion = (event) => {\n            reduceMotion = event.matches;\n            program.uniforms.uMotion.value = reduceMotion ? 0 : 1;\n            renderOnce();\n        };\n        const loop = (now) => {\n            if (disposed || contextLost)\n                return;\n            const elapsed = (now - startTime) * 0.001;\n            const idleX = 0.5 + Math.sin(elapsed * 0.33) * 0.12;\n            const idleY = 0.5 + Math.cos(elapsed * 0.27) * 0.1;\n            const targetX = pointer.activeTarget > 0 ? pointer.tx : idleX;\n            const targetY = pointer.activeTarget > 0 ? pointer.ty : idleY;\n            const damping = pointer.activeTarget > 0 ? 0.12 : 0.035;\n            pointer.x += (targetX - pointer.x) * damping;\n            pointer.y += (targetY - pointer.y) * damping;\n            pointer.active += ((pointer.activeTarget > 0 ? 1 : 0.18) - pointer.active) * 0.06;\n            program.uniforms.uPointer.value[0] = pointer.x;\n            program.uniforms.uPointer.value[1] = pointer.y;\n            program.uniforms.uPointerActive.value = reduceMotion ? pointer.active * 0.35 : pointer.active;\n            program.uniforms.uTime.value = reduceMotion ? 0 : elapsed;\n            renderOnce();\n            raf = requestAnimationFrame(loop);\n        };\n        resizeObserver = new ResizeObserver(resize);\n        resizeObserver.observe(container);\n        intersectionObserver = new IntersectionObserver(([entry]) => {\n            visible = entry.isIntersecting;\n            if (visible && pageVisible && !raf)\n                raf = requestAnimationFrame(loop);\n            if (!visible && raf) {\n                cancelAnimationFrame(raf);\n                raf = 0;\n            }\n        }, { threshold: 0 });\n        intersectionObserver.observe(container);\n        canvas.addEventListener('pointermove', onPointerMove);\n        canvas.addEventListener('pointerleave', onPointerLeave);\n        canvas.addEventListener('webglcontextlost', onContextLost, false);\n        document.addEventListener('visibilitychange', onVisibility);\n        mediaQuery?.addEventListener('change', onReducedMotion);\n        syncUniforms(program, propsRef.current);\n        contextRef.current = { program, rasterize };\n        resize();\n        raf = requestAnimationFrame(loop);\n        return () => {\n            disposed = true;\n            contextRef.current = null;\n            if (raf)\n                cancelAnimationFrame(raf);\n            resizeObserver?.disconnect();\n            intersectionObserver?.disconnect();\n            canvas.removeEventListener('pointermove', onPointerMove);\n            canvas.removeEventListener('pointerleave', onPointerLeave);\n            canvas.removeEventListener('webglcontextlost', onContextLost);\n            document.removeEventListener('visibilitychange', onVisibility);\n            mediaQuery?.removeEventListener('change', onReducedMotion);\n            if (!contextLost) {\n                try {\n                    if (texture?.texture)\n                        gl.deleteTexture(texture.texture);\n                    geometry?.remove?.();\n                    program?.remove?.();\n                    gl.getExtension('WEBGL_lose_context')?.loseContext();\n                }\n                catch { }\n            }\n            if (canvas.parentNode === container)\n                container.removeChild(canvas);\n        };\n    }, []);\n    return (<div ref={containerRef} className={`relative block min-h-[220px] w-full overflow-hidden isolate ${className}`.trim()} style={style} role=\"img\" aria-label={text}/>);\n};\nexport default WarpText;",
    "props": [
      {
        "name": "text",
        "type": "string",
        "default": "'Bend the moment'",
        "description": "The text content to display and animate."
      },
      {
        "name": "color",
        "type": "string",
        "default": "'#f8f5ff'",
        "description": "Text or primary fill color."
      },
      {
        "name": "warpStrength",
        "type": "number",
        "default": "0.08",
        "description": "Controls the warp strength for the component animation."
      },
      {
        "name": "warpScale",
        "type": "number",
        "default": "1.7",
        "description": "Controls the warp scale for the component animation."
      },
      {
        "name": "speed",
        "type": "number",
        "default": "0.55",
        "description": "Speed multiplier for the motion playback."
      },
      {
        "name": "pointerInfluence",
        "type": "number",
        "default": "0.42",
        "description": "Controls the pointer influence for the component animation."
      },
      {
        "name": "pointerStrength",
        "type": "number",
        "default": "0.38",
        "description": "Controls the pointer strength for the component animation."
      },
      {
        "name": "refraction",
        "type": "number",
        "default": "0.018",
        "description": "Controls the refraction for the component animation."
      },
      {
        "name": "ripple",
        "type": "boolean",
        "default": "true",
        "description": "Controls the ripple for the component animation."
      },
      {
        "name": "fontSize",
        "type": "string | number",
        "default": "'clamp(3rem, 10vw, 9rem)'",
        "description": "Font size in pixels, rems, or fluid clamp notation."
      },
      {
        "name": "fontWeight",
        "type": "string | number",
        "default": "800",
        "description": "Font weight (e.g., 400, 700, 900, 'bold')."
      },
      {
        "name": "fontFamily",
        "type": "string",
        "default": "'inherit'",
        "description": "Custom font family to apply to the rendered typography."
      },
      {
        "name": "letterSpacing",
        "type": "string | number",
        "default": "'-0.06em'",
        "description": "Controls the letter spacing for the component animation."
      },
      {
        "name": "lineHeight",
        "type": "string | number",
        "default": "0.9",
        "description": "Controls the line height for the component animation."
      },
      {
        "name": "className",
        "type": "string",
        "default": "''",
        "description": "Additional CSS classes for styling and layout."
      },
      {
        "name": "style",
        "type": "CSSProperties",
        "default": "-",
        "description": "Controls the style for the component animation."
      },
      {
        "name": "text",
        "type": "string",
        "default": "'Bend the moment'",
        "description": "The text content to display and animate."
      },
      {
        "name": "color",
        "type": "string",
        "default": "'#f8f5ff'",
        "description": "Text or primary fill color."
      },
      {
        "name": "fontSize",
        "type": "string | number",
        "default": "'clamp(3rem, 10vw, 9rem)'",
        "description": "Font size in pixels, rems, or fluid clamp notation."
      },
      {
        "name": "fontWeight",
        "type": "string | number",
        "default": "800",
        "description": "Font weight (e.g., 400, 700, 900, 'bold')."
      },
      {
        "name": "fontFamily",
        "type": "string",
        "default": "'inherit'",
        "description": "Custom font family to apply to the rendered typography."
      },
      {
        "name": "letterSpacing",
        "type": "string | number",
        "default": "'-0.06em'",
        "description": "Controls the letter spacing for the component animation."
      },
      {
        "name": "lineHeight",
        "type": "string | number",
        "default": "0.9",
        "description": "Controls the line height for the component animation."
      },
      {
        "name": "warpStrength",
        "type": "number",
        "default": "0.08",
        "description": "Controls the warp strength for the component animation."
      },
      {
        "name": "warpScale",
        "type": "number",
        "default": "1.7",
        "description": "Controls the warp scale for the component animation."
      },
      {
        "name": "speed",
        "type": "number",
        "default": "0.55",
        "description": "Speed multiplier for the motion playback."
      },
      {
        "name": "pointerInfluence",
        "type": "number",
        "default": "0.42",
        "description": "Controls the pointer influence for the component animation."
      },
      {
        "name": "pointerStrength",
        "type": "number",
        "default": "0.38",
        "description": "Controls the pointer strength for the component animation."
      },
      {
        "name": "refraction",
        "type": "number",
        "default": "0.018",
        "description": "Controls the refraction for the component animation."
      },
      {
        "name": "ripple",
        "type": "boolean",
        "default": "true",
        "description": "Controls the ripple for the component animation."
      }
    ]
  }
};
