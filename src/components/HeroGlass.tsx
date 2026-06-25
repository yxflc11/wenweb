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

// Font extruded into liquid glass; renders stacked, centred lines.
// NOTE: test-rounded.ttf is a LOCAL bold-block test (proprietary, not committed).
// To ship the block look, drop an OFL rounded font (Fredoka/Baloo/Quicksand) here.
const FONT = "/fonts/test-rounded.ttf";

// Bright pale-blue backdrop the glass transmits, so the transparent glass reads as
// luminous light-blue liquid (haoqi-style) instead of vanishing on a dark section.
const GLASS_BG = new THREE.Color("#d4e7ff");

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
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, p.x * 0.2, 0.04);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -p.y * 0.12, 0.04);
    // Gentle breathe; kept small so the refraction pattern stays stable (motion
    // across thin strokes is what reads as flicker).
    group.current.position.y = centerY + Math.sin(state.clock.elapsedTime * 0.7) * 0.02;
  });

  return (
    <Float speed={0.7} rotationIntensity={0.05} floatIntensity={0.16}>
      <group ref={group} position={[0, centerY, 0]} scale={scale}>
        {geo && (
          <mesh geometry={geo}>
            <MeshTransmissionMaterial
              background={GLASS_BG}
              backside
              backsideThickness={0.18}
              thickness={0.16}
              samples={reduced ? 4 : 6}
              resolution={reduced ? 160 : 256}
              transmission={1}
              roughness={reduced ? 0.1 : 0.08}
              ior={1.25}
              chromaticAberration={reduced ? 0.06 : 0.16}
              anisotropy={0.2}
              distortion={reduced ? 0.04 : 0.12}
              distortionScale={0.3}
              temporalDistortion={0}
              clearcoat={1}
              clearcoatRoughness={0.2}
              attenuationDistance={12}
              attenuationColor="#cfe2ff"
              color="#ffffff"
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
    // Slow drift keeps reflections alive without sweeping hot specular across the
    // thin strokes (which read as flicker).
    if (rig.current) rig.current.rotation.z += delta * 0.02;
  });
  return (
    <Environment resolution={256} frames={Infinity}>
      {/* Bright sky-blue surround so the glass reflects/refracts luminous light-blue. */}
      <color attach="background" args={["#bcd8f7"]} />
      <Lightformer form="rect" intensity={3} position={[0, 4, -6]} scale={[10, 4, 1]} color="#ffffff" />
      <Lightformer form="rect" intensity={2.4} position={[-5, -1, -4]} scale={[6, 6, 1]} color="#bcd4ff" />
      <Lightformer form="rect" intensity={2} position={[5, 1, -4]} scale={[6, 6, 1]} color="#eaf2ff" />
      <group ref={rig}>
        <Lightformer form="ring" intensity={2.6} position={[3, 2, 2]} scale={3} color="#dcebff" />
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
  word = "BEFORE\nTHE LEAP",
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
          <Bloom mipmapBlur luminanceThreshold={1.0} luminanceSmoothing={0.5} intensity={0.22} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
