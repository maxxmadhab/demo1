import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RootLayout } from "@/layouts/RootLayout";

// Pages — lazy loaded for code splitting
import { lazy, Suspense } from "react";
import { LoadingState } from "@/components/shared/States";

const HomePage = lazy(() => import("@/pages/HomePage"));
const CatalogPage = lazy(() => import("@/pages/CatalogPage"));
const CollectionPage = lazy(() => import("@/pages/CollectionPage"));
const ProductDetailPage = lazy(() => import("@/pages/ProductDetailPage"));
const WishlistPage = lazy(() => import("@/pages/WishlistPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

function PageFallback() {
  return (
    <div className="pt-16 lg:pt-20">
      <LoadingState label="Preparing" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route
            path="/"
            element={
              <Suspense fallback={<PageFallback />}>
                <HomePage />
              </Suspense>
            }
          />
          <Route
            path="/catalog"
            element={
              <Suspense fallback={<PageFallback />}>
                <CatalogPage />
              </Suspense>
            }
          />
          <Route
            path="/collection/:collection"
            element={
              <Suspense fallback={<PageFallback />}>
                <CollectionPage />
              </Suspense>
            }
          />
          <Route
            path="/product/:product"
            element={
              <Suspense fallback={<PageFallback />}>
                <ProductDetailPage />
              </Suspense>
            }
          />
          <Route
            path="/wishlist"
            element={
              <Suspense fallback={<PageFallback />}>
                <WishlistPage />
              </Suspense>
            }
          />
          <Route
            path="/contact"
            element={
              <Suspense fallback={<PageFallback />}>
                <ContactPage />
              </Suspense>
            }
          />
          <Route
            path="*"
            element={
              <Suspense fallback={<PageFallback />}>
                <NotFoundPage />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}