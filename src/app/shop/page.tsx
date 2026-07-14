"use client";

import { useMemo, useRef, useState } from "react";
import { PackageOpen, Search, X } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { CjProductCard, CjProductCardSkeleton } from "@/components/product/cj-product-card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCjProducts } from "@/lib/use-cj-products";

type SortKey = "name" | "price-asc" | "price-desc";

function getPrice(p: { totalPrice: string; sellPrice: string }) {
  const value = Number.parseFloat(p.totalPrice || p.sellPrice);
  return Number.isFinite(value) ? value : 0;
}

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function ShopPage() {
  const root = useRef<HTMLElement>(null);
  const { products, loading } = useCjProducts();

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("name");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matched = q
      ? products.filter(
          (p) =>
            p.nameEn.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q)
        )
      : products.slice();

    switch (sort) {
      case "price-asc":
        matched.sort((a, b) => getPrice(a) - getPrice(b));
        break;
      case "price-desc":
        matched.sort((a, b) => getPrice(b) - getPrice(a));
        break;
      case "name":
      default:
        matched.sort((a, b) => a.nameEn.localeCompare(b.nameEn));
        break;
    }

    return matched;
  }, [products, query, sort]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-grid]").forEach((grid) => {
          gsap.from(grid.children, {
            opacity: 0,
            y: 24,
            duration: 0.5,
            ease: "power3.out",
            stagger: 0.06,
            scrollTrigger: { trigger: grid, start: "top 85%" },
          });
        });
      });
    },
    { scope: root }
  );

  return (
    <main ref={root} className="flex min-h-screen flex-col">
      {/* Header */}
      <section className="pt-24">
        <div className="mx-auto max-w-7xl px-6 pb-10 pt-16 lg:pb-14 lg:pt-24">
          <div className="flex flex-col gap-4">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.24em] text-muted-foreground">
              The Shop — Vol. 04
            </p>
            <h1 className="font-heading text-[clamp(2.5rem,5.5vw,4.25rem)] leading-[0.98] tracking-[-0.04em] text-foreground">
              A considered edit,
              <span className="block text-primary">for daily ritual.</span>
            </h1>
            <p className="max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
              Everything we carry is chosen with purpose — a small, honest
              catalog of pieces built to be lived with.
            </p>
            {!loading && products.length > 0 && (
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                {query
                  ? `${filtered.length} of ${products.length} pieces`
                  : `${products.length} pieces in the catalog`}
              </p>
            )}

            {/* Search + filter */}
            <div className="mt-2 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full sm:flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search the catalog…"
                  aria-label="Search products"
                  className="h-11 rounded-full border-border/70 pl-10 pr-10"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>

              <Select value={sort} onValueChange={(value) => setSort((value as SortKey) ?? "name")}>
                <SelectTrigger
                  size="default"
                  className="h-11 w-full rounded-full border-border/70 sm:w-44"
                  aria-label="Sort products"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name (A–Z)</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* All products */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
          <div className="flex flex-col gap-2">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.24em] text-muted-foreground">
              Catalog
            </p>
            <h2 className="font-heading text-[clamp(1.75rem,3.5vw,2.75rem)] leading-[1.02] tracking-[-0.03em] text-foreground">
              All pieces
            </h2>
          </div>

          {loading ? (
            <div
              data-grid
              className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6"
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <CjProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="mt-10 flex flex-col items-center justify-center gap-3 rounded-lg border border-border/60 bg-card/40 py-20 text-center">
              <PackageOpen className="size-8 text-muted-foreground" />
              <p className="font-heading text-lg text-foreground">
                No pieces yet.
              </p>
              <p className="max-w-sm text-sm text-muted-foreground">
                The catalog is empty — products added from CJ Dropshipping will
                appear here.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="mt-10 flex flex-col items-center justify-center gap-3 rounded-lg border border-border/60 bg-card/40 py-20 text-center">
              <PackageOpen className="size-8 text-muted-foreground" />
              <p className="font-heading text-lg text-foreground">
                No matches for “{query}”.
              </p>
              <p className="max-w-sm text-sm text-muted-foreground">
                Try a different keyword or clear the search to see everything.
              </p>
            </div>
          ) : (
            <div
              data-grid
              className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6"
            >
              {filtered.map((product) => (
                <CjProductCard key={product.productId} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
