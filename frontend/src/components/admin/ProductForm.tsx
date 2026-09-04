import { useState } from "react";
import type { Badge, Category } from "@/types/product";
import { CATEGORIES, BADGES } from "@/config/catalog";
import { ProductImageUploader } from "@/components/admin/ProductImageUploader";
import { ProductImageGallery } from "@/components/admin/ProductImageGallery";
import { slugify } from "@/utils/format";

export interface ProductFormValues {
  name: string;
  slug: string;
  category: Category;
  price: string;
  material: string;
  gemstone: string;
  description: string;
  shortDescription: string;
  weight: string;
  width: string;
  length: string;
  height: string;
  stoneWeight: string;
  badge: Badge | "";
  featured: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  images: string[];
}

interface ProductFormProps {
  initial?: Partial<ProductFormValues> | null;
  submitting?: boolean;
  error?: string | null;
  onSubmit: (values: ProductFormValues) => void;
}

export function ProductForm({ initial, submitting, error, onSubmit }: ProductFormProps) {
  const [form, setForm] = useState<ProductFormValues>(() => ({
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    category: initial?.category ?? "Rings",
    price: initial?.price ?? "",
    material: initial?.material ?? "",
    gemstone: initial?.gemstone ?? "",
    description: initial?.description ?? "",
    shortDescription: initial?.shortDescription ?? "",
    weight: initial?.weight ?? "",
    width: initial?.width ?? "",
    length: initial?.length ?? "",
    height: initial?.height ?? "",
    stoneWeight: initial?.stoneWeight ?? "",
    badge: initial?.badge ?? "",
    featured: initial?.featured ?? false,
    isNew: initial?.isNew ?? false,
    isBestSeller: initial?.isBestSeller ?? false,
    images: initial?.images ?? [],
  }));

  const set = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleNameChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      name: value,
      slug: prev.slug || slugify(value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="border border-red-200 bg-red-50 px-4 py-3 font-body text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Basic details */}
      <section className="border border-charcoal/10 bg-white p-5">
        <h2 className="mb-4 font-display text-lg font-medium text-charcoal">Details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Product name" className="sm:col-span-2">
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              className={inputClass}
            />
          </Field>
          <Field label="Slug">
            <input
              type="text"
              value={form.slug}
              onChange={(e) => set("slug", slugify(e.target.value))}
              className={inputClass}
            />
          </Field>
          <Field label="Category">
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value as Category)}
              className={inputClass}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Price (₹)">
            <input
              type="number"
              min={0}
              step="any"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
              required
              className={inputClass}
            />
          </Field>
          <Field label="Badge">
            <select
              value={form.badge}
              onChange={(e) => set("badge", e.target.value as Badge | "")}
              className={inputClass}
            >
              <option value="">None</option>
              {BADGES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Material">
            <input
              type="text"
              value={form.material}
              onChange={(e) => set("material", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Gemstone">
            <input
              type="text"
              value={form.gemstone}
              onChange={(e) => set("gemstone", e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>
      </section>

      {/* Description */}
      <section className="border border-charcoal/10 bg-white p-5">
        <h2 className="mb-4 font-display text-lg font-medium text-charcoal">Copy</h2>
        <div className="grid gap-4">
          <Field label="Short description">
            <textarea
              value={form.shortDescription}
              onChange={(e) => set("shortDescription", e.target.value)}
              rows={2}
              className={inputClass}
            />
          </Field>
          <Field label="Description">
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={5}
              className={inputClass}
            />
          </Field>
        </div>
      </section>

      {/* Dimensions */}
      <section className="border border-charcoal/10 bg-white p-5">
        <h2 className="mb-4 font-display text-lg font-medium text-charcoal">Dimensions (optional)</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Weight">
            <input
              type="text"
              value={form.weight}
              onChange={(e) => set("weight", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Width">
            <input
              type="text"
              value={form.width}
              onChange={(e) => set("width", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Length">
            <input
              type="text"
              value={form.length}
              onChange={(e) => set("length", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Height">
            <input
              type="text"
              value={form.height}
              onChange={(e) => set("height", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Stone weight" className="sm:col-span-2">
            <input
              type="text"
              value={form.stoneWeight}
              onChange={(e) => set("stoneWeight", e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>
      </section>

      {/* Media */}
      <section className="border border-charcoal/10 bg-white p-5">
        <h2 className="mb-4 font-display text-lg font-medium text-charcoal">Images</h2>
        <div className="space-y-4">
          <ProductImageUploader
            onUploaded={(url) => set("images", [...form.images, url])}
            onError={() => undefined}
          />
          <ProductImageGallery
            images={form.images}
            onRemove={(i) => set("images", form.images.filter((_, idx) => idx !== i))}
            onMove={(i, dir) => {
              const next = [...form.images];
              const target = i + dir;
              if (target < 0 || target >= next.length) return;
              [next[i], next[target]] = [next[target], next[i]];
              set("images", next);
            }}
          />
        </div>
      </section>

      {/* Flags */}
      <section className="border border-charcoal/10 bg-white p-5">
        <h2 className="mb-4 font-display text-lg font-medium text-charcoal">Visibility</h2>
        <div className="flex flex-wrap gap-6">
          <Toggle
            label="Featured"
            checked={form.featured}
            onChange={(v) => set("featured", v)}
          />
          <Toggle
            label="New arrival"
            checked={form.isNew}
            onChange={(v) => set("isNew", v)}
          />
          <Toggle
            label="Best seller"
            checked={form.isBestSeller}
            onChange={(v) => set("isBestSeller", v)}
          />
        </div>
      </section>

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="bg-charcoal px-7 py-3.5 font-body text-[0.72rem] font-medium uppercase tracking-[0.12em] text-ivory transition-colors hover:bg-charcoal-light disabled:opacity-50"
        >
          {submitting ? "Saving…" : "Save product"}
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "w-full border border-charcoal/15 bg-white px-4 py-2.5 font-body text-sm text-charcoal placeholder:text-stone/50 focus:border-gold focus:outline-none";

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block font-body text-[0.62rem] font-medium uppercase tracking-[0.18em] text-stone">
        {label}
      </label>
      {children}
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-charcoal"
      />
      <span className="font-body text-sm text-charcoal">{label}</span>
    </label>
  );
}
