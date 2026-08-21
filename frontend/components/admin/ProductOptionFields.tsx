"use client";

import type {
  CheckboxOption,
  ChoiceOption,
  ProductOptions,
  RequiredChoiceGroup,
  SizeOption,
} from "@/types/product";
import { parseDollarsToCents } from "@/lib/currency";

interface ProductOptionFieldsProps {
  sizes: SizeOption[];
  choiceGroup?: RequiredChoiceGroup;
  checkboxes: CheckboxOption[];
  updateOptions: (patch: Partial<ProductOptions>) => void;
  removeRequiredChoice: () => void;
}

const inputCls = "input mt-2 text-sm";
const inlineInputCls = "input min-h-11 min-w-0 px-3 py-2 text-sm";
const labelCls = "block text-sm font-semibold text-stone-800";
const fieldsetCls =
  "rounded-[var(--radius-content)] border border-stone-300 bg-surface p-4 sm:p-5";
const helperCls = "mt-1 text-xs leading-5 text-stone-500";
const rowActionCls = "text-link min-h-11 text-sm text-brand-dark";

function sizeId() {
  return `size-${Date.now().toString(36)}`;
}

function choiceId() {
  return `choice-${Date.now().toString(36)}`;
}

function checkboxId() {
  return `box-${Date.now().toString(36)}`;
}

