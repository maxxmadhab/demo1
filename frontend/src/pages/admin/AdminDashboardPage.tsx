import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminListProducts } from "@/services/adminProductService";
import type { Product } from "@/types/product";
import { useAuth } from "@/hooks/useAuth";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { formatPrice } from "@/utils/format";

export default function AdminDashboardPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await adminListProducts({ perPage: 200 });
        if (!cancelled) setProducts(res.data);
      } catch {
        // ignore — dashboard stats are best-effort
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const total = products.length;
  const featured = products.filter((p) => p.featured).length;
  const bestSellers = products.filter((p) => p.isBestSeller).length;
  const totalValue = products.reduce((sum, p) => sum + p.price, 0);

  const stats = [
    { label: "Products", value: String(total), icon: "bag" as const },
    { label: "Featured", value: String(featured), icon: "star" as const },
    { label: "Best sellers", value: String(bestSellers), icon: "check" as const },
    { label: "Catalog value", value: formatPrice(totalValue), icon: "user" as const },
  ];

  return (
    <div>
      <AdminHeader
        title={`Welcome, ${profile?.full_name || "Admin"}`}
        description="Manage your jewelry catalog from here."
        actions={
          <Button variant="primary" size="sm" onClick={() => navigate("/admin/products/new")}>
            Add product
          </Button>
        }
      />

      <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="border border-charcoal/10 bg-white p-5">
              <div className="flex items-center justify-between">
                <span className="font-body text-[0.62rem] font-medium uppercase tracking-[0.18em] text-stone">
                  {s.label}
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sand text-charcoal">
                  <Icon name={s.icon} size={15} />
                </span>
              </div>
              <p className="mt-2 font-display text-2xl font-medium text-charcoal">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="border border-charcoal/10 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-lg font-medium text-charcoal">Product catalogue</h2>
              <p className="mt-1 font-body text-sm font-light text-stone">
                {loading ? "Loading…" : `${total} piece${total === 1 ? "" : "s"} in the store.`}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate("/admin/products")}>
              Manage products
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
