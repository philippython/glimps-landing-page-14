
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FormattedMessage, useIntl } from "react-intl";
import ImageWithFallback from "./ImageWithFallback";
import { toast } from "sonner";

type AdSize = "BANNER" | "FULLSCREEN";
type AdStatus = "ACTIVE" | "EXPIRED" | "SCHEDULED";

interface Advertisement {
  id: string;
  campaign_name: string;
  media_url: string;
  ads_size: AdSize;
  start_date: string;
  expiry_date: string;
  status?: AdStatus;
}

interface PhotoAdvertisementProps {
  venueId?: string;
}

const PhotoAdvertisement = ({ venueId }: PhotoAdvertisementProps) => {
  const [bannerAd, setBannerAd] = useState<Advertisement | null>(null);
  const [fullscreenAd, setFullscreenAd] = useState<Advertisement | null>(null);
  const [showFullscreenAd, setShowFullscreenAd] = useState(false);
  const [canCloseFullscreenAd, setCanCloseFullscreenAd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const intl = useIntl();
  
  useEffect(() => {
    if (!venueId) return;
    
    const fetchAds = async () => {
      setIsLoading(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiUrl}/ads/${venueId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch ads: ${response.status}`);
        }
        
        const ads: Advertisement[] = await response.json();
        
        // If there are no ads, return early
        if (!ads || ads.length === 0) {
          setBannerAd(null);
          setFullscreenAd(null);
          setIsLoading(false);
          return;
        }
        
        // For each ad, determine the status based on dates
        const now = new Date();
        // Reset time portion to compare dates only
        now.setHours(0, 0, 0, 0);
        
        const processedAds = ads.map(ad => {
          const startDate = ad.start_date ? new Date(ad.start_date) : null;
          const expiryDate = ad.expiry_date ? new Date(ad.expiry_date) : null;
          
          // Reset time portion for accurate date comparison
          if (startDate) startDate.setHours(0, 0, 0, 0);
          if (expiryDate) expiryDate.setHours(0, 0, 0, 0);
          
          let status: AdStatus = "ACTIVE";
          
          if (startDate && now < startDate) {
            status = "SCHEDULED";
          } else if (expiryDate && now > expiryDate) {
            status = "EXPIRED";
          } else if (startDate && expiryDate && now >= startDate && now <= expiryDate) {
            status = "ACTIVE"; // Active if today is between start and expiry dates (inclusive)
          } else if (startDate && !expiryDate && now >= startDate) {
            status = "ACTIVE"; // Active if today is on or after start date and no expiry
          }
          
          console.log(`Ad ${ad.campaign_name} status: ${status}, start: ${startDate?.toISOString()}, expiry: ${expiryDate?.toISOString()}, now: ${now.toISOString()}`);
          
          return {
            ...ad,
            status
          };
        });
        
        // Filter for active ads only
        const activeAds = processedAds.filter(ad => ad.status === "ACTIVE");
        console.log(`Found ${activeAds.length} active ads out of ${processedAds.length} total`);
        
        // Only show the first active ad of each type (to ensure only one active ad at a time)
        const activeBanner = activeAds.find(ad => ad.ads_size === "BANNER") || null;
        const activeFullscreen = activeAds.find(ad => ad.ads_size === "FULLSCREEN") || null;
        
        setBannerAd(activeBanner);
        setFullscreenAd(activeFullscreen);
        
        // If there's a fullscreen ad, show it after a delay
        if (activeFullscreen) {
          setTimeout(() => {
            setShowFullscreenAd(true);
            // Make close button active after 5 seconds
            setTimeout(() => {
              setCanCloseFullscreenAd(true);
            }, 5000);
          }, 10000); // Show after 10 seconds to ensure user has time to see photos are loaded
        }
      } catch (error) {
        console.error("Failed to fetch ads:", error);
        toast.error("Failed to load advertisements");
        // Reset states in case of error
        setBannerAd(null);
        setFullscreenAd(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAds();
  }, [venueId, intl]);
  
  if (isLoading || (!bannerAd && !fullscreenAd)) {
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
