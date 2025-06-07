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

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const validateFile = async (file: File): Promise<boolean> => {
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      toast.error("Please select an image or video file");
      return false;
    }

    if (adSize === "BANNER" && isVideo) {
      toast.error("Banner ads can only use images, not videos");
      return false;
    }

    if (adSize === "BANNER" && isImage) {
      // Check image dimensions for banner (should be wide, not square)
      return new Promise<boolean>((resolve) => {
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
      });
    }

    return true;
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
    setUploadProgress(0);
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          // Simulate uploaded URL
          setMediaUrl("https://example.com/uploaded-media.jpg");
          toast.success("Media uploaded successfully!");
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleSubmit = () => {
    if (selectedFile && !isUploading && uploadProgress === 0) {
      simulateUpload();
      return;
    }

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
          <Label>
            <FormattedMessage id="venueDashboard.advertising.mediaUpload" />
          </Label>
          
          {!selectedFile && !mediaUrl ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <Label htmlFor="media-upload" className="cursor-pointer">
                <span className="text-sm text-gray-600">
                  Click to upload image or video
                </span>
                <Input
                  id="media-upload"
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </Label>
            </div>
          ) : (
            <div className="space-y-3">
              {previewUrl && (
                <div className="relative inline-block">
                  {selectedFile?.type.startsWith('image/') ? (
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="max-h-32 rounded border"
                    />
                  ) : (
                    <video 
                      src={previewUrl} 
                      className="max-h-32 rounded border"
                      controls
                    />
                  )}
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6"
                    onClick={removeSelectedFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}
            </div>
          )}
          
          {!selectedFile && (
            <div className="grid gap-2">
              <Label htmlFor="media-url">
                <FormattedMessage id="venueDashboard.advertising.mediaUrl" />
              </Label>
              <Input 
                id="media-url" 
                value={mediaUrl} 
                onChange={(e) => setMediaUrl(e.target.value)} 
                placeholder="https://example.com/ad-image.jpg"
              />
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
      </div>

      <div className="flex justify-end mt-6">
        <Button 
          variant="outline" 
          onClick={onCancel} 
          className="mr-2"
          disabled={isUploading}
        >
          <FormattedMessage id="common.cancel" />
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isLoading || !campaignName || (!mediaUrl && !selectedFile) || isUploading} 
        >
          {isUploading ? (
            "Uploading..."
          ) : adToEdit ? (
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
