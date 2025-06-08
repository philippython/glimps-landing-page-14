
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Pencil, Trash2, Plus } from "lucide-react";
import { FormattedMessage } from "react-intl";
import { Advertisement } from "@/types/advertisement";
import AdPreview from "../AdPreview";

interface AdListProps {
  ads: Advertisement[];
  isLoading: boolean;
  onEdit: (ad: Advertisement) => void;
  onDelete: (adId: string) => void;
  onCreateNew: () => void;
}

const AdList = ({ ads, isLoading, onEdit, onDelete, onCreateNew }: AdListProps) => {
  const getAdStatus = (ad: Advertisement) => {
    const now = new Date();
    const startDate = new Date(ad.start_date);
    const expiryDate = new Date(ad.expiry_date);

    if (now < startDate) return "SCHEDULED";
    if (now > expiryDate) return "EXPIRED";
    return "ACTIVE";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE": return "bg-green-100 text-green-800";
      case "SCHEDULED": return "bg-blue-100 text-blue-800";
      case "EXPIRED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-1/4" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (ads.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          <FormattedMessage 
            id="venueDashboard.advertising.noAds" 
            defaultMessage="No advertisements yet" 
          />
        </h3>
        <p className="text-gray-600 mb-6">
          <FormattedMessage 
            id="venueDashboard.advertising.noAdsDescription" 
            defaultMessage="Create your first advertisement to start promoting your venue." 
          />
        </p>
        <Button onClick={onCreateNew}>
          <Plus className="w-4 h-4 mr-2" />
          <FormattedMessage 
            id="venueDashboard.advertising.createFirstAd" 
            defaultMessage="Create First Advertisement" 
          />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {ads.map((ad) => {
        const status = getAdStatus(ad);
        return (
          <Card key={ad.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{ad.campaign_name}</h3>
                  <Badge className={getStatusColor(status)}>
                    {status}
                  </Badge>
                  <Badge variant="outline">
                    {ad.ads_size}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>
                    <span className="font-medium">Start:</span> {new Date(ad.start_date).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Expiry:</span> {new Date(ad.expiry_date).toLocaleDateString()}
                  </div>
                  {ad.redirect_url && (
                    <div>
                      <span className="font-medium">Redirect:</span> 
                      <a href={ad.redirect_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                        {ad.redirect_url}
                      </a>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <AdPreview 
                  mediaUrl={ad.media_url} 
                  adSize={ad.ads_size} 
                  campaignName={ad.campaign_name}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(ad)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(ad.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default AdList;
