import type { ReactNode } from "react";
import { business } from "@/data/business";
import { products } from "@/data/products";

export const glassPrototypeProducts = products
  .filter((product) => product.featured)
  .slice(0, 3);

export const glassPrototypeBusiness = business;

export function GlassPrototypeFrame({
  variant,
  summary,
  children,
}: {
  variant: string;
  summary: string;
  children: ReactNode;
}) {
  return (
    <div className="glass-prototype">
      <header className="gp-prototype-note">
        <div>
          <p className="gp-kicker">Throwaway design study · {variant}</p>
          <h1 className="gp-display text-3xl text-stone-950 sm:text-4xl">
            Restrained heritage glass
          </h1>
        </div>
        <p className="max-w-xl text-sm leading-6 text-stone-600">{summary}</p>
      </header>
      {children}
    </div>
  );
}

export function GlassPrototypePending({ variant }: { variant: string }) {
  return (
    <GlassPrototypeFrame
      variant={variant}
      summary="The shared glass material is ready. This design direction is being assembled without touching the production storefront."
    >
      <section className="gp-solid mt-7 p-8 text-center sm:p-12">
        <p className="gp-kicker">Prototype foundation</p>
        <h2 className="gp-display text-3xl text-stone-950">
          Building this comparison…
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-stone-600">
          Home, Menu, Cart, and Admin examples will appear here as each variant
          is completed.
        </p>
      </section>
    </GlassPrototypeFrame>
  );
}
