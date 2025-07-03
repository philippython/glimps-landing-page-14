import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
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
  external_url?: string;
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
  const [timeLeft, setTimeLeft] = useState(5);
  const intl = useIntl();

  useEffect(() => {
    console.log('PhotoAdvertisement useEffect triggered', { venueId });
    if (!venueId) {
      console.log('No venueId provided to PhotoAdvertisement');
      return;
    }

    const fetchAds = async () => {
      setIsLoading(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        console.log('Fetching ads with API URL:', apiUrl);
        let response: Response;

        try {
          const fetchUrl = `${apiUrl}/ads/all/${venueId}`;
          console.log('Fetching ads from:', fetchUrl);
          response = await fetch(fetchUrl);
        } catch (error) {
          console.error("Failed to fetch ads from API:", error);
          setBannerAd(null);
          setFullscreenAd(null);
          setIsLoading(false);
          return;
        }

        if (!response.ok) {
          console.error(`Failed to fetch ads: ${response.status} ${response.statusText}`);
          throw new Error(`Failed to fetch ads: ${response.statusText}`);
        }

        const ads: Advertisement[] = await response.json();
        console.log('Fetched ads:', ads);

        if (!ads || ads.length === 0) {
          console.log('No ads found');
          setBannerAd(null);
          setFullscreenAd(null);
          setIsLoading(false);
          return;
        }

        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const processedAds = ads.map((ad) => {
          const startDate = ad.start_date ? new Date(ad.start_date) : null;
          const expiryDate = ad.expiry_date ? new Date(ad.expiry_date) : null;

          if (startDate) startDate.setHours(0, 0, 0, 0);
          if (expiryDate) expiryDate.setHours(23, 59, 59, 999);

          let status: AdStatus = "ACTIVE";

          if (startDate && now < startDate) {
            status = "SCHEDULED";
          } else if (expiryDate && now > expiryDate) {
            status = "EXPIRED";
          } else if (
            startDate &&
            expiryDate &&
            now >= startDate &&
            now <= expiryDate
          ) {
            status = "ACTIVE";
          } else if (startDate && !expiryDate && now >= startDate) {
            status = "ACTIVE";
          }

          console.log(`Ad ${ad.campaign_name}: status=${status}, start=${startDate?.toISOString()}, expiry=${expiryDate?.toISOString()}, now=${now.toISOString()}`);

          return {
            ...ad,
            status,
          };
        });

        const activeAds = processedAds.filter((ad) => ad.status === "ACTIVE");
        console.log(`Found ${activeAds.length} active ads out of ${ads.length} total ads`);

        const activeBanner = activeAds.find((ad) => ad.ads_size === "BANNER") || null;
        const activeFullscreen = activeAds.find(
          (ad) => ad.ads_size === "FULLSCREEN"
        ) || null;

        console.log('Active ads found:', { activeBanner, activeFullscreen });

        setBannerAd(activeBanner);
        setFullscreenAd(activeFullscreen);

        if (activeFullscreen) {
          console.log('Setting up fullscreen ad');
          setShowFullscreenAd(true);
          setCanCloseFullscreenAd(false);
          setTimeLeft(5);
        }
      } catch (error) {
        console.error('Error fetching ads:', error);
        toast.error(intl.formatMessage({id: "venueDashboard.advertising.loadFailed", defaultMessage: "Failed to load advertisements"}));
        setBannerAd(null);
        setFullscreenAd(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAds();
  }, [venueId, intl]);

  // Simplified timer logic
  useEffect(() => {
    console.log('=== TIMER DEBUG ===', {
      showFullscreenAd,
      hasFullscreenAd: !!fullscreenAd,
      canCloseFullscreenAd,
      timeLeft
    });

    // Only run timer if we have a fullscreen ad showing and close button is disabled
    if (showFullscreenAd && fullscreenAd && !canCloseFullscreenAd && timeLeft > 0) {
      console.log('Starting timer for', timeLeft, 'seconds');
      
      const timer = setTimeout(() => {
        console.log('Timer tick - reducing time from', timeLeft, 'to', timeLeft - 1);
        
        if (timeLeft === 1) {
          console.log('🎉 TIMER COMPLETE - Enabling close button');
          setCanCloseFullscreenAd(true);
        }
        
        setTimeLeft(prev => prev - 1);
      }, 1000);

      return () => {
        console.log('Cleaning up timer');
        clearTimeout(timer);
      };
    }
  }, [showFullscreenAd, fullscreenAd, canCloseFullscreenAd, timeLeft]);

  // Reset timer when fullscreen ad is shown
  useEffect(() => {
    if (showFullscreenAd && fullscreenAd) {
      console.log('🚀 Fullscreen ad shown - resetting timer');
      setTimeLeft(5);
      setCanCloseFullscreenAd(false);
    }
  }, [showFullscreenAd, fullscreenAd?.id]); // Include ad ID to reset on new ads

  const handleAdClick = (ad: Advertisement) => {
    const url = ad.external_url || ad.redirect_url;
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handleCloseFullscreenAd = () => {
    console.log('=== CLOSE BUTTON CLICKED ===', { 
      canCloseFullscreenAd, 
      timeLeft,
      showFullscreenAd 
    });
    
    if (!canCloseFullscreenAd) {
      console.log('❌ Close button disabled - ignoring click');
      return;
    }
    
    console.log('✅ Closing fullscreen ad');
    setShowFullscreenAd(false);
    setCanCloseFullscreenAd(false);
    setTimeLeft(5);
    if (onClose) onClose();
  };

  const isVideo = (url: string) => {
    return url.includes('.mp4') || url.includes('.webm') || url.includes('.mov') || url.includes('.avi');
  };

  const convertVideoUrl = (url: string) => {
    // Convert webm to mp4 for better compatibility
    return url.replace(/\.webm$/i, '.mp4');
  };

  if (isLoading) {
    console.log('PhotoAdvertisement is loading');
    return null;
  }

  const FullscreenAdModal = () => {
    if (!fullscreenAd || !showFullscreenAd) {
      console.log('FullscreenAdModal not rendering', { 
        hasFullscreenAd: !!fullscreenAd, 
        showFullscreenAd 
      });
      return null;
    }

    console.log('🎬 Rendering FullscreenAdModal', { 
      canCloseFullscreenAd, 
      timeLeft,
      adName: fullscreenAd.campaign_name 
    });

    return createPortal(
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[10001] p-4">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col">
          <div
            className={`flex-1 ${fullscreenAd.external_url || fullscreenAd.redirect_url ? 'cursor-pointer hover:bg-gray-50 transition-colors' : ''}`}
            onClick={() => handleAdClick(fullscreenAd)}
          >
            {isVideo(fullscreenAd.media_url) ? (
              <video
                src={convertVideoUrl(fullscreenAd.media_url)}
                className="w-full h-full max-h-[70vh] object-cover"
                autoPlay
                loop
                playsInline
                muted
                controls={false}
                preload="metadata"
                style={{
                  WebkitAppearance: 'none',
                }}
                onContextMenu={(e) => e.preventDefault()}
              />
            ) : (
              <ImageWithFallback
                src={fullscreenAd.media_url}
                alt="Advertisement"
                className="w-full h-full max-h-[70vh] object-cover"
              />
            )}
          </div>
          <div className="p-6 bg-gray-50 flex justify-end items-center border-t">
            <Button
              variant="outline"
              onClick={handleCloseFullscreenAd}
              disabled={!canCloseFullscreenAd}
              className={`px-6 py-2 ${!canCloseFullscreenAd ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
            >
              {!canCloseFullscreenAd ? (
                <span className="flex items-center">
                  <span className="mr-2">{timeLeft}s</span>
                  <FormattedMessage
                    id="venueDashboard.advertising.closeAd"
                    defaultMessage="Close"
                  />
                </span>
              ) : (
                <FormattedMessage
                  id="venueDashboard.advertising.closeAd"
                  defaultMessage="Close"
                />
              )}
            </Button>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  console.log('PhotoAdvertisement rendering', { 
    bannerAd: !!bannerAd, 
    fullscreenAd: !!fullscreenAd, 
    showFullscreenAd,
    canCloseFullscreenAd,
    timeLeft
  });

  return (
    <>
      {/* Banner Ad - only shows images, confined to header */}
      {bannerAd && (
        <div
          className={`w-full ${bannerAd.external_url || bannerAd.redirect_url ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}`}
          onClick={() => handleAdClick(bannerAd)}
        >
          <ImageWithFallback
            src={bannerAd.media_url}
            alt="Advertisement"
            className="w-full h-20 md:h-24 lg:h-28 object-cover rounded-md"
          />
        </div>
      )}

      {/* Fullscreen Ad Modal */}
      <FullscreenAdModal />
    </>
  );
};

export default PhotoAdvertisement;
