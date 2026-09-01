import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import { QuickViewModal } from "@/components/layout/QuickViewModal";
import { BagDrawer } from "@/components/layout/BagDrawer";
import { CompareDrawer } from "@/components/layout/CompareDrawer";
import { Footer } from "@/components/layout/Footer";
import { useUI } from "@/context/UIContext";
import { cn } from "@/utils/cn";

/** Reusable scroll-to-top on route change, respects reduced motion via CSS. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}

export function RootLayout() {
  const location = useLocation();
  const { mobileMenuOpen, searchOpen, quickViewProduct, compareOpen, closeAll } = useUI();
  const [menusOpen, setMenusOpen] = useState(false);

  useEffect(() => {
    setMenusOpen(mobileMenuOpen || searchOpen || Boolean(quickViewProduct) || compareOpen);
  }, [mobileMenuOpen, searchOpen, quickViewProduct, compareOpen]);

  useEffect(() => {
    closeAll();
  }, [location.pathname, closeAll]);

  const onHome = location.pathname === "/";

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar />
      <MobileMenu />
      <SearchOverlay />
      <QuickViewModal />
      <BagDrawer />
      <CompareDrawer />

      <main
        className={cn(
          "flex-1 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          onHome && !menusOpen ? "" : ""
        )}
      >
        <Outlet />
      </main>

      {/* Footer hidden isn't necessary; overlays cover it with z-index */}
      <Footer />
    </div>
  );
}