import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RootLayout } from "@/layouts/RootLayout";
import { AdminLayout } from "@/layouts/AdminLayout";
import { AdminGuard } from "@/components/auth/AdminGuard";

import { lazy, Suspense } from "react";
import { LoadingState } from "@/components/shared/States";

const HomePage = lazy(() => import("@/pages/HomePage"));
const CatalogPage = lazy(() => import("@/pages/CatalogPage"));
const CollectionPage = lazy(() => import("@/pages/CollectionPage"));
const ProductDetailPage = lazy(() => import("@/pages/ProductDetailPage"));
const WishlistPage = lazy(() => import("@/pages/WishlistPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const SignupPage = lazy(() => import("@/pages/SignupPage"));
const ForgotPasswordPage = lazy(() => import("@/pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("@/pages/ResetPasswordPage"));
const AdminLoginPage = lazy(() => import("@/pages/admin/AdminLoginPage"));
const AdminDashboardPage = lazy(() => import("@/pages/admin/AdminDashboardPage"));

function PageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory">
      <LoadingState label="Preparing" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public + user routes — wrapped in RootLayout (navbar + footer) */}
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

          {/* Auth pages */}
          <Route
            path="/login"
            element={
              <Suspense fallback={<PageFallback />}>
                <LoginPage />
              </Suspense>
            }
          />
          <Route
            path="/signup"
            element={
              <Suspense fallback={<PageFallback />}>
                <SignupPage />
              </Suspense>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <Suspense fallback={<PageFallback />}>
                <ForgotPasswordPage />
              </Suspense>
            }
          />
          <Route
            path="/reset-password"
            element={
              <Suspense fallback={<PageFallback />}>
                <ResetPasswordPage />
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

        {/* Admin routes — completely separate layout, no navbar/footer */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route
            index
            element={
              <AdminGuard>
                <Suspense fallback={<PageFallback />}>
                  <AdminDashboardPage />
                </Suspense>
              </AdminGuard>
            }
          />
          <Route
            path="login"
            element={
              <Suspense fallback={<PageFallback />}>
                <AdminLoginPage />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
