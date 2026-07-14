"use client";

import { useEffect, useState } from "react";

// Shape returned by the CJ Dropshipping "My Product" API — the
// admin's added catalog, used as the storefront source of truth.
export interface CJMyProduct {
  productId: string;
  nameEn: string;
  sku: string;
  bigImage: string;
  totalPrice: string;
  sellPrice: string;
  listedShopNum: string;
  createAt: number;
}

export function useCjProducts(size = 50) {
  const [products, setProducts] = useState<CJMyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url = new URL(
          "https://developers.cjdropshipping.com/api2.0/v1/product/myProduct/query"
        );
        url.searchParams.append("page", "1");
        url.searchParams.append("size", String(size));
        const response = await fetch(url.toString(), {
          method: "GET",
          headers: {
            "CJ-Access-Token": process.env.NEXT_PUBLIC_CJ_TOKEN || "",
          },
        });
        const json = await response.json();
        if (!active) return;
        if (json.code === 200 && json.data) {
          setProducts(json.data.content || []);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        if (active) setProducts([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      active = false;
    };
  }, [size]);

  return { products, loading };
}
