import type { Availability } from "@/types/product";

const styles: Record<Availability, string> = {
  available: "",
  sold_out: "bg-brand-50 text-brand-dark ring-1 ring-brand/15",
  unavailable: "bg-stone-200 text-stone-700 ring-1 ring-stone-300",
};

const labels: Record<Availability, string> = {
  available: "Available",
  sold_out: "Sold out",
  unavailable: "Unavailable",
};

export function AvailabilityBadge({
  availability,
}: {
  availability: Availability;
}) {
  if (availability === "available") return null;

  return (
    <span
      className={`inline-flex min-h-7 items-center rounded-full px-3 py-1 text-xs font-semibold ${styles[availability]}`}
    >
      {labels[availability]}
    </span>
  );
}
