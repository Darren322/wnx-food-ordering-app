import type { Metadata } from "next";
import { PrototypeSwitcher, type PrototypeVariant } from "@/components/prototype/PrototypeSwitcher";
import { VariantA } from "@/components/prototype/VariantA";
import { VariantB } from "@/components/prototype/VariantB";
import { VariantC } from "@/components/prototype/VariantC";
import "./prototype.css";

export const metadata: Metadata = {
  title: "Homepage design prototype",
  robots: { index: false, follow: false },
};

interface HomePrototypePageProps {
  searchParams: Promise<{ variant?: string | string[] }>;
}

const prototypeVariants: Record<PrototypeVariant, React.ComponentType> = {
  A: VariantA,
  B: VariantB,
  C: VariantC,
};

function parseVariant(value: string | string[] | undefined): PrototypeVariant {
  const candidate = Array.isArray(value) ? value[0] : value;
  const normalized = candidate?.toUpperCase();
  return normalized === "B" || normalized === "C" ? normalized : "A";
}

/**
 * PROTOTYPE — throwaway UI used to choose a homepage direction.
 * Three variants share real storefront data and switch through `?variant=`.
 * The selected concept must be rewritten for production after owner review.
 */
export default async function HomePrototypePage({ searchParams }: HomePrototypePageProps) {
  const variant = parseVariant((await searchParams).variant);
  const SelectedVariant = prototypeVariants[variant];

  return (
    <div className="prototype-home" data-prototype-variant={variant}>
      <div className="prototype-enter">
        <SelectedVariant />
      </div>
      <PrototypeSwitcher current={variant} />
    </div>
  );
}
