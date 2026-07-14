"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Minus,
  Plus,
  ShoppingBag,
  ChevronRight,
  Heart,
  Share2,
  Truck,
  RotateCcw,
  ShieldCheck,
  Check,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth-client";
import { useCart } from "@/lib/cart";
import { getAuthToken } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { sampleProduct } from "./sample-product";
import { getStockLevel, type StorefrontProduct } from "./types";

const EASE = [0.16, 1, 0.3, 1] as const;

// ---------------------------------------------------------------------------
// Stock badge — small semantic dot + label, built on the Badge primitive.
// ---------------------------------------------------------------------------
function StockBadge({ stock }: { stock: number }) {
  const level = getStockLevel(stock);
  const copy =
    level === "out-of-stock" ? "Out of Stock" : level === "low-stock" ? `Low Stock — ${stock} left` : "In Stock";
  const dot =
    level === "out-of-stock" ? "bg-destructive" : level === "low-stock" ? "bg-amber-500" : "bg-emerald-600";
  const variant = level === "out-of-stock" ? "destructive" : level === "low-stock" ? "outline" : "secondary";

  return (
    <Badge variant={variant} className="gap-1.5">
      <span className={cn("size-1.5 rounded-full", dot)} />
      {copy}
    </Badge>
  );
}

// ---------------------------------------------------------------------------
// Gallery — main image (hover-zoom pan) + thumbnail strip (FR-11b)
// ---------------------------------------------------------------------------
function Gallery({ images, activeImage, title }: { images: string[]; activeImage: string; title: string }) {
  const [main, setMain] = useState(activeImage);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [zoomed, setZoomed] = useState(false);

  // Reset to the variant's image whenever the selected variant changes,
  // but let the user freely browse thumbnails otherwise.
  useEffect(() => {
    setMain(activeImage);
  }, [activeImage]);

  const displayed = images.includes(main) ? main : images[0];

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    setZoomPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }

  return (
    <div className="flex flex-col-reverse gap-4 sm:flex-row">
      {/* Thumbnail strip */}
      <div className="flex shrink-0 gap-3 overflow-x-auto sm:flex-col sm:overflow-visible">
        {images.map((src, i) => (
          <button
            key={src + i}
            onClick={() => setMain(src)}
            className={cn(
              "size-16 shrink-0 overflow-hidden rounded-lg border bg-card transition-all duration-200 ease-out",
              src === displayed ? "border-umber ring-1 ring-umber/40" : "border-umber/10 hover:border-umber/40"
            )}
            aria-label={`Show image ${i + 1} of ${title}`}
            aria-pressed={src === displayed}
          >
            <img src={src} alt="" className="size-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>

      {/* Main image with hover-zoom */}
      <div
        className="relative aspect-square w-full overflow-hidden rounded-2xl border border-umber/10 bg-card"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
      >
        <img
          src={displayed}
          alt={title}
          className="size-full object-cover transition-transform duration-300 ease-out"
          style={{
            transform: zoomed ? "scale(1.6)" : "scale(1)",
            transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
          }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function ProductDetailPage({ product = sampleProduct }: { product?: StorefrontProduct }) {
  // Selected variant options, e.g. { Color: "Sand", Size: "M" }
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);

  const { data: session } = useSession();
  const { addItem } = useCart();
  const params = useParams();
  const productId = typeof params.id === "string" ? params.id : product.slug;

  const activeVariant = useMemo(() => {
    if (!product.hasVariants) return undefined;
    const allChosen = product.variantAttributes.every((attr) => selected[attr]);
    if (!allChosen) return undefined;
    return product.variants.find((v) =>
      product.variantAttributes.every((attr) => v.optionValues[attr] === selected[attr])
    );
  }, [selected, product]);

  const needsSelection = product.hasVariants && !activeVariant;
  const displayPrice = activeVariant?.price ?? product.basePrice;
  const displayCompareAt = activeVariant?.compareAtPrice ?? product.compareAtPrice;
  const displayStock = activeVariant?.stock ?? product.stock;
  const displayImage = activeVariant?.image ?? product.images[0];
  const stockLevel = getStockLevel(displayStock);
  const outOfStock = stockLevel === "out-of-stock";

  const discountPct =
    displayCompareAt && displayCompareAt > displayPrice
      ? Math.round((1 - displayPrice / displayCompareAt) * 100)
      : null;

  // Which option values are still available given other selections
  function valuesFor(attr: string) {
    return Array.from(new Set(product.variants.map((v) => v.optionValues[attr])));
  }
  function isValueInStock(attr: string, value: string) {
    return product.variants.some(
      (v) =>
        v.optionValues[attr] === value &&
        v.stock > 0 &&
        product.variantAttributes
          .filter((a) => a !== attr)
          .every((a) => !selected[a] || v.optionValues[a] === selected[a])
    );
  }

  const crumbs = product.category.name.split(" > ");
  const categoryLeaf = crumbs[crumbs.length - 1];

  async function handleAddToCart() {
    if (needsSelection || outOfStock) return;

    const numericPrice = Number.isFinite(displayPrice) ? displayPrice : 0;
    const quantity = Number(qty);

    addItem(
      {
        id: productId,
        name: product.title,
        price: numericPrice,
        image: displayImage,
      },
      quantity
    );
    toast.success("Added to cart");

    if (!session?.user) return;

    try {
      const token = await getAuthToken();
      if (!token) return;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/user/addCart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          userEmail: session.user.email,
          price: numericPrice,
          quantity,
          img: displayImage,
        }),
      });

      if (!res.ok) {
        console.error("Failed to sync cart with server");
      }
    } catch (error) {
      console.error("Error syncing cart:", error);
    }
  }

  const trustItems = [
    { icon: Truck, label: "Free shipping over $75" },
    { icon: RotateCcw, label: "30-day easy returns" },
    { icon: ShieldCheck, label: "Secure checkout" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 pt-28 pb-8 sm:pt-32 sm:pb-12">
        {/* Breadcrumb — FR-11d */}
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
          <span className="transition-colors duration-200 hover:text-umber">Home</span>
          {crumbs.map((c) => (
            <span key={c} className="flex items-center gap-1">
              <ChevronRight className="size-3.5" />
              <span className="transition-colors duration-200 hover:text-umber">{c}</span>
            </span>
          ))}
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16"
        >
          {/* Gallery */}
          <Gallery images={product.images} activeImage={displayImage} title={product.title} />

          {/* Info column — sticky on large screens */}
          <div className="flex flex-col lg:sticky lg:top-24 lg:h-fit">
            <span className="text-xs font-medium tracking-[0.14em] text-umber uppercase">{categoryLeaf}</span>

            <h1 className="mt-2 font-heading text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
              {product.title}
            </h1>

            {product.shortDescription && (
              <p className="mt-3 max-w-prose text-sm text-muted-foreground">{product.shortDescription}</p>
            )}

            {/* Price — FR-11d */}
            <div className="mt-5 flex items-center gap-3">
              <span className="font-heading text-3xl font-semibold tracking-[-0.02em]">
                ${displayPrice.toFixed(2)}
              </span>
              {displayCompareAt && displayCompareAt > displayPrice && (
                <>
                  <span className="text-lg text-muted-foreground/70 line-through">
                    ${displayCompareAt.toFixed(2)}
                  </span>
                  <Badge className="rounded-full">-{discountPct}%</Badge>
                </>
              )}
            </div>

            <div className="mt-3">
              <StockBadge stock={displayStock} />
            </div>

            <Separator className="my-6 bg-umber/10" />

            {/* Variant selectors — FR-11c */}
            {product.hasVariants && (
              <div className="flex flex-col gap-5">
                {product.variantAttributes.map((attr) => (
                  <div key={attr}>
                    <div className="mb-2 flex items-baseline justify-between">
                      <span className="text-sm font-medium">{attr}</span>
                      {selected[attr] && <span className="text-sm text-muted-foreground">{selected[attr]}</span>}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {valuesFor(attr).map((value) => {
                        const active = selected[attr] === value;
                        const available = isValueInStock(attr, value);
                        return (
                          <button
                            key={value}
                            disabled={!available}
                            onClick={() => setSelected((s) => ({ ...s, [attr]: value }))}
                            className={cn(
                              "min-w-11 rounded-lg border px-3.5 py-2 text-sm font-medium transition-all duration-200 ease-out",
                              active
                                ? "border-umber bg-umber text-cream shadow-sm"
                                : available
                                ? "border-umber/20 text-foreground hover:border-umber hover:bg-umber/5"
                                : "border-umber/10 text-muted-foreground line-through opacity-60"
                            )}
                          >
                            {value}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
                {activeVariant && <p className="text-xs text-muted-foreground">SKU: {activeVariant.sku}</p>}
              </div>
            )}

            <Separator className="my-6 bg-umber/10" />

            {/* Quantity + actions — FR-11e, FR-11f */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Quantity</span>
              <div className="flex items-center rounded-lg border border-umber/20">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                  className="p-2.5 text-umber transition-colors duration-200 hover:bg-umber/5 disabled:text-black/20"
                  aria-label="Decrease quantity"
                >
                  <Minus className="size-4" />
                </button>
                <span className="w-8 text-center text-sm">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(displayStock || 1, q + 1))}
                  disabled={qty >= displayStock}
                  className="p-2.5 text-umber transition-colors duration-200 hover:bg-umber/5 disabled:text-black/20"
                  aria-label="Increase quantity"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={outOfStock || needsSelection}
                className="flex-1"
              >
                <ShoppingBag data-icon="inline-start" />
                {outOfStock ? "Out of Stock" : needsSelection ? "Select Options" : "Add to Cart"}
              </Button>
              <Button
                size="icon-lg"
                variant="outline"
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                aria-pressed={wishlisted}
                onClick={() => setWishlisted((w) => !w)}
                className={cn(wishlisted && "border-umber text-umber")}
              >
                <Heart data-icon="inline-start" className={cn(wishlisted && "fill-current")} />
              </Button>
              <Button size="icon-lg" variant="outline" aria-label="Share product">
                <Share2 data-icon="inline-start" />
              </Button>
            </div>

            {/* Trust strip */}
            <div className="mt-6 grid grid-cols-1 gap-3 rounded-xl border border-umber/10 bg-card p-4 sm:grid-cols-3">
              {trustItems.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <Icon data-icon="inline-start" className="text-umber" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Description — FR-11d, FR-11k */}
        <div className="mt-16 max-w-3xl">
          <Tabs defaultValue="description">
            <TabsList variant="line">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="pt-5">
              <div
                className="prose prose-sm max-w-none text-muted-foreground [&_img]:rounded-lg [&_img]:my-4 [&_b]:text-foreground"
                // NOTE: sanitize with e.g. DOMPurify server-side before render —
                // this HTML originates from admin/supplier import (FR-11k).
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </TabsContent>

            <TabsContent value="details" className="pt-5">
              <dl className="grid grid-cols-1 gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
                <div className="flex items-center justify-between gap-4 border-b border-umber/10 pb-2">
                  <dt className="text-muted-foreground">Category</dt>
                  <dd className="text-right font-medium">{product.category.name}</dd>
                </div>
                {activeVariant && (
                  <div className="flex items-center justify-between gap-4 border-b border-umber/10 pb-2">
                    <dt className="text-muted-foreground">SKU</dt>
                    <dd className="font-medium">{activeVariant.sku}</dd>
                  </div>
                )}
                <div className="flex items-center justify-between gap-4 border-b border-umber/10 pb-2">
                  <dt className="text-muted-foreground">Availability</dt>
                  <dd className="flex items-center gap-1.5 font-medium">
                    <Check data-icon="inline-start" className="text-emerald-600" />
                    {stockLevel === "out-of-stock" ? "Unavailable" : `${displayStock} in stock`}
                  </dd>
                </div>
              </dl>
            </TabsContent>

            <TabsContent value="shipping" className="pt-5">
              <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2.5">
                  <Truck data-icon="inline-start" className="mt-0.5 text-umber" />
                  Free standard shipping on orders over $75. Most orders arrive in 5–8 business days.
                </li>
                <li className="flex items-start gap-2.5">
                  <RotateCcw data-icon="inline-start" className="mt-0.5 text-umber" />
                  Not quite right? Return unworn items within 30 days for a full refund.
                </li>
                <li className="flex items-start gap-2.5">
                  <ShieldCheck data-icon="inline-start" className="mt-0.5 text-umber" />
                  Every order is securely processed and insured in transit.
                </li>
              </ul>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
