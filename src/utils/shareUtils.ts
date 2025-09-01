
export interface SharePlatform {
  name: string;
  url: string;
  icon: 'instagram' | 'vk';
}

export const getSharePlatforms = (): SharePlatform[] => {
  return [
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/',
      icon: 'instagram'
    },
    {
      name: 'VK',
      url: 'https://vk.com/',
      icon: 'vk'
    }
  ];
};

// Download media and trigger story sharing
export const shareToStory = async (platform: SharePlatform, mediaUrl: string, filename: string) => {
  try {
    // Download the file first
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

    // Add small delay to ensure download starts
    setTimeout(() => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

      if (platform.name === 'Instagram') {
        if (isMobile) {
          const appUrl = isIOS 
            ? 'instagram://story-camera' 
            : 'intent://story-camera#Intent;package=com.instagram.android;scheme=instagram;end';
          window.location.href = appUrl;
        } else {
          window.open('https://www.instagram.com/stories/create/', '_blank');
        }
      } else if (platform.name === 'VK') {
        if (isMobile) {
          const appUrl = isIOS 
            ? 'vk://story' 
            : 'intent://story#Intent;package=com.vkontakte.android;scheme=vk;end';
          window.location.href = appUrl;
        } else {
          window.open('https://vk.com/stories', '_blank');
        }
      }
    }, 500);

  } catch (error) {
    console.error('Error sharing to story:', error);
    // Fallback: just open the platform
    window.open(platform.url, '_blank');
  }
};
