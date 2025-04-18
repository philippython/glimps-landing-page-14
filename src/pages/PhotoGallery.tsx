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
import { FormattedMessage } from "react-intl";
import LanguagePicker from "@/components/LanguagePicker";

type Photo = {
  photo_url: string,
  sent: boolean
}

interface PhotosDataFromApi {
  id: string,
  photos: Photo[],
  sent: boolean,
  synced: boolean,
  created_at: string
}

const PhotoGallery = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const { data, isLoading, error } = useQuery<PhotosDataFromApi>({
    queryKey: ['photos', uuid],
    queryFn: () => fetchPhotosFromApi(uuid || ""),
    enabled: !!uuid,
  });

  const photoName = (index: number) => `${data && convertOnlyDate(data.created_at)} (${index + 1})`;

  const handleDownload = (url: string, name: string) => {
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = blobUrl;
        a.download = name + '.jpg';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(blobUrl);
      })
      .catch(() => {
        toast.error(`Failed to download ${name}`);
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
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
                    {convertDateTime(data.created_at)} • {data.photos.length}
                    {" "}<FormattedMessage id="photoGallery.photos" />
                  </p>
                </div>
              )}
            </div>
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
                    toast.success("Downloaded all photos");
                  }
                }}
                disabled={isLoading || !data}
              >
                <FormattedMessage id="photoGallery.buttons.downloadAll" />
              </Button>
            </div>
          </div>
        </div>
      </header>

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
                      toast.success(`Downloaded ${photoName(index)}`);
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
