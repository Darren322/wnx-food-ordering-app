"use client";

import { useCallback, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const variants = [
  { key: "A", name: "Quiet editorial" },
  { key: "B", name: "Fast order counter" },
  { key: "C", name: "Heritage-led" },
] as const;

export type PrototypeVariant = (typeof variants)[number]["key"];

interface PrototypeSwitcherProps {
  current: PrototypeVariant;
}

export function PrototypeSwitcher({ current }: PrototypeSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectVariant = useCallback(
    (direction: -1 | 1) => {
      const currentIndex = variants.findIndex((variant) => variant.key === current);
      const nextIndex = (currentIndex + direction + variants.length) % variants.length;
      const params = new URLSearchParams(searchParams.toString());
      params.set("variant", variants[nextIndex].key);
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

  const label = variants.find((variant) => variant.key === current)?.name;

  return (
    <aside
      aria-label="Prototype design switcher"
      className="fixed inset-x-0 bottom-5 z-50 mx-auto flex w-fit items-center gap-2 rounded-full border border-white/15 bg-stone-950/95 p-1.5 text-white shadow-2xl shadow-stone-950/30 backdrop-blur"
    >
      <button
        type="button"
        onClick={() => selectVariant(-1)}
        aria-label="Previous design variant"
        className="grid size-11 place-items-center rounded-full text-lg transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        ←
      </button>
      <p className="min-w-44 px-3 text-center text-xs font-semibold tracking-wide" aria-live="polite">
        <span className="text-amber-300">{current}</span>
        <span aria-hidden="true"> — </span>
        {label}
      </p>
      <button
        type="button"
        onClick={() => selectVariant(1)}
        aria-label="Next design variant"
        className="grid size-11 place-items-center rounded-full text-lg transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        →
      </button>
    </aside>
  );
}
