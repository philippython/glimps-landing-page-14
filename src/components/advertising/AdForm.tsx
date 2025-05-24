import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormattedMessage, useIntl } from "react-intl";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

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

interface AdFormProps {
  adToEdit: Advertisement | null;
  isLoading: boolean;
  onCancel: () => void;
  onSubmit: (data: {
    campaign_name: string;
    media_url: string;
    start_date: string;
    expiry_date: string;
    ads_size: AdSize;
  }) => void;
}

const AdForm = ({ adToEdit, isLoading, onCancel, onSubmit }: AdFormProps) => {
  const intl = useIntl();

  // Form state
  const [campaignName, setCampaignName] = useState<string>(adToEdit?.campaign_name || "");
  const [mediaUrl, setMediaUrl] = useState<string>(adToEdit?.media_url || "");
  const [startDate, setStartDate] = useState<Date>(
    adToEdit ? new Date(adToEdit.start_date) : new Date()
  );
  const [expiryDate, setExpiryDate] = useState<Date>(
    adToEdit ? new Date(adToEdit.expiry_date) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  );
  const [adSize, setAdSize] = useState<AdSize>(adToEdit?.ads_size || "BANNER");

  const handleSubmit = () => {
    onSubmit({
      campaign_name: campaignName,
      media_url: mediaUrl,
      start_date: startDate.toISOString(),
      expiry_date: expiryDate.toISOString(),
      ads_size: adSize
    });
  };

  return (
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
          onClick={onCancel} 
          className="mr-2"
        >
          <FormattedMessage id="common.cancel" />
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isLoading || !campaignName || !mediaUrl} 
        >
          {adToEdit ? (
            <FormattedMessage id="venueDashboard.advertising.update" />
          ) : (
            <FormattedMessage id="venueDashboard.advertising.submit" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default AdForm;
