import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Download, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import ImageWithFallback from "@/components/ImageWithFallback";
import { fetchPhotosFromApi } from "@/service/fetchPhotosFromApi";
import { convertDateTime, convertOnlyDate } from "@/lib/utils";
import LogoWithText from "@/components/LogoWithText";
import { FormattedMessage, useIntl } from "react-intl";
import LanguagePicker from "@/components/LanguagePicker";
import PhotoAdvertisement from "@/components/PhotoAdvertisement";
import { useState, useEffect } from "react";

type Photo = {
  photo_url: string,
  sent: boolean,
  venue_id?: string
}

interface PhotosDataFromApi {
  id: string,
  photos: Photo[],
  sent: boolean,
  synced: boolean,
  created_at: string,
  venue_id?: string
}

const PhotoGallery = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const [photosLoaded, setPhotosLoaded] = useState(false);
  const [showAds, setShowAds] = useState(false);
  const { data, isLoading, error } = useQuery<PhotosDataFromApi>({
    queryKey: ['photos', uuid],
    queryFn: () => fetchPhotosFromApi(uuid || ""),
    enabled: !!uuid,
  });
  const intl = useIntl();

  const getVenueId = () => {
    const localStorageVenueId = localStorage.getItem('venueId') || localStorage.getItem('venue_id');
    if (localStorageVenueId) return localStorageVenueId;
    if (data?.venue_id) return data.venue_id;
    if (data?.photos?.[0]?.venue_id) return data.photos[0].venue_id;
    return null;
  };

  useEffect(() => {
    if (data && !isLoading) {
      const venueId = getVenueId();
      setPhotosLoaded(true);
      setTimeout(() => setShowAds(true), 1000);
    }
  }, [data, isLoading]);

  const photoName = (index: number) => `${data && convertOnlyDate(data.created_at)} (${index + 1})`;

  const handleDownload = (url: string, name: string) => {
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = blobUrl;
        a.download = `${name}.jpg`;
        document.body.appendChild(a);
        if ('download' in HTMLAnchorElement.prototype) {
          a.click();
        } else {
          window.open(blobUrl, '_blank');
        }
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(a);
      })
      .catch(() => {
        try {
          window.open(url, '_blank');
          toast.info(`${intl.formatMessage({ id: 'photoGallery.download.downloadFailed' })} - Opened in new tab`);
        } catch (e) {
          toast.error(`${intl.formatMessage({ id: 'photoGallery.download.downloadFailed' })} ${name}`);
        }
      });
  };

  if (!uuid) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <LogoWithText />
        <h1 className="text-2xl font-bold text-glimps-900 mb-4">
          <FormattedMessage id="photoGallery.invalidId.title" />
        </h1>
        <p className="text-glimps-600">
          <FormattedMessage id="photoGallery.invalidId.message" />
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <LogoWithText />
        <h1 className="text-2xl font-bold text-glimps-900 mb-4">
          <FormattedMessage id="photoGallery.error.title" />
        </h1>
        <p className="text-glimps-600">
          <FormattedMessage id="photoGallery.error.message" />
        </p>
      </div>
    );
  }

  const venueId = getVenueId();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {photosLoaded && showAds && venueId ? (
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-6">
            <PhotoAdvertisement venueId={venueId} />
          </div>
        </header>
      ) : (
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row gap-5 justify-between items-center">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <LogoWithText />
                {data && (
                  <div>
                    <h1 className="text-2xl font-bold text-glimps-900">
                      <FormattedMessage id="photoGallery.title" />
                    </h1>
                    <p className="text-glimps-600">
                      {convertDateTime(data.created_at)} • {data.photos.length}{" "}
                      <FormattedMessage id="photoGallery.photos" />
                    </p>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center md:items-end gap-1">
                <div className="flex items-center space-x-3">
                  <LanguagePicker />
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (data?.photos) {
                        data.photos.forEach((photo, index) => {
                          setTimeout(() => {
                            handleDownload(photo.photo_url, photoName(index));
                          }, 300);
                        });
                        toast.success(intl.formatMessage({ id: "photoGallery.download.downloadAll" }));
                      }
                    }}
                    disabled={isLoading || !data}
                  >
                    <FormattedMessage id="photoGallery.buttons.downloadAll" />
                  </Button>
                </div>
                <p className="text-red-500 text-md font-semibold text-center">
                  Чтобы скачать фото, зажмите фотографию, и в открывшемся меню нажмите скачать
                </p>
              </div>
            </div>
          </div>
        </header>
      )}

      <main className="flex-grow container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="relative pt-[75%]">
                  <Skeleton className="absolute inset-0" />
                </div>
                <div className="p-4">
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-8 w-28" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.photos.map((photo, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="relative pt-[75%]">
                  <ImageWithFallback
                    className="absolute inset-0 object-cover w-full h-full"
                    src={photo.photo_url}
                    alt={`Photo ${index + 1}`}
                  />
                </div>
                <div className="p-4 flex items-center justify-between">
                  <p className="text-sm text-gray-700 font-medium truncate">{photoName(index)}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDownload(photo.photo_url, photoName(index))}
                  >
                    <Download className="w-5 h-5" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default PhotoGallery;
