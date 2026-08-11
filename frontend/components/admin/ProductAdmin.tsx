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

const inputCls =
  "mt-1 w-full rounded-lg border border-amber-300 px-3 py-2 text-sm";
const labelCls = "block text-sm font-medium";

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
    return <p className="text-sm text-neutral-500">Loading products…</p>;
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
        <p className="rounded-lg bg-amber-50 p-3 text-sm text-neutral-700">
          {message}
        </p>
      ) : null}

      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">Products</h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setDraft(emptyProduct(cats[0]?.slug ?? ""));
                setIsNew(true);
                setMessage("");
              }}
              className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
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
              className="rounded-lg bg-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-300"
            >
              Reset to defaults
            </button>
          </div>
        </div>
        <ul className="space-y-2">
          {items.map((p) => (
            <li
              key={p.slug}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-200 bg-white px-4 py-2 text-sm"
            >
              <span className="font-semibold">
                {p.name}{" "}
                <span className="font-normal text-neutral-500">
                  ({cats.find((c) => c.slug === p.category)?.name ?? p.category})
                </span>
              </span>
              <span className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-1 text-xs text-neutral-600">
                  Featured
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
                    className="h-4 w-4 accent-red-700"
                  />
                </label>
                <select
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
                  className="rounded border border-amber-300 bg-white px-2 py-1 text-xs"
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
                  className="rounded bg-neutral-200 px-3 py-1 text-xs font-semibold hover:bg-neutral-300"
                >
                  Edit
                </button>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {draft ? (
        <section className="rounded-xl border border-amber-300 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">
            {isNew ? "New product" : `Edit: ${draft.name || "(unnamed)"}`}
          </h2>
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
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
                Slug
                <input
                  type="text"
                  value={draft.slug}
                  onChange={(e) => updateDraft({ slug: slugify(e.target.value) })}
                  placeholder={slugify(draft.name) || "auto-from-name"}
                  className={inputCls}
                />
              </label>
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
                <p className="text-sm text-neutral-500">
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
                <label className="mt-6 flex items-center gap-2 text-sm font-medium">
                  <input
                    type="checkbox"
                    checked={draft.featured}
                    onChange={(e) => updateDraft({ featured: e.target.checked })}
                    className="h-4 w-4 accent-red-700"
                  />
                  Feature on homepage
                </label>
              </div>

              <div>
                <span className={labelCls}>Product image</span>
                <div className="mt-1 flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageFile(e.target.files?.[0])}
                    className="text-sm"
                  />
                </div>
                <p className="mt-1 text-xs text-neutral-500">
                  Upload replaces the image preview (stored locally for this
                  prototype).
                </p>
              </div>

              <fieldset className="rounded-lg border border-amber-200 p-4">
                <legend className="px-1 text-sm font-semibold">Sizes</legend>
                {sizes.map((size, i) => (
                  <div key={i} className="mb-2 flex items-center gap-2">
                    <input
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
                      className="w-40 rounded border border-amber-300 px-2 py-1 text-sm"
                    />
                    <input
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
                      className="w-24 rounded border border-amber-300 px-2 py-1 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updateOptions({
                          sizes: sizes.filter((_, j) => j !== i),
                        })
                      }
                      className="text-xs text-red-700 underline"
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
                  className="text-sm text-red-800 underline"
                >
                  + Add size
                </button>
                <p className="mt-1 text-xs text-neutral-500">
                  Remove all sizes to use a single fixed price instead.
                </p>
              </fieldset>

              <fieldset className="rounded-lg border border-amber-200 p-4">
                <legend className="px-1 text-sm font-semibold">
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
                      <div key={i} className="mb-2 mt-2 flex items-center gap-2">
                        <input
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
                          className="w-40 rounded border border-amber-300 px-2 py-1 text-sm"
                        />
                        <input
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
                          className="w-40 rounded border border-amber-300 px-2 py-1 text-sm"
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
                          className="text-xs text-red-700 underline"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <div className="mt-2 flex gap-4">
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
                        className="text-sm text-red-800 underline"
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
                        className="text-sm text-neutral-600 underline"
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
                    className="text-sm text-red-800 underline"
                  >
                    + Add required single-choice option
                  </button>
                )}
              </fieldset>

              <fieldset className="rounded-lg border border-amber-200 p-4">
                <legend className="px-1 text-sm font-semibold">
                  Optional checkboxes (e.g. no bean sprouts)
                </legend>
                {checkboxes.map((box, i) => (
                  <div key={i} className="mb-2 flex items-center gap-2">
                    <input
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
                      className="w-56 rounded border border-amber-300 px-2 py-1 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updateOptions({
                          checkboxes: checkboxes.filter((_, j) => j !== i),
                        })
                      }
                      className="text-xs text-red-700 underline"
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
                  className="text-sm text-red-800 underline"
                >
                  + Add checkbox
                </button>
              </fieldset>

              <label className={labelCls}>
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

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={saveDraft}
                  className="rounded-lg bg-red-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-800"
                >
                  Save product
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDraft(null);
                    setIsNew(false);
                  }}
                  className="rounded-lg bg-neutral-200 px-5 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-300"
                >
                  Cancel
                </button>
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold">Card preview</h3>
              <ProductCard
                product={{
                  ...draft,
                  slug: draft.slug || slugify(draft.name) || "preview",
                }}
                preview
              />
            </div>
          </div>
        </section>
      ) : null}

      <section>
        <h2 className="mb-3 text-lg font-semibold">Categories</h2>
        <ul className="space-y-2">
          {cats.map((c, i) => (
            <li
              key={c.slug}
              className="flex flex-wrap items-center gap-2 rounded-lg border border-amber-200 bg-white px-4 py-2 text-sm"
            >
              <span className="w-32 font-mono text-xs text-neutral-500">
                {c.slug}
              </span>
              <input
                type="text"
                value={c.name}
                onChange={(e) =>
                  persistCats(
                    cats.map((x, j) =>
                      j === i ? { ...x, name: e.target.value } : x
                    )
                  )
                }
                className="w-44 rounded border border-amber-300 px-2 py-1"
              />
              <input
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
                className="min-w-56 flex-1 rounded border border-amber-300 px-2 py-1"
              />
            </li>
          ))}
        </ul>
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
          className="mt-3 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
        >
          + Add category
        </button>
      </section>
    </div>
  );
}
