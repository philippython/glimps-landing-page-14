
import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FormattedMessage, useIntl } from "react-intl";

interface EnhancedDownloadButtonProps {
  url: string;
  filename: string;
  variant?: "ghost" | "outline" | "default";
  size?: "default" | "sm" | "lg" | "icon";
  showText?: boolean;
  className?: string;
}

const EnhancedDownloadButton = ({ 
  url, 
  filename, 
  variant = "ghost", 
  size = "icon",
  showText = false,
  className
}: EnhancedDownloadButtonProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const intl = useIntl();

  const handleDownload = async () => {
    setIsDownloading(true);
    console.log(`Download initiated for ${filename}`);

    try {
      // Use the proxy-image endpoint for direct download
      const apiUrl = import.meta.env.VITE_API_URL;
      const proxyUrl = `${apiUrl}/proxy-image?url=${encodeURIComponent(url)}`;
      
      const response = await fetch(proxyUrl, {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${filename}.jpg`;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
      
      console.log(`Download successful: ${filename}`);
      toast.success(intl.formatMessage({ id: 'photoGallery.download.saveSuccess' }));
      
    } catch (error) {
      console.error('Download error:', error);
      toast.error(intl.formatMessage({ id: 'photoGallery.download.downloadFailed' }));
    } finally {
      setIsDownloading(false);
    }
  };

  if (showText) {
    return (
      <Button 
        variant={variant} 
        size={size} 
        disabled={isDownloading} 
        onClick={handleDownload}
        className={className}
      >
        <Download className="w-4 h-4 mr-2" />
        {isDownloading ? (
          <FormattedMessage id="photoGallery.buttons.downloading" />
        ) : (
          <FormattedMessage id="photoGallery.buttons.download" />
        )}
      </Button>
    );
  }

  return (
    <Button 
      variant={variant} 
      size={size} 
      disabled={isDownloading} 
      onClick={handleDownload}
      className={className}
    >
      <Download className="w-4 h-4" />
    </Button>
  );
};

export default EnhancedDownloadButton;
