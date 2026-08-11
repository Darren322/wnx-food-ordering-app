import type { Availability } from "@/types/product";

const styles: Record<Availability, string> = {
  available: "bg-green-100 text-green-800",
  sold_out: "bg-red-100 text-red-800",
  unavailable: "bg-neutral-200 text-neutral-600",
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
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[availability]}`}
    >
      {labels[availability]}
    </span>
  );
}
