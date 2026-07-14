import { HeroBanner } from "@/components/hero-banner";
import { TrendingCj } from "@/components/product/trending-cj";
import { ReviewsSection } from "@/components/reviews-section";
import { FaqSection } from "@/components/faq-section";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <HeroBanner />
      <TrendingCj />
      <ReviewsSection />
      <FaqSection />
    </main>
  );
}
