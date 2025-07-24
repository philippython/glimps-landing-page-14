
import { toast } from "sonner";
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export interface DownloadOptions {
  url: string;
  filename: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const downloadPhoto = async ({ url, filename, onSuccess, onError }: DownloadOptions) => {
  console.log(`Starting download for: ${filename}`);
  
  try {
    // Use the proxy-image endpoint for direct download
    const apiUrl = import.meta.env.VITE_API_URL;
    const proxyUrl = `${apiUrl}/proxy-image?url=${encodeURIComponent(url)}`;
    
    const response = await fetch(proxyUrl, {
      method: 'GET',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    
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
    console.error(`Download failed: ${error}`);
    const errorMessage = 'Download failed. Please try again.';
    onError?.(errorMessage);
    return false;
  }
};

let ffmpeg: FFmpeg | null = null;

const initFFmpeg = async () => {
  if (ffmpeg) return ffmpeg;
  
  ffmpeg = new FFmpeg();
  
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  });
  
  return ffmpeg;
};

export const downloadVideo = async ({ url, filename, onSuccess, onError }: DownloadOptions) => {
  console.log(`Starting video download for: ${filename}`);
  
  try {
    // Fetch video
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const blob = await response.blob();
    console.log(`Original video type: ${blob.type}, size: ${blob.size} bytes`);
    
    // If it's already MP4, download directly
    if (blob.type.includes('mp4')) {
      console.log('Video is already MP4, downloading directly');
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${filename}.mp4`;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
      onSuccess?.();
      return true;
    }
    
    console.log('Video needs conversion, initializing FFmpeg...');
    
    // Show loading toast
    toast.loading('Converting video for WhatsApp compatibility...', { id: 'video-conversion' });
    
    try {
      // Convert to MP4 using FFmpeg
      const ffmpeg = await initFFmpeg();
      console.log('FFmpeg initialized successfully');
      
      // Write input file
      await ffmpeg.writeFile('input.webm', await fetchFile(blob));
      console.log('Input file written to FFmpeg');
      
      // Convert to MP4 with WhatsApp-compatible settings
      console.log('Starting video conversion...');
      await ffmpeg.exec([
        '-i', 'input.webm',
        '-c:v', 'libx264',
        '-c:a', 'aac',
        '-preset', 'fast',
        '-crf', '23',
        '-movflags', '+faststart',
        'output.mp4'
      ]);
      console.log('Video conversion completed');
      
      // Read the output
      const data = await ffmpeg.readFile('output.mp4');
      const mp4Blob = new Blob([data], { type: 'video/mp4' });
      console.log(`Converted MP4 size: ${mp4Blob.size} bytes`);
      
      // Dismiss loading toast
      toast.dismiss('video-conversion');
      
      // Download the converted MP4
      const blobUrl = window.URL.createObjectURL(mp4Blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${filename}.mp4`;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
      
      console.log(`Video conversion and download successful: ${filename}.mp4`);
      onSuccess?.();
      return true;
      
    } catch (conversionError) {
      console.error('FFmpeg conversion failed:', conversionError);
      toast.dismiss('video-conversion');
      
      // Fallback: inform user that conversion failed
      const errorMessage = 'Video conversion failed. The original format may not be compatible with WhatsApp.';
      onError?.(errorMessage);
      return false;
    }
    
  } catch (error) {
    console.error(`Video download failed: ${error}`);
    toast.dismiss('video-conversion');
    const errorMessage = 'Video download failed. Please try again.';
    onError?.(errorMessage);
    return false;
  }
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
      await delay(500);
    }
  }
  
  console.log(`Batch download completed. ${successCount}/${photos.length} successful`);
  return successCount;
};
