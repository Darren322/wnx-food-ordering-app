export const PRODUCTS_STORAGE_KEY = "wnx-admin-products";
export const CATEGORIES_STORAGE_KEY = "wnx-admin-categories";

interface ReadableStorage {
  getItem(key: string): string | null;
}

interface CustomerCatalog<TProduct, TCategory> {
  products: TProduct[];
  categories: TCategory[];
}

function loadArray<T>(storage: ReadableStorage, key: string): T[] | null {
  try {
    const raw = storage.getItem(key);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : null;
  } catch {
    return null;
  }
}

/**
 * Apply the prototype admin overlay to the customer catalogue. Invalid or
 * unavailable browser storage always falls back to the checked-in menu.
 */
export function loadCustomerCatalog<TProduct, TCategory>(
  defaults: CustomerCatalog<TProduct, TCategory>,
  storage: ReadableStorage | null =
    typeof window === "undefined" ? null : window.localStorage,
): CustomerCatalog<TProduct, TCategory> {
  if (!storage) return defaults;

  return {
    products:
      loadArray<TProduct>(storage, PRODUCTS_STORAGE_KEY) ?? defaults.products,
    categories:
      loadArray<TCategory>(storage, CATEGORIES_STORAGE_KEY) ??
      defaults.categories,
  };
}
