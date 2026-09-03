import type { Metadata } from "next";
import OilOilClone from "@/components/sites/oiloil-org-5c46804e/root-8a5edab2/OilOilClone";

export const metadata: Metadata = {
  title: { absolute: "WEN® Night Lab — Backup Preview" },
  description: "A dark Night Lab backup of the WEN® interface.",
};

export default function OilOilCloneNightPage() {
  return <OilOilClone theme="night" />;
}
