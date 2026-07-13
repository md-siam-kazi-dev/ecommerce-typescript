export interface ProductVariant {
  variantId: string;
  sku: string;
  optionValues: Record<string, string>;
  image?: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  supplierCost?: number;
  barcode?: string;
  weightGrams?: number;
}

export interface ProductCategory {
  id: string;
  name: string;
}

export interface ProductSeo {
  keywords: string[];
  metaTitle?: string;
  metaDescription?: string;
}

export interface ProductSupplier {
  source: string;
  supplierProductId: string;
  supplierSku: string;
  supplierUrl?: string;
  supplierCost: number;
}

export interface DimensionsMm {
  length: number;
  width: number;
  height: number;
}

export interface Product {
  _id: string;
  slug: string;
  title: string;
  description: string;
  shortDescription?: string;
  category: ProductCategory;
  images: string[];
  basePrice: number;
  compareAtPrice?: number;
  hasVariants: boolean;
  variantAttributes: string[];
  variants: ProductVariant[];
  stock: number;
  isActive: boolean;
  seo: ProductSeo;
  supplier: ProductSupplier;
  weightGrams?: number;
  dimensionsMm?: DimensionsMm;
  createdAt: string;
  updatedAt: string;
}
