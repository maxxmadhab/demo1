import type { Product } from "@/types/product";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { formatPrice } from "@/utils/format";
import { LoadingState, EmptyState } from "@/components/shared/States";

interface ProductTableProps {
  products: Product[];
  loading?: boolean;
  onEdit: (id: string) => void;
  onDelete: (product: Product) => void;
}

export function ProductTable({ products, loading, onEdit, onDelete }: ProductTableProps) {
  if (loading) {
    return <LoadingState label="Loading products" />;
  }

  if (!products.length) {
    return (
      <EmptyState
        title="No products yet"
        message="Add your first piece to get the catalog started."
      />
    );
  }

  return (
    <div className="overflow-hidden border border-charcoal/10 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left">
          <thead className="border-b border-charcoal/10 bg-sand/60">
            <tr>
              <th className="px-4 py-3 font-body text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-stone">
                Product
              </th>
              <th className="px-4 py-3 font-body text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-stone">
                Category
              </th>
              <th className="px-4 py-3 font-body text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-stone">
                Price
              </th>
              <th className="px-4 py-3 font-body text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-stone">
                Status
              </th>
              <th className="px-4 py-3 text-right font-body text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-stone">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal/5">
            {products.map((p) => (
              <tr key={p.id} className="transition-colors hover:bg-sand/40">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {p.images[0] ? (
                      <img
                        src={p.images[0]}
                        alt=""
                        className="h-12 w-12 shrink-0 rounded object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-sand text-stone">
                        <Icon name="bag" size={18} />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate font-display text-[0.95rem] font-medium text-charcoal">
                        {p.name}
                      </p>
                      <p className="truncate font-body text-xs font-light text-stone">/{p.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-body text-sm text-charcoal/80">{p.category}</td>
                <td className="px-4 py-3 font-body text-sm font-medium text-charcoal">
                  {formatPrice(p.price)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    {p.featured && <Badge tone="gold">Featured</Badge>}
                    {p.isNew && <Badge tone="light">New</Badge>}
                    {p.isBestSeller && <Badge tone="dark">Best Seller</Badge>}
                    {p.badge && <Badge tone="dark">{p.badge}</Badge>}
                    {!p.featured && !p.isNew && !p.isBestSeller && !p.badge && (
                      <span className="font-body text-xs font-light text-stone">—</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(p.id)}
                      className="border border-charcoal/15 px-3 py-1.5 font-body text-[0.65rem] font-medium uppercase tracking-[0.12em] text-charcoal transition-colors hover:border-charcoal"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(p)}
                      className="border border-red-200 px-3 py-1.5 font-body text-[0.65rem] font-medium uppercase tracking-[0.12em] text-red-600 transition-colors hover:border-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
