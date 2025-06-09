import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { FormattedMessage } from "react-intl";
import { useAuth } from "@/auth/AuthProvider";
import { toast } from "sonner";
import AdForm from "./advertising/AdForm";
import AdList from "./advertising/AdList";
import { Advertisement } from "@/types/advertisement";

const AdvertisingManager = () => {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const { venue, token } = useAuth();

  useEffect(() => {
    if (venue && token) {
      fetchAds();
    }
  }, [venue, token]);

  const fetchAds = async () => {
    if (!venue || !token) return;
    
    setIsLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/ads/all/${venue.id}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ads: ${response.status}`);
      }
      
      const data = await response.json();
      setAds(data || []);
    } catch (error) {
      console.error("Failed to fetch ads:", error);
      toast.error("Failed to load advertisements");
    } finally {
      setIsLoading(false);
    }
  };

  const checkActiveAdsLimit = (newAdData: {
    start_date: string;
    expiry_date: string;
  }) => {
    const now = new Date();
    const newStart = new Date(newAdData.start_date);
    const newExpiry = new Date(newAdData.expiry_date);
    
    // Check if the new ad would be active now
    const newAdIsActiveNow = now >= newStart && now <= newExpiry;
    
    if (!newAdIsActiveNow) {
      return false; // No conflict if new ad is not active now
    }
    
    // Check for existing active ads
    const hasActiveAd = ads.some(ad => {
      if (editingAd && ad.id === editingAd.id) {
        return false; // Don't count the ad being edited
      }
      
      const start = new Date(ad.start_date);
      const expiry = new Date(ad.expiry_date);
      return now >= start && now <= expiry;
    });
    
    return hasActiveAd;
  };

  const handleCreateOrUpdateAd = async (data: {
    campaign_name: string;
    start_date: string;
    expiry_date: string;
    ads_size: "BANNER" | "FULLSCREEN";
    external_url?: string;
    media_file?: File;
  }) => {
    if (!venue || !token) return;

    // Check for active ad limit
    if (checkActiveAdsLimit(data)) {
      toast.error("You can only have one active advertisement at a time. Please schedule this ad for later or edit your current active ad.");
      return;
    }

    setIsLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const formData = new FormData();
      
      formData.append('campaign_name', data.campaign_name);
      formData.append('start_date', data.start_date);
      formData.append('expiry_date', data.expiry_date);
      formData.append('ads_size', data.ads_size);
      formData.append('venue_id', venue.id);

      // Add external_url if provided
      if (data.external_url) {
        formData.append('external_url', data.external_url);
      }

      // Only append media file for new ads OR when updating with new media
      if (data.media_file) {
        formData.append('media_file', data.media_file);
      }


      // Use different endpoints for create vs update
      const url = editingAd 
        ? `${apiUrl}/ads/update/${editingAd.id}` 
        : `${apiUrl}/ads/create`;
      const method = editingAd ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`
          // Don't set Content-Type for FormData, let browser set it with boundary
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to ${editingAd ? 'update' : 'create'} ad: ${response.status}`);
      }

      toast.success(`Advertisement ${editingAd ? 'updated' : 'created'} successfully!`);
      setShowForm(false);
      setEditingAd(null);
      fetchAds();
    } catch (error) {
      console.error(`Failed to ${editingAd ? 'update' : 'create'} ad:`, error);
      toast.error(error instanceof Error ? error.message : `Failed to ${editingAd ? 'update' : 'create'} advertisement`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAd = async (adId: string) => {
    if (!token) return;

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/ads/${adId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete ad: ${response.status}`);
      }

      toast.success("Advertisement deleted successfully!");
      fetchAds();
    } catch (error) {
      console.error("Failed to delete ad:", error);
      toast.error("Failed to delete advertisement");
    }
  };

  const handleEditAd = (ad: Advertisement) => {
    setEditingAd(ad);
    setShowForm(true);
  };

  const handleCreateNew = () => {
    setEditingAd(null);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              <FormattedMessage 
                id="venueDashboard.advertising.title" 
                defaultMessage="Advertisement Management" 
              />
            </h2>
            <Button
              onClick={handleCreateNew}
              disabled={showForm}
            >
              <Plus className="w-4 h-4 mr-2" />
              <FormattedMessage 
                id="venueDashboard.advertising.createAd" 
                defaultMessage="Create Advertisement" 
              />
            </Button>
          </div>

          {showForm ? (
            <AdForm
              adToEdit={editingAd}
              isLoading={isLoading}
              onSubmit={handleCreateOrUpdateAd}
              onCancel={() => {
                setShowForm(false);
                setEditingAd(null);
              }}
            />
          ) : (
            <AdList
              ads={ads}
              isLoading={isLoading}
              onEdit={handleEditAd}
              onDelete={handleDeleteAd}
              onCreateNew={handleCreateNew}
            />
          )}
        </div>
      </Card>
    </div>
  );
};

export default AdvertisingManager;
