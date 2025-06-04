
import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
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

  const handleDownload = async () => {
    setIsDownloading(true);
    console.log(`Download initiated for ${filename}`);

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

  if (showText) {
    return (
      <Button variant={variant} size={size} disabled={isDownloading} onClick={handleDownload}>
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
    <Button variant={variant} size={size} disabled={isDownloading} onClick={handleDownload}>
      <Download className="w-4 h-4" />
    </Button>
  );
};

export default EnhancedDownloadButton;
