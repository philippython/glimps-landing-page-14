
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Trash2, PenLine } from "lucide-react";
import { format } from "date-fns";
import { FormattedMessage } from "react-intl";
import ImageWithFallback from "../ImageWithFallback";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

type AdSize = "BANNER" | "FULLSCREEN";

interface Advertisement {
  id: string;
  campaign_name: string;
  media_url: string;
  start_date: string;
  expiry_date: string;
  ads_size: AdSize;
  venue_id: string;
  created_at: string;
}

interface AdListProps {
  ads: Advertisement[];
  isLoading: boolean;
  onEdit: (ad: Advertisement) => void;
  onDelete: (id: string) => void;
  onCreateNew: () => void;
}

const AdList = ({ ads, isLoading, onEdit, onDelete, onCreateNew }: AdListProps) => {
  const [adToShow, setAdToShow] = useState<Advertisement | null>(null);
  const [previewMode, setPreviewMode] = useState<AdSize>("BANNER");

  const getAdStatus = (ad: Advertisement) => {
    const now = new Date();
    const start = new Date(ad.start_date);
    const expiry = new Date(ad.expiry_date);
    
    // Reset time portion for accurate date comparison
    now.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);
    
    if (now < start) {
      return "scheduled";
    } else if (now > expiry) {
      return "expired";
    } else {
      return "active";
    }
  };

  const handleAdClick = (mediaUrl: string) => {
    window.open(mediaUrl, "_blank", "noopener,noreferrer");
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4"><FormattedMessage id="common.loading" /></p>
      </div>
    );
  }

  if (ads.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4"><FormattedMessage id="venueDashboard.advertising.noAds" /></p>
        <Button variant="outline" onClick={onCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          <FormattedMessage id="venueDashboard.advertising.createAd" />
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead><FormattedMessage id="venueDashboard.advertising.campaignName" /></TableHead>
            <TableHead><FormattedMessage id="venueDashboard.advertising.adsSize" /></TableHead>
            <TableHead><FormattedMessage id="venueDashboard.advertising.startDate" /></TableHead>
            <TableHead><FormattedMessage id="venueDashboard.advertising.expiryDate" /></TableHead>
            <TableHead><FormattedMessage id="venueDashboard.advertising.status" /></TableHead>
            <TableHead className="text-right"><FormattedMessage id="venueDashboard.sessions.actions" /></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ads.map(ad => (
            <TableRow key={ad.id}>
              <TableCell className="font-medium">{ad.campaign_name}</TableCell>
              <TableCell>
                <FormattedMessage 
                  id={`venueDashboard.advertising.adsSizeOptions.${ad.ads_size === "BANNER" ? "banner" : "fullscreen"}`} 
                />
              </TableCell>
              <TableCell>{format(new Date(ad.start_date), "PPP")}</TableCell>
              <TableCell>{format(new Date(ad.expiry_date), "PPP")}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                    ${getAdStatus(ad) === "active" ? "bg-green-100 text-green-800" : ""}
                    ${getAdStatus(ad) === "scheduled" ? "bg-blue-100 text-blue-800" : ""}
                    ${getAdStatus(ad) === "expired" ? "bg-gray-100 text-gray-800" : ""}
                  `}
                >
                  <FormattedMessage id={`venueDashboard.advertising.${getAdStatus(ad)}`} />
                </span>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={() => {
                      setAdToShow(ad);
                      setPreviewMode(ad.ads_size);
                    }}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className={previewMode === "FULLSCREEN" ? "max-w-screen-xl p-0" : ""}>
                    {previewMode === "BANNER" ? (
                      <div className="w-full">
                        <div className="w-full p-2 bg-white border-b flex justify-between items-center">
                          <div className="flex-1">
                            <h3 className="font-semibold">Your Glimps Photos</h3>
                            <p className="text-sm text-gray-500">5 photos</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" disabled>Download All</Button>
                          </div>
                        </div>
                        <div className="w-full p-4">
                          <div 
                            className="cursor-pointer"
                            onClick={() => handleAdClick(adToShow?.media_url || "")}
                          >
                            <ImageWithFallback 
                              src={adToShow?.media_url || ""} 
                              alt={adToShow?.campaign_name || ""} 
                              className="w-full h-20 object-cover" 
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-6">
                          <div className="bg-white rounded-lg overflow-hidden max-w-lg w-full">
                            <div 
                              className="p-4 cursor-pointer"
                              onClick={() => handleAdClick(adToShow?.media_url || "")}
                            >
                              <ImageWithFallback 
                                src={adToShow?.media_url || ""} 
                                alt={adToShow?.campaign_name || ""} 
                                className="w-full aspect-video object-cover" 
                              />
                            </div>
                            <div className="p-4 bg-gray-50 flex justify-between">
                              <p className="font-semibold">{adToShow?.campaign_name}</p>
                              <Button variant="ghost" size="sm">
                                <FormattedMessage id="venueDashboard.advertising.closeAd" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="w-full h-[70vh] opacity-20">
                          {/* Blurred mock content */}
                          <div className="flex flex-wrap gap-3 p-6">
                            {[1, 2, 3, 4, 5].map(i => (
                              <div key={i} className="w-64 h-64 bg-gray-200 rounded-lg"></div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onEdit(ad)}
                >
                  <PenLine className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(ad.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdList;
