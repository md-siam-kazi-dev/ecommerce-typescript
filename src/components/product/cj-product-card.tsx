"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "@/lib/auth-client";
import { useCart } from "@/lib/cart";
import { getAuthToken } from "@/lib/api";
import type { CJMyProduct } from "@/lib/use-cj-products";

export function CjProductCard({ product }: { product: CJMyProduct }) {
  const { data: session } = useSession();
  const { addItem } = useCart();
  const [qty, setQty] = useState("1");
  const price = product.totalPrice || product.sellPrice;

  const handleAdd = async () => {
    const parsed = parseFloat(price);
    const numericPrice = Number.isFinite(parsed) ? parsed : 0;
    const quantity = Number(qty);

    addItem(
      {
        id: product.productId,
        name: product.nameEn,
        price: numericPrice,
        image: product.bigImage,
      },
      quantity
    );
    toast.success("Added to cart");

    if (!session?.user) return;

    try {
      const token = await getAuthToken();
      if (!token) return;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/user/addCart`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: product.productId,
            userEmail: session.user.email,
            price: numericPrice,
            quantity,
            img: product.bigImage,
            name:product.nameEn
          }),
        }
      );

      if (!res.ok) {
        console.error("Failed to sync cart with server");
      }
    } catch (error) {
      console.error("Error syncing cart:", error);
    }
  };

  return (
    <Card className="group/card flex h-full flex-col overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md">
      <img
        src={product.bigImage}
        alt={product.nameEn}
        loading="lazy"
        className="aspect-square w-full object-cover transition-transform duration-500 ease-out group-hover/card:scale-105"
      />
      <CardContent className="flex flex-1 flex-col justify-between gap-3">
        <h3 className="line-clamp-2 font-heading text-base font-medium leading-snug text-foreground transition-colors duration-200 group-hover/card:text-umber">
          {product.nameEn}
        </h3>
        <div className="mt-auto flex flex-col gap-2 pt-1">
          <div className="flex items-center justify-between gap-2">
            <span className="font-heading text-lg tracking-[-0.02em] text-foreground">
              ${price}
            </span>
            <Select value={qty} onValueChange={(value) => setQty(value ?? "1")}>
              <SelectTrigger
                size="sm"
                className="w-20 rounded-full"
                aria-label="Quantity"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col items-stretch gap-2.5 px-2 pb-1 pt-2 sm:flex-col">
            <Button onClick={handleAdd} className="flex-1 p-1 rounded-full">
              <ShoppingBag data-icon="inline-start" />
              Add to cart
            </Button>
            <Button
              nativeButton={false}
              render={<Link href={`/products/${product.productId}`} />}
              variant="outline"
              className="flex-1 p-1 rounded-full"
            >
              Details
              <ArrowUpRight data-icon="inline-end" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function CjProductCardSkeleton() {
  return (
    <Card className="overflow-hidden pt-0">
      <Skeleton className="aspect-square w-full rounded-none" />
      <CardContent className="flex flex-col justify-between gap-3">
        <Skeleton className="h-4 w-3/4" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-7 w-20 rounded-full" />
          <div className="flex items-center gap-2 pt-1">
            <Skeleton className="h-9 w-full flex-1 rounded-full" />
            <Skeleton className="h-9 w-full flex-1 rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
