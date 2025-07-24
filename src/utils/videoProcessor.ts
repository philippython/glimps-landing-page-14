import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;

export const initFFmpeg = async (): Promise<FFmpeg> => {
  if (ffmpeg) return ffmpeg;

  ffmpeg = new FFmpeg();
  
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
  
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  });

  return ffmpeg;
};

export const processVideoForSocialMedia = async (videoUrl: string, filename: string): Promise<Blob> => {
  console.log('Starting video processing for social media compatibility...');
  
  const ffmpeg = await initFFmpeg();
  
  // Fetch the original video
  const videoData = await fetchFile(videoUrl);
  const inputName = 'input.webm';
  const outputName = `${filename}_processed.mp4`;
  
  // Write input file
  await ffmpeg.writeFile(inputName, videoData);
  
  // Convert to MP4 with H.264 codec for maximum compatibility
  // Optimize for WhatsApp: H.264 codec, AAC audio, max 16MB, reasonable resolution
  await ffmpeg.exec([
    '-i', inputName,
    '-c:v', 'libx264',           // H.264 video codec
    '-c:a', 'aac',               // AAC audio codec
    '-preset', 'medium',         // Encoding speed vs compression
    '-crf', '23',                // Quality (lower = better quality)
    '-maxrate', '1M',            // Maximum bitrate for file size control
    '-bufsize', '2M',            // Buffer size
    '-vf', 'scale=720:720:force_original_aspect_ratio=decrease,pad=720:720:(ow-iw)/2:(oh-ih)/2', // Square format for social media
    '-r', '30',                  // Frame rate
    '-t', '10',                  // Limit duration to 10 seconds max
    '-movflags', '+faststart',   // Enable fast start for web
    '-y',                        // Overwrite output file
    outputName
  ]);
  
  // Read the processed file
  const processedData = await ffmpeg.readFile(outputName);
  
  // Clean up
  await ffmpeg.deleteFile(inputName);
  await ffmpeg.deleteFile(outputName);
  
  console.log('Video processing completed successfully');
  
  // Convert Uint8Array to Blob
  return new Blob([processedData], { type: 'video/mp4' });
};

export const getVideoInfo = async (videoUrl: string): Promise<{ duration: number; size: { width: number; height: number } }> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    
    video.onloadedmetadata = () => {
      resolve({
        duration: video.duration,
        size: {
          width: video.videoWidth,
          height: video.videoHeight
        }
      });
    };
    
    video.onerror = () => reject(new Error('Failed to load video metadata'));
    video.src = videoUrl;
  });
};