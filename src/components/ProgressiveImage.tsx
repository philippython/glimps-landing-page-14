
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
}

const ProgressiveImage = ({ src, alt, className, onLoad }: ProgressiveImageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>("");
  const [lowQualitySrc, setLowQualitySrc] = useState<string>("");

  useEffect(() => {
    // Create low quality version by adding quality parameter
    const url = new URL(src);
    url.searchParams.set('q', '20'); // Low quality for initial load
    setLowQualitySrc(url.toString());

    // Preload the full quality image
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImageSrc(src);
      setImageLoaded(true);
      onLoad?.();
    };
  }, [src, onLoad]);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Low quality image */}
      <img
        src={lowQualitySrc}
        alt={alt}
        className={cn(
          "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
          imageLoaded ? "opacity-0" : "opacity-100 blur-sm"
        )}
      />
      
      {/* High quality image */}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
        />
      )}
      
      {/* Loading indicator */}
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-glimps-600"></div>
        </div>
      )}
    </div>
  );
};

export default ProgressiveImage;
