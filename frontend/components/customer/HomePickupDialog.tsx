"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { pickup } from "@/data/pickup";
import {
  formatPickupDate,
  getPickupSlots,
  isSlotAllowed,
  pickupDateRelation,
  type PickupAvailability,
  type PickupDateOption,
} from "@/lib/preorder";
import {
  getPickupContextState,
  type PickupContextState,
  type PickupSelection,
  savePickupSelection,
} from "@/lib/pickup-selection";
import { useLiveNow } from "@/lib/use-live-now";

export interface PickupContextProps {
  /** Lead-time copy shown to customers; defaults to the six-hour contract. */
  leadTimeHours?: number;
  /** Optional destination for the home entry point; omitted means stay put. */
  navigateTo?: string;
  /** Label for an unselected context, e.g. "Order now" on the home entry. */
  emptyActionLabel?: string;
  /** Receives only persisted, currently valid selections. */
  onSelectionChange?: (selection: PickupSelection | null) => void;
}

interface HomePickupDialogProps {
  leadTimeHours: number;
}

function selectionLabel(
  selection: PickupSelection,
  availability: PickupAvailability | null,
): string {
  if (availability?.today.value === selection.date) {
    return `Today · ${selection.time}`;
  }

  const option = availability?.dates.find(
    (dateOption) => dateOption.value === selection.date,
  );
  const relation = availability
    ? pickupDateRelation(selection.date, availability.today.value)
    : null;
  const dateLabel = option?.label ?? formatPickupDate(selection.date);
  return `${relation ? `${relation} · ` : ""}${dateLabel} · ${selection.time}`;
}

function availabilityMessage(availability: PickupAvailability): string {
  if (availability.today.available) {
    return `Order for today by ${availability.today.cutoff} Singapore time.`;
  }

  const earliest = availability.earliestNext;
  if (!earliest) return "No pickup times are available right now.";

  const closedMessage = availability.today.cutoff
    ? `Today’s preorder cutoff was ${availability.today.cutoff}.`
    : "Closed today.";
  const relation = pickupDateRelation(
    earliest.date.value,
    availability.today.value,
  );
  const dateLabel = relation
    ? `${relation} (${earliest.date.label})`
    : earliest.date.label;
  return `${closedMessage} Next pickup: ${dateLabel} · ${earliest.time}.`;
}

function pickupOptionLabel(
  option: PickupDateOption,
  availability: PickupAvailability | null,
): string {
  if (!availability) return option.label;
  const relation = pickupDateRelation(
    option.value,
    availability.today.value,
  );
  return `${relation ? `${relation} · ` : ""}${option.label}`;
}

function applyContext(
  context: PickupContextState,
  setAvailability: (value: PickupAvailability) => void,
  setDates: (value: PickupDateOption[]) => void,
  setDate: (value: string) => void,
  setSlots: (value: string[]) => void,
  setTime: (value: string) => void,
  setSelection: (value: PickupSelection | null) => void,
  onSelectionChange?: (selection: PickupSelection | null) => void,
) {
  setAvailability(context.availability);
  setDates(context.availability.dates);
  setDate(context.date);
  setSlots(context.slots);
  setTime(context.time);
  setSelection(context.selection);
  onSelectionChange?.(context.selection);
}

/**
 * Compact pickup context for menu, cart, and checkout. It stays on the
 * current route after saving unless a caller explicitly supplies `navigateTo`.
 */
