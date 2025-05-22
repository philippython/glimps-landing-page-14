
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FormattedMessage } from "react-intl";
import ImageWithFallback from "./ImageWithFallback";

type AdSize = "BANNER" | "FULLSCREEN";

interface Advertisement {
  id: string;
  campaign_name: string;
  media_url: string;
  ads_size: AdSize;
  start_date?: string;
  expiry_date?: string;
}

interface PhotoAdvertisementProps {
  venueId?: string;
}

const PhotoAdvertisement = ({ venueId }: PhotoAdvertisementProps) => {
  const [bannerAd, setBannerAd] = useState<Advertisement | null>(null);
  const [fullscreenAd, setFullscreenAd] = useState<Advertisement | null>(null);
  const [showFullscreenAd, setShowFullscreenAd] = useState(false);
  const [canCloseFullscreenAd, setCanCloseFullscreenAd] = useState(false);
  
  useEffect(() => {
    // This would be replaced with an actual API call in production
    const fetchAds = async () => {
      if (!venueId) return;
      
      // Mock data for demonstration
      const mockBannerAd = {
        id: "1",
        campaign_name: "Summer Special",
        media_url: "https://placekitten.com/800/200",
        ads_size: "BANNER" as AdSize,
        start_date: new Date().toISOString(),
        expiry_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString()
      };
      
      const mockFullscreenAd = {
        id: "2",
        campaign_name: "Special Event",
        media_url: "https://placekitten.com/1200/800",
        ads_size: "FULLSCREEN" as AdSize,
        start_date: new Date().toISOString(),
        expiry_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString()
      };
      
      // Randomly decide whether to show banner or fullscreen ad or both
      const showBanner = Math.random() > 0.3;
      const showFullscreen = Math.random() > 0.5;
      
      if (showBanner) {
        setBannerAd(mockBannerAd);
      }
      
      if (showFullscreen) {
        setFullscreenAd(mockFullscreenAd);
        // Show fullscreen ad after a delay so user can see the content first
        setTimeout(() => {
          setShowFullscreenAd(true);
          // Make close button active after 5 seconds
          setTimeout(() => {
            setCanCloseFullscreenAd(true);
          }, 5000);
        }, 10000); // Show after 10 seconds to ensure user has time to see photos are loaded
      }
    };
    
    fetchAds();
  }, [venueId]);
  
  if (!bannerAd && !fullscreenAd) {
    return null;
  }
  
  return (
    <>
      {/* Banner Ad */}
      {bannerAd && !showFullscreenAd && (
        <div className="w-full mb-4">
          <ImageWithFallback
            src={bannerAd.media_url}
            alt={bannerAd.campaign_name}
            className="w-full h-auto object-cover rounded-md"
          />
        </div>
      )}
      
      {/* Fullscreen Ad */}
      {fullscreenAd && showFullscreenAd && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg overflow-hidden max-w-2xl w-full">
            <div className="p-4">
              <ImageWithFallback
                src={fullscreenAd.media_url}
                alt={fullscreenAd.campaign_name}
                className="w-full aspect-video object-cover rounded-md"
              />
            </div>
            <div className="p-4 bg-gray-50 flex justify-between items-center">
              <p className="font-semibold">{fullscreenAd.campaign_name}</p>
              <Button
                variant="outline"
                onClick={() => setShowFullscreenAd(false)}
                disabled={!canCloseFullscreenAd}
                className="transition-opacity"
              >
                {!canCloseFullscreenAd ? (
                  <span className="flex items-center">
                    <span className="animate-pulse mr-2">•</span>
                    <FormattedMessage id="venueDashboard.advertising.closeAd" />
                  </span>
                ) : (
                  <FormattedMessage id="venueDashboard.advertising.closeAd" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PhotoAdvertisement;
