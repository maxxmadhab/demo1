import { useEffect, useState } from "react";
import type { Product } from "@/types/product";
import { getNewArrivals, getBestSellers } from "@/services/productService";
import { Hero } from "@/components/home/Hero";
import { ProductRail } from "@/components/home/ProductRail";
import { EditorialSection } from "@/components/home/EditorialSection";
import { Craftsmanship } from "@/components/home/Craftsmanship";
import { LoadingState } from "@/components/shared/States";

export default function HomePage() {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [newItems, best] = await Promise.all([getNewArrivals(8), getBestSellers(8)]);
      if (cancelled) return;
      setNewArrivals(newItems);
      setBestSellers(best);
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return (
      <div className="pt-16 lg:pt-20">
        <LoadingState label="Opening the maison" />
      </div>
    );
  }

  return (
    <>
      <Hero />
      <ProductRail
        eyebrow="New this season"
        title="New arrivals"
        link={{ to: "/catalog?sort=newest", label: "View all new pieces" }}
        products={newArrivals}
        className="py-20 lg:py-24"
      />
      <ProductRail
        id="jwel-explore-more"
        eyebrow="Most loved"
        title="Best sellers"
        link={{ to: "/catalog?sort=popular", label: "View all best sellers" }}
        products={bestSellers}
        className="py-20 lg:py-28"
      />
      <EditorialSection />
      <Craftsmanship />
    </>
  );
}

