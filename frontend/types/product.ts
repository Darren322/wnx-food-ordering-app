export type Availability = "available" | "unavailable" | "sold_out";

export interface Category {
  slug: string;
  name: string;
  description?: string;
}

/** A selectable size with its own price (e.g. Regular / Large). */
export interface SizeOption {
  id: string;
  name: string;
  priceCents: number;
}

export interface ChoiceOption {
  id: string;
  name: string;
  description?: string;
}

/** A required single-choice option group (e.g. spice level). */
export interface RequiredChoiceGroup {
  name: string;
  choices: ChoiceOption[];
}

/** An optional checkbox (e.g. "No bean sprouts"). */
export interface CheckboxOption {
  id: string;
  name: string;
}

/**
 * Per-product option configuration. Every group is optional, so a product
 * only carries the modifiers that actually apply to it — fixed-price items
 * (e.g. chicken rice) have no `options` at all. Future add-ons such as
 * extra rice, egg or sauce can be added as new groups here later.
 */
export interface ProductOptions {
  /** Multiple sizes, each with its own price. */
  sizes?: SizeOption[];
  /** Required single-choice group (e.g. spice level). */
  requiredChoice?: RequiredChoiceGroup;
  /** Optional checkboxes. */
  checkboxes?: CheckboxOption[];
}

export interface Product {
  slug: string;
  name: string;
  nameZh?: string;
  description: string;
  /** Path under /public. */
  image: string;
  imageWidth?: number;
  imageHeight?: number;
  /** Fixed price (integer cents) for products without sizes. */
  priceCents?: number;
  /** Category slug reference. */
  category: string;
  availability: Availability;
  /** Shown in the featured section on the homepage. */
  featured: boolean;
  options?: ProductOptions;
  /** Product-specific dietary notice, shown only on that product. */
  dietaryNotice?: string;
}
