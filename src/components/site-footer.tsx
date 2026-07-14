import Link from "next/link";
import { AtSign, Globe, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const columns = [
  {
    title: "Shop",
    links: [
      { label: "All products", href: "/shop" },
      { label: "New arrivals", href: "/shop" },
      { label: "Textiles", href: "/shop" },
      { label: "Tableware", href: "/shop" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Journal", href: "/about" },
      { label: "Stockists", href: "/about" },
      { label: "Contact", href: "/about" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Orders", href: "/orders" },
      { label: "Wishlist", href: "/wishlist" },
      { label: "Profile", href: "/account" },
    ],
  },
] as const;

const socials = [
  { label: "Newsletter", href: "#newsletter", Icon: Send },
  { label: "Email", href: "mailto:hello@aesthete.example", Icon: AtSign },
  { label: "Website", href: "https://aesthete.example", Icon: Globe },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      aria-label="Footer"
      className="mt-auto bg-primary text-primary-foreground"
    >
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-5">
            <Link
              href="/"
              className="font-heading text-2xl tracking-[-0.03em] text-primary-foreground"
            >
              Aesthete
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-primary-foreground/70">
              Curated essentials for daily ritual — home goods, textiles, and
              tableware, considered down to the last detail.
            </p>
            <div className="flex gap-2">
              {socials.map(({ label, href, Icon }) => (
                <Button
                  key={label}
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-primary-foreground/80 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  render={
                    <Link
                      href={href}
                      aria-label={label}
                      target="_blank"
                      rel="noreferrer"
                    />
                  }
                >
                  <Icon />
                </Button>
              ))}
            </div>
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title} className="flex flex-col gap-4">
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-primary-foreground/60">
                {column.title}
              </span>
              <ul className="flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group relative w-fit text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                    >
                      {link.label}
                      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-primary-foreground transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <Separator className="my-10 bg-primary-foreground/15" />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-primary-foreground/60">
            © {year} Aesthete — Curated essentials
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {["Privacy", "Terms", "Shipping"].map((label) => (
              <Link
                key={label}
                href="/about"
                className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-primary-foreground/60 transition-colors hover:text-primary-foreground"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
