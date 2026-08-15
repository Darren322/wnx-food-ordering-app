const cropPosition: Record<string, string> = {
  "chicken-soup-rice": "object-[55%_48%]",
  "chicken-rice": "object-[50%_48%]",
  "steamed-chicken-rice": "object-[45%_55%]",
  "char-siew-rice": "object-center",
  "oil-chicken-pork-rice": "object-[52%_30%]",
};

export function productImageCropClass(slug: string): string {
  return cropPosition[slug] ?? "object-center";
}
