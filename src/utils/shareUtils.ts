
export interface SharePlatform {
  name: string;
  url: string;
  icon: 'instagram' | 'snapchat' | 'tiktok' | 'whatsapp' | 'vk';
  storyUrl?: string; // For story sharing
  supportsStories?: boolean;
}

// Detect if user is in Russia based on geolocation
export const getUserLocation = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(false); // Default to non-Russian if geolocation not available
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Russian territory bounds (approximate)
        const isInRussia = 
          latitude >= 41.0 && latitude <= 82.0 &&
          longitude >= 19.0 && longitude <= 170.0;
        resolve(isInRussia);
      },
      () => {
        resolve(false); // Default to non-Russian if geolocation fails
      },
      { timeout: 5000 }
    );
  });
};

export const getSharePlatforms = (): SharePlatform[] => {
  return [
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/',
      storyUrl: 'instagram-stories://share',
      icon: 'instagram',
      supportsStories: true
    },
    {
      name: 'VK',
      url: 'https://vk.com/share.php',
      storyUrl: 'vk://story',
      icon: 'vk',
      supportsStories: true
    }
  ];
};

// Download media and prepare for story sharing
export const downloadMediaForStory = async (url: string, filename: string): Promise<string> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    
    // Create a blob URL for sharing
    const blobUrl = URL.createObjectURL(blob);
    return blobUrl;
  } catch (error) {
    console.error('Error downloading media:', error);
    return url; // Fallback to original URL
  }
};

export const shareToSocialMedia = async (url: string, filename: string) => {
  try {
    const platforms = getSharePlatforms();
    return { platforms, shareData: { url, filename } };
  } catch (error) {
    console.error('Error in shareToSocialMedia:', error);
    return false;
  }
};

// Share to Instagram Stories with proper API integration
const shareToInstagramStory = async (mediaUrl: string, filename: string) => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  if (isMobile) {
    try {
      // For mobile, try to use Instagram's native sharing
      const response = await fetch(mediaUrl);
      const blob = await response.blob();
      const file = new File([blob], filename, { type: blob.type });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Share to Instagram Story',
        });
        return;
      }
    } catch (error) {
      console.error('Native sharing failed:', error);
    }

    // Fallback: Open Instagram app directly to story camera
    const appUrl = isIOS 
      ? 'instagram://story-camera' 
      : 'intent://story-camera#Intent;package=com.instagram.android;scheme=instagram;end';
    
    window.location.href = appUrl;
  } else {
    // Desktop: Download file and open Instagram web
    try {
      const response = await fetch(mediaUrl);
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
    
    window.open('https://www.instagram.com/', '_blank');
  }
};

// Share to VK Stories with proper API integration
const shareToVKStory = async (mediaUrl: string, filename: string) => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  if (isMobile) {
    try {
      // For mobile, try to use VK's native sharing
      const response = await fetch(mediaUrl);
      const blob = await response.blob();
      const file = new File([blob], filename, { type: blob.type });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Share to VK Story',
        });
        return;
      }
    } catch (error) {
      console.error('Native sharing failed:', error);
    }

    // Fallback: Open VK app directly to story camera
    const appUrl = isIOS 
      ? 'vk://story' 
      : 'intent://story#Intent;package=com.vkontakte.android;scheme=vk;end';
    
    window.location.href = appUrl;
  } else {
    // Desktop: Download file and open VK web
    try {
      const response = await fetch(mediaUrl);
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
    
    window.open('https://vk.com/story', '_blank');
  }
};

// Main share function
export const shareToStory = async (platform: SharePlatform, mediaUrl: string, filename: string) => {
  if (platform.name === 'Instagram') {
    await shareToInstagramStory(mediaUrl, filename);
  } else if (platform.name === 'VK') {
    await shareToVKStory(mediaUrl, filename);
  }
};
