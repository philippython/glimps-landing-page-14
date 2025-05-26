
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FormattedMessage } from "react-intl";
import { Calendar, Eye } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/auth/AuthProvider";

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

const ActiveAdBanner = () => {
  const [activeAds, setActiveAds] = useState<Advertisement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { venue, token } = useAuth();

  useEffect(() => {
    if (venue && token) {
      fetchActiveAds();
    }
  }, [venue, token]);

  const fetchActiveAds = async () => {
    if (!venue || !token) return;
    
    setIsLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/ads/all/${venue.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ads: ${response.status}`);
      }
      
      const data = await response.json();
      const now = new Date();
      
      // Filter for active ads only
      const currentlyActiveAds = (data || []).filter((ad: Advertisement) => {
        const start = new Date(ad.start_date);
        const expiry = new Date(ad.expiry_date);
        now.setHours(0, 0, 0, 0);
        start.setHours(0, 0, 0, 0);
        expiry.setHours(0, 0, 0, 0);
        
        return now >= start && now <= expiry;
      });
      
      setActiveAds(currentlyActiveAds);
    } catch (error) {
      console.error("Failed to fetch ads:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || activeAds.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <Card className="border-green-200 bg-green-50">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <h3 className="font-semibold text-green-800">
                <FormattedMessage 
                  id="venueDashboard.advertising.activeAdsTitle" 
                  defaultMessage="Active Advertisements" 
                />
              </h3>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {activeAds.length}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            {activeAds.map((ad) => (
              <div key={ad.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{ad.campaign_name}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <FormattedMessage 
                        id={`venueDashboard.advertising.adsSizeOptions.${ad.ads_size === "BANNER" ? "banner" : "fullscreen"}`}
                        defaultMessage={ad.ads_size === "BANNER" ? "Banner" : "Fullscreen"}
                      />
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        <FormattedMessage 
                          id="venueDashboard.advertising.activeUntil" 
                          defaultMessage="Active until {date}"
                          values={{ date: format(new Date(ad.expiry_date), "MMM dd, yyyy") }}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ActiveAdBanner;
