"use client";

import { useEffect, useRef, useState } from "react";

const COUNT = 4200;

const vertexShader = `
precision highp float;

attribute vec3 aPosition;
attribute vec3 aTarget;
attribute float aRand;

uniform float uTime;
uniform float uMorph;
uniform vec2 uPointer;
uniform float uAspect;
uniform float uDpr;
uniform float uScale;

varying float vDepth;
varying float vAlpha;

void main() {
  vec3 pos = mix(aPosition, aTarget, uMorph);

  pos.x += sin(uTime * 0.55 + aRand * 18.0) * 0.055;
  pos.y += cos(uTime * 0.48 + aRand * 14.0) * 0.055;
  pos.z += sin(uTime * 0.62 + aRand * 22.0) * 0.045;

  float a = uTime * 0.06 + uPointer.x * 0.35;
  float ca = cos(a);
  float sa = sin(a);
  float x = ca * pos.x + sa * pos.z;
  float z = -sa * pos.x + ca * pos.z;
  pos.x = x;
  pos.z = z;

  float b = uPointer.y * 0.18;
  float cb = cos(b);
  float sb = sin(b);
  float y = cb * pos.y - sb * pos.z;
  z = sb * pos.y + cb * pos.z;
  pos.y = y;
  pos.z = z;

  float depth = 5.0 / (5.0 + pos.z);
  vec2 screen = pos.xy * depth * uScale;
  screen.x /= uAspect;

  vec2 delta = screen - uPointer * vec2(0.85, 0.55);
  float dist = length(delta);
  screen += normalize(delta + 0.0001) * (1.0 - smoothstep(0.0, 0.55, dist)) * 0.14;

  gl_Position = vec4(screen, 0.0, 1.0);
  gl_PointSize = (1.5 + aRand * 1.6) * depth * uDpr * 1.7;

  vDepth = clamp(depth * 1.65 - 0.35, 0.0, 1.0);
  vAlpha = 0.22 + 0.78 * vDepth;
}
`;

const fragmentShader = `
precision mediump float;

uniform vec3 uColorA;
uniform vec3 uColorB;

varying float vDepth;
varying float vAlpha;

void main() {
  vec2 coord = gl_PointCoord - 0.5;
  float d = length(coord);
  if (d > 0.5) discard;

  float alpha = smoothstep(0.5, 0.02, d) * vAlpha * 0.9;
  gl_FragColor = vec4(mix(uColorA, uColorB, vDepth), alpha);
}
`;

type Uniforms = {
  time: WebGLUniformLocation | null;
  morph: WebGLUniformLocation | null;
  pointer: WebGLUniformLocation | null;
  aspect: WebGLUniformLocation | null;
  dpr: WebGLUniformLocation | null;
  scale: WebGLUniformLocation | null;
  colorA: WebGLUniformLocation | null;
  colorB: WebGLUniformLocation | null;
};

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function buildGeometry() {
  const positions = new Float32Array(COUNT * 3);
  const targets = new Float32Array(COUNT * 3);
  const randoms = new Float32Array(COUNT);
  const golden = Math.PI * (1 + Math.sqrt(5));

  for (let i = 0; i < COUNT; i += 1) {
    const t = i / COUNT;

    const phi = Math.acos(1 - 2 * t);
    const theta = golden * i;
    const radius = 2.15;

    positions[i * 3] = Math.cos(theta) * Math.sin(phi) * radius;
    positions[i * 3 + 1] = Math.cos(phi) * radius;
    positions[i * 3 + 2] = Math.sin(theta) * Math.sin(phi) * radius;

    const u = t * Math.PI * 2;
    const ring = 2 + Math.cos(3 * u) * 0.85;
    const knot = 0.78;

    targets[i * 3] = ring * Math.cos(2 * u) * knot;
    targets[i * 3 + 1] = ring * Math.sin(2 * u) * knot;
    targets[i * 3 + 2] = Math.sin(3 * u) * 1.05;

    randoms[i] = Math.random();
  }

  return { positions, targets, randoms };
}

function hexToRgb(hex: string): [number, number, number] {
  const value = hex.trim().replace("#", "");
  const full =
    value.length === 3
      ? value
          .split("")
          .map((char) => char + char)
          .join("")
      : value;
  const int = Number.parseInt(full.slice(0, 6) || "c6f24e", 16);
  return [
    ((int >> 16) & 255) / 255,
    ((int >> 8) & 255) / 255,
    (int & 255) / 255,
  ];
}

