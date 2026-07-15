"use client";

import { Menu, Search, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { authClient, useSession } from "@/lib/auth-client";
import { getUserRole } from "@/lib/user-role";
import { useCart } from "@/lib/cart";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { count, loading: cartLoading } = useCart();

  const dashboardHref = session
    ? `/dashboard/${getUserRole(session.user)}`
    : "";
  const navLinks = [
    { href: "/shop", label: "Shop" },
    { href: "/about", label: "About" },
    { href: "/contactus", label: "Contact" },
    { href: dashboardHref, label: "Dashboard" },
  ] as const;

  const user = session?.user;
  const displayName = user?.name ?? user?.email ?? "";
  const shortName = user?.name
    ? user.name.split(" ")[0]
    : (user?.email ?? "").split("@")[0];
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleSignOut = async () => {
    setSigningOut(true);
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <div className="fixed top-0 z-50 w-full">
        <div className="bg-primary text-primary-foreground">
          <div className="mx-auto flex h-8 max-w-7xl items-center justify-center px-6">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.22em]">
              Complimentary shipping on orders over $150
            </p>
          </div>
        </div>

        <header
          className={cn(
            "border-b transition-[background-color,border-color,backdrop-filter] duration-500",
            scrolled
              ? "border-border bg-background/90 backdrop-blur-md"
              : "border-transparent bg-transparent"
          )}
        >
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6">
            <div className="flex items-center gap-6">
              <button
                type="button"
                aria-expanded={mobileOpen}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                className="inline-flex size-9 items-center justify-center rounded-full border border-border/60 text-foreground transition-colors hover:bg-muted md:hidden"
                onClick={() => setMobileOpen((open) => !open)}
              >
                {mobileOpen ? <X /> : <Menu />}
              </button>

              <Link
                href="/"
                className="font-heading text-[1.35rem] tracking-[-0.03em] text-foreground md:text-[1.55rem]"
              >
                Aesthete
              </Link>

              <nav
                aria-label="Primary"
                className="hidden items-center gap-8 md:flex"
              >
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`group relative  text-sm font-medium text-foreground ${isPending && link.label === 'Dashboard' && 'hidden'}`}
                  >
                    {link.label}
                    <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-primary transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full" />
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center justify-end gap-2 md:gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="hidden rounded-full md:inline-flex"
                aria-label="Search"
              >
                <Search />
              </Button>

              <ThemeToggle />

              {isPending ? (
                <Skeleton className="hidden h-8 w-28 rounded-full sm:inline-flex" />
              ) : session ? (
                <div className="hidden items-center gap-2 sm:inline-flex">
                  <Avatar className="size-7">
                    {user?.image ? (
                      <AvatarImage src={user.image} alt={displayName} />
                    ) : null}
                    <AvatarFallback>{initials || "U"}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-foreground">
                    {shortName}
                  </span>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="hidden text-sm font-medium text-foreground transition-colors hover:text-primary sm:inline"
                >
                  Log in
                </Link>
              )}

              <Button
                variant="outline"
                nativeButton={false}
                render={<Link href="/cart" />}
                className="rounded-full border-border bg-background/70 px-4 shadow-none backdrop-blur-sm"
                aria-label="View cart"
              >
                <ShoppingBag data-icon="inline-start" />
                Cart
                {cartLoading ? (
                  <Spinner className="size-3.5" />
                ) : (
                  <span className="font-mono text-[0.7rem] tabular-nums text-muted-foreground">
                    {count}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </header>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/95 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        )}
        aria-hidden={!mobileOpen}
      >
        <nav
          aria-label="Mobile"
          className="flex h-full flex-col justify-center gap-8 px-10 pt-24"
        >
          {navLinks.map((link, index) => (
            <Link
              key={link.label}
              href={link.href}
              className="group flex items-baseline gap-4"
              onClick={() => setMobileOpen(false)}
            >
              <span className="font-mono text-xs text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="font-heading text-4xl text-foreground transition-colors group-hover:text-primary">
                {link.label}
              </span>
            </Link>
          ))}

          {isPending ? (
            <Skeleton className="mt-4 h-4 w-32" />
          ) : session ? (
            <div className="mt-4 flex flex-col gap-3">
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {displayName}
              </span>
              <Link
                href="/account"
                className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground"
                onClick={() => setMobileOpen(false)}
              >
                Profile
              </Link>
              <Link
                href="/orders"
                className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground"
                onClick={() => setMobileOpen(false)}
              >
                Orders
              </Link>
              <Link
                href="/cart"
                className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground"
                onClick={() => setMobileOpen(false)}
              >
                Cart
              </Link>
              <Link
                href={dashboardHref}
                className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground"
                onClick={() => setMobileOpen(false)}
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  handleSignOut();
                }}
                className="font-mono text-xs uppercase tracking-[0.18em] text-destructive text-left"
              >
                {signingOut ? "Signing out…" : "Sign out"}
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground"
              onClick={() => setMobileOpen(false)}
            >
              Log in
            </Link>
          )}

          <div className="mt-6 flex items-center gap-3">
            <ThemeToggle />
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Toggle theme
            </span>
          </div>
        </nav>
      </div>
    </>
  );
}
