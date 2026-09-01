import { useState } from "react";
import { FALLBACK_IMAGE } from "@/utils/images";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  sizes?: string;
  fetchPriority?: "high" | "low" | "auto";
  priority?: boolean;
  onLoad?: () => void;
}

export function ImageWithFallback({
  src,
  alt,
  className,
  loading = "lazy",
  sizes,
  fetchPriority = "auto",
  priority,
  onLoad,
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <img
        src={error ? FALLBACK_IMAGE : src}
        alt={alt}
        loading={loading}
        sizes={sizes}
        fetchPriority={priority ? "high" : fetchPriority}
        className={className}
        style={loaded ? undefined : { opacity: 0 }}
        onLoad={() => {
          setLoaded(true);
          onLoad?.();
        }}
        onError={() => setError(true)}
      />
    </>
  );
}