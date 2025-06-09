
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { FormattedMessage, useIntl } from "react-intl";
import { format } from "date-fns";
import { CalendarIcon, Upload, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";

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
  redirect_url?: string;
  external_url?: string;
}

interface AdFormProps {
  adToEdit: Advertisement | null;
  isLoading: boolean;
  onCancel: () => void;
  onSubmit: (data: {
    campaign_name: string;
    start_date: string;
    expiry_date: string;
    ads_size: AdSize;
    external_url?: string;
    media_file?: File;
  }) => void;
}

const AdForm = ({ adToEdit, isLoading, onCancel, onSubmit }: AdFormProps) => {
  const intl = useIntl();

  // Form state
  const [campaignName, setCampaignName] = useState<string>(adToEdit?.campaign_name || "");
  const [startDate, setStartDate] = useState<Date>(
    adToEdit ? new Date(adToEdit.start_date) : new Date()
  );
  const [expiryDate, setExpiryDate] = useState<Date>(
    adToEdit ? new Date(adToEdit.expiry_date) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  );
  const [adSize, setAdSize] = useState<AdSize>(adToEdit?.ads_size || "BANNER");
  const [externalUrl, setExternalUrl] = useState<string>(adToEdit?.external_url || "");

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const validateFile = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');

      if (!isImage && !isVideo) {
        toast.error("Please select an image or video file");
        resolve(false);
        return;
      }

      if (adSize === "BANNER" && isVideo) {
        toast.error("Banner ads can only use images, not videos");
        resolve(false);
        return;
      }

      if (adSize === "BANNER" && isImage) {
        // Check image dimensions for banner (should be wide, not square)
        const img = new Image();
        img.onload = () => {
          const aspectRatio = img.width / img.height;
          if (aspectRatio < 2) {
            toast.error("Banner images must be wide rectangles (aspect ratio at least 2:1)");
            resolve(false);
          } else {
            resolve(true);
          }
        };
        img.onerror = () => {
          toast.error("Failed to load image for validation");
          resolve(false);
        };
        img.src = URL.createObjectURL(file);
      } else {
        resolve(true);
      }
    });
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isValid = await validateFile(file);
    if (!isValid) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setPreviewUrl("");
  };

  const handleSubmit = () => {
    if (!adToEdit && !selectedFile) {
      toast.error("Please select a media file");
      return;
    }

    // Format dates to ensure we're sending the correct date (no time shift)
    const formattedStartDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).toISOString();
    const formattedExpiryDate = new Date(expiryDate.getFullYear(), expiryDate.getMonth(), expiryDate.getDate()).toISOString();

    onSubmit({
      campaign_name: campaignName,
      start_date: formattedStartDate,
      expiry_date: formattedExpiryDate,
      ads_size: adSize,
      external_url: externalUrl || undefined,
      media_file: selectedFile || undefined
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
          <Label htmlFor="external-url">
            External URL (Optional)
          </Label>
          <Input 
            id="external-url" 
            value={externalUrl} 
            onChange={(e) => setExternalUrl(e.target.value)} 
            placeholder="https://example.com"
            type="url"
          />
        </div>
        
        <div className="grid gap-2">
          <Label>
            <FormattedMessage id="venueDashboard.advertising.mediaUpload" />
          </Label>
          
          {/* Show existing media for edit mode */}
          {adToEdit && adToEdit.media_url && !selectedFile && (
            <div className="space-y-3">
              <div className="text-sm text-gray-600">Current media:</div>
              <div className="relative inline-block">
                {adToEdit.media_url.includes('.mp4') || adToEdit.media_url.includes('.mov') || adToEdit.media_url.includes('.avi') ? (
                  <video 
                    src={adToEdit.media_url} 
                    className="max-h-32 rounded border"
                    controls
                    muted={false}
                  />
                ) : (
                  <img 
                    src={adToEdit.media_url} 
                    alt="Current ad media" 
                    className="max-h-32 rounded border"
                  />
                )}
              </div>
              <div className="text-sm text-gray-500">
                Select a new file to replace the current media
              </div>
            </div>
          )}

          {/* File upload area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                {adToEdit ? "Upload new media file" : "Click to upload image or video"}
              </p>
              <p className="text-xs text-gray-500">
                {adSize === "BANNER" ? "Images only (wide rectangles)" : "Images or videos supported"}
              </p>
            </div>
            <Label htmlFor="media-upload" className="cursor-pointer">
              <Button variant="outline" className="mt-4" asChild>
                <span>Choose File</span>
              </Button>
              <Input
                id="media-upload"
                type="file"
                accept={adSize === "BANNER" ? "image/*" : "image/*,video/*"}
                className="hidden"
                onChange={handleFileSelect}
              />
            </Label>
          </div>

          {/* Preview selected file */}
          {selectedFile && previewUrl && (
            <div className="space-y-3">
              <div className="text-sm text-gray-600">Selected file:</div>
              <div className="relative inline-block">
                {selectedFile.type.startsWith('image/') ? (
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="max-h-32 rounded border"
                  />
                ) : selectedFile.type.startsWith('video/') ? (
                  <video 
                    src={previewUrl} 
                    className="max-h-32 rounded border"
                    controls
                    muted={false}
                  />
                ) : null}
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6"
                  onClick={removeSelectedFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-sm text-green-600">
                ✓ File selected: {selectedFile.name}
              </div>
            </div>
          )}
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
                <span className="text-sm text-gray-500 ml-2">(Images only, wide rectangle)</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="FULLSCREEN" id="fullscreen" />
              <Label htmlFor="fullscreen">
                <FormattedMessage id="venueDashboard.advertising.adsSizeOptions.fullscreen" />
                <span className="text-sm text-gray-500 ml-2">(Images or videos)</span>
              </Label>
            </div>
          </RadioGroup>
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
                  if (adToEdit && new Date(adToEdit.start_date) < new Date() && 
                      date && date.toDateString() === new Date(adToEdit.start_date).toDateString()) {
                    return false;
                  }
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
      </div>

      <div className="flex justify-end mt-6">
        <Button 
          variant="outline" 
          onClick={onCancel} 
          className="mr-2"
          disabled={isLoading}
        >
          <FormattedMessage id="common.cancel" />
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isLoading || !campaignName || (!adToEdit && !selectedFile)} 
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
