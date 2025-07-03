
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
    if (!venueId) return;

    const fetchAds = async () => {
      setIsLoading(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        let response: Response;

        try {
          response = await fetch(`${apiUrl}/ads/all/${venueId}`);
        } catch (error) {
          console.error("Failed to fetch ads from API:", error);
          setBannerAd(null);
          setFullscreenAd(null);
          setIsLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch ads: ${response.statusText}`);
        }

        const ads: Advertisement[] = await response.json();

        if (!ads || ads.length === 0) {
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

        setBannerAd(activeBanner);
        setFullscreenAd(activeFullscreen);

        if (activeFullscreen) {
          setShowFullscreenAd(true);
          setCanCloseFullscreenAd(false);
          setTimeLeft(5);
        }
      } catch (error) {
        toast.error(intl.formatMessage({id: "venueDashboard.advertising.loadFailed", defaultMessage: "Failed to load advertisements"}));
        setBannerAd(null);
        setFullscreenAd(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAds();
  }, [venueId, intl]);

  // Separate useEffect for the countdown timer
  useEffect(() => {
    if (showFullscreenAd && fullscreenAd && !canCloseFullscreenAd) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setCanCloseFullscreenAd(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showFullscreenAd, fullscreenAd, canCloseFullscreenAd]);

  const handleAdClick = (ad: Advertisement) => {
    const url = ad.external_url || ad.redirect_url;
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handleCloseFullscreenAd = () => {
    setShowFullscreenAd(false);
    if (onClose) onClose();
  };

  const isVideo = (url: string) => {
    return url.includes('.mp4') || url.includes('.webm') || url.includes('.mov') || url.includes('.avi');
  };

  const convertVideoUrl = (url: string) => {
    // Convert webm to mp4 for better compatibility
    return url.replace(/\.webm$/i, '.mp4');
  };

  if (isLoading) return null;

  const FullscreenAdModal = () => {
    if (!fullscreenAd || !showFullscreenAd) return null;

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
