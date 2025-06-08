
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import ImageWithFallback from "./ImageWithFallback";

interface AdPreviewProps {
  mediaUrl: string;
  adSize: "BANNER" | "FULLSCREEN";
  campaignName: string;
}

const AdPreview = ({ mediaUrl, adSize, campaignName }: AdPreviewProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const isVideo = mediaUrl.includes('.mp4') || mediaUrl.includes('.webm') || mediaUrl.includes('.mov');

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="w-4 h-4 mr-2" />
          Preview
        </Button>
      </DialogTrigger>
      <DialogContent className={`${adSize === "FULLSCREEN" ? "max-w-2xl" : "max-w-md"}`}>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{campaignName}</h3>
          <div className={`${adSize === "BANNER" ? "h-24" : "aspect-video"} w-full`}>
            {isVideo ? (
              <video
                src={mediaUrl}
                controls
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              <ImageWithFallback
                src={mediaUrl}
                alt={`${campaignName} Preview`}
                className="w-full h-full object-cover rounded-md"
              />
            )}
          </div>
          <p className="text-sm text-gray-600">
            Ad Size: {adSize === "BANNER" ? "Banner" : "Fullscreen"}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdPreview;
