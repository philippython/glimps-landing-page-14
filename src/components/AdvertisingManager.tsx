import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormattedMessage, useIntl } from "react-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { CalendarIcon, Plus, Eye, Trash2, PenLine } from "lucide-react";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/auth/AuthProvider";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import ImageWithFallback from "./ImageWithFallback";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Types for advertisements
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

const AdvertisingManager = () => {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [adToShow, setAdToShow] = useState<Advertisement | null>(null);
  const [adToEdit, setAdToEdit] = useState<Advertisement | null>(null);
  const [previewMode, setPreviewMode] = useState<AdSize>("BANNER");
  const [activeTab, setActiveTab] = useState("list");
  const { venue, token } = useAuth();
  const intl = useIntl();
  
  // Form state
  const [campaignName, setCampaignName] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [expiryDate, setExpiryDate] = useState<Date>(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)); // +30 days
  const [adSize, setAdSize] = useState<AdSize>("BANNER");

  useEffect(() => {
    if (venue && token) {
      fetchAds();
    }
  }, [venue, token]);

  const fetchAds = async () => {
    if (!venue || !token) return;
    
    setIsLoading(true);
    try {
      // Make API call to fetch ads
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/ads/all/${venue.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ads: ${response.status}`);
      }
      
      const data = await response.json();
      setAds(data || []);
    } catch (error) {
      console.error("Failed to fetch ads:", error);
      toast.error(intl.formatMessage({ id: "venueDashboard.advertising.messages.fetchError" }));
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setCampaignName("");
    setMediaUrl("");
    setStartDate(new Date());
    setExpiryDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
    setAdSize("BANNER");
    setAdToEdit(null);
  };

  const checkForActiveAdConflict = (newStartDate: Date, newExpiryDate: Date, newAdSize: AdSize, excludeAdId?: string) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    return ads.some(ad => {
      // Skip the ad being edited
      if (excludeAdId && ad.id === excludeAdId) return false;
      
      // Only check ads of the same size
      if (ad.ads_size !== newAdSize) return false;
      
      const adStartDate = new Date(ad.start_date);
      const adExpiryDate = new Date(ad.expiry_date);
      adStartDate.setHours(0, 0, 0, 0);
      adExpiryDate.setHours(0, 0, 0, 0);
      
      // Check if the ad is currently active or will be active
      const isCurrentlyActive = now >= adStartDate && now <= adExpiryDate;
      const willBeActive = adExpiryDate >= now;
      
      if (!isCurrentlyActive && !willBeActive) return false;
      
      // Check for date overlap
      return (newStartDate <= adExpiryDate && newExpiryDate >= adStartDate);
    });
  };

  const handleCreateAd = async () => {
    if (!venue || !token) return;
    
    // Check for active ad conflict
    if (checkForActiveAdConflict(startDate, expiryDate, adSize)) {
      toast.error(`There is already an active ${adSize.toLowerCase()} ad during this time period. Only one active ad per type is allowed at a time.`);
      return;
    }
    
    setIsLoading(true);
    
    // Create ad payload
    const adPayload = {
      campaign_name: campaignName,
      media_url: mediaUrl,
      start_date: startDate.toISOString(),
      expiry_date: expiryDate.toISOString(),
      ads_size: adSize
    };
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/ads/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(adPayload)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create ad");
      }
      
      await response.json();
      
      // Fetch updated ads list
      fetchAds();
      
      // Reset form and switch to list view
      resetForm();
      setActiveTab("list");
      
      // Show success message
      toast.success(intl.formatMessage({ id: "venueDashboard.advertising.messages.createSuccess" }));
    } catch (error) {
      console.error("Failed to create ad:", error);
      toast.error(intl.formatMessage({ id: "venueDashboard.advertising.messages.createError" }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAd = async () => {
    if (!venue || !adToEdit || !token) return;
    
    // Check for active ad conflict (excluding the current ad being edited)
    if (checkForActiveAdConflict(startDate, expiryDate, adSize, adToEdit.id)) {
      toast.error(`There is already an active ${adSize.toLowerCase()} ad during this time period. Only one active ad per type is allowed at a time.`);
      return;
    }
    
    setIsLoading(true);
    
    // Create ad payload
    const adPayload = {
      campaign_name: campaignName,
      media_url: mediaUrl,
      start_date: startDate.toISOString(),
      expiry_date: expiryDate.toISOString(),
      ads_size: adSize
    };
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      // Using the ad ID for update instead of venue ID
      const response = await fetch(`${apiUrl}/ads/update/${adToEdit.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(adPayload)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update ad");
      }
      
      // Fetch updated ads list
      fetchAds();
      
      // Reset form and switch to list view
      resetForm();
      setActiveTab("list");
      
      // Show success message
      toast.success(intl.formatMessage({ id: "venueDashboard.advertising.messages.updateSuccess" }));
    } catch (error) {
      console.error("Failed to update ad:", error);
      toast.error(intl.formatMessage({ id: "venueDashboard.advertising.messages.updateError" }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAd = async (id: string) => {
    if (!token || !venue) return;
    
    setIsLoading(true);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/ads/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete ad");
      }
      
      // Fetch updated ads list
      fetchAds();
      
      // Show success message
      toast.success(intl.formatMessage({ id: "venueDashboard.advertising.messages.deleteSuccess" }));
    } catch (error) {
      console.error("Failed to delete ad:", error);
      toast.error(intl.formatMessage({ id: "venueDashboard.advertising.messages.deleteError" }));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEditClick = (ad: Advertisement) => {
    setAdToEdit(ad);
    setCampaignName(ad.campaign_name);
    setMediaUrl(ad.media_url);
    setStartDate(new Date(ad.start_date));
    setExpiryDate(new Date(ad.expiry_date));
    setAdSize(ad.ads_size);
    setActiveTab("create");
  };
  
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

  return (
    <Card>
      <CardHeader>
        <CardTitle><FormattedMessage id="venueDashboard.advertising.title" /></CardTitle>
        <CardDescription><FormattedMessage id="venueDashboard.advertising.description" /></CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="list">
              <FormattedMessage id="venueDashboard.advertising.adsList" defaultMessage="Ads List" />
            </TabsTrigger>
            <TabsTrigger value="create">
              {adToEdit ? (
                <FormattedMessage id="venueDashboard.advertising.editAd" defaultMessage="Edit Ad" />
              ) : (
                <FormattedMessage id="venueDashboard.advertising.createNewAd" defaultMessage="Create New Ad" />
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="list">
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4"><FormattedMessage id="common.loading" /></p>
              </div>
            ) : ads.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4"><FormattedMessage id="venueDashboard.advertising.noAds" /></p>
                <Button variant="outline" onClick={() => {
                  resetForm();
                  setActiveTab("create");
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  <FormattedMessage id="venueDashboard.advertising.createAd" />
                </Button>
              </div>
            ) : (
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
                                    <ImageWithFallback src={adToShow?.media_url || ""} alt={adToShow?.campaign_name || ""} className="w-full h-20 object-cover" />
                                  </div>
                                </div>
                              ) : (
                                <div className="relative">
                                  <div className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-6">
                                    <div className="bg-white rounded-lg overflow-hidden max-w-lg w-full">
                                      <div className="p-4">
                                        <ImageWithFallback src={adToShow?.media_url || ""} alt={adToShow?.campaign_name || ""} className="w-full aspect-video object-cover" />
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
                            onClick={() => handleEditClick(ad)}
                          >
                            <PenLine className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteAd(ad.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="create">
            <div className="space-y-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="campaign-name">
                    <FormattedMessage id="venueDashboard.advertising.campaignName" />
                  </Label>
                  <Input 
                    id="campaign-name" 
                    value={campaignName} 
                    onChange={(e) => setCampaignName(e.target.value)} 
                    placeholder="Summer Promotion 2025"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="media-url">
                    <FormattedMessage id="venueDashboard.advertising.mediaUrl" />
                  </Label>
                  <Input 
                    id="media-url" 
                    value={mediaUrl} 
                    onChange={(e) => setMediaUrl(e.target.value)} 
                    placeholder="https://example.com/ad-image.jpg"
                    className="flex-1"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label>
                    <FormattedMessage id="venueDashboard.advertising.startDate" />
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => date && setStartDate(date)}
                        initialFocus
                        className="p-3 pointer-events-auto"
                        disabled={(date) => {
                          // If editing an existing ad and the original start date is in the past, allow it
                          if (adToEdit && new Date(adToEdit.start_date) < new Date() && 
                              date && date.toDateString() === new Date(adToEdit.start_date).toDateString()) {
                            return false;
                          }
                          // Otherwise, disable past dates
                          return date < new Date(new Date().setHours(0, 0, 0, 0));
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="grid gap-2">
                  <Label>
                    <FormattedMessage id="venueDashboard.advertising.expiryDate" />
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {expiryDate ? format(expiryDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={expiryDate}
                        onSelect={(date) => date && setExpiryDate(date)}
                        initialFocus
                        className="p-3 pointer-events-auto"
                        disabled={(date) => date < startDate}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="grid gap-2">
                  <Label>
                    <FormattedMessage id="venueDashboard.advertising.adsSize" />
                  </Label>
                  <RadioGroup value={adSize} onValueChange={(value) => setAdSize(value as AdSize)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="BANNER" id="banner" />
                      <Label htmlFor="banner">
                        <FormattedMessage id="venueDashboard.advertising.adsSizeOptions.banner" />
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="FULLSCREEN" id="fullscreen" />
                      <Label htmlFor="fullscreen">
                        <FormattedMessage id="venueDashboard.advertising.adsSizeOptions.fullscreen" />
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    resetForm();
                    setActiveTab("list");
                  }} 
                  className="mr-2"
                >
                  <FormattedMessage id="common.cancel" />
                </Button>
                <Button 
                  onClick={adToEdit ? handleUpdateAd : handleCreateAd} 
                  disabled={isLoading || !campaignName || !mediaUrl} 
                >
                  {adToEdit ? (
                    <FormattedMessage id="venueDashboard.advertising.update" defaultMessage="Update" />
                  ) : (
                    <FormattedMessage id="venueDashboard.advertising.submit" />
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdvertisingManager;
