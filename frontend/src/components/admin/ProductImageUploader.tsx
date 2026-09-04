import { useRef, useState } from "react";
import { adminUploadImage } from "@/services/adminProductService";

interface ProductImageUploaderProps {
  onUploaded: (url: string) => void;
  onError: (message: string) => void;
}

export function ProductImageUploader({ onUploaded, onError }: ProductImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");

  const handleFiles = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setError("");
    if (!file.type.startsWith("image/")) {
      const msg = "Please choose an image file.";
      setError(msg);
      onError(msg);
      return;
    }
    setBusy(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : "";
      const contentType = file.type || "image/jpeg";
      try {
        const { url } = await adminUploadImage(dataUrl, file.name, contentType);
        onUploaded(url);
        setLastName(file.name);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Upload failed.";
        setError(msg);
        onError(msg);
      } finally {
        setBusy(false);
        if (inputRef.current) inputRef.current.value = "";
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="border border-dashed border-charcoal/25 bg-white p-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <div className="flex flex-col items-center justify-center gap-2 py-4 text-center">
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="border border-charcoal/20 px-5 py-2.5 font-body text-[0.68rem] font-medium uppercase tracking-[0.12em] text-charcoal transition-colors hover:border-charcoal disabled:opacity-50"
        >
          {busy ? "Uploading…" : "Upload image"}
        </button>
        <p className="font-body text-xs font-light text-stone">
          PNG, JPG, WebP — stored in the store&apos;s product image bucket.
        </p>
        {lastName && !busy && (
          <p className="font-body text-xs text-gold-deep">Uploaded: {lastName}</p>
        )}
        {error && <p className="font-body text-xs text-red-500">{error}</p>}
      </div>
    </div>
  );
}
