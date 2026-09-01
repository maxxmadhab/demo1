import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { getProductBySlug, getRelatedProducts } from "@/services/productService";
import type { Product } from "@/types/product";
import { useBag } from "@/context/BagContext";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { WishlistButton } from "@/components/ui/WishlistButton";
import { Icon } from "@/components/ui/Icon";
import { LoadingState } from "@/components/shared/States";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatPrice } from "@/utils/format";

const SPEC_LABELS: Record<string, { label: string }> = {
  width: { label: "Width" },
  length: { label: "Length" },
  height: { label: "Height" },
  weight: { label: "Weight" },
  stoneWeight: { label: "Stone weight" },
};

export default function ProductDetailPage() {
  const { product: slug } = useParams<{ product: string }>();
  const reducedMotion = useReducedMotion();
  const { addToBag } = useBag();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState<Product[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setAdded(false);
    (async () => {
      if (!slug) {
        setLoading(false);
        return;
      }
      const found = await getProductBySlug(slug);
      if (cancelled) return;
      setProduct(found ?? null);
      setLoading(false);
      if (found) {
        const rel = await getRelatedProducts(found);
        if (!cancelled) setRelated(rel);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const variantOptions = product?.variants[0]?.name.split("Â·").slice(1).join("").split("/").map((v) => v.trim()).filter(Boolean) ?? [];

  const handleAddToBag = () => {
    if (!product) return;
    addToBag(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2200);
  };

  const enquiryHref = `/contact?product=${encodeURIComponent(product?.name ?? "")}&collection=${encodeURIComponent(product?.collection ?? "")}`;

  if (loading) {
    return (
      <div className="pt-16 lg:pt-20">
        <LoadingState label="Preparing the piece" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-16 lg:pt-20">
        <div className="container-jwel py-24 text-center">
          <h1 className="font-display text-3xl font-medium text-charcoal">Piece not found</h1>
          <p className="mx-auto mt-3 max-w-md font-body text-sm font-light text-stone">
            We couldn't find that piece in the collection.
          </p>
          <Button to="/catalog" variant="outline" className="mt-8">
            Explore the collection
          </Button>
        </div>
      </div>
    );
  }

  const specs = Object.entries(SPEC_LABELS)
    .filter(([key]) => product.dimensions[key as keyof typeof product.dimensions])
    .map(([key, { label }]) => ({
      label,
      value: product.dimensions[key as keyof typeof product.dimensions] as string,
    }));

  return (
    <div className="pt-16 lg:pt-20">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="container-jwel pt-6">
        <ol className="flex flex-wrap items-center gap-1.5 font-body text-[0.68rem] font-light tracking-wide text-stone">
          <li>
            <Link to="/" className="transition-colors hover:text-gold-deep">Home</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link to="/catalog" className="transition-colors hover:text-gold-deep">Catalogue</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              to={`/collection/${product.collection.toLowerCase()}`}
              className="transition-colors hover:text-gold-deep"
            >
              {product.collection}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="max-w-40 truncate text-charcoal">{product.name}</li>
        </ol>
      </nav>

      {/* Main layout */}
      <section className="container-jwel grid grid-cols-1 gap-x-12 gap-y-10 pb-16 pt-6 lg:grid-cols-2 lg:pt-8">
        <ProductGallery images={product.images} name={product.name} />

        <div className="flex flex-col">
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3">
              <p className="font-body text-[0.65rem] font-medium uppercase tracking-[0.26em] text-gold-deep">
                {product.collection} Â· {product.category}
              </p>
              {product.badge && <Badge tone="dark">{product.badge}</Badge>}
            </div>
            <h1 className="mt-3 font-display text-4xl font-medium leading-[1.08] text-charcoal sm:text-[2.75rem]">
              {product.name}
            </h1>
            <p className="mt-4 font-body text-[1.35rem] font-normal text-charcoal">
              {formatPrice(product.price)}
            </p>
            <p className="mt-1 font-body text-xs font-light text-stone">
              Inclusive of duties. A portion of every piece supports responsible sourcing.
            </p>

            <p className="mt-7 max-w-lg font-body text-[0.95rem] font-light leading-relaxed text-charcoal/80">
              {product.description}
            </p>

            {/* Specs */}
            <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-4 border-y border-charcoal/10 py-6 sm:grid-cols-3">
              <Spec label="Material" value={product.material} />
              <Spec label="Gemstone" value={product.gemstone} />
              {specs.map((s) => (
                <Spec key={s.label} label={s.label} value={s.value} />
              ))}
            </dl>

            {/* Variants */}
            {variantOptions.length > 0 && (
              <div className="mt-7">
                <p className="font-body text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-stone">
                  {product.variants[0].name.split("Â·")[0].trim()}
                </p>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {variantOptions.map((v) => (
                    <button
                      key={v}
                      type="button"
                      aria-pressed={selectedVariant === v}
                      onClick={() => setSelectedVariant(v)}
                      className={`min-w-12 border px-4 py-2.5 font-body text-xs transition-colors duration-300 ${
                        selectedVariant === v
                          ? "border-charcoal bg-charcoal text-ivory"
                          : "border-charcoal/25 text-charcoal/80 hover:border-charcoal/60"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CTA row */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button variant="primary" size="lg" onClick={handleAddToBag} className="flex-1">
                {added ? (
                  <>
                    <Icon name="check" size={16} /> Added to Bag
                  </>
                ) : (
                  "Add to Bag"
                )}
              </Button>
              <WishlistButton product={product} variant="solid" className="mx-auto sm:mx-0" />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
              <Link
                to={enquiryHref}
                className="inline-flex items-center gap-2 font-body text-[0.72rem] font-medium uppercase tracking-[0.18em] text-gold-deep underline-offset-4 transition-colors hover:text-charcoal hover:underline"
              >
                <Icon name="mail" size={15} />
                Enquire about this piece
              </Link>
              <span className="hidden font-body text-[0.68rem] font-light text-charcoal/25 sm:inline">
                /
              </span>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("jwel-detail-note");
                  el?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
                }}
                className="inline-flex items-center gap-2 font-body text-[0.72rem] font-medium uppercase tracking-[0.18em] text-charcoal underline-offset-4 hover:text-gold-deep hover:underline"
              >
                The atelier note <Icon name="arrow-right" size={14} />
              </button>
            </div>
            <p className="mt-5 font-body text-[0.72rem] font-light leading-relaxed text-stone">
              Complimentary shipping worldwide Â· 30-day returns Â· Certificate of authenticity included
            </p>
          </motion.div>
        </div>
      </section>

      {/* Atelier note */}
      <section id="jwel-detail-note" className="bg-ivory-deep/60">
        <div className="container-jwel grid grid-cols-1 gap-8 py-16 lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-1">
            <h2 className="font-display text-2xl font-medium text-charcoal">The atelier note</h2>
            <p className="mt-2 font-body text-[0.65rem] font-medium uppercase tracking-[0.22em] text-gold-deep">
              Made by hand, to last
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-2">
            <AtelierNote
              icon="star"
              title="Responsibly sourced"
              body="Our diamonds are conflict-free and each gemstone is traceable to origin, selected by our gemologists in-house."
            />
            <AtelierNote
              icon="bag"
              title="Crafted to order"
              body="Every piece is finished by hand in our atelier. Bespoke commissions and bespoke sizing are always welcomed."
            />
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="container-jwel py-20">
          <SectionHeading eyebrow="Continue exploring" title="Pieces that pair well" />
          <div className="mt-10">
            <ProductGrid products={related} />
          </div>
        </section>
      )}

      {/* Sticky mobile CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-charcoal/10 bg-ivory/90 px-5 py-3 backdrop-blur-xl lg:hidden">
        <div className="flex items-center gap-3">
          <WishlistButton product={product} size="sm" />
          <Link
            to={enquiryHref}
            aria-label={`Enquire about ${product.name}`}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-charcoal/25 text-charcoal transition-colors hover:border-gold-deep hover:text-gold-deep"
          >
            <Icon name="mail" size={17} />
          </Link>
          <Button variant="primary" className="flex-1" onClick={handleAddToBag}>
            {added ? "Added to Bag" : `Add to Bag Â· ${formatPrice(product.price)}`}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-body text-[0.62rem] font-medium uppercase tracking-[0.18em] text-stone">{label}</dt>
      <dd className="mt-1 font-body text-[0.9rem] font-light text-charcoal">{value}</dd>
    </div>
  );
}

function AtelierNote({ icon, title, body }: { icon: "star" | "bag"; title: string; body: string }) {
  return (
    <div className="flex gap-4">
      <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold-deep">
        <Icon name={icon} size={17} />
      </span>
      <div>
        <h3 className="font-display text-lg font-medium text-charcoal">{title}</h3>
        <p className="mt-1.5 font-body text-[0.85rem] font-light leading-relaxed text-stone">{body}</p>
      </div>
    </div>
  );
}