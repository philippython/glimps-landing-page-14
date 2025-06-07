
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import ProgressiveImage from "@/components/ProgressiveImage";
import EnhancedDownloadButton from "@/components/EnhancedDownloadButton";
import BoomerangDownloadButton from "@/components/BoomerangDownloadButton";
import { fetchPhotosFromApi } from "@/service/fetchPhotosFromApi";
import { downloadMultiplePhotos } from "@/utils/downloadUtils";
import { convertDateTime, convertOnlyDate } from "@/lib/utils";
import LogoWithText from "@/components/LogoWithText";
import { FormattedMessage, useIntl } from "react-intl";
import LanguagePicker from "@/components/LanguagePicker";
import PhotoAdvertisement from "@/components/PhotoAdvertisement";
import { useState, useEffect } from "react";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Photo = {
  photo_url: string,
  sent: boolean,
  venue_id?: string,
  boomerang?: {
    url?: string | null
  } | null
}

interface PhotosDataFromApi {
  id: string,
  photos: Photo[],
  sent: boolean,
  synced: boolean,
  created_at: string,
  venue_id?: string,
  total_count?: number
}

const PhotoGallery = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const [photosLoaded, setPhotosLoaded] = useState(false);
  const [showAds, setShowAds] = useState(false);
  const [loadedImagesCount, setLoadedImagesCount] = useState(0);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const photosPerPage = 12;
  
  const { data, isLoading, error } = useQuery<PhotosDataFromApi>({
    queryKey: ['photos', uuid, currentPage],
    queryFn: () => fetchPhotosFromApi(uuid || "", {
      limit: photosPerPage,
      offset: (currentPage - 1) * photosPerPage
    }),
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

  const photoName = (index: number) => `${data && convertOnlyDate(data.created_at)} (${((currentPage - 1) * photosPerPage) + index + 1})`;

  const handleImageLoad = () => {
    setLoadedImagesCount(prev => prev + 1);
  };

  const handleDownloadAll = async () => {
    if (!data?.photos) return;
    
    setIsDownloadingAll(true);
    console.log(`Starting download of all ${data.photos.length} photos`);
    
    try {
      const photosToDownload = data.photos.map((photo, index) => ({
        url: photo.photo_url,
        filename: photoName(index)
      }));

      const successCount = await downloadMultiplePhotos(photosToDownload);
      
      if (successCount === data.photos.length) {
        toast.success(intl.formatMessage({ id: "photoGallery.download.downloadAll" }));
      } else if (successCount > 0) {
        toast.success(`Downloaded ${successCount}/${data.photos.length} photos successfully`);
      } else {
        toast.error(intl.formatMessage({ id: "photoGallery.download.downloadFailed" }));
      }
    } catch (error) {
      console.error('Batch download error:', error);
      toast.error(intl.formatMessage({ id: "photoGallery.download.downloadFailed" }));
    } finally {
      setIsDownloadingAll(false);
    }
  };

  const totalPages = data?.total_count ? Math.ceil(data.total_count / photosPerPage) : 1;

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
                      {convertDateTime(data.created_at)} • {data.total_count || data.photos.length}{" "}
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
                    onClick={handleDownloadAll}
                    disabled={isLoading || !data || isDownloadingAll}
                  >
                    {isDownloadingAll ? (
                      <FormattedMessage id="photoGallery.buttons.downloading" />
                    ) : (
                      <FormattedMessage id="photoGallery.buttons.downloadAll" />
                    )}
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
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.photos.map((photo, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="relative pt-[75%]">
                    <ProgressiveImage
                      className="absolute inset-0"
                      src={photo.photo_url}
                      alt={`Photo ${index + 1}`}
                      onLoad={handleImageLoad}
                    />
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <p className="text-sm text-gray-700 font-medium truncate">{photoName(index)}</p>
                    <div className="flex items-center gap-2">
                      <EnhancedDownloadButton
                        url={photo.photo_url}
                        filename={photoName(index)}
                        variant="ghost"
                        size="icon"
                      />
                      {photo.boomerang?.url && (
                        <BoomerangDownloadButton
                          url={photo.boomerang.url}
                          filename={`${photoName(index)}_boomerang`}
                          variant="ghost"
                          size="icon"
                        />
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) setCurrentPage(currentPage - 1);
                        }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {[...Array(totalPages)].map((_, i) => {
                      const page = i + 1;
                      if (page === currentPage || 
                          page === 1 || 
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(page);
                              }}
                              isActive={page === currentPage}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                        }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default PhotoGallery;
