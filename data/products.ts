import type { Category, Product } from "@/types/product";

/**
 * Single source of truth for the menu. Product owners can correct names,
 * prices, descriptions, images and availability here — or via the admin
 * dashboard (prototype overlay, stored in localStorage).
 */
export const categories: Category[] = [
  {
    slug: "chicken-rice",
    name: "Chicken Rice",
    description: "Hainanese-style chicken rice, served at Whampoa since 1982.",
  },
  {
    slug: "dry-laksa",
    name: "Dry Laksa",
    description: "Our signature dry laksa, tossed in rich laksa gravy.",
  },
];

export const products: Product[] = [
  {
    slug: "chicken-soup-rice",
    name: "Chicken Soup Rice",
    nameZh: "鸡汤饭",
    description: "Comforting chicken soup served with a bowl of fragrant rice.",
    image: "/images/chicken-soup-rice.png",
    imageWidth: 260,
    imageHeight: 230,
    priceCents: 320,
    category: "chicken-rice",
    availability: "available",
    featured: false,
  },
  {
    slug: "chicken-rice",
    name: "Chicken Rice",
    nameZh: "鸡饭",
    description: "Our classic Hainanese chicken rice with tender poached chicken.",
    image: "/images/chicken-rice.png",
    imageWidth: 300,
    imageHeight: 210,
    priceCents: 450,
    category: "chicken-rice",
    availability: "available",
    featured: true,
  },
  {
    slug: "steamed-chicken-rice",
    name: "Steamed Chicken Rice",
    nameZh: "蒸鸡饭",
    description: "Silky steamed chicken served over fragrant chicken-stock rice.",
    image: "/images/steamed-chicken-rice.png",
    imageWidth: 430,
    imageHeight: 170,
    priceCents: 550,
    category: "chicken-rice",
    availability: "available",
    featured: true,
  },
  {
    slug: "char-siew-rice",
    name: "Char Siew Rice",
    nameZh: "叉烧鸡饭",
    description: "Sweet-glazed char siew served with chicken rice.",
    image: "/images/char-siew-rice.png",
    imageWidth: 320,
    imageHeight: 200,
    priceCents: 550,
    category: "chicken-rice",
    availability: "available",
    featured: false,
  },
  {
    // TODO: confirm exact menu name — the menu-board artwork text is partially
    // garbled; this is the chicken-and-pork combination meal.
    slug: "oil-chicken-pork-rice",
    name: "Oil Chicken & Pork Rice",
    nameZh: "油鸡饭",
    description: "Soy-braised oil chicken with pork, served over fragrant rice.",
    image: "/images/oil-chicken-pork-rice.png",
    imageWidth: 400,
    imageHeight: 330,
    priceCents: 790,
    category: "chicken-rice",
    availability: "available",
    featured: false,
  },
  {
    slug: "dry-laksa",
    name: "Dry Laksa",
    description: "Thick rice noodles tossed in our rich, aromatic laksa gravy.",
    image: "/images/dry-laksa-placeholder.svg",
    imageWidth: 800,
    imageHeight: 600,
    category: "dry-laksa",
    availability: "available",
    featured: true,
    options: {
      // TODO: confirm exact size names and prices against the dry-laksa
      // reference image (not yet supplied by the product owner).
      sizes: [
        { id: "regular", name: "Regular", priceCents: 680 },
        { id: "large", name: "Large", priceCents: 880 },
      ],
      requiredChoice: {
        name: "Spice level",
        choices: [
          { id: "xiao-la", name: "Xiao La", description: "Mild" },
          { id: "medium-la", name: "Medium La", description: "Medium" },
          { id: "da-la", name: "Da La", description: "Spicy" },
        ],
      },
      checkboxes: [{ id: "no-bean-sprouts", name: "No bean sprouts" }],
    },
    dietaryNotice:
      "Contains seafood. Please contact the store before ordering if you have seafood sensitivities or other dietary concerns.",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