export function ProductOptionFields({
  sizes,
  choiceGroup,
  checkboxes,
  updateOptions,
  removeRequiredChoice,
}: ProductOptionFieldsProps) {
  return (
    <div className="space-y-5">
      <fieldset className={fieldsetCls}>
        <legend className="px-1 font-display text-xl font-medium text-stone-950">
          Sizes
        </legend>
        <p className={helperCls}>
          Add sizes only when the dish has different prices. Remove all sizes
          to use one fixed price.
        </p>
        <div className="mt-4 space-y-3">
          {sizes.map((size, index) => (
            <div
              key={size.id}
              className="border-t border-stone-200 pt-3 first:border-t-0 first:pt-0"
            >
              <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_7rem] sm:items-end">
                <label className={labelCls} htmlFor={`size-name-${size.id}`}>
                  Size name
                  <input
                    id={`size-name-${size.id}`}
                    type="text"
                    value={size.name}
                    placeholder="e.g. Regular"
                    onChange={(e) =>
                      updateOptions({
                        sizes: sizes.map((item, itemIndex) =>
                          itemIndex === index
                            ? { ...item, name: e.target.value }
                            : item
                        ),
                      })
                    }
                    className={inlineInputCls}
                  />
                </label>
                <label className={labelCls} htmlFor={`size-price-${size.id}`}>
                  Price (SGD)
                  <input
                    id={`size-price-${size.id}`}
                    type="number"
                    min="0"
                    step="0.10"
                    value={(size.priceCents / 100).toFixed(2)}
                    onChange={(e) =>
                      updateOptions({
                        sizes: sizes.map((item, itemIndex) =>
                          itemIndex === index
                            ? {
                                ...item,
                                priceCents:
                                  parseDollarsToCents(e.target.value) ?? 0,
                              }
                            : item
                        ),
                      })
                    }
                    className={inlineInputCls}
                  />
                </label>
              </div>
              <button
                type="button"
                onClick={() =>
                  updateOptions({
                    sizes: sizes.filter((_, itemIndex) => itemIndex !== index),
                  })
                }
                aria-label={`Remove ${size.name || `size ${index + 1}`}`}
                className={`${rowActionCls} mt-2`}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() =>
            updateOptions({
              sizes: [
                ...sizes,
                { id: sizeId(), name: "", priceCents: 0 },
              ],
            })
          }
          className={`${rowActionCls} mt-4`}
        >
          + Add size
        </button>
      </fieldset>

      <fieldset className={fieldsetCls}>
        <legend className="max-w-full px-1 font-display text-xl font-medium leading-tight text-stone-950">
          Required choice
        </legend>
        <p className={helperCls}>
          Guests choose one option, such as a spice level. Leave this off when
          the dish has no required choice.
        </p>
        {choiceGroup ? (
          <>
            <label className={`${labelCls} mt-4`}>
              Option group name
              <input
                type="text"
                value={choiceGroup.name}
                onChange={(e) =>
                  updateOptions({
                    requiredChoice: {
                      ...choiceGroup,
                      name: e.target.value,
                    },
                  })
                }
                className={inputCls}
              />
            </label>
            <div className="mt-4 space-y-3">
              {choiceGroup.choices.map((choice, index) => (
                <div
                  key={choice.id}
                  className="border-t border-stone-200 pt-3 first:border-t-0 first:pt-0"
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label
                      className={labelCls}
                      htmlFor={`choice-name-${choice.id}`}
                    >
                      Choice name
                      <input
                        id={`choice-name-${choice.id}`}
                        type="text"
                        value={choice.name}
                        placeholder="e.g. Mild"
                        onChange={(e) =>
                          updateOptions({
                            requiredChoice: {
                              ...choiceGroup,
                              choices: updateChoiceNames(
                                choiceGroup.choices,
                                index,
                                { name: e.target.value }
                              ),
                            },
                          })
                        }
                        className={inlineInputCls}
                      />
                    </label>
                    <label
                      className={labelCls}
                      htmlFor={`choice-description-${choice.id}`}
                    >
                      Short description
                      <input
                        id={`choice-description-${choice.id}`}
                        type="text"
                        value={choice.description ?? ""}
                        placeholder="Optional"
                        onChange={(e) =>
                          updateOptions({
                            requiredChoice: {
                              ...choiceGroup,
                              choices: updateChoiceNames(
                                choiceGroup.choices,
                                index,
                                { description: e.target.value || undefined }
                              ),
                            },
                          })
                        }
                        className={inlineInputCls}
                      />
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      updateOptions({
                        requiredChoice: {
                          ...choiceGroup,
                          choices: choiceGroup.choices.filter(
                            (_, itemIndex) => itemIndex !== index
                          ),
                        },
                      })
                    }
                    aria-label={`Remove ${choice.name || `choice ${index + 1}`}`}
                    className={`${rowActionCls} mt-2`}
                  >
                Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-stone-200 pt-3">
              <button
                type="button"
                onClick={() =>
                  updateOptions({
                    requiredChoice: {
                      ...choiceGroup,
                      choices: [
                        ...choiceGroup.choices,
                        { id: choiceId(), name: "" },
                      ],
                    },
                  })
                }
                className={rowActionCls}
              >
                + Add choice
              </button>
              <button
                type="button"
                onClick={removeRequiredChoice}
                className="text-link min-h-11 text-sm"
              >
                Remove this option group
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() =>
              updateOptions({
                requiredChoice: {
                  name: "Spice level",
                  choices: [{ id: choiceId(), name: "" }],
                },
              })
            }
            className={`${rowActionCls} mt-4`}
          >
            + Add required single-choice option
          </button>
        )}
      </fieldset>

      <fieldset className={fieldsetCls}>
        <legend className="max-w-full px-1 font-display text-xl font-medium leading-tight text-stone-950">
          Optional preferences
        </legend>
        <p className={helperCls}>
          Add checkboxes for requests such as “No bean sprouts.”
        </p>
        <div className="mt-4 space-y-3">
          {checkboxes.map((box, index) => (
            <div
              key={box.id}
              className="border-t border-stone-200 pt-3 first:border-t-0 first:pt-0"
            >
              <label className={labelCls} htmlFor={`checkbox-name-${box.id}`}>
                Preference label
                <input
                  id={`checkbox-name-${box.id}`}
                  type="text"
                  value={box.name}
                  placeholder="e.g. No bean sprouts"
                  onChange={(e) =>
                    updateOptions({
                      checkboxes: checkboxes.map((item, itemIndex) =>
                        itemIndex === index
                          ? { ...item, name: e.target.value }
                          : item
                      ),
                    })
                  }
                  className={inlineInputCls}
                />
              </label>
              <button
                type="button"
                onClick={() =>
                  updateOptions({
                    checkboxes: checkboxes.filter(
                      (_, itemIndex) => itemIndex !== index
                    ),
                  })
                }
                aria-label={`Remove ${box.name || `checkbox ${index + 1}`}`}
                className={`${rowActionCls} mt-2`}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() =>
            updateOptions({
              checkboxes: [...checkboxes, { id: checkboxId(), name: "" }],
            })
          }
          className={`${rowActionCls} mt-4`}
        >
          + Add checkbox
        </button>
      </fieldset>
    </div>
  );
}

function updateChoiceNames(
  choices: ChoiceOption[],
  index: number,
  patch: Partial<ChoiceOption>
): ChoiceOption[] {
  return choices.map((choice, choiceIndex) =>
    choiceIndex === index ? { ...choice, ...patch } : choice
  );
}
