import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Heart } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/product";

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

function discountPercent(price: number, compareAt?: number) {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

function categoryTone(name: string) {
  const n = name.toLowerCase();
  if (n.includes("ceramic")) return "bg-primary/90";
  if (n.includes("textile")) return "bg-foreground/85";
  if (n.includes("object")) return "bg-secondary";
  return "bg-secondary";
}

function categoryLabel(name: string) {
  const parts = name.split(">").map((p) => p.trim());
  return parts[parts.length - 1];
}

export function ProductCard({ product }: { product: Product }) {
  const soldOut = product.stock <= 0;
  const lowStock = !soldOut && product.stock <= 5;
  const off = discountPercent(product.basePrice, product.compareAtPrice);
  const tone = categoryTone(product.category.name);
  const blurb = product.shortDescription ?? product.description;

  const firstImage = product.images[0];

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-lg border border-umber/10 bg-card overflow-hidden",
        "transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md"
      )}
    >
      <Link
        href={`/products/${product.slug}`}
        aria-label={product.title}
        className="block overflow-hidden"
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          {firstImage ? (
            <Image
              src={firstImage}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : (
            <div
              className={cn(
                "absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-105",
                tone
              )}
            />
          )}

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(225,220,201,0.28),transparent_55%)]" />

          <div className="absolute inset-0 flex items-end p-4">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-primary-foreground/85">
              {categoryLabel(product.category.name)}
            </p>
          </div>

          {off > 0 && !soldOut && (
            <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-foreground backdrop-blur-sm">
              −{off}%
            </span>
          )}

          {soldOut && (
            <span className="absolute left-3 top-3 rounded-full bg-espresso px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-cream">
              Sold out
            </span>
          )}

          {lowStock && (
            <span className="absolute left-3 top-3 rounded-full border border-umber/20 bg-background/90 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-foreground backdrop-blur-sm">
              Low stock
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-col gap-1">
          <h3 className="font-heading text-base leading-snug font-medium transition-colors duration-200 group-hover:text-umber">
            <Link href={`/products/${product.slug}`}>{product.title}</Link>
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {blurb}
          </p>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-lg tracking-[-0.02em] text-foreground">
              {product.hasVariants && product.variants.length > 1
                ? `From ${priceFormatter.format(product.basePrice)}`
                : priceFormatter.format(product.basePrice)}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {priceFormatter.format(product.compareAtPrice)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Add to wishlist"
              className="size-8 rounded-full"
            >
              <Heart />
            </Button>
            <Button
              nativeButton={false}
              render={<Link href={`/products/${product.slug}`} />}
              size="sm"
              className="rounded-full"
              disabled={soldOut}
            >
              {soldOut ? "Notify" : "View"}
              <ArrowUpRight data-icon="inline-end" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
