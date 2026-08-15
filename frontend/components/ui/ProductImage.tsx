import Image from "next/image";

interface ProductImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  fill?: boolean;
  sizes?: string;
}

/**
 * next/image for raster files; a plain <img> for SVGs and admin-uploaded
 * data URLs, which the Next.js image optimizer does not handle.
 */
export function ProductImage({
  src,
  alt,
  width,
  height,
  className,
  fill = false,
  sizes,
}: ProductImageProps) {
  if (src.endsWith(".svg") || src.startsWith("data:")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} width={width} height={height} className={className} />
    );
  }

  if (fill) {
    return <Image src={src} alt={alt} fill sizes={sizes} className={className} />;
  }

  return (
    <Image src={src} alt={alt} width={width} height={height} className={className} />
  );
}
