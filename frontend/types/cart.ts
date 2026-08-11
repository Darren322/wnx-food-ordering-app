/**
 * Snapshot of the options chosen for one cart line.
 * Names are denormalised so carts/orders render without re-lookup,
 * and only the fields applicable to the product are populated.
 */
export interface CartLineSelection {
  sizeId?: string;
  sizeName?: string;
  choiceGroupName?: string;
  choiceId?: string;
  choiceName?: string;
  checkboxIds?: string[];
  checkboxNames?: string[];
}

export interface CartLine {
  id: string;
  productSlug: string;
  productName: string;
  image?: string;
  unitPriceCents: number;
  quantity: number;
  selection: CartLineSelection;
}

export function lineSubtotalCents(line: CartLine): number {
  return line.unitPriceCents * line.quantity;
}
