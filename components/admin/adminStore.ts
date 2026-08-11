import type { Category, Product } from "@/types/product";
import {
  categories as defaultCategories,
  products as defaultProducts,
} from "@/data/products";
import { adminCredentials } from "@/data/business";

/**
 * PROTOTYPE ONLY — admin persistence.
 *
 * "Auth" is a flag in localStorage checked against hardcoded demo
 * credentials. Product/category edits are stored as a localStorage overlay
 * on top of the central data files (data/products.ts); the public site
 * always renders from the data files.
 */

const AUTH_KEY = "wnx-admin-auth";
const PRODUCTS_KEY = "wnx-admin-products";
const CATEGORIES_KEY = "wnx-admin-categories";

function available(): boolean {
  return typeof window !== "undefined";
}

export function isAuthed(): boolean {
  return available() && window.localStorage.getItem(AUTH_KEY) === "1";
}

export function login(username: string, password: string): boolean {
  if (
    username === adminCredentials.username &&
    password === adminCredentials.password
  ) {
    window.localStorage.setItem(AUTH_KEY, "1");
    return true;
  }
  return false;
}

export function logout(): void {
  if (available()) window.localStorage.removeItem(AUTH_KEY);
}

function loadJson<T>(key: string): T | null {
  if (!available()) return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function loadProducts(): Product[] {
  return loadJson<Product[]>(PRODUCTS_KEY) ?? defaultProducts;
}

export function saveProducts(products: Product[]): void {
  if (available()) {
    window.localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  }
}

export function resetProducts(): void {
  if (available()) window.localStorage.removeItem(PRODUCTS_KEY);
}

export function loadCategories(): Category[] {
  return loadJson<Category[]>(CATEGORIES_KEY) ?? defaultCategories;
}

export function saveCategories(categories: Category[]): void {
  if (available()) {
    window.localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
