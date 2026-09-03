import { useRef, useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { useWishlist } from "@/context/WishlistContext";
import { useBag } from "@/context/BagContext";
import { useUI } from "@/context/UIContext";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";
import { collections as collectionsData } from "@/data/collections";
import { cn } from "@/utils/cn";

const NAV_LINKS = [
  { label: "New Arrivals", to: "/catalog?sort=newest" },
  { label: "Rings", to: "/catalog?category=Rings" },
  { label: "Necklaces", to: "/catalog?category=Necklaces" },
  { label: "Earrings", to: "/catalog?category=Earrings" },
  { label: "Bracelets", to: "/catalog?category=Bracelets" },
];

export function Navbar() {
  const { scrolled } = useScrollPosition();
  const { count } = useWishlist();
  const { count: bagCount } = useBag();
  const { setSearchOpen, setMobileMenuOpen, setBagOpen } = useUI();
  const { isAuthenticated, isAdmin, signOut } = useAuth();
  const reducedMotion = useReducedMotion();
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    };
  }, []);

  const openCollections = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setCollectionsOpen(true);
  };
  const scheduleClose = () => {
    closeTimer.current = window.setTimeout(() => setCollectionsOpen(false), 160);
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        scrolled
          ? "border-b border-charcoal/[0.07] bg-ivory/80 shadow-nav backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="container-jwel">
        <nav
          className={cn(
            "flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            scrolled ? "h-14 lg:h-16" : "h-[4.5rem] lg:h-20"
          )}
          aria-label="Primary"
        >
          {/* Left — logo */}
          <div className="flex w-1/4 items-center lg:w-32">
            <Logo compact={scrolled} />
          </div>

          {/* Center — desktop links */}
          <div className="hidden items-center gap-7 xl:gap-9 lg:flex">
            <NavLink
              to="/"
              className="font-body text-[0.7rem] font-medium uppercase tracking-[0.18em] text-charcoal/90 transition-colors duration-300 hover:text-gold-deep"
            >
              Home
            </NavLink>

            {/* Collections dropdown */}
            <div
              className="relative"
              onMouseEnter={openCollections}
              onMouseLeave={scheduleClose}
              onFocus={openCollections}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                  scheduleClose();
                }
              }}
            >
              <NavLink
                to="/catalog"
                className={({ isActive }) =>
                  cn(
                    "inline-flex items-center gap-1.5 font-body text-[0.7rem] font-medium uppercase tracking-[0.18em] transition-colors duration-300",
                    isActive ? "text-gold-deep" : "text-charcoal/90 hover:text-gold-deep"
                  )
                }
              >
                Collections
                <Icon
                  name="chevron-down"
                  size={12}
                  className={cn("transition-transform duration-300", collectionsOpen && "rotate-180")}
                />
              </NavLink>

              <AnimatePresence>
                {collectionsOpen && (
                  <motion.div
                    initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reducedMotion ? undefined : { opacity: 0, y: 10 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="absolute left-1/2 top-full -translate-x-1/2 pt-5"
                  >
                    <div className="w-56 border border-charcoal/[0.07] bg-ivory p-2 shadow-lift">
                      {collectionsData.map((c) => (
                        <Link
                          key={c.slug}
                          to={`/collection/${c.slug}`}
                          className="block px-4 py-2.5 font-body text-xs font-normal tracking-[0.08em] text-charcoal/80 transition-colors duration-200 hover:bg-sand/70 hover:text-charcoal"
                        >
                          {c.name}
                        </Link>
                      ))}
                      <div className="mt-1 border-t border-charcoal/[0.07] pt-2">
                        <Link
                          to="/catalog"
                          className="block px-4 py-2 font-body text-[0.65rem] font-medium uppercase tracking-[0.18em] text-gold-deep hover:text-gold"
                        >
                          View all
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    "font-body text-[0.7rem] font-medium uppercase tracking-[0.18em] transition-colors duration-300",
                    isActive ? "text-gold-deep" : "text-charcoal/90 hover:text-gold-deep"
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right — actions */}
          <div className="flex w-1/4 items-center justify-end gap-1 lg:w-32">
            {isAdmin && (
              <Link
                to="/admin"
                className="hidden font-body text-[0.62rem] font-medium uppercase tracking-[0.18em] text-gold-deep transition-colors duration-300 hover:text-gold lg:block"
              >
                Admin
              </Link>
            )}

            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
              className="flex h-10 w-10 items-center justify-center rounded-full text-charcoal transition-colors duration-300 hover:text-gold-deep"
            >
              <Icon name="search" size={19} />
            </button>

            <Link
              to="/wishlist"
              aria-label={`Wishlist, ${count} items`}
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-charcoal transition-colors duration-300 hover:text-gold-deep"
            >
              <Icon name="heart" size={19} />
              {count > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-deep px-1 text-[0.58rem] font-medium text-ivory">
                  {count}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setBagOpen(true)}
              aria-label={`Open shopping bag, ${bagCount} items`}
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-charcoal transition-colors duration-300 hover:text-gold-deep"
            >
              <Icon name="bag" size={19} />
              {bagCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-deep px-1 text-[0.58rem] font-medium text-ivory">
                  {bagCount}
                </span>
              )}
            </button>

            {isAuthenticated ? (
              <>
                <Link
                  to="/"
                  aria-label="Account"
                  title="Account"
                  className="relative flex h-10 w-10 items-center justify-center rounded-full text-charcoal transition-colors duration-300 hover:text-gold-deep lg:hidden"
                >
                  <Icon name="user" size={19} />
                </Link>
                <button
                  type="button"
                  onClick={signOut}
                  aria-label="Sign out"
                  title="Sign out"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-charcoal transition-colors duration-300 hover:text-gold-deep"
                >
                  <Icon name="logout" size={19} />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="hidden font-body text-[0.65rem] font-medium uppercase tracking-[0.15em] text-charcoal transition-colors duration-300 hover:text-gold-deep lg:block"
              >
                Login
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              className="flex h-10 w-10 items-center justify-center rounded-full text-charcoal transition-colors duration-300 hover:text-gold-deep lg:hidden"
            >
              <Icon name="menu" size={20} />
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}