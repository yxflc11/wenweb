// Shared warp intensity (0–1), written by WarpDriver on scroll and read every
// frame by the BackgroundScene canvas. Backed by a window global so it stays a
// true singleton even if this tiny module ends up duplicated across chunks.
declare global {
  interface Window {
    __warp?: number;
  }
}

export const warp = {
  get value(): number {
    return (typeof window !== "undefined" ? window.__warp : 0) ?? 0;
  },
  set value(v: number) {
    if (typeof window !== "undefined") window.__warp = v;
  }
};
