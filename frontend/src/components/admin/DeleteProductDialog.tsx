import { useEffect } from "react";
import { useEscapeKey } from "@/hooks/useOverlayBehavior";

interface DeleteProductDialogProps {
  productName: string;
  open: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteProductDialog({
  productName,
  open,
  busy,
  onConfirm,
  onCancel,
}: DeleteProductDialogProps) {
  useEscapeKey(open, onCancel);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm"
        onClick={busy ? undefined : onCancel}
        aria-hidden="true"
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-product-title"
        className="relative w-full max-w-md border border-charcoal/10 bg-white p-6 shadow-lift"
      >
        <h2 id="delete-product-title" className="font-display text-xl font-medium text-charcoal">
          Delete product
        </h2>
        <p className="mt-3 font-body text-sm font-light leading-relaxed text-stone">
          Are you sure you want to delete{" "}
          <span className="font-medium text-charcoal">“{productName}”</span>? This removes the
          product and its saved images. This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            disabled={busy}
            onClick={onCancel}
            className="border border-charcoal/20 px-4 py-2.5 font-body text-[0.68rem] font-medium uppercase tracking-[0.12em] text-charcoal transition-colors hover:border-charcoal"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onConfirm}
            className="bg-red-700 px-4 py-2.5 font-body text-[0.68rem] font-medium uppercase tracking-[0.12em] text-white transition-colors hover:bg-red-800 disabled:opacity-50"
          >
            {busy ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
