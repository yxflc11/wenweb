"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { warp } from "@/lib/warp";

const COUNT = 280;
const DEPTH = 64;
const PALETTE = ["#36e6ff", "#5b7bff", "#ff4fd8", "#9b6bff", "#ffffff"].map(
  (c) => new THREE.Color(c)
);

type Streak = { x: number; y: number; z: number; speed: number; len: number };

function spawn(): Streak {
  const a = Math.random() * Math.PI * 2;
  const r = 1.4 + Math.random() * 7.5;
  return {
    x: Math.cos(a) * r,
    y: Math.sin(a) * r,
    z: -Math.random() * DEPTH,
    speed: 9 + Math.random() * 26,
    len: 2 + Math.random() * 7
  };
}

function Streaks() {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const streaks = useMemo(() => Array.from({ length: COUNT }, spawn), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    const m = mesh.current;
    if (!m) return;
    for (let i = 0; i < COUNT; i++) m.setColorAt(i, PALETTE[i % PALETTE.length]);
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, []);

  useFrame((_, delta) => {
    const m = mesh.current;
    if (!m) return;
    const intensity = warp.value;
    // Skip all per-instance work + drawing while the warp zone is inactive.
    if (intensity < 0.002) {
      if (m.visible) {
        m.visible = false;
        (m.material as THREE.MeshBasicMaterial).opacity = 0;
      }
      return;
    }
    m.visible = true;
    const dt = Math.min(delta, 0.05);
    for (let i = 0; i < COUNT; i++) {
      const s = streaks[i];
      s.z += s.speed * dt * (0.35 + intensity * 1.8);
      if (s.z > 6.5) Object.assign(s, spawn(), { z: -DEPTH });
      dummy.position.set(s.x, s.y, s.z);
      dummy.scale.set(0.016, 0.016, s.len * (0.25 + intensity * 1.1));
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
    (m.material as THREE.MeshBasicMaterial).opacity = Math.min(1, intensity * 1.25);
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, COUNT]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

// --- Caustic light field (hero ambiance) ----------------------------------
const causticVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const causticFrag = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uBase;
  uniform vec3 uLight;
  #define TAU 6.28318530718
  void main() {
    vec2 uv = vUv;
    uv.x *= 1.6;
    uv *= 2.0;
    vec2 p = mod(uv * TAU, TAU) - 250.0;
    vec2 i = vec2(p);
    float c = 1.0;
    float inten = 0.0045;
    for (int n = 0; n < 4; n++) {
      float t = uTime * 0.4 * (1.0 - (3.5 / float(n + 1)));
      i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
      c += 1.0 / length(vec2(p.x / (sin(i.x + t) / inten), p.y / (cos(i.y + t) / inten)));
    }
    c /= 4.0;
    c = 1.17 - pow(c, 1.4);
    float bright = pow(abs(c), 8.0);
    vec3 col = mix(uBase, uLight, clamp(bright * 1.6, 0.0, 1.0));
    gl_FragColor = vec4(col, uOpacity);
  }
`;

const LIGHT_BASE = new THREE.Color("#dfe4df");
const LIGHT_LIGHT = new THREE.Color("#eaf1ff");
const DARK_BASE = new THREE.Color("#0b0d11");
const DARK_LIGHT = new THREE.Color("#2a3a5e");

function Caustics() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uBase: { value: LIGHT_BASE.clone() },
      uLight: { value: LIGHT_LIGHT.clone() }
    }),
    []
  );

  useFrame((state) => {
    const m = mat.current;
    const mesh = meshRef.current;
    if (!m || !mesh) return;
    // Fade the caustics out as you scroll past the hero.
    const fade = Math.max(0, Math.min(1, 1 - window.scrollY / (window.innerHeight * 0.85)));
    m.uniforms.uOpacity.value = fade;
    // Skip the (fullscreen) shader entirely once past the hero.
    const visible = fade > 0.002;
    mesh.visible = visible;
    if (!visible) return;
    m.uniforms.uTime.value = state.clock.elapsedTime;
    const t = document.documentElement.dataset.theme;
    const isDark =
      t === "dark" ||
      (t !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    (m.uniforms.uBase.value as THREE.Color).lerp(isDark ? DARK_BASE : LIGHT_BASE, 0.06);
    (m.uniforms.uLight.value as THREE.Color).lerp(isDark ? DARK_LIGHT : LIGHT_LIGHT, 0.06);
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -5]}>
      <planeGeometry args={[52, 36]} />
      <shaderMaterial
        ref={mat}
        transparent
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={causticVert}
        fragmentShader={causticFrag}
      />
    </mesh>
  );
}

// --- Tunnel rings (the warp throat that forms at peak intensity) -----------
const RING_COUNT = 9;
const RING_GAP = DEPTH / RING_COUNT;

function Rings() {
  const group = useRef<THREE.Group>(null);
  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  const zs = useMemo(() => Array.from({ length: RING_COUNT }, (_, i) => -i * RING_GAP), []);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const intensity = warp.value;
    // Rings only appear once the warp is well underway.
    if (intensity < 0.12) {
      if (g.visible) g.visible = false;
      return;
    }
    g.visible = true;
    const dt = Math.min(delta, 0.05);
    for (let i = 0; i < RING_COUNT; i++) {
      const m = meshes.current[i];
      if (!m) continue;
      zs[i] += dt * (3 + intensity * 20);
      if (zs[i] > 6.5) zs[i] -= DEPTH;
      m.position.z = zs[i];
      // Fade in around mid-depth, out as rings reach the camera or the far plane.
      const depthFade = Math.max(0, 1 - Math.abs(zs[i] + 9) / 22);
      (m.material as THREE.MeshBasicMaterial).opacity = intensity * 0.6 * depthFade;
    }
  });

  return (
    <group ref={group}>
      {zs.map((_, i) => (
        <mesh key={i} ref={(el) => { meshes.current[i] = el; }}>
          <ringGeometry args={[2.4, 2.46, 80]} />
          <meshBasicMaterial
            color="#e9ff66"
            transparent
            opacity={0}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function BackgroundScene() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const small = window.matchMedia("(max-width: 760px), (pointer: coarse)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(!small && !reduce);
  }, []);

  if (!enabled) return null;

  return (
    <div className="bg-scene" aria-hidden="true">
      <Canvas
        className="bg-canvas"
        style={{ pointerEvents: "none" }}
        camera={{ position: [0, 0, 6], fov: 62 }}
        dpr={[1, 1.6]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      >
        <Caustics />
        <Streaks />
        <Rings />
      </Canvas>
    </div>
  );
}
