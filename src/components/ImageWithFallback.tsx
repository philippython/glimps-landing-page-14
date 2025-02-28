
import { useState, useEffect } from "react";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
}

const ImageWithFallback = ({
  src,
  alt,
  fallbackSrc = "/placeholder.svg",
  className = "",
}: ImageWithFallbackProps) => {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImgSrc(src);
      setLoading(false);
    };
    img.onerror = () => {
      setImgSrc(fallbackSrc);
      setLoading(false);
      setError(true);
    };
  }, [src, fallbackSrc]);

  if (loading) {
    return (
      <div
        className={`${className} bg-glimps-100 animate-pulse rounded-md flex items-center justify-center`}
      >
        <span className="sr-only">Loading image</span>
      </div>
    );
  }

  return (
    <img
      src={imgSrc || fallbackSrc}
      alt={alt}
      className={`${className} ${
        error ? "opacity-70" : "opacity-100"
      } transition-opacity duration-300`}
    />
  );
};

export default ImageWithFallback;
