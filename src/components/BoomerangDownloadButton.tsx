
import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadVideo, DownloadOptions } from "@/utils/downloadUtils";
import { toast } from "sonner";
import { FormattedMessage, useIntl } from "react-intl";

interface BoomerangDownloadButtonProps {
  url: string;
  filename: string;
  variant?: "ghost" | "outline" | "default";
  size?: "default" | "sm" | "lg" | "icon";
  showText?: boolean;
  className?: string;
}

const BoomerangDownloadButton = ({ 
  url, 
  filename, 
  variant = "ghost", 
  size = "icon",
  showText = false,
  className
}: BoomerangDownloadButtonProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const intl = useIntl();
  const isDisabled = !url || url.trim() === "";

  const handleDownload = async () => {
    if (isDisabled) return;
    
    setIsDownloading(true);
    console.log(`Boomerang download initiated for ${filename}`);

    try {
      const success = await downloadVideo({
        url,
        filename,
        onSuccess: () => {
          toast.success(intl.formatMessage({ id: 'photoGallery.download.saveSuccess' }));
        },
        onError: (error: string) => {
          toast.error(`${intl.formatMessage({ id: 'photoGallery.download.downloadFailed' })}: ${error}`);
        }
      });

      if (!success) {
        toast.error(intl.formatMessage({ id: 'photoGallery.download.downloadFailed' }));
      }
    } catch (error) {
      console.error('Boomerang download error:', error);
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
        disabled={isDownloading || isDisabled} 
        onClick={handleDownload}
        className={className}
        title={isDisabled ? intl.formatMessage({id: "photoGallery.tooltips.noBoomerangAvailable"}) : intl.formatMessage({id: "photoGallery.tooltips.downloadBoomerang"})}
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
      disabled={isDownloading || isDisabled} 
      onClick={handleDownload}
      className={className}
      title={isDisabled ? intl.formatMessage({id: "photoGallery.tooltips.noBoomerangAvailable"}) : intl.formatMessage({id: "photoGallery.tooltips.downloadBoomerang"})}
    >
      <Download className="w-4 h-4" />
    </Button>
  );
};

export default BoomerangDownloadButton;