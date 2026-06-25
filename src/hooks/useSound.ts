import { useCallback, useEffect, useRef, useState } from "react";

// A tiny WebAudio "tick" for hover/click feedback. No audio assets needed.
export function useSound() {
  // SSR-safe default; the saved preference is read on mount.
  const [soundOn, setSoundOn] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem("bw-sound") === "on") setSoundOn(true);
    } catch {
      /* ignore */
    }
  }, []);

  const ctxRef = useRef<AudioContext | null>(null);
  const onRef = useRef(soundOn);
  onRef.current = soundOn;

  const tick = useCallback((freq = 320, dur = 0.045, gain = 0.04) => {
    if (!onRef.current) return;
    try {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = ctxRef.current ?? (ctxRef.current = new Ctx());
      if (ctx.state === "suspended") void ctx.resume();
      const osc = ctx.createOscillator();
      const amp = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      amp.gain.value = gain;
      osc.connect(amp).connect(ctx.destination);
      const now = ctx.currentTime;
      amp.gain.setValueAtTime(gain, now);
      amp.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      osc.start(now);
      osc.stop(now + dur);
    } catch {
      /* audio unavailable — silent */
    }
  }, []);

  const toggle = useCallback(() => {
    setSoundOn((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("bw-sound", next ? "on" : "off");
      } catch {
        /* ignore */
      }
      onRef.current = next;
      if (next) tick(520);
      return next;
    });
  }, [tick]);

  return { soundOn, toggle, tick };
}
