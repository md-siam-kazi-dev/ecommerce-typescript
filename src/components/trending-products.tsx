"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card";
import { trendingProducts } from "@/data/products";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

export function TrendingProducts() {
  const reduce = useReducedMotion();

  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.24em] text-muted-foreground">
            Vol. 04 — Trending
          </p>
          <h2 className="font-heading text-[clamp(1.75rem,4vw,2.75rem)] leading-[0.98] tracking-[-0.03em] text-foreground">
            Pieces people are reaching for
          </h2>
        </div>

        <Button
          nativeButton={false}
          render={<Link href="/catalog" />}
          variant="outline"
          className="rounded-full"
        >
          View all
          <ArrowUpRight data-icon="inline-end" />
        </Button>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6"
      >
        {trendingProducts.slice(0, 8).map((product) => (
          <motion.div key={product._id} variants={item}>
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
