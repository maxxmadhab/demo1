import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  adminListProducts,
  adminDeleteProduct,
} from "@/services/adminProductService";
import type { Product } from "@/types/product";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProductTable } from "@/components/admin/ProductTable";
import { ProductFilters } from "@/components/admin/ProductFilters";
import { DeleteProductDialog } from "@/components/admin/DeleteProductDialog";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/shared/States";

export default function AdminProductListPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");

  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const load = async (s = search.trim(), c = category, so = sort) => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminListProducts({ search: s || undefined, category: c || undefined, sort: so, perPage: 200 });
      setProducts(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const s = search.trim();
    const t = window.setTimeout(() => load(s, category, sort), 300);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, sort]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteBusy(true);
    setDeleteError(null);
    try {
      await adminDeleteProduct(deleteTarget.id);
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Failed to delete product.");
    } finally {
      setDeleteBusy(false);
    }
  };

  return (
    <div>
      <AdminHeader
        title="Products"
        description="Create, edit and remove pieces in the catalog."
        actions={
          <Button variant="primary" size="sm" onClick={() => navigate("/admin/products/new")}>
            Add product
          </Button>
        }
      />

      <div className="space-y-5 px-4 py-6 sm:px-6 lg:px-8">
        <ProductFilters
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          sort={sort}
          onSortChange={setSort}
        />

        {error ? (
          <ErrorState message={error} onRetry={() => load()} />
        ) : (
          <ProductTable
            products={products}
            loading={loading}
            onEdit={(id) => navigate(`/admin/products/${id}/edit`)}
            onDelete={setDeleteTarget}
          />
        )}
      </div>

      <DeleteProductDialog
        open={!!deleteTarget}
        productName={deleteTarget?.name ?? ""}
        busy={deleteBusy}
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteTarget(null);
          setDeleteError(null);
        }}
      />
      {deleteError && (
        <p className="fixed bottom-4 left-1/2 z-[90] -translate-x-1/2 border border-red-200 bg-white px-4 py-2 font-body text-sm text-red-700 shadow-lift">
          {deleteError}
        </p>
      )}
    </div>
  );
}
