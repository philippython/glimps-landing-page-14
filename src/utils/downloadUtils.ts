
import { toast } from "sonner";

export interface DownloadOptions {
  url: string;
  filename: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const downloadPhoto = async ({ url, filename, onSuccess, onError }: DownloadOptions) => {
  console.log(`Starting download for: ${filename}`);
  
  // Method 1: Try modern download with fetch
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'image/jpeg',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    
    // Try programmatic download
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `${filename}.jpg`;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
    
    console.log(`Download successful: ${filename}`);
    onSuccess?.();
    return true;
  } catch (error) {
    console.error(`Fetch download failed: ${error}`);
  }
  
  // Method 2: Try direct link opening
  try {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.jpg`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log(`Direct link download attempted: ${filename}`);
    onSuccess?.();
    return true;
  } catch (error) {
    console.error(`Direct link download failed: ${error}`);
  }
  
  // Method 3: Fallback to new window
  try {
    const newWindow = window.open(url, '_blank');
    if (newWindow) {
      console.log(`Opened in new window: ${filename}`);
      onSuccess?.();
      return true;
    }
  } catch (error) {
    console.error(`New window fallback failed: ${error}`);
  }
  
  // All methods failed
  const errorMessage = 'Download failed. Please try right-clicking the image and selecting "Save image as..."';
  console.error(`All download methods failed for: ${filename}`);
  onError?.(errorMessage);
  return false;
};

export const downloadMultiplePhotos = async (photos: Array<{ url: string; filename: string }>) => {
  console.log(`Starting batch download of ${photos.length} photos`);
  
  let successCount = 0;
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  
  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i];
    console.log(`Downloading photo ${i + 1}/${photos.length}: ${photo.filename}`);
    
    const success = await downloadPhoto({
      url: photo.url,
      filename: photo.filename,
      onSuccess: () => successCount++
    });
    
    if (success) {
      // Small delay between downloads to prevent browser blocking
      await delay(300);
    }
  }
  
  console.log(`Batch download completed. ${successCount}/${photos.length} successful`);
  return successCount;
};
