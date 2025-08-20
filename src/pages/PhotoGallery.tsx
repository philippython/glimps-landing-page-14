import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toast } from "sonner";
import ProgressiveImage from "@/components/ProgressiveImage";
import EnhancedDownloadButton from "@/components/EnhancedDownloadButton";
import BoomerangDownloadButton from "@/components/BoomerangDownloadButton";
import { fetchPhotosFromApi } from "@/service/fetchPhotosFromApi";
import { fetchVenueUsersFromApi } from "@/service/fetchVenueUsersFromApi";
import { downloadMultiplePhotos } from "@/utils/downloadUtils";
import { convertDateTime, convertOnlyDate } from "@/lib/utils";
import LogoWithText from "@/components/LogoWithText";
import { FormattedMessage, useIntl } from "react-intl";
import LanguagePicker from "@/components/LanguagePicker";
import PhotoAdvertisement from "@/components/PhotoAdvertisement";
import ShareModal from "@/components/ShareModal";
import { shareToSocialMedia } from "@/utils/shareUtils";
import { useState, useEffect } from "react";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Download, Image as ImageIcon, Video, Share2 } from "lucide-react";

type Photo = {
  photo_url: string,
  sent: boolean,
  venue_id?: string,
  boomerang?: {
    id: string,
    boomerang_url: string,
    user_id: string,
    venue_id: string,
    link_id: string,
    created_at: string
  }
}

type BoomerangItem = {
  boomerang_url: string,
  venue_id: string,
  photo: Photo
}

interface PhotosDataFromApi {
  id: string,
  photos: Photo[],
  boomerang?: BoomerangItem[] | null,
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
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'photo' | 'boomerang'>('photo');
  const [cardViewModes, setCardViewModes] = useState<{[key: number]: 'photo' | 'boomerang'}>({});
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [shareFilename, setShareFilename] = useState('');
  const photosPerPage = 12;
  
  console.log('PhotoGallery component rendered', { uuid, currentPage });

  const { data, isLoading, error } = useQuery<PhotosDataFromApi>({
    queryKey: ['photos', uuid, currentPage],
    queryFn: () => fetchPhotosFromApi(uuid || "", {
      limit: photosPerPage,
      offset: (currentPage - 1) * photosPerPage
    }),
    enabled: !!uuid,
  });

  console.log('Query state:', { data, isLoading, error, uuid });

  // Get venue ID immediately for early venue users fetch
  const getVenueId = () => {
    const localStorageVenueId = localStorage.getItem('venueId') || localStorage.getItem('venue_id');
    if (localStorageVenueId) return localStorageVenueId;
    if (data?.venue_id) return data.venue_id;
    if (data?.photos?.[0]?.venue_id) return data.photos[0].venue_id;
    if (data?.boomerang?.[0]?.venue_id) return data.boomerang[0].venue_id;
    return null;
  };

  const venueId = getVenueId();

  // Fetch venue users immediately when venue ID is available
  const { data: venueUsersData } = useQuery({
    queryKey: ['venue-users', venueId],
    queryFn: () => {
      const token = localStorage.getItem('token') || '';
      return venueId ? fetchVenueUsersFromApi(token, venueId) : null;
    },
    enabled: !!venueId,
    staleTime: 5 * 60 * 1000,
  });

  const intl = useIntl();

