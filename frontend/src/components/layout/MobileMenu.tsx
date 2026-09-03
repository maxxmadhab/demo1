import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { useUI } from "@/context/UIContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/hooks/useAuth";
import { useEscapeKey } from "@/hooks/useOverlayBehavior";
import { siteConfig } from "@/config/site";
import { collections as collectionsData } from "@/data/collections";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/utils/cn";

const CATEGORY_LINKS = [
  { label: "Rings", to: "/catalog?category=Rings" },
  { label: "Necklaces", to: "/catalog?category=Necklaces" },
  { label: "Earrings", to: "/catalog?category=Earrings" },
  { label: "Bracelets", to: "/catalog?category=Bracelets" },
  { label: "Pendants", to: "/catalog?category=Pendants" },
  { label: "Bridal Jewelry", to: "/catalog?category=Bridal%20Jewelry" },
];

export function MobileMenu() {
  const { mobileMenuOpen, setMobileMenuOpen, setSearchOpen } = useUI();
  const { count } = useWishlist();
  const { isAuthenticated, isAdmin, signOut } = useAuth();
  const reducedMotion = useReducedMotion();
  const [accordion, setAccordion] = useState<string | null>(null);

  useEscapeKey(mobileMenuOpen, () => setMobileMenuOpen(false));

  useEffect(() => {
    if (!mobileMenuOpen) setAccordion(null);
  }, [mobileMenuOpen]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [setMobileMenuOpen]);

  return (
    <AnimatePresence>
      {mobileMenuOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex flex-col bg-ivory lg:hidden"
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reducedMotion ? undefined : { opacity: 0, transition: { duration: 0.3 } }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-5 sm:px-8">
            <Logo />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
              className="flex h-11 w-11 items-center justify-center rounded-full text-charcoal"
            >
              <Icon name="close" size={22} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-5 pb-10 sm:px-8">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setSearchOpen(true);
              }}
              className="mb-8 flex w-full items-center gap-3 border-b border-charcoal/10 pb-4 font-body text-sm font-light text-stone"
            >
              <Icon name="search" size={17} />
              Search the collection
            </button>

            <motion.nav
              initial={reducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-1"
              aria-label="Mobile"
            >
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 font-display text-3xl font-medium text-charcoal"
              >
                Home
              </Link>

              {/* Collections accordion */}
              <div>
                <button
                  type="button"
                  onClick={() => setAccordion(accordion === "collections" ? null : "collections")}
                  aria-expanded={accordion === "collections"}
                  className="flex w-full items-center justify-between py-3 font-display text-3xl font-medium text-charcoal"
                >
                  Collections
                  <Icon
                    name="chevron-down"
                    size={20}
                    className={cn(
                      "transition-transform duration-300",
                      accordion === "collections" && "rotate-180"
                    )}
                  />
                </button>
                <AnimatePresence>
                  {accordion === "collections" && (
                    <motion.div
                      initial={reducedMotion ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={reducedMotion ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-2 gap-x-4 pb-4 pt-1">
                        {collectionsData.map((c) => (
                          <Link
                            key={c.slug}
                            to={`/collection/${c.slug}`}
                            onClick={() => setMobileMenuOpen(false)}
                            className="py-2 font-body text-[0.95rem] font-light text-charcoal/80"
                          >
                            {c.name}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                to="/catalog?sort=newest"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 font-display text-3xl font-medium text-charcoal"
              >
                New Arrivals
              </Link>

              {CATEGORY_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 font-display text-3xl font-medium text-charcoal"
                >
                  {link.label}
                </Link>
              ))}

              <Link
                to="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 py-3 font-display text-3xl font-medium text-charcoal"
              >
                Wishlist
                {count > 0 && (
                  <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-gold-deep px-2 font-body text-[0.65rem] font-semibold text-ivory">
                    {count}
                  </span>
                )}
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-3 font-display text-3xl font-medium text-gold-deep"
                >
                  Admin Dashboard
                </Link>
              )}

              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut();
                  }}
                  className="flex w-full items-center gap-3 py-3 text-left font-display text-3xl font-medium text-charcoal"
                >
                  Sign Out
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 font-display text-3xl font-medium text-charcoal"
                >
                  Login
                </Link>
              )}

              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 font-display text-3xl font-medium text-charcoal"
              >
                Contact
              </Link>
            </motion.nav>

            {/* Contact footer */}
            <div className="mt-10 border-t border-charcoal/10 pt-6">
              <p className="font-body text-[0.68rem] uppercase tracking-[0.2em] text-stone">
                Visit the maison
              </p>
              <a
                href={`tel:${siteConfig.phone}`}
                className="mt-2 block font-display text-xl font-medium text-charcoal"
              >
                {siteConfig.phoneDisplay}
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="mt-1 block font-body text-sm font-light text-stone"
              >
                {siteConfig.email}
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}