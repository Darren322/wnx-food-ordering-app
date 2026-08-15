import type { Metadata } from "next";
import {
  GlassPrototypeSwitcher,
  type GlassPrototypeVariant,
} from "@/components/prototype/glass/GlassPrototypeSwitcher";
import { GlassVariantA } from "@/components/prototype/glass/GlassVariantA";
import { GlassVariantB } from "@/components/prototype/glass/GlassVariantB";
import { GlassVariantB2 } from "@/components/prototype/glass/GlassVariantB2";
import { GlassVariantC } from "@/components/prototype/glass/GlassVariantC";
import "./glass-prototype.css";

export const metadata: Metadata = {
  title: "Heritage glass design prototype",
  robots: { index: false, follow: false },
};

interface GlassPrototypePageProps {
  searchParams: Promise<{ variant?: string | string[] }>;
}

const prototypeVariants: Record<GlassPrototypeVariant, React.ComponentType> = {
  A: GlassVariantA,
  B: GlassVariantB,
  B2: GlassVariantB2,
  C: GlassVariantC,
};

function parseVariant(
  value: string | string[] | undefined,
): GlassPrototypeVariant {
  const candidate = Array.isArray(value) ? value[0] : value;
  const normalized = candidate?.toUpperCase();
  return normalized === "B" || normalized === "B2" || normalized === "C"
    ? normalized
    : "A";
}

/**
 * PROTOTYPE — throwaway UI for choosing an app-wide glass material direction.
 * It is read-only and must not be promoted directly into production pages.
 */
export default async function GlassPrototypePage({
  searchParams,
}: GlassPrototypePageProps) {
  const variant = parseVariant((await searchParams).variant);
  const SelectedVariant = prototypeVariants[variant];

  return (
    <div className="gp-enter" data-glass-prototype-variant={variant}>
      <SelectedVariant />
      <GlassPrototypeSwitcher current={variant} />
    </div>
  );
}
