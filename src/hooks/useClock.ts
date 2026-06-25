import { useEffect, useState } from "react";

const fmt = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
  timeZone: "Asia/Shanghai"
});

// Live GMT+8 clock, independent of the viewer's locale. Starts as a placeholder
// so server and first client render match (no hydration mismatch).
export function useClock() {
  const [time, setTime] = useState("--:--:--");
  useEffect(() => {
    const update = () => setTime(fmt.format(new Date()));
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, []);
  return time;
}
