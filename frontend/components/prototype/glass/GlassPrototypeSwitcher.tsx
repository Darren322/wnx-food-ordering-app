"use client";

import { useCallback, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const glassVariants = [
  { key: "A", name: "Frosted Frame" },
  { key: "B", name: "Layered Counter" },
  { key: "B2", name: "Restrained Counter" },
  { key: "C", name: "Quiet Lens" },
] as const;

export type GlassPrototypeVariant = (typeof glassVariants)[number]["key"];

export function GlassPrototypeSwitcher({
  current,
}: {
  current: GlassPrototypeVariant;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectVariant = useCallback(
    (direction: -1 | 1) => {
      const currentIndex = glassVariants.findIndex(
        (variant) => variant.key === current,
      );
      const nextIndex =
        (currentIndex + direction + glassVariants.length) % glassVariants.length;
      const params = new URLSearchParams(searchParams.toString());
      params.set("variant", glassVariants[nextIndex].key);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [current, pathname, router, searchParams],
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        (target instanceof HTMLElement && target.isContentEditable)
      ) {
        return;
      }

      if (event.key === "ArrowLeft") selectVariant(-1);
      if (event.key === "ArrowRight") selectVariant(1);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectVariant]);

  if (process.env.NODE_ENV === "production") return null;

  const label = glassVariants.find((variant) => variant.key === current)?.name;

  return (
    <aside
      aria-label="Glass design prototype switcher"
      className="fixed inset-x-0 bottom-5 z-50 mx-auto flex w-fit max-w-[calc(100%-2rem)] items-center gap-1 rounded-full border border-white/15 bg-stone-950/95 p-1.5 text-white shadow-2xl shadow-stone-950/30 backdrop-blur"
    >
      <button
        type="button"
        onClick={() => selectVariant(-1)}
        aria-label="Previous glass design"
        className="grid size-11 shrink-0 place-items-center rounded-full text-lg transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        ←
      </button>
      <p
        className="min-w-0 px-3 text-center text-xs font-semibold tracking-wide sm:min-w-48"
        aria-live="polite"
      >
        <span className="text-amber-300">{current}</span>
        <span aria-hidden="true"> — </span>
        {label}
      </p>
      <button
        type="button"
        onClick={() => selectVariant(1)}
        aria-label="Next glass design"
        className="grid size-11 shrink-0 place-items-center rounded-full text-lg transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        →
      </button>
    </aside>
  );
}
