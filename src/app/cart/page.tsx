"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { useSession } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

interface CartItem {
  _id?: string;
  productId: string;
  userEmail?: string;
  name: string;
  quantity: number;
  price?: number;
  img?: string;
  image?: string;
}

// The backend cart response shape isn't guaranteed — handle array or a
// wrapped object defensively.
type CartResponse =
  | CartItem[]
  | { items?: CartItem[]; data?: CartItem[]; carts?: CartItem[] };

const EASE = [0.16, 1, 0.3, 1] as const;

export default function CartPage() {
  const { data: session, isPending } = useSession();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    if (isPending) return;

    let active = true;
    (async () => {
      setLoading(true);
      setError(null);
      if (!session?.user) {
        setLoading(false);
        return;
      }
      try {
        const data = await apiFetch<CartResponse>(`/api/user/cart/${session?.user?.email}`);
        console.log(data)
        const list = Array.isArray(data)
          ? data
          : (data.items ?? data.data ?? data.carts ?? []);
        if (!active) return;
        setItems(list);
      } catch (err) {
        if (!active) return;
        console.error("Failed to load cart:", err);
        setError("We couldn't load your cart. Please try again.");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [isPending, session, reload]);

  const subtotal = items.reduce(
    (sum, it) => sum + (it.price ?? 0) * it.quantity,
    0
  );

  const signedOut = !isPending && !session?.user;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 pt-28 pb-16 sm:pt-32 sm:pb-20">
        <header className="mb-8 flex flex-col gap-1">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.24em] text-muted-foreground">
            Your bag
          </p>
          <h1 className="font-heading text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
            Cart
          </h1>
        </header>

        {isPending || loading ? (
          <CartSkeleton />
        ) : signedOut ? (
          <SignedOut />
        ) : error ? (
          <ErrorState message={error} onRetry={() => setReload((r) => r + 1)} />
        ) : items.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
            <motion.ul
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
              className="flex flex-col gap-4"
            >
              {items.map((it) => (
                <CartRow key={it._id ?? it.productId} item={it} />
              ))}
            </motion.ul>

            <aside className="lg:sticky lg:top-28 lg:h-fit">
              <Card>
                <CardContent className="flex flex-col gap-4 p-5">
                  <h2 className="font-heading text-lg font-semibold tracking-[-0.01em]">
                    Summary
                  </h2>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium tabular-nums">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <Separator className="bg-umber/10" />
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-base font-semibold">Total</span>
                    <span className="font-heading text-base font-semibold tabular-nums">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() =>
                      toast.info("Checkout isn't wired up in this preview yet.")
                    }
                  >
                    Checkout
                    <ArrowRight data-icon="inline-end" />
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    Taxes &amp; shipping calculated at checkout.
                  </p>
                </CardContent>
              </Card>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}

function CartRow({ item }: { item: CartItem }) {
  const image = item.img || item.image;
  const lineTotal = (item.price ?? 0) * item.quantity;

  return (
    <motion.li
      variants={{
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
      }}
      className="flex gap-4 rounded-xl border border-umber/10 bg-card p-3 sm:gap-5 sm:p-4"
    >
      <div className="size-20 shrink-0 overflow-hidden rounded-lg border border-umber/10 bg-umber/5 sm:size-24">
        {image ? (
          <img
            src={image}
            alt={item.name}
            loading="lazy"
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-umber/40">
            <ShoppingBag className="size-6" />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
        <div>
          <h3 className="truncate font-heading text-base font-medium leading-snug">
            {item.name}
          </h3>
          <p className="mt-0.5 truncate font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
            {item.productId}
          </p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-muted-foreground">Qty {item.quantity}</span>
          {typeof item.price === "number" ? (
            <span className="font-medium tabular-nums">${lineTotal.toFixed(2)}</span>
          ) : (
            <span className="text-sm text-muted-foreground">—</span>
          )}
        </div>
      </div>
    </motion.li>
  );
}

function CartSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex gap-4 rounded-xl border border-umber/10 bg-card p-4"
        >
          <Skeleton className="size-24 rounded-lg" />
          <div className="flex flex-1 flex-col justify-between gap-3 py-1">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

function SignedOut() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-umber/10 bg-card py-20 text-center">
      <ShoppingBag className="size-8 text-muted-foreground" />
      <div>
        <p className="font-heading text-lg text-foreground">Your cart is waiting.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Log in to see the items you&apos;ve saved.
        </p>
      </div>
      <Button nativeButton={false} render={<Link href="/auth/login" />} className="rounded-full">
        Log in
      </Button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-umber/10 bg-card py-20 text-center">
      <ShoppingBag className="size-8 text-muted-foreground" />
      <div>
        <p className="font-heading text-lg text-foreground">Your cart is empty.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse the shop to add something you love.
        </p>
      </div>
      <Button nativeButton={false} render={<Link href="/shop" />} className="rounded-full">
        Shop now
      </Button>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-umber/10 bg-card py-20 text-center">
      <p className="font-heading text-lg text-foreground">{message}</p>
      <Button variant="outline" className="rounded-full" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}
