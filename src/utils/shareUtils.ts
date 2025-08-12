export interface SharePlatform {
  name: string;
  url: string;
  icon: string;
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
        icon: '📷'
      },
      {
        name: 'VK',
        url: 'https://vk.com/',
        icon: '🔵'
      }
    ];
  }

  return [
    {
      name: 'Snapchat',
      url: 'https://www.snapchat.com/',
      icon: '👻'
    },
    {
      name: 'TikTok',
      url: 'https://www.tiktok.com/',
      icon: '🎵'
    },
    {
      name: 'WhatsApp',
      url: 'https://web.whatsapp.com/',
      icon: '💬'
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/',
      icon: '📷'
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