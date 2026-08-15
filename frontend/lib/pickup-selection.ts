import { isSlotAllowed } from "@/lib/preorder";

/**
 * The small pickup context that follows a customer from the home page to
 * checkout. Keep this separate from the cart so a customer can choose a
 * pickup window before deciding what to eat.
 */
export interface PickupSelection {
  date: string;
  time: string;
}

interface StoredPickupSelection extends PickupSelection {
  version: 1;
}

export const PICKUP_SELECTION_STORAGE_KEY = "wnx-pickup-selection-v1";

function clientStorage(): Storage | null {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage;
  } catch {
    // Private browsing and storage policies can make localStorage unavailable.
    return null;
  }
}

function isSelectionShape(value: unknown): value is PickupSelection {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<PickupSelection>;
  return (
    typeof candidate.date === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(candidate.date) &&
    typeof candidate.time === "string" &&
    /^\d{2}:\d{2}$/.test(candidate.time)
  );
}

/** A slot can be stored only if it is currently a valid pickup option. */
export function isValidPickupSelection(
  selection: PickupSelection,
  now: Date = new Date(),
): boolean {
  return isSelectionShape(selection) && isSlotAllowed(selection.date, selection.time, now);
}

/**
 * Persist a valid selection. A failed storage write should never block an
 * order, so this returns false instead of surfacing a browser storage error.
 */
export function savePickupSelection(
  selection: PickupSelection,
  now: Date = new Date(),
): boolean {
  if (!isValidPickupSelection(selection, now)) return false;

  const storage = clientStorage();
  if (!storage) return false;

  const record: StoredPickupSelection = {
    version: 1,
    date: selection.date,
    time: selection.time,
  };

  try {
    storage.setItem(PICKUP_SELECTION_STORAGE_KEY, JSON.stringify(record));
    return true;
  } catch {
    return false;
  }
}

/**
 * Read only a current, versioned selection. Stale or malformed values are
 * ignored so checkout can safely choose its normal earliest-valid fallback.
 */
export function loadPickupSelection(
  now: Date = new Date(),
): PickupSelection | null {
  const storage = clientStorage();
  if (!storage) return null;

  try {
    const raw = storage.getItem(PICKUP_SELECTION_STORAGE_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (
      !parsed ||
      typeof parsed !== "object" ||
      (parsed as Partial<StoredPickupSelection>).version !== 1 ||
      !isSelectionShape(parsed)
    ) {
      return null;
    }

    const selection: PickupSelection = {
      date: parsed.date,
      time: parsed.time,
    };

    return isValidPickupSelection(selection, now) ? selection : null;
  } catch {
    return null;
  }
}
