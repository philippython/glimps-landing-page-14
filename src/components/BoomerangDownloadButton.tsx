
import { useState } from "react";
import { Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadVideo } from "@/utils/downloadUtils";
import { toast } from "sonner";
import { FormattedMessage, useIntl } from "react-intl";

interface BoomerangDownloadButtonProps {
  url: string;
  filename: string;
  variant?: "ghost" | "outline" | "default";
  size?: "default" | "sm" | "lg" | "icon";
}

const BoomerangDownloadButton = ({ 
  url, 
  filename, 
  variant = "ghost", 
  size = "icon"
}: BoomerangDownloadButtonProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const intl = useIntl();

  const handleDownload = async () => {
    setIsDownloading(true);
    console.log(`Boomerang download initiated for ${filename}`);

    try {
      const success = await downloadVideo({
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
      console.error('Boomerang download error:', error);
      toast.error(intl.formatMessage({ id: 'photoGallery.download.downloadFailed' }));
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button 
      variant={variant} 
      size={size} 
      disabled={isDownloading} 
      onClick={handleDownload}
      title="Download Boomerang"
    >
      <Video className="w-4 h-4" />
    </Button>
  );
};

export default BoomerangDownloadButton;
