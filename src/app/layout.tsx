import type { Metadata } from "next";
import localFont from "next/font/local";
import Shell from "@/components/Shell";
import "./globals.css";

// Self-hosted (next/font/local) so the build never fetches Google Fonts.
const display = localFont({
  src: "../fonts/BricolageGrotesque.woff2",
  variable: "--ff-display",
  weight: "200 800",
  display: "swap"
});
const body = localFont({
  src: "../fonts/SpaceGrotesk.woff2",
  variable: "--ff-body",
  weight: "300 700",
  display: "swap"
});
const mono = localFont({
  src: [
    { path: "../fonts/SpaceMono-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/SpaceMono-Bold.woff2", weight: "700", style: "normal" }
  ],
  variable: "--ff-mono",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://wenweb.net"),
  title: {
    default: "WENWEB — AI Systems & Automation",
    template: "%s — WENWEB"
  },
  description:
    "AI automation, prompt systems, agent integration, knowledge architecture, and one-person company operations.",
  openGraph: {
    type: "website",
    title: "WENWEB — AI Systems & Automation",
    description:
      "AI automation, prompt systems, agent integration, knowledge architecture, and one-person company operations.",
    url: "/",
    images: ["/assets/aica-2026.png"]
  },
  twitter: {
    card: "summary_large_image",
    title: "WENWEB — AI Systems & Automation",
    description: "AI automation, prompt systems, and one-person company operations."
  },
  icons: { icon: "/favicon.svg" }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