  useEffect(() => {
    console.log('PhotoGallery useEffect triggered', { data, isLoading });
    if (data && !isLoading) {
      setPhotosLoaded(true);
      setTimeout(() => setShowAds(true), 1000);

      // Initialize card view modes to 'photo' for all cards
      const initialViewModes: {[key: number]: 'photo' | 'boomerang'} = {};
      data.photos.forEach((_, index) => {
        initialViewModes[index] = 'photo';
      });
      setCardViewModes(initialViewModes);
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
        toast.success(intl.formatMessage({ 
          id: "photoGallery.download.downloadAll",
          defaultMessage: "All photos downloaded successfully!"
        }));
      } else if (successCount > 0) {
        toast.success(intl.formatMessage(
          { 
            id: "photoGallery.download.downloadPartial",
            defaultMessage: `Downloaded ${successCount} of ${data.photos.length} photos successfully.`
          },
          { success: successCount, total: data.photos.length }
        ));
      } else {
        toast.error(intl.formatMessage({ 
          id: "photoGallery.download.downloadFailed",
          defaultMessage: "Download failed. Please try again."
        }));
      }
    } catch (error) {
      console.error('Batch download error:', error);
      toast.error(intl.formatMessage({ 
        id: "photoGallery.download.downloadFailed",
        defaultMessage: "Download failed. Please try again."
      }));
    } finally {
      setIsDownloadingAll(false);
    }
  };

  const totalPages = data?.total_count ? Math.ceil(data.total_count / photosPerPage) : 1;

  const handleCardViewModeChange = (index: number, mode: 'photo' | 'boomerang') => {
    setCardViewModes(prev => ({
      ...prev,
      [index]: mode
    }));
  };

  const handleShare = async (photo: Photo, index: number) => {
    const currentViewMode = cardViewModes[index] || 'photo';
    const url = currentViewMode === 'boomerang' && photo.boomerang?.boomerang_url 
      ? photo.boomerang.boomerang_url 
      : photo.photo_url;
    const filename = currentViewMode === 'boomerang' 
      ? `${photoName(index)}_boomerang` 
      : photoName(index);

    // Always open story sharing modal with media download
    setShareUrl(url);
    setShareFilename(filename);
    setShareModalOpen(true);
  };

  console.log('About to render PhotoGallery', { uuid, error, isLoading, data });

