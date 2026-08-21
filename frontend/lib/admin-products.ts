export function replaceProductBySlug<T extends { slug: string }>(
  products: T[],
  originalSlug: string | null,
  nextProduct: T,
): T[] | null {
  const pageLinkTaken = products.some(
    (product) =>
      product.slug === nextProduct.slug && product.slug !== originalSlug,
  );
  if (pageLinkTaken) return null;

  if (originalSlug === null) return [...products, nextProduct];

  return products.map((product) =>
    product.slug === originalSlug ? nextProduct : product,
  );
}

interface EditableProductOptions {
  sizes?: Array<{ name: string; priceCents: number }>;
  requiredChoice?: {
    name: string;
    choices: Array<{ name: string }>;
  };
  checkboxes?: Array<{ name: string }>;
}

export function validateProductOptions(
  options: EditableProductOptions | undefined,
): string | null {
  if (!options) return null;

  for (const size of options.sizes ?? []) {
    if (!size.name.trim()) return "Enter a size name for every size.";
    if (size.priceCents <= 0) return "Each size price must be greater than zero.";
  }

  if (options.requiredChoice) {
    if (!options.requiredChoice.name.trim()) {
      return "Enter a name for the required option group.";
    }
    if (options.requiredChoice.choices.length === 0) {
      return "A required option group needs at least one choice.";
    }
    if (options.requiredChoice.choices.some((choice) => !choice.name.trim())) {
      return "Enter a choice name for every required choice.";
    }
  }

  if (options.checkboxes?.some((option) => !option.name.trim())) {
    return "Enter a preference label for every checkbox.";
  }

  return null;
}
