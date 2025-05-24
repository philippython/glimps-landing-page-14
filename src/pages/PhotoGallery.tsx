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

  // Function to get venue ID from various sources
  const getVenueId = () => {
    // First try to get from localStorage
    const localStorageVenueId = localStorage.getItem('venueId') || localStorage.getItem('venue_id');
    if (localStorageVenueId) {
      console.log("TESTING ADS: Found venue ID in localStorage:", localStorageVenueId);
      return localStorageVenueId;
    }

    // Then try from photo data venue_id field at top level
    if (data?.venue_id) {
      console.log("TESTING ADS: Found venue_id in photo data (top level):", data.venue_id);
      return data.venue_id;
    }

    // Then try from photos array - venue_id is nested inside photos
    if (data?.photos && data.photos.length > 0 && data.photos[0].venue_id) {
      console.log("TESTING ADS: Found venue_id in photos array:", data.photos[0].venue_id);
      return data.photos[0].venue_id;
    }

    console.log("TESTING ADS: No venue ID found in localStorage or photo data");
    return null;
  };

  // Set photos as loaded once data is available and loading is complete
  useEffect(() => {
    if (data && !isLoading) {
      console.log("TESTING ADS: Full photo data received:", data);
      console.log("TESTING ADS: Data keys:", Object.keys(data));
      console.log("TESTING ADS: venue_id from data (top level):", data.venue_id);
      console.log("TESTING ADS: venue_id from photos[0]:", data.photos?.[0]?.venue_id);
      console.log("TESTING ADS: session id from data:", data.id);
      console.log("TESTING ADS: localStorage venueId:", localStorage.getItem('venueId'));
      console.log("TESTING ADS: localStorage venue_id:", localStorage.getItem('venue_id'));
      
      // Get the correct venue ID
      const venueId = getVenueId();
      console.log("TESTING ADS: Final extracted venueId:", venueId);
      
      setPhotosLoaded(true);
      // Show ads after a short delay when photos are loaded
      setTimeout(() => {
        console.log("TESTING ADS: Setting showAds to true with venueId:", venueId);
        setShowAds(true);
      }, 1000);
    }
  }, [data, isLoading]);

  const photoName = (index: number) => `${data && convertOnlyDate(data.created_at)} (${index + 1})`;

  const handleDownload = (url: string, name: string) => {
    // First try direct download method
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = blobUrl;
        a.download = `${name}.jpg`;
        document.body.appendChild(a);
        // Use download attribute if supported, otherwise open in new tab
        if ('download' in HTMLAnchorElement.prototype) {
          a.click();
        } else {
          window.open(blobUrl, '_blank');
        }
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(a);
      })
      .catch(() => {
        // If direct fetch fails due to CORS, try opening in a new tab
        // which may work for viewing, though not for downloading
        try {
          window.open(url, '_blank');
          toast.info(
            `${intl.formatMessage({ id: 'photoGallery.download.downloadFailed' })} - Opened in new tab`
          );
        } catch (e) {
          toast.error(
            `${intl.formatMessage({ id: 'photoGallery.download.downloadFailed' })} ${name}`
          );
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

  // Get the correct venue ID
  const venueId = getVenueId();
  
  console.log("TESTING ADS: PhotoGallery render state:", { 
    photosLoaded, 
    showAds, 
    hasVenueId: !!venueId,
    venueId: venueId,
    sessionId: data?.id,
    dataKeys: data ? Object.keys(data) : [],
    localStorageVenueId: localStorage.getItem('venueId'),
    venueIdFromPhotos: data?.photos?.[0]?.venue_id,
    fullData: data
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Show advertisements in header area when photos are loaded */}
      {photosLoaded && showAds && venueId ? (
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="mb-4 p-2 bg-blue-100 rounded">
              <p className="text-sm text-blue-800">TESTING ADS: Ads should display here for venue: {venueId}</p>
              <p className="text-xs text-blue-600">Session ID: {data?.id} (not used for ads)</p>
            </div>
            <PhotoAdvertisement venueId={venueId} />
          </div>
        </header>
      ) : (
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-6">
            {photosLoaded && showAds && !venueId && (
              <div className="mb-4 p-2 bg-red-100 rounded">
                <p className="text-sm text-red-800">TESTING ADS: No venue ID found - ads will not display</p>
                <p className="text-xs text-red-600">Available data keys: {data ? Object.keys(data).join(', ') : 'No data'}</p>
                <p className="text-xs text-red-600">localStorage venueId: {localStorage.getItem('venueId')}</p>
                <p className="text-xs text-red-600">Session ID from data: {data?.id}</p>
              </div>
            )}
            <div className="flex flex-col md:flex-row gap-5 justify-between items-center">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <LogoWithText />
                {data && (
                  <div>
                    <h1 className="text-2xl font-bold text-glimps-900">
                      <FormattedMessage id="photoGallery.title" />
                    </h1>
                    <p className="text-glimps-600">
                      {convertDateTime(data.created_at)} • {data.photos.length}
                      {" "}<FormattedMessage id="photoGallery.photos" />
                    </p>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center md:items-end gap-1">
                <div className="flex items-center space-x-3">
                  {/* Language Dropdown */}
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
                <p className="text-red-500 text-md font-semibold text-center">Чтобы скачать фото, зажмите фотографию, и в открывшемся меню нажмите скачать</p>
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
        ) : data?.photos && data.photos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.photos.map((photo, index) => (
              <Card key={photo.photo_url} className="overflow-hidden group">
                <div className="relative pt-[75%] bg-gray-100">
                  <ImageWithFallback
                    src={photo.photo_url}
                    alt="Your photo"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 flex justify-between items-center">
                  <p className="font-medium">{ }</p>
                  <Button
                    size="sm"
                    onClick={() => {
                      handleDownload(photo.photo_url, photoName(index));
                      toast.success(`
                        ${intl.formatMessage({ id: "photoGallery.download.downloadOne" })}
                        ${""}
                        ${photoName(index)}
                      `);
                    }}
                    className="transition-all"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    <FormattedMessage id="photoGallery.buttons.download" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <ImageIcon className="mx-auto h-12 w-12 text-glimps-400" />
            <h3 className="mt-4 text-lg font-medium text-glimps-900">
              <FormattedMessage id="photoGallery.noPhotoFound.title" />
            </h3>
            <p className="mt-1 text-glimps-600">
              <FormattedMessage id="photoGallery.noPhotoFound.message" />
            </p>
          </div>
        )}
      </main>

      <footer className="bg-white border-t py-6">
        <div className="container mx-auto px-4 text-center text-glimps-600">
          <p>
            © {new Date().getFullYear()}
            {" "}<FormattedMessage id="photoGallery.footer.trademark" />
          </p>
          <p className="text-sm mt-2">
            <FormattedMessage id="photoGallery.footer.message" />
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PhotoGallery;
