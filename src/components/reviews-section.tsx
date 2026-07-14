import { Star } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Marquee } from "@/components/ui/marquee";
import { reviews } from "@/data/reviews";

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function ReviewCard({ name, review }: { name: string; review: string }) {
  return (
    <figure className="flex w-[300px] shrink-0 flex-col gap-3 rounded-xl border border-border/60 bg-card p-5">
      <div className="flex items-center gap-0.5 text-primary">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="size-3.5 fill-current" />
        ))}
      </div>
      <blockquote className="text-sm leading-relaxed text-foreground">
        “{review}”
      </blockquote>
      <figcaption className="mt-auto flex items-center gap-3 pt-1">
        <Avatar className="size-8">
          <AvatarFallback className="bg-primary/10 text-xs text-primary">
            {initials(name)}
          </AvatarFallback>
        </Avatar>
        <span className="font-heading text-sm text-foreground">{name}</span>
      </figcaption>
    </figure>
  );
}

export function ReviewsSection() {
  return (
    <section className="border-t border-border py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-2">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.24em] text-muted-foreground">
            Vol. 04 — Loved by
          </p>
          <h2 className="font-heading text-[clamp(1.75rem,3.5vw,2.75rem)] leading-[1.02] tracking-[-0.03em] text-foreground">
            What people are saying
          </h2>
        </div>
      </div>

      <div className="mt-10">
        <Marquee pauseOnHover className="[--duration:55s] py-2">
          {reviews.map((r) => (
            <ReviewCard key={r.customerName} name={r.customerName} review={r.review} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
