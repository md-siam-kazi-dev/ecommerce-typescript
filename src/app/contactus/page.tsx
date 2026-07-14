"use client";

import { useRef } from "react";
import {
  ArrowUpRight,
  Clock,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const contactDetails = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@aesthete.studio",
    href: "mailto:hello@aesthete.studio",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+1 (212) 555-0148",
    href: "tel:+12125550148",
  },
  {
    icon: MapPin,
    label: "Studio",
    value: "128 Ceramic Lane, Brooklyn, NY 11201",
    href: "https://maps.google.com/?q=128+Ceramic+Lane+Brooklyn+NY",
  },
  {
    icon: Clock,
    label: "Hours",
    value: "Tue – Sat, 10:00 – 18:00",
    href: null,
  },
] as const;

export default function ContactUsPage() {
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
            "[data-anim='grid'] > *",
            { opacity: 0, y: 20, stagger: 0.1 },
            "-=0.5"
          )
          .from(
            "[data-anim='form']",
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.currentTarget.reset();
    toast.success("Message sent — we'll be in touch shortly.");
  };

  return (
    <main ref={root} className="flex min-h-screen flex-col">
      {/* Intro */}
      <section className="relative overflow-hidden pt-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 px-6 pb-16 pt-16 text-center lg:gap-10 lg:pb-24 lg:pt-24">
          <p
            data-anim="eyebrow"
            className="font-mono text-[0.7rem] uppercase tracking-[0.24em] text-muted-foreground"
          >
            Get in touch — Vol. 04
          </p>

          <h1
            data-anim="title"
            className="font-heading text-[clamp(2.5rem,5.5vw,4.25rem)] leading-[0.98] tracking-[-0.04em] text-foreground"
          >
            Say hello.
          </h1>

          <p
            data-anim="sub"
            className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            Questions about a piece, a custom order, or a studio visit? We'd love
            to hear from you. Reach out and a real person will reply within two
            business days.
          </p>
        </div>
      </section>

      {/* Details + form */}
      <section className="border-t border-border bg-card/40">
        <div className="mx-auto grid max-w-5xl gap-12 px-6 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:py-24">
          <div className="flex flex-col gap-8">
            <div data-anim="grid" className="flex flex-col gap-4">
              {contactDetails.map((detail) => {
                const Icon = detail.icon;
                const inner = (
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">
                      {detail.label}
                    </span>
                    <span className="font-heading text-lg tracking-[-0.02em] text-foreground">
                      {detail.value}
                    </span>
                  </div>
                );

                return (
                  <div
                    key={detail.label}
                    className={cn(
                      "flex items-center gap-4 rounded-lg border border-border/60 bg-background p-5",
                      "transition-colors duration-300 hover:border-primary/40"
                    )}
                  >
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </span>
                    {detail.href ? (
                      <Link
                        href={detail.href}
                        className="transition-colors duration-200 hover:text-primary"
                      >
                        {inner}
                      </Link>
                    ) : (
                      inner
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <form
            data-anim="form"
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 rounded-2xl border border-border/60 bg-background p-6 md:p-8"
          >
            <div className="flex flex-col gap-2">
              <h2 className="font-heading text-[clamp(1.5rem,3vw,2.25rem)] tracking-[-0.03em] text-foreground">
                Send a message
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Leave your details and we'll get back to you.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  placeholder="Jane Aesthete"
                  className="h-11 rounded-full border-border/70"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="h-11 rounded-full border-border/70"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                name="subject"
                placeholder="A question about an order"
                className="h-11 rounded-full border-border/70"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="message">Message</Label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                placeholder="Tell us what's on your mind…"
                className="w-full min-w-0 rounded-2xl border border-border/70 bg-transparent px-4 py-3 text-base outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="h-11 rounded-full px-6 shadow-none"
            >
              Send message
              <Send data-icon="inline-end" />
            </Button>
          </form>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-espresso text-cream">
        <div
          data-reveal
          className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-20 text-center lg:py-28"
        >
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.24em] text-cream/70">
            Or just browse
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
