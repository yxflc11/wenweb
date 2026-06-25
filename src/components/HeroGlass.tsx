"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  MeshTransmissionMaterial,
  Environment,
  Lightformer,
  Float
} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { buildCursiveGeometry } from "./cursiveGeometry";

// Connected handwriting font extruded into liquid glass; renders stacked,
// centred cursive lines (e.g. "Before / The Leap.").
const FONT = "/fonts/DancingScript.ttf";

type PointerRef = React.RefObject<{ x: number; y: number }>;

function Hello({
  reduced,
  pointer,
  scale,
  word,
  centerY
}: {
  reduced: boolean;
  pointer: PointerRef;
  scale: number;
  word: string;
  centerY: number;
}) {
  const group = useRef<THREE.Group>(null);
  const [geo, setGeo] = useState<THREE.ExtrudeGeometry | null>(null);

  useEffect(() => {
    let alive = true;
    let built: THREE.ExtrudeGeometry | null = null;
    buildCursiveGeometry(FONT, word, reduced)
      .then((g) => {
        if (alive) {
          built = g;
          setGeo(g);
        } else {
          g.dispose();
        }
      })
      .catch(() => {});
    return () => {
      alive = false;
      if (built) built.dispose();
    };
  }, [reduced, word]);

  useFrame((state) => {
    if (!group.current) return;
    const p = pointer.current ?? { x: 0, y: 0 };
    // Ease the wordmark toward the cursor for a subtle parallax tilt.
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, p.x * 0.45, 0.05);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -p.y * 0.28, 0.05);
    // Breathes around its anchor height (hero sits above centre; closing centres).
    group.current.position.y = centerY + Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
  });

  return (
    <Float speed={1.6} rotationIntensity={0.18} floatIntensity={0.5}>
      <group ref={group} position={[0, centerY, 0]} scale={scale}>
        {geo && (
          <mesh geometry={geo}>
            <MeshTransmissionMaterial
              backside
              backsideThickness={0.6}
              thickness={0.5}
              samples={reduced ? 4 : 6}
              resolution={reduced ? 160 : 256}
              transmission={1}
              roughness={0.03}
              ior={1.43}
              chromaticAberration={reduced ? 0.1 : 0.5}
              anisotropy={0.3}
              distortion={reduced ? 0.06 : 0.4}
              distortionScale={0.35}
              temporalDistortion={reduced ? 0 : 0.15}
              clearcoat={1}
              clearcoatRoughness={0.05}
              attenuationDistance={2.5}
              attenuationColor="#ffffff"
              color="#eef1f6"
            />
          </mesh>
        )}
      </group>
    </Float>
  );
}

// A slowly rotating rig of soft area lights — gives the glass moving studio
// reflections without loading any external HDR.
function Lights() {
  const rig = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (rig.current) rig.current.rotation.z += delta * 0.12;
  });
  return (
    <Environment resolution={256} frames={Infinity}>
      <color attach="background" args={["#0a0a0b"]} />
      <Lightformer form="rect" intensity={3} position={[0, 4, -6]} scale={[10, 4, 1]} color="#ffffff" />
      <Lightformer form="rect" intensity={2} position={[-5, -1, -4]} scale={[6, 6, 1]} color="#9fb4ff" />
      <Lightformer form="rect" intensity={2} position={[5, 1, -4]} scale={[6, 6, 1]} color="#ffd9a8" />
      <group ref={rig}>
        <Lightformer form="ring" intensity={2.4} position={[3, 2, 2]} scale={3} color="#cfe0ff" />
        <Lightformer form="circle" intensity={2} position={[-3, -2, 2]} scale={3} color="#ffffff" />
      </group>
    </Environment>
  );
}

function fitScale(w: number) {
  // Keep the whole word visible across viewport widths.
  if (w < 480) return 0.4;
  if (w < 760) return 0.52;
  if (w < 1024) return 0.74;
  return 1;
}

export default function HeroGlass({
  reduced = false,
  word = "Before\nThe Leap.",
  anchor = ".hero",
  centerY = 0.85
}: {
  reduced?: boolean;
  word?: string;
  anchor?: string;
  centerY?: number;
}) {
  const pointer = useRef({ x: 0, y: 0 });
  const [ready, setReady] = useState(false);
  const [scale, setScale] = useState(1);
  // Pause the (heavy) render loop while the hero is scrolled out of view.
  const [active, setActive] = useState(true);

  useEffect(() => {
    setReady(true);
    const onResize = () => setScale(fitScale(window.innerWidth));
    onResize();
    const onMove = (e: PointerEvent) => {
      pointer.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1
      };
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", onResize);

    const host = document.querySelector(anchor);
    let io: IntersectionObserver | undefined;
    if (host) {
      io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), {
        rootMargin: "150px"
      });
      io.observe(host);
    }
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      io?.disconnect();
    };
  }, []);

  if (!ready) return null;

  return (
    <Canvas
      className="hero-canvas"
      style={{ pointerEvents: "none" }}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 9], fov: 34 }}
      dpr={reduced ? [1, 1.5] : [1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 6, 4]} intensity={1.2} />
      <Suspense fallback={null}>
        <Hello reduced={reduced} pointer={pointer} scale={scale} word={word} centerY={centerY} />
        <Lights />
      </Suspense>
      {!reduced && (
        <EffectComposer>
          <Bloom mipmapBlur luminanceThreshold={0.55} luminanceSmoothing={0.3} intensity={0.7} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