function readColors(): [[number, number, number], [number, number, number]] {
  if (typeof window === "undefined") {
    return [
      [0.776, 0.949, 0.306],
      [0.486, 0.361, 1],
    ];
  }
  const styles = getComputedStyle(document.documentElement);
  return [
    hexToRgb(styles.getPropertyValue("--lime") || "#c6f24e"),
    hexToRgb(styles.getPropertyValue("--violet") || "#7c5cff"),
  ];
}

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = (canvas.getContext("webgl2", {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
      powerPreference: "high-performance",
    }) ??
      canvas.getContext("webgl", {
        alpha: true,
        antialias: true,
      })) as WebGLRenderingContext | null;

    if (!gl) return;

    const vertex = compile(gl, gl.VERTEX_SHADER, vertexShader);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentShader);
    const program = gl.createProgram();

    if (!vertex || !fragment || !program) return;

    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    // biome-ignore lint/correctness/useHookAtTopLevel: WebGL API, not a React hook
    gl.useProgram(program);

    const { positions, targets, randoms } = buildGeometry();
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    const positionLocation = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

    const targetBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, targetBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, targets, gl.STATIC_DRAW);
    const targetLocation = gl.getAttribLocation(program, "aTarget");
    gl.enableVertexAttribArray(targetLocation);
    gl.vertexAttribPointer(targetLocation, 3, gl.FLOAT, false, 0, 0);

    const randomBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, randomBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, randoms, gl.STATIC_DRAW);
    const randomLocation = gl.getAttribLocation(program, "aRand");
    gl.enableVertexAttribArray(randomLocation);
    gl.vertexAttribPointer(randomLocation, 1, gl.FLOAT, false, 0, 0);

    const uniforms: Uniforms = {
      time: gl.getUniformLocation(program, "uTime"),
      morph: gl.getUniformLocation(program, "uMorph"),
      pointer: gl.getUniformLocation(program, "uPointer"),
      aspect: gl.getUniformLocation(program, "uAspect"),
      dpr: gl.getUniformLocation(program, "uDpr"),
      scale: gl.getUniformLocation(program, "uScale"),
      colorA: gl.getUniformLocation(program, "uColorA"),
      colorB: gl.getUniformLocation(program, "uColorB"),
    };

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.clearColor(0, 0, 0, 0);

    let colors = readColors();
    gl.uniform3f(uniforms.colorA, colors[0][0], colors[0][1], colors[0][2]);
    gl.uniform3f(uniforms.colorB, colors[1][0], colors[1][1], colors[1][2]);

    const themeObserver = new MutationObserver(() => {
      colors = readColors();
      gl.uniform3f(uniforms.colorA, colors[0][0], colors[0][1], colors[0][2]);
      gl.uniform3f(uniforms.colorB, colors[1][0], colors[1][1], colors[1][2]);
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    let width = 1;
    let height = 1;
    let dpr = 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(uniforms.aspect, width / height);
      gl.uniform1f(uniforms.dpr, dpr);
      gl.uniform1f(
        uniforms.scale,
        Math.min(0.82, Math.max(0.5, 380 / Math.min(width, height))),
      );
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    let pointerX = 0;
    let pointerY = 0;
    let smoothX = 0;
    let smoothY = 0;

    const onPointerMove = (event: PointerEvent) => {
      pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      pointerY = -((event.clientY / window.innerHeight) * 2 - 1);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    let frame = 0;
    let elapsed = 0;
    let last = performance.now();
    let morph = 0;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const render = (now: number) => {
      const delta = Math.min(0.05, (now - last) / 1000);
      last = now;
      elapsed += delta;

      smoothX += (pointerX - smoothX) * 0.06;
      smoothY += (pointerY - smoothY) * 0.06;

      const scrollTarget =
        typeof window !== "undefined"
          ? Math.min(1, Math.max(0, window.scrollY / window.innerHeight) * 0.95)
          : 0;
      morph += (scrollTarget - morph) * 0.05;

      gl.uniform1f(uniforms.time, elapsed);
      gl.uniform1f(uniforms.morph, morph);
      gl.uniform2f(uniforms.pointer, smoothX, smoothY);

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, COUNT);

      if (!reduced) frame = requestAnimationFrame(render);
    };

    frame = requestAnimationFrame(render);
    setSupported(true);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      gl.deleteBuffer(positionBuffer);
      gl.deleteBuffer(targetBuffer);
      gl.deleteBuffer(randomBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="size-full"
      data-testid="hero-canvas"
      data-webgl={supported ? "true" : "false"}
    />
  );
}
