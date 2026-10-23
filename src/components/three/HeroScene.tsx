"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uMorph;
  uniform float uSize;

  attribute vec3 aTarget;
  attribute float aRand;

  varying float vAlpha;
  varying float vDepth;

  void main() {
    vec3 pos = mix(position, aTarget, uMorph);

    pos.x += sin(uTime * 0.55 + aRand * 18.0) * 0.055;
    pos.y += cos(uTime * 0.48 + aRand * 14.0) * 0.055;
    pos.z += sin(uTime * 0.62 + aRand * 22.0) * 0.045;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);

    vec2 pointer = uPointer * vec2(3.0, 2.0);
    float d = distance(mv.xy, pointer);
    float influence = 1.0 - smoothstep(0.0, 1.9, d);
    mv.xy += normalize(mv.xy - pointer + 0.0001) * influence * 0.55;

    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (1.0 / max(0.001, -mv.z)) * 240.0;

    vAlpha = 0.25 + 0.75 * smoothstep(-2.4, 2.4, pos.z);
    vDepth = smoothstep(-2.6, 2.2, pos.z);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;

  varying float vAlpha;
  varying float vDepth;

  void main() {
    vec2 coord = gl_PointCoord - 0.5;
    float distanceToCenter = length(coord);
    if (distanceToCenter > 0.5) discard;

    float alpha = smoothstep(0.5, 0.02, distanceToCenter) * vAlpha * 0.85;
    vec3 color = mix(uColorA, uColorB, vDepth);
    gl_FragColor = vec4(color, alpha);
  }
`;

function readColors() {
  if (typeof window === "undefined") {
    return { a: "#c6f24e", b: "#7c5cff" };
  }
  const styles = getComputedStyle(document.documentElement);
  return {
    a: styles.getPropertyValue("--lime").trim() || "#c6f24e",
    b: styles.getPropertyValue("--violet").trim() || "#7c5cff",
  };
}

function Particles({ count = 4200 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { pointer, viewport } = useThree();
  const [colors, setColors] = useState(readColors);

  useEffect(() => {
    const observer = new MutationObserver(() => setColors(readColors()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const targets = new Float32Array(count * 3);
    const randoms = new Float32Array(count);
    const golden = Math.PI * (1 + Math.sqrt(5));

    for (let i = 0; i < count; i += 1) {
      const t = i / count;

      // sphere (fibonacci distribution)
      const phi = Math.acos(1 - 2 * t);
      const theta = golden * i;
      const radius = 2.15;

      positions[i * 3] = Math.cos(theta) * Math.sin(phi) * radius;
      positions[i * 3 + 1] = Math.cos(phi) * radius;
      positions[i * 3 + 2] = Math.sin(theta) * Math.sin(phi) * radius;

      // torus knot
      const u = t * Math.PI * 2;
      const p = 2;
      const q = 3;
      const knotRadius = 0.78;
      const ring = 2 + Math.cos(q * u) * 0.85;

      targets[i * 3] = ring * Math.cos(p * u) * knotRadius;
      targets[i * 3 + 1] = ring * Math.sin(p * u) * knotRadius;
      targets[i * 3 + 2] = Math.sin(q * u) * 1.05;

      randoms[i] = Math.random();
    }

    const buffer = new THREE.BufferGeometry();
    buffer.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    buffer.setAttribute("aTarget", new THREE.BufferAttribute(targets, 3));
    buffer.setAttribute("aRand", new THREE.BufferAttribute(randoms, 1));
    return buffer;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uMorph: { value: 0 },
      uSize: { value: 1 },
      uColorA: { value: new THREE.Color(colors.a) },
      uColorB: { value: new THREE.Color(colors.b) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    uniforms.uColorA.value.set(colors.a);
    uniforms.uColorB.value.set(colors.b);
  }, [colors, uniforms]);

  useFrame((state, delta) => {
    const material = materialRef.current;
    const points = pointsRef.current;
    if (!material || !points) return;

    material.uniforms.uTime.value += delta;
    material.uniforms.uPointer.value.lerp(
      new THREE.Vector2(pointer.x, pointer.y),
      0.08,
    );

    const scrollProgress =
      typeof window !== "undefined"
        ? Math.min(1, Math.max(0, window.scrollY / window.innerHeight) * 0.95)
        : 0;

    material.uniforms.uMorph.value +=
      (scrollProgress - material.uniforms.uMorph.value) * 0.05;

    points.rotation.y += delta * 0.075;
    points.rotation.x = Math.sin(state.clock.elapsedTime * 0.12) * 0.12;

    const scale = Math.min(1.35, Math.max(0.85, viewport.width / 7));
    points.scale.setScalar(scale);
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function HeroCanvas() {
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      setSupported(
        Boolean(
          canvas.getContext("webgl2") ||
            canvas.getContext("webgl") ||
            canvas.getContext("experimental-webgl"),
        ),
      );
    } catch {
      setSupported(false);
    }
  }, []);

  if (!supported) return null;

  return (
    <Canvas
      camera={{ position: [0, 0, 6.4], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
    >
      <Particles />
    </Canvas>
  );
}
