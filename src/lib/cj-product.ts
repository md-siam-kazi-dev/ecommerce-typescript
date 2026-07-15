// Fetches a product from CJdropshipping's Product Details (GET) endpoint and
// maps the raw response into the canonical storefront-safe `StorefrontProduct`
// shape defined in `src/app/products/[id]/types.ts`.
//
// The CJ access token (`NEXT_PUBLIC_CJ_TOKEN`) is a public env var and the
// existing `use-cj-products.ts` already calls CJ directly from the client, so
// this module does the same for consistency.

import type { ProductVariant, StorefrontProduct } from "@/app/products/[id]/types";

const CJ_BASE = "https://developers.cjdropshipping.com/api2.0/v1/product/query";

// Raw response shape from the CJ "Product Details" endpoint (getproduct.md).
interface CJVariant {
  vid: string;
  variantNameEn?: string | null;
  variantSku: string;
  variantKey?: string | null;
  variantImage?: string;
  variantSellPrice?: number;
  inventories?: { totalInventory?: number }[];
}

interface CJProduct {
  pid: string;
  productNameEn?: string;
  productName?: string;
  productSku?: string;
  bigImage?: string;
  productImageSet?: string[];
  categoryId?: string;
  categoryName?: string;
  sellPrice?: number | string;
  description?: string;
  productKeyEn?: string;
  variants?: CJVariant[];
}

/**
 * `productKeyEn` is sometimes a JSON string (["Color","Size"]) and sometimes a
 * bare string ("Color"). Normalize it to a string array.
 */
function parseKeys(raw?: string): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.filter(Boolean).map(String);
    if (typeof parsed === "string") return [parsed];
  } catch {
    return [raw];
  }
  return [];
}

/**
 * Maps the full supplier response down to the storefront-safe
 * `StorefrontProduct` shape. Supplier cost fields are intentionally dropped.
 */
export function mapCjProduct(data: CJProduct): StorefrontProduct {
  const images = Array.from(
    new Set([data.bigImage, ...(data.productImageSet ?? [])].filter(Boolean))
  ) as string[];

  const attributes = parseKeys(data.productKeyEn);

  // "default" is the CJ sentinel for a single-SKU product — no real options
  // to select. Treat it as having no variant attributes.
  const realAttributes =
    attributes.length === 1 && attributes[0] === "default" ? [] : attributes;

  const variants: ProductVariant[] = (data.variants ?? []).map((v) => {
    const keyParts = (v.variantKey ?? "").split("-").filter(Boolean);
    const optionValues: Record<string, string> = {};
    realAttributes.forEach((attr, i) => {
      optionValues[attr] = keyParts[i] ?? "";
    });

    return {
      variantId: v.vid,
      sku: v.variantSku,
      optionValues,
      image: v.variantImage,
      price: Number(v.variantSellPrice) || Number(data.sellPrice) || 0,
      stock: 100,
    };
  });

  const totalStock = variants.length ? 100 : 100;

  const basePrice = Number(data.sellPrice) || 0;

  return {
    slug: data.pid,
    title: data.productNameEn || data.productName || "Product",
    description: data.description || "",
    category: {
      id: data.categoryId ?? "",
      name: data.categoryName ?? "Uncategorized",
    },
    images,
    basePrice,
    hasVariants: realAttributes.length > 0 && variants.length > 0,
    variantAttributes: realAttributes,
    variants,
    stock: totalStock,
    seo: {},
  };
}

export async function fetchCjProduct(pid: string): Promise<StorefrontProduct> {
  const url = `${CJ_BASE}?pid=${encodeURIComponent(pid)}`;
  const res = await fetch(url, {
    headers: { "CJ-Access-Token": process.env.NEXT_PUBLIC_CJ_TOKEN || "" },
  });

  const json = await res.json();
  if (json.code !== 200 || !json.data) {
    throw new Error(json.message || "Failed to fetch product");
  }

  return mapCjProduct(json.data as CJProduct);
}
