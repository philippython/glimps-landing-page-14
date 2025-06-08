
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
        const apiUrl = import.meta.env.VITE_API_URL;
        let response: Response;

        try {
          response = await fetch(`${apiUrl}/ads/all/${venueId}`);
        } catch (error) {
          // If API fetch fails, log the error and proceed without ads
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

        const processedAds = ads.map((ad) => {
          const startDate = ad.start_date ? new Date(ad.start_date) : null;
          const expiryDate = ad.expiry_date ? new Date(ad.expiry_date) : null;

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

          return {
            ...ad,
            status,
          };
        });

        const activeAds = processedAds.filter((ad) => ad.status === "ACTIVE");

        const activeBanner = activeAds.find((ad) => ad.ads_size === "BANNER") || null;
        const activeFullscreen = activeAds.find(
          (ad) => ad.ads_size === "FULLSCREEN"
        ) || null;

        setBannerAd(activeBanner);
        setFullscreenAd(activeFullscreen);

        if (activeFullscreen) {
          setShowFullscreenAd(true);
          setTimeout(() => setCanCloseFullscreenAd(true), 5000);
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

  const handleAdClick = (mediaUrl: string) => {
    window.open(mediaUrl, "_blank", "noopener,noreferrer");
  };

  const handleCloseFullscreenAd = () => {
    setShowFullscreenAd(false);
    if (onClose) onClose();
  };

  if (isLoading || (!bannerAd && !fullscreenAd)) return null;

  return (
    <div className="w-full">
      {bannerAd && !showFullscreenAd && (
        <div
          className="w-full cursor-pointer"
          onClick={() => handleAdClick(bannerAd.media_url)}
        >
          <ImageWithFallback
            src={bannerAd.media_url}
            alt="Advertisement"
            className="w-full h-20 md:h-24 lg:h-28 object-cover rounded-md"
          />
        </div>
      )}

      {fullscreenAd && showFullscreenAd && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg overflow-hidden max-w-2xl w-full">
            <div
              className="p-4 cursor-pointer"
              onClick={() => handleAdClick(fullscreenAd.media_url)}
            >
              <ImageWithFallback
                src={fullscreenAd.media_url}
                alt="Advertisement"
                className="w-full aspect-video object-cover rounded-md"
              />
            </div>
            <div className="p-4 bg-gray-50 flex justify-end items-center">
              <Button
                variant="outline"
                onClick={handleCloseFullscreenAd}
                disabled={!canCloseFullscreenAd}
              >
                {!canCloseFullscreenAd ? (
                  <span className="flex items-center">
                    <span className="animate-pulse mr-2">•</span>
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
        )}
      )}
    </div>
  );
};

export default PhotoAdvertisement;
