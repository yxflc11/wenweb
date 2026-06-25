"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { images } from "../data";
import { usePreview } from "./PreviewContext";

const ALL = Object.values(images);
const CARD_W = 300;
const CARD_H = 360;
const PLANE_ASPECT = CARD_W / CARD_H;

// Fit a texture to "cover" the plane aspect (like object-fit: cover).
function cover(tex: THREE.Texture, planeAspect: number) {
  const img = tex.image as { width: number; height: number } | undefined;
  if (!img || !img.width || !img.height) return;
  const imgAspect = img.width / img.height;
  tex.matrixAutoUpdate = false;
  if (imgAspect > planeAspect) {
    const s = planeAspect / imgAspect;
    tex.matrix.setUvTransform(0, 0, s, 1, 0, (1 - s) / 2, 0.5);
  } else {
    const s = imgAspect / planeAspect;
    tex.matrix.setUvTransform(0, 0, 1, s, 0, 0.5, (1 - s) / 2);
  }
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
}

type TiltRef = { x: number; y: number };

function Card({ url, tilt }: { url: string; tilt: React.RefObject<TiltRef> }) {
  // useLoader caches by url; all textures are preloaded below.
  const tex = useLoader(THREE.TextureLoader, url);
  const mesh = useRef<THREE.Mesh>(null);
  const t = useRef(0);

  useMemo(() => cover(tex, PLANE_ASPECT), [tex]);

  useFrame((_, delta) => {
    if (!mesh.current) return;
    t.current += delta;
    const target = tilt.current ?? { x: 0, y: 0 };
    // Ease rotation toward the cursor-velocity target + a slow idle drift.
    const idle = Math.sin(t.current * 0.9) * 0.05;
    mesh.current.rotation.y += (target.x + idle - mesh.current.rotation.y) * 0.08;
    mesh.current.rotation.x += (target.y - mesh.current.rotation.x) * 0.08;
    mesh.current.position.z += (0 - mesh.current.position.z) * 0.1;
  });

  return (
    <mesh ref={mesh}>
      <planeGeometry args={[PLANE_ASPECT * 2.2, 2.2, 24, 24]} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  );
}

function Preloader() {
  // Warm the loader cache for every poster so swaps are instant.
  useLoader(THREE.TextureLoader, ALL);
  return null;
}

export default function ThreePreview() {
  const { active } = usePreview();
  const wrap = useRef<HTMLDivElement>(null);
  const tilt = useRef<TiltRef>({ x: 0, y: 0 });
  const pos = useRef({ x: -400, y: -400 });
  const last = useRef({ x: 0, y: 0, time: 0 });
  const raf = useRef(0);
  const [enabled, setEnabled] = useState(false);
  // Keep showing the last poster while fading out.
  const [shown, setShown] = useState<string | null>(null);

  useEffect(() => {
    // Disable the cursor-follow 3D preview on small / touch screens, and keep
    // it in sync if the viewport changes (resize, device rotation).
    const mq = window.matchMedia("(max-width: 900px), (pointer: coarse)");
    const apply = () => setEnabled(!mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (active) setShown(active);
  }, [active]);

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      const dt = Math.max(1, now - last.current.time);
      const vx = (e.clientX - last.current.x) / dt;
      const vy = (e.clientY - last.current.y) / dt;
      // Clamp the velocity-driven tilt so fast flicks don't over-rotate.
      tilt.current = {
        x: THREE.MathUtils.clamp(vx * 0.6, -0.5, 0.5),
        y: THREE.MathUtils.clamp(-vy * 0.6, -0.4, 0.4)
      };
      last.current = { x: e.clientX, y: e.clientY, time: now };
      pos.current = { x: e.clientX, y: e.clientY };
      if (!raf.current) {
        raf.current = requestAnimationFrame(() => {
          if (wrap.current) {
            wrap.current.style.transform = `translate3d(${pos.current.x + 28}px, ${
              pos.current.y - CARD_H / 2
            }px, 0)`;
          }
          // Tilt decays back toward rest between movements.
          tilt.current = { x: tilt.current.x * 0.92, y: tilt.current.y * 0.92 };
          raf.current = 0;
        });
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={wrap}
      className={`three-preview ${active ? "is-on" : ""}`}
      style={{ width: CARD_W, height: CARD_H }}
      aria-hidden="true"
    >
      <Canvas
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 3.4], fov: 38 }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Preloader />
          {shown && <Card url={shown} tilt={tilt} />}
        </Suspense>
      </Canvas>
    </div>
  );
}