  if (!uuid) {
    console.log('No UUID provided');
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
    console.log('Error in PhotoGallery:', error);
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <LogoWithText />
        <h1 className="text-2xl font-bold text-glimps-900 mb-4">
          <FormattedMessage id="photoGallery.error.title" />
        </h1>
        <p className="text-glimps-600 mb-4">
          <FormattedMessage id="photoGallery.error.message" />
        </p>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
        >
          <FormattedMessage id="photoGallery.buttons.retry" />
        </Button>
      </div>
    );
  }

  console.log('Rendering main PhotoGallery content');

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Advertisement with highest z-index */}
      {photosLoaded && showAds && venueId && (
        <div className="fixed top-0 left-0 right-0 z-[10000]">
          <PhotoAdvertisement venueId={venueId} />
        </div>
      )}

      {/* Always show header with app bar */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm relative z-[9997]">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-5 justify-between items-center">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <LogoWithText />
              {data && (
                <div>
                  <h1 className="text-2xl font-bold text-glimps-900">
                    <FormattedMessage id="photoGallery.title" />
                  </h1>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <LanguagePicker />
              <Button
                variant="default"
                size="lg"
                onClick={handleDownloadAll}
                disabled={isLoading || !data || isDownloadingAll}
                className="bg-glimps-900 hover:bg-glimps-800 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                {isDownloadingAll ? (
                  <FormattedMessage
                    id="photoGallery.buttons.downloading"
                    defaultMessage="Downloading..."
                  />
                ) : (
                  <FormattedMessage
                    id="photoGallery.buttons.downloadAll"
                    defaultMessage="Download All"
                  />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 relative z-[9996]">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="relative pt-[75%]">
                  <Skeleton className="absolute inset-0" />
                </div>
                <div className="p-6">
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </Card>
            ))}
          </div>
        ) : data?.photos.length === 0 ? (
          <div className="text-center py-16">
            <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              <FormattedMessage id="photoGallery.noPhotoFound.title" />
            </h2>
            <p className="text-gray-500">
              <FormattedMessage id="photoGallery.noPhotoFound.message" />
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {data?.photos.map((photo, index) => {
                const hasBoomerang = photo.boomerang?.boomerang_url;
                const currentViewMode = cardViewModes[index] || 'photo';
                
                console.log(`Photo ${index}:`, {
                  hasBoomerang: !!hasBoomerang,
                  boomerangUrl: photo.boomerang?.boomerang_url,
                  currentViewMode
                });

                return (
                  <Card key={index} className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white w-full max-w-sm mx-auto border-0 ring-1 ring-gray-200">
                    <div className="relative pt-[100%] group bg-gray-50 rounded-t-lg overflow-hidden">
                      {/* Show photo or boomerang based on toggle */}
                      {currentViewMode === 'boomerang' && hasBoomerang ? (
                        <video
                          src={photo.boomerang!.boomerang_url}
                          className="absolute inset-0 w-full h-full object-contain bg-gray-50"
                          autoPlay
                          loop
                          muted
                          playsInline
                          preload="metadata"
                          onError={(e) => {
                            console.error(`Video error for photo ${index}:`, e);
                            console.log('Video URL:', photo.boomerang!.boomerang_url);
                          }}
                          onLoadStart={() => console.log(`Video ${index} loading started`)}
                          onCanPlay={() => console.log(`Video ${index} can play`)}
                        />
                      ) : (
                        <ProgressiveImage
                          className="absolute inset-0 w-full h-full bg-gray-50"
                          src={photo.photo_url}
                          alt={`Photo ${index + 1}`}
                          objectFit="contain"
                          onLoad={handleImageLoad}
                        />
                      )}
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />

                      {/* Content type indicator */}
                      {hasBoomerang && (
                        <div className="absolute top-3 right-3 bg-black/80 text-white px-3 py-1.5 rounded-full text-xs font-medium">
                           {currentViewMode === 'boomerang' ? (
                             <>
                               <Video className="w-3 h-3 inline mr-1.5" />
                               <FormattedMessage id="photoGallery.viewMode.boomerang" defaultMessage="Boomerang" />
                             </>
                           ) : (
                             <>
                               <ImageIcon className="w-3 h-3 inline mr-1.5" />
                               <FormattedMessage id="photoGallery.viewMode.photo" defaultMessage="Photo" />
                             </>
                           )}
                        </div>
                      )}

                    </div>

                    <div className="p-6 space-y-4">
                      
                      {/* Toggle buttons for photo/boomerang when available */}
                      {hasBoomerang && (
                        <ToggleGroup
                          type="single"
                          value={currentViewMode}
                          onValueChange={(value) => value && handleCardViewModeChange(index, value as 'photo' | 'boomerang')}
                          className="justify-center"
                        >
                          <ToggleGroupItem value="photo" variant="outline" size="sm">
                            <ImageIcon className="w-4 h-4 mr-1" />
                            <FormattedMessage id="photoGallery.viewMode.photo" defaultMessage="Photo" />
                          </ToggleGroupItem>
                          <ToggleGroupItem value="boomerang" variant="outline" size="sm">
                            <Video className="w-4 h-4 mr-1" />
                            <FormattedMessage id="photoGallery.viewMode.boomerang" defaultMessage="Boomerang" />
                          </ToggleGroupItem>
                        </ToggleGroup>
                      )}

                      {/* Download and Share buttons */}
                      <div className="flex justify-center gap-2">
                        {currentViewMode === 'boomerang' && hasBoomerang ? (
                          <BoomerangDownloadButton
                            url={photo.boomerang!.boomerang_url}
                            filename={`${photoName(index)}_boomerang`}
                            variant="default"
                            size="sm"
                            showText={true}
                          />
                        ) : (
                          <EnhancedDownloadButton
                            url={photo.photo_url}
                            filename={photoName(index)}
                            variant="default"
                            size="sm"
                            showText={true}
                          />
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShare(photo, index)}
                          className="border-glimps-200 hover:bg-glimps-50 text-glimps-700"
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          <FormattedMessage id="photoGallery.buttons.share" defaultMessage="Share" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
            
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
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

      {/* Share Modal with increased z-index for iPhone compatibility */}
      <ShareModal 
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        url={shareUrl}
        filename={shareFilename}
      />
    </div>
  );
};

export default PhotoGallery;
