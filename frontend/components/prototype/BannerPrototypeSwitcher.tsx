"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const variants = [
  { key: "A", name: "Full-width photo" },
  { key: "B", name: "Warm split" },
  { key: "C", name: "Editorial split" },
] as const;

export function BannerPrototypeSwitcher({ current }: { current: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentIndex = Math.max(
    0,
    variants.findIndex((variant) => variant.key === current),
  );

  function select(index: number) {
    const next = variants[(index + variants.length) % variants.length];
    const params = new URLSearchParams(searchParams.toString());
    params.set("variant", next.key);
    router.replace(`${pathname}?${params.toString()}`);
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (
        target?.matches("input, textarea, select, [contenteditable='true']")
      ) {
        return;
      }

      if (event.key === "ArrowLeft") select(currentIndex - 1);
      if (event.key === "ArrowRight") select(currentIndex + 1);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  if (process.env.NODE_ENV === "production") return null;

  const active = variants[currentIndex];

  return (
    <aside className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-stone-950 p-2 text-white shadow-xl">
      <button
        type="button"
        onClick={() => select(currentIndex - 1)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-xl outline-none hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white"
        aria-label="Previous banner variation"
      >
        ←
      </button>
      <p className="min-w-44 px-2 text-center text-sm font-semibold">
        {active.key} — {active.name}
      </p>
      <button
        type="button"
        onClick={() => select(currentIndex + 1)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-xl outline-none hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white"
        aria-label="Next banner variation"
      >
        →
      </button>
    </aside>
  );
}
