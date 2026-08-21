"use client";

import { useEffect, useState } from "react";
import type {
  Availability,
  Category,
  Product,
  ProductOptions,
} from "@/types/product";
import { centsToDollars, parseDollarsToCents } from "@/lib/currency";
import {
  replaceProductBySlug,
  validateProductOptions,
} from "@/lib/admin-products";
import { ProductCard } from "@/components/customer/ProductCard";
import { ProductImage } from "@/components/ui/ProductImage";
import { ProductOptionFields } from "@/components/admin/ProductOptionFields";
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
const inlineInputCls = "input min-h-11 min-w-0 px-3 py-2 text-sm";

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
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
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
    if (!hasSizes && (!draft.priceCents || draft.priceCents <= 0)) {
      setMessage("Set a price greater than zero, or add sizes with their own prices.");
      return;
    }
    const optionsError = validateProductOptions(draft.options);
    if (optionsError) {
      setMessage(optionsError);
      return;
    }
    const slug = draft.slug.trim() || slugify(draft.name);
    if (!slug) {
      setMessage("Could not derive a slug — enter a product name.");
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
    const next = replaceProductBySlug(items, editingSlug, normalised);
    if (!next) {
      setMessage(`Another product already uses the page link "${slug}".`);
      return;
    }
    persist(next);
    setDraft(null);
    setIsNew(false);
    setEditingSlug(null);
    setMessage(`Saved "${normalised.name}".`);
  }

  const sizes = draft?.options?.sizes ?? [];
  const choiceGroup = draft?.options?.requiredChoice;
  const checkboxes = draft?.options?.checkboxes ?? [];

  return (
    <div className="space-y-6">
      {message ? (
        <p
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="status-pending px-4 py-3 text-sm"
        >
          <span className="sr-only">Status: </span>
          {message}
        </p>
      ) : null}

      <section
        aria-labelledby="products-heading"
        className="surface-solid overflow-hidden"
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
            <button
              type="button"
              onClick={() => {
                setDraft(emptyProduct(cats[0]?.slug ?? ""));
                setIsNew(true);
                setEditingSlug(null);
                setMessage("");
              }}
              className="btn-primary min-h-11 px-5 text-sm"
            >
              Add product
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-3 border-b border-stone-200 bg-paper px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <p className="text-sm font-semibold text-stone-800">
              Restore the default menu
            </p>
            <p className="mt-1 max-w-xl text-xs leading-5 text-stone-500">
              Removes saved product edits from this browser and reloads the
              original catalogue.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              resetProducts();
              setItems(loadProducts());
              setMessage("Product edits reset to the defaults from data/products.ts.");
            }}
            className="btn-secondary min-h-11 shrink-0 px-4 text-sm"
          >
            Reset to defaults
          </button>
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
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-paper ring-1 ring-stone-200">
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
                <label
                  className="flex min-h-11 w-full items-center gap-2 text-sm font-semibold text-stone-700 sm:w-auto"
                  htmlFor={`availability-${p.slug}`}
                >
                  <span className="shrink-0 text-xs font-bold uppercase tracking-[0.12em] text-stone-500">
                    Availability
                  </span>
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
                    className="input min-h-11 min-w-0 flex-1 py-2 text-sm sm:w-40 sm:flex-none"
                  >
                    <option value="available">Available</option>
                    <option value="sold_out">Sold out</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setDraft(JSON.parse(JSON.stringify(p)) as Draft);
                    setIsNew(false);
                    setEditingSlug(p.slug);
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
          className="surface-solid overflow-hidden p-4 sm:p-6"
        >
          <div className="mb-6 border-b border-stone-200 pb-5">
            <p className="page-kicker mb-2">Menu details</p>
            <h2 id="product-editor-heading" className="section-title text-3xl">
              {isNew ? "New product" : `Edit: ${draft.name || "(unnamed)"}`}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
              Draft details save when you choose Save product; the preview
              updates as you work.
            </p>
          </div>
          <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
            <div className="space-y-5">
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
                  className="mt-2 block min-h-11 w-full rounded-[var(--radius-content)] border border-dashed border-stone-300 bg-white px-3 py-2 text-sm text-stone-700 outline-none transition file:mr-3 file:rounded-[var(--radius-control)] file:border-0 file:bg-paper file:px-3 file:py-1.5 file:font-semibold file:text-stone-700 focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/20"
                />
                <p id="product-image-help" className="mt-2 text-xs leading-5 text-stone-500">
                  Upload replaces the image preview (stored locally for this
                  prototype).
                </p>
              </div>

              <ProductOptionFields
                sizes={sizes}
                choiceGroup={choiceGroup}
                checkboxes={checkboxes}
                updateOptions={updateOptions}
                removeRequiredChoice={() => {
                  setDraft((d) => {
                    if (!d?.options) return d;
                    const rest = { ...d.options };
                    delete rest.requiredChoice;
                    return { ...d, options: rest };
                  });
                }}
              />

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
                    setEditingSlug(null);
                  }}
                  className="btn-secondary min-h-11 px-5 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>

            <aside className="surface-soft h-fit p-4 sm:p-5 lg:sticky lg:top-28">
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
            </aside>
          </div>
        </section>
      ) : null}

      <section
        aria-labelledby="categories-heading"
        className="surface-solid overflow-hidden"
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
              className="grid gap-3 px-5 py-5 sm:grid-cols-[8rem_minmax(0,12rem)_minmax(0,1fr)] sm:items-end sm:px-8"
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
                  className={labelCls}
                  htmlFor={`category-name-${c.slug}`}
                >
                  Category name
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
                  className={`${inlineInputCls} mt-2`}
                />
              </div>
              <div className="min-w-0">
                <label
                  className={labelCls}
                  htmlFor={`category-description-${c.slug}`}
                >
                  Customer-facing description
                </label>
                <input
                  id={`category-description-${c.slug}`}
                  type="text"
                  value={c.description ?? ""}
                  placeholder="Shown under the category name"
                  onChange={(e) =>
                    persistCats(
                      cats.map((x, j) =>
                        j === i
                          ? { ...x, description: e.target.value || undefined }
                          : x
                      )
                    )
                  }
                  className={`${inlineInputCls} mt-2`}
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
