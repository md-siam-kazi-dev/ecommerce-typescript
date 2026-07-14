import type { StorefrontProduct } from "./types";

// Mapped from productalldetails.json[0] ("Sleeveless Ins Loose Street Sports
// Vest", pid 1784112975599640576) using the supplier -> normalized field
// mapping in REQUIREMENTS.md §6.1.
//
//   productNameEn        -> title
//   description (HTML)   -> description
//   productImageSet      -> images
//   categoryName          -> category.name
//   variants[].vid        -> variants[].variantId
//   variants[].variantSku -> variants[].sku
//   variants[].variantKey -> variants[].optionValues (split on "-", ordered
//                            by productKeyEnSet: ["Color", "Size"])
//   variants[].variantImage -> variants[].image
//
// Admin has already reviewed and set real sell prices (basePrice / variant
// price) — supplier's sellPrice/suggestSellPrice are cost-basis fields and
// are NOT carried into this storefront-safe object.

export const sampleProduct: StorefrontProduct = {
  slug: "sleeveless-ins-loose-street-sports-vest",
  title: "Sleeveless Ins Loose Street Sports Vest",
  shortDescription: "Relaxed, heavyweight cotton vest with an earthy street-style palette.",
  description: `
    <p><b>Product information</b><br/>
    Fabric: Cotton &middot; Fit: Loose, street-style &middot; Hem: Straight &middot; Craft: Sleeveless</p>
    <p>An easy, heavyweight vest built for layering — cut generously through the
    body with a straight hem and a soft cotton hand-feel. Part of the 2024
    warm-weather streetwear line.</p>
    <p><b>Note:</b> Please allow 2–3cm variation due to manual measurement.
    Actual color may vary slightly by display.</p>
  `,
  category: {
    id: "655B8008-6BB9-4AA1-8025-6206ACFF018A",
    name: "Men's Clothing > T-Shirts > Solid",
  },
  images: [
    "https://oss-cf.cjdropshipping.com/product/2024/04/28/06/27f4cf3e-533a-4cc2-afa1-156a3a92ca77_fine.jpeg",
    "https://oss-cf.cjdropshipping.com/product/2024/04/27/06/91d48eb0-0b53-4563-8386-6d2d249c1569_trans.jpeg",
    "https://oss-cf.cjdropshipping.com/product/2024/04/27/06/fdcfc926-dea8-4724-a695-279d8b6483bc_trans.jpeg",
    "https://oss-cf.cjdropshipping.com/product/2024/04/27/06/084df3b5-b77b-43ba-ac7e-7c36741346ad_trans.jpeg",
    "https://oss-cf.cjdropshipping.com/product/2024/04/27/06/7b755e25-0026-4def-a4ed-9dee03dfb4bc_trans.jpeg",
  ],
  basePrice: 34.99,
  compareAtPrice: 44.99,
  hasVariants: true,
  variantAttributes: ["Color", "Size"],
  stock: 47,
  seo: {
    metaTitle: "Sleeveless Ins Loose Street Sports Vest | Streetwear",
    metaDescription:
      "Loose-fit heavyweight cotton vest in an earthy street palette. Shop sizes S–XL.",
    canonicalUrl: "/products/sleeveless-ins-loose-street-sports-vest",
  },
  variants: [
    {
      variantId: "1784112975675138048",
      sku: "CJYD202209601AZ",
      optionValues: { Color: "FG Plum Purple", Size: "S" },
      image:
        "https://oss-cf.cjdropshipping.com/product/2024/04/27/06/91d48eb0-0b53-4563-8386-6d2d249c1569_trans.jpeg",
      price: 34.99,
      compareAtPrice: 44.99,
      stock: 18,
    },
    {
      variantId: "1784112975733858304",
      sku: "CJYD202209602BY",
      optionValues: { Color: "FG Plum Purple", Size: "M" },
      image:
        "https://oss-cf.cjdropshipping.com/product/2024/04/27/06/91d48eb0-0b53-4563-8386-6d2d249c1569_trans.jpeg",
      price: 34.99,
      compareAtPrice: 44.99,
      stock: 4,
    },
    {
      variantId: "1784112975800967168",
      sku: "CJYD202209603CX",
      optionValues: { Color: "FG Plum Purple", Size: "L" },
      image:
        "https://oss-cf.cjdropshipping.com/product/2024/04/27/06/91d48eb0-0b53-4563-8386-6d2d249c1569_trans.jpeg",
      price: 34.99,
      compareAtPrice: 44.99,
      stock: 0,
    },
    {
      variantId: "1784112975868076032",
      sku: "CJYD202209604DW",
      optionValues: { Color: "Sand", Size: "S" },
      image:
        "https://oss-cf.cjdropshipping.com/product/2024/04/27/06/fdcfc926-dea8-4724-a695-279d8b6483bc_trans.jpeg",
      price: 34.99,
      compareAtPrice: 44.99,
      stock: 12,
    },
    {
      variantId: "1784112975935184896",
      sku: "CJYD202209605EV",
      optionValues: { Color: "Sand", Size: "M" },
      image:
        "https://oss-cf.cjdropshipping.com/product/2024/04/27/06/fdcfc926-dea8-4724-a695-279d8b6483bc_trans.jpeg",
      price: 34.99,
      compareAtPrice: 44.99,
      stock: 13,
    },
  ],
};

// Small related-products stub for the "You may also like" section
// (FR-11h) — real implementation fetches by shared category.id server-side.
export const relatedProducts = [
  {
    slug: "carbon-gray-street-vest",
    title: "Carbon Gray Street Vest",
    image:
      "https://oss-cf.cjdropshipping.com/product/2024/04/27/06/8680cf38-0bf1-42e6-a7d1-98cad4cc17a7_trans.jpeg",
    price: 32.99,
  },
  {
    slug: "oat-gray-loose-vest",
    title: "Oat Gray Loose Vest",
    image:
      "https://oss-cf.cjdropshipping.com/product/2024/04/27/06/11f7b6b0-6d96-4f43-86c8-4d355175f830_trans.jpeg",
    price: 34.99,
  },
  {
    slug: "cloudy-blue-ins-vest",
    title: "Cloudy Blue Ins Vest",
    image:
      "https://oss-cf.cjdropshipping.com/product/2024/04/27/06/f9fb71e5-dfdb-499a-b146-2c71c1b8d98d_trans.jpeg",
    price: 34.99,
  },
  {
    slug: "taupe-street-vest",
    title: "Taupe Street Vest",
    image:
      "https://oss-cf.cjdropshipping.com/product/2024/04/27/06/b513a40d-4bf6-484e-8796-d90fcc296183_trans.jpeg",
    price: 32.99,
  },
];