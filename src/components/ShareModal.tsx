import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SharePlatform, getUserLocation, getSharePlatforms } from "@/utils/shareUtils";
import { toast } from "sonner";
import { FormattedMessage, useIntl } from "react-intl";
import { ExternalLink, Copy } from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  filename: string;
}

const ShareModal = ({ isOpen, onClose, url, filename }: ShareModalProps) => {
  const [platforms, setPlatforms] = useState<SharePlatform[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const intl = useIntl();

  useEffect(() => {
    const loadPlatforms = async () => {
      try {
        const isRussian = await getUserLocation();
        const sharePlatforms = getSharePlatforms(isRussian);
        setPlatforms(sharePlatforms);
      } catch (error) {
        console.error('Error loading share platforms:', error);
        setPlatforms(getSharePlatforms(false)); // Default to non-Russian
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      loadPlatforms();
    }
  }, [isOpen]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success(intl.formatMessage({ 
        id: "photoGallery.share.linkCopied",
        defaultMessage: "Link copied to clipboard!"
      }));
    } catch (error) {
      toast.error(intl.formatMessage({ 
        id: "photoGallery.share.copyFailed",
        defaultMessage: "Failed to copy link"
      }));
    }
  };

  const handlePlatformClick = (platform: SharePlatform) => {
    // Open the platform's website in a new tab
    // In a real app, you would integrate with each platform's sharing API
    window.open(platform.url, '_blank');
    toast.success(intl.formatMessage(
      { 
        id: "photoGallery.share.redirected",
        defaultMessage: "Redirected to {platform}"
      },
      { platform: platform.name }
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            <FormattedMessage 
              id="photoGallery.share.title"
              defaultMessage="Share Photo"
            />
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              readOnly
              value={url}
              className="flex-1 px-3 py-2 text-sm border rounded-md bg-gray-50"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-4">
              <FormattedMessage 
                id="photoGallery.share.loading"
                defaultMessage="Loading platforms..."
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {platforms.map((platform) => (
                <Button
                  key={platform.name}
                  variant="outline"
                  onClick={() => handlePlatformClick(platform)}
                  className="flex items-center justify-center space-x-2 h-12"
                >
                  <span className="text-lg">{platform.icon}</span>
                  <span className="text-sm">{platform.name}</span>
                  <ExternalLink className="w-3 h-3" />
                </Button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;