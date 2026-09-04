import { Icon } from "@/components/ui/Icon";

interface ProductImageGalleryProps {
  images: string[];
  onRemove: (index: number) => void;
  onMove: (index: number, direction: -1 | 1) => void;
}

export function ProductImageGallery({ images, onRemove, onMove }: ProductImageGalleryProps) {
  if (!images.length) {
    return (
      <p className="border border-charcoal/10 bg-white p-4 font-body text-sm font-light text-stone">
        No images yet. Upload the first one above.
      </p>
    );
  }

  return (
    <div>
      <p className="mb-2 font-body text-[0.62rem] font-medium uppercase tracking-[0.18em] text-stone">
        {images.length} image{images.length === 1 ? "" : "s"} · first is the cover
      </p>
      <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {images.map((src, index) => (
          <li key={`${src}-${index}`} className="relative group">
            <div className="relative aspect-square overflow-hidden rounded border border-charcoal/10 bg-sand">
              <img src={src} alt="" className="h-full w-full object-cover" />
              {index === 0 && (
                <span className="absolute left-1.5 top-1.5 bg-charcoal/80 px-1.5 py-0.5 font-body text-[0.55rem] font-semibold uppercase tracking-wide text-ivory">
                  Cover
                </span>
              )}
              <button
                type="button"
                onClick={() => onRemove(index)}
                aria-label={`Remove image ${index + 1}`}
                className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-charcoal/70 text-ivory transition-colors hover:bg-charcoal"
              >
                <Icon name="close" size={13} />
              </button>
            </div>
            <div className="mt-1.5 flex items-center justify-between">
              <button
                type="button"
                onClick={() => onMove(index, -1)}
                disabled={index === 0}
                aria-label="Move up"
                className="flex h-7 w-7 items-center justify-center border border-charcoal/15 text-charcoal transition-colors hover:border-charcoal disabled:opacity-30"
              >
                ↑
              </button>
              <span className="font-body text-xs font-light text-stone">{index + 1}</span>
              <button
                type="button"
                onClick={() => onMove(index, 1)}
                disabled={index === images.length - 1}
                aria-label="Move down"
                className="flex h-7 w-7 items-center justify-center border border-charcoal/15 text-charcoal transition-colors hover:border-charcoal disabled:opacity-30"
              >
                ↓
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
