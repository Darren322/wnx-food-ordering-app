"use client";

import { useEffect, useState } from "react";
import type {
  Availability,
  Category,
  Product,
  ProductOptions,
} from "@/types/product";
import { centsToDollars, parseDollarsToCents } from "@/lib/currency";
import { ProductCard } from "@/components/customer/ProductCard";
import { ProductImage } from "@/components/ui/ProductImage";
import {
  loadCategories,
  loadProducts,
  resetProducts,
  saveCategories,
  saveProducts,
  slugify,
} from "@/components/admin/adminStore";

type Draft = Product;

function emptyProduct(categorySlug: string): Draft {
  return {
    slug: "",
    name: "",
    description: "",
    image: "/images/dry-laksa-placeholder.svg",
    priceCents: 0,
    category: categorySlug,
    availability: "available",
    featured: false,
  };
}

const inputCls = "input mt-2 text-sm";
const labelCls = "block text-sm font-semibold text-stone-800";
const inlineInputCls =
  "input min-h-11 min-w-0 rounded-xl px-3 py-2 text-sm";

/**
 * Product & category manager. Edits persist to localStorage as an overlay
 * on data/products.ts (see adminStore.ts) — the public site keeps rendering
 * from the central data files.
 */
export function ProductAdmin() {
  const [items, setItems] = useState<Product[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setItems(loadProducts());
    setCats(loadCategories());
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <p role="status" className="text-sm text-stone-500">
        Loading products…
      </p>
    );
  }

  function persist(next: Product[]) {
    setItems(next);
    saveProducts(next);
  }

  function persistCats(next: Category[]) {
    setCats(next);
    saveCategories(next);
  }

  function updateDraft(patch: Partial<Draft>) {
    setDraft((d) => (d ? { ...d, ...patch } : d));
  }

  function updateOptions(patch: Partial<ProductOptions>) {
    setDraft((d) =>
      d ? { ...d, options: { ...(d.options ?? {}), ...patch } } : d
    );
  }

  function handleImageFile(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setDraft((d) =>
          d
            ? { ...d, image: reader.result as string, imageWidth: undefined, imageHeight: undefined }
            : d
        );
      }
    };
    reader.readAsDataURL(file);
  }

  function saveDraft() {
    if (!draft) return;
    if (!draft.name.trim()) {
      setMessage("Product name is required.");
      return;
    }
    const hasSizes = (draft.options?.sizes ?? []).length > 0;
    if (!hasSizes && draft.priceCents == null) {
      setMessage("Set a price, or add sizes with their own prices.");
      return;
    }
    const slug = draft.slug.trim() || slugify(draft.name);
    if (!slug) {
      setMessage("Could not derive a slug — enter a product name.");
      return;
    }
    if (items.some((p) => p.slug === slug && p.slug !== draft.slug)) {
      setMessage(`Another product already uses the slug "${slug}".`);
      return;
    }
    const normalised: Product = { ...draft, slug };
    if (hasSizes) delete normalised.priceCents;
    if (
      !normalised.options ||
      (!normalised.options.sizes?.length &&
        !normalised.options.requiredChoice &&
        !normalised.options.checkboxes?.length)
    ) {
      delete normalised.options;
    }
    const next = items.some((p) => p.slug === slug)
      ? items.map((p) => (p.slug === slug ? normalised : p))
      : [...items, normalised];
    persist(next);
    setDraft(null);
    setIsNew(false);
    setMessage(`Saved "${normalised.name}".`);
  }

  const sizes = draft?.options?.sizes ?? [];
  const choiceGroup = draft?.options?.requiredChoice;
  const checkboxes = draft?.options?.checkboxes ?? [];

  return (
    <div className="space-y-8">
      {message ? (
        <p
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="rounded-2xl border border-stone-200 bg-surface px-4 py-3 text-sm text-stone-700 shadow-sm"
        >
          <span className="sr-only">Status: </span>
          {message}
        </p>
      ) : null}

      <section
        aria-labelledby="products-heading"
        className="surface-solid landing-panel overflow-hidden"
      >
        <div className="grid gap-5 border-b border-stone-200 px-5 py-6 sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] sm:items-end sm:px-8">
          <div>
            <p className="page-kicker mb-2">Menu catalogue</p>
            <h2 id="products-heading" className="section-title text-3xl">
              Products
            </h2>
            <p className="mt-2 text-sm leading-6 text-stone-500">
              Featured and availability updates save immediately. Edit a
              product to update its details.
            </p>
          </div>
          <div className="sm:justify-self-end">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-stone-500">
              Menu actions
            </p>
            <div className="flex flex-wrap gap-2 sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setDraft(emptyProduct(cats[0]?.slug ?? ""));
                  setIsNew(true);
                  setMessage("");
                }}
                className="btn-primary min-h-11 px-5 text-sm"
              >
                Add product
              </button>
              <button
                type="button"
                onClick={() => {
                  resetProducts();
                  setItems(loadProducts());
                  setMessage("Product edits reset to the defaults from data/products.ts.");
                }}
                className="btn-secondary min-h-11 px-4 text-sm"
              >
                Reset to defaults
              </button>
            </div>
          </div>
        </div>
        <ul role="list" className="divide-y divide-stone-200">
          {items.length === 0 ? (
            <li
              role="status"
              className="px-5 py-10 text-center text-sm text-stone-500 sm:px-8"
            >
              No products yet. Add the first dish to start the menu.
            </li>
          ) : null}
          {items.map((p) => (
            <li
              key={p.slug}
              className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8"
            >
              <div className="flex min-w-0 items-start gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-paper ring-1 ring-stone-200">
                  <ProductImage
                    src={p.image}
                    alt=""
                    width={p.imageWidth ?? 400}
                    height={p.imageHeight ?? 300}
                    fill
                    sizes="64px"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="break-words font-semibold text-stone-950">
                      {p.name}
                    </span>
                    {p.nameZh ? (
                      <span
                        lang="zh-Hans"
                        className="font-cjk text-sm text-stone-500"
                      >
                        {p.nameZh}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-stone-500">
                    <span>
                      {cats.find((c) => c.slug === p.category)?.name ?? p.category}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {p.priceCents != null
                        ? `SGD ${centsToDollars(p.priceCents)}`
                        : "Size pricing"}
                    </span>
                    {p.options ? (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>Custom options</span>
                      </>
                    ) : null}
                  </p>
                </div>
              </div>
              <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
                <label className="flex min-h-11 items-center gap-2 text-sm text-stone-600">
                  <span className="sr-only">Featured on homepage for {p.name}</span>
                  <input
                    type="checkbox"
                    checked={p.featured}
                    onChange={(e) =>
                      persist(
                        items.map((x) =>
                          x.slug === p.slug
                            ? { ...x, featured: e.target.checked }
                            : x
                        )
                      )
                    }
                    className="h-5 w-5 accent-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  />
                  <span>Featured</span>
                </label>
                <label className="sr-only" htmlFor={`availability-${p.slug}`}>
                  Availability for {p.name}
                </label>
                <select
                  id={`availability-${p.slug}`}
                  value={p.availability}
                  onChange={(e) =>
                    persist(
                      items.map((x) =>
                        x.slug === p.slug
                          ? {
                              ...x,
                              availability: e.target.value as Availability,
                            }
                          : x
                      )
                    )
                  }
                  className="input min-h-11 w-full py-2 text-sm sm:w-auto"
                >
                  <option value="available">Available</option>
                  <option value="sold_out">Sold out</option>
                  <option value="unavailable">Unavailable</option>
                </select>
                <button
                  type="button"
                  onClick={() => {
                    setDraft(JSON.parse(JSON.stringify(p)) as Draft);
                    setIsNew(false);
                    setMessage("");
                  }}
                  aria-label={`Edit ${p.name}`}
                  className="btn-secondary min-h-11 px-4 text-sm"
                >
                  Edit
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {draft ? (
        <section
          aria-labelledby="product-editor-heading"
          className="surface-solid landing-panel overflow-hidden p-5 sm:p-8"
        >
          <div className="mb-7 border-b border-stone-200 pb-6">
            <p className="page-kicker mb-2">Menu details</p>
            <h2 id="product-editor-heading" className="section-title text-3xl">
              {isNew ? "New product" : `Edit: ${draft.name || "(unnamed)"}`}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
              Draft details save when you choose Save product; the preview
              updates as you work.
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
            <div className="space-y-4">
              <div className="border-b border-stone-200 pb-4">
                <h3 className="font-display text-2xl font-medium text-stone-950">
                  Dish information
                </h3>
                <p className="mt-1 text-sm leading-6 text-stone-500">
                  Names, descriptions, and the menu category guests will see.
                </p>
              </div>
              <label className={labelCls}>
                Name
                <input
                  type="text"
                  value={draft.name}
                  onChange={(e) => updateDraft({ name: e.target.value })}
                  className={inputCls}
                />
              </label>
              <label className={labelCls}>
                Chinese name (optional)
                <input
                  type="text"
                  value={draft.nameZh ?? ""}
                  onChange={(e) =>
                    updateDraft({ nameZh: e.target.value || undefined })
                  }
                  className={inputCls}
                />
              </label>
              <label className={labelCls}>
                Page link
                <input
                  id="draft-slug"
                  type="text"
                  value={draft.slug}
                  onChange={(e) => updateDraft({ slug: slugify(e.target.value) })}
                  placeholder={slugify(draft.name) || "auto-from-name"}
                  aria-describedby="draft-slug-help"
                  className={inputCls}
                />
              </label>
              <p id="draft-slug-help" className="-mt-2 text-xs leading-5 text-stone-500">
                Used in the web address. Leave blank to create it from the
                product name.
              </p>
              <label className={labelCls}>
                Description
                <textarea
                  value={draft.description}
                  onChange={(e) => updateDraft({ description: e.target.value })}
                  rows={2}
                  className={inputCls}
                />
              </label>
              <label className={labelCls}>
                Category
                <select
                  value={draft.category}
                  onChange={(e) => updateDraft({ category: e.target.value })}
                  className={inputCls}
                >
                  {cats.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <p className="text-xs leading-5 text-stone-500">
                Category changes save automatically in this workspace.
              </p>

              <div className="border-t border-stone-200 pt-6">
                <h3 className="font-display text-2xl font-medium text-stone-950">
                  Price &amp; availability
                </h3>
                <p className="mt-1 text-sm leading-6 text-stone-500">
                  Set the current service status and whether this dish is featured.
                </p>
                <div className="mt-4 space-y-4">
                  {sizes.length === 0 ? (
                    <label className={labelCls}>
                      Price (SGD)
                      <input
                        type="number"
                        min="0"
                        step="0.10"
                        value={
                          draft.priceCents != null
                            ? centsToDollars(draft.priceCents)
                            : ""
                        }
                        onChange={(e) =>
                          updateDraft({
                            priceCents:
                              parseDollarsToCents(e.target.value) ?? undefined,
                          })
                        }
                        className={inputCls}
                      />
                    </label>
                  ) : (
                    <p className="text-sm leading-6 text-stone-500">
                      This product is priced per size — set prices in the Sizes
                      section below.
                    </p>
                  )}

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className={labelCls}>
                      Availability
                      <select
                        value={draft.availability}
                        onChange={(e) =>
                          updateDraft({
                            availability: e.target.value as Availability,
                          })
                        }
                        className={inputCls}
                      >
                        <option value="available">Available</option>
                        <option value="sold_out">Sold out</option>
                        <option value="unavailable">Unavailable</option>
                      </select>
                    </label>
                    <label className="mt-0 flex min-h-11 items-center gap-2 text-sm font-semibold text-stone-800 sm:mt-8">
                      <input
                        type="checkbox"
                        checked={draft.featured}
                        onChange={(e) =>
                          updateDraft({ featured: e.target.checked })
                        }
                        className="h-5 w-5 accent-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                      />
                      Feature on homepage
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="product-image-upload" className={labelCls}>
                  Product image
                </label>
                <input
                  id="product-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageFile(e.target.files?.[0])}
                  aria-describedby="product-image-help"
                  className="mt-2 block min-h-11 w-full rounded-xl border border-dashed border-stone-300 bg-white/70 px-3 py-2 text-sm text-stone-700 outline-none transition file:mr-3 file:rounded-full file:border-0 file:bg-paper file:px-3 file:py-1.5 file:font-semibold file:text-stone-700 focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/20"
                />
                <p id="product-image-help" className="mt-2 text-xs leading-5 text-stone-500">
                  Upload replaces the image preview (stored locally for this
                  prototype).
                </p>
              </div>

              <fieldset className="rounded-2xl border border-stone-200 bg-paper p-4 sm:p-5">
                <legend className="px-1 font-display text-xl font-medium text-stone-950">
                  Sizes
                </legend>
                {sizes.map((size, i) => (
                  <div
                    key={size.id}
                    className="mb-3 grid gap-2 sm:grid-cols-[minmax(0,1fr)_7rem_auto] sm:items-center"
                  >
                    <label className="sr-only" htmlFor={`size-name-${size.id}`}>
                      Size name
                    </label>
                    <input
                      id={`size-name-${size.id}`}
                      type="text"
                      value={size.name}
                      placeholder="Size name"
                      onChange={(e) =>
                        updateOptions({
                          sizes: sizes.map((s, j) =>
                            j === i ? { ...s, name: e.target.value } : s
                          ),
                        })
                      }
                      className={inlineInputCls}
                    />
                    <label className="sr-only" htmlFor={`size-price-${size.id}`}>
                      Price in SGD for {size.name || `size ${i + 1}`}
                    </label>
                    <input
                      id={`size-price-${size.id}`}
                      type="number"
                      min="0"
                      step="0.10"
                      value={centsToDollars(size.priceCents)}
                      onChange={(e) =>
                        updateOptions({
                          sizes: sizes.map((s, j) =>
                            j === i
                              ? {
                                  ...s,
                                  priceCents:
                                    parseDollarsToCents(e.target.value) ?? 0,
                                }
                              : s
                          ),
                        })
                      }
                      className={inlineInputCls}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updateOptions({
                          sizes: sizes.filter((_, j) => j !== i),
                        })
                      }
                      aria-label={`Remove ${size.name || `size ${i + 1}`}`}
                      className="text-link min-h-11 text-sm text-brand-dark"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    updateOptions({
                      sizes: [
                        ...sizes,
                        {
                          id: `size-${Date.now().toString(36)}`,
                          name: "",
                          priceCents: 0,
                        },
                      ],
                    })
                  }
                  className="text-link mt-1 text-sm text-brand-dark"
                >
                  + Add size
                </button>
                <p className="mt-1 text-xs leading-5 text-stone-500">
                  Remove all sizes to use a single fixed price instead.
                </p>
              </fieldset>

              <fieldset className="rounded-2xl border border-stone-200 bg-paper p-4 sm:p-5">
                <legend className="max-w-full px-1 font-display text-xl font-medium leading-tight text-stone-950">
                  Required single-choice option (e.g. spice level)
                </legend>
                {choiceGroup ? (
                  <>
                    <label className={labelCls}>
                      Group name
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
                    {choiceGroup.choices.map((choice, i) => (
                      <div
                        key={choice.id}
                        className="mb-3 grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-center"
                      >
                        <label
                          className="sr-only"
                          htmlFor={`choice-name-${choice.id}`}
                        >
                          Choice name
                        </label>
                        <input
                          id={`choice-name-${choice.id}`}
                          type="text"
                          value={choice.name}
                          placeholder="Choice name"
                          onChange={(e) =>
                            updateOptions({
                              requiredChoice: {
                                ...choiceGroup,
                                choices: choiceGroup.choices.map((c, j) =>
                                  j === i ? { ...c, name: e.target.value } : c
                                ),
                              },
                            })
                          }
                          className={inlineInputCls}
                        />
                        <label
                          className="sr-only"
                          htmlFor={`choice-description-${choice.id}`}
                        >
                          Description for {choice.name || `choice ${i + 1}`}
                        </label>
                        <input
                          id={`choice-description-${choice.id}`}
                          type="text"
                          value={choice.description ?? ""}
                          placeholder="Description (optional)"
                          onChange={(e) =>
                            updateOptions({
                              requiredChoice: {
                                ...choiceGroup,
                                choices: choiceGroup.choices.map((c, j) =>
                                  j === i
                                    ? {
                                        ...c,
                                        description:
                                          e.target.value || undefined,
                                      }
                                    : c
                                ),
                              },
                            })
                          }
                          className={inlineInputCls}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            updateOptions({
                              requiredChoice: {
                                ...choiceGroup,
                                choices: choiceGroup.choices.filter(
                                  (_, j) => j !== i
                                ),
                              },
                            })
                          }
                          aria-label={`Remove ${choice.name || `choice ${i + 1}`}`}
                          className="text-link min-h-11 text-sm text-brand-dark"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                      <button
                        type="button"
                        onClick={() =>
                          updateOptions({
                            requiredChoice: {
                              ...choiceGroup,
                              choices: [
                                ...choiceGroup.choices,
                                {
                                  id: `choice-${Date.now().toString(36)}`,
                                  name: "",
                                },
                              ],
                            },
                          })
                        }
                        className="text-link text-sm text-brand-dark"
                      >
                        + Add choice
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setDraft((d) => {
                            if (!d?.options) return d;
                            const rest = { ...d.options };
                            delete rest.requiredChoice;
                            return { ...d, options: rest };
                          })
                        }
                        className="text-link text-sm"
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
                          choices: [
                            { id: `choice-${Date.now().toString(36)}`, name: "" },
                          ],
                        },
                      })
                    }
                    className="text-link mt-2 text-sm text-brand-dark"
                  >
                    + Add required single-choice option
                  </button>
                )}
              </fieldset>

              <fieldset className="rounded-2xl border border-stone-200 bg-paper p-4 sm:p-5">
                <legend className="max-w-full px-1 font-display text-xl font-medium leading-tight text-stone-950">
                  Optional checkboxes (e.g. no bean sprouts)
                </legend>
                {checkboxes.map((box, i) => (
                  <div
                    key={box.id}
                    className="mb-3 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                  >
                    <label className="sr-only" htmlFor={`checkbox-name-${box.id}`}>
                      Checkbox label
                    </label>
                    <input
                      id={`checkbox-name-${box.id}`}
                      type="text"
                      value={box.name}
                      placeholder="Checkbox label"
                      onChange={(e) =>
                        updateOptions({
                          checkboxes: checkboxes.map((b, j) =>
                            j === i ? { ...b, name: e.target.value } : b
                          ),
                        })
                      }
                      className={inlineInputCls}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updateOptions({
                          checkboxes: checkboxes.filter((_, j) => j !== i),
                        })
                      }
                      aria-label={`Remove ${box.name || `checkbox ${i + 1}`}`}
                      className="text-link min-h-11 text-sm text-brand-dark"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    updateOptions({
                      checkboxes: [
                        ...checkboxes,
                        { id: `box-${Date.now().toString(36)}`, name: "" },
                      ],
                    })
                  }
                  className="text-link mt-1 text-sm text-brand-dark"
                >
                  + Add checkbox
                </button>
              </fieldset>

              <div className="border-t border-stone-200 pt-6">
                <h3 className="font-display text-2xl font-medium text-stone-950">
                  Guest-facing notes
                </h3>
                <label className={`${labelCls} mt-4`}>
                  Dietary notice (shown only on this product, optional)
                  <textarea
                    value={draft.dietaryNotice ?? ""}
                    onChange={(e) =>
                      updateDraft({
                        dietaryNotice: e.target.value || undefined,
                      })
                    }
                    rows={2}
                    className={inputCls}
                  />
                </label>
              </div>

              <div className="flex flex-wrap gap-3 border-t border-stone-200 pt-6">
                <button
                  type="button"
                  onClick={saveDraft}
                  className="btn-primary min-h-11 px-5 text-sm"
                >
                  Save product
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDraft(null);
                    setIsNew(false);
                  }}
                  className="btn-secondary min-h-11 px-5 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>

            <div className="surface-glass h-fit p-5 sm:p-6 lg:sticky lg:top-28">
              <p className="page-kicker mb-2">Guest preview · Selected dish</p>
              <h3 className="font-display text-2xl font-medium text-stone-950">
                Card preview
              </h3>
              <p className="mt-2 text-sm leading-6 text-stone-500">
                A quick view of how this dish will read on the menu.
              </p>
              <div className="mt-4">
                <ProductCard
                  product={{
                    ...draft,
                    slug: draft.slug || slugify(draft.name) || "preview",
                  }}
                  preview
                />
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section
        aria-labelledby="categories-heading"
        className="surface-solid landing-panel overflow-hidden"
      >
        <div className="border-b border-stone-200 px-5 py-6 sm:px-8">
          <p className="page-kicker mb-2">Menu structure</p>
          <h2 id="categories-heading" className="section-title text-3xl">
            Categories
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
            Category names and descriptions save automatically as you edit them.
          </p>
        </div>
        <ul role="list" className="divide-y divide-stone-200">
          {cats.length === 0 ? (
            <li
              role="status"
              className="px-5 py-10 text-center text-sm text-stone-500 sm:px-8"
            >
              No categories yet. Add one to organise the menu.
            </li>
          ) : null}
          {cats.map((c, i) => (
            <li
              key={c.slug}
              className="grid gap-3 px-5 py-5 sm:grid-cols-[8rem_minmax(0,14rem)_minmax(0,1fr)] sm:items-center sm:px-8"
            >
              <div className="min-w-0">
                <span className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-stone-500">
                  Page link
                </span>
                <code className="mt-1 block break-all font-mono text-xs text-stone-600">
                  {c.slug}
                </code>
              </div>
              <div className="min-w-0">
                <label
                  className="sr-only"
                  htmlFor={`category-name-${c.slug}`}
                >
                  Category name for {c.slug}
                </label>
                <input
                  id={`category-name-${c.slug}`}
                  type="text"
                  value={c.name}
                  onChange={(e) =>
                    persistCats(
                      cats.map((x, j) =>
                        j === i ? { ...x, name: e.target.value } : x
                      )
                    )
                  }
                  className={inlineInputCls}
                />
              </div>
              <div className="min-w-0">
                <label
                  className="sr-only"
                  htmlFor={`category-description-${c.slug}`}
                >
                  Description for {c.name}
                </label>
                <input
                  id={`category-description-${c.slug}`}
                  type="text"
                  value={c.description ?? ""}
                  placeholder="Description"
                  onChange={(e) =>
                    persistCats(
                      cats.map((x, j) =>
                        j === i
                          ? { ...x, description: e.target.value || undefined }
                          : x
                      )
                    )
                  }
                  className={inlineInputCls}
                />
              </div>
            </li>
          ))}
        </ul>
        <div className="border-t border-stone-200 px-5 py-5 sm:px-8">
          <button
            type="button"
            onClick={() => {
              const name = window.prompt("New category name?");
              if (!name?.trim()) return;
              const slug = slugify(name);
              if (cats.some((c) => c.slug === slug)) {
                setMessage(`Category "${slug}" already exists.`);
                return;
              }
              persistCats([...cats, { slug, name: name.trim() }]);
            }}
            className="btn-primary min-h-11 px-5 text-sm"
          >
            + Add category
          </button>
        </div>
      </section>
    </div>
  );
}
