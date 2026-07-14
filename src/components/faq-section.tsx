"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const faqs = [
  {
    question: "How long does shipping take?",
    answer:
      "Orders are processed within 1–2 business days. Domestic delivery typically arrives in 3–5 business days, and international orders in 7–14 business days. You'll receive tracking by email as soon as your order leaves the studio.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We accept returns within 30 days of delivery on unused items in their original condition. Exchange or full refund—your choice. Damaged-in-transit pieces are replaced at no cost, just reach out with a photo.",
  },
  {
    question: "Are your materials sustainably sourced?",
    answer:
      "Yes. We work with independent makers who use natural, enduring materials—stoneware, linen, oak—and produce in small batches. Every piece is chosen for material honesty and built to age gracefully.",
  },
  {
    question: "Do you offer gift wrapping?",
    answer:
      "We do. At checkout, select gift wrapping and add a handwritten note. Pieces are packed in recycled kraft and tissue, never plastic, so they arrive ready to give.",
  },
  {
    question: "Can I track my order?",
    answer:
      "Absolutely. Once your order ships, you'll get an email with a tracking link. You can also view order status and history anytime from your account dashboard.",
  },
] as const;

export function FaqSection() {
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
            "[data-anim='list']",
            { opacity: 0, y: 30, duration: 0.9 },
            "-=0.5"
          );
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="border-t border-border">
      <div className="mx-auto max-w-3xl px-6 py-20 lg:py-28">
        <div className="flex flex-col items-center gap-4 text-center">
          <p
            data-anim="eyebrow"
            className="font-mono text-[0.7rem] uppercase tracking-[0.24em] text-muted-foreground"
          >
            Good to know
          </p>
          <h2
            data-anim="title"
            className="font-heading text-[clamp(1.75rem,4vw,3rem)] leading-[1.02] tracking-[-0.03em] text-foreground"
          >
            Frequently asked
          </h2>
          <p
            data-anim="sub"
            className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            Everything you might want to know before your first order. Still
            curious? Reach us anytime.
          </p>
        </div>

        <div
          data-anim="list"
          className="mt-12 rounded-2xl border border-border/60 bg-background px-5 md:px-8"
        >
          <Accordion multiple defaultValue={["shipping"]} keepMounted>
            {faqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={String(index)}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
