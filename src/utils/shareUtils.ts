
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

  // Wait a moment for download to start
  await new Promise(resolve => setTimeout(resolve, 500));

  // Detect mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);

  // Try to open the appropriate app/website
  if (platform.name === 'Instagram') {
    if (isMobile) {
      // Try to open Instagram app first
      const appUrl = isIOS ? 'instagram://story-camera' : 'intent://story-camera#Intent;package=com.instagram.android;scheme=instagram;end';
      window.open(appUrl, '_self');
      
      // Fallback to web after a delay
      setTimeout(() => {
        window.open('https://www.instagram.com/accounts/login/', '_blank');
      }, 2000);
    } else {
      window.open('https://www.instagram.com/accounts/login/', '_blank');
    }
  } else if (platform.name === 'Snapchat') {
    if (isMobile) {
      const appUrl = isIOS ? 'snapchat://camera' : 'intent://camera#Intent;package=com.snapchat.android;scheme=snapchat;end';
      window.open(appUrl, '_self');
      
      setTimeout(() => {
        window.open('https://web.snapchat.com/', '_blank');
      }, 2000);
    } else {
      window.open('https://web.snapchat.com/', '_blank');
    }
  } else if (platform.name === 'TikTok') {
    if (isMobile) {
      const appUrl = isIOS ? 'tiktok://camera' : 'intent://camera#Intent;package=com.zhiliaoapp.musically;scheme=tiktok;end';
      window.open(appUrl, '_self');
      
      setTimeout(() => {
        window.open('https://www.tiktok.com/upload', '_blank');
      }, 2000);
    } else {
      window.open('https://www.tiktok.com/upload', '_blank');
    }
  } else if (platform.name === 'WhatsApp Status') {
    if (isMobile) {
      const appUrl = isIOS ? 'whatsapp://camera' : 'intent://camera#Intent;package=com.whatsapp;scheme=whatsapp;end';
      window.open(appUrl, '_self');
      
      setTimeout(() => {
        window.open('https://web.whatsapp.com/', '_blank');
      }, 2000);
    } else {
      window.open('https://web.whatsapp.com/', '_blank');
    }
  } else if (platform.name === 'VK') {
    if (isMobile) {
      const appUrl = isIOS ? 'vk://story' : 'intent://story#Intent;package=com.vkontakte.android;scheme=vk;end';
      window.open(appUrl, '_self');
      
      setTimeout(() => {
        window.open('https://vk.com/story', '_blank');
      }, 2000);
    } else {
      window.open('https://vk.com/story', '_blank');
    }
  } else {
    // Default fallback
    window.open(platform.url, '_blank');
  }
};
