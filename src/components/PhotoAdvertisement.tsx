
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
  redirect_url?: string;
}

interface PhotoAdvertisementProps {
  venueId?: string;
  onClose?: () => void;
}

const PhotoAdvertisement = ({ venueId, onClose }: PhotoAdvertisementProps) => {
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
        console.log("Fetching ads for venue:", venueId);
        
        // For debugging, let's add a mock ad if API fails
        let mockUsed = false;
        
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiUrl}/ads/${venueId}`).catch(err => {
          console.log("API fetch failed, using mock data:", err);
          mockUsed = true;
          
          // Mock response for testing
          return {
            ok: true,
            json: async () => [
              {
                id: "test-banner",
                campaign_name: "Test Banner Campaign",
                media_url: "https://via.placeholder.com/1200x200/4CAF50/FFFFFF?text=Banner+Advertisement",
                ads_size: "BANNER",
                start_date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
                expiry_date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
                redirect_url: "https://example.com/banner"
              },
              {
                id: "test-fullscreen",
                campaign_name: "Test Fullscreen Campaign",
                media_url: "https://via.placeholder.com/800x600/2196F3/FFFFFF?text=Fullscreen+Advertisement",
                ads_size: "FULLSCREEN",
                start_date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
                expiry_date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
                redirect_url: "https://example.com/fullscreen"
              }
            ]
          };
        });
        
        if (!response.ok && !mockUsed) {
          throw new Error(`Failed to fetch ads: ${response.status}`);
        }
        
        const ads: Advertisement[] = await response.json();
        
        console.log(`Fetched ${ads.length} ads:`, ads);
        
        // If there are no ads, return early
        if (!ads || ads.length === 0) {
          console.log("No ads found");
          setBannerAd(null);
          setFullscreenAd(null);
          setIsLoading(false);
          return;
        }
        
        // For each ad, determine the status based on dates
        const now = new Date();
        
        const processedAds = ads.map(ad => {
          const startDate = ad.start_date ? new Date(ad.start_date) : null;
          const expiryDate = ad.expiry_date ? new Date(ad.expiry_date) : null;
          
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
        
        console.log("Active banner ad:", activeBanner);
        console.log("Active fullscreen ad:", activeFullscreen);
        
        setBannerAd(activeBanner);
        setFullscreenAd(activeFullscreen);
        
        // If there's a fullscreen ad, show it after photos are loaded
        if (activeFullscreen) {
          console.log("Preparing to show fullscreen ad");
          // Show fullscreen ad immediately
          setShowFullscreenAd(true);
          
          // Make close button active after 5 seconds
          setTimeout(() => {
            setCanCloseFullscreenAd(true);
          }, 5000);
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
  }, [venueId]);
  
  const handleAdClick = (redirectUrl?: string) => {
    if (redirectUrl) {
      console.log("Opening ad redirect URL:", redirectUrl);
      window.open(redirectUrl, '_blank', 'noopener,noreferrer');
    }
  };
  
  const handleCloseFullscreenAd = () => {
    console.log("Closing fullscreen ad");
    setShowFullscreenAd(false);
    if (onClose) {
      onClose();
    }
  };
  
  if (isLoading || (!bannerAd && !fullscreenAd)) {
    console.log("No ads to display or still loading");
    return null;
  }
  
  console.log("Rendering ad component with:", { bannerAd, fullscreenAd, showFullscreenAd });
  
  return (
    <div className="w-full">
      {/* Banner Ad - replace header content with the banner */}
      {bannerAd && !showFullscreenAd && (
        <div 
          className="w-full cursor-pointer"
          onClick={() => handleAdClick(bannerAd.redirect_url)}
        >
          <ImageWithFallback
            src={bannerAd.media_url}
            alt={bannerAd.campaign_name}
            className="w-full h-auto object-cover rounded-md"
          />
        </div>
      )}
      
      {/* Fullscreen Ad - overlay that appears after photos load */}
      {fullscreenAd && showFullscreenAd && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg overflow-hidden max-w-2xl w-full">
            <div 
              className="p-4 cursor-pointer"
              onClick={() => handleAdClick(fullscreenAd.redirect_url)}
            >
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
                onClick={handleCloseFullscreenAd}
                disabled={!canCloseFullscreenAd}
                className="transition-opacity"
              >
                {!canCloseFullscreenAd ? (
                  <span className="flex items-center">
                    <span className="animate-pulse mr-2">•</span>
                    <FormattedMessage id="venueDashboard.advertising.closeAd" defaultMessage="Close" />
                  </span>
                ) : (
                  <FormattedMessage id="venueDashboard.advertising.closeAd" defaultMessage="Close" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoAdvertisement;
