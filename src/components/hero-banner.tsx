"use client";

import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

const featuredTiles = [
  { label: "Ceramics", tone: "bg-primary/90" },
  { label: "Textiles", tone: "bg-foreground/85" },
  { label: "Objects", tone: "bg-secondary" },
] as const;

export function HeroBanner() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "power3.out", duration: 0.8 },
        });

        tl.from("[data-anim='eyebrow']", { opacity: 0, y: 20 })
          .from("[data-anim='title']", { opacity: 0, y: 24 }, "-=0.55")
          .from("[data-anim='sub']", { opacity: 0, y: 20 }, "-=0.6")
          .from(
            "[data-anim='cta'] > *",
            { opacity: 0, y: 20, stagger: 0.12 },
            "-=0.6"
          )
          .from(
            "[data-anim='stats'] > *",
            { opacity: 0, y: 16, stagger: 0.1 },
            "-=0.5"
          )
          .from(
            "[data-anim='panel']",
            { opacity: 0, y: 30, scale: 0.98, duration: 1 },
            "<0.1"
          );
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative overflow-hidden pt-24">
      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-end lg:gap-16 lg:pb-28 lg:pt-24">
        <div className="relative flex flex-col items-center gap-8 text-center lg:items-start lg:gap-10 lg:text-left">
          <div
            aria-hidden
            className="absolute -left-6 top-2 hidden h-[calc(100%-0.5rem)] w-px bg-border lg:block"
          />

          <p
            data-anim="eyebrow"
            className="font-mono text-[0.7rem] uppercase tracking-[0.24em] text-muted-foreground"
          >
            Vol. 04 — Essentials
          </p>

          <div data-anim="title" className="flex flex-col gap-2">
            <h1 className="font-heading text-[clamp(2.75rem,6vw,4.75rem)] leading-[0.95] tracking-[-0.04em] text-foreground">
              Objects for
              <span className="block text-primary">daily ritual.</span>
            </h1>
          </div>

          <p
            data-anim="sub"
            className="mx-auto max-w-md text-base leading-relaxed text-muted-foreground md:text-lg lg:mx-0"
          >
            A considered edit of home goods, textiles, and tableware — chosen
            for material honesty and the quiet pleasure of use.
          </p>

          <div data-anim="cta" className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Button
              nativeButton={false}
                render={<Link href="/shop" />}
              size="lg"
              className="h-11 rounded-full px-6 shadow-none"
            >
              Browse catalog
              <ArrowUpRight data-icon="inline-end" />
            </Button>
            <Button
              nativeButton={false}
              render={<Link href="/about" />}
              variant="outline"
              size="lg"
              className="h-11 rounded-full border-border bg-background/60 px-6 shadow-none backdrop-blur-sm"
            >
              Read the journal
            </Button>
          </div>

          <dl
            data-anim="stats"
            className="mx-auto grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-8 lg:mx-0"
          >
            {[
              { value: "48", label: "Pieces" },
              { value: "12", label: "Makers" },
              { value: "3", label: "Materials" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1 lg:items-start">
                <dt className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                  {stat.label}
                </dt>
                <dd className="font-heading text-3xl tracking-[-0.03em] text-foreground">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div
          data-anim="panel"
          className="relative mx-auto aspect-[4/5] w-full max-w-md lg:mx-0 lg:max-w-none"
        >
          <div className="absolute inset-0 rounded-[2rem] border border-border/80 bg-secondary/50" />

          <div className="absolute inset-4 rounded-[1.5rem] border border-border/60 bg-background/40 backdrop-blur-[2px]" />

          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="grid w-full max-w-xs grid-cols-2 gap-3">
              {featuredTiles.map((tile, index) => (
                <div
                  key={tile.label}
                  className={cn(
                    "relative overflow-hidden rounded-2xl border border-border/50",
                    index === 0 && "col-span-2 aspect-[16/10]",
                    index !== 0 && "aspect-square",
                    tile.tone
                  )}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(225,220,201,0.28),transparent_55%)]" />
                  <p className="absolute bottom-3 left-3 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-primary-foreground/85">
                    {tile.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            aria-hidden
            className="absolute -right-6 bottom-10 hidden font-mono text-[0.62rem] uppercase tracking-[0.22em] text-muted-foreground [writing-mode:vertical-rl] lg:block"
          >
            Curated in small batches
          </div>
        </div>
      </div>
    </section>
  );
}
