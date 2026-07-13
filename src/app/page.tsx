import { HeroBanner } from "@/components/hero-banner";
import { TrendingProducts } from "@/components/trending-products";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <HeroBanner />
      <TrendingProducts />
    </main>
  );
}
