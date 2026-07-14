"use client";

import { useRef } from "react";
import { ArrowUpRight, Leaf, Hammer, Sparkles } from "lucide-react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const values = [
  {
    icon: Leaf,
    label: "Material honesty",
    body: "We choose natural, enduring materials — stoneware, linen, oak — and let their grain and weight do the talking.",
  },
  {
    icon: Hammer,
    label: "Made in small batches",
    body: "Working with independent makers means limited runs, slower cycles, and objects that aren't everywhere at once.",
  },
  {
    icon: Sparkles,
    label: "A considered edit",
    body: "We add only what earns its place. Fewer, better things for the rhythms of an ordinary day.",
  },
] as const;

const stats = [
  { value: "48", label: "Pieces" },
  { value: "12", label: "Makers" },
  { value: "3", label: "Materials" },
] as const;

export default function AboutPage() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "power3.out", duration: 0.8 } })
          .from("[data-anim='eyebrow']", { opacity: 0, y: 20 })
          .from("[data-anim='title']", { opacity: 0, y: 24 }, "-=0.55")
          .from("[data-anim='sub']", { opacity: 0, y: 20 }, "-=0.6")
          .from(
            "[data-anim='cta'] > *",
            { opacity: 0, y: 20, stagger: 0.12 },
            "-=0.55"
          )
          .from(
            "[data-anim='panel']",
            { opacity: 0, y: 30, scale: 0.98, duration: 1 },
            "<0.1"
          );

        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          gsap.from(el, {
            opacity: 0,
            y: 24,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 82%" },
          });
        });
      });
    },
    { scope: root }
  );

  return (
    <main ref={root} className="flex min-h-screen flex-col">
      {/* Intro */}
      <section className="relative overflow-hidden pt-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 px-6 pb-20 pt-16 text-center lg:gap-10 lg:pb-28 lg:pt-24">
          <p
            data-anim="eyebrow"
            className="font-mono text-[0.7rem] uppercase tracking-[0.24em] text-muted-foreground"
          >
            Our story — Est. 2021
          </p>

          <h1
            data-anim="title"
            className="font-heading text-[clamp(2.5rem,5.5vw,4.25rem)] leading-[0.98] tracking-[-0.04em] text-foreground"
          >
            The Aesthete Vision
          </h1>

          <p
            data-anim="sub"
            className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            We believe that everyday essentials should be anything but ordinary.
            Aesthete was born out of a passion for minimalist design and
            uncompromising quality. We scour the globe to carefully curate a
            collection of lifestyle pieces—from timeless accessories to modern
            wardrobe staples—that elevate your daily routine. Every item in our
            catalog is selected with purpose, ensuring that form seamlessly
            meets function.
          </p>

         

         
        </div>
      </section>

      {/* Philosophy */}
      <section className="border-t border-border bg-card/40">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-6 py-20 text-center lg:py-28">
          <div data-reveal className="flex flex-col items-center gap-4">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.24em] text-muted-foreground">
              What we believe
            </p>
            <h2 className="font-heading text-[clamp(1.75rem,3.5vw,2.75rem)] leading-[1.05] tracking-[-0.03em] text-foreground">
              Good things are quiet. They ask little and give a lot.
            </h2>
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
              We are not interested in more for the sake of more. Our edit is
              small on purpose — a handful of makers, a few honest materials, and
              pieces designed to age gracefully in real homes.
            </p>
          </div>

          <div className="mt-14 grid w-full grid-cols-1 gap-6 md:grid-cols-3">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.label}
                  data-reveal
                  className={cn(
                    "flex flex-col items-center gap-4 rounded-lg border border-border/60 bg-background p-6 text-center",
                    "transition-colors duration-300 hover:border-primary/40"
                  )}
                >
                  <div className="flex items-center justify-between self-stretch">
                    <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </span>
                    <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="font-heading text-xl tracking-[-0.02em] text-foreground">
                    {value.label}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {value.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-border">
        <dl
          data-reveal
          className="mx-auto grid max-w-3xl grid-cols-3 gap-6 px-6 py-16 text-center lg:py-20"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <dt className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                {stat.label}
              </dt>
              <dd className="font-heading text-3xl tracking-[-0.03em] text-foreground lg:text-4xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Closing CTA */}
      <section className="bg-espresso text-cream">
        <div
          data-reveal
          className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-20 text-center lg:py-28"
        >
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.24em] text-cream/70">
            Come in
          </p>
          <h2 className="max-w-2xl font-heading text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.02] tracking-[-0.03em] text-cream">
            Find the few things your days have been missing.
          </h2>
          <Button
            nativeButton={false}
            render={<Link href="/shop" />}
            size="lg"
            className="h-11 rounded-full bg-cream px-6 text-espresso shadow-none transition-colors duration-200 hover:bg-cream/90"
          >
            Browse catalog
            <ArrowUpRight data-icon="inline-end" />
          </Button>
        </div>
      </section>
    </main>
  );
}
