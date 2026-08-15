"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getPickupDates,
  getPickupSlots,
  isSlotAllowed,
  type PickupDateOption,
} from "@/lib/preorder";
import {
  loadPickupSelection,
  savePickupSelection,
} from "@/lib/pickup-selection";

interface HomePickupDialogProps {
  leadTimeHours: number;
}

/**
 * A deliberately small pickup decision before the customer enters the menu.
 * The slot is remembered so the rest of the order can stay focused on food.
 */
export function HomePickupDialog({ leadTimeHours }: HomePickupDialogProps) {
  const router = useRouter();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [dates, setDates] = useState<PickupDateOption[]>([]);
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [time, setTime] = useState("");
  const [error, setError] = useState("");

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
    const now = new Date();
    const nextDates = getPickupDates(now);
    const saved = loadPickupSelection(now);
    const savedDate = saved?.date;
    const nextDate =
      savedDate && nextDates.some((option) => option.value === savedDate)
        ? savedDate
        : nextDates[0]?.value ?? "";
    const nextSlots = nextDate ? getPickupSlots(nextDate, now) : [];
    const nextTime =
      saved && saved.date === nextDate && nextSlots.includes(saved.time)
        ? saved.time
        : nextSlots[0] ?? "";

    setDates(nextDates);
    setDate(nextDate);
    setSlots(nextSlots);
    setTime(nextTime);
    setError("");
    setOpen(true);
  }

  function closeDialog() {
    setOpen(false);
  }

  function handleDateChange(nextDate: string) {
    const nextSlots = getPickupSlots(nextDate);
    setDate(nextDate);
    setSlots(nextSlots);
    setTime(nextSlots[0] ?? "");
    setError("");
  }

  function handleContinue() {
    if (!date || !time || !isSlotAllowed(date, time)) {
      setError("Choose an available pickup slot.");
      return;
    }

    savePickupSelection({ date, time });
    setOpen(false);
    router.push("/menu");
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="btn-primary min-h-11"
        onClick={prepareAndOpen}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        Order now <span aria-hidden="true" className="ml-2 text-lg">→</span>
      </button>

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
                <h2 id="pickup-dialog-title" className="font-display text-3xl font-medium text-stone-950">
                  Choose a time
                </h2>
                <p id="pickup-dialog-description" className="mt-2 text-sm text-stone-600">
                  {leadTimeHours}-hour notice.
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
              <label className="block text-sm font-semibold text-stone-800" htmlFor="home-pickup-date">
                Date
                <select
                  id="home-pickup-date"
                  value={date}
                  onChange={(event) => handleDateChange(event.target.value)}
                  className="input mt-1"
                  disabled={dates.length === 0}
                >
                  {dates.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-semibold text-stone-800" htmlFor="home-pickup-time">
                Time
                <select
                  id="home-pickup-time"
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
              Continue to menu <span aria-hidden="true">→</span>
            </button>
          </section>
        </div>
      ) : null}
    </>
  );
}
