
import { useState } from "react";
import { Download, Smartphone, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { downloadPhoto } from "@/utils/downloadUtils";
import { toast } from "sonner";
import { FormattedMessage, useIntl } from "react-intl";

interface EnhancedDownloadButtonProps {
  url: string;
  filename: string;
  variant?: "ghost" | "outline" | "default";
  size?: "default" | "sm" | "lg" | "icon";
  showText?: boolean;
}

const EnhancedDownloadButton = ({ 
  url, 
  filename, 
  variant = "ghost", 
  size = "icon",
  showText = false 
}: EnhancedDownloadButtonProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const intl = useIntl();

  const handleDownload = async (method: 'auto' | 'save-as') => {
    setIsDownloading(true);
    console.log(`Download initiated with method: ${method} for ${filename}`);

    try {
      const success = await downloadPhoto({
        url,
        filename,
        onSuccess: () => {
          toast.success(intl.formatMessage({ id: 'photoGallery.download.saveSuccess' }));
        },
        onError: (error) => {
          toast.error(`${intl.formatMessage({ id: 'photoGallery.download.downloadFailed' })}: ${error}`);
        }
      });

      if (!success) {
        toast.error(intl.formatMessage({ id: 'photoGallery.download.downloadFailed' }));
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error(intl.formatMessage({ id: 'photoGallery.download.downloadFailed' }));
    } finally {
      setIsDownloading(false);
    }
  };

  // Detect if user is on mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  if (showText) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={variant} size={size} disabled={isDownloading}>
            <Download className="w-4 h-4 mr-2" />
            {isDownloading ? (
              <FormattedMessage id="photoGallery.buttons.downloading" />
            ) : (
              <FormattedMessage id="photoGallery.buttons.download" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleDownload('auto')}>
            <Download className="w-4 h-4 mr-2" />
            <FormattedMessage id="photoGallery.buttons.quickDownload" />
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDownload('save-as')}>
            {isMobile ? <Smartphone className="w-4 h-4 mr-2" /> : <Monitor className="w-4 h-4 mr-2" />}
            <FormattedMessage 
              id={isMobile ? "photoGallery.buttons.saveToPhotos" : "photoGallery.buttons.saveToFiles"} 
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} disabled={isDownloading}>
          <Download className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleDownload('auto')}>
          <Download className="w-4 h-4 mr-2" />
          <FormattedMessage id="photoGallery.buttons.quickDownload" />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDownload('save-as')}>
          {isMobile ? <Smartphone className="w-4 h-4 mr-2" /> : <Monitor className="w-4 h-4 mr-2" />}
          <FormattedMessage 
            id={isMobile ? "photoGallery.buttons.saveToPhotos" : "photoGallery.buttons.saveToFiles"} 
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EnhancedDownloadButton;
