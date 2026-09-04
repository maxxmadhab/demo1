import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  adminGetProduct,
  adminCreateProduct,
  adminUpdateProduct,
} from "@/services/adminProductService";
import type { Product } from "@/types/product";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProductForm, type ProductFormValues } from "@/components/admin/ProductForm";
import { LoadingState, ErrorState } from "@/components/shared/States";

function toProductFormValue(p: Product): Partial<ProductFormValues> {
  return {
    name: p.name,
    slug: p.slug,
    category: p.category,
    price: String(p.price),
    material: p.material,
    gemstone: p.gemstone,
    description: p.description,
    shortDescription: p.shortDescription,
    weight: p.dimensions?.weight ?? "",
    width: p.dimensions?.width ?? "",
    length: p.dimensions?.length ?? "",
    height: p.dimensions?.height ?? "",
    stoneWeight: p.dimensions?.stoneWeight ?? "",
    badge: (p.badge as ProductFormValues["badge"]) ?? "",
    featured: p.featured ?? false,
    isNew: p.isNew ?? false,
    isBestSeller: p.isBestSeller ?? false,
    images: p.images ?? [],
  };
}

function toPayload(v: ProductFormValues) {
  const dimensions: Record<string, string> = {};
  if (v.weight) dimensions.weight = v.weight;
  if (v.width) dimensions.width = v.width;
  if (v.length) dimensions.length = v.length;
  if (v.height) dimensions.height = v.height;
  if (v.stoneWeight) dimensions.stoneWeight = v.stoneWeight;

  return {
    name: v.name.trim(),
    slug: v.slug.trim() || undefined,
    category: v.category,
    price: Number(v.price),
    material: v.material.trim(),
    gemstone: v.gemstone.trim(),
    description: v.description.trim(),
    shortDescription: v.shortDescription.trim(),
    dimensions,
    badge: v.badge || null,
    isNew: v.isNew,
    isBestSeller: v.isBestSeller,
    featured: v.featured,
    images: v.images,
  };
}

export default function AdminProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [initial, setInitial] = useState<Partial<ProductFormValues> | null>(null);
  const [loading, setLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const p = await adminGetProduct(id);
        if (cancelled) return;
        setInitial(toProductFormValue(p));
      } catch (err) {
        if (cancelled) return;
        setLoadError(err instanceof Error ? err.message : "Failed to load product.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSubmit = async (values: ProductFormValues) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const payload = toPayload(values);
      if (isEdit && id) {
        await adminUpdateProduct(id, payload);
      } else {
        await adminCreateProduct(payload);
      }
      navigate("/admin/products");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to save product.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div>
        <AdminHeader title="Loading product" />
        <LoadingState label="Loading product" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div>
        <AdminHeader title="Product" />
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <ErrorState message={loadError} onRetry={() => navigate("/admin/products")} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminHeader
        title={isEdit ? "Edit product" : "Add product"}
        description={isEdit ? "Update the details of this piece." : "Create a new piece in the catalog."}
      />
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <ProductForm
          initial={initial}
          submitting={submitting}
          error={submitError}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
