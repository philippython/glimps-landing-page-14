
export interface SharePlatform {
  name: string;
  url: string;
  icon: string;
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
        icon: '📷',
        supportsStories: true
      },
      {
        name: 'VK',
        url: 'https://vk.com/share.php',
        icon: '🔵',
        supportsStories: false
      }
    ];
  }

  return [
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/',
      storyUrl: 'instagram-stories://share',
      icon: '📷',
      supportsStories: true
    },
    {
      name: 'Snapchat',
      url: 'https://www.snapchat.com/',
      storyUrl: 'snapchat://camera',
      icon: '👻',
      supportsStories: true
    },
    {
      name: 'TikTok',
      url: 'https://www.tiktok.com/',
      icon: '🎵',
      supportsStories: false
    },
    {
      name: 'WhatsApp Status',
      url: 'https://wa.me/',
      storyUrl: 'whatsapp://send',
      icon: '💬',
      supportsStories: true
    }
  ];
};

export const shareToSocialMedia = async (url: string, filename: string) => {
  // Auto-detect location and handle sharing
  try {
    const isRussian = await getUserLocation();
    const platforms = getSharePlatforms(isRussian);
    
    // Create share data
    const shareData = {
      title: filename,
      text: `Check out this photo: ${filename}`,
      url: url
    };

    // Try native Web Share API first
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return true;
      } catch (error) {
        console.log('Native share cancelled or failed:', error);
      }
    }

    // Fallback to custom share modal
    return { platforms, shareData };
  } catch (error) {
    console.error('Error in shareToSocialMedia:', error);
    return false;
  }
};

// Helper function to share to specific platform stories
export const shareToStory = (platform: SharePlatform, mediaUrl: string, filename: string) => {
  if (!platform.supportsStories || !platform.storyUrl) {
    // Fallback to regular sharing
    window.open(platform.url, '_blank');
    return;
  }

  // For Instagram Stories
  if (platform.name === 'Instagram') {
    // Try to open Instagram app with story sharing
    const instagramUrl = `${platform.storyUrl}?media=${encodeURIComponent(mediaUrl)}`;
    window.location.href = instagramUrl;
    
    // Fallback to web version after a delay
    setTimeout(() => {
      window.open('https://www.instagram.com/', '_blank');
    }, 1000);
    return;
  }

  // For Snapchat
  if (platform.name === 'Snapchat') {
    window.location.href = platform.storyUrl;
    setTimeout(() => {
      window.open('https://www.snapchat.com/', '_blank');
    }, 1000);
    return;
  }

  // For WhatsApp Status
  if (platform.name === 'WhatsApp Status') {
    const whatsappUrl = `${platform.storyUrl}?text=${encodeURIComponent(`Check out this photo: ${filename} ${mediaUrl}`)}`;
    window.location.href = whatsappUrl;
    setTimeout(() => {
      window.open('https://web.whatsapp.com/', '_blank');
    }, 1000);
    return;
  }

  // Default fallback
  window.open(platform.url, '_blank');
};
