"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { Button } from "@/components/ui/button";
import { CjProductCard, CjProductCardSkeleton } from "@/components/product/cj-product-card";
import { useCjProducts } from "@/lib/use-cj-products";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function TrendingCj() {
  const root = useRef<HTMLElement>(null);
  const { products, loading } = useCjProducts();
  const trending = products.slice(0, 8);

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

  if (loading) {
    return (
      <section ref={root} className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
        <div className="flex flex-col gap-2">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.24em] text-muted-foreground">
            Vol. 04 — Trending
          </p>
          <h2 className="font-heading text-[clamp(1.75rem,3.5vw,2.75rem)] leading-[1.02] tracking-[-0.03em] text-foreground">
            Pieces people are reaching for
          </h2>
        </div>
        <div
          data-grid
          className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <CjProductCardSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (trending.length === 0) return null;

  return (
    <section ref={root} className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.24em] text-muted-foreground">
            Vol. 04 — Trending
          </p>
          <h2 className="font-heading text-[clamp(1.75rem,3.5vw,2.75rem)] leading-[1.02] tracking-[-0.03em] text-foreground">
            Pieces people are reaching for
          </h2>
        </div>

        <Button
          nativeButton={false}
          render={<Link href="/shop" />}
          variant="outline"
          className="rounded-full"
        >
          View all
          <ArrowUpRight data-icon="inline-end" />
        </Button>
      </div>

      <div
        data-grid
        className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6"
      >
        {trending.map((product) => (
          <CjProductCard key={product.productId} product={product} />
        ))}
      </div>
    </section>
  );
}
