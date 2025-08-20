import { Camera, MessageCircle, Music, Video } from "lucide-react";

interface SocialMediaIconProps {
  platform: 'instagram' | 'snapchat' | 'tiktok' | 'whatsapp' | 'vk';
  className?: string;
}

const SocialMediaIcon = ({ platform, className = "w-5 h-5" }: SocialMediaIconProps) => {
  switch (platform) {
    case 'instagram':
      return (
        <div className={`${className} flex items-center justify-center bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-lg text-white`}>
          <Camera className="w-3 h-3" />
        </div>
      );
    
    case 'snapchat':
      return (
        <div className={`${className} flex items-center justify-center bg-yellow-400 rounded-lg text-white`}>
          <svg viewBox="0 0 24 24" className="w-3 h-3" fill="currentColor">
            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.221.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378 0 0-.601 2.301-.747 2.86-.269 1.041-1.046 2.349-1.548 3.146 1.168.36 2.417.552 3.709.552 6.624 0 11.99-5.367 11.99-11.99C24.007 5.367 18.641.001.017 0z"/>
          </svg>
        </div>
      );
    
    case 'tiktok':
      return (
        <div className={`${className} flex items-center justify-center bg-black rounded-lg text-white`}>
          <Music className="w-3 h-3" />
        </div>
      );
    
    case 'whatsapp':
      return (
        <div className={`${className} flex items-center justify-center bg-green-500 rounded-lg text-white`}>
          <MessageCircle className="w-3 h-3" />
        </div>
      );
    
    case 'vk':
      return (
        <div className={`${className} flex items-center justify-center bg-blue-600 rounded-lg text-white`}>
          <svg viewBox="0 0 24 24" className="w-3 h-3" fill="currentColor">
            <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 8.316V8.316C24 1.592 22.408 0 15.684 0zM18.667 16.5h-1.8c-.663 0-.864-.525-2.05-1.713-1.038-1.001-1.488-.14-1.488 1.176 0 .15-.075.3-.45.3-1.95 0-4.125-1.2-5.663-3.45C5.513 9.85 4.8 6.188 6.675 5.625c.563-.15.975.113 1.2.75.338.9.9 2.175 1.35 2.775.15.225.225.15.225-.113 0-.675-.113-2.55.45-2.888.45-.225 1.05.075 1.5 1.2.3.75.675 1.725.9 2.25.15.338.3.15.3-.075 0-1.125.075-2.175.675-2.7.45-.375 1.05-.075 1.35.675.45 1.125.525 2.325.75 3.45.075.45.225.45.375.225.75-.9 1.35-2.25 1.8-3.375.225-.563.675-.675 1.2-.45.675.3.675 1.125.375 1.95-.375 1.05-1.05 2.1-1.65 3.075-.225.375-.075.525.225.825.675.675 1.35 1.35 1.8 2.175.45.825.075 1.35-.525 1.35z"/>
          </svg>
        </div>
      );
    
    default:
      return <Video className={className} />;
  }
};

export default SocialMediaIcon;