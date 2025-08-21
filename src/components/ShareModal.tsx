
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SharePlatform, getUserLocation, getSharePlatforms, shareToStory } from "@/utils/shareUtils";
import { toast } from "sonner";
import { FormattedMessage, useIntl } from "react-intl";
import { Copy, Download } from "lucide-react";

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
        // Auto-detect location without asking permission
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

  const handleStoryShare = (platform: SharePlatform) => {
    shareToStory(platform, url, filename);
    toast.success(intl.formatMessage(
      { 
        id: "photoGallery.share.redirected",
        defaultMessage: "Redirected to {platform}"
      },
      { platform: `${platform.name} Stories` }
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg z-[10001] fixed">
        <DialogHeader className="text-center pb-4">
          <DialogTitle className="text-xl font-semibold">
            <FormattedMessage 
              id="photoGallery.share.title"
              defaultMessage="Share to Story"
            />
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">
            <FormattedMessage 
              id="photoGallery.share.storyDescription"
              defaultMessage="Download your photo and share it on your favorite platform"
            />
          </p>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Copy Link Section */}
          <div className="bg-muted/30 rounded-lg p-4">
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Copy className="w-4 h-4" />
              <FormattedMessage 
                id="photoGallery.share.copyLink"
                defaultMessage="Copy Link"
              />
            </h4>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={url}
                className="flex-1 px-3 py-2 text-sm border rounded-md bg-background"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Story Sharing Section */}
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-pulse">
                <FormattedMessage 
                  id="photoGallery.share.loading"
                  defaultMessage="Loading platforms..."
                />
              </div>
            </div>
          ) : (
            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
                <Download className="w-4 h-4" />
                <FormattedMessage 
                  id="photoGallery.share.storySharing"
                  defaultMessage="Download & Share to Story"
                />
              </h4>
              <div className="grid gap-3">
                {platforms.map((platform) => (
                  <Button
                    key={`${platform.name}-story`}
                    variant="outline"
                    onClick={() => handleStoryShare(platform)}
                    className="w-full justify-start h-12 text-left hover:bg-primary/5 hover:border-primary/20 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-sm font-medium">
                        {platform.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{platform.name}</div>
                        <div className="text-xs text-muted-foreground">
                          <FormattedMessage 
                            id="photoGallery.share.downloadAndOpen"
                            defaultMessage="Download photo & open app"
                          />
                        </div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
