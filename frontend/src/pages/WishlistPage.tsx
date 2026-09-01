import { motion } from "motion/react";
import { useWishlist } from "@/context/WishlistContext";
import { ProductGrid } from "@/components/product/ProductGrid";
import { EmptyState } from "@/components/shared/States";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export default function WishlistPage() {
  const { items, clearWishlist } = useWishlist();

  return (
    <div className="pt-16 lg:pt-20">
      <section className="container-jwel pb-12 pt-10 sm:pt-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-body text-[0.65rem] font-medium uppercase tracking-[0.28em] text-gold-deep">
            Your private collection
          </p>
          <h1 className="mt-2 font-display text-4xl font-medium leading-[1.05] text-charcoal sm:text-5xl">
            Wishlist
          </h1>
          <p className="mt-4 max-w-lg font-body text-[0.9rem] font-light leading-relaxed text-stone">
            Pieces you've saved for moments you have in mind. Stored privately on this
            device — we'll move them to your account soon.
          </p>
        </motion.div>
      </section>

      <section className="container-jwel pb-24">
        {items.length === 0 ? (
          <EmptyState
            title="Your wishlist is empty"
            message="Tap the heart on any piece to begin curating your private collection."
            action={
              <Button to="/catalog" variant="outline">
                Discover the collection
              </Button>
            }
          />
        ) : (
          <>
            <div className="mb-8 flex items-center justify-between border-b border-charcoal/10 pb-5">
              <p className="font-body text-xs font-light text-stone">
                {items.length} saved piece{items.length === 1 ? "" : "s"}
              </p>
              <button
                type="button"
                onClick={clearWishlist}
                className="inline-flex items-center gap-1.5 font-body text-[0.68rem] font-medium uppercase tracking-[0.16em] text-stone underline underline-offset-4 transition-colors hover:text-charcoal"
              >
                <Icon name="close" size={12} />
                Clear wishlist
              </button>
            </div>
            <ProductGrid products={items} />
          </>
        )}
      </section>
    </div>
  );
}