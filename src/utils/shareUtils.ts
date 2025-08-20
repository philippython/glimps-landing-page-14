
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

export const getSharePlatforms = (isRussian: boolean): SharePlatform[] => {
  if (isRussian) {
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
        icon: 'vk',
        supportsStories: false
      }
    ];
  }

  return [
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/',
      storyUrl: 'instagram-stories://share',
      icon: 'instagram',
      supportsStories: true
    },
    {
      name: 'Snapchat',
      url: 'https://www.snapchat.com/',
      storyUrl: 'snapchat://camera',
      icon: 'snapchat',
      supportsStories: true
    },
    {
      name: 'TikTok',
      url: 'https://www.tiktok.com/',
      icon: 'tiktok',
      supportsStories: false
    },
    {
      name: 'WhatsApp Status',
      url: 'https://wa.me/',
      storyUrl: 'whatsapp://send',
      icon: 'whatsapp',
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
  // Auto-detect location and handle sharing
  try {
    const isRussian = await getUserLocation();
    const platforms = getSharePlatforms(isRussian);
    
    // Always return platforms for story sharing modal
    return { platforms, shareData: { url, filename } };
  } catch (error) {
    console.error('Error in shareToSocialMedia:', error);
    return false;
  }
};

// Helper function to download media and share to specific platform stories
export const shareToStory = async (platform: SharePlatform, mediaUrl: string, filename: string) => {
  // Download the media first
  try {
    const response = await fetch(mediaUrl);
    const blob = await response.blob();
    
    // Create a temporary link to download the file
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Error downloading media:', error);
  }

  // Then redirect to platform story
  if (!platform.supportsStories || !platform.storyUrl) {
    window.open(platform.url, '_blank');
    return;
  }

  // For Instagram Stories - redirect to story creation
  if (platform.name === 'Instagram') {
    // Try mobile app first
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = 'instagram://story-camera';
      setTimeout(() => {
        window.open('https://www.instagram.com/accounts/login/', '_blank');
      }, 1500);
    } else {
      window.open('https://www.instagram.com/accounts/login/', '_blank');
    }
    return;
  }

  // For Snapchat - redirect to camera
  if (platform.name === 'Snapchat') {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = 'snapchat://camera';
      setTimeout(() => {
        window.open('https://web.snapchat.com/', '_blank');
      }, 1500);
    } else {
      window.open('https://web.snapchat.com/', '_blank');
    }
    return;
  }

  // For TikTok - redirect to upload
  if (platform.name === 'TikTok') {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = 'tiktok://camera';
      setTimeout(() => {
        window.open('https://www.tiktok.com/upload', '_blank');
      }, 1500);
    } else {
      window.open('https://www.tiktok.com/upload', '_blank');
    }
    return;
  }

  // For WhatsApp Status
  if (platform.name === 'WhatsApp Status') {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = 'whatsapp://send';
      setTimeout(() => {
        window.open('https://web.whatsapp.com/', '_blank');
      }, 1500);
    } else {
      window.open('https://web.whatsapp.com/', '_blank');
    }
    return;
  }

  // For VK - redirect to story creation
  if (platform.name === 'VK') {
    window.open('https://vk.com/story', '_blank');
    return;
  }

  // Default fallback
  window.open(platform.url, '_blank');
};