export function PickupContext({
  leadTimeHours = pickup.leadTimeHours,
  navigateTo,
  emptyActionLabel = "Choose pickup",
  onSelectionChange,
}: PickupContextProps) {
  const router = useRouter();
  const now = useLiveNow();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [dates, setDates] = useState<PickupDateOption[]>([]);
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [time, setTime] = useState("");
  const [error, setError] = useState("");
  const [selection, setSelection] = useState<PickupSelection | null>(null);
  const [availability, setAvailability] = useState<PickupAvailability | null>(
    null,
  );

  useEffect(() => {
    if (open) return;
    applyContext(
      getPickupContextState(now),
      setAvailability,
      setDates,
      setDate,
      setSlots,
      setTime,
      setSelection,
      onSelectionChange,
    );
  }, [now, onSelectionChange, open]);

  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        "button:not([disabled]), select:not([disabled]), input:not([disabled]), textarea:not([disabled]), a[href]",
      );
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      trigger?.focus();
    };
  }, [open]);

  function prepareAndOpen() {
    const actionNow = new Date();
    applyContext(
      getPickupContextState(actionNow),
      setAvailability,
      setDates,
      setDate,
      setSlots,
      setTime,
      setSelection,
      onSelectionChange,
    );
    setError("");
    setOpen(true);
  }

  function closeDialog() {
    setOpen(false);
  }

  function handleDateChange(nextDate: string) {
    const nextSlots = getPickupSlots(nextDate, new Date());
    setDate(nextDate);
    setSlots(nextSlots);
    setTime(nextSlots[0] ?? "");
    setError("");
  }

  function handleContinue() {
    const actionNow = new Date();
    if (!date || !time || !isSlotAllowed(date, time, actionNow)) {
      setError("Choose an available pickup slot.");
      return;
    }

    const nextSelection = { date, time };
    savePickupSelection(nextSelection, actionNow);
    setSelection(nextSelection);
    onSelectionChange?.(nextSelection);
    setOpen(false);
    if (navigateTo) router.push(navigateTo);
  }

  return (
    <>
      <div className="space-y-2">
        <p className="text-base font-medium text-stone-700" aria-live="polite">
          <span className="font-bold text-stone-950">Pickup</span>{" "}
          {selection
            ? selectionLabel(selection, availability)
            : "No time selected"}
        </p>
        {availability ? (
          <p className="text-sm font-medium leading-6 text-stone-600">
            {availabilityMessage(availability)}
          </p>
        ) : null}
        <button
          ref={triggerRef}
          type="button"
          className="btn-primary min-h-12 text-base"
          onClick={prepareAndOpen}
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          {selection ? "Edit pickup" : emptyActionLabel}{" "}
          <span aria-hidden="true" className="ml-2 text-lg">→</span>
        </button>
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-stone-950/25 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeDialog();
          }}
        >
          <section
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="pickup-dialog-title"
            aria-describedby="pickup-dialog-description"
            className="surface-glass-strong max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto p-5 sm:p-6"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="pickup-dialog-title"
                  className="font-display text-3xl font-medium text-stone-950"
                >
                  Choose a time
                </h2>
                <p
                  id="pickup-dialog-description"
                  className="mt-2 text-sm text-stone-600"
                >
                  {leadTimeHours}-hour notice. {availability ? availabilityMessage(availability) : ""}
                </p>
              </div>
              <button
                ref={closeRef}
                type="button"
                className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-full text-2xl text-stone-500 outline-none transition hover:bg-white/70 hover:text-stone-950 focus-visible:ring-2 focus-visible:ring-brand"
                onClick={closeDialog}
                aria-label="Close pickup time"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label
                className="block text-sm font-semibold text-stone-800"
                htmlFor="pickup-context-date"
              >
                Date
                <select
                  id="pickup-context-date"
                  value={date}
                  onChange={(event) => handleDateChange(event.target.value)}
                  className="input mt-1"
                  disabled={dates.length === 0}
                >
                  {dates.map((option) => (
                    <option key={option.value} value={option.value}>
                      {pickupOptionLabel(option, availability)}
                    </option>
                  ))}
                </select>
              </label>

              <label
                className="block text-sm font-semibold text-stone-800"
                htmlFor="pickup-context-time"
              >
                Time
                <select
                  id="pickup-context-time"
                  value={time}
                  onChange={(event) => {
                    setTime(event.target.value);
                    setError("");
                  }}
                  className="input mt-1"
                  disabled={slots.length === 0}
                >
                  {slots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {dates.length === 0 ? (
              <p role="status" className="mt-4 text-sm text-stone-600">
                No pickup times are available right now.
              </p>
            ) : null}

            {error ? (
              <p role="alert" className="form-error mt-4">
                {error}
              </p>
            ) : null}

            <button
              type="button"
              className="btn-primary mt-6 w-full"
              onClick={handleContinue}
              disabled={!date || !time || dates.length === 0 || slots.length === 0}
            >
              {navigateTo ? "Continue to menu" : "Save pickup"}{" "}
              <span aria-hidden="true">→</span>
            </button>
          </section>
        </div>
      ) : null}
    </>
  );
}

/** Home entry point: choosing pickup continues into the menu. */
export function HomePickupDialog({ leadTimeHours }: HomePickupDialogProps) {
  return (
    <PickupContext
      leadTimeHours={leadTimeHours}
      navigateTo="/menu"
      emptyActionLabel="Order now"
    />
  );
}
