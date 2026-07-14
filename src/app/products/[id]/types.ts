// Types describing the *storefront-safe* subset of the normalized Product
// schema (REQUIREMENTS.md §6.1). Fields that must never reach the customer
// — supplier.supplierCost, supplier.supplierProductId, internal _id, etc. —
// are intentionally omitted. The API layer should map the full admin
// `Product` document down to `StorefrontProduct` before it ever serializes
// a response to a customer-facing route.

export interface ProductVariant {
  variantId: string;
  sku: string;
  optionValues: Record<string, string>; // e.g. { Color: "Dark Grey", Size: "XL" }
  image?: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
}

export interface StorefrontProduct {
  slug: string;
  title: string;
  description: string; // rich text / HTML
  shortDescription?: string;

  category: {
    id: string;
    name: string; // "Men's Clothing > T-Shirts > Solid"
  };

  images: string[];

  basePrice: number;
  compareAtPrice?: number;

  hasVariants: boolean;
  variantAttributes: string[]; // e.g. ["Color", "Size"]
  variants: ProductVariant[];

  stock: number;

  seo: {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
  };
}

export type StockLevel = "in-stock" | "low-stock" | "out-of-stock";

/** Simple, admin-tunable thresholds — swap for real config later. */
export function getStockLevel(stock: number): StockLevel {
  if (stock <= 0) return "out-of-stock";
  if (stock <= 5) return "low-stock";
  return "in-stock";
}